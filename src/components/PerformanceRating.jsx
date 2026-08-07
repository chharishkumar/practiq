import React from "react";

export default function PerformanceRating({ rating, onShare, onNext }) {
  if (!rating) return null;

  return (
    <div style={{
      background: rating.bg,
      border: `1.5px solid ${rating.border}`,
      borderRadius: "12px",
      padding: "1rem 1.25rem",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      flexWrap: "wrap",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Icon */}
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.25rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          flexShrink: 0,
        }}>
          {rating.icon}
        </div>
        <div>
          <div style={{
            fontSize: "0.92rem",
            fontWeight: 800,
            color: rating.color,
            letterSpacing: "-0.2px",
          }}>
            {rating.label}
          </div>
          <div style={{
            fontSize: "0.78rem",
            color: "#64748b",
            marginTop: "2px",
          }}>
            {rating.sublabel}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "8px" }}>
        {/* {onShare && (
          <button
            onClick={onShare}
            style={{
              padding: "6px 14px",
              borderRadius: "7px",
              background: "#ffffff",
              color: rating.color,
              fontWeight: 600,
              fontSize: "0.78rem",
              border: `1.5px solid ${rating.border}`,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            🎉 Share
          </button>
        )} */}
        {onNext && (
          <button
            onClick={onNext}
            style={{
              padding: "6px 14px",
              borderRadius: "7px",
              background: rating.color,
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.78rem",
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}