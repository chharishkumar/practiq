import { useEffect, useRef, useState } from "react";

const SAMPLE_PROBLEM = {
  id: 1,
  title: "Customer Churn Analysis",
  difficulty: "Medium",
  context: "Your manager needs a list of customers who haven't placed an order in the last 90 days. The sales team needs to follow up with these at-risk accounts.",
  task: "Write a SQL query to find all customers who have not placed any orders. Return customer_id and customer_name.",
  expectedColumns: ["customer_id", "customer_name"],
  hint: "Use a LEFT JOIN between customers and orders, then filter where order_id is NULL.",
};

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

INSERT INTO customers VALUES (1, 'Alice Johnson', 'alice@email.com', '2023-01-15');
INSERT INTO customers VALUES (2, 'Bob Smith', 'bob@email.com', '2023-02-20');
INSERT INTO customers VALUES (3, 'Carol White', 'carol@email.com', '2023-03-10');
INSERT INTO customers VALUES (4, 'David Brown', 'david@email.com', '2023-04-05');
INSERT INTO customers VALUES (5, 'Emma Davis', 'emma@email.com', '2023-05-12');

INSERT INTO orders VALUES (1, 1, '2024-01-10', 250.00);
INSERT INTO orders VALUES (2, 1, '2024-02-15', 180.00);
INSERT INTO orders VALUES (3, 3, '2024-03-20', 320.00);
INSERT INTO orders VALUES (4, 5, '2024-01-25', 150.00);
`;

export default function PracticePage() {
  const [query, setQuery] = useState("-- Write your SQL query here\nSELECT ");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [db, setDb] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const initDb = async () => {
      const initSqlJs = (await import("sql.js")).default;
      const SQL = await initSqlJs({
        locateFile: () => `${process.env.PUBLIC_URL}/sql-wasm.wasm`,
      });
      const database = new SQL.Database();
      database.run(SAMPLE_DATA);
      setDb(database);
    };
    initDb();
  }, []);

  const runQuery = () => {
    if (!db) return;
    setError(null);
    setResults(null);
    setStatus(null);
    try {
      const res = db.exec(query);
      if (res.length === 0) {
        setError("Query returned no results.");
        return;
      }
      const { columns, values } = res[0];
      setResults({ columns, values });
      const hasExpectedColumns = SAMPLE_PROBLEM.expectedColumns.every(col =>
        columns.map(c => c.toLowerCase()).includes(col.toLowerCase())
      );
      if (hasExpectedColumns && values.length === 2) {
        setStatus("correct");
      } else {
        setStatus("incorrect");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", fontFamily: "Inter, sans-serif", color: "#f8fafc", display: "flex", flexDirection: "column" }}>

      {/* Nav */}
      <nav style={{ padding: "1rem 2rem", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Data Rejected</span>
        <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Problem 1 of 50</span>
      </nav>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", flex: 1, height: "calc(100vh - 57px)" }}>

        {/* Left Panel — Problem */}
        <div style={{ borderRight: "1px solid #1e293b", padding: "2rem", overflowY: "auto" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#34d399", background: "#022c22", padding: "3px 10px", borderRadius: "20px", border: "1px solid #064e3b" }}>{SAMPLE_PROBLEM.difficulty}</span>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Problem #{SAMPLE_PROBLEM.id}</span>
          </div>

          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: "0 0 1.5rem", color: "#f8fafc" }}>{SAMPLE_PROBLEM.title}</h2>

          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Business Context</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.7, margin: 0, background: "#1e293b", padding: "1rem", borderRadius: "8px", border: "1px solid #334155" }}>{SAMPLE_PROBLEM.context}</p>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Your Task</div>
            <p style={{ color: "#f8fafc", fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{SAMPLE_PROBLEM.task}</p>
          </div>

          {/* Schema */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Tables Available</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["customers (customer_id, customer_name, email, signup_date)", "orders (order_id, customer_id, order_date, amount)"].map(table => (
                <div key={table} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.78rem", color: "#94a3b8", fontFamily: "monospace" }}>{table}</div>
              ))}
            </div>
          </div>

          {/* Hint */}
          <button
            onClick={() => setShowHint(!showHint)}
            style={{ background: "transparent", border: "1px solid #334155", color: "#64748b", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem" }}
          >
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
          {showHint && (
            <div style={{ marginTop: "1rem", background: "#1a1a2e", border: "1px solid #2d1a4e", borderRadius: "8px", padding: "1rem", color: "#a855f7", fontSize: "0.85rem", lineHeight: 1.6 }}>
              {SAMPLE_PROBLEM.hint}
            </div>
          )}
        </div>

        {/* Right Panel — Editor + Results */}
        <div style={{ display: "flex", flexDirection: "column" }}>

          {/* Editor */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", borderBottom: "1px solid #1e293b" }}>
            <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0f172a" }}>
              <span style={{ fontSize: "0.78rem", color: "#64748b", fontFamily: "monospace" }}>query.sql</span>
              <button
                onClick={runQuery}
                style={{ background: "#34d399", color: "#0f172a", border: "none", padding: "8px 20px", borderRadius: "6px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
              >
                ▶ Run Query
              </button>
            </div>
            <textarea
              ref={textareaRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              spellCheck={false}
              style={{ flex: 1, background: "#0f172a", color: "#7dd3fc", border: "none", padding: "1.25rem", fontFamily: "monospace", fontSize: "0.88rem", lineHeight: 1.8, resize: "none", outline: "none", minHeight: "200px" }}
            />
          </div>

          {/* Results */}
          <div style={{ height: "280px", overflowY: "auto", background: "#080e1a" }}>
            <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #1e293b", fontSize: "0.78rem", color: "#64748b" }}>Results</div>

            {!results && !error && (
              <div style={{ padding: "2rem", textAlign: "center", color: "#334155", fontSize: "0.85rem" }}>Run your query to see results</div>
            )}

            {error && (
              <div style={{ padding: "1rem", color: "#f87171", fontSize: "0.85rem", fontFamily: "monospace" }}>{error}</div>
            )}

            {status === "correct" && (
              <div style={{ margin: "1rem", background: "#022c22", border: "1px solid #064e3b", borderRadius: "8px", padding: "0.75rem 1rem", color: "#34d399", fontSize: "0.85rem" }}>
                Correct. Well done.
              </div>
            )}

            {status === "incorrect" && (
              <div style={{ margin: "1rem", background: "#1a0a0a", border: "1px solid #4e1a1a", borderRadius: "8px", padding: "0.75rem 1rem", color: "#f87171", fontSize: "0.85rem" }}>
                Not quite right. Check your logic and try again.
              </div>
            )}

            {results && (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                  <thead>
                    <tr>
                      {results.columns.map(col => (
                        <th key={col} style={{ padding: "8px 16px", textAlign: "left", color: "#64748b", borderBottom: "1px solid #1e293b", fontWeight: 500, whiteSpace: "nowrap" }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.values.map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #1e293b" }}>
                        {row.map((cell, j) => (
                          <td key={j} style={{ padding: "8px 16px", color: "#94a3b8", whiteSpace: "nowrap" }}>{cell}</td>
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
  );
}