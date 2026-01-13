const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes (ORDER MATTERS)
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// test
app.get("/", (req, res) => {
  res.send("Server running");
});

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(console.error);

// start
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
