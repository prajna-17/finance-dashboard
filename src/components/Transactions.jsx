import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { categoryColors } from "../data/mockData";
import { Search, Plus, Pencil, Trash2, ArrowUpDown, Download } from "lucide-react";

const CATEGORIES = ["Food","Shopping","Transport","Entertainment","Utilities","Health","Groceries","Education","Income"];

function Modal({ mode, txn, onClose, onSave }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState(
    isEdit ? { ...txn, amount: Math.abs(txn.amount) } :
    { date: new Date().toISOString().split("T")[0], description: "", amount: "", category: "Food", type: "expense" }
  );

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.description || !form.amount || !form.date) return;
    const amount = form.type === "expense" ? -Math.abs(Number(form.amount)) : Math.abs(Number(form.amount));
    onSave({ ...form, amount });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{isEdit ? "Edit Transaction" : "Add Transaction"}</div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input className="form-input" value={form.description}
            onChange={(e) => set("description", e.target.value)} placeholder="e.g. Swiggy Order" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input className="form-input" type="number" value={form.amount}
              onChange={(e) => set("amount", e.target.value)} placeholder="0" />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={form.date}
              onChange={(e) => set("date", e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-input" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-input" value={form.type} onChange={(e) => set("type", e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Transactions() {
  const { role, filteredTransactions, filters, setFilters, addTransaction, editTransaction, deleteTransaction, transactions } = useApp();
  const [modal, setModal] = useState(null); // null | { mode: 'add' | 'edit', txn? }
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  const categories = useMemo(() => ["all", ...new Set(transactions.map(t => t.category))], [transactions]);

  const sorted = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === "amount") { va = Math.abs(va); vb = Math.abs(vb); }
      if (sortKey === "date") { va = new Date(va); vb = new Date(vb); }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredTransactions, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const handleSave = (data) => {
    if (modal.mode === "edit") editTransaction(modal.txn.id, data);
    else addTransaction(data);
    setModal(null);
  };

  const handleExport = () => {
    const headers = "Date,Description,Category,Type,Amount";
    const rows = filteredTransactions.map(t =>
      `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`
    ).join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = "transactions.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const catEmoji = {
    Food: "🍜", Shopping: "🛍", Transport: "🚌", Entertainment: "🎬",
    Utilities: "💡", Health: "💊", Groceries: "🛒", Education: "📚", Income: "💵",
  };

  return (
    <div>
      {modal && (
        <Modal mode={modal.mode} txn={modal.txn} onClose={() => setModal(null)} onSave={handleSave} />
      )}

      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">{sorted.length} records found</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline" onClick={handleExport}>
            <Download size={13} /> Export
          </button>
          {role === "admin" && (
            <button className="btn btn-primary" onClick={() => setModal({ mode: "add" })}>
              <Plus size={14} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-wrap">
          <Search size={14} />
          <input className="search-input" placeholder="Search transactions..."
            value={filters.search} onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))} />
        </div>
        <select className="filter-select" value={filters.type}
          onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="filter-select" value={filters.category}
          onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}>
          {categories.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
        </select>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-text">No transactions match your filters</div>
        </div>
      ) : (
        <div className="txn-table-wrap">
          <table className="txn-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort("date")}>Date <ArrowUpDown size={10} style={{ display: "inline", verticalAlign: "middle", opacity: 0.5 }} /></th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th onClick={() => toggleSort("amount")}>Amount <ArrowUpDown size={10} style={{ display: "inline", verticalAlign: "middle", opacity: 0.5 }} /></th>
                {role === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {sorted.map((t, i) => (
                <tr key={t.id} style={{ animationDelay: `${Math.min(i, 15) * 0.025}s` }}>
                  <td className="txn-date">{new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}</td>
                  <td className="txn-desc">{t.description}</td>
                  <td>
                    <span className="cat-pill" style={{ background: (categoryColors[t.category] || "#94a3b8") + "22", color: categoryColors[t.category] || "#94a3b8" }}>
                      {catEmoji[t.category]} {t.category}
                    </span>
                  </td>
                  <td><span className={`type-pill ${t.type}`}>{t.type}</span></td>
                  <td className={`amount-cell ${t.type === "income" ? "positive" : "negative"}`}>
                    {t.type === "income" ? "+" : "−"}₹{Math.abs(t.amount).toLocaleString("en-IN")}
                  </td>
                  {role === "admin" && (
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon" title="Edit" onClick={() => setModal({ mode: "edit", txn: t })}>
                          <Pencil size={13} />
                        </button>
                        <button className="btn-icon danger" title="Delete" onClick={() => deleteTransaction(t.id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
