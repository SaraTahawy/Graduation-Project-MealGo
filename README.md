# MealGo — Smart Restaurant Ordering & Delivery System

A full-stack food ordering and delivery platform designed to connect **customers, restaurants, drivers, and administrators** in one system.

MealGo combines a role-based web application with secure authentication, PostgreSQL data management, order and delivery workflows, and **blockchain-based NFT coupons**.

---

## 🎥 Project Demo

Here are short demonstrations of the main MealGo workflows and features.

### 🛒 Customer — Make Order

[▶️ Watch Demo]
<video src="./videos/compress-Make order.mp4" controls></video>

### 🍽️ Restaurant & 🚗 Driver

[▶️ Watch Demo]
<video src="./videos/compress-part2 rest&driver.mp4" controls></video>

### 🛠️ Admin & NFT Coupon

[▶️ Watch Demo]
<video src="./videos/compress-Admin&Make Coupon.mp4" controls></video>

### 🤖 ChatBot

[▶️ Watch Demo]
<video src="./videos/compress-ChatBot.mp4" controls></video>


---

## 📌 Overview

MealGo is a web-based restaurant ordering and delivery system developed as a graduation project.

The platform provides different workflows depending on the user's role:

* **Customers** can browse restaurants and menus, manage their cart, place orders, track orders, use coupons, and submit reviews.
* **Restaurants** can manage menus and handle incoming orders.
* **Drivers** can view assigned deliveries and update delivery status.
* **Administrators** can manage users, restaurants, orders, coupons, support tickets, and other system data.

The system uses **PostgreSQL** as its main database and includes an **ERC-721 smart contract** for blockchain-backed coupon ownership.

---

## ✨ Main Features

### 👤 Customer

* Account registration and login
* Role-aware authentication
* Password recovery using OTP
* Optional two-factor authentication
* Browse restaurants and menus
* Search and manage cart items
* Place and manage orders
* Order status tracking
* Coupon redemption
* NFT coupon support
* Order reviews and ratings
* Notifications

### 🍽️ Restaurant

* Restaurant management
* Menu and item management
* View incoming orders
* Update order status
* Manage restaurant-related data

### 🚗 Driver

* View assigned deliveries
* Track assigned orders
* Update delivery status
* Driver assignment workflow

### 🛠️ Admin

* User management
* Restaurant management
* Order management
* Coupon management
* NFT coupon creation
* Support ticket management
* Notifications
* Audit logs

---

## 🔐 Security Features

Security was considered throughout the application rather than being limited to authentication.

* Password hashing using **scrypt**
* Role-Based Access Control (RBAC)
* Input validation
* Parameterized SQL queries
* Optional two-factor authentication
* OTP-based password recovery
* Database constraints and validation
* Audit logging
* Environment variables for sensitive configuration
* Wallet ownership verification for NFT coupons
* Local HTTPS support for development

---

## ⛓️ Blockchain Integration

MealGo includes a small **ERC-721 CouponNFT smart contract** for blockchain-backed coupons.

The blockchain component allows administrators to create coupon NFTs for customers while keeping the corresponding coupon record in PostgreSQL.

### Coupon Flow

```text
Admin creates coupon
        ↓
Smart contract mints NFT
        ↓
NFT token ID is generated
        ↓
Coupon information is stored in PostgreSQL
        ↓
Customer receives the coupon
        ↓
Wallet ownership can be verified
```

The system uses:

* Solidity
* OpenZeppelin ERC-721
* Hardhat
* ethers.js
* Ethereum-compatible networks / local RPC

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │   Vite + TypeScript │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Node.js / Express │
                    │      Backend API    │
                    └──────┬──────┬───────┘
                           │      │
                 ┌─────────┘      └─────────────┐
                 ▼                              ▼
        ┌─────────────────┐            ┌─────────────────┐
        │   PostgreSQL    │            │  Blockchain     │
        │    Database     │            │  ERC-721 NFT    │
        └─────────────────┘            └─────────────────┘
