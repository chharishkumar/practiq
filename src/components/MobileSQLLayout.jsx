import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useNavigate } from "react-router-dom";

/**
 * MobileSQLLayout
 *
 * Props:
 *  - problems         : array of problem objects
 *  - selectedProblem  : currently selected problem object
 *  - onSelectProblem  : fn(problem) — called when user taps a problem
 *  - query            : string — current SQL in editor
 *  - onQueryChange    : fn(value) — called on editor change
 *  - onRun            : fn() — called when Run is tapped
 *  - onReset          : fn() — resets editor to starter query
 *  - dbReady          : bool
 *  - results          : { columns, values } | null
 *  - error            : string | null
 *  - validationStatus : "correct" | "almost" | "wrong" | null
 *  - solvedIds        : Set of solved problem ids
 *  - isGuest          : bool
 *  - isPro            : bool
 *  - paywallThreshold : number — problem id above which paywall kicks in for logged-in non-pro users
 *  - guestThreshold   : number — problem id above which guest wall kicks in
 *  - onNavigateSignup : fn() — navigate to signup
 *  - onNavigateLogin  : fn() — navigate to login
 *  - onNavigatePricing: fn() — navigate to pricing
 *  - pageTitle        : string e.g. "SQL Advanced"
 *  - totalProblems    : number
 *  - runCountDisplay  : number
 *  - onPostCommunity  : fn()
 *  - elapsed          : number | null — seconds taken
 */

const TABS = ["Problems", "Editor", "Output"];

const validationConfig = {
  correct: {
    bg: "#f0fdf4", border: "#86efac", icon: "✓", iconBg: "#16a34a",
    title: "Correct!", msg: "Your output matches the expected result.",
    titleColor: "#15803d",
  },
  almost: {
    bg: "#fffbeb", border: "#fcd34d", icon: "~", iconBg: "#d97706",
    title: "Almost there", msg: "Structure looks right but values don't match. Check your filters.",
    titleColor: "#b45309",
  },
  wrong: {
    bg: "#fef2f2", border: "#fca5a5", icon: "✗", iconBg: "#dc2626",
    title: "Not quite", msg: "Result doesn't match. Check columns and re-read the task.",
    titleColor: "#b91c1c",
  },
};

