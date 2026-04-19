import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SAMPLE_DATA = `
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  customer_name TEXT,
  email TEXT,
  signup_date TEXT
);
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  order_date TEXT,
  amount REAL
);
CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  product_name TEXT,
  category TEXT,
  price REAL
);
INSERT INTO customers VALUES (1, 'Alice Johnson', 'alice@email.com', '2023-01-15');
INSERT INTO customers VALUES (2, 'Bob Smith', 'bob@email.com', '2023-02-20');
INSERT INTO customers VALUES (3, 'Carol White', 'carol@email.com', '2023-03-10');
INSERT INTO customers VALUES (4, 'David Brown', 'david@email.com', '2023-04-05');
INSERT INTO customers VALUES (5, 'Emma Davis', 'emma@email.com', '2023-05-12');
INSERT INTO orders VALUES (1, 1, '2024-01-10', 250.00);
INSERT INTO orders VALUES (2, 1, '2024-02-15', 180.00);
INSERT INTO orders VALUES (3, 3, '2024-03-20', 320.00);
INSERT INTO orders VALUES (4, 5, '2024-01-25', 150.00);
INSERT INTO orders VALUES (5, 2, '2024-04-08', 410.00);
INSERT INTO products VALUES (1, 'Starter Plan', 'subscription', 29.00);
INSERT INTO products VALUES (2, 'Pro Plan', 'subscription', 99.00);
INSERT INTO products VALUES (3, 'Onboarding Kit', 'services', 199.00);
INSERT INTO products VALUES (4, 'Analytics Add-on', 'addon', 49.00);
INSERT INTO products VALUES (5, 'Priority Support', 'services', 79.00);
`;

const CATEGORIES = [
  { label: "SQL Basics", path: "/sql/basics", color: "#2563eb" },
  { label: "SQL Intermediate", path: "/sql/intermediate", color: "#2563eb" },
  { label: "SQL Advanced", path: "/sql/advanced", color: "#2563eb" },
  { label: "SQL Interview Questions ⭐", path: "/sql/interview", color: "#2563eb" },
  { label: "SQL Scenarios (Real-world)", path: "/sql/scenarios", color: "#2563eb" },
];

const LEADERBOARD = [
  { rank: 1, name: "Rahul S.", solved: 142, badge: "🥇" },
  { rank: 2, name: "Priya M.", solved: 118, badge: "🥈" },
  { rank: 3, name: "Arjun K.", solved: 97, badge: "🥉" },
  { rank: 4, name: "Sneha R.", solved: 84, badge: "" },
  { rank: 5, name: "Vikram D.", solved: 71, badge: "" },
];

const COMMUNITY = [
  { user: "Rahul S.", action: "solved", problem: "Customer Churn Analysis", time: "2 min ago", category: "Scenarios" },
  { user: "Priya M.", action: "solved", problem: "Monthly Revenue Trend", time: "8 min ago", category: "Intermediate" },
  { user: "Arjun K.", action: "solved", problem: "TOP N Products by Sales", time: "15 min ago", category: "Advanced" },
  { user: "Sneha R.", action: "solved", problem: "Find Duplicate Emails", time: "22 min ago", category: "Basics" },
  { user: "Vikram D.", action: "solved", problem: "Self Join Employee Manager", time: "34 min ago", category: "Interview" },
  { user: "Meera T.", action: "solved", problem: "Cohort Retention Analysis", time: "41 min ago", category: "Scenarios" },
];

const QUICK_TIPS = [
  { title: "Always alias your columns", tip: "Use AS to name computed columns clearly. SELECT SUM(amount) AS total_revenue is far more readable than SELECT SUM(amount)." },
  { title: "Use CTEs over nested subqueries", tip: "WITH cte AS (...) SELECT * FROM cte makes complex queries readable and debuggable. Nested subqueries become impossible to read fast." },
  { title: "NULL is not zero", tip: "WHERE amount != 0 will NOT exclude NULLs. You need WHERE amount != 0 AND amount IS NOT NULL. NULL comparisons always return NULL." },
  { title: "LEFT JOIN vs INNER JOIN", tip: "INNER JOIN only returns matching rows. LEFT JOIN returns all rows from the left table even if there's no match. Know which one you actually need." },
];

