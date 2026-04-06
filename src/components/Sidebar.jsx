import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard, ArrowLeftRight, Lightbulb,
  Moon, Sun, Shield, Eye, Menu, X
} from "lucide-react";

export default function Sidebar() {
  const { role, setRole, darkMode, setDarkMode, activeTab, setActiveTab, transactions } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions", icon: ArrowLeftRight, badge: transactions.length },
    { id: "insights", label: "Insights", icon: Lightbulb },
  ];

  const handleNav = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
        <Menu size={18} color="var(--text)" />
      </button>

      {mobileOpen && (
        <div className="mobile-overlay visible" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">Fx</div>
            <div>
              <div className="logo-text">FinTrack</div>
              <div className="logo-sub">Personal Finance</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              className={`nav-item ${activeTab === id ? "active" : ""}`}
              onClick={() => handleNav(id)}
            >
              <Icon size={16} />
              {label}
              {badge && activeTab !== id && (
                <span className="nav-badge">{badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="role-section">
            <div className="role-label">Viewing as</div>
            <select
              className="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="viewer">👁 Viewer</option>
              <option value="admin">🛡 Admin</option>
            </select>
            <div style={{ marginTop: 8 }}>
              {role === "admin" ? (
                <span className="role-badge admin"><Shield size={10} /> Admin</span>
              ) : (
                <span className="role-badge viewer"><Eye size={10} /> Read only</span>
              )}
            </div>
          </div>

          <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            {darkMode ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </aside>
    </>
  );
}
