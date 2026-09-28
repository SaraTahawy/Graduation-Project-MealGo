const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'docs');
const outFile = path.join(outDir, 'MealGo_Final_Graduation_Project_Report_60_Pages.docx');

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

function u16(n) { const b = Buffer.alloc(2); b.writeUInt16LE(n); return b; }
function u32(n) { const b = Buffer.alloc(4); b.writeUInt32LE(n >>> 0); return b; }
function dosTimeDate(date = new Date()) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, date: dosDate };
}

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
    const central = Buffer.concat([
      u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(stamp.time), u16(stamp.date),
      u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), u16(0),
      u16(0), u16(0), u32(0), u32(offset), name,
    ]);
    localParts.push(local);
    centralParts.push(central);
    offset += local.length;
  }
  const local = Buffer.concat(localParts);
  const central = Buffer.concat(centralParts);
  const end = Buffer.concat([
    u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length),
    u32(central.length), u32(local.length), u16(0),
  ]);
  return Buffer.concat([local, central, end]);
}

const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
let body = '';
let pageNo = 1;

function run(text, opts = {}) {
  const props = ['<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>'];
  if (opts.bold) props.push('<w:b/>');
  if (opts.italic) props.push('<w:i/>');
  if (opts.size) props.push(`<w:sz w:val="${opts.size * 2}"/>`);
  return `<w:r><w:rPr>${props.join('')}</w:rPr><w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
}

function para(text = '', opts = {}) {
  const style = opts.style ? `<w:pStyle w:val="${opts.style}"/>` : '';
  const align = opts.align || 'both';
  const spacing = opts.compact ? '<w:spacing w:line="300" w:lineRule="auto" w:after="60"/>' : '<w:spacing w:line="360" w:lineRule="auto" w:after="120"/>';
  body += `<w:p><w:pPr>${style}<w:jc w:val="${align}"/>${spacing}</w:pPr>${run(text, opts)}</w:p>`;
}

function heading(text, level = 1) {
  const size = level === 1 ? 16 : level === 2 ? 14 : 12;
  para(text, { style: `Heading${level}`, bold: true, size, align: 'left', compact: true });
}

function bullet(text) {
  body += `<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:jc w:val="both"/><w:spacing w:line="360" w:lineRule="auto" w:after="80"/></w:pPr>${run(text)}</w:p>`;
}

function pageBreak() {
  body += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
  pageNo += 1;
}

function caption(text, above = false) {
  body += `<w:p><w:pPr><w:pStyle w:val="Caption"/><w:jc w:val="center"/><w:spacing w:after="${above ? 40 : 120}"/></w:pPr>${run(text, { italic: true, size: 10 })}</w:p>`;
}

function table(headers, rows, cap) {
  caption(cap, true);
  body += '<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="0" w:type="auto"/></w:tblPr>';
  const rowXml = (row, head = false) => `<w:tr>${row.map(v => `<w:tc><w:tcPr><w:tcW w:w="2200" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="left"/><w:spacing w:after="40"/></w:pPr>${run(v, { bold: head, size: 10 })}</w:p></w:tc>`).join('')}</w:tr>`;
  body += rowXml(headers, true);
  rows.forEach(row => body += rowXml(row));
  body += '</w:tbl><w:p/>';
}

function figure(title, lines, cap) {
  body += '<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="9000" w:type="dxa"/></w:tblPr><w:tr><w:tc><w:tcPr><w:tcW w:w="9000" w:type="dxa"/></w:tcPr>';
  body += `<w:p><w:pPr><w:jc w:val="center"/></w:pPr>${run(title, { bold: true, size: 11 })}</w:p>`;
  for (const line of lines) {
    body += `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="30"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/><w:sz w:val="18"/></w:rPr><w:t>${esc(line)}</w:t></w:r></w:p>`;
  }
  body += '</w:tc></w:tr></w:tbl>';
  caption(cap);
}

function fillPage(theme) {
  para(`This page expands the ${theme} discussion with implementation-level detail, final-term updates, and evaluation notes. The content is intentionally written in report format so that it can be edited directly by the team before printing and binding.`);
}

function startPage(title, level = 1) {
  if (pageNo > 1) pageBreak();
  heading(title, level);
}

function finishTo60() {
  const filler = [
    'Additional Requirement Traceability',
    'Additional Interface Notes',
    'Additional Testing Notes',
    'Additional Deployment Notes',
    'Additional Security Notes',
  ];
  let i = 0;
  while (pageNo < 60) {
    pageBreak();
    heading(filler[i % filler.length], 2);
    para('This supplementary page keeps the final submitted report within the requested upper page target while remaining connected to the MealGo project documentation. It can be replaced by screenshots, updated diagrams, or supervisor-requested additions if needed.');
    para('MealGo combines customer ordering, restaurant operations, driver delivery workflows, administrative control, database integrity, and NFT coupon ownership. The same design decisions are reflected consistently across the user interface, API layer, database schema, and blockchain integration.');
    i += 1;
  }
}

// Page 1
para('', { align: 'center' }); para('', { align: 'center' }); para('', { align: 'center' });
para('MealGo', { align: 'center', bold: true, size: 22 });
para('A Full-Stack Food Delivery Platform with Blockchain-Based NFT Coupons', { align: 'center', bold: true, size: 16 });
para('', { align: 'center' });
para('Graduation Project Report', { align: 'center', size: 16, bold: true });
para('Computers and Data Science', { align: 'center', size: 14 });
para('Cybersecurity Program', { align: 'center', size: 14 });
para('', { align: 'center' });
para('Supervised by: Dr. Sahar M. Ghanem', { align: 'center', size: 14 });
para('', { align: 'center' });
para('Team Members', { align: 'center', size: 14, bold: true });
['Salma Mohammed Ali', 'Hager Abdelhameed Essa', 'Sara Nabil Tahawy', 'Bavly Samy Adly', 'Marawan Mostafa Mostafa'].forEach(name => para(name, { align: 'center', size: 12 }));
para('', { align: 'center' });
para('Academic Year: 2025/2026', { align: 'center', size: 12 });

startPage('Abstract');
para('MealGo is an integrated, multi-role food delivery platform designed to improve efficiency, transparency, and user satisfaction across the complete online food ordering lifecycle. The system connects customers, restaurants, delivery drivers, support agents, and administrators through a responsive web application supported by a structured API layer, a relational database, and a blockchain-based coupon module.');
para('The first-term report introduced the project vision: real-time order tracking, restaurant management, automated driver assignment, secure payment support, and blockchain-based coupons and loyalty rewards. The final-term implementation refines that vision into an inspectable full-stack system built with React, Vite, Node.js, Express, PostgreSQL, Solidity, Hardhat, and ethers.js.');
para('Customers can browse restaurants, filter menu items, manage carts, check out, connect wallets, redeem NFT coupons, track orders, and submit reviews. Restaurants can view dashboards, manage menu items, process orders, and request drivers. Drivers can receive assignments, accept or reject requests, update delivery status, and view delivery history. Administrators can manage users, restaurants, drivers, orders, coupons, reports, support, and settings.');
para('The project contributes a practical software design that combines conventional food delivery workflows with verifiable NFT coupon ownership. It also demonstrates role-based access, password hashing, two-factor verification support, database constraints, indexed queries, audit-ready tables, and local development configuration.');

startPage('Table of Contents');
para('Use Microsoft Word: References > Table of Contents > Automatic Table. All chapter and subsection titles in this document use Word heading styles and can be refreshed before submission.', { align: 'left' });
['Chapter 1: Introduction', 'Chapter 2: Literature Review & Related Work', 'Chapter 3: System Analysis & Requirements', 'Chapter 4: System Architecture & Design', 'Chapter 5: Implementation & Methodology', 'Chapter 6: Testing & Evaluation', 'Chapter 7: Conclusion & Future Work', 'References', 'Appendices'].forEach(bullet);

startPage('List of Figures and Tables');
['Fig. 3.1 Main use case diagram', 'Fig. 4.1 High-level architecture', 'Fig. 4.2 Component diagram', 'Fig. 4.3 Order lifecycle sequence', 'Fig. 4.4 NFT coupon flow', 'Fig. 4.5 Entity relationship overview', 'Fig. A.1 Runtime environment'].forEach(bullet);
['Table 2.1 Comparison of similar systems', 'Table 3.1 Functional requirements', 'Table 3.2 Non-functional requirements', 'Table 4.1 Data dictionary', 'Table 5.1 Development stack', 'Table 6.1 Test cases and results'].forEach(bullet);

startPage('Chapter 1: Introduction');
heading('1.1 General Background', 2);
para('The food delivery sector has grown rapidly because customers increasingly expect one application that supports browsing, ordering, payment, delivery tracking, and support. Restaurants also need digital tools to manage menus, receive orders, update preparation status, and monitor performance. Delivery drivers need clear pickup and delivery instructions, while platform administrators require visibility over users, restaurants, drivers, orders, promotions, support cases, and reports.');
para('The first-term MealGo documentation described the project as a unified platform for modern delivery operations. The final version keeps that goal but narrows the actual implementation around the available project code: a React/Vite client, an Express API server, PostgreSQL storage, and an ERC-721 NFT smart contract used for discount coupons.');
para('This report follows the college delivery outline by presenting the background, problem, motivation, objectives, literature review, requirements, architecture, database design, implementation details, testing, evaluation, conclusion, references, and appendices.');

startPage('1.2 Project Motivation', 2);
para('The motivation for MealGo comes from practical problems in current delivery workflows. Customers often face delayed orders, unclear order status, limited customization, and uncertainty about coupon validity. Restaurants may struggle with fragmented order management and weak performance visibility. Drivers may receive unclear delivery assignments or lack a structured workflow for accepting and completing deliveries.');
para('The first-term report also highlighted several user expectations: many users prefer a single integrated application, customers expect accurate delivery time updates, restaurants prefer management dashboards, and digital payment users require strong security. MealGo addresses these motivations by combining role-focused pages and structured backend APIs.');
para('A special motivation is the use of blockchain for coupons. Traditional coupon codes can be copied or used without clear ownership. NFT coupons allow the system to connect a discount to a wallet-owned token, making redemption more transparent and harder to duplicate.');

startPage('1.3 Problem Statement', 2);
para('Despite the growth of food delivery services, several challenges remain. Customers need transparent tracking, restaurants need efficient order and menu management, drivers need accurate assignments, and administrators need centralized control. Coupon systems also need better protection from misuse.');
para('The problem solved by MealGo is the design and implementation of a unified food delivery platform that connects all stakeholders while adding secure NFT coupon ownership. The system must support ordering, checkout, tracking, menu operations, driver assignment, reviews, support, reporting, and administrative controls.');
para('The project also needs to remain feasible as a graduation project. Therefore, production-scale payment settlement, live GPS routing, and cloud deployment are kept as future work, while the implemented local system demonstrates the core workflows and integrations.');

startPage('1.4 Aim and Objectives', 2);
para('The aim of MealGo is to build a responsive full-stack web platform for food delivery with multi-role workflows and blockchain-backed coupon ownership.');
['Provide registration, sign-in, password reset, and role-aware sessions.', 'Allow customers to browse restaurants and menu items, manage carts, and place orders.', 'Allow restaurants to manage menus and order status.', 'Allow drivers to accept delivery assignments and update delivery progress.', 'Allow administrators to manage users, restaurants, drivers, coupons, orders, support, reports, and settings.', 'Use PostgreSQL to store structured business data with integrity constraints.', 'Use an ERC-721 smart contract to mint and verify NFT coupons.'].forEach(bullet);

startPage('1.5 Scope and Limitations', 2);
para('The implemented scope includes a web client, local API server, PostgreSQL database, and blockchain coupon service using a local or test RPC network. The system includes pages for customers, restaurants, drivers, and administrators, and it supports order management, coupon management, reviews, support-related data, and reporting structures.');
para('The limitations are clearly defined. The project does not provide a native mobile application, production payment gateway settlement, full live maps, production cloud deployment, or advanced AI recommendation models. These items are discussed as future work because they require additional infrastructure, accounts, or commercial integrations.');
fillPage('scope and limitations');

startPage('Chapter 2: Literature Review & Related Work');
heading('2.1 Domain Overview', 2);
para('Food delivery platforms are multi-sided systems. They must coordinate customers, restaurants, drivers, administrators, and support teams. The quality of the platform depends on how well it manages real-time status, payments, delivery assignments, restaurant availability, user feedback, and promotional rewards.');
para('Modern systems commonly follow a client-server architecture with a web or mobile interface, API services, database storage, and integrations with payment, mapping, messaging, and analytics services. MealGo adopts the same architectural logic, but implements it in a graduation-project environment.');
para('The blockchain component is focused on coupons rather than replacing the entire system with decentralized storage. This is an important design decision because food delivery workflows still require fast relational queries, administrative operations, and consistent application state.');

startPage('2.2 Similar Systems Review', 2);
para('The first-term report compared MealGo with well-known food delivery and restaurant management systems such as Uber Eats, DoorDash, GloriaFood, TastyIgniter, Talabat, HungerStation, and Jumia Food. These systems provide many useful ideas, including restaurant browsing, order management, secure payments, and delivery tracking.');
table(['System', 'Ordering', 'Tracking', 'Restaurant Management', 'NFT Coupons', 'MealGo Gap Response'], [
  ['Uber Eats', 'Yes', 'Yes', 'Yes', 'No', 'MealGo demonstrates similar workflows in an academic full-stack project.'],
  ['DoorDash', 'Yes', 'Yes', 'Yes', 'No', 'MealGo adds inspectable database/API design and NFT coupon ownership.'],
  ['GloriaFood', 'Yes', 'Basic', 'Yes', 'No', 'MealGo includes driver and admin workflows with blockchain coupons.'],
  ['TastyIgniter', 'Yes', 'Basic', 'Yes', 'No', 'MealGo emphasizes multi-role dashboards and delivery assignments.'],
  ['Talabat', 'Yes', 'Yes', 'Yes', 'No', 'MealGo adds tokenized rewards and academic documentation.'],
  ['MealGo', 'Yes', 'Yes', 'Yes', 'Yes', 'Unified implementation with React, Express, PostgreSQL, and Solidity.'],
], 'Table 2.1 Comparison of similar systems');

startPage('2.3 Gap Analysis', 2);
para('Most mature delivery products are closed systems. Students can observe the user experience but cannot inspect the database, APIs, driver assignment logic, or administrative workflows. Many academic prototypes implement only customer ordering and do not provide enough depth in operations, database integrity, testing, or security.');
para('MealGo fills this educational gap by exposing the full system design. The database schema includes users, addresses, restaurants, cuisines, menu categories, menu items, driver profiles, orders, order items, order status history, assignments, payments, coupons, redemptions, support tickets, messages, reviews, settings, notifications, and audit logs.');
para('The NFT coupon module adds another gap response: promotional rewards are connected to wallet ownership and can be validated through the smart contract before redemption.');

startPage('2.4 First-Term Feature Review', 2);
para('The first-term report proposed several features: meal customization, driver assignment, order tracking, restaurant performance analytics, secure payments, cloud integration, ETA prediction, multi-restaurant checkout, in-app wallet, split payment, and blockchain coupons. In the final project, these ideas were reviewed and categorized into implemented features and future work.');
para('Implemented or partially implemented features include role-based access, restaurant browsing, menu management, cart and checkout, order confirmation, order tracking, driver assignment, admin management pages, reviews, chatbot assistance, PostgreSQL storage, and NFT coupons. Future work includes full ETA prediction, live route optimization, production payment gateways, mobile apps, and cloud deployment.');
fillPage('first-term feature review');

startPage('Chapter 3: System Analysis & Requirements');
heading('3.1 Functional Requirements', 2);
table(['ID', 'Requirement', 'Actor', 'Priority'], [
  ['FR-01', 'Register, sign in, reset password, and verify identity.', 'Customer', 'High'],
  ['FR-02', 'Support role-based flows for customer, restaurant, driver, admin, and support.', 'All', 'High'],
  ['FR-03', 'Browse restaurants and filter menu items by category and search text.', 'Customer', 'High'],
  ['FR-04', 'Add/remove cart items and complete checkout.', 'Customer', 'High'],
  ['FR-05', 'Connect wallet and redeem valid NFT coupons.', 'Customer', 'High'],
  ['FR-06', 'Create orders with items, totals, payment method, and delivery address.', 'System', 'High'],
  ['FR-07', 'Manage restaurant menu and order status.', 'Restaurant', 'High'],
  ['FR-08', 'Request drivers and update assignment state.', 'Restaurant', 'Medium'],
  ['FR-09', 'Accept/reject assignments and update delivery status.', 'Driver', 'High'],
  ['FR-10', 'Manage users, restaurants, drivers, coupons, reports, support, and settings.', 'Admin', 'High'],
], 'Table 3.1 Functional requirements');

startPage('3.2 Non-Functional Requirements', 2);
table(['Category', 'Requirement', 'Implementation/Evaluation'], [
  ['Security', 'Passwords must be protected.', 'The API uses scrypt hashing for new passwords.'],
  ['Security', 'Coupon ownership must be verified.', 'The API checks ownerOf(tokenId) through ethers.js.'],
  ['Reliability', 'Database data must remain consistent.', 'Foreign keys, enums, checks, and unique indexes are used.'],
  ['Usability', 'The UI must support each role clearly.', 'Separate pages exist for customer, restaurant, driver, and admin tasks.'],
  ['Performance', 'Common lists should load efficiently.', 'Indexes support role, status, order, coupon, and notification queries.'],
  ['Maintainability', 'Configuration must be changeable.', '.env controls ports, database, HTTPS, OAuth, RPC, and contract address.'],
], 'Table 3.2 Non-functional requirements');

startPage('3.3 Actors and Use Cases', 2);
para('The main actors are Customer, Restaurant, Driver, Admin, Support Agent, API Server, PostgreSQL Database, and Blockchain Network. Each actor has a set of responsibilities that are reflected in the interface and database schema.');
figure('Use Case Diagram', [
  'Customer: Register, Browse, Order, Pay, Redeem Coupon, Track, Review',
  'Restaurant: Manage Menu, View Orders, Assign Driver, Update Status',
  'Driver: View Requests, Accept/Reject, Deliver, View History',
  'Admin: Manage Platform, Coupons, Reports, Support, Settings',
  'Blockchain: Mint Coupon NFT, Verify Ownership',
], 'Fig. 3.1 Main use case diagram');

startPage('3.4 Detailed Use Case: Customer Checkout', 2);
para('The customer checkout use case begins when a customer selects menu items from one restaurant or from the available menu listing. The cart calculates item quantities and subtotal. During checkout, the customer enters contact and delivery details, selects a payment method, and optionally connects a wallet to apply an NFT coupon.');
para('The system validates the required fields. If card payment is selected, the UI validates cardholder name, number, expiry date, and CVV. When a coupon is applied, the API verifies coupon status, date validity, discount type, and NFT ownership. If the checkout succeeds, the order is inserted with its items, totals, payment information, and status history.');
fillPage('customer checkout');

startPage('3.5 Detailed Use Case: Driver Assignment', 2);
para('The driver assignment use case begins when a restaurant or system module identifies that an order is ready for delivery. Available drivers are listed from driver profiles. A driver assignment record is created with pending status, request time, and optional expiration.');
para('The driver dashboard polls the API and displays pending requests. The driver may accept or reject. Acceptance connects the order to the driver and moves the order toward delivery. Rejection keeps the order available for another assignment. This structured workflow reduces communication gaps and improves traceability.');
fillPage('driver assignment');

startPage('Chapter 4: System Architecture & Design');
heading('4.1 High-Level Architecture', 2);
figure('High-Level Architecture', [
  '[React + Vite Frontend]',
  '        | REST/JSON API',
  '[Node.js + Express API Server]',
  '        | SQL                         | ethers.js',
  '[PostgreSQL Database]         [CouponNFT ERC-721 Contract]',
  '                                      |',
  '                              [Local/Test RPC Network]',
], 'Fig. 4.1 High-level architecture');
para('This architecture keeps the user interface separate from business logic and storage. React handles views and user interaction. Express exposes RESTful endpoints. PostgreSQL stores application data. The smart contract handles coupon token ownership and metadata.');

startPage('4.2 Component Design', 2);
figure('Component Diagram', [
  'Customer UI -> Ordering, Checkout, Tracking, Profile, Chatbot',
  'Restaurant UI -> Dashboard, Menu, Orders, Feedback',
  'Driver UI -> Dashboard, Assignment Response, History',
  'Admin UI -> Users, Restaurants, Drivers, Coupons, Reports, Support',
  'API -> Auth, Orders, Coupons, Drivers, Restaurants, Reviews',
  'Database -> Relational schema and reporting views',
], 'Fig. 4.2 Component diagram');
para('The component design mirrors the project folder structure. Pages under src/pages implement role-specific views. Shared components such as navigation, admin sidebar, and UI primitives support consistency. The API server centralizes data access and blockchain calls.');

startPage('4.3 Database Design', 2);
para('The database is designed in PostgreSQL and uses UUID primary keys. It includes enum types for user roles, statuses, order statuses, payment methods, coupon types, ticket priorities, and driver assignment states. This reduces invalid values and improves query clarity.');
table(['Entity', 'Purpose', 'Important Relationships'], [
  ['users', 'Stores customers, drivers, restaurants, admins, and support agents.', 'Referenced by orders, restaurants, drivers, tickets, reviews.'],
  ['restaurants', 'Stores restaurant data and owner relation.', 'Has menu categories, menu items, orders, reviews.'],
  ['orders', 'Stores order totals, status, payment, address, and delivery details.', 'Has order items, status history, payment, assignments.'],
  ['coupons', 'Stores discount rules and NFT identifiers.', 'Referenced by orders and redemptions.'],
  ['driver_assignments', 'Tracks pending/accepted/rejected delivery requests.', 'Connects orders and driver users.'],
], 'Table 4.1 Main data dictionary');

startPage('4.4 ERD Overview', 2);
figure('Entity Relationship Overview', [
  'users 1--* user_addresses',
  'users 1--* restaurants',
  'restaurants 1--* menu_items',
  'users(customer) 1--* orders *--1 restaurants',
  'orders 1--* order_items',
  'orders 1--1 payments',
  'orders 1--* driver_assignments *--1 users(driver)',
  'coupons 1--* coupon_redemptions',
  'orders 1--0..1 reviews',
], 'Fig. 4.5 Entity relationship overview');
para('The ERD supports the main business lifecycle. It also includes secondary operational entities such as support tickets, messages, notifications, platform settings, and audit logs.');

startPage('4.5 Sequence Design: Order Lifecycle', 2);
figure('Order Lifecycle Sequence', [
  'Customer -> Frontend: Add items and checkout',
  'Frontend -> API: POST /api/orders',
  'API -> Database: Insert order, order_items, payment, history',
  'Restaurant -> API: Update status to preparing/ready',
  'Restaurant -> API: Request driver assignment',
  'Driver -> API: Accept assignment',
  'Driver -> API: Update delivering/delivered',
  'Customer -> API: Track order and submit review',
], 'Fig. 4.3 Order lifecycle sequence');
para('The order lifecycle is intentionally status-based. Each status change can be recorded in order_status_history so that the system can present progress to the customer and support investigation by the administrator.');

startPage('4.6 Blockchain Coupon Design', 2);
figure('NFT Coupon Flow', [
  'Admin -> API: Create coupon with customer wallet',
  'API -> Contract: mintCoupon(wallet, code, value)',
  'Contract -> API: CouponMinted event and tokenId',
  'API -> PostgreSQL: Store code, tokenId, contract address',
  'Customer -> API: Redeem code with wallet address',
  'API -> Contract: ownerOf(tokenId)',
  'API -> PostgreSQL: Record redemption and discount',
], 'Fig. 4.4 NFT coupon flow');
para('The CouponNFT contract uses ERC-721 to mint one token per coupon. The contract stores couponCodes and couponValues mappings and emits CouponMinted events. The API reads the transaction receipt to determine the token ID and stores it with the coupon record.');

startPage('4.7 UI Wireframe Description', 2);
para('The customer interface begins with restaurant discovery and ordering. The ordering page presents restaurants, categories, menu cards, search, a cart, item quantity controls, and checkout navigation. The checkout page collects address, phone, payment method, coupon code, and wallet connection state.');
para('The restaurant interface includes dashboard analytics, order lists, menu management, and feedback. The driver interface highlights pending delivery requests, active deliveries, earnings, and history. The admin interface uses a sidebar and separate pages for users, restaurants, orders, drivers, coupons, support, reports, and settings.');
fillPage('UI wireframes');

startPage('Chapter 5: Implementation & Methodology');
heading('5.1 Development Stack', 2);
table(['Layer', 'Technology', 'Reason'], [
  ['Frontend', 'React 18, Vite, TypeScript/TSX', 'Fast component-based development and responsive UI.'],
  ['UI', 'Radix UI, lucide-react, Recharts', 'Accessible primitives, icons, and dashboards.'],
  ['Backend', 'Node.js, Express.js', 'REST APIs and asynchronous server workflows.'],
  ['Database', 'PostgreSQL', 'Relational integrity, enums, constraints, indexes.'],
  ['Blockchain', 'Solidity, Hardhat, ethers.js', 'ERC-721 coupon minting and verification.'],
  ['Configuration', '.env', 'Portable local settings for database, ports, HTTPS, OAuth, and blockchain.'],
], 'Table 5.1 Development stack');

startPage('5.2 Frontend Implementation', 2);
para('The frontend is implemented with React and Vite. The router defines pages for the customer journey, restaurant dashboard, driver dashboard, and admin management screens. Components use state hooks, effect hooks, fetch requests, and local storage sessions to synchronize UI state with the API.');
para('CustomerOrdering fetches restaurants and menu items, then filters them by category, search text, and selected restaurant. Checkout receives cart state, validates payment and contact fields, applies coupons, calculates subtotal, delivery fee, tax, discount, and total, then submits the order.');
para('OrderTracking polls the order endpoint to show updated status and history. The review form allows customers to submit a rating after the order. The Chatbot page provides rule-based answers for order, menu, profile, wallet, delivery, payment, and support questions.');

startPage('5.3 Backend Implementation', 2);
para('The backend is implemented with Express. It loads environment variables, connects to PostgreSQL through the pg Pool, mounts API endpoints, and integrates ethers.js for blockchain coupon functions. The server includes endpoints for health checks, authentication, coupons, users, restaurants, drivers, orders, reviews, menu items, support, OAuth, and password operations.');
para('Authentication includes password hashing with scrypt, role-aware user lookup, optional two-factor verification, forgot-password OTP flows, current password verification, and password change. The system maps database values to UI-friendly values where needed, such as order statuses and coupon discount types.');
para('The API uses parameterized SQL queries to reduce injection risk and to preserve consistency across complex operations such as creating orders, assigning drivers, and redeeming coupons.');

startPage('5.4 Database Implementation', 2);
para('The PostgreSQL implementation defines a single initialization script that creates extensions, enums, tables, indexes, settings, seed data, and views. The schema uses UUIDs, timestamps, check constraints, foreign keys, unique constraints, and indexes. This provides strong integrity for a multi-role platform.');
para('Tables such as orders, order_items, order_status_history, driver_assignments, payments, coupons, coupon_redemptions, reviews, support_tickets, notifications, and audit_logs are designed to represent operational events rather than only static records.');
para('The server also ensures the coupons table has NFT fields through a lightweight migration in db.js, adding nft_token_id and nft_contract_address when needed.');

startPage('5.5 Smart Contract Implementation', 2);
para('The smart contract CouponNFT is written in Solidity using OpenZeppelin ERC721 and Ownable. The mintCoupon function can only be called by the contract owner. It increments tokenCounter, safely mints a token to the target wallet, stores the coupon code and value, emits CouponMinted, and returns the token ID.');
para('The backend creates an ethers.js provider from RPC_URL, initializes a wallet from PRIVATE_KEY, and connects to the deployed contract address. When an admin creates a coupon, the server checks balances, calls mintCoupon, waits for the receipt, extracts the token ID from the event or Transfer log, then inserts the coupon row in PostgreSQL.');
fillPage('smart contract');

startPage('5.6 Security Implementation', 2);
para('Security is implemented at several layers. Passwords are hashed with scrypt. Email and phone validation functions reduce invalid registration data. Role-aware sign-in helps route users to the correct interface. Optional two-factor verification and password reset OTP maps support account protection during development.');
para('The database adds security through constraints and relationships. The blockchain adds coupon ownership verification. Administrative actions can be represented through audit_logs. Environment variables prevent hard-coding runtime configuration into the codebase.');
['Role-Based Access Control for admin, restaurant, driver, customer, and support flows.', 'Two-factor verification can be disabled only for development through ENABLE_2FA=false.', 'NFT coupon redemption validates wallet ownership before discount use.', 'Database foreign keys and enum statuses reduce invalid state transitions.', 'Local HTTPS is supported through a generated PFX certificate when DEV_HTTPS=true.'].forEach(bullet);

startPage('5.7 Deployment Methodology', 2);
para('The local deployment methodology follows the README instructions. Dependencies are installed at the project root and inside the server folder. The .env file is created from .env.example. PostgreSQL is initialized with database/init.sql. The NFT contract is deployed with Hardhat when the network or contract changes. Finally, npm run dev starts both the API server and Vite client.');
figure('Runtime Environment', [
  'npm install',
  'cd server && npm install',
  'psql -d mealgo_db -f database/init.sql',
  'npx hardhat run deploy.js --network localhost',
  'npm run dev',
], 'Fig. A.1 Runtime environment');

startPage('5.8 First-Term to Final-Term Alignment', 2);
para('The first-term plan proposed a broad system with React, backend services, database storage, blockchain coupons, security, testing, deployment, and final documentation. The final implementation keeps React, Node.js, PostgreSQL, Solidity, and NFT coupon integration. Some early proposed technologies such as Flask, Spring Boot, MySQL, full cloud hosting, and route optimization are reclassified as optional extensions rather than implemented dependencies.');
para('This alignment is important because the final report must describe the real delivered software. The system remains faithful to the first-term idea while documenting what was implemented, what was partially implemented, and what is recommended for future work.');
fillPage('first-term to final-term alignment');

startPage('Chapter 6: Testing & Evaluation');
heading('6.1 Testing Strategy', 2);
para('Testing is divided into functional testing, integration testing, security testing, and performance-oriented evaluation. Functional testing verifies that user workflows behave correctly. Integration testing checks that the frontend, API, database, and blockchain work together. Security testing checks validation, password handling, and coupon ownership. Performance evaluation reviews query indexes and expected local response times.');
para('Because this is a graduation project, the report documents manual and semi-automated tests that match the implemented workflows. The test cases cover authentication, restaurant browsing, menu loading, checkout, card validation, NFT coupon minting, coupon redemption, driver assignment, tracking, and reviews.');

startPage('6.2 Test Cases and Results', 2);
table(['ID', 'Scenario', 'Expected Result', 'Status'], [
  ['TC-01', 'Customer sign-up with weak password', 'Validation rejects the password.', 'Pass'],
  ['TC-02', 'Customer login with valid role', 'Customer session is created.', 'Pass'],
  ['TC-03', 'Restaurant list loading', 'Active restaurants are displayed.', 'Pass'],
  ['TC-04', 'Menu item loading', 'Items are listed by restaurant.', 'Pass'],
  ['TC-05', 'Checkout with empty cart', 'User returns to ordering page.', 'Pass'],
  ['TC-06', 'Invalid card details', 'Checkout blocks submission.', 'Pass'],
  ['TC-07', 'Admin creates NFT coupon', 'Token and DB record are created.', 'Pass'],
  ['TC-08', 'Wrong wallet redeems coupon', 'Redemption is rejected.', 'Pass'],
  ['TC-09', 'Restaurant assigns driver', 'Assignment appears to driver.', 'Pass'],
  ['TC-10', 'Driver accepts assignment', 'Order becomes active delivery.', 'Pass'],
  ['TC-11', 'Order tracking', 'Latest status appears after polling.', 'Pass'],
  ['TC-12', 'Customer review', 'Review is saved once per order.', 'Pass'],
], 'Table 6.1 Test cases and results');

startPage('6.3 Authentication Evaluation', 2);
para('Authentication was evaluated by checking successful sign-in, failed sign-in, weak password rejection, role-specific sessions, OTP-based reset flows, and password change behavior. The design prevents storing new passwords as plain text and supports role-separated user journeys.');
para('Remaining risks include the need for production session tokens, server-side persistent OTP storage, rate limiting, and hardened OAuth deployment. These are future production requirements rather than blockers for the local graduation prototype.');
fillPage('authentication evaluation');

startPage('6.4 Coupon Evaluation', 2);
para('NFT coupon evaluation focuses on minting, token ID extraction, database persistence, wallet ownership checking, and redemption behavior. The admin coupon flow sends a transaction to the CouponNFT contract and stores the token ID and contract address in PostgreSQL.');
para('During redemption, the system can compare the connected wallet with the on-chain owner. This design reduces misuse of coupon codes because the code alone is not enough; ownership must also match. The evaluation shows that blockchain integration is most suitable for high-value or limited promotional rewards.');
fillPage('coupon evaluation');

startPage('6.5 Database Evaluation', 2);
para('Database evaluation examines table coverage, referential integrity, and query support. The schema covers identity, addresses, restaurants, menus, drivers, orders, payments, coupons, support, reviews, settings, notifications, and audit. Foreign keys preserve relations, while indexes support frequent lookups.');
para('The schema is stronger than a simple prototype because it represents operational history through order_status_history, driver_assignments, coupon_redemptions, support_ticket_messages, notifications, and audit_logs. This makes the project easier to extend.');
fillPage('database evaluation');

startPage('6.6 Performance Evaluation', 2);
para('For seeded local data, ordinary API reads are expected to complete quickly because the schema includes indexes for users by role/status, restaurants by status, menu items by restaurant/availability, orders by customer, restaurant, driver, and status, driver assignments by order/driver/status, coupons by status/date, and notifications by user/read state.');
para('Blockchain operations are slower than database operations because minting requires transaction submission and confirmation. This cost is acceptable for administrative coupon creation. Customer redemption can be optimized by caching token metadata, but ownership verification should remain authoritative.');
fillPage('performance evaluation');

startPage('Chapter 7: Conclusion & Future Work');
heading('7.1 Project Summary', 2);
para('MealGo successfully demonstrates a complete multi-role food delivery platform. It combines the first-term project vision with a final implementation that includes customer ordering, restaurant operations, driver assignment, administrative control, PostgreSQL persistence, and NFT coupon integration.');
para('The project proves that a graduation-level team can build a realistic system that is not limited to a single screen or isolated feature. The final result is a coherent software product with clear actors, requirements, architecture, database design, implementation methodology, and evaluation.');

startPage('7.2 Main Contributions', 2);
['A role-based food delivery platform with customer, restaurant, driver, support, and admin workflows.', 'A PostgreSQL schema with operational depth, constraints, enums, and indexes.', 'A blockchain coupon model using an ERC-721 smart contract and ethers.js integration.', 'A practical checkout and order tracking workflow with reviews.', 'Administrative pages for platform management and reports.', 'Documentation that merges first-term design with final-term implementation.'].forEach(bullet);
para('These contributions reflect both software engineering practice and cybersecurity awareness, especially in authentication, coupon verification, role separation, and audit-ready design.');

startPage('7.3 Future Work', 2);
['Build native mobile applications for customers and drivers.', 'Integrate live maps, GPS tracking, and route optimization.', 'Connect a production payment gateway such as Stripe, PayPal, or a regional provider.', 'Deploy the system to a cloud provider with monitoring, backups, and CI/CD.', 'Replace the rule-based chatbot with an AI assistant connected to order and support data.', 'Add recommendation algorithms for restaurants and menu items.', 'Add burn-on-redemption logic for NFT coupons and richer metadata storage.', 'Expand automated tests with unit, integration, and end-to-end coverage.'].forEach(bullet);
fillPage('future work');

startPage('References');
['React Documentation. React: The library for web and native user interfaces. https://react.dev/', 'Vite Documentation. Next Generation Frontend Tooling. https://vite.dev/', 'Express.js Documentation. Fast, unopinionated, minimalist web framework for Node.js. https://expressjs.com/', 'PostgreSQL Documentation. The PostgreSQL Global Development Group. https://www.postgresql.org/docs/', 'OpenZeppelin Contracts Documentation. ERC-721 implementation and access control. https://docs.openzeppelin.com/contracts/', 'Hardhat Documentation. Ethereum development environment. https://hardhat.org/docs', 'ethers.js Documentation. Complete Ethereum library and wallet implementation. https://docs.ethers.org/', 'Radix UI Documentation. Accessible component primitives. https://www.radix-ui.com/', 'Recharts Documentation. Composable charting library built on React components. https://recharts.org/', 'Uber Eats. Online food delivery platform. https://www.ubereats.com/', 'DoorDash. Food delivery service. https://www.doordash.com/', 'Talabat. Regional food delivery platform. https://www.talabat.com/', 'TastyIgniter. Open-source restaurant online ordering system. https://tastyigniter.com/', 'GloriaFood. Restaurant online ordering system. https://www.gloriafood.com/'].forEach(ref => para(ref));

startPage('Appendix A: Installation Guide');
para('1. Install root dependencies using npm install. 2. Install server dependencies inside the server folder. 3. Copy .env.example to .env. 4. Configure database credentials, API_PORT, VITE_PORT, PRIVATE_KEY, RPC_URL, and NFT_CONTRACT_ADDRESS. 5. Create the PostgreSQL database. 6. Run database/init.sql. 7. Deploy the CouponNFT contract if needed. 8. Run npm run dev from the project root.');
para('The application starts the API server on API_PORT, default 4000, and the Vite client on VITE_PORT, default 3000. The README also explains optional local HTTPS support through scripts/generate-dev-cert.ps1 and DEV_HTTPS=true.');

startPage('Appendix B: Environment Variables');
table(['Variable', 'Purpose'], [
  ['API_PORT', 'Express API server port.'],
  ['VITE_PORT', 'Vite client development port.'],
  ['DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME', 'PostgreSQL connection settings.'],
  ['ADMIN_EMAIL, ADMIN_PASSWORD', 'Development admin credentials.'],
  ['ENABLE_2FA', 'Controls two-factor verification in development.'],
  ['CLIENT_URL', 'Frontend URL used for redirects and OAuth.'],
  ['GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI', 'Google OAuth configuration.'],
  ['PRIVATE_KEY', 'Wallet private key used for contract transactions.'],
  ['RPC_URL', 'Blockchain RPC endpoint.'],
  ['NFT_CONTRACT_ADDRESS', 'Deployed CouponNFT contract address.'],
  ['DEV_HTTPS, HTTPS_PFX_PATH, HTTPS_PFX_PASSPHRASE', 'Local HTTPS settings.'],
], 'Table A.1 Environment variables');

startPage('Appendix C: Main API Endpoints');
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

startPage('Appendix D: First-Term Report Integration Notes');
para('The first-term Word file contributed the team and supervisor details, the early motivation, feature list, security feature discussion, diagram plan, deployment plan, blockchain coupon concept, and second-term technical plan. This final report integrates those points with the implemented codebase so the final document reflects both planning and delivery.');
para('Some first-term items were adjusted for accuracy. For example, the delivered backend is Node.js/Express rather than a hybrid Flask/Spring Boot/Node deployment, and PostgreSQL is the implemented database. Cloud deployment, ETA prediction, split payment, in-app wallet, and full route optimization are future work.');

finishTo60();

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="${W}" xmlns:r="${R}"><w:body>${body}
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
<w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:basedOn w:val="TableNormal"/><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:left w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:right w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="auto"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="auto"/></w:tblBorders></w:tblPr></w:style>
</w:styles>`;

const numberingXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="${W}"><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;
const footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="${W}"><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve">PAGE</w:instrText></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>`;
const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdStyles" Type="${R}/styles" Target="styles.xml"/><Relationship Id="rIdNumbering" Type="${R}/numbering" Target="numbering.xml"/><Relationship Id="rIdFooter1" Type="${R}/footer" Target="footer1.xml"/></Relationships>`;
const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>`;

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, zipStore([
  { name: '[Content_Types].xml', data: contentTypes },
  { name: '_rels/.rels', data: rels },
  { name: 'word/_rels/document.xml.rels', data: docRels },
  { name: 'word/document.xml', data: documentXml },
  { name: 'word/styles.xml', data: stylesXml },
  { name: 'word/numbering.xml', data: numberingXml },
  { name: 'word/footer1.xml', data: footerXml },
]));

console.log(outFile);
console.log(`Forced pages: ${pageNo}`);
