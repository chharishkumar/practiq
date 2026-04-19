import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SQL_PROBLEMS } from "./sqlProblems";
import { matchesProblem, searchSqlProblems } from "./sqlSearch";
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

// Validation: check if user results match expected output
function validateResults(results, problem) {
  if (!results) return null;
  const { expectedColumns, expectedRowCount } = problem;

  const colMatch =
    expectedColumns &&
    expectedColumns.every((col) => results.columns.includes(col));
  const rowMatch =
    expectedRowCount !== undefined &&
    results.values.length === expectedRowCount;

  if (colMatch && rowMatch) return "correct";
  if (colMatch && !rowMatch) return "almost";
  return "wrong";
}

// Community feed stored in module scope so it persists across renders
let communityFeed = [];

export default function SQLBasicsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editorRef = useRef(null);

  const [expandedId, setExpandedId] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(SQL_PROBLEMS[0]);
  const [query, setQuery] = useState(SQL_PROBLEMS[0].starterQuery);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [db, setDb] = useState(null);
  const [dbReady, setDbReady] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [solvedIds, setSolvedIds] = useState(new Set());
  const [runCount, setRunCount] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Community post modal
  const [showModal, setShowModal] = useState(false);
  const [modalComment, setModalComment] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);

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
    setValidationStatus(null);
    try {
      const res = db.exec(query);
      if (res.length === 0) {
        setError("Query executed (no rows returned). Check your query logic.");
        return;
      }
      const resultData = res[0];
      setResults(resultData);
      setRunCount((c) => c + 1);

      const status = validateResults(resultData, selectedProblem);
      setValidationStatus(status);
      if (status === "correct") {
        setSolvedIds((prev) => new Set([...prev, selectedProblem.id]));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectProblem = (p) => {
    setSelectedProblem(p);
    setQuery(p.starterQuery);
    setResults(null);
    setError(null);
    setValidationStatus(null);
    setRunCount(0);
  };

  const handleToggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const incoming = location.state || {};
    if (incoming.searchQuery) {
      setSearchInput(incoming.searchQuery);
      setSearchTerm(incoming.searchQuery);
    }
    if (incoming.focusProblemId !== undefined) {
      const targetProblem = SQL_PROBLEMS.find((p) => p.id === incoming.focusProblemId);
      if (targetProblem) {
        handleSelectProblem(targetProblem);
        setExpandedId(targetProblem.id);
      }
    }
  }, [location.state]);

  const handlePostCommunity = () => {
    setShowModal(true);
    setModalComment("");
    setPostSuccess(false);
  };

  const submitPost = () => {
    const post = {
      user: "You",
      problem: selectedProblem.title,
      category: "Basics",
      query: query,
      comment: modalComment,
      time: "Just now",
    };
    communityFeed.unshift(post);
    try {
      const existing = JSON.parse(sessionStorage.getItem("communityPosts") || "[]");
      sessionStorage.setItem("communityPosts", JSON.stringify([post, ...existing]));
    } catch (_) {}
    setPostSuccess(true);
    setTimeout(() => setShowModal(false), 1800);
  };

  const diffStyle = {
    Easy: { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  };

  const filteredProblems = useMemo(() => {
    if (!searchTerm.trim()) return SQL_PROBLEMS;
    return SQL_PROBLEMS.filter((p) => matchesProblem(p, searchTerm));
  }, [searchTerm]);

  const crossCategoryMatches = useMemo(
    () => searchSqlProblems(searchTerm).filter((m) => m.categoryKey !== "basics").slice(0, 10),
    [searchTerm]
  );

  const validationBanner = () => {
    if (!validationStatus) return null;
    const configs = {
      correct: {
        bg: "#f0fdf4",
        border: "#86efac",
        icon: "✓",
        iconColor: "#16a34a",
        title: "Correct!",
        msg: "Your output matches the expected result perfectly.",
        titleColor: "#15803d",
      },
      almost: {
        bg: "#fffbeb",
        border: "#fcd34d",
        icon: "~",
        iconColor: "#d97706",
        title: "Almost there",
        msg: `Your columns look right but the row count doesn't match. Expected ${selectedProblem.expectedRowCount} rows.`,
        titleColor: "#b45309",
      },
      wrong: {
        bg: "#fef2f2",
        border: "#fca5a5",
        icon: "✗",
        iconColor: "#dc2626",
        title: "Not quite",
        msg: "Your result doesn't match the expected output. Re-read the description and try again.",
        titleColor: "#b91c1c",
      },
    };
    const c = configs[validationStatus];
    return (
      <div
        style={{
          background: c.bg,
          border: `1px solid ${c.border}`,
          borderRadius: "10px",
          padding: "0.875rem 1rem",
          marginBottom: "1rem",
          display: "flex",
          gap: "10px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: c.iconColor,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {c.icon}
        </div>
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: c.titleColor }}>
            {c.title}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: "2px" }}>
            {c.msg}
          </div>
          {validationStatus === "correct" && (
            <button
              onClick={handlePostCommunity}
              style={{
                marginTop: "0.5rem",
                fontSize: "0.78rem",
                color: "#2563eb",
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "6px",
                padding: "4px 12px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              🎉 Share to Community
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        background: "#ffffff",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, -apple-system, sans-serif",
        color: "#0f172a",
        overflow: "hidden",
      }}
    >
      {/* NAV */}
      <nav
        style={{
          padding: "0.85rem 2rem",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255,255,255,0.97)",
          flexShrink: 0,
        }}
      >
        <span
          onClick={() => navigate("/")}
          style={{ fontWeight: 800, cursor: "pointer", fontSize: "1.1rem", letterSpacing: "-0.3px" }}
        >
          Data Rejected
        </span>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span
            onClick={() => navigate("/home")}
            style={{ cursor: "pointer", color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}
          >
            Home
          </span>
          <span
            onClick={() => navigate("/profile")}
            style={{ cursor: "pointer", color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}
          >
            Profile
          </span>
          <div
            style={{
              fontSize: "0.78rem",
              color: "#16a34a",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "20px",
              padding: "4px 12px",
              fontWeight: 600,
            }}
          >
            ✓ {solvedIds.size} / {SQL_PROBLEMS.length} solved
          </div>
          <span
            onClick={() => navigate("/sql")}
            style={{ cursor: "pointer", color: "#2563eb", fontSize: "0.85rem", fontWeight: 600 }}
          >
            ← Back to Practice
          </span>
        </div>
      </nav>

      {/* PAGE TITLE STRIP */}
      <div
        style={{
          background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)",
          borderBottom: "1px solid #e2e8f0",
          padding: "0.875rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexShrink: 0,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: 800,
              letterSpacing: "-0.3px",
              color: "#0f172a",
            }}
          >
            SQL Basics
          </h1>
          </div>
        </div>
      {/* MAIN SPLIT */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* LEFT PANEL */}
        <div
          style={{
            width: "340px",
            minWidth: "300px",
            borderRight: "1px solid #e2e8f0",
            overflowY: "auto",
            background: "#f8fafc",
            flexShrink: 0,
          }}
        >
          <div style={{ padding: "1rem 1rem 0.5rem" }}>
            <span
              style={{
                fontSize: "0.68rem",
                color: "#64748b",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Questions
            </span>
            <div style={{ marginTop: "0.65rem", display: "flex", gap: "8px" }}>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSearchTerm(searchInput.trim());
                }}
                placeholder="Search SQL topics (joins, window...)"
                style={{ flex: 1, fontSize: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "7px 9px", outline: "none" }}
              />
              <button
                onClick={() => setSearchTerm(searchInput.trim())}
                style={{ fontSize: "0.75rem", border: "1px solid #bfdbfe", color: "#2563eb", background: "#eff6ff", borderRadius: "8px", padding: "7px 10px", cursor: "pointer", fontWeight: 600 }}
              >
                Search
              </button>
            </div>
          </div>

          {!!searchTerm && (
            <div style={{ margin: "0 0.75rem 0.5rem", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", padding: "0.625rem 0.75rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#1d4ed8", fontWeight: 700, marginBottom: "4px" }}>
                Results: {filteredProblems.length} in Basics
              </div>
              {crossCategoryMatches.length > 0 && (
                <div style={{ fontSize: "0.72rem", color: "#475569" }}>
                  Also found in other categories:
                  {crossCategoryMatches.map((m, i) => (
                    <button
                      key={`${m.categoryKey}-${m.problem.id}-${i}`}
                      onClick={() =>
                        navigate(m.route, {
                          state: { searchQuery: searchTerm, focusProblemId: m.problem.id },
                        })
                      }
                      style={{ marginLeft: "6px", marginTop: "6px", border: "1px solid #cbd5e1", background: "#fff", color: "#334155", borderRadius: "999px", padding: "3px 8px", fontSize: "0.68rem", cursor: "pointer" }}
                    >
                      {m.problem.title} ({m.categoryLabel})
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {filteredProblems.map((p) => {
            const isSelected = selectedProblem.id === p.id;
            const isExpanded = expandedId === p.id;
            const isSolved = solvedIds.has(p.id);

            return (
              <div
                key={p.id}
                style={{
                  margin: "0 0.75rem 0.5rem",
                  background: "#ffffff",
                  border: "1.5px solid",
                  borderColor: isSelected ? "#2563eb" : "#e2e8f0",
                  borderRadius: "10px",
                  overflow: "hidden",
                  transition: "border-color 0.15s",
                  boxShadow: isSelected ? "0 0 0 3px rgba(37,99,235,0.08)" : "none",
                }}
              >
                <div
                  onClick={() => {
                    handleSelectProblem(p);
                    handleToggleExpand(p.id);
                    if (editorRef.current) editorRef.current.focus();
                  }}
                  style={{
                    padding: "0.75rem 0.875rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: isSolved ? "#16a34a" : isSelected ? "#eff6ff" : "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      color: isSolved ? "#fff" : isSelected ? "#2563eb" : "#94a3b8",
                      flexShrink: 0,
                    }}
                  >
                    {isSolved ? "✓" : p.id}
                  </div>

                  <span
                    style={{
                      fontSize: "0.83rem",
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? "#0f172a" : "#334155",
                      flex: 1,
                      lineHeight: 1.35,
                    }}
                  >
                    {p.title}
                  </span>

                  <span
                    style={{
                      fontSize: "0.62rem",
                      padding: "2px 7px",
                      borderRadius: "10px",
                      background: diffStyle.Easy.bg,
                      color: diffStyle.Easy.color,
                      border: `1px solid ${diffStyle.Easy.border}`,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Easy
                  </span>

                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: isExpanded ? "#2563eb" : "#94a3b8",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      lineHeight: 1,
                    }}
                  >
                    ▾
                  </span>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      borderTop: "1px solid #f1f5f9",
                      padding: "0.875rem",
                      background: "#fafbfc",
                    }}
                  >
                    <div style={{ marginBottom: "0.875rem" }}>
                      <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Task</div>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#0f172a", lineHeight: 1.6, fontWeight: 500 }}>{p.description}</p>
                    </div>

                    <div style={{ marginBottom: "0.875rem" }}>
                      <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Explanation</div>
                      <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569", lineHeight: 1.65 }}>{p.explanation}</p>
                    </div>

                    <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "0.625rem 0.75rem", marginBottom: "0.875rem" }}>
                      <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>Real-world scenario</div>
                      <p style={{ margin: 0, fontSize: "0.78rem", color: "#1e40af", lineHeight: 1.6 }}>{p.scenario}</p>
                    </div>

                    <div style={{ marginBottom: "0.875rem" }}>
                      <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "5px" }}>Common use cases</div>
                      {p.useCases.map((uc, i) => (
                        <div key={i} style={{ display: "flex", gap: "6px", alignItems: "flex-start", marginBottom: "3px" }}>
                          <span style={{ color: "#2563eb", fontSize: "0.7rem", marginTop: "2px" }}>→</span>
                          <span style={{ fontSize: "0.77rem", color: "#475569", lineHeight: 1.5 }}>{uc}</span>
                        </div>
                      ))}
                    </div>

                    <details>
                      <summary style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, cursor: "pointer", listStyle: "none" }}>
                        💡 Show hint
                      </summary>
                      <div style={{ marginTop: "6px", padding: "0.5rem 0.625rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "6px", fontSize: "0.78rem", color: "#92400e", lineHeight: 1.6, fontFamily: "monospace" }}>
                        {p.hint}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ height: "1.5rem" }} />
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#ffffff" }}>

          {/* Problem Header */}
          <div style={{ padding: "1.25rem 1.75rem 1rem", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: "10px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", fontWeight: 600 }}>Easy</span>
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>#{selectedProblem.id}</span>
                  {solvedIds.has(selectedProblem.id) && (
                    <span style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: "10px", background: "#f0fdf4", color: "#16a34a", fontWeight: 600 }}>✓ Solved</span>
                  )}
                </div>
                <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.3px", color: "#0f172a" }}>
                  {selectedProblem.title}
                </h2>
              </div>
              <button
                onClick={handlePostCommunity}
                style={{ padding: "8px 16px", borderRadius: "8px", background: "#ffffff", color: "#2563eb", fontWeight: 600, fontSize: "0.8rem", border: "1.5px solid #bfdbfe", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}
              >
                🌐 Post to Community
              </button>
            </div>

            <div style={{ marginTop: "0.875rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderLeft: "3px solid #2563eb", borderRadius: "0 8px 8px 0", padding: "0.625rem 0.875rem" }}>
              <span style={{ fontSize: "0.67rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "3px" }}>Task</span>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "#0f172a", lineHeight: 1.6 }}>{selectedProblem.description}</p>
            </div>
          </div>

          {/* Scrollable editor + results */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.75rem" }}>

            {validationBanner()}

            {/* Editor */}
            <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", marginBottom: "1rem" }}>
              <div style={{ background: "#f8fafc", padding: "0.625rem 1rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "0.7rem", background: "#e2e8f0", color: "#0f172a", padding: "3px 9px", borderRadius: "20px", fontWeight: 700 }}>SQL</span>
                  <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Ctrl+Enter to run</span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => { setQuery(selectedProblem.starterQuery); setResults(null); setError(null); setValidationStatus(null); }}
                    style={{ fontSize: "0.75rem", color: "#64748b", background: "transparent", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }}
                  >
                    Reset
                  </button>
                  <button
                    onClick={runQuery}
                    disabled={!dbReady}
                    style={{ padding: "6px 18px", borderRadius: "6px", background: dbReady ? "#2563eb" : "#94a3b8", color: "#fff", fontWeight: 700, fontSize: "0.8rem", border: "none", cursor: dbReady ? "pointer" : "not-allowed" }}
                  >
                    {dbReady ? "▶ Run" : "Loading…"}
                  </button>
                </div>
              </div>

              <Editor
  height="300px"
  language="sql"
  value={query}
  onChange={(value) => setQuery(value || "")}
  theme="vs-dark"
  options={{
    fontSize: 14,
    minimap: { enabled: false },
    wordWrap: "on",
    scrollBeyondLastLine: false,
    padding: { top: 10, bottom: 10 },
    lineNumbers: "on",
  }}
  onMount={(editor) => {
    editor.addCommand(
      window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.Enter,
      () => runQuery()
    );
  }}
/>  
            </div>

            {/* Results */}
            <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ background: "#f8fafc", padding: "0.625rem 1rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Output</span>
                {results && <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{results.values.length} row{results.values.length !== 1 ? "s" : ""}</span>}
              </div>

              <div style={{ minHeight: "120px", padding: "0.875rem 1rem", background: "#ffffff" }}>
                {!results && !error && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100px", color: "#94a3b8", fontSize: "0.82rem" }}>
                    Run your query to see results here
                  </div>
                )}
                {error && (
                  <div style={{ color: "#ef4444", fontSize: "0.82rem", fontFamily: "monospace", lineHeight: 1.6, background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "0.75rem" }}>
                    {error}
                  </div>
                )}
                {results && (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ borderCollapse: "collapse", fontSize: "0.8rem", width: "100%" }}>
                      <thead>
                        <tr>
                          {results.columns.map((col) => (
                            <th key={col} style={{ textAlign: "left", padding: "6px 12px", color: "#64748b", fontWeight: 600, borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.values.map((row, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                            {row.map((cell, j) => (
                              <td key={j} style={{ padding: "7px 12px", color: "#0f172a", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {runCount > 2 && validationStatus !== "correct" && (
              <div style={{ marginTop: "1rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.8rem", color: "#92400e" }}>
                <strong>Stuck?</strong> Click the question on the left and expand the hint section.
              </div>
            )}

            <div style={{ height: "2rem" }} />
          </div>
        </div>
      </div>

      {/* COMMUNITY POST MODAL */}
      {showModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "1.75rem", width: "480px", maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            {postSuccess ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🎉</div>
                <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a" }}>Posted to Community!</div>
                <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>Your solution is now live on the community feed.</div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "1.25rem" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>Share to Community</h3>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748b" }}>Your query and comment will appear in the community feed on the main SQL practice page.</p>
                </div>

                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.625rem 0.875rem", marginBottom: "1rem", fontSize: "0.82rem", color: "#0f172a", fontWeight: 600 }}>
                  📝 {selectedProblem.title}
                </div>

                <div style={{ background: "#0f172a", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontFamily: "monospace", fontSize: "0.8rem", color: "#7dd3fc", whiteSpace: "pre-wrap", maxHeight: "100px", overflowY: "auto" }}>
                  {query}
                </div>

                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>
                    Add a comment (optional)
                  </label>
                  <textarea
                    value={modalComment}
                    onChange={(e) => setModalComment(e.target.value)}
                    placeholder="Share what you learned, a tip, or a question..."
                    rows={3}
                    style={{ width: "100%", padding: "0.625rem 0.75rem", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", outline: "none", resize: "none", color: "#0f172a", boxSizing: "border-box" }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button onClick={() => setShowModal(false)} style={{ padding: "8px 18px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "#ffffff", color: "#64748b", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button onClick={submitPost} style={{ padding: "8px 22px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#ffffff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
                    Post →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}