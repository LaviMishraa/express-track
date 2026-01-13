const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  try {
    const expense = await Expense.create({
      ...req.body,
      user: req.user.id,
    });
    res.status(201).json(expense);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(expenses);
};

exports.getExpenseSummary = async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id });
  let income = 0, expense = 0;

  expenses.forEach(e =>
    e.type === "income" ? income += e.amount : expense += e.amount
  );

  res.json({
    totalIncome: income,
    totalExpense: expense,
    balance: income - expense,
  });
};
// DELETE EXPENSE
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
