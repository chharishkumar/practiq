import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";

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

const COMMUNITY = [
  { user: "Rahul S.", problem: "Customer Churn Analysis", category: "Scenarios", time: "2m ago" },
  { user: "Priya M.", problem: "Monthly Revenue Trend", category: "Intermediate", time: "8m ago" },
  { user: "Arjun K.", problem: "TOP N Products by Sales", category: "Advanced", time: "15m ago" },
  { user: "Sneha R.", problem: "Find Duplicate Emails", category: "Basics", time: "22m ago" },
  { user: "Vikram D.", problem: "Self Join Employee Manager", category: "Interview", time: "34m ago" },
];

const CATEGORIES = [
  { label: "SQL Basics", desc: "SELECT, WHERE, ORDER BY, LIMIT — the foundation every analyst needs.", count: "40+ problems", path: "/sql/basics" },
  { label: "SQL Intermediate", desc: "JOINs, GROUP BY, HAVING, subqueries — where real analysis begins.", count: "35+ problems", path: "/sql/intermediate" },
  { label: "SQL Advanced", desc: "Window functions, CTEs, performance tuning — senior analyst territory.", count: "30+ problems", path: "/sql/advanced" },
  { label: "SQL Interview ⭐", desc: "The exact questions asked at top companies. Practice until they feel easy.", count: "50+ problems", path: "/sql/interview" },
  { label: "Real-world Scenarios", desc: "Customer churn, revenue analysis, cohort retention — actual business problems.", count: "45+ problems", path: "/sql/scenarios" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("SELECT * FROM customers;");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [db, setDb] = useState(null);
  const [dbReady, setDbReady] = useState(false);
  const [editorTheme, setEditorTheme] = useState("dark");
  const [fullView, setFullView] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");

  useEffect(() => {
    const initDb = async () => {
      try {
        const initSqlJs = (await import("sql.js")).default;
        const SQL = await initSqlJs({
          locateFile: () => `${process.env.PUBLIC_URL}/sql-wasm.wasm`,
        });
        const database = new SQL.Database();
        database.run(SAMPLE_DATA);
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

  const handleInitialSignup = (e) => {
    e.preventDefault();
    navigate("/signup", { state: { email: signupEmail } });
  };

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      {/* Nav */}
      <nav style={{ padding: "1rem 2.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.97)", zIndex: 100 }}>
        <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.3px", cursor: "pointer" }} onClick={() => navigate("/")}>Data Rejected</span>
        <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          {/* <Link to="/home" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Home</Link> */}
          <Link to="/sql" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Practice</Link>
          <Link to="/leaderboard" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Leaderboard</Link>
          <Link to="/blog" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Blog</Link>
          <Link to="/signup" style={{ padding: "8px 18px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>Sign Up Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "5rem 2.5rem 2rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#2563eb", background: "#eff6ff", padding: "5px 14px", borderRadius: "20px", border: "1px solid #bfdbfe", marginBottom: "1.5rem", fontWeight: 600 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2563eb", display: "inline-block" }}></span>
          Free SQL Practice Platform — No signup required
        </div>
        <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 1.25rem", letterSpacing: "-1.5px" }}>
          The SQL Practice Platform<br />
          <span style={{ color: "#2563eb" }}>Built for Real Work</span>
        </h1>
        <p style={{ fontSize: "1.05rem", color: "#64748b", lineHeight: 1.75, maxWidth: "540px", margin: "0 auto 2.5rem" }}>
          Practice SQL on real business datasets. Customer churn, revenue analysis, support tickets and more. No setup. Just write and run.
        </p>

        {/* Live SQL Sandbox */}
        <div style={{
          background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "16px", overflow: "hidden",
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

          <div style={{ display: "grid", gridTemplateColumns: fullView ? "1fr" : "minmax(400px, 40%) 1fr", minHeight: fullView ? "85vh" : "600px" }}>
            {!fullView && (
              <div style={{ borderRight: "1px solid #e2e8f0", background: "#f8fafc", padding: "1rem", overflowY: "auto" }}>
                <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: "1rem", letterSpacing: "0.05em" }}>Schema</div>
                {[
                  { name: "customers", cols: [["customer_id", "INT"], ["customer_name", "TEXT"], ["email", "TEXT"], ["signup_date", "TEXT"]] },
                  { name: "orders", cols: [["order_id", "INT"], ["customer_id", "INT"], ["order_date", "TEXT"], ["amount", "REAL"]] },
                  { name: "products", cols: [["product_id", "INT"], ["product_name", "TEXT"], ["category", "TEXT"], ["price", "REAL"]] },
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

            <div style={{ display: "flex", flexDirection: "column", padding: "1rem", background: "#fff" }}>
              <Editor
                height="300px"
                language="sql"
                theme={editorTheme === "dark" ? "vs-dark" : "light"}
                value={query}
                onChange={(v) => setQuery(v || "")}
                options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: "on", scrollBeyondLastLine: false }}
              />
              <button onClick={runQuery} disabled={!dbReady} style={{ margin: "1rem 0 0.75rem", padding: "10px 20px", background: dbReady ? "#2563eb" : "#94a3b8", color: "#fff", border: "none", borderRadius: "6px", cursor: dbReady ? "pointer" : "not-allowed", fontWeight: 700, fontSize: "0.88rem", alignSelf: "flex-start" }}>
                {dbReady ? "▶ Run Query" : "Loading..."}
              </button>
              <div style={{ flex: 1, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "1rem", overflow: "auto", minHeight: "120px" }}>
                {!results && !error && <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Results appear here after you run a query</span>}
                {error && <div style={{ color: "#ef4444", fontFamily: "monospace", fontSize: "0.8rem" }}>{error}</div>}
                {results && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                      <thead>
                        <tr>{results.columns.map(col => <th key={col} style={{ textAlign: "left", padding: "6px 10px", borderBottom: "2px solid #e2e8f0", color: "#64748b", fontWeight: 500 }}>{col}</th>)}</tr>
                      </thead>
                      <tbody>
                        {results.values.map((row, i) => (
                          <tr key={i}>{row.map((cell, j) => <td key={j} style={{ padding: "6px 10px", borderBottom: "1px solid #f1f5f9", color: "#0f172a" }}>{cell}</td>)}</tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: "3rem" }}>Live sandbox — no signup needed. Write SQL and run it instantly.</p>
      </div>

      {/* Stats Strip */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "2rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", textAlign: "center" }}>
          {[["1000+", "SQL Problems"], ["25+", "Business Datasets"], ["12K+", "Community Members"], ["Free", "To Start"]].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-1px" }}>{num}</div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "3px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "5rem 2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>How it works</div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 0.75rem" }}>From learning to doing in 3 steps</h2>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>Most platforms teach you SQL. We make you use it on problems that actually matter at work.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
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
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "5rem 2.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.72rem", color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>What you can practice</div>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 0.75rem" }}>Every SQL skill you need to get hired</h2>
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
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "5rem 2.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Community</div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 0.75rem" }}>See what people are solving right now</h2>
          <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.7 }}>Join thousands of data professionals practicing every day.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "10px" }}>
          {COMMUNITY.map((item, i) => (
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
      <div style={{ background: "#0f172a", color: "#fff", padding: "5rem 2rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#60a5fa", background: "rgba(96,165,250,0.1)", padding: "5px 14px", borderRadius: "20px", border: "1px solid rgba(96,165,250,0.2)", marginBottom: "1.5rem", fontWeight: 600 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#60a5fa", display: "inline-block" }}></span>
          Join 12,000+ data professionals
        </div>
        <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-1px" }}>Ready to solve real data problems?</h2>
        <p style={{ color: "#94a3b8", marginBottom: "2.5rem", fontSize: "1rem", lineHeight: 1.7 }}>Stop watching tutorials. Start writing real SQL on real data. Free forever to start.</p>
        <form onSubmit={handleInitialSignup} style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <input
            type="email" placeholder="Enter your work email" required value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            style={{ padding: "13px 18px", borderRadius: "8px", border: "1px solid #1e293b", background: "#1e293b", color: "#fff", width: "280px", fontSize: "0.9rem", outline: "none" }}
          />
          <button type="submit" style={{ padding: "13px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
            Start Practicing Free →
          </button>
        </form>
        <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#475569" }}>No credit card. No setup. Just SQL.</p>
      </div>

      {/* Footer */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "3rem 2.5rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "2rem", marginBottom: "2.5rem" }}>
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
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Legal</div>
              {["Privacy Policy", "Terms of Use"].map(link => (
                <div key={link} style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "0.4rem", cursor: "pointer" }}>{link}</div>
              ))}
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