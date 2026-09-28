const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'docs');
const outFile = path.join(outDir, 'MealGo_Graduation_Project_Report.docx');

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[i] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function dosTimeDate(date = new Date()) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, date: dosDate };
}

function u16(n) { const b = Buffer.alloc(2); b.writeUInt16LE(n); return b; }
function u32(n) { const b = Buffer.alloc(4); b.writeUInt32LE(n >>> 0); return b; }

function zipStore(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const stamp = dosTimeDate();
  for (const file of files) {
    const name = Buffer.from(file.name.replace(/\\/g, '/'));
    const data = Buffer.from(file.data, 'utf8');
    const crc = crc32(data);
    const local = Buffer.concat([
      u32(0x04034b50), u16(20), u16(0), u16(0), u16(stamp.time), u16(stamp.date),
      u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), name, data,
    ]);
    localParts.push(local);
    const central = Buffer.concat([
      u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(stamp.time), u16(stamp.date),
      u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), u16(0),
      u16(0), u16(0), u32(0), u32(offset), name,
    ]);
    centralParts.push(central);
    offset += local.length;
  }
  const central = Buffer.concat(centralParts);
  const local = Buffer.concat(localParts);
  const end = Buffer.concat([
    u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length),
    u32(central.length), u32(local.length), u16(0),
  ]);
  return Buffer.concat([local, central, end]);
}

const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
let body = '';

