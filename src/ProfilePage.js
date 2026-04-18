import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SQL_PROBLEMS } from "./data/sqlProblems";
import { SQL_INTERMEDIATE_PROBLEMS } from "./data/sqlIntermediateProblems";
import { SQL_ADVANCED_PROBLEMS } from "./data/sqlAdvancedProblems";
import { SQL_INTERVIEW_PROBLEMS } from "./data/sqlInterviewProblems";
import { SQL_SCENARIOS_PROBLEMS } from "./data/sqlScenariosProblems";

// Merge all problems with their category label attached
const ALL_SQL_PROBLEMS = [
  ...SQL_PROBLEMS.map(p => ({ ...p, category: "Basics" })),
  ...SQL_INTERMEDIATE_PROBLEMS.map(p => ({ ...p, category: "Intermediate" })),
  ...SQL_ADVANCED_PROBLEMS.map(p => ({ ...p, category: "Advanced" })),
  ...SQL_INTERVIEW_PROBLEMS.map(p => ({ ...p, category: "Interview" })),
  ...SQL_SCENARIOS_PROBLEMS.map(p => ({ ...p, category: "Scenarios" })),
];

// ─── Mock user data (replace with Supabase auth/profile later) ───────────────
const MOCK_USER = {
  fullName: "Rahul Kumar",
  username: "rahulk_data",
  tagline: "SQL practitioner · Aspiring data analyst · Open to opportunities",
  bio: "3 years in data ops, transitioning into analytics. Practicing daily on Data Rejected.",
  linkedin: "linkedin.com/in/rahulkumar",
  joinedDate: "January 2025",
  avatar: null, // null = show initials
};

// Simulated solve history — in production this comes from Supabase
// Keys are problem IDs, values are { solvedAt, timeTaken (seconds), attempts }
const MOCK_SOLVED = {
  1: { solvedAt: "2025-04-01", timeTaken: 52, attempts: 1 },
  2: { solvedAt: "2025-04-01", timeTaken: 68, attempts: 1 },
  3: { solvedAt: "2025-04-02", timeTaken: 91, attempts: 2 },
  4: { solvedAt: "2025-04-02", timeTaken: 74, attempts: 1 },
  5: { solvedAt: "2025-04-03", timeTaken: 45, attempts: 1 },
  6: { solvedAt: "2025-04-03", timeTaken: 60, attempts: 1 },
  7: { solvedAt: "2025-04-04", timeTaken: 112, attempts: 3 },
  8: { solvedAt: "2025-04-04", timeTaken: 88, attempts: 2 },
  9: { solvedAt: "2025-04-05", timeTaken: 55, attempts: 1 },
  10: { solvedAt: "2025-04-05", timeTaken: 70, attempts: 1 },
  11: { solvedAt: "2025-04-06", timeTaken: 143, attempts: 2 },
  12: { solvedAt: "2025-04-07", timeTaken: 38, attempts: 1 },
  13: { solvedAt: "2025-04-08", timeTaken: 42, attempts: 1 },
  14: { solvedAt: "2025-04-09", timeTaken: 55, attempts: 1 },
  15: { solvedAt: "2025-04-10", timeTaken: 189, attempts: 4 },
  16: { solvedAt: "2025-04-11", timeTaken: 61, attempts: 1 },
  17: { solvedAt: "2025-04-12", timeTaken: 175, attempts: 3 },
  18: { solvedAt: "2025-04-13", timeTaken: 210, attempts: 3 },
  19: { solvedAt: "2025-04-14", timeTaken: 66, attempts: 1 },
  20: { solvedAt: "2025-04-15", timeTaken: 80, attempts: 2 },
  21: { solvedAt: "2025-04-16", timeTaken: 95, attempts: 2 },
  22: { solvedAt: "2025-04-16", timeTaken: 130, attempts: 2 },
  23: { solvedAt: "2025-04-17", timeTaken: 72, attempts: 1 },
};

// Generate heatmap data: last 365 days with activity
function generateHeatmap() {
  const map = {};
  const today = new Date();
  // Seed from MOCK_SOLVED
  Object.values(MOCK_SOLVED).forEach(({ solvedAt }) => {
    map[solvedAt] = (map[solvedAt] || 0) + 1;
  });
  // Add some random historical activity
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (!map[key] && Math.random() > 0.65) {
      map[key] = Math.floor(Math.random() * 4) + 1;
    }
  }
  return map;
}