```

---

## 🧰 Technology Stack

| Layer               | Technologies                             |
| ------------------- | ---------------------------------------- |
| Frontend            | React, TypeScript, Vite                  |
| UI                  | Radix UI, Lucide React                   |
| Charts              | Recharts                                 |
| Backend             | Node.js, Express.js                      |
| Database            | PostgreSQL                               |
| Authentication      | scrypt, RBAC, OTP, optional 2FA          |
| Blockchain          | Solidity, ERC-721, OpenZeppelin          |
| Blockchain Tools    | Hardhat, ethers.js                       |
| Testing             | JMeter, Unit / Integration / UAT testing |
| Frontend Deployment | Vercel                                   |
| Backend Deployment  | Railway                                  |

---

## 🗄️ Database

MealGo uses **PostgreSQL** with UUID-based primary keys, foreign-key relationships, enums, constraints, indexes, and seed data.

The database includes core entities such as:

* Users and authentication
* Restaurants
* Menu items
* Orders
* Order items
* Order status history
* Payments
* Driver assignments
* Reviews
* Coupons
* Coupon redemptions
* Notifications
* Support tickets
* Audit logs

The database initialization script is located in:

```text
database/init.sql
```

---

## 🔄 Main Order Workflow

```text
Customer
   │
   ▼
Browse Restaurant
   │
   ▼
Add Items to Cart
   │
   ▼
Place Order
   │
   ▼
Restaurant Receives Order
   │
   ▼
Order Processing
   │
   ▼
Driver Assignment
   │
   ▼
Delivery
   │
   ▼
Customer Receives Order
   │
   ▼
Review / Rating
```

---

## 🧪 Testing & Performance

The project was tested through functional workflows, integration testing, user acceptance testing, and performance testing.

### Apache JMeter

A performance test was conducted using:

* **100 concurrent users**
* **1,000 requests**
* Average response time: **145 ms**
* Minimum response time: **35 ms**
* Maximum response time: **420 ms**
* Throughput: **68 requests/second**
* Error rate: **0.5%**

---

## ☁️ Deployment

The final project was deployed using:

* **Vercel** — Frontend
* **Railway** — Backend

Environment variables are used for database credentials, API configuration, authentication settings, Google OAuth configuration, and blockchain settings.

Sensitive environment files and local certificates are intentionally excluded from the repository.

---

## 📁 Project Structure

```text
MealGo/
│
├── database/
│   └── init.sql
│
├── server/
│   ├── contracts/
│   ├── ...
│   └── ...
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── ...
│   └── ...
│
├── .gitignore
├── package.json
└── README.md
```

> The structure above is a simplified overview. Individual files and folders may vary depending on the project version.

---

## 🚀 Local Development

### 1. Install dependencies

From the project root:

```bash
npm install
```

Then install the backend dependencies:

```bash
cd server
npm install
```

### 2. Configure environment variables

Create your local `.env` file and configure the required database, API, authentication, and blockchain variables.

**Do not commit `.env` to GitHub.**

### 3. Initialize PostgreSQL

Create the `mealgo_db` database and run:

```bash
psql -U postgres -d mealgo_db -f database/init.sql
```

### 4. Run the application

From the project root:

```bash
npm run dev
```

The application uses separate frontend and backend development ports according to the project configuration.

---

## 🔗 API

The backend provides REST API endpoints for major system operations, including:

* Authentication
* Users
* Restaurants
* Menu items
* Orders
* Payments
* Coupons
* Reviews
* Driver assignments
* Notifications
* Support tickets

---

## 🚧 Future Improvements

Possible future improvements identified for the project include:

* Native mobile applications
* GPS and live map integration
* Route optimization
* Production payment gateway integration
* Monitoring and CI/CD improvements
* AI-based customer assistance
* Machine-learning recommendation systems
* Additional NFT lifecycle features
* Expanded automated testing

---

## 🎓 Graduation Project

**MealGo — Smart Restaurant Ordering And Delivery System**

**Alexandria National University (ANU)**
College of Computer and Data Science
Cybersecurity Program
Academic Year: **2026**

---
