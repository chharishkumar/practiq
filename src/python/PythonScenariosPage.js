import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { PYTHON_SCENARIOS_PROBLEMS } from "./data/pythonScenariosProblems";
import Editor from "@monaco-editor/react";
import { useMobile } from "../hooks/useMobile";
import { usePyodide } from "./usePyodide";
import MobilePythonLayout from "./MobilePythonLayout";
import { usePageMeta } from "../hooks/usePageMeta";
import { useParams } from "react-router-dom";

// ─── DIFF STYLES ─────────────────────────────────────────────────────────────

const DIFF_STYLE = {
  Easy:   { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  Medium: { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  Hard:   { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

// ─── MILESTONES ──────────────────────────────────────────────────────────────

const MILESTONES = [
    { id: "bronze", label: "Scenario Starter",   icon: "🥉", color: "#CD7F32", bg: "#fdf3e7", border: "#e8c49a", range: [1, 25] },
    { id: "silver", label: "Scenario Builder",   icon: "🥈", color: "#9BA8B0", bg: "#f4f6f7", border: "#c8d0d4", range: [26, 50] },
    { id: "gold",   label: "Scenario Solver",    icon: "🥇", color: "#D4A017", bg: "#fffbeb", border: "#fde68a", range: [51, 75] },
    { id: "diamond", label: "Scenario Expert",   icon: "💎", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", range: [76, 100] },
  ];

// ─── PYODIDE HOOK ─────────────────────────────────────────────────────────────

// function usePyodide() {
//     const [pyodideReady, setPyodideReady] = useState(false);
//     const pyodideRef = useRef(null);
  
//     useEffect(() => {
//       const load = async () => {
//         try {
//           if (!window.loadPyodide) {
//             await new Promise((resolve, reject) => {
//               const script = document.createElement("script");
//               script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
//               script.async = true;
//               script.crossOrigin = "anonymous";
//               script.onload = resolve;
//               script.onerror = reject;
//               document.head.appendChild(script);
//             });
//           }
  
//           let attempts = 0;
//           while (!window.loadPyodide && attempts < 20) {
//             await new Promise(r => setTimeout(r, 200));
//             attempts++;
//           }
  
//           const pyodide = await window.loadPyodide({
//             indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
//           });
//           pyodideRef.current = pyodide;
//           setPyodideReady(true);
//         } catch (err) {
//           console.error("Pyodide failed:", err);
//         }
//       };
//       load();
//     }, []);
  
//     const runCode = useCallback(async (code, problem) => {
//       if (!pyodideRef.current) return { status: "error", output: "", error: "Python not loaded yet", testResults: [] };
//       const pyodide = pyodideRef.current;
  
//       // Strip leading whitespace artifact from template literals
//       const cleanCode = code
//         .split("\n")
//         .map(line => line.replace(/^\s{0,4}/, match => match.trimStart() === "" ? "" : match))
//         .join("\n")
//         .trim();
  
//       try {
//         await pyodide.runPythonAsync(`
//   import sys, io
//   sys.stdout = io.StringIO()
//   sys.stderr = io.StringIO()
//   `);
  
//         if (problem.type === "output") {
//           try {
//             await pyodide.runPythonAsync(cleanCode);
//           } catch (err) {
//             const stderr = await pyodide.runPythonAsync("sys.stderr.getvalue()");
//             await pyodide.runPythonAsync("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");
//             return { status: "error", output: "", error: err.message || stderr, testResults: [] };
//           }
  
//           const stdout = await pyodide.runPythonAsync("sys.stdout.getvalue()");
//           await pyodide.runPythonAsync("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");
  
//           const got = stdout.trim();
//           const expected = String(problem.expectedOutput).trim();
//           const passed = got === expected;
  
//           return {
//             status: passed ? "correct" : "wrong",
//             output: stdout,
//             error: "",
//             testResults: [{ input: "—", expected, got, passed }],
//           };
  
//         } else {
//           const testResults = [];
  
//           for (const tc of problem.testCases) {
//             try {
//               await pyodide.runPythonAsync(`
//   sys.stdout = io.StringIO()
//   sys.stderr = io.StringIO()
//   `);
//               const testCode = `${cleanCode}\n\n_result = str(${tc.call})`;
//               await pyodide.runPythonAsync(testCode);
//               const result = await pyodide.runPythonAsync("_result");
//               const got = result.trim();
//               const expected = String(tc.expected).trim();
//               const passed = got === expected;
//               testResults.push({ input: tc.input, expected, got, passed });
//             } catch (err) {
//               testResults.push({
//                 input: tc.input,
//                 expected: String(tc.expected),
//                 got: err.message?.split("\n").pop() || "Error",
//                 passed: false,
//                 error: true,
//               });
//             }
//           }
  
//           await pyodide.runPythonAsync("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");
  
//           const allPassed  = testResults.every(r => r.passed);
//           const somePassed = testResults.some(r => r.passed);
//           const status = allPassed ? "correct" : somePassed ? "almost" : "wrong";
  
//           return { status, output: "", error: "", testResults };
//         }
  
//       } catch (err) {
//         try { await pyodide.runPythonAsync("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__"); } catch (_) {}
//         return { status: "error", output: "", error: err.message, testResults: [] };
//       }
//     }, []);
  
//     return { pyodideReady, runCode };
//   } 

// ─── PROBLEM ROW ─────────────────────────────────────────────────────────────

function ProblemRow({ p, isSelected, isExpanded, isSolved, selectedItemRef, onSelect, nested }) {
  const ds = DIFF_STYLE[p.difficulty] || DIFF_STYLE.Easy;
  return (
    <div
      ref={isSelected ? selectedItemRef : null}
      style={{
        background: "#ffffff",
        border: nested ? "none" : "1.5px solid",
        borderColor: isSelected ? "#2563eb" : "#e2e8f0",
        borderBottom: nested ? "1px solid #f1f5f9" : undefined,
        borderRadius: nested ? 0 : "10px",
        overflow: "hidden",
        boxShadow: isSelected && !nested ? "0 0 0 3px rgba(37,99,235,0.08)" : "none",
      }}
    >
      <div
        onClick={onSelect}
        style={{ padding: "0.75rem 0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", background: isSelected ? "#f8faff" : "transparent" }}
      >
        <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: isSolved ? "#16a34a" : isSelected ? "#eff6ff" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 700, color: isSolved ? "#fff" : isSelected ? "#2563eb" : "#94a3b8", flexShrink: 0 }}>
          {isSolved ? "✓" : p.id}
        </div>
        <span style={{ fontSize: "0.83rem", fontWeight: isSelected ? 700 : 500, color: isSelected ? "#0f172a" : "#334155", flex: 1, lineHeight: 1.35 }}>
          {p.title}
        </span>
        <span style={{ fontSize: "0.62rem", padding: "2px 7px", borderRadius: "10px", background: ds.bg, color: ds.color, border: `1px solid ${ds.border}`, fontWeight: 600, whiteSpace: "nowrap" }}>
          {p.difficulty}
        </span>
        <span style={{ fontSize: "0.7rem", color: isExpanded ? "#2563eb" : "#94a3b8", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</span>
      </div>

      {isExpanded && (
        <div style={{ borderTop: "1px solid #f1f5f9", padding: "0.875rem", background: "#fafbfc" }}>
          {/* Description */}
          <div style={{ marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Task</div>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#0f172a", lineHeight: 1.6 }}>{p.description}</p>
          </div>

          {/* Test cases preview */}
          {p.testCases && p.testCases.length > 0 && (
            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Test Cases</div>
              {p.testCases.slice(0, 2).map((tc, i) => (
                <div key={i} style={{ background: "#f1f5f9", borderRadius: "6px", padding: "6px 8px", marginBottom: "4px", fontSize: "0.75rem", fontFamily: "monospace" }}>
                  <span style={{ color: "#64748b" }}>Input: </span>
                  <span style={{ color: "#0f172a" }}>{tc.input}</span>
                  <span style={{ color: "#64748b", marginLeft: "8px" }}>→ </span>
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>{tc.expected}</span>
                </div>
              ))}
              {p.testCases.length > 2 && (
                <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>+{p.testCases.length - 2} more test cases</div>
              )}
            </div>
          )}

          {/* Expected output for print problems */}
          {p.type === "output" && p.expectedOutput && (
            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Expected Output</div>
              <div style={{ background: "#f1f5f9", borderRadius: "6px", padding: "6px 8px", fontSize: "0.75rem", fontFamily: "monospace", color: "#16a34a", fontWeight: 600 }}>
                {p.expectedOutput}
              </div>
            </div>
          )}

          {/* Hint */}
          <details>
            <summary style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, cursor: "pointer", listStyle: "none" }}>💡 Show hint</summary>
            <div style={{ marginTop: "6px", padding: "0.5rem 0.625rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "6px", fontSize: "0.78rem", color: "#92400e", lineHeight: 1.6, fontFamily: "monospace" }}>
              {p.hint}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

// ─── VALIDATION BANNER ───────────────────────────────────────────────────────

function ValidationBanner({ status }) {
  if (!status) return null;

  const configs = {
    correct: { bg: "#f0fdf4", border: "#86efac", icon: "✓", iconColor: "#16a34a", title: "All tests passed!", msg: "Your solution is correct. Well done.", titleColor: "#15803d" },
    almost:  { bg: "#fffbeb", border: "#fcd34d", icon: "~", iconColor: "#d97706", title: "Partially correct", msg: "Some test cases passed. Check the failed ones below.", titleColor: "#b45309" },
    wrong:   { bg: "#fef2f2", border: "#fca5a5", icon: "✗", iconColor: "#dc2626", title: "Not quite", msg: "None of the test cases passed. Check your logic.", titleColor: "#b91c1c" },
    error:   { bg: "#fef2f2", border: "#fca5a5", icon: "!", iconColor: "#dc2626", title: "Error", msg: "Your code threw an error. Check the output below.", titleColor: "#b91c1c" },
  };

  const c = configs[status];
  if (!c) return null;

  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "0.875rem 1rem", marginBottom: "1rem", display: "flex", gap: "10px", alignItems: "flex-start" }}>
      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: c.iconColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
        {c.icon}
      </div>
      <div>
        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: c.titleColor }}>{c.title}</div>
        <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: "2px" }}>{c.msg}</div>
      </div>
    </div>
  );
}

// ─── TEST RESULTS TABLE ──────────────────────────────────────────────────────

function TestResultsTable({ testResults, output, error }) {
    if (error) {
        // Extract just the last meaningful line from the traceback
        const lines = error.split("\n").filter(l => l.trim());
        const lastLine = lines[lines.length - 1] || error;
        const isNameError = lastLine.includes("NameError");
        const isSyntaxError = lastLine.includes("SyntaxError") || lastLine.includes("IndentationError");
        const isTypeError = lastLine.includes("TypeError");
      
        let friendlyMsg = lastLine;
        if (isNameError) {
          const match = lastLine.match(/name '(.+)' is not defined/);
          if (match) friendlyMsg = `'${match[1]}' is not defined. Check spelling and capitalization — Python is case sensitive.`;
        }
        if (isSyntaxError) friendlyMsg = `Syntax error — ${lastLine}. Check your indentation and brackets.`;
        if (isTypeError) friendlyMsg = `Type error — ${lastLine}. Check the types of values you're passing.`;
      
        return (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "0.875rem 1rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#dc2626", marginBottom: "6px" }}>Error</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#dc2626", lineHeight: 1.6 }}>{friendlyMsg}</div>
            <details style={{ marginTop: "8px" }}>
              <summary style={{ fontSize: "0.72rem", color: "#94a3b8", cursor: "pointer" }}>Show full traceback</summary>
              <div style={{ marginTop: "6px", fontFamily: "monospace", fontSize: "0.75rem", color: "#94a3b8", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{error}</div>
            </details>
          </div>
        );
      }

  if (output && testResults.length === 1 && testResults[0].input === "—") {
    return (
      <div>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Output</div>
        <div style={{ background: "#0f172a", borderRadius: "8px", padding: "0.75rem 1rem", fontFamily: "monospace", fontSize: "0.82rem", color: "#7dd3fc", whiteSpace: "pre-wrap", marginBottom: "0.75rem" }}>
          {output || "(no output)"}
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Expected</div>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "6px", padding: "4px 10px", fontFamily: "monospace", fontSize: "0.8rem", color: "#16a34a", fontWeight: 600 }}>
            {testResults[0].expected}
          </div>
          {testResults[0].passed ? (
            <span style={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: 700 }}>✓ Match</span>
          ) : (
            <span style={{ fontSize: "0.78rem", color: "#dc2626", fontWeight: 700 }}>✗ No match</span>
          )}
        </div>
      </div>
    );
  }

  if (testResults.length === 0) return null;

  return (
    <div>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
        Test Cases — {testResults.filter(r => r.passed).length}/{testResults.length} passed
      </div>
      <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 60px", background: "#f8fafc", padding: "6px 12px", borderBottom: "1px solid #e2e8f0" }}>
          {["Input", "Expected", "Got", ""].map((h, i) => (
            <div key={i} style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</div>
          ))}
        </div>
        {/* Rows */}
        {testResults.map((tc, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 60px",
              padding: "8px 12px",
              borderBottom: i < testResults.length - 1 ? "1px solid #f1f5f9" : "none",
              background: tc.passed ? "#f0fdf4" : "#fef2f2",
              alignItems: "center",
            }}
          >
            <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#0f172a" }}>{tc.input}</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#16a34a", fontWeight: 600 }}>{tc.expected}</div>
            <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: tc.passed ? "#16a34a" : "#dc2626", fontWeight: tc.passed ? 600 : 400 }}>{tc.got}</div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: tc.passed ? "#16a34a" : "#dc2626", textAlign: "center" }}>
              {tc.passed ? "✓" : "✗"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function PythonBasicsPage() {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const selectedItemRef = useRef(null);
  const editorRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const runCountRef = useRef(0);

  const { pyodideReady, runCode } = usePyodide();

  const [selectedProblem, setSelectedProblem] = useState(PYTHON_SCENARIOS_PROBLEMS[0]);
  const [code, setCode] = useState(PYTHON_SCENARIOS_PROBLEMS[0].starterCode);
  const [validationStatus, setValidationStatus] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [runCountDisplay, setRunCountDisplay] = useState(0);
  const [solvedIds, setSolvedIds] = useState(new Set());
  const [isGuest, setIsGuest] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedMilestone, setExpandedMilestone] = useState("bronze");

  const { problemSlug } = useParams();

usePageMeta({
  title: selectedProblem
    ? `${selectedProblem.seoTitle} | Repractiq`
    : "Python Basics Practice | Repractiq",
  description: selectedProblem
    ? selectedProblem.metaDescription
    : "Practice Python Scenarios with real coding problems. Covers functions, loops, strings, lists and more.",
  canonical: selectedProblem
    ? `https://www.repractiq.com/python/scenarios/${selectedProblem.id}-${selectedProblem.slug}`
    : "https://www.repractiq.com/python/scenarios",
});

  // Auth check + load solved
  useEffect(() => {
    const init = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) { setIsGuest(true); return; }
      const userId = sessionData.session.user.id;

      const { data } = await supabase
        .from("submissions")
        .select("problem_id")
        .eq("user_id", userId)
        .eq("category", "python_scenarios")
        .eq("status", "correct");

      if (data) setSolvedIds(new Set(data.map(r => r.problem_id)));
    };
    init();
  }, []);

  useEffect(() => {
    const idFromUrl = Number((problemSlug || "").split("-")[0]);
    if (!isNaN(idFromUrl) && idFromUrl > 0) {
      const target = PYTHON_SCENARIOS_PROBLEMS.find(p => p.id === idFromUrl);
      if (target) {
        setSelectedProblem(target);
        setCode(target.starterCode);
        setExpandedId(target.id);
        const milestone = MILESTONES.find(m => target.id >= m.range[0] && target.id <= m.range[1]);
        if (milestone) setExpandedMilestone(milestone.id);
      }
    }
  }, [problemSlug]);
  
  // Auto scroll to selected problem
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedProblem]);

  const handleSelectProblem = useCallback((p) => {
    startTimeRef.current = Date.now();
    runCountRef.current = 0;
    setRunCountDisplay(0);
    setSelectedProblem(p);
    setCode(p.starterCode);
    setValidationStatus(null);
    setTestResults([]);
    setOutput("");
    setError("");
    navigate(`/python/scenarios/${p.id}-${p.slug}`);
  }, [navigate]);

  const handleRun = useCallback(async () => {
    if (!pyodideReady || running) return;
    setRunning(true);
    setError("");
    setOutput("");
    setTestResults([]);
    setValidationStatus(null);

    runCountRef.current += 1;
    setRunCountDisplay(runCountRef.current);

    const result = await runCode(code, selectedProblem);

    setValidationStatus(result.status);
    setTestResults(result.testResults);
    setOutput(result.output);
    setError(result.error);

    // Save to Supabase
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session) {
      const userId = sessionData.session.user.id;

      if (result.status === "correct") {
        setSolvedIds(prev => new Set([...prev, selectedProblem.id]));
      }

      const { data: existing } = await supabase
        .from("submissions")
        .select("id, status")
        .eq("user_id", userId)
        .eq("problem_id", selectedProblem.id)
        .eq("category", "python_scenarios")
        .maybeSingle();

      const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);

      if (existing) {
        if (existing.status !== "correct") {
          await supabase.from("submissions").update({
            status: result.status,
            run_count: runCountRef.current,
            is_best_attempt: result.status === "correct",
            time_taken_seconds: timeTaken,
            updated_at: new Date().toISOString(),
          }).eq("id", existing.id);
        }
      } else {
        await supabase.from("submissions").insert({
          user_id: userId,
          problem_id: selectedProblem.id,
          category: "python_scenarios",
          problem_title: selectedProblem.title,
          status: result.status,
          run_count: runCountRef.current,
          is_best_attempt: result.status === "correct",
          time_taken_seconds: timeTaken,
        });
      }
    }

    setRunning(false);
  }, [pyodideReady, running, runCode, code, selectedProblem]);

  // Ctrl+Enter shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleRun();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun]);

  const ds = DIFF_STYLE[selectedProblem.difficulty] || DIFF_STYLE.Easy;

  if (isMobile) {
    return (
      <MobilePythonLayout
        problems={PYTHON_SCENARIOS_PROBLEMS}
        selectedProblem={selectedProblem}
        onSelectProblem={handleSelectProblem}
        code={code}
        onCodeChange={setCode}
        onRun={handleRun}
        onReset={() => { setCode(selectedProblem.starterCode); setValidationStatus(null); setTestResults([]); setOutput(""); setError(""); }}
        pyodideReady={pyodideReady}
        running={running}
        testResults={testResults}
        output={output}
        error={error}
        validationStatus={validationStatus}
        solvedIds={solvedIds}
        isGuest={isGuest}
        pageTitle="Python Scenarios"
        totalProblems={PYTHON_SCENARIOS_PROBLEMS.length}
        runCountDisplay={runCountDisplay}
        milestones={MILESTONES}
        expandedMilestone={expandedMilestone}
        setExpandedMilestone={setExpandedMilestone}
      />
    );
  }
  return (
    <div style={{ background: "#ffffff", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a", overflow: "hidden" }}>

      {/* NAV */}
      <nav style={{ padding: "0.85rem 2rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.97)", flexShrink: 0 }}>
        <span onClick={() => navigate("/")} style={{ fontWeight: 800, cursor: "pointer", fontSize: "1.1rem", letterSpacing: "-0.3px" }}>Repractiq</span>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span onClick={() => navigate("/home")} style={{ cursor: "pointer", color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}>Home</span>
          <span onClick={() => navigate("/profile")} style={{ cursor: "pointer", color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}>Profile</span>
          <div style={{ fontSize: "0.78rem", color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "4px 12px", fontWeight: 600 }}>
            ✓ {solvedIds.size} / {PYTHON_SCENARIOS_PROBLEMS.length} solved
          </div>
          {/* Pyodide status */}
          <div style={{ fontSize: "0.72rem", color: pyodideReady ? "#16a34a" : "#d97706", background: pyodideReady ? "#f0fdf4" : "#fffbeb", border: `1px solid ${pyodideReady ? "#bbf7d0" : "#fde68a"}`, borderRadius: "20px", padding: "4px 10px", fontWeight: 600 }}>
            {pyodideReady ? "🐍 Python ready" : "⏳ Loading Python..."}
          </div>
          <span onClick={() => navigate("/python")} style={{ cursor: "pointer", color: "#2563eb", fontSize: "0.85rem", fontWeight: 600 }}>← Back to Python</span>
        </div>
      </nav>

      {/* PAGE TITLE */}
      <div style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)", borderBottom: "1px solid #e2e8f0", padding: "0.875rem 2rem", display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
        <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.3px", color: "#0f172a" }}>Python Scenarios</h2>
        <span style={{ fontSize: "0.72rem", color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "3px 10px", fontWeight: 600 }}>🐍 Pure Python</span>
      </div>

      {/* MAIN SPLIT */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* LEFT PANEL */}
        <div style={{ width: "340px", minWidth: "300px", borderRight: "1px solid #e2e8f0", overflowY: "auto", background: "#f8fafc", flexShrink: 0 }}>
          <div style={{ padding: "1rem 1rem 0.5rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Questions</span>
          </div>

          {MILESTONES.map((milestone) => {
            const milestoneProblems = PYTHON_SCENARIOS_PROBLEMS.filter(p => p.id >= milestone.range[0] && p.id <= milestone.range[1]);
            const solvedInMilestone = milestoneProblems.filter(p => solvedIds.has(p.id)).length;
            const totalInMilestone = milestoneProblems.length;
            const progressPct = Math.round((solvedInMilestone / totalInMilestone) * 100);
            const isEarned = solvedInMilestone >= totalInMilestone;
            const isOpen = expandedMilestone === milestone.id;

            return (
              <div key={milestone.id} style={{ margin: "0 0.75rem 0.75rem" }}>
                <div
                  onClick={() => setExpandedMilestone(isOpen ? null : milestone.id)}
                  style={{ background: isEarned ? milestone.bg : "#f8fafc", border: `1.5px solid ${isEarned ? milestone.border : "#e2e8f0"}`, borderRadius: isOpen ? "10px 10px 0 0" : "10px", padding: "0.75rem 0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ fontSize: "1.25rem" }}>{milestone.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: isEarned ? milestone.color : "#0f172a" }}>{milestone.label}</div>
                    <div style={{ fontSize: "0.65rem", color: "#94a3b8", marginTop: "2px" }}>Problems {milestone.range[0]}–{milestone.range[1]}</div>
                    <div style={{ marginTop: "6px", height: "3px", background: "#e2e8f0", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: `${progressPct}%`, height: "100%", background: isEarned ? milestone.color : "#16a34a", borderRadius: "2px" }} />
                    </div>
                    <div style={{ fontSize: "0.62rem", color: "#94a3b8", marginTop: "3px" }}>{solvedInMilestone}/{totalInMilestone} solved</div>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: isOpen ? "#2563eb" : "#94a3b8", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</span>
                </div>

                {isOpen && (
                  <div style={{ border: "1.5px solid #e2e8f0", borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
                    {milestoneProblems.map((p) => (
                      <ProblemRow
                        key={p.id}
                        p={p}
                        isSelected={selectedProblem.id === p.id}
                        isExpanded={expandedId === p.id}
                        isSolved={solvedIds.has(p.id)}
                        selectedItemRef={selectedItemRef}
                        onSelect={() => {
                          handleSelectProblem(p);
                          setExpandedId(prev => prev === p.id ? null : p.id);
                        }}
                        nested
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ height: "1.5rem" }} />
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Guest lock */}
          {selectedProblem.id > 10 && isGuest ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
              <div style={{ textAlign: "center", maxWidth: "360px" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔒</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 0.5rem" }}>Sign in to continue</h3>
                <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.7, marginBottom: "1.5rem" }}>Sign up free to access all Python problems and save your progress.</p>
                <button onClick={() => navigate("/signup")} style={{ width: "100%", padding: "11px", borderRadius: "8px", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", marginBottom: "8px" }}>Sign Up Free →</button>
                <button onClick={() => navigate("/login")} style={{ width: "100%", padding: "11px", borderRadius: "8px", background: "#fff", color: "#16a34a", fontWeight: 600, fontSize: "0.88rem", border: "1.5px solid #bbf7d0", cursor: "pointer" }}>Already have an account? Sign in</button>
              </div>
            </div>
          ) : (
            <>
              {/* Problem header */}
              <div style={{ padding: "1.25rem 1.75rem 1rem", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: "10px", background: ds.bg, color: ds.color, border: `1px solid ${ds.border}`, fontWeight: 600 }}>{selectedProblem.difficulty}</span>
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>#{selectedProblem.id}</span>
                  <span style={{ fontSize: "0.7rem", color: "#64748b", background: "#f1f5f9", padding: "3px 8px", borderRadius: "10px", fontWeight: 600 }}>
                    {selectedProblem.type === "output" ? "Print output" : "Function"}
                  </span>
                  {solvedIds.has(selectedProblem.id) && (
                    <span style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: "10px", background: "#f0fdf4", color: "#16a34a", fontWeight: 600 }}>✓ Solved</span>
                  )}
                </div>
                <h1 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.3px" }}>{selectedProblem.title}</h1>
                <div style={{ marginTop: "0.875rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderLeft: "3px solid #16a34a", borderRadius: "0 8px 8px 0", padding: "0.625rem 0.875rem" }}>
                  <span style={{ fontSize: "0.67rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "3px" }}>Task</span>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "#0f172a", lineHeight: 1.6 }}>{selectedProblem.description}</p>
                </div>
              </div>

              {/* Editor + Results */}
              <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.75rem", scrollbarWidth: "none", msOverflowStyle: "none" }}>
                <ValidationBanner status={validationStatus} />

                {/* Editor */}
                <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", marginBottom: "1rem" }}>
                  <div style={{ background: "#f8fafc", padding: "0.625rem 1rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ fontSize: "0.7rem", background: "#dcfce7", color: "#16a34a", padding: "3px 9px", borderRadius: "20px", fontWeight: 700 }}>Python</span>
                      <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Ctrl+Enter to run</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => { setCode(selectedProblem.starterCode); setValidationStatus(null); setTestResults([]); setOutput(""); setError(""); }}
                        style={{ fontSize: "0.75rem", color: "#64748b", background: "transparent", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }}
                      >
                        Reset
                      </button>
                      <button
                        onClick={handleRun}
                        disabled={!pyodideReady || running}
                        style={{ padding: "6px 18px", borderRadius: "6px", background: pyodideReady && !running ? "#16a34a" : "#94a3b8", color: "#fff", fontWeight: 700, fontSize: "0.8rem", border: "none", cursor: pyodideReady && !running ? "pointer" : "not-allowed" }}
                      >
                        {running ? "⏳ Running..." : pyodideReady ? "▶ Run" : "Loading..."}
                      </button>
                    </div>
                  </div>
                  <Editor
                    height="320px"
                    language="python"
                    value={code}
                    onChange={(v) => setCode(v || "")}
                    theme="vs-dark"
                    options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: "on", scrollBeyondLastLine: false, padding: { top: 10, bottom: 10 }, lineNumbers: "on", automaticLayout: true, scrollbar: { vertical: "hidden", horizontal: "hidden" }, overviewRulerLanes: 0 }}
                    onMount={(editor) => {
                      editorRef.current = editor;
                    }}
                  />
                </div>

                {/* Test results */}
                <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ background: "#f8fafc", padding: "0.625rem 1rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Test Results</span>
                    {testResults.length > 0 && (
                      <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                        {testResults.filter(r => r.passed).length}/{testResults.length} passed
                      </span>
                    )}
                  </div>
                  <div style={{ minHeight: "120px", padding: "0.875rem 1rem", background: "#ffffff" }}>
                    {testResults.length === 0 && !error && (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "80px", color: "#94a3b8", fontSize: "0.82rem" }}>
                        Run your code to see test results
                      </div>
                    )}
                    <TestResultsTable testResults={testResults} output={output} error={error} />
                  </div>
                </div>

                {runCountDisplay > 2 && validationStatus !== "correct" && (
                  <div style={{ marginTop: "1rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.8rem", color: "#92400e" }}>
                    <strong>Stuck?</strong> Click the problem on the left and expand the hint section.
                  </div>
                )}

                <div style={{ height: "2rem" }} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}