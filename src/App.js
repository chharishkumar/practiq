import { useState } from "react";
import { supabase } from "./supabase";

export default function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    const { error } = await supabase
      .from("waitlist")
      .insert([{ email }]);
    if (!error) {
      setSubmitted(true);
    } else {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#f8fafc" }}>

      {/* Nav */}
      <nav style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1100px", margin: "0 auto" }}>
        <span style={{ fontWeight: 700, fontSize: "1.2rem", color: "#f8fafc", letterSpacing: "-0.3px" }}>Data Rejected</span>
        <span style={{ fontSize: "0.8rem", color: "#34d399", background: "#022c22", padding: "6px 14px", borderRadius: "20px", border: "1px solid #064e3b" }}>Coming Soon</span>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "7rem 2rem 4rem", textAlign: "center" }}>

        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.78rem", color: "#34d399", background: "#022c22", padding: "6px 16px", borderRadius: "20px", border: "1px solid #064e3b", marginBottom: "2.5rem" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34d399", display: "inline-block" }}></span>
          Real World SQL Practice Platform — Launching Soon
        </div>

        <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, margin: "0 0 1.5rem", letterSpacing: "-1px", color: "#f8fafc" }}>
          Real Problems.<br />
          <span style={{ color: "#34d399" }}>Real Skills.</span>
        </h1>

        <p style={{ fontSize: "1.05rem", color: "#94a3b8", lineHeight: 1.8, margin: "0 0 2.5rem", maxWidth: "520px", marginLeft: "auto", marginRight: "auto" }}>
          Stop solving fake algorithm puzzles. Practice SQL on real business datasets — customer churn, revenue analysis, support tickets and more. Get job ready by actually doing the work.
        </p>

        {!submitted ? (
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <input
              type="email"
              placeholder="Enter your work email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={{ padding: "13px 20px", borderRadius: "8px", border: "1px solid #1e293b", background: "#1e293b", color: "#f8fafc", fontSize: "0.95rem", width: "280px", outline: "none" }}
            />
            <button
              onClick={handleSubmit}
              style={{ padding: "13px 28px", borderRadius: "8px", background: "#34d399", color: "#0f172a", fontWeight: 700, fontSize: "0.95rem", border: "none", cursor: "pointer", letterSpacing: "-0.2px" }}
            >
              Join Waitlist
            </button>
          </div>
        ) : (
          <div style={{ background: "#022c22", border: "1px solid #064e3b", borderRadius: "12px", padding: "1.25rem 2rem", color: "#34d399", fontSize: "0.95rem", display: "inline-block" }}>
            You're on the list. We'll notify you at launch.
          </div>
        )}

        <p style={{ marginTop: "1rem", fontSize: "0.78rem", color: "#334155" }}>No spam. One email when we launch.</p>
      </div>

      {/* Sample Problem Card */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 2rem 3rem" }}>
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "16px", overflow: "hidden" }}>
          
          {/* Card Header */}
          <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#162032" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "0.75rem", color: "#34d399", background: "#022c22", padding: "3px 10px", borderRadius: "20px", border: "1px solid #064e3b" }}>Medium</span>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f8fafc" }}>Customer Churn Analysis</span>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#475569" }}>Problem #01</span>
          </div>

          {/* Problem Body */}
          <div style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Business Context</div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.7, margin: "0 0 1.5rem", background: "#0f172a", padding: "1rem", borderRadius: "8px", border: "1px solid #1e293b" }}>
              Your manager needs a list of customers who haven't placed an order in the last 90 days but were active in the previous 6 months. These are at-risk accounts the sales team needs to follow up with.
            </p>

            {/* SQL Editor Preview */}
            <div style={{ background: "#0f172a", borderRadius: "8px", border: "1px solid #1e293b", overflow: "hidden" }}>
              <div style={{ padding: "8px 14px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#334155", display: "inline-block" }}></span>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#334155", display: "inline-block" }}></span>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#334155", display: "inline-block" }}></span>
                <span style={{ fontSize: "0.72rem", color: "#475569", marginLeft: "8px" }}>query.sql</span>
              </div>
              <div style={{ padding: "1.25rem", fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.8 }}>
                <span style={{ color: "#475569" }}>-- Write your query below</span><br />
                <span style={{ color: "#7dd3fc" }}>SELECT</span> <span style={{ color: "#f8fafc" }}>customer_id, last_order_date</span><br />
                <span style={{ color: "#7dd3fc" }}>FROM</span> <span style={{ color: "#f8fafc" }}>orders</span><br />
                <span style={{ color: "#7dd3fc" }}>WHERE</span> <span style={{ color: "#475569" }}>...</span>
              </div>
            </div>

            <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#475569", textAlign: "center" }}>
              Join the waitlist to practice this + 50 more real problems
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 2rem 5rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
        {[["50+", "Real Problems"], ["7+", "Business Datasets"], ["Free", "To Start"]].map(([num, label]) => (
          <div key={label} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#34d399", letterSpacing: "-1px" }}>{num}</div>
            <div style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "4px" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #1e293b", padding: "2rem", textAlign: "center", color: "#334155", fontSize: "0.78rem" }}>
        © 2025 Data Rejected · Built for data professionals who want to actually do the work.
      </div>

    </div>
  );
}