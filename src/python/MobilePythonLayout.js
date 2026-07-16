import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TABS = ["Problems", "Editor", "Results"];

const validationConfig = {
  correct: { bg: "#f0fdf4", border: "#86efac", icon: "✓", iconBg: "#16a34a", title: "All tests passed!", msg: "Your solution is correct. Well done.", titleColor: "#15803d" },
  almost:  { bg: "#fffbeb", border: "#fcd34d", icon: "~", iconBg: "#d97706", title: "Partially correct", msg: "Some test cases passed. Check the failed ones.", titleColor: "#b45309" },
  wrong:   { bg: "#fef2f2", border: "#fca5a5", icon: "✗", iconBg: "#dc2626", title: "Not quite", msg: "None of the test cases passed. Check your logic.", titleColor: "#b91c1c" },
  error:   { bg: "#fef2f2", border: "#fca5a5", icon: "!", iconBg: "#dc2626", title: "Error", msg: "Your code threw an error. Check the results tab.", titleColor: "#b91c1c" },
};

export default function MobilePythonLayout({
  problems,
  selectedProblem,
  onSelectProblem,
  code,
  onCodeChange,
  onRun,
  onReset,
  pyodideReady,
  running,
  testResults,
  output,
  error,
  validationStatus,
  solvedIds,
  isGuest,
  pageTitle,
  totalProblems,
  runCountDisplay,
  milestones,
  expandedMilestone,
  setExpandedMilestone,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  // Auto switch to results when done
  useEffect(() => {
    if (testResults.length > 0 || error) setActiveTab(2);
  }, [testResults, error]);

  const handleSelectProblem = (p) => {
    onSelectProblem(p);
    setExpandedId(p.id);
    setActiveTab(1);
  };

  // ─── NAV ──────────────────────────────────────────────────────────────────
  const NavBar = () => (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "0.75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button onClick={() => navigate("/python")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem", color: "#64748b", padding: "0 4px", lineHeight: 1 }}>←</button>
        <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.3px", color: "#0f172a" }}>{pageTitle}</span>
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <div style={{ fontSize: "0.72rem", color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "3px 10px", fontWeight: 600 }}>
          ✓ {solvedIds.size}/{totalProblems}
        </div>
        <div style={{ fontSize: "0.68rem", color: pyodideReady ? "#16a34a" : "#d97706", background: pyodideReady ? "#f0fdf4" : "#fffbeb", border: `1px solid ${pyodideReady ? "#bbf7d0" : "#fde68a"}`, borderRadius: "20px", padding: "3px 8px", fontWeight: 600 }}>
          {pyodideReady ? "🐍 Ready" : "⏳ Loading"}
        </div>
      </div>
    </div>
  );

  // ─── TAB BAR ──────────────────────────────────────────────────────────────
  const TabBar = () => (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, background: "#ffffff", borderTop: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
      {TABS.map((tab, i) => (
        <button
          key={tab}
          onClick={() => setActiveTab(i)}
          style={{ padding: "0.75rem 0", border: "none", background: activeTab === i ? "#f0fdf4" : "#ffffff", color: activeTab === i ? "#16a34a" : "#94a3b8", fontWeight: activeTab === i ? 700 : 500, fontSize: "0.8rem", cursor: "pointer", borderTop: activeTab === i ? "2px solid #16a34a" : "2px solid transparent", fontFamily: "Inter, -apple-system, sans-serif" }}
        >
          {tab === "Results" && (testResults.length > 0 || error) ? (
            <span>
              {tab}{" "}
              <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: validationStatus === "correct" ? "#16a34a" : validationStatus === "almost" ? "#f59e0b" : "#ef4444", verticalAlign: "middle", marginLeft: "2px" }} />
            </span>
          ) : tab}
        </button>
      ))}
    </div>
  );

  // ─── PROBLEMS TAB ─────────────────────────────────────────────────────────
  const ProblemsTab = () => (
    <div style={{ paddingBottom: "1rem" }}>
      {milestones.map((milestone) => {
        const milestoneProblems = problems.filter(p => p.id >= milestone.range[0] && p.id <= milestone.range[1]);
        const solvedInMilestone = milestoneProblems.filter(p => solvedIds.has(p.id)).length;
        const totalInMilestone = milestoneProblems.length;
        const progressPct = Math.round((solvedInMilestone / totalInMilestone) * 100);
        const isEarned = solvedInMilestone >= totalInMilestone;
        const isOpen = expandedMilestone === milestone.id;

        return (
          <div key={milestone.id} style={{ margin: "0.5rem 0.75rem 0.75rem" }}>
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
              <span style={{ fontSize: "0.7rem", color: isOpen ? "#16a34a" : "#94a3b8", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</span>
            </div>

            {isOpen && (
              <div style={{ border: "1.5px solid #e2e8f0", borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
                {milestoneProblems.map((p) => {
                  const isSelected = selectedProblem.id === p.id;
                  const isExpanded = expandedId === p.id;
                  const isSolved = solvedIds.has(p.id);

                  return (
                    <div key={p.id} style={{ background: "#ffffff", borderBottom: "1px solid #f1f5f9" }}>
                      <div
                        onClick={() => { handleSelectProblem(p); setExpandedId(isExpanded ? null : p.id); }}
                        style={{ padding: "0.75rem 0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", background: isSelected ? "#f8fff8" : "transparent" }}
                      >
                        <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: isSolved ? "#16a34a" : isSelected ? "#f0fdf4" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 700, color: isSolved ? "#fff" : isSelected ? "#16a34a" : "#94a3b8", flexShrink: 0 }}>
                          {isSolved ? "✓" : p.id}
                        </div>
                        <span style={{ fontSize: "0.83rem", fontWeight: isSelected ? 700 : 500, color: "#334155", flex: 1, lineHeight: 1.35 }}>{p.title}</span>
                        <span style={{ fontSize: "0.68rem", padding: "2px 6px", borderRadius: "8px", background: p.difficulty === "Easy" ? "#f0fdf4" : p.difficulty === "Medium" ? "#fffbeb" : "#fef2f2", color: p.difficulty === "Easy" ? "#16a34a" : p.difficulty === "Medium" ? "#d97706" : "#dc2626", fontWeight: 600 }}>{p.difficulty}</span>
                        <span style={{ fontSize: "0.7rem", color: "#94a3b8", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</span>
                      </div>

                      {isExpanded && (
                        <div style={{ borderTop: "1px solid #f1f5f9", padding: "0.875rem", background: "#fafbfc" }}>
                          <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: "#0f172a", lineHeight: 1.6 }}>{p.description}</p>

                          {p.testCases && p.testCases.length > 0 && (
                            <div style={{ marginBottom: "0.75rem" }}>
                              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Test Cases</div>
                              {p.testCases.slice(0, 2).map((tc, i) => (
                                <div key={i} style={{ background: "#f1f5f9", borderRadius: "6px", padding: "5px 8px", marginBottom: "4px", fontSize: "0.74rem", fontFamily: "monospace" }}>
                                  <span style={{ color: "#64748b" }}>Input: </span>
                                  <span style={{ color: "#0f172a" }}>{tc.input}</span>
                                  <span style={{ color: "#64748b", marginLeft: "6px" }}>→ </span>
                                  <span style={{ color: "#16a34a", fontWeight: 600 }}>{tc.expected}</span>
                                </div>
                              ))}
                              {p.testCases.length > 2 && <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>+{p.testCases.length - 2} more</div>}
                            </div>
                          )}

                          {p.type === "output" && p.expectedOutput && (
                            <div style={{ marginBottom: "0.75rem" }}>
                              <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Expected Output</div>
                              <div style={{ background: "#f1f5f9", borderRadius: "6px", padding: "5px 8px", fontSize: "0.74rem", fontFamily: "monospace", color: "#16a34a", fontWeight: 600 }}>{p.expectedOutput}</div>
                            </div>
                          )}

                          {p.hint && (
                            <details>
                              <summary style={{ fontSize: "0.78rem", color: "#16a34a", fontWeight: 600, cursor: "pointer", listStyle: "none" }}>💡 Show hint</summary>
                              <div style={{ marginTop: "6px", padding: "0.5rem 0.625rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "6px", fontSize: "0.78rem", color: "#92400e", lineHeight: 1.6, fontFamily: "monospace" }}>{p.hint}</div>
                            </details>
                          )}

                          <button
                            onClick={() => handleSelectProblem(p)}
                            style={{ marginTop: "0.75rem", width: "100%", padding: "8px", borderRadius: "7px", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: "0.82rem", border: "none", cursor: "pointer" }}
                          >
                            Solve this →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      <div style={{ height: "1rem" }} />
    </div>
  );

  // ─── EDITOR TAB ───────────────────────────────────────────────────────────
  const EditorTab = () => (
    <div style={{ padding: "0.75rem" }}>
      {isGuest && selectedProblem.id > 10 ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ textAlign: "center", maxWidth: "320px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔒</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.5rem" }}>Sign in to continue</h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.7, marginBottom: "1.5rem" }}>Sign up free to access all Python problems.</p>
            <button onClick={() => navigate("/signup")} style={{ width: "100%", padding: "11px", borderRadius: "8px", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", marginBottom: "8px" }}>Sign Up Free →</button>
            <button onClick={() => navigate("/login")} style={{ width: "100%", padding: "11px", borderRadius: "8px", background: "#fff", color: "#16a34a", fontWeight: 600, fontSize: "0.88rem", border: "1.5px solid #bbf7d0", cursor: "pointer" }}>Already have an account?</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderLeft: "3px solid #16a34a", borderRadius: "0 8px 8px 0", padding: "0.625rem 0.875rem", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>#{selectedProblem.id} — Task</div>
            <p style={{ margin: 0, fontSize: "0.83rem", color: "#0f172a", lineHeight: 1.55 }}>{selectedProblem.description}</p>
          </div>

          <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "10px", overflow: "hidden", marginBottom: "0.75rem" }}>
            <div style={{ background: "#f8fafc", padding: "0.5rem 0.875rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.68rem", background: "#dcfce7", color: "#16a34a", padding: "2px 8px", borderRadius: "20px", fontWeight: 700 }}>Python</span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={onReset} style={{ fontSize: "0.72rem", color: "#64748b", background: "transparent", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "4px 8px", cursor: "pointer" }}>Reset</button>
                <button
                  onClick={onRun}
                  disabled={!pyodideReady || running}
                  style={{ padding: "5px 14px", borderRadius: "6px", background: pyodideReady && !running ? "#16a34a" : "#94a3b8", color: "#fff", fontWeight: 700, fontSize: "0.78rem", border: "none", cursor: pyodideReady && !running ? "pointer" : "not-allowed" }}
                >
                  {running ? "⏳" : pyodideReady ? "▶ Run" : "Loading..."}
                </button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              autoComplete="off"
              style={{ height: "320px", width: "100%", background: "#1e1e1e", color: "#d4d4d4", fontFamily: "monospace", fontSize: "14px", padding: "12px", border: "none", outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.6, display: "block" }}
            />
          </div>

          {runCountDisplay > 2 && validationStatus !== "correct" && (
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "0.625rem 0.875rem", fontSize: "0.78rem", color: "#92400e" }}>
              <strong>Stuck?</strong> Go back to Problems tab and expand the hint.
            </div>
          )}
        </>
      )}
      <div style={{ height: "1rem" }} />
    </div>
  );

  // ─── RESULTS TAB ──────────────────────────────────────────────────────────
  const ResultsTab = () => (
    <div style={{ padding: "0.75rem" }}>
      {validationStatus && (() => {
        const c = validationConfig[validationStatus];
        return (
          <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "0.75rem", marginBottom: "0.75rem", display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: c.iconBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0 }}>{c.icon}</div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: c.titleColor }}>{c.title}</div>
              <div style={{ fontSize: "0.76rem", color: "#475569", marginTop: "2px" }}>{c.msg}</div>
            </div>
          </div>
        );
      })()}

      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "0.875rem 1rem", marginBottom: "0.75rem" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#dc2626", marginBottom: "6px" }}>Error</div>
          <div style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#dc2626", lineHeight: 1.6 }}>
            {(() => {
              const lines = error.split("\n").filter(l => l.trim());
              const lastLine = lines[lines.length - 1] || error;
              const match = lastLine.match(/name '(.+)' is not defined/);
              if (match) return `'${match[1]}' is not defined — Python is case sensitive.`;
              return lastLine;
            })()}
          </div>
        </div>
      )}

      {output && testResults.length === 1 && testResults[0].input === "—" && (
        <div style={{ marginBottom: "0.75rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>Output</div>
          <div style={{ background: "#0f172a", borderRadius: "8px", padding: "0.75rem", fontFamily: "monospace", fontSize: "0.82rem", color: "#7dd3fc", whiteSpace: "pre-wrap", marginBottom: "6px" }}>{output}</div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: 600 }}>Expected:</span>
            <span style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#16a34a", fontWeight: 600 }}>{testResults[0].expected}</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: testResults[0].passed ? "#16a34a" : "#dc2626" }}>{testResults[0].passed ? "✓ Match" : "✗ No match"}</span>
          </div>
        </div>
      )}

      {testResults.length > 0 && !(testResults.length === 1 && testResults[0].input === "—") && (
        <div>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
            Test Cases — {testResults.filter(r => r.passed).length}/{testResults.length} passed
          </div>
          <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 40px", background: "#f8fafc", padding: "6px 10px", borderBottom: "1px solid #e2e8f0" }}>
              {["Input", "Expected", "Got", ""].map((h, i) => (
                <div key={i} style={{ fontSize: "0.62rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>{h}</div>
              ))}
            </div>
            {testResults.map((tc, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 40px", padding: "7px 10px", borderBottom: i < testResults.length - 1 ? "1px solid #f1f5f9" : "none", background: tc.passed ? "#f0fdf4" : "#fef2f2", alignItems: "center" }}>
                <div style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis" }}>{tc.input}</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "#16a34a", fontWeight: 600 }}>{tc.expected}</div>
                <div style={{ fontFamily: "monospace", fontSize: "0.72rem", color: tc.passed ? "#16a34a" : "#dc2626" }}>{tc.got}</div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: tc.passed ? "#16a34a" : "#dc2626", textAlign: "center" }}>{tc.passed ? "✓" : "✗"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => { onRun(); setActiveTab(2); }}
        disabled={!pyodideReady || running}
        style={{ marginTop: "0.75rem", width: "100%", padding: "10px", borderRadius: "8px", background: pyodideReady && !running ? "#16a34a" : "#94a3b8", color: "#fff", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: pyodideReady ? "pointer" : "not-allowed" }}
      >
        {running ? "⏳ Running..." : "▶ Run Again"}
      </button>
      <div style={{ height: "1rem" }} />
    </div>
  );

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a", paddingTop: "56px", paddingBottom: "56px", overflowY: "auto" }}>
      <NavBar />
      {activeTab === 0 && <ProblemsTab />}
      {activeTab === 1 && <EditorTab />}
      {activeTab === 2 && <ResultsTab />}
      <TabBar />
    </div>
  );
}