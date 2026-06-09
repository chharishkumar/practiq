import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { supabase } from "./supabase";
import { useMobile } from "./hooks/useMobile";


function Nav({ navigate, isMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{ padding: isMobile ? "0.75rem 1rem" : "1rem 2.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#ffffff", zIndex: 1000 }}>
      <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.3px", cursor: "pointer" }} onClick={() => navigate("/")}>Data Rejected</span>
      {isMobile ? (
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#0f172a" }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      ) : (
        <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          <Link to="/sql" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>Practice</Link>
          <Link to="/leaderboard" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>Leaderboard</Link>
          <Link to="/blog" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>Blog</Link>
          <Link to="/login" style={{ padding: "8px 18px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>Login</Link>
        </div>
      )}
      {isMobile && menuOpen && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "0.5rem 0", zIndex: 200 }}>
          {[["Practice", "/sql"], ["Leaderboard", "/leaderboard"], ["Blog", "/blog"], ["Login", "/login"]].map(([label, path]) => (
            <div key={label} onClick={() => { navigate(path); setMenuOpen(false); }} style={{ padding: "0.75rem 1.25rem", fontSize: "0.9rem", color: "#0f172a", fontWeight: 500, cursor: "pointer", borderBottom: "1px solid #f1f5f9" }}>
              {label}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}


const CATEGORIES = [
  { label: "SQL Basics", desc: "SELECT, WHERE, ORDER BY, LIMIT — the foundation every analyst needs.",  path: "/sql/basics" },
  { label: "SQL Intermediate", desc: "JOINs, GROUP BY, HAVING, subqueries — where real analysis begins.", path: "/sql/intermediate" },
  { label: "SQL Advanced", desc: "Window functions, CTEs, performance tuning — senior analyst territory.", path: "/sql/advanced" },
  { label: "SQL Interview ⭐", desc: "The exact questions asked at top companies. Practice until they feel easy.", count: "100+ problems", path: "/sql/interview" },
  { label: "Real-world Scenarios", desc: "Customer churn, revenue analysis, cohort retention — actual business problems.", count: "100+ problems", path: "/sql/scenarios" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [query, setQuery] = useState("SELECT * FROM customers;");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [db, setDb] = useState(null);
  const [dbReady, setDbReady] = useState(false);
  const [editorTheme, setEditorTheme] = useState("dark");
  const [fullView, setFullView] = useState(false);
  

  const [community, setCommunity] = useState([]);

useEffect(() => {
  const fetchCommunity = async () => {
    const { data: recentCorrect } = await supabase
      .from("submissions")
      .select("id, user_id, problem_title, category, created_at")
      .eq("status", "correct")
      .order("created_at", { ascending: false })
      .limit(5);

    if (!recentCorrect) return;

    // Fetch profile names for these user_ids
    const userIds = [...new Set(recentCorrect.map(r => r.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);

    const profileMap = {};
    (profiles || []).forEach(p => { profileMap[p.id] = p.full_name || "Anonymous"; });

    const feed = recentCorrect.map(row => ({
      user: profileMap[row.user_id] || "Anonymous",
      problem: row.problem_title,
      category: row.category.replace("sql_", "").replace(/^\w/, c => c.toUpperCase()),
      time: timeAgo(row.created_at),
    }));

    setCommunity(feed);
  };

  fetchCommunity();
}, []);

function timeAgo(dateStr) {
  // Force UTC parsing — Supabase sometimes returns without Z suffix
  const utcStr = dateStr.endsWith("Z") ? dateStr : dateStr + "Z";
  const diff = Math.floor((Date.now() - new Date(utcStr)) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

useEffect(() => {
  const initDb = async () => {
    try {
      const initSqlJs = (await import("sql.js")).default;
      const SQL = await initSqlJs({
        locateFile: () => `${process.env.PUBLIC_URL}/sql-wasm.wasm`,
      });
      const database = new SQL.Database();

      // Fetch real data from Supabase — 500 rows per table
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

        // Create table in sql.js
        const colDefs = table.columns.map(c => `"${c}" TEXT`).join(", ");
        database.run(`CREATE TABLE IF NOT EXISTS ${table.name} (${colDefs});`);

        // Insert rows in batches of 50
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

  // const handleInitialSignup = (e) => {
  //   e.preventDefault();
  //   navigate("/signup", { state: { email: signupEmail } });
  // };

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      <Nav navigate={navigate} isMobile={isMobile} />

      {/* Hero */}
      <div
  style={{
    maxWidth: "1200px",
    margin: "0 auto",
    padding: isMobile ? "2rem 1rem 1.5rem" : "5rem 2.5rem 2rem",
    textAlign: "center"
  }}
>
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "0.75rem",
      color: "#2563eb",
      background: "#eff6ff",
      padding: "5px 14px",
      borderRadius: "20px",
      border: "1px solid #bfdbfe",
      marginBottom: "1.5rem",
      fontWeight: 600
    }}
  >
    <span
      style={{
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "#2563eb",
        display: "inline-block"
      }}
    ></span>
    Free SQL Practice Platform • No Signup Required
  </div>

  <h1
    style={{
      fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
      fontWeight: 800,
      lineHeight: 1.1,
      margin: "0 0 1.25rem",
      letterSpacing: "-1.5px"
    }}
  >
    Practice SQL Like a Data Analyst
    <br />
    <span style={{ color: "#2563eb" }}>
      Solve Real Business Problems
    </span>
  </h1>

  <p
    style={{
      fontSize: "1.05rem",
      color: "#64748b",
      lineHeight: 1.75,
      maxWidth: "620px",
      margin: "0 auto 2rem"
    }}
  >
    Practice SQL on real business datasets. Solve customer churn,
    revenue analysis, retention and interview challenges with
    instant feedback.
  </p>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      marginBottom: "1.25rem"
    }}
  >
    <button
      onClick={() => navigate("/signup")}
      style={{
        padding: "14px 32px",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontWeight: 700,
        fontSize: "0.95rem",
        cursor: "pointer"
      }}
    >
      Start Practicing Free →
    </button>
  </div>

{/* Stats Strip */}
<div
  style={{
    background: "#f8fafc",
    padding: isMobile ? "1.25rem 1rem" : "1.25rem 2rem",
    borderTop: "1px solid #e2e8f0"
  }}
>
  <div
    style={{
      maxWidth: "800px",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: isMobile
        ? "repeat(2, 1fr)"
        : "repeat(4, 1fr)",
      gap: "1rem",
      textAlign: "center"
    }}
  >
    {[
      ["1000+", "Questions"],
      ["25+", "Datasets"],
      ["12K+", "Learners"],
      ["Free", "To Start"]
    ].map(([num, label]) => (
      <div key={label}>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-1px"
          }}
        >
          {num}
        </div>

        <div
          style={{
            fontSize: "0.82rem",
            color: "#64748b",
            marginTop: "4px"
          }}
        >
          {label}
        </div>
      </div>
    ))}
  </div>
</div>

        {/* Live SQL Sandbox */}
        <div style={{
  background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "16px", overflow: "visible",
  textAlign: "left", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", margin: "0 auto 1rem",
  width: "100%", position: fullView ? "fixed" : "relative", inset: fullView ? "16px" : "auto", zIndex: fullView ? 999 : "auto"
}}>
          <div style={{ padding: "0.85rem 1.25rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
            <span style={{ fontSize: "0.78rem", color: "#0f172a", background: "#e2e8f0", padding: "4px 10px", borderRadius: "20px", fontWeight: 700 }}>SQL Sandbox</span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setEditorTheme(editorTheme === "dark" ? "light" : "dark")} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", cursor: "pointer", fontSize: "0.75rem", background: "#fff" }}>Theme</button>
              <button onClick={() => setFullView(!fullView)} style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", cursor: "pointer", fontSize: "0.75rem", background: "#fff" }}>{fullView ? "Exit" : "Full View"}</button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: fullView || isMobile ? "1fr" : "minmax(400px, 40%) 1fr", minHeight: fullView ? "85vh" : isMobile ? "auto" : "600px" }}>
            {!fullView && !isMobile && (
              <div style={{ borderRight: "1px solid #e2e8f0", background: "#f8fafc", padding: "1rem", overflowY: "auto" }}>
                <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: "1rem", letterSpacing: "0.05em" }}>Schema</div>
                {[
  { name: "customers", cols: [["customer_id","INT"],["customer_name","TEXT"],["email","TEXT"],["phone","TEXT"],["city","TEXT"],["state","TEXT"],["country","TEXT"],["status","TEXT"],["customer_type","TEXT"],["lifetime_value","REAL"]] },
  { name: "orders", cols: [["order_id","INT"],["customer_id","INT"],["order_date","TEXT"],["order_status","TEXT"],["payment_status","TEXT"],["total_amount","REAL"],["currency","TEXT"],["delivered_date","TEXT"]] },
  // { name: "order_items", cols: [["order_item_id","INT"],["order_id","INT"],["product_id","INT"],["quantity","INT"],["unit_price","REAL"],["total_price","REAL"]] },
  // { name: "products", cols: [["product_id","INT"],["product_name","TEXT"],["category","TEXT"],["brand","TEXT"],["price","REAL"],["cost_price","REAL"]] },
  // { name: "payments", cols: [["payment_id","INT"],["order_id","INT"],["payment_method","TEXT"],["payment_status","TEXT"],["amount","REAL"],["currency","TEXT"]] },
  // { name: "delivery_partners", cols: [["delivery_partner_id","INT"],["partner_name","TEXT"],["vehicle_type","TEXT"],["city","TEXT"],["status","TEXT"],["rating","REAL"]] },
  // { name: "feedback", cols: [["feedback_id","INT"],["customer_id","INT"],["order_id","INT"],["rating","INT"],["review_text","TEXT"],["issue_category","TEXT"]] },
].map(table => (
  <div key={table.name} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", background: "#fff", marginBottom: "1rem", overflow: "hidden" }}>
    <div style={{ fontSize: "0.75rem", fontWeight: 700, padding: "8px 10px", background: "#f1f5f9", color: "#0f172a" }}>{table.name}</div>
    <table style={{ width: "100%", fontSize: "0.72rem", borderCollapse: "collapse" }}>
      <tbody>
        {table.cols.map(([col, type]) => (
          <tr key={col}>
            <td style={{ padding: "4px 10px", borderBottom: "1px solid #f1f5f9", color: "#0f172a" }}>{col}</td>
            <td style={{ padding: "4px 10px", borderBottom: "1px solid #f1f5f9", color: "#94a3b8" }}>{type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
))}
              </div>
            )}

<div style={{ display: "flex", flexDirection: "column", padding: "1rem", background: "#fff", minWidth: 0, overflow: "hidden" }}>
<Editor
  height={isMobile ? "220px" : "300px"}
  language="sql"
  theme={editorTheme === "dark" ? "vs-dark" : "light"}
  value={query}
  onChange={(v) => setQuery(v || "")}
  options={{ 
    fontSize: 14, 
    minimap: { enabled: false }, 
    wordWrap: "on", 
    scrollBeyondLastLine: false,
    acceptSuggestionOnEnter: "on",
    tabCompletion: "on"
  }}
/>
              <button onClick={runQuery} disabled={!dbReady} style={{ margin: "1rem 0 0.75rem", padding: "10px 20px", background: dbReady ? "#2563eb" : "#94a3b8", color: "#fff", border: "none", borderRadius: "6px", cursor: dbReady ? "pointer" : "not-allowed", fontWeight: 700, fontSize: "0.88rem", alignSelf: "flex-start" }}>
                {dbReady ? "▶ Run Query" : "Loading..."}
              </button>
              <div style={{ flex: 1, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", minHeight: "120px", maxHeight: "250px", overflow: "auto", display: "flex", flexDirection: "column" }}>
  {!results && !error && (
    <span style={{ padding: "1rem", fontSize: "0.8rem", color: "#94a3b8" }}>
      Results appear here after you run a query
    </span>
  )}
  {error && (
    <div style={{ padding: "1rem", color: "#ef4444", fontFamily: "monospace", fontSize: "0.8rem" }}>
      {error}
    </div>
  )}
{results && (
  <div style={{ overflowX: "scroll", overflowY: "auto", width: "100%", WebkitOverflowScrolling: "touch" }}>
    <table style={{ minWidth: "max-content", borderCollapse: "collapse", fontSize: "0.8rem" }}>
      <thead>
        <tr>
          {results.columns.map(col => (
            <th key={col} style={{ textAlign: "left", padding: "8px 12px", borderBottom: "2px solid #e2e8f0", color: "#64748b", fontWeight: 500, whiteSpace: "nowrap", position: "sticky", top: 0, background: "#f8fafc", zIndex: 1 }}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {results.values.map((row, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
            {row.map((cell, j) => (
              <td key={j} style={{ padding: "7px 12px", borderBottom: "1px solid #f1f5f9", color: "#0f172a", whiteSpace: "nowrap" }}>
                {cell === null ? <span style={{ color: "#94a3b8", fontStyle: "italic" }}>null</span> : String(cell)}
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
      </div>



      {/* How It Works */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: isMobile ? "2rem 1rem" : "2.5rem 2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>How it works</div>
          <h2 style={{ fontSize: isMobile ? "1.5rem" : "2rem", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 0.75rem" }}>Start solving real business problems in minutes</h2>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>Most platforms teach you SQL. We make you use it on problems that actually matter at work.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "1.5rem" }}>
          {[
            ["01", "Open the sandbox", "No setup. No downloads. Open the platform and start writing SQL on real business datasets instantly."],
            ["02", "Pick a real problem", "Choose from 1000+ business problems across SQL Basics, Advanced, Interview prep and real-world Scenarios."],
            ["03", "Track your progress", "See your rank on the leaderboard. Share solutions with the community. Build a portfolio employers can see."],
          ].map(([num, title, desc]) => (
            <div key={num} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "1.75rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#2563eb", background: "#eff6ff", width: "fit-content", padding: "4px 10px", borderRadius: "6px", marginBottom: "1rem", letterSpacing: "0.05em" }}>{num}</div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>{title}</div>
              <div style={{ fontSize: "0.83rem", color: "#64748b", lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
 

      {/* What You Can Practice */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: isMobile ? "2rem 1rem" : "3.5rem 2.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.72rem", color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>What you can practice</div>
            <h2 style={{ fontSize: isMobile ? "1.5rem" : "2rem", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 0.75rem" }}>Every SQL skill you need to get hired</h2>
            <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>From your first SELECT to window functions used at top companies.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                onClick={() => navigate(cat.path)}
                style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem", cursor: "pointer", transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#bfdbfe"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a" }}>{cat.label}</div>
                  <div style={{ fontSize: "0.7rem", color: "#2563eb", background: "#eff6ff", padding: "3px 8px", borderRadius: "10px", fontWeight: 600, whiteSpace: "nowrap", marginLeft: "8px" }}>{cat.count}</div>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.65 }}>{cat.desc}</div>
                <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#2563eb", fontWeight: 600 }}>Start practicing →</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community Activity */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: isMobile ? "2rem 1rem" : "3rem 2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Community</div>
          <h2 style={{ fontSize: isMobile ? "1.5rem" : "2rem", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 0.75rem" }}>See what people are solving right now</h2>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.7 }}>Join thousands of data professionals practicing every day.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "10px" }}>
          {community.map((item, i) => (
            <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem", display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#2563eb", flexShrink: 0 }}>
                {item.user.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div style={{ fontSize: "0.82rem", color: "#0f172a" }}><span style={{ fontWeight: 700 }}>{item.user}</span> solved</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0f172a", margin: "2px 0" }}>{item.problem}</div>
                <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                  <span style={{ fontSize: "0.7rem", color: "#2563eb", background: "#eff6ff", padding: "2px 8px", borderRadius: "10px", fontWeight: 500 }}>{item.category}</span>
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dark CTA */}
      <div style={{ background: "#0f172a", color: "#fff", padding: isMobile ? "3rem 1rem" : "5rem 2rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#60a5fa", background: "rgba(96,165,250,0.1)", padding: "5px 14px", borderRadius: "20px", border: "1px solid rgba(96,165,250,0.2)", marginBottom: "1.5rem", fontWeight: 600 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#60a5fa", display: "inline-block" }}></span>
          Join 12,000+ data professionals
        </div>
        <h2 style={{ fontSize: isMobile ? "1.6rem" : "2.2rem", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-1px" }}>Ready for your next SQL interview?</h2>
        <p style={{ color: "#94a3b8", marginBottom: "2.5rem", fontSize: "1rem", lineHeight: 1.7 }}>Practice real analyst scenarios and build confidence before interviews. Start writing real SQL on real data. Free forever to start.</p>
        <button
  onClick={() => navigate("/signup")}
  style={{ padding: "14px 32px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}
>
  Start Practicing Free →
</button>
<p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#475569" }}>No credit card. No setup. Just SQL.</p> </div>

      {/* Footer */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: isMobile ? "2rem 1rem 1.5rem" : "3rem 2.5rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr", gap: "2rem", marginBottom: "2.5rem" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a", marginBottom: "0.5rem" }}>Data Rejected</div>
              <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.7, maxWidth: "260px", marginBottom: "1rem" }}>A free SQL practice platform built for data professionals who want to actually do the work.</div>
              <div style={{ display: "flex", gap: "12px" }}>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ fontSize: "0.8rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>LinkedIn</a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ fontSize: "0.8rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>YouTube</a>
                <a href="/contact" target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Contact Us</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Practice</div>
              {["SQL Basics", "SQL Intermediate", "SQL Advanced", "Interview Questions", "Real-world Scenarios"].map(link => (
                <div key={link} style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "0.4rem", cursor: "pointer" }}>{link}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Platform</div>
              {["Leaderboard", "Blog", "Community"].map(link => (
                <div key={link} style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "0.4rem", cursor: "pointer" }}>{link}</div>
              ))}
            </div>
            <div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
    Legal
  </div>
  
  <Link 
    to="/privacy" 
    style={{ display: "block", fontSize: "0.82rem", color: "#64748b", marginBottom: "0.4rem", textDecoration: "none", cursor: "pointer" }}
  >
    Privacy Policy
  </Link>

  <Link 
    to="/terms" 
    style={{ display: "block", fontSize: "0.82rem", color: "#64748b", marginBottom: "0.4rem", textDecoration: "none", cursor: "pointer" }}
  >
    Terms of Use
  </Link>
</div>
          </div>
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>© 2025 Data Rejected. All rights reserved.</span>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Built for data professionals who want to actually do the work.</span>
          </div>
        </div>
      </div>

    </div>
  );
}