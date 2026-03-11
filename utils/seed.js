// require("dotenv").config();
require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const SAMPLE_TRANSACTIONS = [
  { name: "Monthly Salary", amount: 5200, type: "income", category: "Income", note: "March salary" },
  { name: "Freelance Project", amount: 800, type: "income", category: "Income", note: "Web dev project" },
  { name: "Apartment Rent", amount: 1500, type: "expense", category: "Housing" },
  { name: "Electricity Bill", amount: 85, type: "expense", category: "Housing" },
  { name: "Grocery Store", amount: 145, type: "expense", category: "Food" },
  { name: "Uber Eats", amount: 42, type: "expense", category: "Food" },
  { name: "Netflix", amount: 18, type: "expense", category: "Entertainment" },
  { name: "Spotify", amount: 10, type: "expense", category: "Entertainment" },
  { name: "Gym Membership", amount: 45, type: "expense", category: "Health" },
  { name: "Amazon Purchase", amount: 95, type: "expense", category: "Shopping" },
  { name: "Bus Pass", amount: 60, type: "expense", category: "Transport" },
  { name: "Savings Transfer", amount: 300, type: "expense", category: "Savings" },
  { name: "Doctor Visit", amount: 55, type: "expense", category: "Health" },
  { name: "Coffee Shop", amount: 28, type: "expense", category: "Food" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Create demo user
    const existing = await User.findOne({ email: "demo@financeos.com" });
    if (existing) {
      console.log("Demo user already exists. Skipping seed.");
      process.exit(0);
    }

    const user = await User.create({
      name: "Demo User",
      email: "demo@financeos.com",
      password: "demo123",
      monthlyBudget: 3000,
    });
    console.log("✅ Created demo user: demo@financeos.com / demo123");

    // Create transactions for current month
    const now = new Date();
    for (let i = 0; i < SAMPLE_TRANSACTIONS.length; i++) {
      const tx = SAMPLE_TRANSACTIONS[i];
      await Transaction.create({
        user: user._id,
        ...tx,
        date: new Date(now.getFullYear(), now.getMonth(), i + 1),
      });
    }
    console.log(`✅ Created ${SAMPLE_TRANSACTIONS.length} sample transactions`);
    console.log("\n🎉 Seed complete! Login at http://localhost:3000/auth/login");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
