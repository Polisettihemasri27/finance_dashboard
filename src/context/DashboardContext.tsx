import React, { createContext, useState, useEffect } from "react";

export const DashboardContext = createContext<any>(null);

export const DashboardProvider = ({ children }: any) => {
  const [role, setRole] = useState("admin");
  const [darkMode, setDarkMode] = useState(false);

  const [transactions, setTransactions] = useState<any[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, date: "2024-01-10", amount: 5000, category: "Salary", type: "income" },
          { id: 2, date: "2024-01-15", amount: 1200, category: "Food", type: "expense" },
          { id: 3, date: "2024-02-01", amount: 2000, category: "Freelance", type: "income" },
          { id: 4, date: "2024-02-05", amount: 800, category: "Shopping", type: "expense" },
        ];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const addTransaction = (tx: any) => {
    setTransactions((prev) => [...prev, { ...tx, id: Date.now() }]);
  };

  return (
    <DashboardContext.Provider
      value={{
        transactions,
        role,
        setRole,
        addTransaction,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};