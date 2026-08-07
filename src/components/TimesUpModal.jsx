import React from "react";

export default function TimesUpModal({
  problem,
  runCount,
  difficulty,
  onReset,
  onSkip,
  onClose,
}) {
  const TIME_LABELS = {
    Easy: "10 minutes",
    Medium: "15 minutes",
    Hard: "25 minutes",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "2.5rem",
        width: "440px",
        maxWidth: "90vw",
        boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
        textAlign: "center",
      }}>

        {/* Icon */}
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>⏰</div>

        {/* Title */}
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: 800,
          color: "#0f172a",
          margin: "0 0 0.5rem",
          letterSpacing: "-0.5px",
        }}>
          Time's Up!
        </h2>

        {/* Subtitle */}
        <p style={{
          fontSize: "0.88rem",
          color: "#64748b",
          lineHeight: 1.7,
          marginBottom: "1.5rem",
        }}>
          You had <strong>{TIME_LABELS[difficulty] || "10 minutes"}</strong> to solve{" "}
          <strong style={{ color: "#0f172a" }}>{problem?.title}</strong>.
          {runCount > 0 && ` You made ${runCount} attempt${runCount !== 1 ? "s" : ""}.`}
        </p>

        {/* Stats row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
          marginBottom: "1.5rem",
        }}>
          <div style={{
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "10px",
            padding: "0.75rem",
          }}>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#dc2626" }}>
              {runCount}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Attempts
            </div>
          </div>
          <div style={{
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: "10px",
            padding: "0.75rem",
          }}>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#d97706" }}>
              {difficulty}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Difficulty
            </div>
          </div>
        </div>

        {/* Motivational message */}
        <div style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          padding: "0.875rem",
          marginBottom: "1.5rem",
          fontSize: "0.82rem",
          color: "#475569",
          lineHeight: 1.6,
        }}>
          💡 In a real interview, interviewers expect{" "}
          {difficulty === "Easy" ? "Easy" : difficulty === "Medium" ? "Medium" : "Hard"}{" "}
          problems solved within{" "}
          {difficulty === "Easy" ? "10" : difficulty === "Medium" ? "15" : "25"} minutes.
          Try again with a fresh attempt — practice makes perfect.
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={onReset}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.9rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            🔄 Try Again — New Attempt
          </button>
          <button
            onClick={onSkip}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              background: "#f8fafc",
              color: "#0f172a",
              fontWeight: 600,
              fontSize: "0.88rem",
              border: "1.5px solid #e2e8f0",
              cursor: "pointer",
            }}
          >
            ⏭️ Skip — Move to Next Problem
          </button>
          <button
            onClick={onClose}
            style={{
              fontSize: "0.78rem",
              color: "#94a3b8",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            Continue anyway →
          </button>
        </div>
      </div>
    </div>
  );
}