export default function MobileSQLLayout({
  problems,
  selectedProblem,
  onSelectProblem,
  query,
  onQueryChange,
  onRun,
  onReset,
  dbReady,
  results,
  error,
  validationStatus,
  solvedIds,
  isGuest,
  isPro,
  paywallThreshold,
  guestThreshold,
  onNavigateSignup,
  onNavigateLogin,
  onNavigatePricing,
  pageTitle,
  totalProblems,
  runCountDisplay,
  onPostCommunity,
}) {
  const [activeTab, setActiveTab] = useState(0); // 0=Problems, 1=Editor, 2=Output
  const [expandedId, setExpandedId] = useState(null);
  const editorRef = useRef(null);
  const navigate = useNavigate();

  // Auto-switch to Output tab when results arrive
  useEffect(() => {
    if (results || error) setActiveTab(2);
  }, [results, error]);

  const handleSelectProblem = (p) => {
    onSelectProblem(p);
    setExpandedId(p.id);
    setActiveTab(1); // jump to editor
  };

  const handleRun = () => {
    onRun();
    // output tab switch happens via useEffect above
  };

  const isGuestLocked = isGuest && selectedProblem.id > (guestThreshold ?? 10);
  const isProLocked   = !isGuest && !isPro && selectedProblem.id > (paywallThreshold ?? 30);


  // ─── NAV BAR ────────────────────────────────────────────────────────────────
  const NavBar = () => (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: "#ffffff", borderBottom: "1px solid #e2e8f0",
      padding: "0.75rem 1rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
<button
  onClick={() => navigate("/sql")}
  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.5rem", color: "#64748b", padding: "0 4px", lineHeight: 1 }}
>
  ←
</button>
<span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.3px", color: "#0f172a" }}>
  {pageTitle}
</span>
</div>
      <div style={{
        fontSize: "0.72rem", color: "#16a34a", background: "#f0fdf4",
        border: "1px solid #bbf7d0", borderRadius: "20px", padding: "3px 10px", fontWeight: 600,
      }}>
        ✓ {solvedIds.size}/{totalProblems}
      </div>
    </div>
  );

  // ─── TAB BAR ────────────────────────────────────────────────────────────────
  const TabBar = () => (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
      background: "#ffffff", borderTop: "1px solid #e2e8f0",
      display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
    }}>
      {TABS.map((tab, i) => (
        <button
          key={tab}
          onClick={() => setActiveTab(i)}
          style={{
            padding: "0.75rem 0",
            border: "none",
            background: activeTab === i ? "#eff6ff" : "#ffffff",
            color: activeTab === i ? "#2563eb" : "#94a3b8",
            fontWeight: activeTab === i ? 700 : 500,
            fontSize: "0.8rem",
            cursor: "pointer",
            borderTop: activeTab === i ? "2px solid #2563eb" : "2px solid transparent",
            transition: "all 0.15s",
            fontFamily: "Inter, -apple-system, sans-serif",
          }}
        >
          {tab === "Output" && (results || error) ? (
            <span>
              {tab}{" "}
              <span style={{
                display: "inline-block", width: "6px", height: "6px",
                borderRadius: "50%",
                background: validationStatus === "correct" ? "#16a34a" : validationStatus === "wrong" ? "#ef4444" : "#f59e0b",
                verticalAlign: "middle", marginLeft: "2px",
              }} />
            </span>
          ) : tab}
        </button>
      ))}
    </div>
  );

  // ─── PROBLEMS TAB ───────────────────────────────────────────────────────────
  const ProblemsTab = () => (
    <div style={{ paddingBottom: "1rem" }}>
      {problems.map((p) => {
        const isSelected = selectedProblem.id === p.id;
        const isExpanded = expandedId === p.id;
        const isSolved   = solvedIds.has(p.id);
        const locked     = (isGuest && p.id > (guestThreshold ?? 10)) ||
                           (!isGuest && !isPro && p.id > (paywallThreshold ?? 30));

        return (
          <div
            key={p.id}
            style={{
              margin: "0.5rem 0.75rem",
              background: "#ffffff",
              border: `1.5px solid ${isSelected ? "#2563eb" : "#e2e8f0"}`,
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: isSelected ? "0 0 0 3px rgba(37,99,235,0.08)" : "none",
            }}
          >
            <div
              onClick={() => {
                if (locked) {
                  handleSelectProblem(p); // will show lock screen in editor tab
                } else {
                  handleSelectProblem(p);
                }
                setExpandedId(isExpanded ? null : p.id);
              }}
              style={{
                padding: "0.75rem 0.875rem",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              <div style={{
                width: "22px", height: "22px", borderRadius: "50%",
                background: isSolved ? "#16a34a" : isSelected ? "#eff6ff" : "#f1f5f9",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.62rem", fontWeight: 700,
                color: isSolved ? "#fff" : isSelected ? "#2563eb" : "#94a3b8",
                flexShrink: 0,
              }}>
                {isSolved ? "✓" : locked ? "🔒" : p.id}
              </div>
              <span style={{
                fontSize: "0.83rem", fontWeight: isSelected ? 700 : 500,
                color: isSelected ? "#0f172a" : "#334155", flex: 1, lineHeight: 1.35,
              }}>
                {p.title}
              </span>
              <span style={{
                fontSize: "0.7rem", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s", color: "#94a3b8",
              }}>▾</span>
            </div>

            {isExpanded && (
              <div style={{ borderTop: "1px solid #f1f5f9", padding: "0.875rem", background: "#fafbfc" }}>
                <p style={{ margin: "0 0 0.75rem", fontSize: "0.82rem", color: "#0f172a", lineHeight: 1.6 }}>
                  {p.description}
                </p>
                {p.explanation && (
                  <p style={{ margin: "0 0 0.75rem", fontSize: "0.78rem", color: "#475569", lineHeight: 1.65 }}>
                    {p.explanation}
                  </p>
                )}
                {p.hint && (
                  <details>
                    <summary style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, cursor: "pointer", listStyle: "none" }}>
                      💡 Show hint
                    </summary>
                    <div style={{
                      marginTop: "6px", padding: "0.5rem 0.625rem",
                      background: "#fffbeb", border: "1px solid #fde68a",
                      borderRadius: "6px", fontSize: "0.78rem", color: "#92400e",
                      lineHeight: 1.6, fontFamily: "monospace",
                    }}>
                      {p.hint}
                    </div>
                  </details>
                )}
                {!locked && (
                  <button
                    onClick={() => handleSelectProblem(p)}
                    style={{
                      marginTop: "0.75rem", width: "100%", padding: "8px",
                      borderRadius: "7px", background: "#2563eb", color: "#fff",
                      fontWeight: 700, fontSize: "0.82rem", border: "none", cursor: "pointer",
                    }}
                  >
                    Solve this →
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      <div style={{ height: "1rem" }} />
    </div>
  );

  // ─── VALIDATION BANNER ──────────────────────────────────────────────────────
  const ValidationBanner = () => {
    if (!validationStatus) return null;
    const c = validationConfig[validationStatus];
    return (
      <div style={{
        background: c.bg, border: `1px solid ${c.border}`,
        borderRadius: "10px", padding: "0.75rem", marginBottom: "0.75rem",
        display: "flex", gap: "10px", alignItems: "flex-start",
      }}>
        <div style={{
          width: "22px", height: "22px", borderRadius: "50%",
          background: c.iconBg, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.7rem", fontWeight: 700, flexShrink: 0,
        }}>
          {c.icon}
        </div>
        <div>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: c.titleColor }}>{c.title}</div>
          <div style={{ fontSize: "0.76rem", color: "#475569", marginTop: "2px" }}>{c.msg}</div>
          {validationStatus === "correct" && onPostCommunity && (
            <button
              onClick={onPostCommunity}
              style={{
                marginTop: "0.5rem", fontSize: "0.76rem", color: "#2563eb",
                background: "#eff6ff", border: "1px solid #bfdbfe",
                borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontWeight: 600,
              }}
            >
              🎉 Share to Community
            </button>
          )}
        </div>
      </div>
    );
  };

  // ─── EDITOR TAB ─────────────────────────────────────────────────────────────
  const EditorTab = () => {
    if (isGuestLocked) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "2rem" }}>
          <div style={{ textAlign: "center", maxWidth: "320px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔒</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem" }}>
              Sign in to unlock
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              You've explored the first {guestThreshold ?? 10} problems. Sign up free to continue.
            </p>
            <button
              onClick={onNavigateSignup}
              style={{ width: "100%", padding: "11px", borderRadius: "8px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer", marginBottom: "8px" }}
            >
              Sign Up Free →
            </button>
            <button
              onClick={onNavigateLogin}
              style={{ width: "100%", padding: "11px", borderRadius: "8px", background: "#ffffff", color: "#2563eb", fontWeight: 600, fontSize: "0.88rem", border: "1.5px solid #bfdbfe", cursor: "pointer" }}
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      );
    }

    if (isProLocked) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "2rem" }}>
          <div style={{ textAlign: "center", maxWidth: "320px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔒</div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem" }}>
              Pro problem
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              Upgrade to Pro to unlock all {totalProblems} problems.
            </p>
            <button
              onClick={onNavigatePricing}
              style={{ width: "100%", padding: "11px", borderRadius: "8px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer" }}
            >
              View Pro Plans →
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ padding: "0.75rem" }}>
        {/* Problem title */}
        <div style={{
          background: "#f8fafc", border: "1px solid #e2e8f0",
          borderLeft: "3px solid #2563eb", borderRadius: "0 8px 8px 0",
          padding: "0.625rem 0.875rem", marginBottom: "0.75rem",
        }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>
            #{selectedProblem.id} — Task
          </div>
          <p style={{ margin: 0, fontSize: "0.83rem", color: "#0f172a", lineHeight: 1.55 }}>
            {selectedProblem.description}
          </p>
        </div>

        <ValidationBanner />

        {/* Editor */}
        <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "10px", overflow: "hidden", marginBottom: "0.75rem" }}>
          <div style={{
            background: "#f8fafc", padding: "0.5rem 0.875rem",
            borderBottom: "1px solid #e2e8f0",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: "0.68rem", background: "#e2e8f0", color: "#0f172a", padding: "2px 8px", borderRadius: "20px", fontWeight: 700 }}>SQL</span>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={onReset}
                style={{ fontSize: "0.72rem", color: "#64748b", background: "transparent", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "4px 8px", cursor: "pointer" }}
              >
                Reset
              </button>
              <button
                onClick={handleRun}
                disabled={!dbReady}
                style={{
                  padding: "5px 14px", borderRadius: "6px",
                  background: dbReady ? "#2563eb" : "#94a3b8",
                  color: "#fff", fontWeight: 700, fontSize: "0.78rem",
                  border: "none", cursor: dbReady ? "pointer" : "not-allowed",
                }}
              >
                {dbReady ? "▶ Run" : "Loading…"}
              </button>
            </div>
          </div>
          <Editor
            height="320px"
            language="sql"
            value={query}
            onChange={(val) => onQueryChange(val || "")}
            theme="vs-dark"
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              wordWrap: "on",
              scrollBeyondLastLine: false,
              padding: { top: 8, bottom: 8 },
              lineNumbers: "on",
            }}
            onMount={(editor) => {
              editorRef.current = editor;
              editor.addCommand(
                window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.Enter,
                handleRun
              );
            }}
          />
        </div>

        {runCountDisplay > 2 && validationStatus !== "correct" && (
          <div style={{
            background: "#fffbeb", border: "1px solid #fde68a",
            borderRadius: "8px", padding: "0.625rem 0.875rem",
            fontSize: "0.78rem", color: "#92400e",
          }}>
            <strong>Stuck?</strong> Go back to Problems tab and expand the hint.
          </div>
        )}
        <div style={{ height: "1rem" }} />
      </div>
    );
  };

  // ─── OUTPUT TAB ─────────────────────────────────────────────────────────────
  const OutputTab = () => (
    <div style={{ padding: "0.75rem" }}>
      <ValidationBanner />

      <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{
          background: "#f8fafc", padding: "0.5rem 0.875rem",
          borderBottom: "1px solid #e2e8f0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Output
          </span>
          {results && (
            <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
              {results.values.length} row{results.values.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div style={{ minHeight: "120px", padding: "0.875rem", background: "#ffffff" }}>
          {!results && !error && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100px", color: "#94a3b8", fontSize: "0.82rem" }}>
              Run your query to see results
            </div>
          )}
          {error && (
            <div style={{
              color: "#ef4444", fontSize: "0.8rem", fontFamily: "monospace",
              lineHeight: 1.6, background: "#fef2f2", border: "1px solid #fca5a5",
              borderRadius: "8px", padding: "0.75rem",
            }}>
              {error}
            </div>
          )}
          {results && (
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ borderCollapse: "collapse", fontSize: "0.78rem", width: "100%" }}>
                <thead>
                  <tr>
                    {results.columns.map((col) => (
                      <th key={col} style={{
                        textAlign: "left", padding: "6px 10px",
                        color: "#64748b", fontWeight: 600,
                        borderBottom: "2px solid #e2e8f0",
                        whiteSpace: "nowrap", fontSize: "0.72rem",
                        textTransform: "uppercase", letterSpacing: "0.03em",
                      }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.values.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{
                          padding: "6px 10px", color: "#0f172a",
                          borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap",
                        }}>
                          {cell}
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

      {/* Re-run button from output tab */}
      <button
        onClick={() => { handleRun(); }}
        disabled={!dbReady}
        style={{
          marginTop: "0.75rem", width: "100%", padding: "10px",
          borderRadius: "8px", background: dbReady ? "#2563eb" : "#94a3b8",
          color: "#fff", fontWeight: 700, fontSize: "0.85rem",
          border: "none", cursor: dbReady ? "pointer" : "not-allowed",
        }}
      >
        {dbReady ? "▶ Run Again" : "Loading…"}
      </button>
      <div style={{ height: "1rem" }} />
    </div>
  );

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      background: "#ffffff",
      minHeight: "100vh",
      fontFamily: "Inter, -apple-system, sans-serif",
      color: "#0f172a",
      paddingTop: "56px",   // below fixed nav
      paddingBottom: "56px", // above fixed tab bar
      overflowY: "auto",
    }}>
      <NavBar />

      {activeTab === 0 && <ProblemsTab />}
      {activeTab === 1 && <EditorTab />}
      {activeTab === 2 && <OutputTab />}

      <TabBar />
    </div>
  );
}