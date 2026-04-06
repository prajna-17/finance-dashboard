import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Insights from "./components/Insights";
import "./index.css";

function AppShell() {
  const { darkMode, activeTab } = useApp();

  return (
    <div className={`app-root ${darkMode ? "dark" : ""}`}>
      <Sidebar />
      <main className="main-content">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "transactions" && <Transactions />}
        {activeTab === "insights" && <Insights />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
