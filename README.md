# FinTrack – Personal Finance Dashboard

A clean, interactive finance dashboard built with React.

## Setup & Running

```bash
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000)

## Features

### Dashboard Overview

- Summary cards: Balance, Income, Expenses with animated counters
- Area chart: Monthly income vs expenses trend
- Donut chart: Spending breakdown by category
- Recent transactions list

### Transactions

- Full transaction table with date, description, category, type, amount
- Filter by type (income/expense) and category
- Search by description or category
- Sort by date or amount
- Export to CSV

### Role-Based UI

Switch between roles using the sidebar dropdown:

- **Viewer** – read-only access, no edit/delete/add controls
- **Admin** – can add, edit, and delete transactions via modal form

### Insights

- Top spending category
- Savings rate with health indicator
- Daily average spend
- Month-over-month comparison bar chart
- Horizontal category breakdown bars
- Smart written observations

## Tech Stack

- React 18 with Context API for state
- Recharts for data visualization
- Lucide React for icons
- CSS variables for theming
- LocalStorage for persistence

## Optional Features Implemented

- Dark mode toggle (persisted)
- LocalStorage persistence for transactions
- CSV export
- Animations and transitions throughout
- Responsive mobile layout

## Folder Structure

```
src/
  components/   # Dashboard, Transactions, Insights, Sidebar
  context/      # AppContext (global state)
  data/         # Mock transactions and chart data
  hooks/        # useCountUp animation hook
```
