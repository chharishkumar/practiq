import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useMobile } from "../hooks/useMobile";
import { usePyodide } from "./usePyodide";
import Editor from "@monaco-editor/react";
import { usePageMeta } from "../hooks/usePageMeta";
import { PYTHON_PROBLEMS } from "./data/pythonProblems";

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "Python Basics",        path: "/python/basics",        icon: "🐍", color: "#16a34a" },
  { label: "Python Intermediate",  path: "/python/intermediate",  icon: "⚙️", color: "#2563eb" },
  { label: "Python Advanced",      path: "/python/advanced",      icon: "🚀", color: "#7c3aed" },
  { label: "Python Interview ⭐",  path: "/python/interview",     icon: "🎯", color: "#d97706" },
  { label: "Python Scenarios",     path: "/python/scenarios",     icon: "🏢", color: "#dc2626" },
];

// ─── QUICK TIPS ───────────────────────────────────────────────────────────────

const QUICK_TIPS = [
  { title: "Python is case sensitive",        tip: "print() works but Print() throws a NameError. Always use lowercase for built-in functions." },
  { title: "Indentation is not optional",     tip: "Python uses indentation to define code blocks. 4 spaces is the standard. Mixing tabs and spaces will break your code." },
  { title: "Lists are mutable, tuples aren't", tip: "list = [1,2,3] can be changed. tuple = (1,2,3) cannot. Use tuples when data shouldn't change." },
  { title: "Use enumerate instead of range",  tip: "for i, val in enumerate(items) is cleaner than for i in range(len(items)). It gives both index and value." },
];

// ─── FEATURED PROBLEMS ────────────────────────────────────────────────────────

