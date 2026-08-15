import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";
import { PYTHON_PROBLEMS } from "./data/pythonProblems";
import Editor from "@monaco-editor/react";
import { useMobile } from "../hooks/useMobile";

import useTimer from "../hooks/useTimer";
import TimerDisplay from "../components/TimerDisplay";
import TimesUpModal from "../components/TimesUpModal";
import PerformanceRating from "../components/PerformanceRating";




// ─── MILESTONES ───────────────────────────────────────────────────────────────
const MILESTONES = [
  {
    id: "bronze",
    label: "Bronze",
    threshold: 25,
    problemRange: [1, 25],
    icon: "🥉",
    color: "#cd7f32",
    bg: "#fdf6ec",
    border: "#f0c080",
    title: "Python Beginner",
    description: "Solve your first 25 Python problems",
    xp: 250,
  },
  {
    id: "silver",
    label: "Silver",
    threshold: 50,
    problemRange: [26, 50],
    icon: "🥈",
    color: "#94a3b8",
    bg: "#f8fafc",
    border: "#cbd5e1",
    title: "Python Practitioner",
    description: "Solve problems 26–50 to reach Silver",
    xp: 500,
  },
  {
    id: "gold",
    label: "Gold",
    threshold: 100,
    problemRange: [51, 100],
    icon: "🏆",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fcd34d",
    title: "Python Master",
    description: "Complete all 100 Python problems",
    xp: 1000,
  },
];

// ─── VALIDATE PYTHON ──────────────────────────────────────────────────────────
// function validatePython(output, problem) {
//   if (!output || !problem?.expectedOutput) return null;
//   const normalize = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");
//   if (normalize(output) === normalize(problem.expectedOutput)) return "correct";
//   if (output.trim().length > 0) return "almost";
//   return "wrong";
// }

// ─── UPDATE STREAK ────────────────────────────────────────────────────────────
async function updateStreak(userId) {
  const today = new Date().toISOString().split("T")[0];
  const { data: existing } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!existing) {
    await supabase.from("user_streaks").insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_solved_date: today,
    });
    return;
  }

  if (existing.last_solved_date === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const newStreak =
    existing.last_solved_date === yesterdayStr
      ? (existing.current_streak || 0) + 1
      : 1;

  await supabase
    .from("user_streaks")
    .update({
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, existing.longest_streak || 0),
      last_solved_date: today,
    })
    .eq("user_id", userId);
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function PythonBasicsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { problemSlug } = useParams();
  const isMobile = useMobile();
  const editorRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const runCountRef = useRef(0);
  const selectedProblemRef = useRef(PYTHON_PROBLEMS[0]);
  const codeRef = useRef("");
  const pyodideRef = useRef(null);

  // ─── STATES ─────────────────────────────────────────────────────────────
  const [selectedProblem, setSelectedProblem] = useState(PYTHON_PROBLEMS[0]);
  const [code, setCode] = useState(PYTHON_PROBLEMS[0].starterCode || "");
  const [mobileCode, setMobileCode] = useState(PYTHON_PROBLEMS[0].starterCode || "");
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [validationStatus, setValidationStatus] = useState(null);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(true);
  const [runCountDisplay, setRunCountDisplay] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalComment, setModalComment] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);

  // const [testResults, setTestResults] = useState([]);
// const [running, setRunning] = useState(false);

  // Auth
  const [isGuest, setIsGuest] = useState(false);
  const [isPro, setIsPro] = useState(false); // eslint-disable-line no-unused-vars
  const [userFullName, setUserFullName] = useState("");
  const [userStreak, setUserStreak] = useState(0);
  const [solvedIds, setSolvedIds] = useState(new Set());

  // Badges
  const [expandedMilestone, setExpandedMilestone] = useState("bronze");
  const [unlockedMilestones, setUnlockedMilestones] = useState(new Set());
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [currentBadge, setCurrentBadge] = useState(null);

  // ADD THESE — they exist in SQL but missing in Python
// const [earnedBadgeIds, setEarnedBadgeIds] = useState([]);
// const [unlockedBadges, setUnlockedBadges] = useState([]);

  const {
    formattedTimeLeft,
    percentLeft,
    timerColor,
    isExpired,
    isStopped,
    timeUsed,
    // totalTime,
    stopTimer,
    resetTimer,
    getPerformanceRating,
    formatTime,
    getExactTimeUsed, // ← ADD THIS
  } = useTimer(selectedProblem?.difficulty || "Easy", selectedProblem?.id);

  const [performanceRating, setPerformanceRating] = useState(null);
