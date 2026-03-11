const Transaction = require("../models/Transaction");
const User = require("../models/User");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);

    // Get current month range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // All-time transactions
    const allTransactions = await Transaction.find({ user: userId }).sort({ date: -1 });

    // This month's transactions
    const monthTransactions = allTransactions.filter(
      (t) => t.date >= startOfMonth && t.date <= endOfMonth
    );

    // Totals
    const totalIncome = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const totalExpenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

    // Category breakdown
    const categories = ["Food", "Housing", "Transport", "Shopping", "Health", "Entertainment", "Savings", "Other"];
    const categoryData = categories.map((cat) => ({
      name: cat,
      value: monthTransactions
        .filter((t) => t.category === cat && t.type === "expense")
        .reduce((s, t) => s + t.amount, 0),
    })).filter((c) => c.value > 0);

    // Last 6 months data
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const txs = allTransactions.filter((t) => t.date >= start && t.date <= end);
      monthlyData.push({
        month: d.toLocaleString("default", { month: "short" }),
        income: txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
        expenses: txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
      });
    }

    res.render("dashboard/index", {
      title: "Dashboard — FinanceOS",
      user,
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
      categoryData: JSON.stringify(categoryData),
      monthlyData: JSON.stringify(monthlyData),
      recentTransactions: allTransactions.slice(0, 8),
      monthBudget: user.monthlyBudget || 0,
      budgetUsed: totalExpenses,
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to load dashboard.");
    res.redirect("/auth/login");
  }
};
