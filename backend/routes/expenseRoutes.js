const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  addExpense,
  getExpenses,
  getExpenseSummary,
  deleteExpense
} = require("../controllers/expenseController");

router.post("/", authMiddleware, addExpense);
router.get("/", authMiddleware, getExpenses);
router.get("/summary", authMiddleware, getExpenseSummary);
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
