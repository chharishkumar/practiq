import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import { useMobile } from "./hooks/useMobile";
import Editor from "@monaco-editor/react";

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "SQL Basics",                    path: "/sql/basics" },
  { label: "SQL Intermediate",              path: "/sql/intermediate" },
  { label: "SQL Advanced",                  path: "/sql/advanced" },
  { label: "SQL Interview Questions ⭐",    path: "/sql/interview" },
  { label: "SQL Scenarios (Real-world)",    path: "/sql/scenarios" },
];

// ─── STATIC TABLE PREVIEWS ────────────────────────────────────────────────────

const TABLE_DATA = {
  customers: {
    columns: ["customer_id","customer_name","email","phone"],
    rows: [
      [1,"Alice Johnson","alice@email.com","9876543210"],
      [2,"Bob Smith","bob@email.com","9012345678"],
      [3,"Carol White","carol@email.com","8765432109"],
    ],
  },
  orders: {
    columns: ["order_id","customer_id","order_date","order_status","payment_status"],
    rows: [
      [1001,1,"2024-01-10","delivered","paid"],
      [1002,1,"2024-02-15","delivered","paid"],
      [1003,2,"2024-03-20","shipped","paid"],
    ],
  },
  order_items: {
    columns: ["order_item_id","order_id","product_id","quantity","unit_price","total_price"],
    rows: [
      [1,1001,101,2,"250.00","500.00"],
      [2,1001,102,1,"750.00","750.00"],
      [3,1002,103,3,"296.67","890.00"],
    ],
  },
  products: {
    columns: ["product_id","product_name","category","subcategory"],
    rows: [
      [101,"Starter Plan","subscription","monthly"],
      [102,"Pro Plan","subscription","annual"],
      [103,"Analytics Kit","services","onboarding"],
    ],
  },
  payments: {
    columns: ["payment_id","order_id","payment_method","payment_status","amount","currency"],
    rows: [
      [5001,1001,"UPI","success","1250.00","INR"],
      [5002,1002,"credit_card","success","890.00","INR"],
      [5003,1003,"net_banking","success","2100.00","INR"],
    ],
  },
  delivery_partners: {
    columns: ["delivery_partner_id","partner_name","vehicle_type","city","status","rating"],
    rows: [
      [201,"Raju Kumar","bike","Mumbai","active","4.8"],
      [202,"Suresh Patel","scooter","Delhi","active","4.5"],
      [203,"Amit Singh","bike","Bangalore","inactive","4.2"],
    ],
  },
  feedback: {
    columns: ["feedback_id","customer_id","order_id","rating","issue_category"],
    rows: [
      [301,1,1001,5,"none"],
      [302,2,1003,3,"late_delivery"],
      [303,3,1002,4,"product_quality"],
    ],
  },
};

// ─── COLOURS ──────────────────────────────────────────────────────────────────

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
  const utcStr = dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
  const diff = Math.floor((Date.now() - new Date(utcStr)) / 1000);
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

function CatPill({ cat }) {
  const color = CAT_COLORS[cat] || "#2563eb";
  return (
    <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "10px", fontWeight: 600, background: "#f8fafc", color, border: `1px solid ${color}22` }}>
      {cat}
    </span>
  );
}

