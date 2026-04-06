import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  Moon,
  Sun,
  Shield,
  Eye,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const {
    role,
    setRole,
    darkMode,
    setDarkMode,
    activeTab,
    setActiveTab,
    transactions,
  } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileOpen]);

  const navItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    {
      id: "transactions",
      label: "Transactions",
      icon: ArrowLeftRight,
      badge: transactions.length,
    },
    { id: "insights", label: "Insights", icon: Lightbulb },
  ];

  const handleNav = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <div className="logo-mark">
          <div className="logo-icon">Fx</div>
          <div className="logo-text">FinTrack</div>
        </div>
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
          <Menu size={18} color="var(--text)" />
        </button>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar drawer */}
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">Fx</div>
            <div>
              <div className="logo-text">FinTrack</div>
              <div className="logo-sub">Personal Finance</div>
            </div>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setMobileOpen(false)}
          >
            <X size={16} color="var(--text2)" />
          </button>
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
                <span className="role-badge admin">
                  <Shield size={10} /> Admin
                </span>
              ) : (
                <span className="role-badge viewer">
                  <Eye size={10} /> Read only
                </span>
              )}
            </div>
          </div>
          <button
            className="dark-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            {darkMode ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="mobile-bottom-nav">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`bottom-nav-item ${activeTab === id ? "active" : ""}`}
            onClick={() => handleNav(id)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
        <button className="bottom-nav-item" onClick={() => setMobileOpen(true)}>
          <Menu size={20} />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}
