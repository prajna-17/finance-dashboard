import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";
import { useApp } from "../context/AppContext";
import { categoryColors, monthlyData } from "../data/mockData";
import { TrendingUp, TrendingDown, Zap, Target, AlertTriangle } from "lucide-react";

const fmt = (v) => `₹${Number(v).toLocaleString("en-IN")}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="tooltip-custom" style={{ padding: "10px 14px" }}>
      <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 13 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ fontSize: 12.5, color: p.fill || "var(--text)", marginBottom: 2 }}>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function Insights() {
  const { transactions } = useApp();

  const expenses = useMemo(() => transactions.filter(t => t.type === "expense"), [transactions]);
  const incomes = useMemo(() => transactions.filter(t => t.type === "income"), [transactions]);

  const categoryTotals = useMemo(() => {
    const map = {};
    expenses.forEach(t => {
      map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const topCategory = categoryTotals[0];
  const totalExpenses = expenses.reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0;

  const mar = monthlyData[2];
  const feb = monthlyData[1];
  const momChange = (((mar.expenses - feb.expenses) / feb.expenses) * 100).toFixed(1);
  const momInc = (((mar.income - feb.income) / feb.income) * 100).toFixed(1);

  const maxVal = categoryTotals[0]?.value || 1;

  const dailyAvg = (totalExpenses / 90).toFixed(0);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Insights</h1>
        <p className="page-subtitle">Understand your money better</p>
      </div>

      <div className="insights-grid">
        <div className="insight-card" style={{ animationDelay: "0.05s" }}>
          <div className="insight-label">🏆 Top Spending Category</div>
          <div className="insight-value" style={{ color: topCategory ? categoryColors[topCategory.name] : "var(--text)" }}>
            {topCategory?.name || "—"}
          </div>
          <div className="insight-note">{topCategory ? `₹${topCategory.value.toLocaleString("en-IN")} total spent` : "No data"}</div>
        </div>

        <div className="insight-card" style={{ animationDelay: "0.1s" }}>
          <div className="insight-label">💰 Savings Rate</div>
          <div className="insight-value" style={{ color: Number(savingsRate) > 20 ? "var(--green)" : "var(--red)" }}>
            {savingsRate}%
          </div>
          <div className="insight-note">
            {Number(savingsRate) > 20 ? "✅ Healthy savings rate" : "⚠️ Consider saving more"}
          </div>
        </div>

        <div className="insight-card" style={{ animationDelay: "0.15s" }}>
          <div className="insight-label">📅 Daily Average Spend</div>
          <div className="insight-value">₹{Number(dailyAvg).toLocaleString("en-IN")}</div>
          <div className="insight-note">Based on last 90 days</div>
        </div>

        <div className="insight-card" style={{ animationDelay: "0.2s" }}>
          <div className="insight-label">📊 Month-over-Month Expenses</div>
          <div className="insight-value" style={{ color: Number(momChange) > 0 ? "var(--red)" : "var(--green)", display: "flex", alignItems: "center", gap: 8 }}>
            {Number(momChange) > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            {Math.abs(momChange)}%
          </div>
          <div className="insight-note">
            {Number(momChange) > 0 ? `Expenses up vs February` : `Expenses down vs February`}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="chart-title">Monthly Comparison</div>
          <div className="chart-sub">Income vs Expenses by month</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barGap={4} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text3)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text3)" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Income" fill="var(--green)" radius={[5, 5, 0, 0]} maxBarSize={32} />
              <Bar dataKey="expenses" name="Expenses" fill="var(--red)" radius={[5, 5, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="chart-title">Spending by Category</div>
          <div className="chart-sub">Where your money goes</div>
          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            {categoryTotals.map((cat, i) => (
              <div key={cat.name} className="spending-bar-item" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="bar-label-row">
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{cat.name}</span>
                  <span style={{ fontSize: 12.5, color: "var(--text2)", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
                    ₹{cat.value.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${(cat.value / maxVal) * 100}%`,
                      background: categoryColors[cat.name] || "#94a3b8",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="chart-title" style={{ marginBottom: 16 }}>💡 Smart Observations</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {topCategory && (
            <div style={{ display: "flex", gap: 12, padding: "14px", background: "var(--bg2)", borderRadius: 10 }}>
              <Zap size={18} color="var(--accent)" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>Highest category: {topCategory.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--text2)" }}>
                  You've spent ₹{topCategory.value.toLocaleString("en-IN")} on {topCategory.name.toLowerCase()} — that's {((topCategory.value / totalExpenses) * 100).toFixed(1)}% of your total expenses.
                </div>
              </div>
            </div>
          )}
          {Number(momChange) > 10 && (
            <div style={{ display: "flex", gap: 12, padding: "14px", background: "var(--red-bg)", borderRadius: 10 }}>
              <AlertTriangle size={18} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>Spending increased this month</div>
                <div style={{ fontSize: 12.5, color: "var(--text2)" }}>
                  Your expenses went up by {momChange}% compared to last month. Consider reviewing discretionary spending.
                </div>
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 12, padding: "14px", background: Number(savingsRate) > 20 ? "var(--green-bg)" : "var(--red-bg)", borderRadius: 10 }}>
            <Target size={18} color={Number(savingsRate) > 20 ? "var(--green)" : "var(--red)"} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3 }}>Savings rate: {savingsRate}%</div>
              <div style={{ fontSize: 12.5, color: "var(--text2)" }}>
                {Number(savingsRate) > 30
                  ? "Great job! You're saving more than 30% of your income. Keep it up."
                  : Number(savingsRate) > 20
                  ? "You're saving 20–30% — solid financial habit. Try to push toward 30%."
                  : "Aim for at least 20% savings rate. Small daily cuts add up quickly."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
