import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabase";
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

export default function LandingPage() {
  const [query, setQuery] = useState("SELECT * FROM customers;");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [db, setDb] = useState(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const [editorTheme, setEditorTheme] = useState("dark");
  const [fullView, setFullView] = useState(false);

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
      if (res.length === 0) {
        setError("Query returned no results.");
        return;
      }
      setResults(res[0]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async () => {
    if (!email) return;
    const { error } = await supabase.from("waitlist").insert([{ email }]);
    if (!error) setSubmitted(true);
    else alert("Something went wrong. Please try again.");
  };

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      {/* Nav */}
      <nav style={{ padding: "1rem 2.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.97)", zIndex: 100 }}>
        <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", letterSpacing: "-0.3px" }}>Data Rejected</span>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link to="/sql" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Practice</Link>
          <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500, cursor: "pointer" }}>Problems</span>
          <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500, cursor: "pointer" }}>Leaderboard</span>
          <button
            onClick={() => document.getElementById("waitlist").scrollIntoView({ behavior: "smooth" })}
            style={{ padding: "8px 18px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: "pointer" }}
          >
            Join Waitlist
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "5rem 2.5rem 2rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#2563eb", background: "#eff6ff", padding: "5px 14px", borderRadius: "20px", border: "1px solid #bfdbfe", marginBottom: "1.5rem", fontWeight: 600 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2563eb", display: "inline-block" }}></span>
          Now in Beta — Join the waitlist
        </div>

        <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 1.25rem", letterSpacing: "-1.5px", color: "#0f172a" }}>
          The SQL Practice Platform<br />
          <span style={{ color: "#2563eb" }}>Built for Real Work</span>
        </h1>

        <p style={{ fontSize: "1.05rem", color: "#64748b", lineHeight: 1.75, maxWidth: "540px", margin: "0 auto 2.5rem" }}>
          A free SQL sandbox + 1000+ real business problems. Practice on actual datasets — customer churn, revenue analysis, support tickets and more.
        </p>

        {/* Live SQL Sandbox */}
        <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #e2e8f0",
        borderRadius: "16px",
        overflow: "hidden",
        textAlign: "left",
        boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
        margin: "0 auto 1rem",
        width: fullView ? "auto" : "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        position: fullView ? "fixed" : "relative",
        inset: fullView ? "16px" : "auto",
        zIndex: fullView ? 999 : "auto",
      }}
        >
          {/* Sandbox Header */}
          <div style={{ padding: "0.85rem 1.25rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "0.78rem", color: "#0f172a", background: "#e2e8f0", padding: "4px 10px", borderRadius: "20px", fontWeight: 700 }}>SQL</span>
              <span style={{ fontSize: "0.75rem", color: "#64748b", padding: "3px 6px" }}>customers • orders • products</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={() => setEditorTheme(editorTheme === "dark" ? "light" : "dark")}
                style={{ padding: "7px 12px", borderRadius: "6px", background: "#ffffff", color: "#334155", fontWeight: 600, fontSize: "0.78rem", border: "1px solid #cbd5e1", cursor: "pointer" }}
              >
                {editorTheme === "dark" ? "Light Theme" : "Dark Theme"}
              </button>
              <button
                onClick={() => setFullView(!fullView)}
                style={{ padding: "7px 12px", borderRadius: "6px", background: "#ffffff", color: "#334155", fontWeight: 600, fontSize: "0.78rem", border: "1px solid #cbd5e1", cursor: "pointer" }}
              >
                {fullView ? "Exit Full View" : "Full View"}
              </button>
            </div>
          </div>

          {/* SQL Workspace */}
          <div style={{ display: "grid", gridTemplateColumns: fullView ? "1fr" : "minmax(420px, 44%) minmax(0, 56%)", minHeight: fullView ? "calc(100vh - 110px)" : "clamp(560px, 72vh, 760px)" }}>
            {/* Tables Preview */}
            {!fullView && (
              <div style={{ borderRight: "1px solid #e2e8f0", background: "#f8fafc" }}>
                <div style={{ padding: "0.72rem 1rem", borderBottom: "1px solid #e2e8f0", fontSize: "0.72rem", color: "#64748b", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Tables
                </div>
                <div style={{ padding: "0.9rem", display: "grid", gap: "0.9rem" }}>
                  {/* Customers table */}
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", background: "#fff", overflow: "auto" }}>
                    <div style={{ fontSize: "0.72rem", color: "#0f172a", fontWeight: 700, padding: "0.55rem 0.7rem", borderBottom: "1px solid #f1f5f9" }}>customers</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.74rem" }}>
                      <thead>
                        <tr>
                          {["customer_id", "customer_name", "email"].map(col => (
                            <th key={col} style={{ textAlign: "left", color: "#64748b", padding: "4px 8px", fontWeight: 600, borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          [1, "Alice Johnson", "alice@email.com"],
                          [2, "Bob Smith", "bob@email.com"],
                          [3, "Carol White", "carol@email.com"],
                          [4, "David Brown", "david@email.com"],
                          [5, "Emma Davis", "emma@email.com"],
                        ].map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j} style={{ padding: "4px 8px", color: "#475569", borderBottom: "1px solid #f8fafc", whiteSpace: "nowrap" }}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Orders table */}
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", background: "#fff", overflow: "auto" }}>
                    <div style={{ fontSize: "0.72rem", color: "#0f172a", fontWeight: 700, padding: "0.55rem 0.7rem", borderBottom: "1px solid #f1f5f9" }}>orders</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.74rem" }}>
                      <thead>
                        <tr>
                          {["order_id", "customer_id", "amount"].map(col => (
                            <th key={col} style={{ textAlign: "left", color: "#64748b", padding: "4px 8px", fontWeight: 600, borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          [1, 1, "$250.00"],
                          [2, 1, "$180.00"],
                          [3, 3, "$320.00"],
                          [4, 5, "$150.00"],
                          [5, 2, "$410.00"],
                        ].map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j} style={{ padding: "4px 8px", color: "#475569", borderBottom: "1px solid #f8fafc", whiteSpace: "nowrap" }}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Products table */}
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: "8px", background: "#fff", overflow: "auto" }}>
                    <div style={{ fontSize: "0.72rem", color: "#0f172a", fontWeight: 700, padding: "0.55rem 0.7rem", borderBottom: "1px solid #f1f5f9" }}>products</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.74rem" }}>
                      <thead>
                        <tr>
                          {["product_id", "product_name", "category", "price"].map(col => (
                            <th key={col} style={{ textAlign: "left", color: "#64748b", padding: "4px 8px", fontWeight: 600, borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          [1, "Starter Plan", "subscription", "$29.00"],
                          [2, "Pro Plan", "subscription", "$99.00"],
                          [3, "Onboarding Kit", "services", "$199.00"],
                          [4, "Analytics Add-on", "addon", "$49.00"],
                          [5, "Priority Support", "services", "$79.00"],
                        ].map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j} style={{ padding: "4px 8px", color: "#475569", borderBottom: "1px solid #f8fafc", whiteSpace: "nowrap" }}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Editor + Results */}
            <div style={{ display: "flex", flexDirection: "column", background: "#ffffff", padding: "1rem", gap: "0.85rem" }}>
            <Editor
  height={fullView ? "60vh" : "400px"}
  language="sql"
  value={query}
  onChange={(value) => setQuery(value || "")}
  theme={editorTheme === "dark" ? "vs-dark" : "light"}
  options={{
    fontSize: 14,
    minimap: { enabled: false },
    wordWrap: "on",
    scrollBeyondLastLine: false,

    // ✅ ADD THESE ↓↓↓
    padding: { top: 8, bottom: 8 },
    lineHeight: 20,
  }}
/>

              <div>
                <button
                  onClick={runQuery}
                  disabled={!dbReady}
                  style={{ padding: "9px 20px", borderRadius: "6px", background: dbReady ? "#2563eb" : "#94a3b8", color: "#fff", fontWeight: 700, fontSize: "0.84rem", border: "none", cursor: dbReady ? "pointer" : "not-allowed" }}
                >
                  {dbReady ? "▶ Run Query" : "Loading..."}
                </button>
              </div>

              {/* Results */}
              <div style={{ minHeight: "170px", padding: "0.75rem 0.9rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", flex: 1 }}>
                {error && (
                  <span style={{ fontSize: "0.8rem", color: "#ef4444", fontFamily: "monospace" }}>{error}</span>
                )}
                {results && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ borderCollapse: "collapse", fontSize: "0.78rem" }}>
                      <thead>
                        <tr>
                          {results.columns.map(col => (
                            <th key={col} style={{ padding: "4px 12px", textAlign: "left", color: "#64748b", fontWeight: 500, borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.values.map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j} style={{ padding: "4px 12px", color: "#0f172a", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{cell}</td>
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

        <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "3rem" }}>Live SQL sandbox — no signup needed. Just write and run.</p>
      </div>

      {/* Stats */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "2rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", textAlign: "center" }}>
          {[["1000+", "SQL Problems"], ["25+", "Business Datasets"], ["12K+", "Community Members"], ["Free", "To Start"]].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-1px" }}>{num}</div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "3px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#2563eb", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>How it works</div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 0.75rem" }}>From learning to doing in 3 steps</h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.7 }}>Most platforms teach you SQL. We make you use it on problems that actually matter.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
          {[
            ["1", "Practice freely", "Use our live SQL sandbox on real business datasets. No setup. No downloads. Just open and start writing."],
            ["2", "Solve real problems", "Pick from 1000+ business problems — customer churn, revenue analysis, cohort tracking and more. Every problem has context, hints and validation."],
            ["3", "Track and prove it", "See your scores on the leaderboard. Earn certificates. Build a portfolio that shows employers you can actually do the work."],
          ].map(([num, title, desc]) => (
            <div key={num} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#eff6ff", color: "#2563eb", fontSize: "0.82rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>{num}</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>{title}</div>
              <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ fontSize: "0.72rem", color: "#2563eb", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Products</div>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.5px" }}>Everything you need to get job ready</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
            {[
              ["SQL Practice", "1000+ real business problems with live execution, hints, and validation. From basic selects to advanced window functions.", "#2563eb", false],
              ["Python Practice", "Coming soon — real data problems in Python using pandas, numpy and more. Same real-world approach.", "#94a3b8", true],
              ["Business Datasets", "25+ curated datasets across e-commerce, SaaS, finance and healthcare. Real structure, realistic data.", "#2563eb", false],
            ].map(([title, desc, color, soon]) => (
              <div key={title} style={{ background: "#ffffff", border: `1.5px solid ${soon ? "#e2e8f0" : "#bfdbfe"}`, borderRadius: "12px", padding: "1.5rem", opacity: soon ? 0.7 : 1 }}>
                {soon && <div style={{ fontSize: "0.7rem", color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: "10px", display: "inline-block", marginBottom: "0.75rem" }}>Coming Soon</div>}
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>{title}</div>
                <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Waitlist CTA */}
      <div id="waitlist" style={{ maxWidth: "600px", margin: "0 auto", padding: "5rem 2rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 1rem" }}>Ready to actually practice?</h2>
        <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "2rem" }}>Join 12,000+ data professionals already in the community. Get early access when we launch.</p>
        {!submitted ? (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            <input
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{ padding: "12px 18px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.9rem", width: "260px", outline: "none", color: "#0f172a" }}
            />
            <button
              onClick={handleSubmit}
              style={{ padding: "12px 24px", borderRadius: "8px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: "pointer" }}
            >
              Join Waitlist
            </button>
          </div>
        ) : (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "1.25rem", color: "#16a34a", fontSize: "0.95rem" }}>
            You're on the list. We'll notify you at launch.
          </div>
        )}
        <p style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "#94a3b8" }}>Free to join. No spam. One email when we launch.</p>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #e2e8f0", padding: "1.5rem 2rem", textAlign: "center", color: "#94a3b8", fontSize: "0.78rem" }}>
        © 2025 Data Rejected · Built for data professionals who want to actually do the work.
      </div>

    </div>
  );
}