const FEATURED = [
  { title: "Find Customers With No Orders", category: "Basics", difficulty: "Easy", description: "Use a LEFT JOIN to identify customers who have never placed an order." },
  { title: "Monthly Revenue Trend", category: "Intermediate", difficulty: "Medium", description: "Calculate total revenue per month and show month over month growth." },
  { title: "Cohort Retention Analysis", category: "Scenarios", difficulty: "Hard", description: "Build a full cohort retention table showing what percentage of users return each month." },
  { title: "Running Total With Window Functions", category: "Advanced", difficulty: "Hard", description: "Use SUM() OVER() to calculate a running total of sales ordered by date." },
  { title: "Second Highest Salary", category: "Interview", difficulty: "Medium", description: "Classic interview problem — find the second highest salary without using LIMIT OFFSET." },
  { title: "Duplicate Email Detection", category: "Basics", difficulty: "Easy", description: "Use GROUP BY and HAVING to find all email addresses that appear more than once." },
];

const DIFFICULTY_COLORS = {
  Easy: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
  Medium: { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
  Hard: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
};

export default function SQLPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("SELECT * FROM customers;");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [db, setDb] = useState(null);
  const [dbReady, setDbReady] = useState(false);
  const [activeTab, setActiveTab] = useState("customers");

  useEffect(() => {
    const initDb = async () => {
      const initSqlJs = (await import("sql.js")).default;
      const SQL = await initSqlJs({
        locateFile: () => `${process.env.PUBLIC_URL}/sql-wasm.wasm`,
      });
      const database = new SQL.Database();
      database.run(SAMPLE_DATA);
      setDb(database);
      setDbReady(true);
    };
    initDb();
  }, []);

  const runQuery = () => {
    if (!db) return;
    setError(null);
    setResults(null);
    try {
      const res = db.exec(query);
      if (res.length === 0) { setError("Query returned no results."); return; }
      setResults(res[0]);
    } catch (err) {
      setError(err.message);
    }
  };

  const TABLE_DATA = {
    customers: {
      columns: ["customer_id", "customer_name", "email", "signup_date"],
      rows: [[1,"Alice Johnson","alice@email.com","2023-01-15"],[2,"Bob Smith","bob@email.com","2023-02-20"],[3,"Carol White","carol@email.com","2023-03-10"],[4,"David Brown","david@email.com","2023-04-05"],[5,"Emma Davis","emma@email.com","2023-05-12"]],
    },
    orders: {
      columns: ["order_id", "customer_id", "order_date", "amount"],
      rows: [[1,1,"2024-01-10","$250.00"],[2,1,"2024-02-15","$180.00"],[3,3,"2024-03-20","$320.00"],[4,5,"2024-01-25","$150.00"],[5,2,"2024-04-08","$410.00"]],
    },
    products: {
      columns: ["product_id", "product_name", "category", "price"],
      rows: [[1,"Starter Plan","subscription","$29.00"],[2,"Pro Plan","subscription","$99.00"],[3,"Onboarding Kit","services","$199.00"],[4,"Analytics Add-on","addon","$49.00"],[5,"Priority Support","services","$79.00"]],
    },
  };

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      {/* Nav */}


<nav
  style={{
    padding: "1rem 2.5rem",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    background: "rgba(255,255,255,0.97)",
    zIndex: 100,
  }}
>
  {/* Logo */}
  <span
    onClick={() => navigate("/")}
    style={{
      fontWeight: 800,
      fontSize: "1.1rem",
      color: "#0f172a",
      letterSpacing: "-0.3px",
      cursor: "pointer",
    }}
  >
    Data Rejected
  </span>

  {/* Right Menu */}
  <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
    <span
      onClick={() => navigate("/home")}
      style={{
        fontSize: "0.85rem",
        color: "#64748b",
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      Home
    </span>

    {/* Practice */}
    <span
      onClick={() => navigate("/sql")}
      style={{
        fontSize: "0.85rem",
        color: "#2563eb",
        fontWeight: 600,
        cursor: "pointer",
        borderBottom: "2px solid #2563eb",
        paddingBottom: "2px",
      }}
    >
      Practice
    </span>

    {/* Leaderboard */}
    <span
      style={{
        fontSize: "0.85rem",
        color: "#64748b",
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      Leaderboard
    </span>

    {/* ✅ PROFILE */}
    <Link
      to="/profile"
      style={{
        fontSize: "0.85rem",
        color: "#64748b",
        textDecoration: "none",
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      Profile
    </Link>

  </div>
</nav>

      {/* Hero Header */}
      <div style={{ background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)", borderBottom: "1px solid #e2e8f0", padding: "3rem 2.5rem 2.5rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#2563eb", background: "#ffffff", padding: "5px 14px", borderRadius: "20px", border: "1px solid #bfdbfe", marginBottom: "1.25rem", fontWeight: 600 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2563eb", display: "inline-block" }}></span>
          Free SQL Practice Environment
        </div>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 0.75rem", color: "#0f172a" }}>
          Practice SQL on <span style={{ color: "#2563eb" }}>Real Business Data</span>
        </h1>
        <p style={{ fontSize: "1rem", color: "#64748b", lineHeight: 1.75, maxWidth: "520px", margin: "0 auto" }}>
          Pick a category, write real queries, and build skills that actually matter at work.
        </p>
      </div>

      {/* Leaderboard Strip */}
      <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "0.85rem 2.5rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1.5rem", overflowX: "auto" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>🏆 Top Solvers</span>
          {LEADERBOARD.map((u) => (
            <div key={u.rank} style={{ display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: "0.82rem" }}>{u.badge || `#${u.rank}`}</span>
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f172a" }}>{u.name}</span>
              <span style={{ fontSize: "0.75rem", color: "#2563eb", background: "#eff6ff", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>{u.solved} solved</span>
            </div>
          ))}
          <span style={{ fontSize: "0.75rem", color: "#2563eb", cursor: "pointer", marginLeft: "auto", whiteSpace: "nowrap", fontWeight: 600 }}>View full leaderboard →</span>
        </div>
      </div>

      {/* Category Buttons */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 2.5rem 0" }}>
        <div style={{ marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Choose a Category</span>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.path}
              onClick={() => navigate(cat.path)}
              style={{ padding: "10px 20px", borderRadius: "8px", background: "#ffffff", color: "#2563eb", fontWeight: 600, fontSize: "0.88rem", border: "1.5px solid #bfdbfe", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.target.style.background = "#2563eb"; e.target.style.color = "#fff"; }}
              onMouseLeave={e => { e.target.style.background = "#ffffff"; e.target.style.color = "#2563eb"; }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Community Activity */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 2.5rem 0" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Community Activity</span>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.3px", margin: "0.25rem 0 0", color: "#0f172a" }}>See what people are solving right now</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
          {COMMUNITY.map((item, i) => (
            <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.875rem 1rem", display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#2563eb", flexShrink: 0 }}>
                {item.user.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", color: "#0f172a", fontWeight: 600 }}>{item.user} <span style={{ fontWeight: 400, color: "#64748b" }}>solved</span></div>
                <div style={{ fontSize: "0.82rem", color: "#0f172a", margin: "2px 0" }}>{item.problem}</div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "4px" }}>
                  <span style={{ fontSize: "0.7rem", color: "#2563eb", background: "#eff6ff", padding: "2px 8px", borderRadius: "10px", fontWeight: 500 }}>{item.category}</span>
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SQL Sandbox */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 2.5rem 0" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Free Sandbox</span>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.3px", margin: "0.25rem 0 0", color: "#0f172a" }}>Write and run SQL queries instantly</h2>
        </div>

        <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>

          {/* Sandbox Header */}
          <div style={{ padding: "0.85rem 1.25rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "#0f172a", background: "#e2e8f0", padding: "4px 10px", borderRadius: "20px", fontWeight: 700 }}>SQL</span>
              <div style={{ display: "flex", gap: "6px" }}>
                {["customers", "orders", "products"].map(t => (
                  <button key={t} onClick={() => setActiveTab(t)} style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: "6px", border: "1px solid", borderColor: activeTab === t ? "#2563eb" : "#e2e8f0", background: activeTab === t ? "#eff6ff" : "#ffffff", color: activeTab === t ? "#2563eb" : "#64748b", cursor: "pointer", fontWeight: activeTab === t ? 600 : 400 }}>{t}</button>
                ))}
              </div>
            </div>
            <button onClick={runQuery} disabled={!dbReady} style={{ padding: "8px 20px", borderRadius: "6px", background: dbReady ? "#2563eb" : "#94a3b8", color: "#fff", fontWeight: 700, fontSize: "0.82rem", border: "none", cursor: dbReady ? "pointer" : "not-allowed" }}>
              {dbReady ? "▶ Run Query" : "Loading..."}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr" }}>

            {/* Table Preview */}
            <div style={{ borderRight: "1px solid #e2e8f0", background: "#f8fafc", padding: "1rem", overflowX: "auto" }}>
              <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>{activeTab}</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.74rem" }}>
                <thead>
                  <tr>
                    {TABLE_DATA[activeTab].columns.map(col => (
                      <th key={col} style={{ textAlign: "left", color: "#64748b", padding: "4px 6px", fontWeight: 600, borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TABLE_DATA[activeTab].rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: "4px 6px", color: "#475569", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Editor + Results */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <textarea
                value={query}
                onChange={e => setQuery(e.target.value)}
                spellCheck={false}
                rows={6}
                style={{ background: "#0f172a", color: "#7dd3fc", border: "none", borderBottom: "1px solid #e2e8f0", padding: "1rem 1.25rem", fontFamily: "monospace", fontSize: "0.88rem", lineHeight: 1.75, resize: "none", outline: "none", width: "100%" }}
              />
              <div style={{ padding: "0.75rem 1.25rem", background: "#f8fafc", minHeight: "100px" }}>
                {!results && !error && <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Results appear here after you run a query</span>}
                {error && <span style={{ fontSize: "0.8rem", color: "#ef4444", fontFamily: "monospace" }}>{error}</span>}
                {results && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ borderCollapse: "collapse", fontSize: "0.78rem" }}>
                      <thead>
                        <tr>{results.columns.map(col => <th key={col} style={{ padding: "4px 12px", textAlign: "left", color: "#64748b", fontWeight: 500, borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{col}</th>)}</tr>
                      </thead>
                      <tbody>
                        {results.values.map((row, i) => (
                          <tr key={i}>{row.map((cell, j) => <td key={j} style={{ padding: "4px 12px", color: "#0f172a", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{cell}</td>)}</tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 2.5rem 0" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Quick Tips</span>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.3px", margin: "0.25rem 0 0", color: "#0f172a" }}>Common SQL mistakes to avoid</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
          {QUICK_TIPS.map((tip, i) => (
            <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#2563eb" }}>{i + 1}</span>
              </div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>{tip.title}</div>
              <div style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.65 }}>{tip.tip}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Problems */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem" }}>
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Featured Problems</span>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.3px", margin: "0.25rem 0 0", color: "#0f172a" }}>Start with these popular challenges</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {FEATURED.map((p, i) => (
            <div key={i} style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#bfdbfe"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.7rem", color: "#2563eb", background: "#eff6ff", padding: "3px 10px", borderRadius: "10px", fontWeight: 600 }}>{p.category}</span>
                <span style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: "10px", fontWeight: 600, background: DIFFICULTY_COLORS[p.difficulty].bg, color: DIFFICULTY_COLORS[p.difficulty].text, border: `1px solid ${DIFFICULTY_COLORS[p.difficulty].border}` }}>{p.difficulty}</span>
              </div>
              <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>{p.title}</div>
              <div style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.65 }}>{p.description}</div>
              <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#2563eb", fontWeight: 600 }}>Solve this →</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "3rem 2.5rem 2rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a", marginBottom: "0.5rem" }}>Data Rejected</div>
              <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.7, maxWidth: "280px" }}>A free SQL practice platform built for data professionals who want to actually do the work.</div>
              <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>LinkedIn</a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>YouTube</a>
                <a href="/contact" target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Contact Us</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Product</div>
              {["Practice", "Leaderboard", "Datasets"].map(link => (
                <div key={link} style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "0.4rem", cursor: "pointer" }}>{link}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Legal</div>
              {["Privacy Policy", "Terms of Use"].map(link => (
                <div key={link} style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "0.4rem", cursor: "pointer" }}>{link}</div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem", fontSize: "0.75rem", color: "#94a3b8", textAlign: "center" }}>
            © 2025 Data Rejected · Built for data professionals who want to actually do the work.
          </div>
        </div>
      </div>

    </div>
  );
}