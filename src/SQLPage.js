import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import Editor from "@monaco-editor/react";
import { SQL_PROBLEMS } from "./data/sqlProblems";
import { SQL_INTERMEDIATE_PROBLEMS } from "./data/sqlIntermediateProblems";
import { SQL_ADVANCED_PROBLEMS } from "./data/sqlAdvancedProblems";
import { SQL_INTERVIEW_PROBLEMS } from "./data/sqlInterviewProblems";
import { SQL_SCENARIOS_PROBLEMS } from "./data/sqlScenariosProblems";

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────

const SAMPLE_DATA = `
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY, customer_name TEXT, email TEXT, signup_date TEXT
);
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT, amount REAL
);
CREATE TABLE products (
  product_id INTEGER PRIMARY KEY, product_name TEXT, category TEXT, price REAL
);
INSERT INTO customers VALUES (1,'Alice Johnson','alice@email.com','2023-01-15');
INSERT INTO customers VALUES (2,'Bob Smith','bob@email.com','2023-02-20');
INSERT INTO customers VALUES (3,'Carol White','carol@email.com','2023-03-10');
INSERT INTO customers VALUES (4,'David Brown','david@email.com','2023-04-05');
INSERT INTO customers VALUES (5,'Emma Davis','emma@email.com','2023-05-12');
INSERT INTO orders VALUES (1,1,'2024-01-10',250.00);
INSERT INTO orders VALUES (2,1,'2024-02-15',180.00);
INSERT INTO orders VALUES (3,3,'2024-03-20',320.00);
INSERT INTO orders VALUES (4,5,'2024-01-25',150.00);
INSERT INTO orders VALUES (5,2,'2024-04-08',410.00);
INSERT INTO products VALUES (1,'Starter Plan','subscription',29.00);
INSERT INTO products VALUES (2,'Pro Plan','subscription',99.00);
INSERT INTO products VALUES (3,'Onboarding Kit','services',199.00);
INSERT INTO products VALUES (4,'Analytics Add-on','addon',49.00);
INSERT INTO products VALUES (5,'Priority Support','services',79.00);
`;

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "SQL Basics",                    path: "/sql/basics" },
  { label: "SQL Intermediate",              path: "/sql/intermediate" },
  { label: "SQL Advanced",                  path: "/sql/advanced" },
  { label: "SQL Interview Questions ⭐",    path: "/sql/interview" },
  { label: "SQL Scenarios (Real-world)",    path: "/sql/scenarios" },
];

// ─── FEATURED PROBLEMS — first 10 from each category with real paths ──────────
// Each problem links to its practice page. Users who are guests can solve 1-10 free.