function fmtTime(secs) {
  if (!secs) return "—";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

const DIFF_STYLE = {
  Easy:   { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Medium: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Hard:   { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

const BADGES = [
  { id: "basics_done",  icon: "✓", title: "Basics master",   sub: "All basics solved",   color: "green",  earned: true },
  { id: "streak_7",     icon: "🔥", title: "7-day streak",    sub: "7 days in a row",     color: "gold",   earned: true },
  { id: "speed",        icon: "⚡", title: "Speed solver",    sub: "Under 2 min avg",     color: "blue",   earned: true },
  { id: "top_10",       icon: "🏆", title: "Top 10%",         sub: "Global ranking",       color: "purple", earned: false },
  { id: "century",      icon: "💯", title: "Century club",    sub: "Solve 100 problems",  color: "gold",   earned: false },
  { id: "python",       icon: "🐍", title: "Python starter",  sub: "Complete Python Basics", color: "green", earned: false },
];

const BADGE_COLORS = {
  green:  { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  gold:   { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  blue:   { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  purple: { bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" },
};

// ─── Shared nav matching your existing pages ──────────────────────────────────
function Nav({ navigate }) {
  return (
    <nav style={{ padding: "1rem 2.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.97)", zIndex: 100 }}>
      <span onClick={() => navigate("/")} style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", letterSpacing: "-0.3px", cursor: "pointer" }}>Data Rejected</span>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <span onClick={() => navigate("/home")} style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500, cursor: "pointer" }}>Home</span>
        <span onClick={() => navigate("/sql")} style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500, cursor: "pointer" }}>Practice</span>
        <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500, cursor: "pointer" }}>Leaderboard</span>
        <span onClick={() => navigate("/profile")} style={{ fontSize: "0.85rem", color: "#2563eb", fontWeight: 600, cursor: "pointer", borderBottom: "2px solid #2563eb", paddingBottom: "2px" }}>Profile</span>
      </div>
    </nav>
  );
}

// ─── Heatmap ─────────────────────────────────────────────────────────────────
function Heatmap({ data }) {
  const today = new Date();
  const cells = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = data[key] || 0;
    let intensity = 0;
    if (count === 1) intensity = 1;
    else if (count === 2) intensity = 2;
    else if (count === 3) intensity = 3;
    else if (count >= 4) intensity = 4;
    cells.push({ key, count, intensity, label: `${key}: ${count} solved` });
  }

  const colors = ["#e2e8f0", "#bfdbfe", "#93c5fd", "#3b82f6", "#1d4ed8"];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(52, 1fr)", gap: "2.5px" }}>
        {cells.map(c => (
          <div
            key={c.key}
            title={c.label}
            style={{ aspectRatio: "1", borderRadius: "2px", background: colors[c.intensity], cursor: "default" }}
          />
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "10px", justifyContent: "flex-end" }}>
        <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>Less</span>
        {colors.map((c, i) => (
          <div key={i} style={{ width: "10px", height: "10px", borderRadius: "2px", background: c }} />
        ))}
        <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>More</span>
      </div>
    </div>
  );
}

// ─── SETTINGS SUB-PAGE ───────────────────────────────────────────────────────
function SettingsPanel({ user, onSave }) {
  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState({ fullName: user.fullName, tagline: user.tagline, bio: user.bio, linkedin: user.linkedin });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [saved, setSaved] = useState(false);

  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.88rem", color: "#0f172a", outline: "none", boxSizing: "border-box", background: "#ffffff", fontFamily: "Inter, sans-serif" };
  const labelStyle = { display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "5px" };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); if (onSave) onSave(form); };

  const tabs = ["profile", "password", "account"];
  const tabLabels = { profile: "Edit profile", password: "Password", account: "Account" };

  return (
    <div>
      {/* Tab row */}
      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "10px 18px", border: "none", background: "transparent", fontSize: "0.85rem", fontWeight: tab === t ? 700 : 400, color: tab === t ? "#0f172a" : "#64748b", cursor: "pointer", borderBottom: tab === t ? "2px solid #2563eb" : "2px solid transparent", marginBottom: "-1px" }}>
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <div style={{ maxWidth: "520px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "1.5rem" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "1rem", color: "#2563eb" }}>
              {getInitials(user.fullName)}
            </div>
            <div>
              <button style={{ padding: "6px 14px", borderRadius: "7px", border: "1.5px solid #e2e8f0", background: "#fff", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", color: "#0f172a" }}>Change photo</button>
              <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "4px" }}>JPG or PNG, max 2MB</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={labelStyle}>Display name</label>
              <input style={inputStyle} value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Username</label>
              <input style={{ ...inputStyle, background: "#f8fafc", color: "#94a3b8" }} value={user.username} disabled />
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Tagline</label>
            <input style={inputStyle} value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Bio</label>
            <textarea style={{ ...inputStyle, resize: "none", height: "80px" }} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>LinkedIn URL</label>
            <input style={inputStyle} value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} placeholder="linkedin.com/in/yourname" />
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button style={{ padding: "8px 18px", borderRadius: "7px", border: "1.5px solid #e2e8f0", background: "#fff", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>Cancel</button>
            <button onClick={handleSave} style={{ padding: "8px 20px", borderRadius: "7px", background: saved ? "#16a34a" : "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: "pointer" }}>
              {saved ? "✓ Saved!" : "Save changes"}
            </button>
          </div>
        </div>
      )}

      {/* Password tab */}
      {tab === "password" && (
        <div style={{ maxWidth: "420px" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Current password</label>
            <div style={{ position: "relative" }}>
              <input type={showPw ? "text" : "password"} style={{ ...inputStyle, paddingRight: "50px" }} placeholder="Enter current password" value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>{showPw ? "Hide" : "Show"}</button>
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>New password</label>
            <input type="password" style={inputStyle} placeholder="At least 8 characters" value={pwForm.next} onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Confirm new password</label>
            <input type="password" style={inputStyle} placeholder="Repeat new password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} />
          </div>
          <button style={{ padding: "8px 20px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: "pointer" }}>Update password</button>

          <div style={{ marginTop: "2rem", padding: "1rem 1.25rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>Delete account</div>
              <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>Permanently removes your account and all data</div>
            </div>
            <button style={{ padding: "7px 14px", borderRadius: "7px", border: "1.5px solid #fca5a5", background: "#fff", color: "#dc2626", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}>Delete</button>
          </div>
        </div>
      )}

      {/* Account tab */}
      {tab === "account" && (
        <div style={{ maxWidth: "420px" }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Email address</label>
            <input style={inputStyle} type="email" defaultValue="rahul@example.com" />
          </div>
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem", marginBottom: "1.25rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem" }}>Notifications</div>
            {[
              ["Streak reminders", true],
              ["Weekly progress digest", true],
              ["New problem alerts", false],
              ["Community replies", true],
            ].map(([label, def]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "0.85rem", color: "#0f172a" }}>{label}</span>
                <input type="checkbox" defaultChecked={def} style={{ width: "auto", accentColor: "#2563eb" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={{ padding: "8px 20px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: "pointer" }}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN PROFILE PAGE ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [heatmapData] = useState(generateHeatmap);

  // Per-category totals derived from all imported problem sets
  const CATEGORY_TOTALS = {
    Basics:       SQL_PROBLEMS.length,
    Intermediate: SQL_INTERMEDIATE_PROBLEMS.length,
    Advanced:     SQL_ADVANCED_PROBLEMS.length,
    Interview:    SQL_INTERVIEW_PROBLEMS.length,
    Scenarios:    SQL_SCENARIOS_PROBLEMS.length,
  };
  const totalProblems = ALL_SQL_PROBLEMS.length;

  // MOCK_SOLVED keys are Basics problem IDs (1-23).
  // In production replace with Supabase rows keyed by { category, id }.
  const solvedIds = Object.keys(MOCK_SOLVED).map(Number);
  const solvedCount = solvedIds.length;

  // Match solved against ALL problems (Basics only for now — others have 0 solved)
  const solvedProblems = ALL_SQL_PROBLEMS
    .filter(p => p.category === "Basics" && solvedIds.includes(p.id))
    .map(p => ({ ...p, ...MOCK_SOLVED[p.id] }));

  const firstTrySolves = Object.values(MOCK_SOLVED).filter(s => s.attempts === 1).length;
  const accuracy = solvedCount > 0 ? Math.round((firstTrySolves / solvedCount) * 100) : 0;
  const avgTime = solvedCount > 0 ? Math.round(Object.values(MOCK_SOLVED).reduce((a, b) => a + b.timeTaken, 0) / solvedCount) : 0;

  // Difficulty breakdown across all solved problems
  const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
  solvedProblems.forEach(p => { if (byDifficulty[p.difficulty] !== undefined) byDifficulty[p.difficulty]++; });

  // Per-category solved counts (for progress bars)
  const solvedByCategory = { Basics: solvedCount, Intermediate: 0, Advanced: 0, Interview: 0, Scenarios: 0 };

  // XP: Easy=10, Medium=25, Hard=50
  const xp = byDifficulty.Easy * 10 + byDifficulty.Medium * 25 + byDifficulty.Hard * 50;
  const xpNext = 500;
  const level = Math.floor(xp / 100) + 1;

  // Streak: count consecutive days from today backwards
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = d.toISOString().slice(0, 10);
    if (heatmapData[k]) streak++;
    else if (i > 0) break;
  }

  const navItems = [
    { id: "overview",  label: "Overview" },
    { id: "activity",  label: "Activity" },
    { id: "problems",  label: "Solved problems" },
    { id: "settings",  label: "Settings" },
  ];

  const sectionLabel = (text) => (
    <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>{text}</div>
  );

  const card = (children, extraStyle = {}) => (
    <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "14px", padding: "1.5rem", ...extraStyle }}>
      {children}
    </div>
  );

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>
      <Nav navigate={navigate} />

      {/* Page hero strip — matches your SQLPage / LandingPage style */}
      <div style={{ background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)", borderBottom: "1px solid #e2e8f0", padding: "2rem 2.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {/* Avatar */}
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#eff6ff", border: "2px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", color: "#2563eb", flexShrink: 0 }}>
            {getInitials(MOCK_USER.fullName)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.5px", margin: 0 }}>{MOCK_USER.fullName}</h1>
              <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>@{MOCK_USER.username}</span>
              <span style={{ fontSize: "0.7rem", color: "#2563eb", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "20px", padding: "3px 10px", fontWeight: 600 }}>Level {level}</span>
              <span style={{ fontSize: "0.7rem", color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "3px 10px", fontWeight: 600 }}>🔥 {streak}-day streak</span>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#64748b" }}>{MOCK_USER.tagline}</p>
          </div>
          {/* XP bar */}
          <div style={{ textAlign: "right", minWidth: "160px" }}>
            <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>{xp} / {xpNext} XP to Level {level + 1}</div>
            <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${Math.min((xp / xpNext) * 100, 100)}%`, height: "100%", background: "#2563eb", borderRadius: "3px" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 2.5rem", display: "grid", gridTemplateColumns: "200px 1fr", gap: "2rem", alignItems: "start" }}>

        {/* Sidebar nav */}
        <div style={{ position: "sticky", top: "80px" }}>
          <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{ width: "100%", padding: "11px 16px", border: "none", background: activeSection === item.id ? "#eff6ff" : "transparent", color: activeSection === item.id ? "#2563eb" : "#64748b", fontWeight: activeSection === item.id ? 700 : 500, fontSize: "0.85rem", cursor: "pointer", textAlign: "left", borderLeft: activeSection === item.id ? "3px solid #2563eb" : "3px solid transparent", transition: "all 0.1s" }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mini stats */}
          <div style={{ marginTop: "1rem", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Quick stats</div>
            {[
              ["Solved", `${solvedCount} / ${totalProblems}`],
              ["Accuracy", `${accuracy}%`],
              ["Avg time", fmtTime(avgTime)],
              ["Joined", MOCK_USER.joinedDate],
            ].map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.8rem" }}>
                <span style={{ color: "#94a3b8" }}>{label}</span>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* ── OVERVIEW ─────────────────────────────────────────────── */}
          {activeSection === "overview" && (
            <>
              {/* Stats row */}
              <div>
                {sectionLabel("Stats")}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                  {[
                    { label: "Problems solved", val: solvedCount, sub: `of ${totalProblems} total` },
                    { label: "Current streak",  val: streak,       sub: "days in a row" },
                    { label: "Accuracy",        val: `${accuracy}%`, sub: "correct first try" },
                    { label: "XP earned",       val: xp,           sub: `Level ${level}` },
                  ].map(s => (
                    <div key={s.label} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1rem" }}>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>{s.label}</div>
                      <div style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-1px", color: "#0f172a", lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "4px" }}>{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category progress + Skill breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                {card(
                  <>
                    {sectionLabel("Category progress")}
                    {[
                      { label: "SQL Basics",       solved: solvedByCategory.Basics,       total: CATEGORY_TOTALS.Basics,       color: "#2563eb" },
                      { label: "SQL Intermediate", solved: solvedByCategory.Intermediate, total: CATEGORY_TOTALS.Intermediate, color: "#94a3b8" },
                      { label: "SQL Advanced",     solved: solvedByCategory.Advanced,     total: CATEGORY_TOTALS.Advanced,     color: "#94a3b8" },
                      { label: "Interview Qs",     solved: solvedByCategory.Interview,    total: CATEGORY_TOTALS.Interview,    color: "#94a3b8" },
                      { label: "Scenarios",        solved: solvedByCategory.Scenarios,    total: CATEGORY_TOTALS.Scenarios,    color: "#94a3b8" },
                    ].map(c => (
                      <div key={c.label} style={{ marginBottom: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "4px" }}>
                          <span style={{ color: "#0f172a", fontWeight: 500 }}>{c.label}</span>
                          <span style={{ color: "#94a3b8" }}>{c.solved}/{c.total}</span>
                        </div>
                        <div style={{ height: "5px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ width: `${Math.round((c.solved / c.total) * 100)}%`, height: "100%", background: c.color, borderRadius: "3px" }} />
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {card(
                  <>
                    {sectionLabel("Difficulty breakdown")}
                    {[
                      { label: "Easy",   count: byDifficulty.Easy,   total: Math.max(solvedCount, 1), color: "#16a34a" },
                      { label: "Medium", count: byDifficulty.Medium, total: Math.max(solvedCount, 1), color: "#d97706" },
                      { label: "Hard",   count: byDifficulty.Hard,   total: Math.max(solvedCount, 1), color: "#dc2626" },
                    ].map(d => (
                      <div key={d.label} style={{ marginBottom: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "5px" }}>
                          <span style={{ color: "#0f172a", fontWeight: 500 }}>{d.label}</span>
                          <span style={{ color: "#94a3b8" }}>{d.count} solved</span>
                        </div>
                        <div style={{ height: "7px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                          <div style={{ width: `${d.total > 0 ? Math.round((d.count / d.total) * 100) : 0}%`, height: "100%", background: d.color, borderRadius: "3px" }} />
                        </div>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginTop: "0.5rem" }}>
                      {sectionLabel("Coming soon")}
                      {["Python Basics", "Pandas", "Statistics"].map(skill => (
                        <div key={skill} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{skill}</span>
                          <span style={{ fontSize: "0.68rem", color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: "10px" }}>Soon</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Badges */}
              {card(
                <>
                  {sectionLabel("Achievements")}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
                    {BADGES.map(b => {
                      const cs = BADGE_COLORS[b.color] || BADGE_COLORS.blue;
                      return (
                        <div key={b.id} style={{ padding: "0.875rem", borderRadius: "10px", border: `1.5px solid ${b.earned ? cs.border : "#e2e8f0"}`, background: b.earned ? cs.bg : "#f8fafc", opacity: b.earned ? 1 : 0.55 }}>
                          <div style={{ fontSize: "1.25rem", marginBottom: "6px" }}>{b.icon}</div>
                          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: b.earned ? cs.color : "#94a3b8" }}>{b.title}</div>
                          <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "2px" }}>{b.sub}</div>
                          {!b.earned && <div style={{ fontSize: "0.65rem", color: "#cbd5e1", marginTop: "4px" }}>🔒 Locked</div>}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Mini heatmap preview */}
              {card(
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    {sectionLabel("Activity this year")}
                    <button onClick={() => setActiveSection("activity")} style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>View full →</button>
                  </div>
                  <Heatmap data={heatmapData} />
                </>
              )}
            </>
          )}

          {/* ── ACTIVITY ─────────────────────────────────────────────── */}
          {activeSection === "activity" && (
            <>
              {card(
                <>
                  {sectionLabel("Solve activity — last 12 months")}
                  <Heatmap data={heatmapData} />
                </>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                {card(
                  <>
                    {sectionLabel("This week")}
                    <div style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-1px" }}>
                      {Object.values(MOCK_SOLVED).filter(s => {
                        const d = new Date(s.solvedAt);
                        const now = new Date();
                        return (now - d) / (1000 * 60 * 60 * 24) <= 7;
                      }).length}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>problems solved</div>
                  </>
                )}
                {card(
                  <>
                    {sectionLabel("All time")}
                    <div style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-1px" }}>{solvedCount}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>problems solved</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginBottom: "2px" }}>Longest streak</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{streak} days</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginBottom: "2px" }}>Avg time</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{fmtTime(avgTime)}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* ── SOLVED PROBLEMS ──────────────────────────────────────── */}
          {activeSection === "problems" && (
            card(
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                  <div>
                    {sectionLabel("Solved problems")}
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>{solvedCount} solved · {accuracy}% first-try accuracy</span>
                  </div>
                  <button onClick={() => navigate("/sql/basics")} style={{ padding: "8px 16px", borderRadius: "8px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.8rem", border: "none", cursor: "pointer" }}>
                    + Solve more
                  </button>
                </div>

                {/* Header row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 70px 70px 70px", gap: "8px", padding: "6px 0", borderBottom: "1.5px solid #e2e8f0", fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <span>Problem</span><span>Category</span><span>Difficulty</span><span>Time</span><span>Attempts</span>
                </div>

                {solvedProblems.length === 0 && (
                  <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
                    No problems solved yet. <button onClick={() => navigate("/sql/basics")} style={{ color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Start now →</button>
                  </div>
                )}

                {solvedProblems.map(p => {
                  const ds = DIFF_STYLE[p.difficulty] || DIFF_STYLE.Easy;
                  return (
                    <div key={p.id} onClick={() => {
                      const pathMap = { Basics: '/sql/basics', Intermediate: '/sql/intermediate', Advanced: '/sql/advanced', Interview: '/sql/interview', Scenarios: '/sql/scenarios' };
                      navigate(`${pathMap[p.category] || '/sql/basics'}/${p.id}`);
                    }} style={{ display: "grid", gridTemplateColumns: "1fr 80px 70px 70px 70px", gap: "8px", padding: "10px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer", alignItems: "center" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8faff"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0f172a" }}>{p.id}. {p.title}</div>
                        <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "2px" }}>Solved {p.solvedAt}</div>
                      </div>
                      <span style={{ fontSize: "0.68rem", background: "#eff6ff", color: "#2563eb", padding: "3px 8px", borderRadius: "10px", fontWeight: 600, width: "fit-content" }}>Basics</span>
                      <span style={{ fontSize: "0.68rem", padding: "3px 8px", borderRadius: "10px", fontWeight: 600, background: ds.bg, color: ds.color, border: `1px solid ${ds.border}`, width: "fit-content" }}>{p.difficulty}</span>
                      <span style={{ fontSize: "0.8rem", color: "#475569" }}>{fmtTime(p.timeTaken)}</span>
                      <span style={{ fontSize: "0.8rem", color: p.attempts === 1 ? "#16a34a" : "#64748b" }}>
                        {p.attempts === 1 ? "✓ 1st try" : `${p.attempts} tries`}
                      </span>
                    </div>
                  );
                })}

                {solvedCount < totalProblems && (
                  <div style={{ padding: "1rem 0 0", textAlign: "center" }}>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "8px" }}>{totalProblems - solvedCount} problems remaining in SQL Basics</div>
                    <button onClick={() => navigate("/sql/basics")} style={{ padding: "8px 20px", borderRadius: "8px", border: "1.5px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                      Continue solving →
                    </button>
                  </div>
                )}
              </>
            )
          )}

          {/* ── SETTINGS ─────────────────────────────────────────────── */}
          {activeSection === "settings" && (
            card(<SettingsPanel user={MOCK_USER} />)
          )}
        </div>
      </div>

      {/* Footer — matches your other pages exactly */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "3rem 2.5rem 2rem", marginTop: "2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a", marginBottom: "0.5rem" }}>Data Rejected</div>
              <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.7, maxWidth: "280px" }}>A free SQL practice platform built for data professionals who want to actually do the work.</div>
              <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>LinkedIn</a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>YouTube</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Product</div>
              {["Practice", "Leaderboard", "Datasets"].map(link => (
                <div key={link} style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "0.4rem", cursor: "pointer" }}>{link}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Legal</div>
              {["Privacy Policy", "Terms of Use"].map(link => (
                <div key={link} style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "0.4rem", cursor: "pointer" }}>{link}</div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem", fontSize: "0.75rem", color: "#94a3b8", textAlign: "center" }}>
            © 2025 Data Rejected · Built for data professionals who want to actually do the work.
          </div>
        </div>
      </div>
    </div>
  );
}