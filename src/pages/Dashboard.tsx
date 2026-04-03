import React, { useContext } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { DashboardContext } from "../context/DashboardContext";

const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444"];

const Dashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) return null;

  const { transactions, role, setRole, darkMode, setDarkMode } = context;

  const income = transactions.filter((t:any) => t.type === "income").reduce((a:any,b:any)=>a+b.amount,0);
  const expense = transactions.filter((t:any) => t.type === "expense").reduce((a:any,b:any)=>a+b.amount,0);

  const monthly:any = {};
  transactions.forEach((t:any)=>{
    const month = new Date(t.date).toLocaleString("default",{month:"short"});
    if(!monthly[month]) monthly[month]={income:0,expense:0};
    monthly[month][t.type]+=t.amount;
  });

  const lineData = Object.keys(monthly).map(m=>({
    month:m,
    income:monthly[m].income,
    expense:monthly[m].expense
  }));

  const category:any = {};
  transactions.filter((t:any)=>t.type==="expense").forEach((t:any)=>{
    category[t.category]=(category[t.category]||0)+t.amount;
  });

  const pieData = Object.keys(category).map(c=>({name:c,value:category[c]}));

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="flex gap-3">
          {/* Role Switch */}
          <select
            value={role}
            onChange={(e)=>setRole(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>

          {/* Dark Mode */}
          <button
            onClick={()=>setDarkMode(!darkMode)}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <p className="text-gray-500">Total Balance</p>
          <h2 className="text-2xl font-bold">₹{income-expense}</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <p className="text-gray-500">Income</p>
          <h2 className="text-2xl text-green-500">₹{income}</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <p className="text-gray-500">Expenses</p>
          <h2 className="text-2xl text-red-500">₹{expense}</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="mb-4">Monthly Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="month"/>
              <YAxis/>
              <Tooltip/>
              <Line dataKey="income" stroke="#22C55E"/>
              <Line dataKey="expense" stroke="#EF4444"/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h2 className="mb-4">Spending Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100}>
                {pieData.map((_:any,i:number)=>(
                  <Cell key={i} fill={COLORS[i%COLORS.length]}/>
                ))}
              </Pie>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;