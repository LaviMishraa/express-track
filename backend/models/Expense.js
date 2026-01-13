const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Expense",
  new mongoose.Schema(
    {
      title: String,
      amount: Number,
      category: String,
      type: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
  )
);
