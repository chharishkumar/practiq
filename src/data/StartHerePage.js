import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { SQL_PROBLEMS } from "./sqlProblems";
import Editor from "@monaco-editor/react";
import { useMobile } from "../hooks/useMobile";
import { useSqlSandboxDb } from "../hooks/useSqlSandboxDb";
import MobileSQLLayout from "../components/MobileSQLLayout";

const START_HERE_IDS = Array.from({ length: 20 }, (_, i) => i + 1);
const START_HERE_PROBLEMS = SQL_PROBLEMS.filter(p => START_HERE_IDS.includes(p.id));

const MILESTONES = {
  3:  { emoji: "🎉", title: "Great start!", msg: "You're on your way! 3 down, 17 to go." },
  6:  { emoji: "🎉", title: "Halfway through the basics!", msg: "6 problems solved — keep the momentum." },
  9:  { emoji: "🎉", title: "You're getting good at this!", msg: "9 down, 11 to go." },
  12: { emoji: "🎉", title: "SQL is becoming second nature!", msg: "12 problems solved — you're crushing it." },
  15: { emoji: "🎉", title: "Almost there — keep pushing!", msg: "Just 5 more to complete Start Here." },
  18: { emoji: "🎉", title: "3 problems to go — finish strong!", msg: "You're so close to completing the track." },
  20: { emoji: "🏆", title: "Start Here complete!", msg: "You're ready for more — explore Topic Practice." },
};

function validateResults(userResult, referenceResult) {
  if (!userResult || !referenceResult) return null;
  if (userResult.values.length !== referenceResult.values.length) return "almost";
  if (userResult.columns.length !== referenceResult.columns.length) return "wrong";

  const normalizeColumn = (col) => String(col).trim().toLowerCase();
  const userCols = userResult.columns.map(normalizeColumn).sort();
  const refCols = referenceResult.columns.map(normalizeColumn).sort();
  if (JSON.stringify(userCols) !== JSON.stringify(refCols)) return "wrong";

  const normalizeValue = (v) => {
    if (v === null || v === undefined) return "null";
    if (!isNaN(v) && v !== "") return Number(v).toFixed(2);
    return String(v).trim().toLowerCase();
  };
  const normalizeRows = (result) =>
    result.values.map((row) => row.map(normalizeValue).sort().join("|")).sort().join("\n");

  return normalizeRows(userResult) === normalizeRows(referenceResult) ? "correct" : "almost";
}