const [attemptNumber, setAttemptNumber] = useState(1);
  // ─── SYNC REFS ────────────────────────────────────────────────────────────
  useEffect(() => { codeRef.current = isMobile ? mobileCode : code; }, [code, mobileCode, isMobile]);
  useEffect(() => { selectedProblemRef.current = selectedProblem; }, [selectedProblem]);

  // ─── LOAD PYODIDE ─────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        if (window.loadPyodide) {
          const pyodide = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
          });
          pyodideRef.current = pyodide;
          setPyodideReady(true);
          setPyodideLoading(false);
        } else {
          // Wait for script to load
          const interval = setInterval(async () => {
            if (window.loadPyodide) {
              clearInterval(interval);
              const pyodide = await window.loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
              });
              pyodideRef.current = pyodide;
              setPyodideReady(true);
              setPyodideLoading(false);
            }
          }, 500);
        }
      } catch (err) {
        console.error("Pyodide failed:", err);
        setPyodideLoading(false);
      }
    };
    load();
  }, []);

  // ─── FETCH USER DATA ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        setIsGuest(true);
        return;
      }
  
      const userId = sessionData.session.user.id;
  
      // Pro check
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_pro, pro_expires_at, full_name")
        .eq("id", userId)
        .maybeSingle();
  
      if (profile?.is_pro && profile?.pro_expires_at) {
        const expires = new Date(profile.pro_expires_at);
        if (expires > new Date()) setIsPro(true);
      }
  
      setUserFullName(
        profile?.full_name ||
        sessionData.session.user.email?.split("@")[0] ||
        "User"
      );
  
      // Streak
      const { data: streakRow } = await supabase
        .from("user_streaks")
        .select("current_streak")
        .eq("user_id", userId)
        .maybeSingle();
      setUserStreak(streakRow?.current_streak || 0);
  
      // Solved problems
      const { data, error: solvedError } = await supabase
        .from("submissions")
        .select("problem_id")
        .eq("user_id", userId)
        .eq("category", "python_basics")
        .eq("status", "correct");
  
      if (solvedError || !data) return;
      const ids = new Set(data.map((row) => row.problem_id));
      setSolvedIds(ids);
  
      // Milestones
      const solvedCount = ids.size;
      const unlocked = new Set();
      MILESTONES.forEach((m) => {
        if (solvedCount >= m.threshold) unlocked.add(m.id);
      });
      setUnlockedMilestones(unlocked);
  
      if (solvedCount < 25) setExpandedMilestone("bronze");
      else if (solvedCount < 50) setExpandedMilestone("silver");
      else setExpandedMilestone("gold");
  
      // Earned badges
      // const { data: earnedBadges } = await supabase
      //   .from("user_badges")
      //   .select("badge_id")
      //   .eq("user_id", userId);
      // setEarnedBadgeIds((earnedBadges || []).map(b => b.badge_id));
    };
    fetchData();
  }, []);
  // ─── URL / SLUG HANDLING ──────────────────────────────────────────────────
  useEffect(() => {
    if (problemSlug) {
      const target = PYTHON_PROBLEMS.find((p) => p.slug === problemSlug);
      if (target) {
        handleSelectProblem(target);
        setExpandedId(target.id);
      }
    } else {
      const incoming = location.state || {};
      if (incoming.focusProblemId !== undefined) {
        const target = PYTHON_PROBLEMS.find((p) => p.id === incoming.focusProblemId);
        if (target) {
          handleSelectProblem(target);
          setExpandedId(target.id);
        }
      }
    }
  }, [problemSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── SELECT PROBLEM ───────────────────────────────────────────────────────
  const handleSelectProblem = useCallback((p) => {
    startTimeRef.current = Date.now();
    runCountRef.current = 0;
    setRunCountDisplay(0);
    setSelectedProblem(p);
    setCode(p.starterCode || "");
    setMobileCode(p.starterCode || "");
    setOutput(null);
    setError(null);
    setValidationStatus(null);
    setPerformanceRating(null); 
    setAttemptNumber(1); 
    navigate(`/python/basics/${p.slug}`);
  }, [navigate]);

  const handleToggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const checkAndSaveBadges = useCallback(async (userId) => {
    const { data: alreadyEarned } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", userId);
  
    const earnedSet = new Set((alreadyEarned || []).map(b => b.badge_id));
    const currentSolvedCount = solvedIds.size;
  
    const BADGE_CONDITIONS = [
      { id: "python_first_query",    condition: currentSolvedCount >= 1   },
      { id: "python_on_a_roll",      condition: currentSolvedCount >= 5   },
      { id: "python_problem_solver", condition: currentSolvedCount >= 10  },
      { id: "python_bronze",         condition: currentSolvedCount >= 25  },
      { id: "python_silver",         condition: currentSolvedCount >= 50  },
      { id: "python_gold",           condition: currentSolvedCount >= 100 },
    ];
  
    const newBadges = [];
    for (const badge of BADGE_CONDITIONS) {
      if (badge.condition && !earnedSet.has(badge.id)) {
        await supabase.from("user_badges").upsert({
          user_id:  userId,
          badge_id: badge.id,
        }, { onConflict: "user_id,badge_id" });
        newBadges.push(badge.id);
      }
    }
    return newBadges;
  }, [solvedIds]);
 // ─── RUN CODE ─────────────────────────────────────────────────────────────
 const runCode = useCallback(async () => {
  const currentProblem = selectedProblemRef.current;
  const currentCode = codeRef.current;
  const pyodide = pyodideRef.current;

  if (!pyodide || !currentProblem) return;

  setError(null);
  setOutput(null);
  setValidationStatus(null);

  // Sanitize code
  const sanitizeCode = (raw) => {
    const lines = raw.split("\n");
    const normalized = lines.map((line) => line.replace(/\t/g, "    "));
    const nonEmpty = normalized.filter((l) => l.trim() !== "");
    const minIndent = nonEmpty.length
      ? Math.min(...nonEmpty.map((l) => l.match(/^(\s*)/)[1].length))
      : 0;
    const dedented = minIndent > 0
      ? normalized.map((l) => (l.trim() === "" ? "" : l.slice(minIndent)))
      : normalized;
    return dedented.join("\n").trim();
  };

  const sanitizedCode = sanitizeCode(currentCode);

  try {
    // Reset stdout
    pyodide.runPython(
      "import sys\nfrom io import StringIO\nsys.stdout = StringIO()"
    );

    // Run user code with friendly errors
    try {
      pyodide.runPython(sanitizedCode);
    } catch (pyErr) {
      const msg = pyErr.message || "";
      if (msg.includes("IndentationError") || msg.includes("unindent")) {
        setError(
          "IndentationError: Your code has inconsistent indentation.\n\n" +
          "Tips:\n  • Use 4 spaces per indentation level\n  • Do not mix tabs and spaces"
        );
        return;
      }
      if (msg.includes("SyntaxError")) {
        setError(`SyntaxError: Check for missing colons or unclosed brackets.\n\nDetails: ${msg.split("\n")[0]}`);
        return;
      }
      const cleanMsg = msg.split("\n").filter(l => !l.includes("_pyodide")).join("\n").trim();
      setError(cleanMsg || msg);
      return;
    }

    // Get output
    const userPrintLog = pyodide.runPython("sys.stdout.getvalue()").trim();

    runCountRef.current += 1;
    const newRunCount = runCountRef.current;
    setRunCountDisplay(newRunCount);

    let allPassed = true;
    let testOutputs = [];

    if (currentProblem.type === "function" && currentProblem.testCases?.length > 0) {
      for (const tc of currentProblem.testCases) {
        try {
          pyodide.runPython("sys.stdout = StringIO()");
          const actualResult = pyodide.runPython(`str(${tc.call})`).trim();
          const passed = actualResult === String(tc.expected).trim();
          if (!passed) allPassed = false;
          testOutputs.push({ input: tc.input, call: tc.call, returned: actualResult, expected: tc.expected, passed });
        } catch (tcErr) {
          allPassed = false;
          testOutputs.push({ input: tc.input, call: tc.call, returned: null, expected: tc.expected, passed: false, error: tcErr.message.split("\n")[0] });
        }
      }

      let finalDisplay = "";
      if (userPrintLog) finalDisplay += `── Print Output ──\n${userPrintLog}\n\n`;
      finalDisplay += `── Test Results ──\n`;
      testOutputs.forEach((t, i) => {
        finalDisplay += `\nTest ${i + 1}: ${t.input}\n`;
        finalDisplay += `  Call:     ${t.call}\n`;
        if (t.error) {
          finalDisplay += `  Error:    ${t.error}\n`;
        } else {
          finalDisplay += `  Returned: ${t.returned}\n`;
          finalDisplay += `  Expected: ${t.expected}\n`;
        }
        finalDisplay += `  Status:   ${t.passed ? "✅ Passed" : "❌ Failed"}`;
      });
      const passCount = testOutputs.filter(t => t.passed).length;
      finalDisplay += `\n\n── ${passCount}/${testOutputs.length} tests passed ──`;
      setOutput(finalDisplay);
    } else {
      const expected = (currentProblem.expectedOutput || "").trim();
      allPassed = userPrintLog === expected;
      setOutput(userPrintLog || "(No output printed)");
    }

    const status = allPassed ? "correct" : "almost";
    setValidationStatus(status);

    if (status === "correct") {
      const capturedTimeUsed = getExactTimeUsed();
      stopTimer();
      setPerformanceRating(getPerformanceRating(capturedTimeUsed));
      setSolvedIds((prev) => {
        const next = new Set([...prev, Number(currentProblem.id)]);
        MILESTONES.forEach((m) => {
          if (next.size === m.threshold && !unlockedMilestones.has(m.id)) {
            setUnlockedMilestones((prev2) => new Set([...prev2, m.id]));
            setCurrentBadge(m);
            setShowBadgeModal(true);
        
            // ← ADD THIS — save badge permanently to Supabase
            supabase.auth.getSession().then(({ data: sessionData }) => {
              if (sessionData?.session) {
                supabase.from("user_badges").upsert({
                  user_id:  sessionData.session.user.id,
                  badge_id: `python_${m.id}`, // e.g. python_bronze, python_silver, python_gold
                }, { onConflict: "user_id,badge_id" });
              }
            });
          }
        });
        return next;
      });
    }

    // Save to Supabase
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) return;

    const userId = sessionData.session.user.id;

    const { data: existing, error: fetchError } = await supabase
      .from("submissions")
      .select("id, status")
      .eq("user_id", userId)
      .eq("problem_id", currentProblem.id)
      .eq("category", "python_basics")
      .maybeSingle();

    if (fetchError) {
      console.error("Fetch error:", fetchError.message);
      return;
    }

    if (existing?.status === "correct" && status !== "correct") {
      await updateStreak(userId);
      return;
    }

    if (existing) {
      const { error: updateError } = await supabase
        .from("submissions")
        .update({
          query:              sanitizedCode,
          status,
          run_count:          newRunCount,
          is_best_attempt:    status === "correct",
          time_taken_seconds: getExactTimeUsed(),
          updated_at:         new Date().toISOString(),
        })
        .eq("id", existing.id);
      if (updateError) console.error("Update error:", updateError.message);
    } else {
      const { error: insertError } = await supabase
        .from("submissions")
        .insert({
          user_id:            userId,
          problem_id:         currentProblem.id,
          category:           "python_basics",
          problem_title:      currentProblem.title,
          query:              sanitizedCode,
          status,
          run_count:          newRunCount,
          is_best_attempt:    status === "correct",
          time_taken_seconds: getExactTimeUsed(),
          attempt_number:     attemptNumber,
        });
      if (insertError) console.error("Insert error:", insertError.message);
    }

    await updateStreak(userId);

    // if (status === "correct") {
    //   // const newBadges = await checkAndSaveBadges(userId);
    //   // if (newBadges?.length > 0) setUnlockedBadges(newBadges);
    // }

  } catch (err) {
    setError(err.message);
  }
}, [attemptNumber, getExactTimeUsed, getPerformanceRating, stopTimer, unlockedMilestones]);

  // ─── COMMUNITY POST ───────────────────────────────────────────────────────
  const handlePostCommunity = () => {
    setShowModal(true);
    setModalComment("");
    setPostSuccess(false);
  };

  const submitPost = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session) {
      const userId = sessionData.session.user.id;
      await supabase.from("submissions").upsert({
        user_id: userId,
        problem_id: selectedProblem.id,
        category: "python_basics",
        problem_title: selectedProblem.title,
        query: isMobile ? mobileCode : code,
        status: "correct",
        is_best_attempt: true,
        comment: modalComment,
        run_count: runCountRef.current,
        time_taken_seconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
      });
    }
    setPostSuccess(true);
    setTimeout(() => setShowModal(false), 1800);
  };

  // ─── VALIDATION BANNER ────────────────────────────────────────────────────
  const validationBanner = () => {
    if (!validationStatus) return null;
    const configs = {
      correct: {
        bg: "#f0fdf4", border: "#86efac", icon: "✓", iconColor: "#16a34a",
        title: "Correct!", msg: "Your output matches the expected result.",
        titleColor: "#15803d",
      },
      almost: {
        bg: "#fffbeb", border: "#fcd34d", icon: "~", iconColor: "#d97706",
        title: "Almost there", msg: "Your code runs but output doesn't match. Check your logic.",
        titleColor: "#b45309",
      },
      wrong: {
        bg: "#fef2f2", border: "#fca5a5", icon: "✗", iconColor: "#dc2626",
        title: "Not quite", msg: "Output doesn't match. Re-read the task and try again.",
        titleColor: "#b91c1c",
      },
    };
    const c = configs[validationStatus];
    return (
      <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "0.875rem 1rem", marginBottom: "1rem", display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: c.iconColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
          {c.icon}
        </div>
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: c.titleColor }}>{c.title}</div>
          <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: "2px" }}>{c.msg}</div>
          {validationStatus === "correct" && (
            <button
              onClick={handlePostCommunity}
              style={{ marginTop: "0.5rem", fontSize: "0.78rem", color: "#7c3aed", background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: "6px", padding: "4px 12px", cursor: "pointer", fontWeight: 600 }}
            >
              🎉 Share to Community
            </button>
          )}
        </div>
      </div>
    );
  };

  // ─── FILTERED PROBLEMS ────────────────────────────────────────────────────
  const filteredProblems = useMemo(() => {
    if (!searchTerm.trim()) return PYTHON_PROBLEMS;
    return PYTHON_PROBLEMS.filter((p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Group problems by milestone
  const bronzeProblems = filteredProblems.filter((p) => p.id >= 1 && p.id <= 25);
  const silverProblems = filteredProblems.filter((p) => p.id >= 26 && p.id <= 50);
  const goldProblems = filteredProblems.filter((p) => p.id >= 51 && p.id <= 100);

  // ─── PROBLEM CARD ─────────────────────────────────────────────────────────
  const renderProblem = (p) => {
    const isSelected = selectedProblem.id === p.id;
    const isExpanded = expandedId === p.id;
    const isSolved = solvedIds.has(p.id);

    return (
      <div
        key={p.id}
        style={{ margin: "0 0.75rem 0.5rem", background: "#ffffff", border: "1.5px solid", borderColor: isSelected ? "#7c3aed" : "#e2e8f0", borderRadius: "10px", overflow: "hidden", transition: "border-color 0.15s", boxShadow: isSelected ? "0 0 0 3px rgba(124,58,237,0.08)" : "none" }}
      >
        <div
          onClick={() => {
            if (p.id > 10 && (isGuest || !isPro)) {
              setShowLockModal(true);
              return;
            }
            handleSelectProblem(p);
            handleToggleExpand(p.id);
            if (!isMobile && editorRef.current) editorRef.current.focus();
          }}
          style={{ padding: "0.75rem 0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: isSolved ? "#16a34a" : isSelected ? "#f5f3ff" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 700, color: isSolved ? "#fff" : isSelected ? "#7c3aed" : "#94a3b8", flexShrink: 0 }}>
            {isSolved ? "✓" : p.id}
          </div>
          <span style={{ fontSize: "0.83rem", fontWeight: isSelected ? 700 : 500, color: isSelected ? "#0f172a" : "#334155", flex: 1, lineHeight: 1.35 }}>
            {p.title}
          </span>
          <span style={{ fontSize: "0.62rem", padding: "2px 7px", borderRadius: "10px", background: p.difficulty === "Hard" ? "#fef2f2" : p.difficulty === "Medium" ? "#fffbeb" : "#f0fdf4", color: p.difficulty === "Hard" ? "#dc2626" : p.difficulty === "Medium" ? "#d97706" : "#16a34a", border: `1px solid ${p.difficulty === "Hard" ? "#fca5a5" : p.difficulty === "Medium" ? "#fcd34d" : "#bbf7d0"}`, fontWeight: 600, whiteSpace: "nowrap" }}>
            {p.difficulty || "Easy"}
          </span>
          {/* ← ADD THIS */}
{p.id > 10 && (isGuest || !isPro) && (
  <span style={{ fontSize: "0.75rem" }}>🔒</span>
)}
          <span style={{ fontSize: "0.7rem", color: isExpanded ? "#7c3aed" : "#94a3b8", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", lineHeight: 1 }}>▾</span>
        </div>

        {isExpanded && (
          <div style={{ borderTop: "1px solid #f1f5f9", padding: "0.875rem", background: "#fafbfc" }}>
            <div style={{ marginBottom: "0.875rem" }}>
              <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Task</div>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#0f172a", lineHeight: 1.6, fontWeight: 500 }}>{p.description}</p>
            </div>
            {p.explanation && (
              <div style={{ marginBottom: "0.875rem" }}>
                <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Explanation</div>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569", lineHeight: 1.65 }}>{p.explanation}</p>
              </div>
            )}
            {/* 👇 ADD TEST CASES HERE FOR SIDEBAR 👇 */}
    {p.testCases && p.testCases.length > 0 && (
      <div style={{ marginBottom: "0.875rem" }}>
        <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
          Test Cases
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {p.testCases.map((tc, idx) => (
            <div key={idx} style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "6px 8px", fontSize: "0.72rem", fontFamily: "monospace" }}>
              <div><span style={{ color: "#64748b" }}>Input:</span> {tc.input}</div>
              <div><span style={{ color: "#64748b" }}>Call:</span> <code style={{ color: "#7c3aed" }}>{tc.call}</code></div>
              <div><span style={{ color: "#64748b" }}>Expected:</span> <code style={{ color: "#16a34a" }}>{tc.expected}</code></div>
            </div>
          ))}
        </div>
      </div>
    )}
            {p.hint && (
              <details>
                <summary style={{ fontSize: "0.78rem", color: "#7c3aed", fontWeight: 600, cursor: "pointer", listStyle: "none" }}>💡 Show hint</summary>
                <div style={{ marginTop: "6px", padding: "0.5rem 0.625rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "6px", fontSize: "0.78rem", color: "#92400e", lineHeight: 1.6, fontFamily: "monospace" }}>
                  {p.hint}
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    );
  };

  // ─── MILESTONE SECTION ────────────────────────────────────────────────────
  const renderMilestone = (milestone, problems) => {
    const isUnlocked = unlockedMilestones.has(milestone.id);
    const isExpanded = expandedMilestone === milestone.id;
    const solvedInRange = problems.filter((p) => solvedIds.has(p.id)).length;
    const totalInRange = problems.length;
    const pct = Math.round((solvedInRange / totalInRange) * 100);

    return (
      <div key={milestone.id} style={{ marginBottom: "0.5rem" }}>
        {/* Milestone Header */}
        <div
          onClick={() => setExpandedMilestone(isExpanded ? null : milestone.id)}
          style={{ margin: "0 0.75rem", background: isUnlocked ? milestone.bg : "#f8fafc", border: `1.5px solid ${isUnlocked ? milestone.border : "#e2e8f0"}`, borderRadius: "10px", padding: "0.625rem 0.75rem", cursor: "pointer", marginBottom: isExpanded ? "4px" : "0" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.1rem" }}>{milestone.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: isUnlocked ? milestone.color : "#94a3b8" }}>
                {milestone.label} — {milestone.title}
              </div>
              <div style={{ fontSize: "0.65rem", color: "#94a3b8" }}>
                {isUnlocked ? `Completed ✓ · ${milestone.xp} XP` : `${solvedInRange}/${totalInRange} solved`}
              </div>
            </div>
            <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{isExpanded ? "▲" : "▼"}</span>
          </div>

          {/* Progress bar */}
          {!isUnlocked && (
            <div style={{ marginTop: "6px", background: "#e2e8f0", borderRadius: "4px", height: "4px" }}>
              <div style={{ height: "100%", borderRadius: "4px", background: milestone.color, width: `${pct}%`, transition: "width 0.4s ease" }} />
            </div>
          )}

          {/* Certificate button */}
          {isUnlocked && isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentBadge(milestone);
                setShowBadgeModal(true);
              }}
              style={{ marginTop: "8px", width: "100%", padding: "6px", borderRadius: "6px", background: milestone.color, color: "#fff", fontWeight: 700, fontSize: "0.72rem", border: "none", cursor: "pointer" }}
            >
              View Certificate →
            </button>
          )}
        </div>

        {/* Problems in this milestone */}
        {isExpanded && (
          <div style={{ paddingTop: "2px" }}>
            {problems.map((p) => renderProblem(p))}
          </div>
        )}
      </div>
    );
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#ffffff", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a", overflow: "hidden" }}>

      {/* NAV */}
      <nav style={{ padding: "0.85rem 2rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.97)", flexShrink: 0 }}>
        <span onClick={() => navigate("/")} style={{ fontWeight: 800, cursor: "pointer", fontSize: "1.1rem", letterSpacing: "-0.3px" }}>
          Repractiq
        </span>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span onClick={() => navigate("/home")} style={{ cursor: "pointer", color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}>Home</span>
          <span onClick={() => navigate("/profile")} style={{ cursor: "pointer", color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}>Profile</span>
          <div style={{ fontSize: "0.78rem", color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "4px 12px", fontWeight: 600 }}>
            ✓ {solvedIds.size} / {PYTHON_PROBLEMS.length} solved
          </div>
          <span onClick={() => navigate("/python")} style={{ cursor: "pointer", color: "#7c3aed", fontSize: "0.85rem", fontWeight: 600 }}>← Back to Practice</span>
        </div>
      </nav>

      {/* PAGE TITLE */}
      <div style={{ background: "linear-gradient(180deg, #fdf4ff 0%, #ffffff 100%)", borderBottom: "1px solid #e2e8f0", padding: "0.875rem 2rem", display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
        <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.3px", color: "#0f172a" }}>🐍 Python Basics</h2>
        {pyodideLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#94a3b8" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", border: "2px solid #e2e8f0", borderTop: "2px solid #7c3aed", animation: "spin 0.8s linear infinite" }} />
            Loading Python environment...
          </div>
        )}
      </div>

      {/* MAIN SPLIT */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* LEFT PANEL */}
        <div style={{ width: isMobile ? "100%" : "340px", minWidth: isMobile ? "100%" : "300px", borderRight: isMobile ? "none" : "1px solid #e2e8f0", overflowY: "auto", background: "#f8fafc", flexShrink: 0, display: isMobile && selectedProblem ? "none" : "block" }}>

          {/* Search */}
          <div style={{ padding: "1rem 1rem 0.5rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Problems</span>
            <div style={{ marginTop: "0.65rem", display: "flex", gap: "8px" }}>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") setSearchTerm(searchInput.trim()); }}
                placeholder="Search Python topics..."
                style={{ flex: 1, fontSize: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "7px 9px", outline: "none", background: "#fff" }}
              />
              <button
                onClick={() => setSearchTerm(searchInput.trim())}
                style={{ fontSize: "0.75rem", border: "1px solid #ddd6fe", color: "#7c3aed", background: "#f5f3ff", borderRadius: "8px", padding: "7px 10px", cursor: "pointer", fontWeight: 600 }}
              >
                Search
              </button>
            </div>
          </div>
          

          {/* MILESTONE SECTIONS */}
          <div style={{ paddingTop: "0.5rem", paddingBottom: "1.5rem" }}>
            {renderMilestone(MILESTONES[0], bronzeProblems)}
            {renderMilestone(MILESTONES[1], silverProblems)}
            {renderMilestone(MILESTONES[2], goldProblems)}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#ffffff" }}>

          {/* Mobile back button */}
          {isMobile && (
            <div style={{ padding: "0.625rem 1rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
              <button
                onClick={() => navigate("/python/basics")}
                style={{ fontSize: "0.82rem", color: "#7c3aed", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                ← Back to problems
              </button>
            </div>
          )}

          {/* Problem Header */}
          <div style={{ padding: "1.25rem 1.75rem 1rem", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: "10px", background: selectedProblem.difficulty === "Hard" ? "#fef2f2" : selectedProblem.difficulty === "Medium" ? "#fffbeb" : "#f0fdf4", color: selectedProblem.difficulty === "Hard" ? "#dc2626" : selectedProblem.difficulty === "Medium" ? "#d97706" : "#16a34a", border: `1px solid ${selectedProblem.difficulty === "Hard" ? "#fca5a5" : selectedProblem.difficulty === "Medium" ? "#fcd34d" : "#bbf7d0"}`, fontWeight: 600 }}>
                    {selectedProblem.difficulty || "Easy"}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>#{selectedProblem.id}</span>
                  {solvedIds.has(selectedProblem.id) && (
                    <span style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: "10px", background: "#f0fdf4", color: "#16a34a", fontWeight: 600 }}>✓ Solved</span>
                  )}
                </div>
                <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.3px", color: "#0f172a" }}>{selectedProblem.title}</h2>
              </div>
                {/* ← ADD TIMER HERE */}
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <TimerDisplay
        formattedTimeLeft={formattedTimeLeft}
        percentLeft={percentLeft}
        timerColor={timerColor}
        isExpired={isExpired}
        isStopped={isStopped}
        difficulty={selectedProblem?.difficulty || "Easy"}
        timeUsed={timeUsed}
        formatTime={formatTime}
      />
      </div>
              {/* {!isMobile && (
                <button
                  onClick={handlePostCommunity}
                  style={{ padding: "8px 16px", borderRadius: "8px", background: "#ffffff", color: "#7c3aed", fontWeight: 600, fontSize: "0.8rem", border: "1.5px solid #ddd6fe", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  🌐 Post to Community
                </button>
              )} */}
            </div>
            <div style={{ marginTop: "0.875rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderLeft: "3px solid #7c3aed", borderRadius: "0 8px 8px 0", padding: "0.625rem 0.875rem" }}>
              <span style={{ fontSize: "0.67rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "3px" }}>Task</span>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "#0f172a", lineHeight: 1.6 }}>{selectedProblem.description}</p>
            </div>
          </div>

          {/* Editor + Output */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.75rem" }}>
            {/* ← ADD PERFORMANCE RATING */}
  {performanceRating && (
  <PerformanceRating
    rating={performanceRating}
    onShare={handlePostCommunity}
    onNext={() => {
      const currentIndex = PYTHON_PROBLEMS.findIndex(p => p.id === selectedProblem.id);
      const next = PYTHON_PROBLEMS[currentIndex + 1];
      if (next) handleSelectProblem(next);
    }}
  />
)}
{validationBanner()}
            

            {/* Editor */}
            <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", marginBottom: "1rem" }}>
              <div style={{ background: "#f8fafc", padding: "0.625rem 1rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ fontSize: "0.7rem", background: "#e2e8f0", color: "#0f172a", padding: "3px 9px", borderRadius: "20px", fontWeight: 700 }}>Python</span>
                  {!isMobile && <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Ctrl+Enter to run</span>}
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => {
                      setCode(selectedProblem.starterCode || "");
                      setMobileCode(selectedProblem.starterCode || "");
                      setOutput(null);
                      setError(null);
                      setValidationStatus(null);
                    }}
                    style={{ fontSize: "0.75rem", color: "#64748b", background: "transparent", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }}
                  >
                    Reset
                  </button>
                  {selectedProblem.solutionCode && (
                    <button
                      onClick={() => {
                        setCode(selectedProblem.solutionCode);
                        setMobileCode(selectedProblem.solutionCode);
                      }}
                      style={{ fontSize: "0.75rem", color: "#7c3aed", background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}
                    >
                      Solution
                    </button>
                  )}
                  <button
                    onClick={runCode}
                    disabled={!pyodideReady}
                    style={{ padding: "6px 18px", borderRadius: "6px", background: pyodideReady ? "#7c3aed" : "#94a3b8", color: "#fff", fontWeight: 700, fontSize: "0.8rem", border: "none", cursor: pyodideReady ? "pointer" : "not-allowed" }}
                  >
                    {pyodideReady ? "▶ Run" : "Loading…"}
                  </button>
                </div>
              </div>

              {/* Mobile textarea editor */}
              {isMobile ? (
                <textarea
                  value={mobileCode}
                  onChange={(e) => setMobileCode(e.target.value)}
                  spellCheck={false}
                  style={{ width: "100%", minHeight: "280px", padding: "1rem", fontFamily: "monospace", fontSize: "0.85rem", background: "#1e1e1e", color: "#d4d4d4", border: "none", outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.6 }}
                />
              ) : (
                <Editor
                  height="380px"
                  language="python"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-dark"
                  options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: "on", scrollBeyondLastLine: false, padding: { top: 10, bottom: 10 }, lineNumbers: "on" }}
                  onMount={(editor) => {
                    editorRef.current = editor;
                    editor.addCommand(
                      window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.Enter,
                      () => runCode()
                    );
                  }}
                />
              )}
            </div>

            {/* Output */}
            <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", marginBottom: "1rem" }}>
              <div style={{ background: "#f8fafc", padding: "0.625rem 1rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Output</span>
                {runCountDisplay > 0 && (
                  <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Run #{runCountDisplay}</span>
                )}
              </div>
              <div style={{ minHeight: "100px", padding: "0.875rem 1rem", background: "#ffffff" }}>
                {!output && !error && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60px", color: "#94a3b8", fontSize: "0.82rem" }}>
                    Run your code to see output here
                  </div>
                )}
                {error && (
                  <pre style={{ color: "#ef4444", fontSize: "0.82rem", fontFamily: "monospace", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap", background: "#fef2f2", padding: "0.75rem", borderRadius: "6px" }}>
                    {error}
                  </pre>
                )}
                {output && (
                  <pre style={{ color: "#0f172a", fontSize: "0.82rem", fontFamily: "monospace", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>
                    {output}
                  </pre>
                )}
              </div>
            </div>

            {/* Expected output */}
            {selectedProblem.expectedOutput && (
              <div style={{ border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden", marginBottom: "1rem" }}>
                <div style={{ background: "#f8fafc", padding: "0.5rem 1rem", borderBottom: "1px solid #e2e8f0" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Expected Output</span>
                </div>
                <pre style={{ margin: 0, padding: "0.875rem 1rem", fontSize: "0.82rem", fontFamily: "monospace", color: "#16a34a", background: "#f0fdf4", whiteSpace: "pre-wrap" }}>
                  {selectedProblem.expectedOutput}
                </pre>
              </div>
            )}

            {/* Stuck hint */}
            {runCountDisplay > 2 && validationStatus !== "correct" && (
              <div style={{ marginTop: "1rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.8rem", color: "#92400e" }}>
                <strong>Stuck?</strong> Click the problem on the left and expand the hint section.
              </div>
            )}

            <div style={{ height: "2rem" }} />
          </div>
        </div>
      </div>
      {/* TIMES UP MODAL */}
{isExpired && (
  <TimesUpModal
    problem={selectedProblem}
    runCount={runCountDisplay}
    difficulty={selectedProblem?.difficulty || "Easy"}
    onReset={() => {
      setAttemptNumber(prev => prev + 1);
      setCode(selectedProblem.starterCode || "");
      setMobileCode(selectedProblem.starterCode || "");
      setOutput(null);
      setError(null);
      setValidationStatus(null);
      setPerformanceRating(null);
      runCountRef.current = 0;
      setRunCountDisplay(0);
      resetTimer(selectedProblem?.difficulty || "Easy");
    }}
    onSkip={() => {
      supabase.auth.getSession().then(({ data: sessionData }) => {
        if (sessionData?.session) {
          supabase.from("submissions").insert({
            user_id:            sessionData.session.user.id,
            problem_id:         selectedProblem.id,
            category:           "python_basics",
            problem_title:      selectedProblem.title,
            query:              isMobile ? mobileCode : code,
            status:             "skipped",
            run_count:          runCountDisplay,
            is_best_attempt:    false,
            time_taken_seconds: getExactTimeUsed(),
            attempt_number:     attemptNumber,
          });
        }
      });
      const currentIndex = PYTHON_PROBLEMS.findIndex(p => p.id === selectedProblem.id);
      const next = PYTHON_PROBLEMS[currentIndex + 1];
      if (next) handleSelectProblem(next);
    }}
    onClose={() => resetTimer(selectedProblem?.difficulty || "Easy")}
  />
)}

      {/* LOCK MODAL — uncomment when pricing ready */}
      {showLockModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowLockModal(false); }}
        >
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "2rem", width: "420px", maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔒</div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem" }}>
              {isGuest ? "Sign in to unlock this problem" : "Pro required"}
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              {isGuest
                ? `You've explored the first 10 problems free. Sign up to access all ${PYTHON_PROBLEMS.length} Python problems.`
                : `Upgrade to Pro to unlock all ${PYTHON_PROBLEMS.length} Python problems.`
              }
            </p>
            {isGuest ? (
              <>
                <button onClick={() => navigate("/signup")} style={{ width: "100%", padding: "11px", borderRadius: "8px", background: "#7c3aed", color: "#fff", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", marginBottom: "8px" }}>
                  Sign Up Free →
                </button>
                <button onClick={() => navigate("/login")} style={{ width: "100%", padding: "11px", borderRadius: "8px", background: "#ffffff", color: "#7c3aed", fontWeight: 600, fontSize: "0.88rem", border: "1.5px solid #ddd6fe", cursor: "pointer", marginBottom: "8px" }}>
                  Already have an account? Sign in
                </button>
              </>
            ) : (
              <button onClick={() => navigate("/pricing")} style={{ width: "100%", padding: "11px", borderRadius: "8px", background: "#7c3aed", color: "#fff", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", marginBottom: "8px" }}>
                Upgrade to Pro →
              </button>
            )}
            <button onClick={() => setShowLockModal(false)} style={{ fontSize: "0.78rem", color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}>
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* BADGE UNLOCK MODAL */}
      {showBadgeModal && currentBadge && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowBadgeModal(false); }}
        >
          <div style={{ background: "#ffffff", borderRadius: "20px", padding: "2.5rem", width: "420px", maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>{currentBadge.icon}</div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: currentBadge.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
              Badge Unlocked!
            </div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem", letterSpacing: "-0.5px" }}>
              {currentBadge.title}
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.7, marginBottom: "1rem" }}>
              {currentBadge.description}
            </p>
            <div style={{ background: currentBadge.bg, border: `1px solid ${currentBadge.border}`, borderRadius: "10px", padding: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: currentBadge.color }}>
                +{currentBadge.xp} XP earned 🎯
              </div>
            </div>
            <button
  onClick={() => {
    setShowBadgeModal(false);
    import("../badges/CertificateCard").then(async ({ generateCertificate }) => {
      await generateCertificate({
        name: userFullName,
        badge: currentBadge.label,
        title: currentBadge.title,
        category: "Python Basics",
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        solvedCount: solvedIds.size,
        streak: userStreak,
      });
    });
  }}
  style={{
    width: "100%",
    padding: "11px",
    borderRadius: "8px",
    background: currentBadge.color,
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.88rem",
    border: "none",
    cursor: "pointer",
    marginBottom: "8px",
  }}
>
  Download Certificate →
</button>
            <button
              onClick={() => setShowBadgeModal(false)}
              style={{ width: "100%", padding: "11px", borderRadius: "8px", background: "#fff", color: "#64748b", fontWeight: 600, fontSize: "0.88rem", border: "1.5px solid #e2e8f0", cursor: "pointer" }}
            >
              Keep Practicing →
            </button>
          </div>
        </div>
      )}

{/* TIMES UP MODAL */}
{isExpired && (
  <TimesUpModal
    problem={selectedProblem}
    runCount={runCountDisplay}
    difficulty={selectedProblem?.difficulty || "Easy"}
    onReset={() => {
      // New attempt — reset everything
      setAttemptNumber(prev => prev + 1);
      setCode(selectedProblem.starterCode || "");
      setMobileCode(selectedProblem.starterCode || "");
      setOutput(null);
      setError(null);
      setValidationStatus(null);
      setPerformanceRating(null);
      runCountRef.current = 0;
      setRunCountDisplay(0);
      resetTimer(selectedProblem?.difficulty || "Easy");
    }}
    onSkip={() => {
      // Save skipped to Supabase then move to next
      supabase.auth.getSession().then(({ data: sessionData }) => {
        if (sessionData?.session) {
          supabase.from("submissions").insert({
            user_id: sessionData.session.user.id,
            problem_id: selectedProblem.id,
            category: "python_basics",
            problem_title: selectedProblem.title,
            query: isMobile ? mobileCode : code,
            status: "skipped",
            run_count: runCountDisplay,
            is_best_attempt: false,
            time_taken_seconds: timeUsed,
            attempt_number: attemptNumber,
          });
        }
      });
      const currentIndex = PYTHON_PROBLEMS.findIndex(p => p.id === selectedProblem.id);
      const next = PYTHON_PROBLEMS[currentIndex + 1];
      if (next) handleSelectProblem(next);
    }}
    onClose={() => resetTimer(selectedProblem?.difficulty || "Easy")}
  />
)}
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
                <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>Your solution is now live.</div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "1.25rem" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>Share to Community</h3>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748b" }}>Your code and comment will appear in the community feed.</p>
                </div>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.625rem 0.875rem", marginBottom: "1rem", fontSize: "0.82rem", color: "#0f172a", fontWeight: 600 }}>
                  🐍 {selectedProblem.title}
                </div>
                <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontFamily: "monospace", fontSize: "0.8rem", color: "#334155", whiteSpace: "pre-wrap", maxHeight: "100px", overflowY: "auto", border: "1px solid #e2e8f0" }}>
                  {isMobile ? mobileCode : code}
                </div>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>
                    Add a comment (optional)
                  </label>
                  <textarea
                    value={modalComment}
                    onChange={(e) => setModalComment(e.target.value)}
                    placeholder="Share what you learned or a tip..."
                    rows={3}
                    style={{ width: "100%", padding: "0.625rem 0.75rem", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", outline: "none", resize: "none", color: "#0f172a", boxSizing: "border-box" }}
                    onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button onClick={() => setShowModal(false)} style={{ padding: "8px 18px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "#ffffff", color: "#64748b", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button onClick={submitPost} style={{ padding: "8px 22px", borderRadius: "8px", border: "none", background: "#7c3aed", color: "#ffffff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
                    Post →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Spinner keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

