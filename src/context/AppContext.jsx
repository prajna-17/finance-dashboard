import React, { createContext, useContext, useState, useEffect } from "react";
import { mockTransactions } from "../data/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState("viewer");
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("fin_transactions");
    return saved ? JSON.parse(saved) : mockTransactions;
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("fin_dark") === "true";
  });
  const [filters, setFilters] = useState({ type: "all", category: "all", search: "" });
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    localStorage.setItem("fin_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("fin_dark", darkMode);
  }, [darkMode]);

  const addTransaction = (txn) => {
    const newTxn = { ...txn, id: Date.now() };
    setTransactions((prev) => [newTxn, ...prev]);
  };

  const editTransaction = (id, updated) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTransactions = transactions.filter((t) => {
    const typeMatch = filters.type === "all" || t.type === filters.type;
    const catMatch = filters.category === "all" || t.category === filters.category;
    const searchMatch =
      filters.search === "" ||
      t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.category.toLowerCase().includes(filters.search.toLowerCase());
    return typeMatch && catMatch && searchMatch;
  });

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0));
  const balance = totalIncome - totalExpenses;

  return (
    <AppContext.Provider
      value={{
        role, setRole,
        transactions, filteredTransactions,
        addTransaction, editTransaction, deleteTransaction,
        darkMode, setDarkMode,
        filters, setFilters,
        activeTab, setActiveTab,
        totalIncome, totalExpenses, balance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