function CelebrationModal({ milestone, onClose }) {
  const pieces = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1.5,
    color: ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed"][i % 5],
    rotate: Math.random() * 360,
  })), []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, overflow: "hidden" }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: "absolute", top: "-20px", left: `${p.left}%`,
          width: "8px", height: "14px", background: p.color,
          transform: `rotate(${p.rotate}deg)`,
          animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
        }} />
      ))}
      <div style={{ background: "#fff", borderRadius: "20px", padding: "2.5rem 2rem", textAlign: "center", maxWidth: "360px", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", position: "relative" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{milestone.emoji}</div>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem" }}>{milestone.title}</h2>
        <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.6, marginBottom: "1.25rem" }}>{milestone.msg}</p>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#eff6ff", color: "#2563eb", fontWeight: 700, fontSize: "0.85rem", padding: "6px 16px", borderRadius: "20px", marginBottom: "1.5rem" }}>
          ⚡ +{milestone.xp} XP earned
        </div>
        <button onClick={onClose} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: "pointer" }}>
          Keep going →
        </button>
      </div>
      <style>{`@keyframes confetti-fall { to { transform: translateY(100vh) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );
}

export default function StartHerePage() {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const { db, dbReady } = useSqlSandboxDb();
  const editorRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const selectedItemRef = useRef(null);
  const runCountRef = useRef(0);
  const celebratedRef = useRef(new Set());

  const [runCountDisplay, setRunCountDisplay] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(START_HERE_PROBLEMS[0]);
  const [query, setQuery] = useState(START_HERE_PROBLEMS[0].starterQuery);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [solvedIds, setSolvedIds] = useState(new Set());
  const [isGuest, setIsGuest] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [celebration, setCelebration] = useState(null);

  const queryRef = useRef(query);
  useEffect(() => { queryRef.current = query; }, [query]);
  const selectedProblemRef = useRef(selectedProblem);
  useEffect(() => { selectedProblemRef.current = selectedProblem; }, [selectedProblem]);
  const dbRef = useRef(db);
  useEffect(() => { dbRef.current = db; }, [db]);

  useEffect(() => {
    const fetchSolved = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) { setIsGuest(true); return; }
      const userId = sessionData.session.user.id;
      const { data, error } = await supabase
        .from("submissions")
        .select("problem_id")
        .eq("user_id", userId)
        .eq("category", "sql_basics")
        .eq("status", "correct");
      if (error || !data) return;
      const ids = new Set(data.map((row) => row.problem_id));
      setSolvedIds(ids);
      const count = START_HERE_IDS.filter((id) => ids.has(id)).length;
      Object.keys(MILESTONES).map(Number).forEach((m) => {
        if (m <= count) celebratedRef.current.add(m);
      });
    };
    fetchSolved();
  }, []);

  async function updateStreak(userId) {
    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase
      .from("user_streaks").select("*").eq("user_id", userId).maybeSingle();

    if (!existing) {
      await supabase.from("user_streaks").insert({
        user_id: userId, current_streak: 1, longest_streak: 1, last_solved_date: today,
      });
      return;
    }
    if (existing.last_solved_date === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const newStreak = existing.last_solved_date === yesterdayStr ? (existing.current_streak || 0) + 1 : 1;

    await supabase.from("user_streaks").update({
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, existing.longest_streak || 0),
      last_solved_date: today,
    }).eq("user_id", userId);
  }

  const runQuery = useCallback(async () => {
    const currentDb = dbRef.current;
    const currentQuery = queryRef.current;
    const currentProblem = selectedProblemRef.current;
    if (!currentDb) return;
    setError(null);
    setResults(null);

    try {
      const res = currentDb.exec(currentQuery);
      if (res.length === 0) {
        setError("Query executed but returned no rows. Check your logic.");
        return;
      }
      const resultData = res[0];
      setResults(resultData);

      runCountRef.current += 1;
      const newRunCount = runCountRef.current;
      setRunCountDisplay(newRunCount);

      let status = "attempted";
      if (currentProblem.solutionQuery) {
        try {
          const ref = currentDb.exec(currentProblem.solutionQuery);
          if (ref.length > 0) {
            status = validateResults(resultData, ref[0]);
            setValidationStatus(status);
            if (status === "correct") {
              setSolvedIds((prev) => {
                const next = new Set([...prev, currentProblem.id]);
                const count = START_HERE_IDS.filter((id) => next.has(id)).length;
                if (MILESTONES[count] && !celebratedRef.current.has(count)) {
                  celebratedRef.current.add(count);
                  setCelebration({ ...MILESTONES[count], xp: count * 10, isFinal: count === 20 });
                }
                return next;
              });
            }
          }
        } catch (_) {}
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        const userId = sessionData.session.user.id;
        const { data: existing } = await supabase
          .from("submissions").select("id, status")
          .eq("user_id", userId).eq("problem_id", currentProblem.id).eq("category", "sql_basics")
          .maybeSingle();

        if (existing?.status === "correct" && status !== "correct") {
          await updateStreak(userId);
          return;
        }
        if (existing) {
          await supabase.from("submissions").update({
            query: currentQuery, status, run_count: newRunCount,
            is_best_attempt: status === "correct",
            time_taken_seconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
            updated_at: new Date().toISOString(),
          }).eq("id", existing.id);
        } else {
          await supabase.from("submissions").insert({
            user_id: userId, problem_id: currentProblem.id, category: "sql_basics",
            problem_title: currentProblem.title, query: currentQuery, status,
            run_count: newRunCount, is_best_attempt: status === "correct",
            time_taken_seconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
          });
        }
        await updateStreak(userId);
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleSelectProblem = useCallback((p) => {
    startTimeRef.current = Date.now();
    runCountRef.current = 0;
    setRunCountDisplay(0);
    setSelectedProblem(p);
    setQuery("-- Explore the data first, then write your solution below\nSELECT * FROM customers LIMIT 5;");
    setResults(null);
    setError(null);
    setValidationStatus(null);
  }, []);

  const handleToggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedProblem]);

  const diffStyle = { Easy: { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" } };
  const solvedInTrack = START_HERE_IDS.filter((id) => solvedIds.has(id)).length;

  const validationBanner = () => {
    if (!validationStatus) return null;
    const configs = {
      correct: { bg: "#f0fdf4", border: "#86efac", icon: "✓", iconColor: "#16a34a", title: "Correct!", msg: "Your output matches the expected result perfectly.", titleColor: "#15803d" },
      almost:  { bg: "#fffbeb", border: "#fcd34d", icon: "~", iconColor: "#d97706", title: "Almost there", msg: "Your result structure looks right but the values don't match. Check your filters or logic.", titleColor: "#b45309" },
      wrong:   { bg: "#fef2f2", border: "#fca5a5", icon: "✗", iconColor: "#dc2626", title: "Not quite", msg: "Your result doesn't match. Check the number of columns and re-read the task.", titleColor: "#b91c1c" },
    };
    const c = configs[validationStatus];
    return (
      <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "0.875rem 1rem", marginBottom: "1rem", display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: c.iconColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>{c.icon}</div>
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: c.titleColor }}>{c.title}</div>
          <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: "2px" }}>{c.msg}</div>
        </div>
      </div>
    );
  };

  const handleCloseCelebration = () => {
    const wasFinal = celebration?.isFinal;
    setCelebration(null);
    if (wasFinal) navigate("/sql");
  };

  if (isMobile) {
    return (
      <>
        <MobileSQLLayout
          problems={START_HERE_PROBLEMS}
          selectedProblem={selectedProblem}
          onSelectProblem={handleSelectProblem}
          query={query}
          onQueryChange={setQuery}
          onRun={runQuery}
          onReset={() => { setQuery(selectedProblem.starterQuery); setResults(null); setError(null); }}
          dbReady={dbReady}
          results={results}
          error={error}
          validationStatus={validationStatus}
          solvedIds={solvedIds}
          isGuest={isGuest}
          isPro={true}
          paywallThreshold={9999}
          guestThreshold={10}
          onNavigateSignup={() => navigate("/signup")}
          onNavigateLogin={() => navigate("/login")}
          onNavigatePricing={() => navigate("/pricing")}
          pageTitle="Start Here"
          totalProblems={START_HERE_PROBLEMS.length}
          runCountDisplay={runCountDisplay}
        />
        {celebration && <CelebrationModal milestone={celebration} onClose={handleCloseCelebration} />}
      </>
    );
  }

  return (
    <div style={{ background: "#ffffff", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a", overflow: "hidden" }}>

      <nav style={{ padding: "0.85rem 2rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.97)", flexShrink: 0 }}>
        <span onClick={() => navigate("/")} style={{ fontWeight: 800, cursor: "pointer", fontSize: "1.1rem", letterSpacing: "-0.3px" }}>Repractiq</span>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span onClick={() => navigate("/home")} style={{ cursor: "pointer", color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}>Home</span>
          <div style={{ fontSize: "0.78rem", color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "4px 12px", fontWeight: 600 }}>
            🚀 {solvedInTrack} / 20 — Start Here
          </div>
          <span onClick={() => navigate("/sql")} style={{ cursor: "pointer", color: "#2563eb", fontSize: "0.85rem", fontWeight: 600 }}>← Back to Practice</span>
        </div>
      </nav>

      <div style={{ background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)", borderBottom: "1px solid #e2e8f0", padding: "0.875rem 2rem", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
          <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.3px", color: "#0f172a" }}>🚀 Start Here — Your first 20 problems</h2>
          <span style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 700 }}>{solvedInTrack}/20</span>
        </div>
        <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ width: `${(solvedInTrack / 20) * 100}%`, height: "100%", background: "#2563eb", borderRadius: "3px", transition: "width 0.3s" }} />
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        <div style={{ width: "340px", minWidth: "300px", borderRight: "1px solid #e2e8f0", overflowY: "auto", background: "#f8fafc", flexShrink: 0 }}>
          <div style={{ padding: "1rem 1rem 0.5rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Your Path</span>
          </div>
          {START_HERE_PROBLEMS.map((p) => {
            const isSelected = selectedProblem.id === p.id;
            const isExpanded = expandedId === p.id;
            const isSolved = solvedIds.has(p.id);
            const isLocked = isGuest && p.id > 10;

            return (
              <div key={p.id} ref={isSelected ? selectedItemRef : null} style={{ margin: "0 0.75rem 0.5rem", background: "#ffffff", border: "1.5px solid", borderColor: isSelected ? "#2563eb" : "#e2e8f0", borderRadius: "10px", overflow: "hidden", boxShadow: isSelected ? "0 0 0 3px rgba(37,99,235,0.08)" : "none" }}>
                <div onClick={() => { handleSelectProblem(p); handleToggleExpand(p.id); }} style={{ padding: "0.75rem 0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: isSolved ? "#16a34a" : isSelected ? "#eff6ff" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 700, color: isSolved ? "#fff" : isSelected ? "#2563eb" : "#94a3b8", flexShrink: 0 }}>
                    {isSolved ? "✓" : isLocked ? "🔒" : p.id}
                  </div>
                  <span style={{ fontSize: "0.83rem", fontWeight: isSelected ? 700 : 500, color: isSelected ? "#0f172a" : "#334155", flex: 1, lineHeight: 1.35 }}>{p.title}</span>
                  <span style={{ fontSize: "0.62rem", padding: "2px 7px", borderRadius: "10px", background: diffStyle.Easy.bg, color: diffStyle.Easy.color, border: `1px solid ${diffStyle.Easy.border}`, fontWeight: 600, whiteSpace: "nowrap" }}>Easy</span>
                  <span style={{ fontSize: "0.7rem", color: isExpanded ? "#2563eb" : "#94a3b8", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</span>
                </div>
                {isExpanded && (
                  <div style={{ borderTop: "1px solid #f1f5f9", padding: "0.875rem", background: "#fafbfc" }}>
                    <div style={{ marginBottom: "0.875rem" }}>
                      <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Task</div>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "#0f172a", lineHeight: 1.6, fontWeight: 500 }}>{p.description}</p>
                    </div>
                    {p.hint && (
                      <details>
                        <summary style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, cursor: "pointer", listStyle: "none" }}>💡 Show hint</summary>
                        <div style={{ marginTop: "6px", padding: "0.5rem 0.625rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "6px", fontSize: "0.78rem", color: "#92400e", lineHeight: 1.6, fontFamily: "monospace" }}>{p.hint}</div>
                      </details>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ height: "1.5rem" }} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#ffffff" }}>
          {isGuest && selectedProblem.id > 10 ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
              <div style={{ textAlign: "center", maxWidth: "360px" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔒</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem" }}>Sign in to unlock</h3>
                <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  You've explored the first 10 problems in Start Here. Sign up free to continue your guided path.
                </p>
                <button onClick={() => navigate("/signup")} style={{ width: "100%", padding: "11px", borderRadius: "8px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", marginBottom: "8px" }}>Sign Up Free →</button>
                <button onClick={() => navigate("/login")} style={{ width: "100%", padding: "11px", borderRadius: "8px", background: "#ffffff", color: "#2563eb", fontWeight: 600, fontSize: "0.88rem", border: "1.5px solid #bfdbfe", cursor: "pointer" }}>Already have an account? Sign in</button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ padding: "1.25rem 1.75rem 1rem", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: "10px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", fontWeight: 600 }}>Easy</span>
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Step {selectedProblem.id} of 20</span>
                  {solvedIds.has(selectedProblem.id) && (
                    <span style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: "10px", background: "#f0fdf4", color: "#16a34a", fontWeight: 600 }}>✓ Solved</span>
                  )}
                </div>
                <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.3px", color: "#0f172a" }}>{selectedProblem.title}</h2>
                <div style={{ marginTop: "0.875rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderLeft: "3px solid #2563eb", borderRadius: "0 8px 8px 0", padding: "0.625rem 0.875rem" }}>
                  <span style={{ fontSize: "0.67rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "3px" }}>Task</span>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "#0f172a", lineHeight: 1.6 }}>{selectedProblem.description}</p>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.75rem" }}>
                {validationBanner()}
                <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", marginBottom: "1rem" }}>
                  <div style={{ background: "#f8fafc", padding: "0.625rem 1rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ fontSize: "0.7rem", background: "#e2e8f0", color: "#0f172a", padding: "3px 9px", borderRadius: "20px", fontWeight: 700 }}>SQL</span>
                      <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Ctrl+Enter to run</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => { setQuery(selectedProblem.starterQuery); setResults(null); setError(null); }} style={{ fontSize: "0.75rem", color: "#64748b", background: "transparent", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }}>Reset</button>
                      <button onClick={runQuery} disabled={!dbReady} style={{ padding: "6px 18px", borderRadius: "6px", background: dbReady ? "#2563eb" : "#94a3b8", color: "#fff", fontWeight: 700, fontSize: "0.8rem", border: "none", cursor: dbReady ? "pointer" : "not-allowed" }}>{dbReady ? "▶ Run" : "Loading…"}</button>
                    </div>
                  </div>
                  <Editor
                    height="380px" language="sql" value={query} onChange={(value) => setQuery(value || "")} theme="vs-dark"
                    options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: "on", scrollBeyondLastLine: false, padding: { top: 10, bottom: 10 }, lineNumbers: "on" }}
                    onMount={(editor) => {
                      editorRef.current = editor;
                      editor.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.Enter, () => runQuery());
                    }}
                  />
                </div>

                <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ background: "#f8fafc", padding: "0.625rem 1rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Output</span>
                    {results && <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{results.values.length} row{results.values.length !== 1 ? "s" : ""}</span>}
                  </div>
                  <div style={{ minHeight: "120px", padding: "0.875rem 1rem", background: "#ffffff" }}>
                    {!results && !error && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100px", color: "#94a3b8", fontSize: "0.82rem" }}>Run your query to see results here</div>
                    )}
                    {error && (
                      <div style={{ color: "#ef4444", fontSize: "0.82rem", fontFamily: "monospace", lineHeight: 1.6, background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "0.75rem" }}>{error}</div>
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

                {runCountDisplay > 2 && validationStatus !== "correct" && (
                  <div style={{ marginTop: "1rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.8rem", color: "#92400e" }}>
                    <strong>Stuck?</strong> Click the question on the left and expand the hint section.
                  </div>
                )}
                <div style={{ height: "2rem" }} />
              </div>
            </>
          )}
        </div>
      </div>

      {celebration && <CelebrationModal milestone={celebration} onClose={handleCloseCelebration} />}
    </div>
  );
}