function Nav({ navigate, isMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{ padding: isMobile ? "0.75rem 1rem" : "1rem 2.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.97)", zIndex: 100 }}>
      <span onClick={() => navigate("/")} style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a", letterSpacing: "-0.3px", cursor: "pointer" }}>Data Rejected</span>
      {isMobile ? (
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#0f172a" }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      ) : (
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <span onClick={() => navigate("/home")}        style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600, cursor: "pointer" }}>Home</span>
          <span onClick={() => navigate("/sql")}         style={{ fontSize: "0.85rem", color: "#2563eb", fontWeight: 600, cursor: "pointer", borderBottom: "2px solid #2563eb", paddingBottom: "2px" }}>Practice</span>
          <span onClick={() => navigate("/leaderboard")} style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600, cursor: "pointer" }}>Leaderboard</span>
          <Link to="/profile"                            style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>Profile</Link>
          <Link to="/blog"                               style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>Blog</Link>
        </div>
      )}
      {isMobile && menuOpen && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "0.5rem 0", zIndex: 200 }}>
          {[["Home", "/home"], ["Practice", "/sql"], ["Leaderboard", "/leaderboard"], ["Profile", "/profile"], ["Blog", "/blog"]].map(([label, path]) => (
            <div key={label} onClick={() => { navigate(path); setMenuOpen(false); }} style={{ padding: "0.75rem 1.25rem", fontSize: "0.9rem", color: "#0f172a", fontWeight: 500, cursor: "pointer", borderBottom: "1px solid #f1f5f9" }}>
              {label}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}

export default function SQLPage() {
  const navigate = useNavigate();

  // SQL sandbox state
  const [query, setQuery]       = useState("SELECT * FROM customers LIMIT 5;");
  const [results, setResults]   = useState(null);
  const [error, setError]       = useState(null);
  const [db, setDb]             = useState(null);
  const [dbReady, setDbReady]   = useState(false);
  const [activeTab, setActiveTab] = useState("customers");
  const [fullscreen, setFullscreen] = useState(false);

  const [leaderboard, setLeaderboard] = useState(FALLBACK_LEADERBOARD);
  const [community, setCommunity]     = useState(FALLBACK_COMMUNITY);
  const isMobile = useMobile();

  // Init SQL.js
  useEffect(() => {
    const initDb = async () => {
      try {
        const initSqlJs = (await import("sql.js")).default;
        const SQL = await initSqlJs({
          locateFile: () => `${process.env.PUBLIC_URL}/sql-wasm.wasm`,
        });
        const database = new SQL.Database();
  
        const tables = [
          { name: "customers", columns: ["customer_id","customer_name","email","phone","city","state","country","postal_code","created_date","activated_date","last_login_date","last_order_date","status","customer_type","acquisition_channel","lifetime_value","is_verified"] },
          { name: "orders", columns: ["order_id","customer_id","order_date","order_status","payment_status","delivery_partner_id","subtotal_amount","tax_amount","discount_amount","delivery_fee","total_amount","currency","estimated_delivery_time","delivered_date","cancelled_date","cancellation_reason"] },
          { name: "order_items", columns: ["order_item_id","order_id","product_id","quantity","unit_price","discount_amount","tax_amount","total_price","item_status","currency"] },
          { name: "products", columns: ["product_id","product_name","product_description","category","subcategory","brand","sku","price","cost_price","currency","is_active"] },
          { name: "payments", columns: ["payment_id","order_id","payment_method","payment_provider","transaction_reference","payment_status","amount","currency","refund_amount","refund_date","failure_reason","payment_date","attempt_number"] },
          { name: "delivery_partners", columns: ["delivery_partner_id","partner_name","phone","vehicle_type","vehicle_number","city","status","joining_date","last_active_date","rating","total_deliveries"] },
          { name: "feedback", columns: ["feedback_id","customer_id","order_id","rating","review_text","feedback_channel","issue_category"] },
        ];
  
        for (const table of tables) {
          const { data, error } = await supabase
            .from(table.name)
            .select(table.columns.join(","))
            .limit(500);
  
          if (error || !data || data.length === 0) continue;
  
          const colDefs = table.columns.map(c => `"${c}" TEXT`).join(", ");
          database.run(`CREATE TABLE IF NOT EXISTS ${table.name} (${colDefs});`);
  
          const batchSize = 50;
          for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            const placeholders = batch.map(() =>
              `(${table.columns.map(() => "?").join(",")})`
            ).join(",");
            const values = batch.flatMap(row =>
              table.columns.map(col => {
                const val = row[col];
                if (val === null || val === undefined) return null;
                return String(val);
              })
            );
            database.run(
              `INSERT INTO ${table.name} (${table.columns.map(c => `"${c}"`).join(",")}) VALUES ${placeholders}`,
              values
            );
          }
        }
  
        setDb(database);
        setDbReady(true);
      } catch (err) {
        console.error("SQL.js failed to load:", err);
      }
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
          const { data: profilesById } = await supabase
            .from("profiles")
            .select("id, full_name");

          const nameMap = {};
          (profilesById || []).forEach((p) => { nameMap[p.id] = p.full_name || "Anonymous"; });

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

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") runQuery();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [runQuery]);

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      {/* FULLSCREEN MODAL */}
      {fullscreen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#ffffff", display: "flex", flexDirection: "column" }}>
          {/* Fullscreen Top Bar */}
          <div style={{ padding: "0.85rem 1.25rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", flexShrink: 0 }}>
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
                style={{ padding: "8px 20px", borderRadius: "6px", background: dbReady ? "#2563eb" : "#94a3b8", color: "#fff", fontWeight: 700, fontSize: "0.82rem", border: "none", cursor: dbReady ? "pointer" : "not-allowed" }}
              >
                {dbReady ? "▶ Run Query" : "Loading…"}
              </button>
              <button
                onClick={() => setFullscreen(false)}
                style={{ padding: "8px 16px", borderRadius: "6px", background: "#fff", color: "#ef4444", fontWeight: 700, fontSize: "0.82rem", border: "1.5px solid #fca5a5", cursor: "pointer" }}
              >
                ✕ Exit Fullscreen
              </button>
            </div>
          </div>

          {/* Fullscreen Grid */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "450px minmax(0, 1fr)", flex: 1, overflow: "hidden" }}>
            {/* LEFT: table preview (Hidden on fullscreen mobile to save screen real estate) */}
            {!isMobile && (
              <div style={{ borderRight: "1px solid #e2e8f0", background: "#f8fafc", padding: "1rem", overflowX: "auto", overflowY: "auto", scrollbarWidth: "thin", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: "1rem", letterSpacing: "0.05em" }}>
                  {activeTab} Preview
                </div>
                <table style={{ borderCollapse: "collapse", fontSize: "0.74rem", width: "100%", minWidth: "max-content" }}>
                  <thead>
                    <tr style={{ background: "#f1f5f9" }}>
                      {TABLE_DATA[activeTab].columns.map((col) => (
                        <th key={col} style={{ textAlign: "left", color: "#475569", padding: "8px 10px", borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap", fontWeight: 700 }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TABLE_DATA[activeTab].rows.map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "#ffffff" }}>
                        {row.map((cell, j) => (
                          <td key={j} style={{ padding: "8px 10px", color: "#1e293b", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* RIGHT: editor + results */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1, overflow: "hidden" }}>
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

              {/* Results Output */}
              <div style={{ flex: "0 0 40%", padding: "0.75rem 1.25rem", background: "#f8fafc", overflow: "auto" }}>
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
      )}

      <Nav navigate={navigate} isMobile={isMobile} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)", borderBottom: "1px solid #e2e8f0", padding: isMobile ? "2rem 1rem 1.5rem" : "3rem 2.5rem 2.5rem", textAlign: "center" }}>
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

      {/* ── LEADERBOARD STRIP ── */}
      <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: isMobile ? "0.75rem 1rem" : "0.85rem 2.5rem" }}>
        <div style={{ 
          maxWidth: "1100px", 
          margin: "0 auto", 
          display: "flex", 
          alignItems: "center", 
          gap: "1.5rem", 
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none"
        }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>🏆 Top Solvers</span>
          {leaderboard.map((u) => (
            <div key={u.rank} style={{ display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: "0.82rem" }}>{u.badge || `#${u.rank}`}</span>
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f172a" }}>{u.name}</span>
              <span style={{ fontSize: "0.75rem", color: "#2563eb", background: "#eff6ff", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>{u.solved} solved</span>
            </div>
          ))}
          <span onClick={() => navigate("/leaderboard")} style={{ fontSize: "0.75rem", color: "#2563eb", cursor: "pointer", marginLeft: isMobile ? "1rem" : "auto", whiteSpace: "nowrap", fontWeight: 600 }}>
            View full leaderboard →
          </span>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: isMobile ? "1rem 1rem" : "2.5rem 2.5rem" }}>

        {/* ── CATEGORY BUTTONS ───────────────────────────────────────────── */}
        <div style={{ marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Choose a Category</span>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.path}
              onClick={() => navigate(cat.path)}
              style={{ padding: isMobile ? "8px 14px" : "10px 20px", borderRadius: "8px", background: "#ffffff", color: "#2563eb", fontWeight: 600, fontSize: "0.85rem", border: "1.5px solid #bfdbfe", cursor: "pointer" }}
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

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "10px", marginBottom: "2.5rem" }}>
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

        {/* ── SQL SANDBOX SECTION ────────────────────────────────────────── */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Free Sandbox</span>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0.25rem 0 0", color: "#0f172a" }}>Write and run SQL queries instantly</h2>
        </div>

        {/* Responsive Sandbox Container */}
        <div style={{ 
          border: "1px solid #e2e8f0", 
          borderRadius: "12px", 
          overflow: "hidden", 
          display: "flex", 
          flexDirection: "column", 
          background: "#ffffff" 
        }}>
          {/* Controls Bar */}
          <div style={{ 
            padding: "0.75rem 1rem", 
            borderBottom: "1px solid #e2e8f0", 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            gap: "12px",
            justifyContent: "space-between", 
            alignItems: isMobile ? "stretch" : "center", 
            background: "#f8fafc" 
          }}>
            <div style={{ display: "flex", gap: "6px", alignItems: "center", overflowX: "auto" }}>
              <span style={{ fontSize: "0.72rem", color: "#475569", background: "#e2e8f0", padding: "3px 8px", borderRadius: "4px", fontWeight: 700 }}>SCHEMA</span>
              {!isMobile && ["customers", "orders", "order_items", "products", "payments", "delivery_partners", "feedback"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  style={{
                    fontSize: "0.72rem", padding: "3px 8px", borderRadius: "6px", border: "1px solid",
                    borderColor: activeTab === t ? "#2563eb" : "#e2e8f0",
                    background: activeTab === t ? "#eff6ff" : "#ffffff",
                    color: activeTab === t ? "#2563eb" : "#64748b",
                    cursor: "pointer", fontWeight: activeTab === t ? 600 : 400
                  }}
                >
                  {t}
                </button>
              ))}
              {isMobile && <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 500 }}>Active Workspace Dataset</span>}
            </div>
            
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button
                onClick={runQuery}
                disabled={!dbReady}
                style={{ flex: isMobile ? 1 : "none", padding: "8px 16px", borderRadius: "6px", background: dbReady ? "#2563eb" : "#94a3b8", color: "#fff", fontWeight: 700, fontSize: "0.82rem", border: "none", cursor: dbReady ? "pointer" : "not-allowed" }}
              >
                {dbReady ? "▶ Run Query" : "Loading…"}
              </button>
              <button
                onClick={() => setFullscreen(true)}
                style={{ padding: "8px 12px", borderRadius: "6px", background: "#fff", color: "#334155", fontWeight: 600, fontSize: "0.82rem", border: "1.5px solid #cbd5e1", cursor: "pointer" }}
              >
                {isMobile ? "⛶ Fullscreen" : "Maximize ⛶"}
              </button>
            </div>
          </div>

          {/* Sandbox Core Content Area */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "340px minmax(0, 1fr)", minHeight: isMobile ? "auto" : "400px" }}>
            
            {/* Table Preview Panel */}
            {!isMobile && (
              <div style={{ borderRight: "1px solid #e2e8f0", background: "#f8fafc", padding: "1rem", overflowX: "auto", overflowY: "auto", maxHeight: "400px" }}>
                <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.75rem", letterSpacing: "0.04em" }}>
                  {activeTab} Preview (Top 3 rows)
                </div>
                <table style={{ borderCollapse: "collapse", fontSize: "0.72rem", width: "100%" }}>
                  <thead>
                    <tr style={{ background: "#e2e8f0" }}>
                      {TABLE_DATA[activeTab].columns.map((col) => (
                        <th key={col} style={{ textAlign: "left", color: "#334155", padding: "6px 8px", borderBottom: "1.5px solid #cbd5e1" }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TABLE_DATA[activeTab].rows.map((row, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "#ffffff" }}>
                        {row.map((cell, j) => (
                          <td key={j} style={{ padding: "6px 8px", color: "#334155", borderBottom: "1px solid #e2e8f0" }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Monaco Editor Stack */}
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ height: "240px", borderBottom: "1px solid #e2e8f0", background: "#0f172a" }}>
                <Editor
                  height="100%"
                  defaultLanguage="sql"
                  theme="vs-dark"
                  value={query}
                  onChange={(v) => setQuery(v || "")}
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    automaticLayout: true,
                    padding: { top: 8 },
                    wordWrap: "on"
                  }}
                />
              </div>

              {/* Execution Console Results */}
              <div style={{ flex: 1, padding: "1rem", background: "#f8fafc", minHeight: "120px" }}>
                <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                  Output {results ? `— ${results.values.length} rows` : ""}
                </div>
                {!results && !error && <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Results will append here. Press Ctrl+Enter to execute.</span>}
                {error && <span style={{ fontSize: "0.8rem", color: "#ef4444", fontFamily: "monospace" }}>{error}</span>}
                {results && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ borderCollapse: "collapse", fontSize: "0.76rem", width: "100%" }}>
                      <thead>
                        <tr>
                          {results.columns.map((col) => (
                            <th key={col} style={{ padding: "6px 10px", textAlign: "left", color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.values.slice(0, 15).map((row, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                            {row.map((cell, j) => (
                              <td key={j} style={{ padding: "6px 10px", borderBottom: "1px solid #f1f5f9", color: "#0f172a" }}>{cell}</td>
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

      </div>
    </div>
  );
}