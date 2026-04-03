import React, { useContext } from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import { DashboardContext } from "../context/DashboardContext";

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"];

const Insights = () => {
  const context = useContext(DashboardContext);

  if (!context) {
    return <div className="p-6 text-gray-500">Loading insights...</div>;
  }

  const { transactions } = context;

  if (!transactions.length) {
    return <div className="p-6 text-gray-500">No data available</div>;
  }

  // -----------------------------
  // CATEGORY ANALYSIS
  // -----------------------------
  const categoryTotals: any = {};
  transactions
    .filter((t: any) => t.type === "expense")
    .forEach((t: any) => {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + t.amount;
    });

  const pieData = Object.keys(categoryTotals).map((key) => ({
    name: key,
    value: categoryTotals[key],
  }));

  const highestCategory =
    Object.entries(categoryTotals).sort((a: any, b: any) => b[1] - a[1])[0];

  // -----------------------------
  // MONTHLY ANALYSIS
  // -----------------------------
  const monthly: any = {};
  transactions.forEach((t: any) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
    });

    if (!monthly[month]) {
      monthly[month] = { income: 0, expense: 0 };
    }

    monthly[month][t.type] += t.amount;
  });

  const lineData = Object.keys(monthly).map((m) => ({
    month: m,
    income: monthly[m].income,
    expense: monthly[m].expense,
  }));

  // -----------------------------
  // TOTALS
  // -----------------------------
  const totalIncome = transactions
    .filter((t: any) => t.type === "income")
    .reduce((a: number, b: any) => a + b.amount, 0);

  const totalExpense = transactions
    .filter((t: any) => t.type === "expense")
    .reduce((a: number, b: any) => a + b.amount, 0);

  const avgIncome = totalIncome / Object.keys(monthly).length;
  const avgExpense = totalExpense / Object.keys(monthly).length;

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Insights</h1>
        <p className="text-gray-500 mt-1">
          Smart analysis of your financial activity
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
          <p className="text-sm text-gray-500">Top Spending Category</p>
          <h2 className="text-xl font-semibold mt-2">
            {highestCategory
              ? `${highestCategory[0]} (₹${highestCategory[1]})`
              : "N/A"}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
          <p className="text-sm text-gray-500">Average Monthly Income</p>
          <h2 className="text-xl text-green-600 font-semibold mt-2">
            ₹{avgIncome.toFixed(2)}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
          <p className="text-sm text-gray-500">Average Monthly Expense</p>
          <h2 className="text-xl text-red-500 font-semibold mt-2">
            ₹{avgExpense.toFixed(2)}
          </h2>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* PIE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-sm text-gray-500 mb-4">
            Spending Distribution
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-sm text-gray-500 mb-4">
            Monthly Comparison
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="income" stroke="#22C55E" />
              <Line dataKey="expense" stroke="#EF4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* EXTRA INSIGHTS */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-sm text-gray-500 mb-3">Key Observations</h2>

        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Total transactions: <b>{transactions.length}</b></li>
          <li>Income is {totalIncome > totalExpense ? "higher" : "lower"} than expenses</li>
          <li>Top category contributes most to spending pattern</li>
        </ul>
      </div>

    </div>
  );
};

export default Insights;