const DIFF_COLORS = {
  Easy:   { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
  Medium: { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
  Hard:   { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
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
  { user: "Rahul S.",  problem: "FizzBuzz",            category: "Basics",       time: "2m ago" },
  { user: "Priya M.",  problem: "Reverse a String",    category: "Basics",       time: "8m ago" },
  { user: "Arjun K.",  problem: "Factorial",           category: "Basics",       time: "15m ago" },
  { user: "Sneha R.",  problem: "Word Count",          category: "Basics",       time: "22m ago" },
  { user: "Vikram D.", problem: "Filter Even Numbers", category: "Basics",       time: "34m ago" },
  { user: "Meera T.",  problem: "Sum of Two Numbers",  category: "Basics",       time: "41m ago" },
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
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

const CATEGORY_LABEL = {
  python_basics:       "Basics",
  python_intermediate: "Intermediate",
  python_advanced:     "Advanced",
  python_interview:    "Interview",
  python_scenarios:    "Scenarios",
};

// ─── NAV ──────────────────────────────────────────────────────────────────────

function Nav({ navigate, isMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{ padding: isMobile ? "0.75rem 1rem" : "1rem 2.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.97)", zIndex: 100 }}>
      <span onClick={() => navigate("/")} style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a", letterSpacing: "-0.3px", cursor: "pointer" }}>Repractiq</span>
      {isMobile ? (
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#0f172a" }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      ) : (
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <span onClick={() => navigate("/home")}        style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600, cursor: "pointer" }}>Home</span>
          <span onClick={() => navigate("/sql")}         style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600, cursor: "pointer" }}>SQL Practice</span>
          <span onClick={() => navigate("/python")}      style={{ fontSize: "0.85rem", color: "#16a34a", fontWeight: 600, cursor: "pointer", borderBottom: "2px solid #16a34a", paddingBottom: "2px" }}>Python Practice</span>
          <span onClick={() => navigate("/leaderboard")} style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600, cursor: "pointer" }}>Leaderboard</span>
          <Link to="/profile" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>Profile</Link>
        </div>
      )}
      {isMobile && menuOpen && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "0.5rem 0", zIndex: 200 }}>
          {[["Home", "/home"], ["SQL Practice", "/sql"], ["Python Practice", "/python"], ["Leaderboard", "/leaderboard"], ["Profile", "/profile"]].map(([label, path]) => (
            <div key={label} onClick={() => { navigate(path); setMenuOpen(false); }} style={{ padding: "0.75rem 1.25rem", fontSize: "0.9rem", color: "#0f172a", fontWeight: 500, cursor: "pointer", borderBottom: "1px solid #f1f5f9" }}>
              {label}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function PythonPage() {
  const navigate  = useNavigate();
  const isMobile  = useMobile();

  const { pyodideReady, runCode } = usePyodide();

  const [replCode, setReplCode]     = useState(`# 🐍 Python REPL — try anything here\nprint("Hello, Python!")\n\n# Try: sum, lists, loops, functions\nnumbers = [1, 2, 3, 4, 5]\nprint(f"Sum: {sum(numbers)}")\nprint(f"Max: {max(numbers)}")`);
  const [replOutput, setReplOutput] = useState("");
  const [replError, setReplError]   = useState("");
  const [replRunning, setReplRunning] = useState(false);

  const [leaderboard, setLeaderboard] = useState(FALLBACK_LEADERBOARD);
  const [community, setCommunity]     = useState(FALLBACK_COMMUNITY);
  const [solvedByCategory, setSolvedByCategory] = useState({});
  const [isGuest, setIsGuest]         = useState(true);

  usePageMeta({
    title: "Python Practice — Basics, Intermediate, Advanced & Interview | Repractiq",
    description: "Practice Python with real coding problems. Covers functions, loops, strings, lists, dictionaries, recursion and more. Free to start, runs in your browser.",
  });

  // Auth + progress
  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      if (!session) { setIsGuest(true); return; }
      setIsGuest(false);

      const { data } = await supabase
        .from("submissions")
        .select("problem_id, category")
        .eq("user_id", session.user.id)
        .eq("status", "correct");

      const map = {};
      (data || []).forEach(({ problem_id, category }) => {
        if (!map[category]) map[category] = new Set();
        map[category].add(problem_id);
      });
      setSolvedByCategory(map);
    };
    init();
  }, []);

  // Community feed
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const { data: topUsers } = await supabase
          .from("submissions")
          .select("user_id, problem_title, category, created_at")
          .eq("status", "correct")
          .eq("is_best_attempt", true)
          .in("category", ["python_basics", "python_intermediate", "python_advanced", "python_interview", "python_scenarios"]);

        if (!topUsers || topUsers.length === 0) return;

        const { data: profilesById } = await supabase
          .from("profiles")
          .select("id, full_name");

        const nameMap = {};
        (profilesById || []).forEach(p => { nameMap[p.id] = p.full_name || "Anonymous"; });

        // Leaderboard
        const countMap = {};
        topUsers.forEach(row => { countMap[row.user_id] = (countMap[row.user_id] || 0) + 1; });
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

        // Community feed — unique users
        const uniqueUsers = [];
        const seen = new Set();
        [...topUsers]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .forEach(row => {
            if (!seen.has(row.user_id)) {
              seen.add(row.user_id);
              uniqueUsers.push(row);
            }
          });

        const recent = uniqueUsers.slice(0, 6).map(row => ({
          user:     nameMap[row.user_id] || "Anonymous",
          problem:  row.problem_title || "Unknown problem",
          category: CATEGORY_LABEL[row.category] || row.category,
          time:     timeAgo(row.created_at),
        }));
        if (recent.length > 0) setCommunity(recent);

      } catch (err) {
        console.error("Failed to fetch community:", err);
      }
    };
    fetchCommunity();
  }, []);

  // REPL run
  const handleReplRun = useCallback(async () => {
    if (!pyodideReady || replRunning) return;
    setReplRunning(true);
    setReplOutput("");
    setReplError("");

    const result = await runCode(replCode, { type: "output", expectedOutput: "" });
    setReplOutput(result.output || "");
    setReplError(result.error || "");
    setReplRunning(false);
  }, [pyodideReady, replRunning, runCode, replCode]);

  // Ctrl+Enter
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleReplRun();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleReplRun]);

  const topics = [
    { key: "python_basics",       label: "Basics",       icon: "🐍", total: PYTHON_PROBLEMS.length, solved: solvedByCategory["python_basics"]?.size       || 0, path: "/python/basics" },
    { key: "python_intermediate", label: "Intermediate", icon: "⚙️", total: 100,                     solved: solvedByCategory["python_intermediate"]?.size || 0, path: "/python/intermediate" },
    { key: "python_advanced",     label: "Advanced",     icon: "🚀", total: 100,                     solved: solvedByCategory["python_advanced"]?.size     || 0, path: "/python/advanced" },
    { key: "python_interview",    label: "Interview",    icon: "🎯", total: 100,                     solved: solvedByCategory["python_interview"]?.size    || 0, path: "/python/interview" },
    { key: "python_scenarios",    label: "Scenarios",    icon: "🏢", total: 100,                     solved: solvedByCategory["python_scenarios"]?.size    || 0, path: "/python/scenarios" },
  ];

  const allCats = ["All", "Basics", "Intermediate", "Advanced", "Interview", "Scenarios"];
  const [activeCat, setActiveCat] = useState("All");

  const featuredProblems = PYTHON_PROBLEMS.map(p => ({
    ...p,
    category: "Basics",
    path: `/python/basics/${p.id}-${p.slug}`,
  }));

  const filteredFeatured = activeCat === "All"
    ? featuredProblems
    : featuredProblems.filter(p => p.category === activeCat);

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      <Nav navigate={navigate} isMobile={isMobile} />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)", borderBottom: "1px solid #e2e8f0", padding: isMobile ? "2rem 1rem 1.5rem" : "3rem 2.5rem 2.5rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#16a34a", background: "#ffffff", padding: "5px 14px", borderRadius: "20px", border: "1px solid #bbf7d0", marginBottom: "1.25rem", fontWeight: 600 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
          Free Python Practice — Runs in your browser
        </div>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 0.75rem", color: "#0f172a" }}>
          Practice Python on <span style={{ color: "#16a34a" }}>Real Problems</span>
        </h1>
        <p style={{ fontSize: "1rem", color: "#64748b", lineHeight: 1.75, maxWidth: "520px", margin: "0 auto 2rem" }}>
          Write Python, run it instantly in your browser. No setup. No installs. Just code.
        </p>

        {/* Topic cards */}
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)", gap: "10px", marginBottom: "1.5rem" }}>
            {topics.map(t => {
              const pct = t.total > 0 ? Math.round((t.solved / t.total) * 100) : 0;
              return (
                <div
                  key={t.key}
                  onClick={() => navigate(t.path)}
                  style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "1rem", cursor: "pointer", textAlign: "left" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#bbf7d0"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                >
                  <div style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{t.icon}</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>{t.label}</div>
                  {isGuest ? (
                    <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{t.total} problems</div>
                  ) : (
                    <>
                      <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginBottom: "5px" }}>{t.solved} / {t.total} solved</div>
                      <div style={{ height: "4px", background: "#e2e8f0", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: "#16a34a", borderRadius: "2px" }} />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── LEADERBOARD STRIP ─────────────────────────────────────────── */}
      <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: isMobile ? "0.75rem 1rem" : "0.85rem 2.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1.5rem", overflowX: "auto" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>🏆 Top Python Solvers</span>
          {leaderboard.map(u => (
            <div key={u.rank} style={{ display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: "0.82rem" }}>{u.badge || `#${u.rank}`}</span>
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f172a" }}>{u.name}</span>
              <span style={{ fontSize: "0.75rem", color: "#16a34a", background: "#f0fdf4", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>{u.solved} solved</span>
            </div>
          ))}
          <span onClick={() => navigate("/leaderboard")} style={{ fontSize: "0.75rem", color: "#16a34a", cursor: "pointer", marginLeft: "auto", whiteSpace: "nowrap", fontWeight: 600 }}>
            View full leaderboard →
          </span>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: isMobile ? "1rem 1rem 0" : "2.5rem 2.5rem 0" }}>

        {/* ── CATEGORY BUTTONS ──────────────────────────────────────────── */}
        <div style={{ marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Choose a Category</span>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.path}
              onClick={() => navigate(cat.path)}
              style={{ padding: "10px 20px", borderRadius: "8px", background: "#ffffff", color: "#16a34a", fontWeight: 600, fontSize: "0.88rem", border: "1.5px solid #bbf7d0", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#ffffff"; e.currentTarget.style.color = "#16a34a"; }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* ── COMMUNITY ACTIVITY ────────────────────────────────────────── */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Community Activity</span>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.3px", margin: "0.25rem 0 0", color: "#0f172a" }}>See what people are solving right now</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "10px", marginBottom: "2.5rem" }}>
          {community.map((item, i) => (
            <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "0.875rem 1rem", display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "#16a34a", flexShrink: 0 }}>
                {getInitials(item.user)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.82rem", color: "#0f172a", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.user} <span style={{ fontWeight: 400, color: "#64748b" }}>solved</span>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#0f172a", margin: "2px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.problem}</div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "4px" }}>
                  <span style={{ fontSize: "0.68rem", color: "#16a34a", background: "#f0fdf4", padding: "2px 8px", borderRadius: "10px", fontWeight: 600, border: "1px solid #bbf7d0" }}>{item.category}</span>
                  <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>{item.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── PYTHON REPL SANDBOX ───────────────────────────────────────── */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Free Sandbox</span>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0.25rem 0 0", color: "#0f172a" }}>Write and run Python instantly</h2>
        </div>

        <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: "2.5rem" }}>
          {/* Top bar */}
          <div style={{ padding: "0.85rem 1.25rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ fontSize: "0.75rem", color: "#16a34a", background: "#dcfce7", padding: "4px 10px", borderRadius: "20px", fontWeight: 700 }}>🐍 Python</span>
              <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Ctrl+Enter to run</span>
              <div style={{ fontSize: "0.68rem", color: pyodideReady ? "#16a34a" : "#d97706", background: pyodideReady ? "#f0fdf4" : "#fffbeb", border: `1px solid ${pyodideReady ? "#bbf7d0" : "#fde68a"}`, borderRadius: "10px", padding: "2px 8px", fontWeight: 600 }}>
                {pyodideReady ? "Ready" : "Loading Python..."}
              </div>
            </div>
            <button
              onClick={handleReplRun}
              disabled={!pyodideReady || replRunning}
              style={{ padding: "8px 20px", borderRadius: "6px", background: pyodideReady && !replRunning ? "#16a34a" : "#94a3b8", color: "#fff", fontWeight: 700, fontSize: "0.82rem", border: "none", cursor: pyodideReady && !replRunning ? "pointer" : "not-allowed" }}
            >
              {replRunning ? "⏳ Running..." : "▶ Run"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", minHeight: "400px" }}>
            {/* Editor */}
            <div style={{ borderRight: isMobile ? "none" : "1px solid #e2e8f0", borderBottom: isMobile ? "1px solid #e2e8f0" : "none" }}>
              <Editor
                height={isMobile ? "250px" : "400px"}
                language="python"
                theme="vs-dark"
                value={replCode}
                onChange={v => setReplCode(v || "")}
                options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: "on", scrollBeyondLastLine: false, padding: { top: 12 }, lineNumbers: "on", automaticLayout: true, scrollbar: { vertical: "hidden", horizontal: "hidden" } }}
              />
            </div>

            {/* Output */}
            <div style={{ background: "#0f172a", padding: "1rem", overflowY: "auto", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "0.68rem", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Output</div>
              {!replOutput && !replError && (
                <div style={{ fontSize: "0.82rem", color: "#475569", fontFamily: "monospace" }}>
                  # Click Run to execute your code
                </div>
              )}
              {replError && (
                <div style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#f87171", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {(() => {
                    const lines = replError.split("\n").filter(l => l.trim());
                    return lines[lines.length - 1] || replError;
                  })()}
                </div>
              )}
              {replOutput && (
                <div style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#4ade80", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                  {replOutput}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── QUICK TIPS ────────────────────────────────────────────────── */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Quick Tips</span>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.3px", margin: "0.25rem 0 0", color: "#0f172a" }}>Common Python mistakes to avoid</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
          {QUICK_TIPS.map((tip, i) => (
            <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#16a34a" }}>{i + 1}</span>
              </div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>{tip.title}</div>
              <div style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.65 }}>{tip.tip}</div>
            </div>
          ))}
        </div>

        {/* ── FEATURED PROBLEMS ─────────────────────────────────────────── */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Featured Problems</span>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.3px", margin: "0.25rem 0 0.75rem", color: "#0f172a" }}>Start with these popular challenges</h2>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {allCats.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                style={{ padding: "5px 14px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: activeCat === cat ? 700 : 500, border: "1.5px solid", borderColor: activeCat === cat ? "#16a34a" : "#e2e8f0", background: activeCat === cat ? "#16a34a" : "#ffffff", color: activeCat === cat ? "#ffffff" : "#64748b", cursor: "pointer" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
          {filteredFeatured.map((p, i) => {
            const dc = DIFF_COLORS[p.difficulty] || DIFF_COLORS.Easy;
            return (
              <div
                key={`${p.category}-${p.id}-${i}`}
                onClick={() => navigate(p.path)}
                style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem", cursor: "pointer", display: "flex", flexDirection: "column", gap: "6px" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#bbf7d0"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "10px", fontWeight: 600, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>{p.category}</span>
                  <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "10px", fontWeight: 600, background: dc.bg, color: dc.text, border: `1px solid ${dc.border}` }}>{p.difficulty}</span>
                </div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a", lineHeight: 1.35 }}>{p.title}</div>
                <div style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.6, flex: 1 }}>{p.description}</div>
                <div style={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: 600, marginTop: "4px" }}>Solve this →</div>
              </div>
            );
          })}
        </div>

        {/* ── COMING SOON ───────────────────────────────────────────────── */}
        <div style={{ marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Coming Soon</span>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.3px", margin: "0.25rem 0 0", color: "#0f172a" }}>More Python tracks in development</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
          {[
            { icon: "🐼", title: "Pandas Practice",       desc: "Data manipulation with real business datasets. Filter, group, merge and aggregate." },
            { icon: "📊", title: "Data Analysis",         desc: "Solve real analytics problems using Python and our 7 real-world business tables." },
            { icon: "🔢", title: "NumPy & Statistics",    desc: "Arrays, mathematical operations, and statistical analysis for data professionals." },
          ].map((item, i) => (
            <div key={i} style={{ background: "#f8fafc", border: "1.5px dashed #e2e8f0", borderRadius: "12px", padding: "1.25rem", opacity: 0.8 }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.icon}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a" }}>{item.title}</div>
                <span style={{ fontSize: "0.65rem", background: "#f1f5f9", color: "#94a3b8", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>Soon</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.65 }}>{item.desc}</div>
            </div>
          ))}
        </div>

      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: isMobile ? "2rem 1rem 1.5rem" : "3rem 2.5rem 2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a", marginBottom: "0.5rem" }}>Repractiq</div>
              <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.7, maxWidth: "280px" }}>A free SQL and Python practice platform built for data professionals who want to actually do the work.</div>
              <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: 600, textDecoration: "none" }}>LinkedIn</a>
                <a href="https://youtube.com"  target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: 600, textDecoration: "none" }}>YouTube</a>
                <a href="/contact" style={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: 600, textDecoration: "none" }}>Contact Us</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Python Practice</div>
              {CATEGORIES.map(cat => (
                <div key={cat.path} onClick={() => navigate(cat.path)} style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "0.4rem", cursor: "pointer" }}>{cat.label}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Legal</div>
              <Link to="/privacy" style={{ display: "block", fontSize: "0.82rem", color: "#64748b", marginBottom: "0.4rem", textDecoration: "none" }}>Privacy Policy</Link>
              <Link to="/terms"   style={{ display: "block", fontSize: "0.82rem", color: "#64748b", marginBottom: "0.4rem", textDecoration: "none" }}>Terms of Use</Link>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem", fontSize: "0.75rem", color: "#94a3b8", textAlign: "center" }}>
            © 2026 Repractiq · Built for data professionals who want to actually do the work.
          </div>
        </div>
      </div>

    </div>
  );
}