const Transaction = require("../models/Transaction");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// GET /ai
exports.getAIPage = (req, res) => {
  res.render("ai/index", { title: "AI Advisor — FinanceOS" });
};

// POST /ai/chat (JSON API)
exports.postChat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    const userId = req.session.userId;
  
    if (!message || !message.trim()) {
      return res.status(400).json({ reply: "Message cannot be empty.", success: false });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set in .env");
      return res.status(500).json({ reply: "AI is not configured. Please set GEMINI_API_KEY in your .env file.", success: false });
    }

    // Fetch user's financial data for context
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const txs = await Transaction.find({ user: userId });
    const monthTxs = txs.filter((t) => new Date(t.date) >= startOfMonth);

    const totalIncome = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpenses = monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

    const categories = ["Food", "Housing", "Transport", "Shopping", "Health", "Entertainment", "Savings", "Other"];
    const catBreakdown = categories
      .map((c) => ({
        name: c,
        total: monthTxs.filter((t) => t.category === c && t.type === "expense").reduce((s, t) => s + t.amount, 0),
      }))
      .filter((c) => c.total > 0)
      .map((c) => `${c.name}: $${c.total.toFixed(2)}`)
      .join(", ");

    const recentTxs = txs
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)
      .map((t) => `${t.name} (${t.type === "income" ? "+" : "-"}$${t.amount}, ${t.category})`)
      .join("; ");

    const systemInstruction = `You are FinanceOS AI, a smart and friendly personal finance advisor.
You have real-time access to the user's financial data:
- This month's income: $${totalIncome.toFixed(2)}
- This month's expenses: $${totalExpenses.toFixed(2)}
- Net balance: $${balance.toFixed(2)}
- Savings rate: ${savingsRate}%
- Spending by category: ${catBreakdown || "No expenses yet"}
- Recent transactions: ${recentTxs || "No transactions yet"}

Be concise (under 180 words), specific with their numbers, and give actionable advice.
Use a friendly but professional tone. Format with line breaks for readability.`;

    // Initialise model with system instruction
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction,
    });

    // Build valid Gemini history — must strictly alternate user/model,
    // must have even number of entries (pairs), and roles must be correct.
    const geminiHistory = [];
    for (let i = 0; i + 1 < history.length; i += 2) {
      const userMsg = history[i];
      const modelMsg = history[i + 1];
      if (
        userMsg && modelMsg &&
        userMsg.role === "user" && modelMsg.role === "assistant" &&
        userMsg.content && modelMsg.content
      ) {
        geminiHistory.push({ role: "user", parts: [{ text: userMsg.content }] });
        geminiHistory.push({ role: "model", parts: [{ text: modelMsg.content }] });
      }
    }

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message.trim());
    const reply = result.response.text();

    if (!reply) {
      return res.status(500).json({ reply: "Gemini returned an empty response.", success: false });
    }

    res.json({ reply, success: true });
  } catch (err) {
    console.error("Gemini AI Error:", err.message);
    console.error("Full error:", err);
    // Send a more descriptive error to help debugging
    const userMessage = err.message.includes("API_KEY")
      ? "Invalid Gemini API key. Please check your .env file."
      : err.message.includes("quota")
      ? "Gemini API quota exceeded. Please try again later."
      : "AI advisor is temporarily unavailable. Check server logs.";
    res.status(500).json({ reply: userMessage, success: false });
  }
};
