# 💰 FinanceOS — AI Personal Finance Tracker

A full-stack AI-powered personal finance tracker built with Node.js, Express, EJS, MongoDB, and Claude AI.

---

## 🗂️ Project Structure

```
financeos/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Login / Register / Logout
│   ├── dashboardController.js # Dashboard stats & charts
│   ├── transactionController.js # CRUD for transactions
│   └── aiController.js        # Claude AI chat
├── middlewares/
│   └── auth.js                # Auth guards (ensureAuth, ensureGuest)
├── models/
│   ├── User.js                # User schema (bcrypt hashed password)
│   └── Transaction.js         # Transaction schema
├── public/
│   ├── css/main.css           # All styles
│   └── js/main.js             # Chart.js + interactions
├── routes/
│   ├── auth.js                # /auth/*
│   ├── dashboard.js           # /dashboard
│   ├── transactions.js        # /transactions/*
│   └── ai.js                  # /ai/*
├── utils/
│   └── seed.js                # Sample data seeder
├── views/
│   ├── layouts/main.ejs       # Base layout
│   ├── partials/
│   │   ├── navbar.ejs
│   │   └── flash.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── dashboard/index.ejs
│   ├── transactions/
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   └── edit.ejs
│   ├── ai/index.ejs
│   └── 404.ejs
├── .env.example
├── .gitignore
├── package.json
└── server.js                  # App entry point
```

---

## ⚙️ Setup & Installation

### 1. Clone & Install

```bash
cd financeos
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/financeos
SESSION_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

### 3. Start MongoDB

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu/Linux
sudo systemctl start mongod

# Docker
docker run -d -p 27017:27017 mongo
```

### 4. Seed Sample Data (optional)

```bash
node utils/seed.js
# Login: demo@financeos.com / demo123
```

### 5. Start the App

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Visit: **http://localhost:3000**

---

## ✨ Features

- 🔐 **Auth** — Register / Login / Logout with bcrypt hashed passwords
- 📊 **Dashboard** — Live stats, area chart, donut chart, bar chart
- 💳 **Transactions** — Add, edit, delete, filter, paginate
- 🤖 **AI Advisor** — Claude-powered chat with access to your real financial data
- 🎯 **Budget Tracker** — Monthly budget vs actual spending
- 📱 **Responsive** — Works on mobile and desktop

---

## 🔑 API Keys

Get your **Gemini API key** (free) at: https://aistudio.google.com/app/apikey

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Runtime | Node.js |
| Framework | Express.js |
| Template | EJS + express-ejs-layouts |
| Database | MongoDB + Mongoose |
| Auth | express-session + bcryptjs |
| AI | Google Gemini API (gemini-1.5-flash) |
| Charts | Chart.js |
| Styling | Custom CSS (dark theme) |