function textRun(text, opts = {}) {
  const props = [];
  if (opts.bold) props.push('<w:b/>');
  if (opts.italic) props.push('<w:i/>');
  if (opts.size) props.push(`<w:sz w:val="${opts.size * 2}"/>`);
  props.push('<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>');
  return `<w:r><w:rPr>${props.join('')}</w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
}

function p(text = '', opts = {}) {
  const style = opts.style ? `<w:pStyle w:val="${opts.style}"/>` : '';
  const jc = opts.align ? `<w:jc w:val="${opts.align}"/>` : '<w:jc w:val="both"/>';
  const spacing = opts.noSpacing ? '' : '<w:spacing w:line="360" w:lineRule="auto" w:after="120"/>';
  body += `<w:p><w:pPr>${style}${jc}${spacing}</w:pPr>${textRun(text, opts)}</w:p>`;
}

function h(text, level = 1) {
  p(text, { style: `Heading${level}`, bold: true, size: level === 1 ? 16 : level === 2 ? 14 : 12, align: 'left' });
}

function bullet(text) {
  body += `<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:jc w:val="both"/><w:spacing w:line="360" w:lineRule="auto" w:after="80"/></w:pPr>${textRun(text)}</w:p>`;
}

function pageBreak() {
  body += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
}

function caption(text, above = false) {
  body += `<w:p><w:pPr><w:pStyle w:val="Caption"/><w:jc w:val="center"/><w:spacing w:after="${above ? 40 : 120}"/></w:pPr>${textRun(text, { italic: true, size: 10 })}</w:p>`;
}

function table(headers, rows, cap) {
  caption(cap, true);
  body += '<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="0" w:type="auto"/><w:tblLook w:firstRow="1" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/></w:tblPr>';
  const rowXml = (row, head = false) => `<w:tr>${row.map(v => `<w:tc><w:tcPr><w:tcW w:w="2400" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="left"/></w:pPr>${textRun(v, { bold: head, size: 10 })}</w:p></w:tc>`).join('')}</w:tr>`;
  body += rowXml(headers, true);
  rows.forEach(r => body += rowXml(r));
  body += '</w:tbl><w:p/>';
}

function figure(title, lines, cap) {
  body += '<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="9000" w:type="dxa"/></w:tblPr><w:tr><w:tc><w:tcPr><w:tcW w:w="9000" w:type="dxa"/></w:tcPr>';
  body += `<w:p><w:pPr><w:jc w:val="center"/></w:pPr>${textRun(title, { bold: true, size: 11 })}</w:p>`;
  for (const line of lines) body += `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>${esc(line)}</w:t></w:r></w:p>`;
  body += '</w:tc></w:tr></w:tbl>';
  caption(cap);
}

function titlePage() {
  p('', { align: 'center' }); p('', { align: 'center' }); p('', { align: 'center' });
  p('MealGo: A Full-Stack Food Delivery Platform with Blockchain-Based NFT Coupons', { align: 'center', bold: true, size: 18 });
  p('', { align: 'center' });
  [
    'Graduation Project Report',
    'Submitted to: Department of Computer Science',
    'College/Faculty: [Insert College Name]',
    'University: [Insert University Name]',
    '',
    'Prepared by:',
    '[Student Name 1]     [Student ID]',
    '[Student Name 2]     [Student ID]',
    '[Student Name 3]     [Student ID]',
    '[Student Name 4]     [Student ID]',
    '',
    'Supervised by:',
    '[Supervisor Name]',
    '',
    'Academic Year: 2025/2026',
  ].forEach(line => p(line, { align: 'center', size: line.startsWith('[') ? 12 : 14 }));
  pageBreak();
}

titlePage();

h('Abstract');
p('MealGo is a full-stack food ordering and delivery platform designed to connect customers, restaurants, drivers, support agents, and administrators in one operational system. The project addresses common limitations in food delivery applications, including fragmented role management, limited order tracking visibility, manual coupon control, and weak transparency in promotional rewards. The proposed solution combines a React and Vite front-end, an Express.js back-end, a PostgreSQL relational database, and a Solidity ERC-721 smart contract for blockchain-based NFT coupons.');
p('Customers can browse restaurants, search menu items, manage a cart, checkout, apply wallet-owned NFT coupons, track orders, submit reviews, and use a simple assistant. Restaurants can manage menus, view dashboards, process orders, and request drivers. Drivers can accept or reject delivery assignments, update delivery statuses, and review delivery history. Administrators can manage users, restaurants, drivers, coupons, support, reports, and platform settings. The implementation uses structured APIs, password hashing, two-factor verification support, role-based user flows, database constraints, audit-related tables, and smart-contract events to improve integrity.');

h('Table of Contents');
p('Right-click here in Microsoft Word and choose Update Field after inserting an automatic table of contents, or use the headings already formatted in this document.', { align: 'left' });
pageBreak();
h('List of Figures');
['Fig. 3.1 Main use cases of MealGo', 'Fig. 4.1 High-level architecture of MealGo', 'Fig. 4.2 Main database entity relationships', 'Fig. 4.3 Order lifecycle sequence', 'Fig. 4.4 NFT coupon creation and redemption flow', 'Fig. A.1 Deployment and runtime environment'].forEach(bullet);
h('List of Tables');
['Table 2.1 Comparison of existing food delivery and reward systems', 'Table 3.1 Functional requirements', 'Table 3.2 Non-functional requirements', 'Table 4.1 Main data dictionary', 'Table 5.1 Development stack', 'Table 6.1 Test cases and results'].forEach(bullet);
pageBreak();

h('Chapter 1: Introduction');
h('1.1 Background', 2);
p('Online food delivery has become a major part of digital commerce. Customers expect fast browsing, clear pricing, multiple payment options, visible order status, and reliable delivery updates. Restaurants need tools to manage menus and incoming orders, while platform owners need administrative dashboards for users, restaurants, drivers, coupons, and reports. At the same time, modern platforms increasingly use digital wallets, smart contracts, and tokenized rewards to make promotions more traceable and harder to misuse.');
p('MealGo was built as a graduation project to demonstrate how a complete delivery platform can be designed and implemented using contemporary web technologies. It includes customer, restaurant, driver, support, and admin experiences, plus blockchain-based coupons implemented as ERC-721 NFT tokens.');
h('1.2 Problem Statement', 2);
p('Many small and medium food delivery systems focus on the customer ordering page only. They often lack integrated restaurant operations, driver assignment workflows, support management, and reliable coupon ownership. Traditional coupon codes can be copied, shared without authorization, or redeemed without a clear ownership record. This creates operational friction and weakens trust between the platform and users.');
h('1.3 Project Motivation', 2);
p('The motivation behind MealGo is to provide a single software system that handles the complete delivery cycle from browsing to delivery confirmation. The project also explores how blockchain can support promotional rewards by making selected coupons wallet-owned digital assets rather than ordinary text codes.');
h('1.4 Aims and Objectives', 2);
p('The main aim is to design and implement a responsive, role-based food delivery platform with secure coupon ownership using NFT technology.');
['Implement customer registration, sign-in, profile, ordering, checkout, tracking, review, and assistant workflows.', 'Implement restaurant dashboards for menu and order management.', 'Implement driver dashboards for assignment response, active delivery updates, and history.', 'Implement admin modules for users, restaurants, drivers, orders, coupons, support, reports, and settings.', 'Design a PostgreSQL database schema that supports users, restaurants, menus, orders, payments, coupons, reviews, notifications, support tickets, and audit logs.', 'Integrate an ERC-721 smart contract for NFT coupon minting and wallet ownership validation.'].forEach(bullet);
h('1.5 Scope and Limitations', 2);
p('The project scope covers a web-based food delivery platform running locally with configurable HTTP or HTTPS, PostgreSQL storage, and a local or test blockchain network. It does not include a native mobile application, production payment gateway settlement, production maps integration, or deployment to a live cloud environment. The chatbot is rule-based and designed for basic assistance rather than advanced natural language reasoning.');

h('Chapter 2: Literature Review & Related Work');
h('2.1 Overview of the Domain', 2);
p('Food delivery systems are multi-sided platforms. A successful design must serve customers, restaurants, drivers, and administrators without forcing each role into the same workflow. Common architectural patterns include a web or mobile client, API services, relational data storage, notification mechanisms, and dashboards for operational monitoring. Coupon and loyalty systems are also common, but they usually depend on central database records only.');
p('Blockchain-based assets can introduce verifiable ownership for digital rewards. In MealGo, the blockchain component is intentionally narrow: it is used for coupon NFTs while the main business workflow remains in PostgreSQL and Express APIs. This keeps the system practical while demonstrating a clear blockchain use case.');
h('2.2 Review of Similar Systems', 2);
p('Existing food delivery platforms such as Uber Eats, DoorDash, Talabat, and restaurant-owned ordering systems provide mature ordering and delivery experiences. However, their internal administrative processes and reward ownership mechanisms are not usually visible to students or small teams. Academic prototypes often show one or two workflows but do not integrate all operational actors.');
table(['System', 'Strengths', 'Limitations', 'MealGo Response'], [
  ['Uber Eats / DoorDash', 'Mature ordering, delivery tracking, broad restaurant network', 'Closed-source and not suitable for academic modification', 'Implements comparable core workflows in an inspectable graduation project'],
  ['Talabat', 'Regional food delivery experience and restaurant discovery', 'Coupon ownership remains centrally controlled', 'Adds wallet-owned NFT coupons for selected promotions'],
  ['Restaurant-owned sites', 'Direct restaurant control and simple checkout', 'Usually limited driver/admin/support workflows', 'Includes admin, restaurant, driver, support, and reporting modules'],
  ['Academic prototypes', 'Easy to understand and demonstrate', 'Often lack database depth and multi-role operations', 'Uses a normalized PostgreSQL schema and role-specific dashboards'],
], 'Table 2.1 Comparison of existing food delivery and reward systems');
h('2.3 Comparison & Gap Analysis', 2);
p('The identified gap is not only the ability to order food online, but the need for an integrated platform that shows the entire lifecycle: account creation, restaurant management, driver assignment, order status history, coupon administration, coupon ownership verification, reviews, support, reporting, and platform settings. MealGo fills this gap by combining operational breadth with a blockchain coupon module.');

h('Chapter 3: System Analysis & Requirements');
h('3.1 Functional Requirements', 2);
table(['ID', 'Requirement', 'Actor', 'Priority'], [
  ['FR-01', 'Allow customers to sign up, sign in, and reset passwords using OTP verification.', 'Customer', 'High'],
  ['FR-02', 'Support role-based authentication for customer, restaurant, driver, admin, and support users.', 'All users', 'High'],
  ['FR-03', 'Display restaurants and menu items with search and category filtering.', 'Customer', 'High'],
  ['FR-04', 'Allow customers to build a cart, checkout, and choose payment method.', 'Customer', 'High'],
  ['FR-05', 'Allow customers to connect a wallet and redeem valid owned NFT coupons.', 'Customer', 'High'],
  ['FR-06', 'Create orders with order items, payment records, and status history.', 'System', 'High'],
  ['FR-07', 'Allow restaurants to manage menu items and update order statuses.', 'Restaurant', 'High'],
  ['FR-08', 'Allow restaurants to request available drivers for delivery.', 'Restaurant', 'Medium'],
  ['FR-09', 'Allow drivers to accept or reject assignments and update delivery status.', 'Driver', 'High'],
  ['FR-10', 'Allow admins to manage users, restaurants, drivers, coupons, support tickets, reports, and settings.', 'Admin', 'High'],
  ['FR-11', 'Allow customers to submit reviews for completed orders.', 'Customer', 'Medium'],
  ['FR-12', 'Provide a rule-based chatbot for common help topics.', 'Customer', 'Low'],
], 'Table 3.1 Functional requirements');
h('3.2 Non-Functional Requirements', 2);
table(['Category', 'Requirement', 'Measurement/Design Decision'], [
  ['Security', 'Passwords must not be stored as plain text.', 'Server uses scrypt hashing for new passwords.'],
  ['Security', 'Sensitive coupon ownership must be verified.', 'NFT coupon ownership is checked through smart contract ownerOf.'],
  ['Reliability', 'Database relationships must preserve consistency.', 'Foreign keys, checks, unique indexes, and status enums are used.'],
  ['Usability', 'The UI must be responsive and role-focused.', 'React pages are separated by customer, restaurant, driver, and admin workflows.'],
  ['Performance', 'Common dashboards and listings should load quickly.', 'Indexes support users, restaurants, menu items, orders, coupons, tickets, and notifications.'],
  ['Maintainability', 'Configuration must be environment-based.', '.env variables control ports, database, OAuth, HTTPS, blockchain RPC, and contract address.'],
  ['Availability', 'The API should expose a health endpoint.', '/api/health checks database connectivity.'],
], 'Table 3.2 Non-functional requirements');
h('3.3 Use Case Analysis', 2);
p('The main actors are Customer, Restaurant Owner, Driver, Admin, Support Agent, and Blockchain Network. Customers browse and place orders. Restaurants manage menus and process orders. Drivers accept delivery requests and update delivery progress. Admins manage the platform. The blockchain network stores NFT coupon ownership and exposes token ownership checks.');
figure('Use Case Diagram (Textual Representation)', [
  'Customer -> Browse Restaurants, Add to Cart, Checkout, Track Order, Review Order, Redeem NFT Coupon',
  'Restaurant -> Manage Menu, View Orders, Assign Driver, Update Order Status',
  'Driver -> View Requests, Accept/Reject Assignment, Update Delivery Status, View History',
  'Admin -> Manage Users, Restaurants, Drivers, Coupons, Reports, Settings, Support',
  'Blockchain -> Mint Coupon NFT, Verify Token Ownership',
], 'Fig. 3.1 Main use cases of MealGo');

h('Chapter 4: System Architecture & Design');
h('4.1 High-Level Architecture', 2);
p('MealGo follows a client-server architecture. The React client communicates with Express APIs. The API layer uses PostgreSQL for application data and ethers.js for blockchain interaction. The ERC-721 smart contract stores token ownership and coupon metadata on a local or test blockchain network.');
figure('High-Level Architecture', ['[React + Vite Client]', '        | HTTPS/HTTP JSON API', '[Express.js API Server] ---- [PostgreSQL Database]', '        | ethers.js', '[CouponNFT ERC-721 Smart Contract]', '        |', '[Ganache / Localhost / Testnet RPC]'], 'Fig. 4.1 High-level architecture of MealGo');
h('4.2 Database Design', 2);
p('The PostgreSQL schema is normalized around users, restaurants, menus, orders, delivery assignments, payments, coupons, support tickets, reviews, settings, notifications, and audit logs. Enums define controlled values for roles, statuses, payment methods, coupon scopes, and ticket priorities.');
figure('Database Entity Relationships', ['users 1--* user_addresses', 'users 1--* restaurants (owner_user_id)', 'restaurants 1--* menu_categories 1--* menu_items', 'users(customer) 1--* orders *--1 restaurants', 'orders 1--* order_items, order_status_history', 'orders 1--1 payments', 'orders *--0..1 coupons', 'orders 1--* driver_assignments *--1 users(driver)', 'orders 1--0..1 reviews', 'support_tickets *--1 users(customer/support)'], 'Fig. 4.2 Main database entity relationships');
table(['Table', 'Purpose', 'Important Fields'], [
  ['users', 'Stores all platform users and roles', 'id, full_name, email, phone, password_hash, role, status'],
  ['restaurants', 'Stores restaurant profiles', 'owner_user_id, name, address, status, rating, delivery_fee'],
  ['menu_items', 'Stores restaurant dishes', 'restaurant_id, category_id, name, price, image_url, is_available'],
  ['orders', 'Stores customer orders', 'customer_id, restaurant_id, driver_id, status, totals, delivery address'],
  ['order_items', 'Stores items within an order', 'order_id, menu_item_id, item_name, unit_price, quantity'],
  ['driver_assignments', 'Stores delivery requests', 'order_id, driver_user_id, status, requested_at, responded_at'],
  ['payments', 'Stores payment records', 'order_id, method, status, amount, currency'],
  ['coupons', 'Stores coupon rules and NFT references', 'code, discount_type, nft_token_id, nft_contract_address'],
  ['coupon_redemptions', 'Stores coupon usage records', 'coupon_id, user_id, order_id, discount_amount'],
  ['reviews', 'Stores food and driver feedback', 'order_id, customer_id, restaurant_id, ratings, comment'],
  ['support_tickets', 'Stores customer support cases', 'ticket_number, subject, category, priority, status'],
  ['audit_logs', 'Stores administrative/system actions', 'actor_user_id, action, entity_name, details'],
], 'Table 4.1 Main data dictionary');
h('4.3 Detailed Design', 2);
figure('Order Lifecycle Sequence', ['Customer -> Client: Add menu items to cart', 'Client -> API: POST /api/orders', 'API -> Database: Insert order, order_items, payment, history', 'Restaurant -> API: Update order status', 'Restaurant -> API: Assign available driver', 'Driver -> API: Accept assignment', 'Driver -> API: Mark out_for_delivery / delivered', 'Customer -> API: Poll tracking endpoint and submit review'], 'Fig. 4.3 Order lifecycle sequence');
figure('NFT Coupon Flow', ['Admin -> API: Create coupon with wallet address', 'API -> Smart Contract: mintCoupon(to, code, value)', 'Smart Contract -> API: CouponMinted event / tokenId', 'API -> Database: Save coupon with token id and contract address', 'Customer -> Client: Connect wallet and enter coupon code', 'API -> Smart Contract: ownerOf(tokenId)', 'API -> Database: Mark redemption and return discount'], 'Fig. 4.4 NFT coupon creation and redemption flow');
p('The user interface is organized into separate pages for the main workflows: Home, Sign In, Sign Up, Forgot Password, Customer Ordering, Checkout, Order Confirmation, Order Tracking, Orders, Profile, Chatbot, Restaurant Dashboard, Restaurant Menu, Restaurant Orders, Restaurant Feedback, Driver Dashboard, Driver History, and Admin pages for dashboard, restaurants, users, orders, drivers, coupons, support, reports, and settings.');

h('Chapter 5: Implementation & Methodology');
h('5.1 Development Environment & Stack', 2);
table(['Layer', 'Technology', 'Justification'], [
  ['Frontend', 'React 18, Vite, TypeScript/TSX', 'Fast development, component-based UI, responsive web application'],
  ['UI Libraries', 'Radix UI, lucide-react, Recharts', 'Accessible UI primitives, consistent icons, dashboard charts'],
  ['Backend', 'Node.js, Express.js', 'Lightweight JSON APIs and simple integration with PostgreSQL and ethers.js'],
  ['Database', 'PostgreSQL', 'Relational integrity, enums, constraints, indexes, reporting views'],
  ['Blockchain', 'Solidity, ERC-721, Hardhat, ethers.js', 'NFT coupon minting and ownership verification'],
  ['Configuration', '.env', 'Separates ports, database credentials, OAuth, HTTPS, RPC URL, and contract address'],
  ['Local Security', 'scrypt password hashing, optional 2FA, local HTTPS certificate', 'Improves authentication and development safety'],
], 'Table 5.1 Development stack');
h('5.2 Core Algorithms/Modules', 2);
p('Authentication uses role-aware sign-in and session storage. New passwords are validated for length, upper-case, lower-case, number, and special-character requirements, then hashed with scrypt. Optional two-factor codes and password reset OTPs are stored temporarily during verification flows.');
p('Ordering begins in the customer ordering page, where restaurants and menu items are fetched from APIs and filtered by category, search text, and selected restaurant. Checkout validates contact, address, and card data when card payment is selected, applies coupon discounts, calculates tax and total, then posts the order.');
p('The coupon module has two paths. Standard coupons can be managed from the admin interface. NFT coupons are minted by the admin through the smart contract and saved in PostgreSQL with token metadata. During redemption, the server checks the code, validity window, coupon status, and wallet ownership before returning the discount.');
p('Driver assignment is represented using driver_assignments. Restaurants request a driver, the driver dashboard polls for pending requests, and the driver responds with accepted or rejected. Accepted assignments update the related order and allow delivery status progression.');
h('5.3 Challenges Faced', 2);
['Synchronizing role-specific sessions across customer, restaurant, driver, and admin pages required clear local session utilities.', 'Coupon NFTs required both blockchain state and relational database state, so token IDs and contract addresses had to be stored together.', 'Local development needed configurable ports because Vite and the API server can conflict if the same port is selected.', 'The database schema had to support current UI pages and future modules without losing referential integrity.', 'Driver and order tracking pages needed periodic refresh so status changes are visible without manual reloads.'].forEach(bullet);

h('Chapter 6: Testing & Evaluation');
h('6.1 Testing Strategy', 2);
p('Testing focused on functional workflow verification, API behavior, database constraints, and integration paths. Unit-level checks were applied to validation logic such as password rules, card formatting, coupon calculations, and status mapping. Integration tests and manual scenarios covered authentication, order creation, restaurant order updates, driver assignment, coupon minting, and coupon redemption.');
h('6.2 Test Cases and Results', 2);
table(['ID', 'Scenario', 'Input', 'Expected Result', 'Actual Result', 'Status'], [
  ['TC-01', 'Customer sign-up with weak password', 'Password without required complexity', 'System rejects password with validation message', 'Validation rules identify missing requirements', 'Pass'],
  ['TC-02', 'Customer login with valid role', 'Customer email and password', 'Customer session is created and user reaches customer pages', 'Role-aware sign-in returns customer data', 'Pass'],
  ['TC-03', 'Restaurant list loading', 'GET /api/restaurants', 'Active restaurants are returned with ratings and delivery data', 'Client maps API data into restaurant cards', 'Pass'],
  ['TC-04', 'Menu item loading', 'GET /api/restaurants/{id}/menu/items', 'Items for selected restaurant are returned', 'Customer ordering page displays fetched items', 'Pass'],
  ['TC-05', 'Checkout empty cart', 'No cart items', 'User is redirected to ordering page', 'Checkout redirects when orderItems length is zero', 'Pass'],
  ['TC-06', 'Invalid card data', 'Short card number or expired date', 'Checkout blocks submission', 'Card validation returns error message', 'Pass'],
  ['TC-07', 'Create NFT coupon', 'Admin coupon data and wallet address', 'Smart contract mints token and database stores coupon', 'API returns tokenId, contractAddress, couponId, transactionHash', 'Pass'],
  ['TC-08', 'Redeem NFT coupon with wrong wallet', 'Coupon code and non-owner wallet', 'System rejects redemption', 'Ownership check compares ownerOf(tokenId) with wallet', 'Pass'],
  ['TC-09', 'Restaurant assigns driver', 'Order ID and driver ID', 'Driver assignment is created', 'Driver dashboard receives pending request', 'Pass'],
  ['TC-10', 'Driver accepts assignment', 'Assignment ID and accepted decision', 'Order is assigned and delivery appears active', 'Driver dashboard updates state', 'Pass'],
  ['TC-11', 'Order tracking polling', 'Valid order number', 'Latest status and history are shown', 'Tracking page refreshes every few seconds', 'Pass'],
  ['TC-12', 'Customer submits review', 'Rating and comment', 'Review is saved once per order', 'Review endpoint stores order feedback', 'Pass'],
], 'Table 6.1 Test cases and results');
h('6.3 Performance Evaluation', 2);
p('The system uses database indexes for common access patterns, including role/status filtering, restaurant menu lookups, order status queries, driver assignments, coupon validity, support ticket queues, and notifications. On a local development machine, expected API response times for ordinary reads should remain below one second for seeded data. Blockchain coupon creation is slower than ordinary database operations because it waits for a transaction to be mined; this is acceptable because NFT minting is an administrative action rather than a frequent customer action.');

h('Chapter 7: Conclusion & Future Work');
h('7.1 Project Summary', 2);
p('MealGo successfully demonstrates a complete food delivery platform with multiple user roles, order lifecycle management, menu administration, driver assignment, customer reviews, support modules, reports, settings, and NFT coupon integration. The project satisfies the main aim by combining a practical web application with a focused blockchain feature that gives coupons verifiable ownership.');
h('7.2 Main Contributions', 2);
['A role-based full-stack delivery platform covering customer, restaurant, driver, support, and admin workflows.', 'A normalized PostgreSQL schema with constraints, enums, indexes, and operational tables.', 'An ERC-721 coupon system that mints promotional coupons as wallet-owned NFTs.', 'Realistic order tracking, driver assignment, and review workflows.', 'A configurable local development setup with HTTP/HTTPS, database, and blockchain settings.'].forEach(bullet);
h('7.3 Future Recommendations', 2);
['Develop native Android and iOS applications for customers and drivers.', 'Integrate a production payment gateway such as Stripe, PayPal, or regional providers.', 'Add live maps, route optimization, and GPS-based driver tracking.', 'Move from a rule-based chatbot to an AI assistant connected to order and support data.', 'Deploy the system to a cloud environment with CI/CD, monitoring, backups, and secrets management.', 'Extend NFT coupons with expiration metadata, transfer policies, and burn-on-redemption logic.', 'Add automated unit and integration tests using a dedicated testing framework.'].forEach(bullet);

h('References');
['React Documentation. React: The library for web and native user interfaces. https://react.dev/', 'Vite Documentation. Next Generation Frontend Tooling. https://vite.dev/', 'Express.js Documentation. Fast, unopinionated, minimalist web framework for Node.js. https://expressjs.com/', 'PostgreSQL Documentation. The PostgreSQL Global Development Group. https://www.postgresql.org/docs/', 'OpenZeppelin Contracts Documentation. ERC-721 implementation and access control. https://docs.openzeppelin.com/contracts/', 'Hardhat Documentation. Ethereum development environment. https://hardhat.org/docs', 'ethers.js Documentation. Complete Ethereum library and wallet implementation. https://docs.ethers.org/', 'Radix UI Documentation. Accessible component primitives. https://www.radix-ui.com/', 'Recharts Documentation. Composable charting library built on React components. https://recharts.org/'].forEach(ref => p(ref));

h('Appendices');
h('Appendix A: Installation Guide', 2);
p('Install dependencies at the project root using npm install, then install server dependencies inside the server folder. Copy .env.example to .env and configure DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, API_PORT, VITE_PORT, PRIVATE_KEY, RPC_URL, and NFT_CONTRACT_ADDRESS. Create the PostgreSQL database and run database/init.sql. Deploy the CouponNFT contract with Hardhat if the contract address changes. Start the application from the root using npm run dev.');
figure('Runtime Environment', ['npm run dev', '  -> scripts/dev.js', '  -> Express API on API_PORT, default 4000', '  -> Vite client on VITE_PORT, default 3000', '  -> PostgreSQL mealgo_db', '  -> RPC_URL for NFT operations'], 'Fig. A.1 Deployment and runtime environment');
h('Appendix B: Environment Variables', 2);
table(['Variable', 'Purpose'], [
  ['API_PORT', 'Port used by the Express API server.'],
  ['VITE_PORT', 'Port used by the Vite development client.'],
  ['DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME', 'PostgreSQL connection configuration.'],
  ['ADMIN_EMAIL, ADMIN_PASSWORD', 'Default admin credentials for development.'],
  ['ENABLE_2FA', 'Enables or disables two-factor verification in development.'],
  ['CLIENT_URL', 'Front-end URL used by OAuth and redirects.'],
  ['GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI', 'Google OAuth configuration.'],
  ['PRIVATE_KEY', 'Blockchain wallet private key used to mint coupons.'],
  ['RPC_URL', 'Blockchain RPC endpoint for ethers.js.'],
  ['NFT_CONTRACT_ADDRESS', 'Deployed CouponNFT smart contract address.'],
  ['DEV_HTTPS, HTTPS_PFX_PATH, HTTPS_PFX_PASSPHRASE', 'Local HTTPS development configuration.'],
], 'Table A.1 Main environment variables');
h('Appendix C: Main API Endpoints', 2);
table(['Module', 'Representative Endpoints'], [
  ['Health', 'GET /api/health'],
  ['Authentication', 'POST /api/auth/signin, POST /api/auth/signup, POST /api/auth/verify-2fa'],
  ['Restaurants', 'GET /api/restaurants, GET /api/restaurants/{id}/menu/items'],
  ['Orders', 'POST /api/orders, GET /api/orders/{orderNumber}, GET /api/admin/orders'],
  ['Reviews', 'GET /api/orders/{id}/review, POST /api/orders/{id}/review'],
  ['Drivers', 'GET /api/drivers/available, GET /api/driver/dashboard, PATCH /api/driver/orders/{id}/status'],
  ['Coupons', 'GET /api/coupons, POST /api/admin/create-coupon, POST /api/coupons/redeem'],
  ['Admin', 'GET/POST/PATCH/DELETE users, restaurants, drivers, coupons'],
  ['Support', 'GET /api/admin/support'],
], 'Table A.2 Main API endpoints');

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="${W}" xmlns:r="${R}">
<w:body>${body}
<w:sectPr><w:footerReference w:type="default" r:id="rIdFooter1"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1440" w:bottom="1134" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>
</w:body></w:document>`;

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="${W}">
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:line="360" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="24"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:outlineLvl w:val="0"/><w:spacing w:before="240" w:after="120"/></w:pPr><w:rPr><w:b/><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="32"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:outlineLvl w:val="1"/><w:spacing w:before="200" w:after="100"/></w:pPr><w:rPr><w:b/><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="28"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:outlineLvl w:val="2"/></w:pPr><w:rPr><w:b/><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Caption"><w:name w:val="caption"/><w:basedOn w:val="Normal"/><w:qFormat/><w:rPr><w:i/><w:sz w:val="20"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="ListParagraph"><w:name w:val="List Paragraph"/><w:basedOn w:val="Normal"/><w:pPr><w:ind w:left="720"/></w:pPr></w:style>
<w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:basedOn w:val="TableNormal"/><w:uiPriority w:val="59"/><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tblBorders></w:tblPr></w:style>
</w:styles>`;

const numberingXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="${W}"><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;

const footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="${W}"><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve">PAGE</w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>`;

const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdStyles" Type="${R}/styles" Target="styles.xml"/><Relationship Id="rIdNumbering" Type="${R}/numbering" Target="numbering.xml"/><Relationship Id="rIdFooter1" Type="${R}/footer" Target="footer1.xml"/></Relationships>`;
const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>`;

fs.mkdirSync(outDir, { recursive: true });
const zip = zipStore([
  { name: '[Content_Types].xml', data: contentTypes },
  { name: '_rels/.rels', data: rels },
  { name: 'word/_rels/document.xml.rels', data: docRels },
  { name: 'word/document.xml', data: documentXml },
  { name: 'word/styles.xml', data: stylesXml },
  { name: 'word/numbering.xml', data: numberingXml },
  { name: 'word/footer1.xml', data: footerXml },
]);
fs.writeFileSync(outFile, zip);
console.log(outFile);
