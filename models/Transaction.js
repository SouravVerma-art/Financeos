const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: {
      type: String,
      enum: ["Food", "Housing", "Transport", "Shopping", "Health", "Entertainment", "Savings", "Income", "Other"],
      default: "Other",
    },
    note: { type: String, trim: true, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Virtual: signed amount (negative for expense)
transactionSchema.virtual("signedAmount").get(function () {
  return this.type === "expense" ? -Math.abs(this.amount) : Math.abs(this.amount);
});

module.exports = mongoose.model("Transaction", transactionSchema);
