const Transaction = require("../models/Transaction");

// GET /transactions
exports.getTransactions = async (req, res) => {
  try {
    const { type, category, sort = "date_desc", page = 1 } = req.query;
    const limit = 15;
    const skip = (page - 1) * limit;

    const query = { user: req.session.userId };
    if (type && type !== "all") query.type = type;
    if (category && category !== "all") query.category = category;

    const sortMap = {
      date_desc: { date: -1 },
      date_asc: { date: 1 },
      amount_desc: { amount: -1 },
      amount_asc: { amount: 1 },
    };

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort(sortMap[sort] || { date: -1 })
      .skip(skip)
      .limit(limit);

    res.render("transactions/index", {
      title: "Transactions — FinanceOS",
      transactions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total,
      filters: { type, category, sort },
      categories: ["Food", "Housing", "Transport", "Shopping", "Health", "Entertainment", "Savings", "Income", "Other"],
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Could not load transactions.");
    res.redirect("/dashboard");
  }
};

// GET /transactions/new
exports.getNewTransaction = (req, res) => {
  res.render("transactions/new", {
    title: "Add Transaction — FinanceOS",
    categories: ["Food", "Housing", "Transport", "Shopping", "Health", "Entertainment", "Savings", "Income", "Other"],
  });
};

// POST /transactions
exports.postTransaction = async (req, res) => {
  try {
    const { name, amount, type, category, note, date } = req.body;
    await Transaction.create({
      user: req.session.userId,
      name,
      amount: parseFloat(amount),
      type,
      category,
      note,
      date: date ? new Date(date) : new Date(),
    });
    req.flash("success", "Transaction added successfully!");
    res.redirect("/transactions");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to add transaction.");
    res.redirect("/transactions/new");
  }
};

// GET /transactions/:id/edit
exports.getEditTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findOne({ _id: req.params.id, user: req.session.userId });
    if (!tx) { req.flash("error", "Transaction not found."); return res.redirect("/transactions"); }
    res.render("transactions/edit", {
      title: "Edit Transaction — FinanceOS",
      tx,
      categories: ["Food", "Housing", "Transport", "Shopping", "Health", "Entertainment", "Savings", "Income", "Other"],
    });
  } catch (err) {
    req.flash("error", "Failed to load transaction.");
    res.redirect("/transactions");
  }
};

// PUT /transactions/:id
exports.putTransaction = async (req, res) => {
  try {
    const { name, amount, type, category, note, date } = req.body;
    await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.session.userId },
      { name, amount: parseFloat(amount), type, category, note, date: new Date(date) }
    );
    req.flash("success", "Transaction updated!");
    res.redirect("/transactions");
  } catch (err) {
    req.flash("error", "Failed to update transaction.");
    res.redirect("/transactions");
  }
};

// DELETE /transactions/:id
exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findOneAndDelete({ _id: req.params.id, user: req.session.userId });
    req.flash("success", "Transaction deleted.");
    res.redirect("/transactions");
  } catch (err) {
    req.flash("error", "Failed to delete transaction.");
    res.redirect("/transactions");
  }
};

// GET /transactions/stats (JSON API for charts)
exports.getStats = async (req, res) => {
  try {
    const txs = await Transaction.find({ user: req.session.userId });
    const now = new Date();
    const monthly = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const slice = txs.filter((t) => t.date >= start && t.date <= end);
      monthly.push({
        month: d.toLocaleString("default", { month: "short" }),
        income: slice.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
        expenses: slice.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
      });
    }
    res.json({ monthly });
  } catch (err) {
    res.status(500).json({ error: "Stats error" });
  }
};
