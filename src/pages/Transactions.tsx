import React, { useContext, useState } from "react";
import { DashboardContext } from "../context/DashboardContext";

const Transactions = () => {
  const context = useContext(DashboardContext);
  if (!context) return null;

  const { transactions, role, addTransaction } = context;

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");

  const [form, setForm] = useState({
    category: "",
    amount: "",
    type: "expense",
    date: ""
  });

  // FILTER
  const filtered = transactions.filter((t: any) =>
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  // SORT
  const sorted = [...filtered].sort((a: any, b: any) => {
    if (sortOrder === "latest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });

  const handleAdd = () => {
    if (!form.category || !form.amount || !form.date) {
      alert("Fill all fields");
      return;
    }

    addTransaction({
      ...form,
      amount: Number(form.amount)
    });

    setForm({ category: "", amount: "", type: "expense", date: "" });
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
        <span className="text-sm text-gray-500">
          Role: <b>{role}</b>
        </span>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4">

        <input
          placeholder="Search category..."
          className="border rounded-lg px-4 py-2 w-full md:w-1/2 focus:ring-2 focus:ring-indigo-400"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/4"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>

      </div>

      {/* ADD FORM */}
      {role === "admin" && (
        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4 border">
          <h2 className="text-lg font-semibold text-gray-700">
            Add New Transaction
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Category"
              className="border p-2 rounded-lg"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            <input
              type="number"
              placeholder="Amount"
              className="border p-2 rounded-lg"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            <select
              className="border p-2 rounded-lg"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              type="date"
              className="border p-2 rounded-lg"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg w-full"
          >
            + Add Transaction
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {sorted.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          No transactions found
        </div>
      ) : (
        <div className="grid gap-4">

          {sorted.map((t: any) => (
            <div
              key={t.id}
              className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition flex justify-between items-center"
            >

              {/* LEFT */}
              <div>
                <p className="font-semibold text-gray-800">{t.category}</p>
                <p className="text-sm text-gray-500">
                  {new Date(t.date).toLocaleDateString()}
                </p>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    t.type === "income"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  ₹{t.amount}
                </p>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    t.type === "income"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {t.type}
                </span>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Transactions;