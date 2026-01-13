import { useEffect, useState } from "react";
import API from "../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    type: "expense",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const s = await API.get("/expenses/summary");
    const e = await API.get("/expenses");
    setSummary(s.data);
    setExpenses(e.data);
  };

  const chartData = [
    { name: "Income", amount: summary?.totalIncome || 0 },
    { name: "Expense", amount: summary?.totalExpense || 0 },
  ];

  const addExpense = async (e) => {
    e.preventDefault();
    await API.post("/expenses", {
      ...form,
      amount: Number(form.amount),
    });
    setForm({ title: "", amount: "", category: "", type: "expense" });
    loadData();
  };

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      loadData();
    } catch {
      alert("Delete failed");
    }
  };

  if (!summary) return <p className="p-6 text-gray-300">Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-gray-200">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-400">
            Expense Dashboard
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="text-sm text-red-400 hover:underline"
          >
            Logout
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-5 rounded-xl shadow-lg">
            <p className="text-green-200 text-sm">Income</p>
            <p className="text-white text-2xl font-bold">
              ₹{summary.totalIncome}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-red-800 p-5 rounded-xl shadow-lg">
            <p className="text-red-200 text-sm">Expense</p>
            <p className="text-white text-2xl font-bold">
              ₹{summary.totalExpense}
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-5 rounded-xl shadow-lg">
            <p className="text-indigo-200 text-sm">Balance</p>
            <p className="text-white text-2xl font-bold">
              ₹{summary.balance}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-slate-950 p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Income vs Expense
          </h2>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={70}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#15803d" />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#991b1b" />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#c7d2fe" tickLine={false} />
                <YAxis stroke="#c7d2fe" tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1e293b",
                    borderRadius: "8px",
                  }}
                />

                <Bar dataKey="amount" radius={[10, 10, 0, 0]} animationDuration={900}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.name === "Income"
                          ? "url(#incomeGradient)"
                          : "url(#expenseGradient)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Add Expense */}
        <form onSubmit={addExpense} className="bg-slate-950 p-5 rounded-xl shadow mb-8">
          <h2 className="font-semibold mb-4">Add Transaction</h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input
              placeholder="Title"
              className="bg-slate-900 p-2 rounded"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <input
              type="number"
              placeholder="Amount"
              className="bg-slate-900 p-2 rounded"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />

            <input
              placeholder="Category"
              className="bg-slate-900 p-2 rounded"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />

            <select
              className="bg-slate-900 p-2 rounded"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded text-white">
            Add
          </button>
        </form>

        {/* Transactions */}
        <div className="bg-slate-950 p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Transactions</h2>

          {expenses.map((ex) => (
            <div
              key={ex._id}
              className="flex justify-between items-center py-2 border-b border-slate-800 hover:bg-slate-900 transition"
            >
              <span>{ex.title}</span>

              <div className="flex items-center gap-4">
                <span className={ex.type === "income" ? "text-green-400" : "text-red-400"}>
                  ₹{ex.amount}
                </span>
                <button
                  onClick={() => deleteExpense(ex._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