function getDailySeed() {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

function seededRandom(seed) {
  // Simple deterministic pseudo-random from a seed
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pickRandom(arr, count, seedOffset = 0) {
  const seed = getDailySeed() + seedOffset;
  const pool = [...arr];
  const picked = [];

  for (let i = 0; i < count && pool.length > 0; i++) {
    const rand = seededRandom(seed + i * 37);
    const index = Math.floor(rand * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}

// For Interview and Scenarios: 5 from first 10, 5 from rest
function pickMixed(arr, seedOffset = 0) {
  const first10 = arr.slice(0, 10);
  const rest = arr.slice(10);
  return [
    ...pickRandom(first10, 5, seedOffset),
    ...pickRandom(rest, 5, seedOffset + 999),
  ];
}

function buildFeaturedProblems() {
  const basics = pickRandom(SQL_PROBLEMS, 10, 0).map(p => ({ 
    ...p, 
    category: "Basics", 
    difficulty: "Easy", 
    path: `/sql/basics/${p.id}`  // ← add /${p.id}
  }));
  
  const intermediate = pickRandom(SQL_INTERMEDIATE_PROBLEMS, 10, 100).map(p => ({ 
    ...p, 
    category: "Intermediate", 
    difficulty: "Medium", 
    path: `/sql/intermediate/${p.id}`  // ← add /${p.id}
  }));
  
  const advanced = pickRandom(SQL_ADVANCED_PROBLEMS, 10, 200).map(p => ({ 
    ...p, 
    category: "Advanced", 
    difficulty: "Hard", 
    path: `/sql/advanced/${p.id}`  // ← add /${p.id}
  }));
  
  const interview = pickMixed(SQL_INTERVIEW_PROBLEMS, 300).map(p => ({ 
    ...p, 
    category: "Interview", 
    difficulty: "Medium", 
    path: `/sql/interview/${p.id}`  // ← add /${p.id}
  }));
  
  const scenarios = pickMixed(SQL_SCENARIOS_PROBLEMS, 400).map(p => ({ 
    ...p, 
    category: "Scenarios", 
    difficulty: "Hard", 
    path: `/sql/scenarios/${p.id}`  // ← add /${p.id}
  }));
  return [...basics, ...intermediate, ...advanced, ...interview, ...scenarios];
}

const FEATURED_PROBLEMS = buildFeaturedProblems();
// ─── STATIC TABLE PREVIEWS ────────────────────────────────────────────────────

const TABLE_DATA = {
  customers: {
    columns: ["customer_id", "customer_name", "email", "signup_date"],
    rows: [
      [1, "Alice Johnson", "alice@email.com", "2023-01-15"],
      [2, "Bob Smith",     "bob@email.com",   "2023-02-20"],
      [3, "Carol White",   "carol@email.com", "2023-03-10"],
      [4, "David Brown",   "david@email.com", "2023-04-05"],
      [5, "Emma Davis",    "emma@email.com",  "2023-05-12"],
    ],
  },
  orders: {
    columns: ["order_id", "customer_id", "order_date", "amount"],
    rows: [
      [1, 1, "2024-01-10", "$250.00"],
      [2, 1, "2024-02-15", "$180.00"],
      [3, 3, "2024-03-20", "$320.00"],
      [4, 5, "2024-01-25", "$150.00"],
      [5, 2, "2024-04-08", "$410.00"],
    ],
  },
  products: {
    columns: ["product_id", "product_name", "category", "price"],
    rows: [
      [1, "Starter Plan",     "subscription", "$29.00"],
      [2, "Pro Plan",         "subscription", "$99.00"],
      [3, "Onboarding Kit",   "services",     "$199.00"],
      [4, "Analytics Add-on", "addon",        "$49.00"],
      [5, "Priority Support", "services",     "$79.00"],
    ],
  },
};

// ─── QUICK TIPS ───────────────────────────────────────────────────────────────

const QUICK_TIPS = [
  { title: "Always alias your columns",      tip: "Use AS to name computed columns clearly. SELECT SUM(amount) AS total_revenue is far more readable than SELECT SUM(amount)." },
  { title: "Use CTEs over nested subqueries",tip: "WITH cte AS (...) SELECT * FROM cte makes complex queries readable and debuggable. Nested subqueries become impossible to read fast." },
  { title: "NULL is not zero",               tip: "WHERE amount != 0 will NOT exclude NULLs. You need WHERE amount != 0 AND amount IS NOT NULL. NULL comparisons always return NULL." },
  { title: "LEFT JOIN vs INNER JOIN",        tip: "INNER JOIN only returns matching rows. LEFT JOIN returns all rows from the left table even if there's no match. Know which one you actually need." },
];

// ─── COLOURS ──────────────────────────────────────────────────────────────────

const DIFF_COLORS = {
  Easy:   { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
  Medium: { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
  Hard:   { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
};

const CAT_COLORS = {
  Basics:       "#2563eb",
  Intermediate: "#7c3aed",
  Advanced:     "#dc2626",
  Interview:    "#d97706",
  Scenarios:    "#16a34a",
};

// ─── FALLBACKS ────────────────────────────────────────────────────────────────

const FALLBACK_LEADERBOARD = [
  { rank: 1, name: "Rahul S.",  solved: 142, badge: "🥇" },
  { rank: 2, name: "Priya M.",  solved: 118, badge: "🥈" },
  { rank: 3, name: "Arjun K.",  solved: 97,  badge: "🥉" },
  { rank: 4, name: "Sneha R.",  solved: 84,  badge: "" },
  { rank: 5, name: "Vikram D.", solved: 71,  badge: "" },
];

const FALLBACK_COMMUNITY = [
  { user: "Rahul S.",  problem: "Customer Churn Analysis",         category: "Scenarios",    time: "2m ago" },
  { user: "Priya M.",  problem: "Monthly Revenue Trend",           category: "Intermediate", time: "8m ago" },
  { user: "Arjun K.",  problem: "Running Total With Window Fns",   category: "Advanced",     time: "15m ago" },
  { user: "Sneha R.",  problem: "Find Duplicate Emails",           category: "Basics",       time: "22m ago" },
  { user: "Vikram D.", problem: "Self Join Employee Manager",      category: "Interview",    time: "34m ago" },
  { user: "Meera T.",  problem: "Cohort Retention Analysis",       category: "Scenarios",    time: "41m ago" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const CATEGORY_LABEL = {
  sql_basics:       "Basics",
  sql_intermediate: "Intermediate",
  sql_advanced:     "Advanced",
  sql_interview:    "Interview",
  sql_scenarios:    "Scenarios",
};

// ─── DIFF PILL ────────────────────────────────────────────────────────────────

function DiffPill({ d }) {
  const c = DIFF_COLORS[d] || DIFF_COLORS.Easy;
  return (
    <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "10px", fontWeight: 600, background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {d}
    </span>
  );
}

function CatPill({ cat }) {
  const color = CAT_COLORS[cat] || "#2563eb";
  return (
    <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "10px", fontWeight: 600, background: "#f8fafc", color, border: `1px solid ${color}22` }}>
      {cat}
    </span>
  );
}

// ─── FULLSCREEN EDITOR MODAL ──────────────────────────────────────────────────

function FullscreenEditor({ query, setQuery, onClose, onRun, dbReady }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#0f172a", zIndex: 9999, display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ padding: "0.75rem 1.5rem", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "0.75rem", color: "#0f172a", background: "#e2e8f0", padding: "4px 10px", borderRadius: "20px", fontWeight: 700 }}>SQL</span>
          <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Fullscreen editor · Ctrl+Enter to run</span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={onRun}
            disabled={!dbReady}
            style={{ padding: "8px 20px", borderRadius: "6px", background: dbReady ? "#2563eb" : "#475569", color: "#fff", fontWeight: 700, fontSize: "0.82rem", border: "none", cursor: dbReady ? "pointer" : "not-allowed" }}
          >
            ▶ Run Query
          </button>
          <button
            onClick={onClose}
            style={{ padding: "8px 16px", borderRadius: "6px", background: "#1e293b", color: "#94a3b8", fontWeight: 600, fontSize: "0.82rem", border: "1px solid #334155", cursor: "pointer" }}
          >
            ✕ Exit fullscreen
          </button>
        </div>
      </div>
      {/* Editor fills remaining height */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Editor
          height="100%"
          width="100%"
          defaultLanguage="sql"
          theme="vs-dark"
          value={query}
          onChange={(v) => setQuery(v || "")}
          options={{ fontSize: 15, lineHeight: 24, minimap: { enabled: true }, wordWrap: "on", automaticLayout: true, scrollBeyondLastLine: false, padding: { top: 16, bottom: 16 } }}
        />
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function SQLPage() {
  const navigate = useNavigate();

  // SQL sandbox
  const [query, setQuery]       = useState("SELECT * FROM customers;");
  const [results, setResults]   = useState(null);
  const [error, setError]       = useState(null);
  const [db, setDb]             = useState(null);
  const [dbReady, setDbReady]   = useState(false);
  const [activeTab, setActiveTab] = useState("customers");
  const [fullscreen, setFullscreen] = useState(false);

  // Featured filter
  const [activeCat, setActiveCat] = useState("All");

  // Live Supabase data
  const [leaderboard, setLeaderboard] = useState(FALLBACK_LEADERBOARD);
  const [community, setCommunity]     = useState(FALLBACK_COMMUNITY);

  // Init SQL.js
  useEffect(() => {
    const initDb = async () => {
      const initSqlJs = (await import("sql.js")).default;
      const SQL = await initSqlJs({ locateFile: () => `${process.env.PUBLIC_URL}/sql-wasm.wasm` });
      const database = new SQL.Database();
      database.run(SAMPLE_DATA);
      setDb(database);
      setDbReady(true);
    };
    initDb();
  }, []);

  // Fetch real leaderboard + community from Supabase
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const { data: topUsers } = await supabase
          .from("submissions")
          .select("user_id, problem_id, problem_title, category, created_at")
          .eq("status", "correct")
          .eq("is_best_attempt", true);

        if (topUsers && topUsers.length > 0) {
          const uniqueIds = [...new Set(topUsers.map((r) => r.user_id))];

          const { data: profilesById } = await supabase
            .from("profiles")
            .select("id, full_name");

          const nameMap = {};
          (profilesById || []).forEach((p) => { nameMap[p.id] = p.full_name || "Anonymous"; });

          // Leaderboard
          const countMap = {};
          topUsers.forEach((row) => { countMap[row.user_id] = (countMap[row.user_id] || 0) + 1; });
          const sorted = Object.entries(countMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([uid, count], i) => ({
              rank: i + 1,
              name: nameMap[uid] || "Anonymous",
              solved: count,
              badge: ["🥇", "🥈", "🥉"][i] || "",
            }));
          if (sorted.length > 0) setLeaderboard(sorted);

          // Community feed
          const recent = [...topUsers]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 6)
            .map((row) => ({
              user:     nameMap[row.user_id] || "Anonymous",
              problem:  row.problem_title || "Unknown problem",
              category: CATEGORY_LABEL[row.category] || row.category,
              time:     timeAgo(row.created_at),
            }));
          if (recent.length > 0) setCommunity(recent);
        }
      } catch (err) {
        console.error("Failed to fetch Supabase data:", err);
      }
    };
    fetchRealData();
  }, []);

  const runQuery = useCallback(() => {
    if (!db) return;
    setError(null);
    setResults(null);
    try {
      const res = db.exec(query);
      if (res.length === 0) { setError("Query executed but returned no rows."); return; }
      setResults(res[0]);
    } catch (err) {
      setError(err.message);
    }
  }, [db, query]);

  // Ctrl+Enter shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") runQuery();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [runQuery]);

  // Featured filter
  const allCats = ["All", "Basics", "Intermediate", "Advanced", "Interview", "Scenarios"];
  const filteredFeatured = activeCat === "All"
    ? FEATURED_PROBLEMS
    : FEATURED_PROBLEMS.filter((p) => p.category === activeCat);

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      {/* Fullscreen overlay */}
  {/* FULLSCREEN MODAL */}
{fullscreen && (
  <div style={{
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
  }}>
    {/* Fullscreen Top Bar */}
    <div style={{
      padding: "0.85rem 1.25rem",
      borderBottom: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#f8fafc",
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", color: "#0f172a", background: "#e2e8f0", padding: "4px 10px", borderRadius: "20px", fontWeight: 700 }}>SQL</span>
        {["customers", "orders", "products"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              fontSize: "0.72rem", padding: "3px 10px", borderRadius: "6px", border: "1px solid",
              borderColor: activeTab === t ? "#2563eb" : "#e2e8f0",
              background: activeTab === t ? "#eff6ff" : "#ffffff",
              color: activeTab === t ? "#2563eb" : "#64748b",
              cursor: "pointer", fontWeight: activeTab === t ? 600 : 400
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={runQuery}
          disabled={!dbReady}
          style={{
            padding: "8px 20px", borderRadius: "6px",
            background: dbReady ? "#2563eb" : "#94a3b8",
            color: "#fff", fontWeight: 700, fontSize: "0.82rem",
            border: "none", cursor: dbReady ? "pointer" : "not-allowed"
          }}
        >
          {dbReady ? "▶ Run Query" : "Loading…"}
        </button>
        <button
          onClick={() => setFullscreen(false)}
          style={{
            padding: "8px 16px", borderRadius: "6px",
            background: "#fff", color: "#ef4444",
            fontWeight: 700, fontSize: "0.82rem",
            border: "1.5px solid #fca5a5", cursor: "pointer"
          }}
        >
          ✕ Exit Fullscreen
        </button>
      </div>
    </div>

    {/* Fullscreen Grid — same layout, fills remaining height */}
    <div style={{
      display: "grid",
      gridTemplateColumns: "450px minmax(0, 1fr)",
      flex: 1,
      overflow: "hidden",
    }}>
      {/* LEFT: table preview */}
      <div style={{
        borderRight: "1px solid #e2e8f0",
        background: "#f8fafc",
        padding: "1rem",
        overflowX: "auto",
        overflowY: "auto",
        scrollbarWidth: "thin",
        display: "flex",
        flexDirection: "column",
      }}>
        <div style={{
          fontSize: "0.7rem", color: "#64748b", fontWeight: 700,
          textTransform: "uppercase", marginBottom: "1rem", letterSpacing: "0.05em"
        }}>
          {activeTab} Preview
        </div>
        <table style={{ borderCollapse: "collapse", fontSize: "0.74rem", width: "100%", minWidth: "max-content" }}>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              {TABLE_DATA[activeTab].columns.map((col) => (
                <th key={col} style={{
                  textAlign: "left", color: "#475569", padding: "8px 10px",
                  borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap", fontWeight: 700
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_DATA[activeTab].rows.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "#ffffff" }}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    padding: "8px 10px", color: "#1e293b",
                    borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap"
                  }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RIGHT: editor + results */}
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Monaco editor — takes up 60% of height */}
        <div style={{ flex: "0 0 60%", borderBottom: "1px solid #e2e8f0", background: "#0f172a" }}>
          <Editor
            height="100%"
            width="100%"
            defaultLanguage="sql"
            theme="vs-dark"
            value={query}
            onChange={(v) => setQuery(v || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
              padding: { top: 10 }
            }}
          />
        </div>

        {/* Results — takes remaining 40% */}
        <div style={{ flex: "0 0 40%", padding: "0.75rem 1.25rem", background: "#f8fafc", overflow: "auto" }}>
          <div style={{
            fontSize: "0.68rem", color: "#94a3b8", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem"
          }}>
            Output {results ? `— ${results.values.length} row${results.values.length !== 1 ? "s" : ""}` : ""}
          </div>
          {!results && !error && (
            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Results appear here after you run a query</span>
          )}
          {error && (
            <span style={{ fontSize: "0.8rem", color: "#ef4444", fontFamily: "monospace" }}>{error}</span>
          )}
          {results && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", fontSize: "0.78rem" }}>
                <thead>
                  <tr>
                    {results.columns.map((col) => (
                      <th key={col} style={{
                        padding: "5px 12px", textAlign: "left", color: "#64748b",
                        borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap",
                        fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase"
                      }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.values.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{
                          padding: "5px 12px", borderBottom: "1px solid #f1f5f9",
                          whiteSpace: "nowrap", color: "#0f172a"
                        }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav style={{ padding: "1rem 2.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.97)", zIndex: 100 }}>
        <span onClick={() => navigate("/")} style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", letterSpacing: "-0.3px", cursor: "pointer" }}>Data Rejected</span>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <span onClick={() => navigate("/home")}        style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500, cursor: "pointer" }}>Home</span>
          <span onClick={() => navigate("/sql")}         style={{ fontSize: "0.85rem", color: "#2563eb", fontWeight: 600, cursor: "pointer", borderBottom: "2px solid #2563eb", paddingBottom: "2px" }}>Practice</span>
          <span onClick={() => navigate("/leaderboard")} style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500, cursor: "pointer" }}>Leaderboard</span>
          <Link to="/profile"                            style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Profile</Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)", borderBottom: "1px solid #e2e8f0", padding: "3rem 2.5rem 2.5rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#2563eb", background: "#ffffff", padding: "5px 14px", borderRadius: "20px", border: "1px solid #bfdbfe", marginBottom: "1.25rem", fontWeight: 600 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2563eb", display: "inline-block" }} />
          Free SQL Practice Environment
        </div>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 0.75rem", color: "#0f172a" }}>
          Practice SQL on <span style={{ color: "#2563eb" }}>Real Business Data</span>
        </h1>
        <p style={{ fontSize: "1rem", color: "#64748b", lineHeight: 1.75, maxWidth: "520px", margin: "0 auto" }}>
          Pick a category, write real queries, and build skills that actually matter at work.
        </p>
      </div>

      {/* ── LEADERBOARD STRIP ────────────────────────────────────────────── */}
      <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "0.85rem 2.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1.5rem", overflowX: "auto" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>🏆 Top Solvers</span>
          {leaderboard.map((u) => (
            <div key={u.rank} style={{ display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: "0.82rem" }}>{u.badge || `#${u.rank}`}</span>
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f172a" }}>{u.name}</span>
              <span style={{ fontSize: "0.75rem", color: "#2563eb", background: "#eff6ff", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>{u.solved} solved</span>
            </div>
          ))}
          <span onClick={() => navigate("/leaderboard")} style={{ fontSize: "0.75rem", color: "#2563eb", cursor: "pointer", marginLeft: "auto", whiteSpace: "nowrap", fontWeight: 600 }}>
            View full leaderboard →
          </span>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2.5rem 0" }}>

        {/* ── CATEGORY BUTTONS ───────────────────────────────────────────── */}
        <div style={{ marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Choose a Category</span>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.path}
              onClick={() => navigate(cat.path)}
              style={{ padding: "10px 20px", borderRadius: "8px", background: "#ffffff", color: "#2563eb", fontWeight: 600, fontSize: "0.88rem", border: "1.5px solid #bfdbfe", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#2563eb"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.color = "#2563eb"; }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── COMMUNITY ACTIVITY ─────────────────────────────────────────── */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Community Activity</span>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.3px", margin: "0.25rem 0 0", color: "#0f172a" }}>See what people are solving right now</h2>
        </div>

        {/* Uniform 3-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "2.5rem" }}>
          {community.map((item, i) => (
            <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.875rem 1rem", display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "#2563eb", flexShrink: 0 }}>
                {getInitials(item.user)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.82rem", color: "#0f172a", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.user} <span style={{ fontWeight: 400, color: "#64748b" }}>solved</span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#0f172a", margin: "2px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.problem}</div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "4px" }}>
                  <CatPill cat={item.category} />
                  <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── SQL SANDBOX ────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Free Sandbox</span>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0.25rem 0 0", color: "#0f172a" }}>Write and run SQL queries instantly</h2>
        </div>

        <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: "2.5rem" }}>

          {/* Top bar */}
          <div style={{ padding: "0.85rem 1.25rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "#0f172a", background: "#e2e8f0", padding: "4px 10px", borderRadius: "20px", fontWeight: 700 }}>SQL</span>
              {["customers", "orders", "products"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: "6px", border: "1px solid", borderColor: activeTab === t ? "#2563eb" : "#e2e8f0", background: activeTab === t ? "#eff6ff" : "#ffffff", color: activeTab === t ? "#2563eb" : "#64748b", cursor: "pointer", fontWeight: activeTab === t ? 600 : 400 }}
                >
                  {t}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {/* Fullscreen button */}
              <button
                onClick={() => setFullscreen(true)}
                title="Open fullscreen editor"
                style={{ padding: "7px 14px", borderRadius: "6px", background: "#ffffff", color: "#64748b", fontWeight: 600, fontSize: "0.78rem", border: "1px solid #e2e8f0", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
              >
                ⛶ Fullscreen
              </button>
              <button
                onClick={runQuery}
                disabled={!dbReady}
                style={{ padding: "8px 20px", borderRadius: "6px", background: dbReady ? "#2563eb" : "#94a3b8", color: "#fff", fontWeight: 700, fontSize: "0.82rem", border: "none", cursor: dbReady ? "pointer" : "not-allowed" }}
              >
                {dbReady ? "▶ Run Query" : "Loading…"}
              </button>
            </div>
          </div>

          {/* Main grid: table preview LEFT, editor + results RIGHT */}
 {/* Main grid: Updated width from 280px to 450px to fit more columns */}
<div style={{ 
  display: "grid", 
  gridTemplateColumns: "450px minmax(0, 1fr)", // Increased from 280px to 450px
  width: "100%", 
  height: "550px", // Slightly increased height for better visibility
  border: "1px solid #e2e8f0", 
  borderRadius: "10px", 
  overflow: "hidden",
  background: "#ffffff"
}}>

  {/* LEFT: table preview - Now wider */}
  <div style={{
    borderRight: "1px solid #e2e8f0",
    background: "#f8fafc",
    padding: "1rem",
    overflowX: "auto",      // Allows horizontal scroll if columns still exceed 450px
    overflowY: "auto",      // Vertical scroll for rows
    minWidth: 0,           
    scrollbarWidth: "thin",
    display: "flex",
    flexDirection: "column"
  }}>
    <div style={{ 
      fontSize: "0.7rem", 
      color: "#64748b", 
      fontWeight: 700, 
      textTransform: "uppercase", 
      marginBottom: "1rem",
      letterSpacing: "0.05em" 
    }}>
      {activeTab} Preview
    </div>
    
    <table style={{
      borderCollapse: "collapse",
      fontSize: "0.74rem",
      width: "100%",         // Try to fit container first
      minWidth: "max-content" // But expand to show full columns if needed
    }}>
      <thead>
        <tr style={{ background: "#f1f5f9" }}>
          {TABLE_DATA[activeTab].columns.map((col) => (
            <th key={col} style={{ 
              textAlign: "left", 
              color: "#475569", 
              padding: "8px 10px", 
              borderBottom: "2px solid #e2e8f0", 
              whiteSpace: "nowrap", 
              fontWeight: 700 
            }}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {TABLE_DATA[activeTab].rows.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "#ffffff" }}>
            {row.map((cell, j) => (
              <td key={j} style={{ 
                padding: "8px 10px", 
                color: "#1e293b", 
                borderBottom: "1px solid #f1f5f9", 
                whiteSpace: "nowrap" 
              }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* RIGHT: editor + results */}
  <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
    {/* Monaco editor */}
    <div style={{ borderBottom: "1px solid #e2e8f0", background: "#0f172a" }}>
      <Editor
        height="280px"
        width="100%"
        defaultLanguage="sql"
        theme="vs-dark"
        value={query}
        onChange={(v) => setQuery(v || "")}
        options={{ 
          fontSize: 14, 
          minimap: { enabled: false }, 
          automaticLayout: true, // Forces editor to fill the remaining 1fr space
          padding: { top: 10 } 
        }}
      />
    </div>

              {/* Results */}
              <div style={{ flex: 1, padding: "0.75rem 1.25rem", background: "#f8fafc", overflow: "auto" }}>
                <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                  Output {results ? `— ${results.values.length} row${results.values.length !== 1 ? "s" : ""}` : ""}
                </div>

                {!results && !error && (
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Results appear here after you run a query</span>
                )}
                {error && (
                  <span style={{ fontSize: "0.8rem", color: "#ef4444", fontFamily: "monospace" }}>{error}</span>
                )}
                {results && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ borderCollapse: "collapse", fontSize: "0.78rem" }}>
                      <thead>
                        <tr>
                          {results.columns.map((col) => (
                            <th key={col} style={{ padding: "5px 12px", textAlign: "left", color: "#64748b", borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap", fontWeight: 600, fontSize: "0.72rem", textTransform: "uppercase" }}>
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.values.map((row, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                            {row.map((cell, j) => (
                              <td key={j} style={{ padding: "5px 12px", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap", color: "#0f172a" }}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── QUICK TIPS ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Quick Tips</span>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.3px", margin: "0.25rem 0 0", color: "#0f172a" }}>Common SQL mistakes to avoid</h2>
        </div>
        {/* Uniform 2-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
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

        {/* ── FEATURED PROBLEMS ──────────────────────────────────────────── */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Featured Problems</span>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.3px", margin: "0.25rem 0 0.75rem", color: "#0f172a" }}>Start with these popular challenges</h2>

          {/* Category filter tabs */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {allCats.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                style={{
                  padding: "5px 14px",
                  borderRadius: "20px",
                  fontSize: "0.78rem",
                  fontWeight: activeCat === cat ? 700 : 500,
                  border: "1.5px solid",
                  borderColor: activeCat === cat ? (CAT_COLORS[cat] || "#2563eb") : "#e2e8f0",
                  background: activeCat === cat ? (CAT_COLORS[cat] || "#2563eb") : "#ffffff",
                  color: activeCat === cat ? "#ffffff" : "#64748b",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Uniform 3-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
          {filteredFeatured.map((p, i) => (
            <div
              key={`${p.category}-${p.id}-${i}`}
              onClick={() => navigate(p.path)}
              style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", cursor: "pointer", display: "flex", flexDirection: "column", gap: "6px", transition: "border-color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#bfdbfe")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <CatPill cat={p.category} />
                <DiffPill d={p.difficulty} />
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a", lineHeight: 1.35 }}>{p.title}</div>
              <div style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.6, flex: 1 }}>{p.description}</div>
              <div style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, marginTop: "4px" }}>
                Solve this →
              </div>
            </div>
          ))}
        </div>

      </div>{/* /maxWidth wrapper */}

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "3rem 2.5rem 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a", marginBottom: "0.5rem" }}>Data Rejected</div>
              <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.7, maxWidth: "280px" }}>A free SQL practice platform built for data professionals who want to actually do the work.</div>
              <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>LinkedIn</a>
                <a href="https://youtube.com"  target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>YouTube</a>
                <a href="/contact"                                               style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Contact Us</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Product</div>
              {[["Practice", "/sql"], ["Leaderboard", "/leaderboard"], ["Datasets", "/sql"]].map(([label, path]) => (
                <div key={label} onClick={() => navigate(path)} style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "0.4rem", cursor: "pointer" }}>{label}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Legal</div>
              {["Privacy Policy", "Terms of Use"].map((link) => (
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