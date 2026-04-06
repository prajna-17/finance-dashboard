import React, { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from "recharts";
import { useApp } from "../context/AppContext";
import { monthlyData, categoryColors } from "../data/mockData";
import { useCountUp } from "../hooks/useCountUp";
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from "lucide-react";

function StatCard({ label, value, sub, className, icon: Icon, trend }) {
  const animated = useCountUp(value, 900);
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(animated);

  return (
    <div className={`stat-card ${className}`}>
      {Icon && <div className="stat-icon"><Icon size={40} /></div>}
      <div className="stat-label">{label}</div>
      <div className={`stat-value count-anim ${className === "income" ? "green" : className === "expense" ? "red" : ""}`}>
        {formatted}
      </div>
      <div className="stat-sub">
        {trend === "up" ? <TrendingUp size={12} color="var(--green)" /> : trend === "down" ? <TrendingDown size={12} color="var(--red)" /> : null}
        {sub}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const fmt = (v) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(v);
  return (
    <div className="tooltip-custom" style={{ padding: "10px 14px" }}>
      <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 13 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ fontSize: 12.5, color: p.color, marginBottom: 2 }}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { transactions, totalIncome, totalExpenses, balance, setActiveTab } = useApp();

  const recent = useMemo(() => [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6), [transactions]);

  const categoryBreakdown = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [transactions]);

  const catEmoji = {
    Food: "🍜", Shopping: "🛍", Transport: "🚌", Entertainment: "🎬",
    Utilities: "💡", Health: "💊", Groceries: "🛒", Education: "📚",
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Good morning 👋</h1>
        <p className="page-subtitle">Here's what's happening with your money</p>
      </div>

      <div className="stat-grid">
        <StatCard label="Net Balance" value={balance} sub="All time net" className="balance" icon={Wallet} />
        <StatCard label="Total Income" value={totalIncome} sub="All transactions" className="income" icon={TrendingUp} trend="up" />
        <StatCard label="Total Expenses" value={totalExpenses} sub="All transactions" className="expense" icon={TrendingDown} trend="down" />
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="chart-title">Monthly Trend</div>
          <div className="chart-sub">Income vs Expenses over 3 months</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--green)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--red)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--red)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text3)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text3)" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="var(--green)" strokeWidth={2}
                fill="url(#incGrad)" dot={{ fill: "var(--green)", r: 4, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="var(--red)" strokeWidth={2}
                fill="url(#expGrad)" dot={{ fill: "var(--red)", r: 4, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="chart-title">Spending Breakdown</div>
          <div className="chart-sub">By category</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                paddingAngle={3} dataKey="value" animationBegin={0} animationDuration={800}>
                {categoryBreakdown.map((entry, i) => (
                  <Cell key={i} fill={categoryColors[entry.name] || "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, ""]} />
              <Legend iconType="circle" iconSize={8}
                formatter={(v) => <span style={{ fontSize: 11.5, color: "var(--text2)" }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <div>
            <div className="chart-title">Recent Transactions</div>
            <div className="chart-sub" style={{ marginBottom: 0 }}>Your latest activity</div>
          </div>
          <button className="see-all" onClick={() => setActiveTab("transactions")}>
            View all <ArrowRight size={11} style={{ display: "inline", verticalAlign: "middle" }} />
          </button>
        </div>
        <div className="recent-list">
          {recent.map((t, i) => (
            <div key={t.id} className="recent-item" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="recent-dot" style={{ background: categoryColors[t.category] + "22" }}>
                <span>{catEmoji[t.category] || "💰"}</span>
              </div>
              <div className="recent-info">
                <div className="recent-desc">{t.description}</div>
                <div className="recent-cat">{t.category} · {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
              </div>
              <div className={`recent-amount ${t.type === "income" ? "amount-cell positive" : "amount-cell negative"}`}>
                {t.type === "income" ? "+" : "−"}₹{Math.abs(t.amount).toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
