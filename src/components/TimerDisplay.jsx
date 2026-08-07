import React from "react";

export default function TimerDisplay({
  formattedTimeLeft,
  percentLeft,
  timerColor,
  isExpired,
  isStopped,
  difficulty,
  timeUsed,
  formatTime,
}) {
  const isUrgent = !isExpired && !isStopped && percentLeft <= 10;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "6px 14px",
      borderRadius: "10px",
      background: isExpired ? "#fef2f2" : isStopped ? "#f0fdf4" : "#f8fafc",
      border: `1.5px solid ${isExpired ? "#fca5a5" : isStopped ? "#bbf7d0" : "#e2e8f0"}`,
      animation: isUrgent ? "pulse 1s ease-in-out infinite" : "none",
    }}>

      {/* Clock icon */}
      <div style={{
        fontSize: "0.9rem",
        animation: isUrgent ? "shake 0.5s ease-in-out infinite" : "none",
      }}>
        {isExpired ? "⏰" : isStopped ? "✅" : "🕐"}
      </div>

      {/* Time display */}
      <div>
        <div style={{
          fontSize: "1rem",
          fontWeight: 800,
          color: timerColor,
          letterSpacing: "0.05em",
          fontFamily: "monospace",
          lineHeight: 1,
        }}>
          {isExpired
            ? "Time's Up!"
            : isStopped
            ? formatTime(timeUsed)
            : formattedTimeLeft
          }
        </div>
        <div style={{
          fontSize: "0.6rem",
          color: "#94a3b8",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginTop: "2px",
        }}>
          {isExpired
            ? "Overtime"
            : isStopped
            ? "Time taken"
            : `${difficulty} · ${Math.ceil(percentLeft)}% left`
          }
        </div>
      </div>

      {/* Progress arc */}
      <div style={{ position: "relative", width: "28px", height: "28px", flexShrink: 0 }}>
        <svg width="28" height="28" viewBox="0 0 28 28">
          {/* Background circle */}
          <circle
            cx="14" cy="14" r="11"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="2.5"
          />
          {/* Progress circle */}
          <circle
            cx="14" cy="14" r="11"
            fill="none"
            stroke={timerColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 11}`}
            strokeDashoffset={`${2 * Math.PI * 11 * (1 - percentLeft / 100)}`}
            transform="rotate(-90 14 14)"
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
          />
        </svg>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.3); }
          50% { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); }
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  );
}