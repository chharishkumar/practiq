import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

import { SQL_PROBLEMS } from "./data/sqlProblems";
import { SQL_INTERMEDIATE_PROBLEMS } from "./data/sqlIntermediateProblems";
import { SQL_ADVANCED_PROBLEMS } from "./data/sqlAdvancedProblems";
import { SQL_INTERVIEW_PROBLEMS } from "./data/sqlInterviewProblems";
import { SQL_SCENARIOS_PROBLEMS } from "./data/sqlScenariosProblems";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const ALL_SQL_PROBLEMS = [
  ...SQL_PROBLEMS.map((p) => ({ ...p, category: "Basics" })),
  ...(SQL_INTERMEDIATE_PROBLEMS || []).map((p) => ({ ...p, category: "Intermediate" })),
  ...(SQL_ADVANCED_PROBLEMS || []).map((p) => ({ ...p, category: "Advanced" })),
  ...(SQL_INTERVIEW_PROBLEMS || []).map((p) => ({ ...p, category: "Interview" })),
  ...(SQL_SCENARIOS_PROBLEMS || []).map((p) => ({ ...p, category: "Scenarios" })),
];

const CATEGORY_TOTALS = {
  Basics:       SQL_PROBLEMS?.length || 0,
  Intermediate: SQL_INTERMEDIATE_PROBLEMS?.length || 0,
  Advanced:     SQL_ADVANCED_PROBLEMS?.length || 0,
  Interview:    SQL_INTERVIEW_PROBLEMS?.length || 0,
  Scenarios:    SQL_SCENARIOS_PROBLEMS?.length || 0,
};

const CATEGORY_PATH_MAP = {
  sql_basics:       "/sql/basics",
  sql_intermediate: "/sql/intermediate",
  sql_advanced:     "/sql/advanced",
  sql_interview:    "/sql/interview",
  sql_scenarios:    "/sql/scenarios",
};

// Map category key → label for display
const CATEGORY_LABEL_MAP = {
  sql_basics:       "Basics",
  sql_intermediate: "Intermediate",
  sql_advanced:     "Advanced",
  sql_interview:    "Interview",
  sql_scenarios:    "Scenarios",
};

const DIFF_STYLE = {
  Easy:   { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Medium: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Hard:   { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

const BADGE_COLORS = {
  green:  { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  gold:   { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
  blue:   { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  purple: { bg: "#f5f3ff", color: "#6d28d9", border: "#ddd6fe" },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function fmtTime(secs) {
  if (!secs && secs !== 0) return "—";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function toDateKey(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toISOString().slice(0, 10);
}

function isThisWeek(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(now.getDate() - 7);
  return d >= weekAgo && d <= now;
}

// ─── SMALL UI PRIMITIVES ─────────────────────────────────────────────────────

function SectionLabel({ text }) {
  return (
    <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
      {text}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "14px", padding: "1.5rem", ...style }}>
      {children}
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav({ navigate }) {
  return (
    <nav style={{ padding: "1rem 2.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.97)", zIndex: 100 }}>
      <span onClick={() => navigate("/")} style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", letterSpacing: "-0.3px", cursor: "pointer" }}>
        Data Rejected
      </span>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <span onClick={() => navigate("/home")}        style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500, cursor: "pointer" }}>Home</span>
        <span onClick={() => navigate("/sql")}         style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500, cursor: "pointer" }}>Practice</span>
        <span onClick={() => navigate("/leaderboard")} style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500, cursor: "pointer" }}>Leaderboard</span>
        <span onClick={() => navigate("/profile")}     style={{ fontSize: "0.85rem", color: "#2563eb", fontWeight: 600, cursor: "pointer", borderBottom: "2px solid #2563eb", paddingBottom: "2px" }}>Profile</span>
      </div>
    </nav>
  );
}

// ─── HEATMAP ─────────────────────────────────────────────────────────────────

function Heatmap({ activityMap }) {
  const today = new Date();
  const cells = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = activityMap[key] || 0;
    let intensity = 0;
    if (count === 1) intensity = 1;
    else if (count === 2) intensity = 2;
    else if (count === 3) intensity = 3;
    else if (count >= 4) intensity = 4;
    cells.push({ key, count, intensity });
  }
  const colors = ["#e2e8f0", "#bfdbfe", "#93c5fd", "#3b82f6", "#1d4ed8"];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(52, 1fr)", gap: "2.5px" }}>
        {cells.map((c) => (
          <div
            key={c.key}
            title={`${c.key}: ${c.count} solved`}
            style={{ aspectRatio: "1", borderRadius: "2px", background: colors[c.intensity] }}
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

// ─── SETTINGS PANEL ──────────────────────────────────────────────────────────

function SettingsPanel({ profile, authEmail, onSaveProfile, onSignOut }) {
  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    mobile:    profile?.mobile    || "",
    country:   profile?.country   || "",
    state:     profile?.state     || "",
  });
  const [pwForm, setPwForm]   = useState({ next: "", confirm: "" });
  const [showPw, setShowPw]   = useState(false);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [pwMsg, setPwMsg]     = useState("");
  //const [deleteConfirm, setDeleteConfirm] = useState(false);

  const inputStyle  = { width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1.5px solid #e2e8f0", fontSize: "0.88rem", color: "#0f172a", outline: "none", boxSizing: "border-box", background: "#ffffff", fontFamily: "Inter, sans-serif" };
  const labelStyle  = { display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "5px" };

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: form.full_name, mobile: form.mobile, country: form.country, state: form.state })
      .eq("id", (await supabase.auth.getSession()).data.session.user.id);
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (onSaveProfile) onSaveProfile(form);
    }
  };

  const handleUpdatePassword = async () => {
    if (pwForm.next !== pwForm.confirm) { setPwMsg("Passwords don't match."); return; }
    if (pwForm.next.length < 8) { setPwMsg("Password must be at least 8 characters."); return; }
    const { error } = await supabase.auth.updateUser({ password: pwForm.next });
    if (error) { setPwMsg(error.message); }
    else { setPwMsg("✓ Password updated successfully!"); setPwForm({ next: "", confirm: "" }); }
  };

  const handleDeleteAccount = async () => {
    // Supabase doesn't allow client-side user deletion — show guidance
    alert("To delete your account, please contact us at support@datarejected.com");
  };

  const tabs = ["profile", "password", "account"];
  const tabLabels = { profile: "Edit profile", password: "Password", account: "Account" };

  return (
    <div>
      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
        {tabs.map((t) => (
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
              {getInitials(form.full_name || "User")}
            </div>
            <div>
              <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "4px" }}>Photo upload coming soon</div>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Display name</label>
            <input style={inputStyle} value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} placeholder="Your full name" />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Email</label>
            <input style={{ ...inputStyle, background: "#f8fafc", color: "#94a3b8" }} value={authEmail} disabled />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={labelStyle}>Country</label>
              <input style={inputStyle} value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} placeholder="e.g. India" />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <input style={inputStyle} value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} placeholder="e.g. Telangana" />
            </div>
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Mobile</label>
            <input style={inputStyle} value={form.mobile} onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))} placeholder="+91 XXXXXXXXXX" />
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button onClick={handleSaveProfile} disabled={saving} style={{ padding: "8px 20px", borderRadius: "7px", background: saved ? "#16a34a" : "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: "pointer" }}>
              {saving ? "Saving…" : saved ? "✓ Saved!" : "Save changes"}
            </button>
          </div>
        </div>
      )}

      {/* Password tab */}
      {tab === "password" && (
        <div style={{ maxWidth: "420px" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>New password</label>
            <div style={{ position: "relative" }}>
              <input type={showPw ? "text" : "password"} style={{ ...inputStyle, paddingRight: "50px" }} placeholder="At least 8 characters" value={pwForm.next} onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Confirm new password</label>
            <input type="password" style={inputStyle} placeholder="Repeat new password" value={pwForm.confirm} onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))} />
          </div>
          {pwMsg && (
            <div style={{ fontSize: "0.82rem", marginBottom: "1rem", color: pwMsg.startsWith("✓") ? "#16a34a" : "#dc2626" }}>{pwMsg}</div>
          )}
          <button onClick={handleUpdatePassword} style={{ padding: "8px 20px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: "pointer" }}>
            Update password
          </button>

          <div style={{ marginTop: "2rem", padding: "1rem 1.25rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>Delete account</div>
              <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>Permanently removes your account and all data</div>
            </div>
            <button onClick={handleDeleteAccount} style={{ padding: "7px 14px", borderRadius: "7px", border: "1.5px solid #fca5a5", background: "#fff", color: "#dc2626", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}>
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Account tab */}
      {tab === "account" && (
        <div style={{ maxWidth: "420px" }}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Email address</label>
            <input style={{ ...inputStyle, background: "#f8fafc", color: "#94a3b8" }} value={authEmail} disabled />
            <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "4px" }}>Email is managed by your login provider</div>
          </div>
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem", marginTop: "1rem" }}>
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
          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1.25rem", marginTop: "0.5rem" }}>
            <button
              onClick={onSignOut}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LOADING ─────────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⏳</div>
        <div style={{ fontSize: "0.88rem", color: "#64748b" }}>Loading your profile...</div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ProfilePage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading]             = useState(true);

  // Live data
  const [authEmail, setAuthEmail]         = useState("");
  const [profile, setProfile]             = useState(null);
  const [submissions, setSubmissions]     = useState([]);   // all submissions for this user
  const [streakData, setStreakData]        = useState(null);

  // ── Fetch all data ────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      // Auth check
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) { navigate("/login"); return; }
      const authUser = sessionData.session.user;
      const userId   = authUser.id;
      setAuthEmail(authUser.email || "");

      // Profile
      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, email, mobile, country, state, created_at")
        .eq("id", userId)
        .maybeSingle();
      setProfile(prof || {});

      // All submissions (correct + wrong) for this user
      const { data: subs } = await supabase
        .from("submissions")
        .select("id, problem_id, category, problem_title, status, time_taken_seconds, run_count, created_at, updated_at")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      setSubmissions(subs || []);

      // Streak
      const { data: streak } = await supabase
        .from("user_streaks")
        .select("current_streak, longest_streak, last_solved_date")
        .eq("user_id", userId)
        .maybeSingle();
      setStreakData(streak || { current_streak: 0, longest_streak: 0, last_solved_date: null });

      setLoading(false);
    };
    load();
  }, [navigate]);

  // ── Sign out ──────────────────────────────────────────────────────────────
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // ── Update profile locally after save ────────────────────────────────────
  const handleSaveProfile = (form) => {
    setProfile((prev) => ({ ...prev, ...form }));
  };

  if (loading) return <LoadingScreen />;

  // ── Derived stats from submissions ────────────────────────────────────────

  const correctSubs = submissions.filter((s) => s.status === "correct");

  // Unique solved problem IDs
  const solvedIdSet = new Set(correctSubs.map((s) => s.problem_id));
  const solvedCount = solvedIdSet.size;

  // Total unique problems attempted
  //const attemptedSet = new Set(submissions.map((s) => s.problem_id));

  // Accuracy: solved on first run (run_count === 1)
  const firstTrySolves = correctSubs.filter((s) => s.run_count === 1).length;
  const accuracy = solvedCount > 0 ? Math.round((firstTrySolves / solvedCount) * 100) : 0;

  // Average time (correct submissions only)
  const timeSubs = correctSubs.filter((s) => s.time_taken_seconds);
  const avgTime = timeSubs.length > 0
    ? Math.round(timeSubs.reduce((acc, s) => acc + s.time_taken_seconds, 0) / timeSubs.length)
    : 0;

  // Fast solves under 2 minutes
  const fastSolves = correctSubs.filter((s) => (s.time_taken_seconds || 999) < 120).length;

  // This week's solves
  const weeklyCount = correctSubs.filter((s) => isThisWeek(s.updated_at)).length;

  // Activity heatmap: date → count of correct solves
  const activityMap = {};
  correctSubs.forEach((s) => {
    const key = toDateKey(s.updated_at);
    if (key) activityMap[key] = (activityMap[key] || 0) + 1;
  });

  // Solved by category
  const solvedByCategory = { Basics: 0, Intermediate: 0, Advanced: 0, Interview: 0, Scenarios: 0 };
  correctSubs.forEach((s) => {
    const label = CATEGORY_LABEL_MAP[s.category];
    if (label && solvedByCategory[label] !== undefined) {
      solvedByCategory[label]++;
    }
  });

  // Difficulty breakdown — match solved problem IDs against ALL_SQL_PROBLEMS
  const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
  correctSubs.forEach((s) => {
    const label = CATEGORY_LABEL_MAP[s.category] || "Basics";
    const match = ALL_SQL_PROBLEMS.find((p) => p.id === s.problem_id && p.category === label);
    if (match?.difficulty && byDifficulty[match.difficulty] !== undefined) {
      byDifficulty[match.difficulty]++;
    }
  });

  // XP
  const xp     = byDifficulty.Easy * 10 + byDifficulty.Medium * 25 + byDifficulty.Hard * 50;
  const level  = Math.floor(xp / 100) + 1;
  //const xpNext = level * 100;
  const xpInLevel = xp % 100;

  // Streak from Supabase
  const currentStreak  = streakData?.current_streak  || 0;
  const longestStreak  = streakData?.longest_streak  || 0;

  const totalProblems = ALL_SQL_PROBLEMS.length;

  // Build solved problems list for the table (most recent first, correct only)
  // De-duplicate: one row per problem_id (keep most recent correct)
  const seenProblems = new Set();
  const solvedProblems = [];
  correctSubs.forEach((s) => {
    if (seenProblems.has(s.problem_id)) return;
    seenProblems.add(s.problem_id);
    const label = CATEGORY_LABEL_MAP[s.category] || "Basics";
    const match = ALL_SQL_PROBLEMS.find((p) => p.id === s.problem_id && p.category === label);
    solvedProblems.push({
      ...s,
      title:      s.problem_title || match?.title || `Problem #${s.problem_id}`,
      difficulty: match?.difficulty || "Easy",
      categoryLabel: label,
      path:       CATEGORY_PATH_MAP[s.category] || "/sql/basics",
    });
  });

  // ── Badges (computed live) ────────────────────────────────────────────────
  const BADGES = [
    { id: "basics_done", icon: "✓",  title: "Basics master",   sub: `All ${CATEGORY_TOTALS.Basics} basics solved`,    color: "green",  earned: solvedByCategory.Basics >= CATEGORY_TOTALS.Basics },
    { id: "streak_7",    icon: "🔥", title: "7-day streak",    sub: "7 days in a row",                                 color: "gold",   earned: currentStreak >= 7 },
    { id: "streak_30",   icon: "🔥", title: "30-day streak",   sub: "30 days in a row",                                color: "gold",   earned: currentStreak >= 30 },
    { id: "speed",       icon: "⚡", title: "Speed solver",    sub: "Solve 10 problems under 2 min",                   color: "blue",   earned: fastSolves >= 10 },
    { id: "century",     icon: "💯", title: "Century club",    sub: "Solve 100 problems total",                        color: "gold",   earned: solvedCount >= 100 },
    { id: "accurate",    icon: "🎯", title: "First try ace",   sub: "80%+ accuracy",                                   color: "purple", earned: accuracy >= 80 },
  ];

  // ── Joined date ───────────────────────────────────────────────────────────
  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  const fullName = profile?.full_name || authEmail?.split("@")[0] || "User";

  const navItems = [
    { id: "overview",  label: "Overview" },
    { id: "activity",  label: "Activity" },
    { id: "problems",  label: "Solved problems" },
    { id: "settings",  label: "Settings" },
    { id: "logout",    label: "Sign out" },
  ];

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>
      <Nav navigate={navigate} />

      {/* Hero strip */}
      <div style={{ background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)", borderBottom: "1px solid #e2e8f0", padding: "2rem 2.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#eff6ff", border: "2px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", color: "#2563eb", flexShrink: 0 }}>
            {getInitials(fullName)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.5px", margin: 0 }}>{fullName}</h1>
              <span style={{ fontSize: "0.7rem", color: "#2563eb", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "20px", padding: "3px 10px", fontWeight: 600 }}>
                Level {level}
              </span>
              <span style={{ fontSize: "0.7rem", color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "3px 10px", fontWeight: 600 }}>
                🔥 {currentStreak}-day streak
              </span>
              {profile?.country && (
                <span style={{ fontSize: "0.7rem", color: "#64748b", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "3px 10px", fontWeight: 500 }}>
                  📍 {[profile.state, profile.country].filter(Boolean).join(", ")}
                </span>
              )}
            </div>
            <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#64748b" }}>
              {authEmail} · Joined {joinedDate}
            </p>
          </div>
          {/* XP bar */}
          <div style={{ textAlign: "right", minWidth: "180px" }}>
            <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>
              {xpInLevel} / 100 XP to Level {level + 1}
            </div>
            <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ width: `${xpInLevel}%`, height: "100%", background: "#2563eb", borderRadius: "3px" }} />
            </div>
            <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginTop: "3px" }}>{xp} total XP</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 2.5rem", display: "grid", gridTemplateColumns: "200px 1fr", gap: "2rem", alignItems: "start" }}>

        {/* Sidebar */}
        <div style={{ position: "sticky", top: "80px" }}>
          <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "logout") { handleSignOut(); return; }
                  setActiveSection(item.id);
                }}
                style={{ width: "100%", padding: "11px 16px", border: "none", background: activeSection === item.id ? "#eff6ff" : "transparent", color: item.id === "logout" ? "#dc2626" : activeSection === item.id ? "#2563eb" : "#64748b", fontWeight: activeSection === item.id ? 700 : 500, fontSize: "0.85rem", cursor: "pointer", textAlign: "left", borderLeft: activeSection === item.id ? "3px solid #2563eb" : "3px solid transparent", transition: "all 0.1s" }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick stats sidebar */}
          <div style={{ marginTop: "1rem", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Quick stats</div>
            {[
              ["Solved",       `${solvedCount} / ${totalProblems}`],
              ["Accuracy",     `${accuracy}%`],
              ["Avg time",     fmtTime(avgTime)],
              ["This week",    `${weeklyCount} solved`],
              ["Joined",       joinedDate],
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

          {/* ── OVERVIEW ──────────────────────────────────────────────── */}
          {activeSection === "overview" && (
            <>
              {/* Stats row */}
              <div>
                <SectionLabel text="Stats" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                  {[
                    { label: "Problems solved",  val: solvedCount,        sub: `of ${totalProblems} total` },
                    { label: "Current streak",   val: `${currentStreak}d`, sub: `Longest: ${longestStreak}d` },
                    { label: "Accuracy",         val: `${accuracy}%`,      sub: "correct first try" },
                    { label: "XP earned",        val: xp,                  sub: `Level ${level}` },
                  ].map((s) => (
                    <div key={s.label} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1rem" }}>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600, marginBottom: "6px" }}>{s.label}</div>
                      <div style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-1px", color: "#0f172a", lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "4px" }}>{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category progress + Difficulty breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <Card>
                  <SectionLabel text="Category progress" />
                  {[
                    { label: "SQL Basics",       solved: solvedByCategory.Basics,       total: CATEGORY_TOTALS.Basics,       color: "#2563eb" },
                    { label: "SQL Intermediate", solved: solvedByCategory.Intermediate, total: CATEGORY_TOTALS.Intermediate, color: "#7c3aed" },
                    { label: "SQL Advanced",     solved: solvedByCategory.Advanced,     total: CATEGORY_TOTALS.Advanced,     color: "#dc2626" },
                    { label: "Interview Qs",     solved: solvedByCategory.Interview,    total: CATEGORY_TOTALS.Interview,    color: "#d97706" },
                    { label: "Scenarios",        solved: solvedByCategory.Scenarios,    total: CATEGORY_TOTALS.Scenarios,    color: "#16a34a" },
                  ].map((c) => (
                    <div key={c.label} style={{ marginBottom: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "4px" }}>
                        <span style={{ color: "#0f172a", fontWeight: 500 }}>{c.label}</span>
                        <span style={{ color: "#94a3b8" }}>{c.solved}/{c.total}</span>
                      </div>
                      <div style={{ height: "5px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${c.total > 0 ? Math.round((c.solved / c.total) * 100) : 0}%`, height: "100%", background: c.solved > 0 ? c.color : "#e2e8f0", borderRadius: "3px" }} />
                      </div>
                    </div>
                  ))}
                </Card>

                <Card>
                  <SectionLabel text="Difficulty breakdown" />
                  {[
                    { label: "Easy",   count: byDifficulty.Easy,   color: "#16a34a" },
                    { label: "Medium", count: byDifficulty.Medium, color: "#d97706" },
                    { label: "Hard",   count: byDifficulty.Hard,   color: "#dc2626" },
                  ].map((d) => (
                    <div key={d.label} style={{ marginBottom: "14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "5px" }}>
                        <span style={{ color: "#0f172a", fontWeight: 500 }}>{d.label}</span>
                        <span style={{ color: "#94a3b8" }}>{d.count} solved</span>
                      </div>
                      <div style={{ height: "7px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${solvedCount > 0 ? Math.round((d.count / solvedCount) * 100) : 0}%`, height: "100%", background: d.color, borderRadius: "3px" }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginTop: "0.5rem" }}>
                    <SectionLabel text="Coming soon" />
                    {["Python Basics", "Pandas", "Statistics"].map((skill) => (
                      <div key={skill} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{skill}</span>
                        <span style={{ fontSize: "0.68rem", color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: "10px" }}>Soon</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Badges */}
              <Card>
                <SectionLabel text="Achievements" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
                  {BADGES.map((b) => {
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
              </Card>

              {/* Heatmap preview */}
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <SectionLabel text="Activity this year" />
                  <button onClick={() => setActiveSection("activity")} style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                    View full →
                  </button>
                </div>
                <Heatmap activityMap={activityMap} />
              </Card>
            </>
          )}

          {/* ── ACTIVITY ──────────────────────────────────────────────── */}
          {activeSection === "activity" && (
            <>
              <Card>
                <SectionLabel text="Solve activity — last 12 months" />
                <Heatmap activityMap={activityMap} />
              </Card>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <Card>
                  <SectionLabel text="This week" />
                  <div style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-1px" }}>{weeklyCount}</div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>problems solved</div>
                </Card>
                <Card>
                  <SectionLabel text="All time" />
                  <div style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-1px" }}>{solvedCount}</div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>problems solved</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
                    <div>
                      <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginBottom: "2px" }}>Longest streak</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{longestStreak} days</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginBottom: "2px" }}>Avg time</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{fmtTime(avgTime)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginBottom: "2px" }}>Fast solves</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{fastSolves}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginBottom: "2px" }}>Accuracy</div>
                      <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{accuracy}%</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent submissions feed */}
              <Card>
                <SectionLabel text="Recent solves" />
                {solvedProblems.slice(0, 10).map((p, i) => {
                  const ds = DIFF_STYLE[p.difficulty] || DIFF_STYLE.Easy;
                  return (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: i < Math.min(solvedProblems.length, 10) - 1 ? "1px solid #f1f5f9" : "none" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{p.title}</div>
                        <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "2px" }}>{toDateKey(p.updated_at)}</div>
                      </div>
                      <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "10px", fontWeight: 600, background: ds.bg, color: ds.color, border: `1px solid ${ds.border}` }}>{p.difficulty}</span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{fmtTime(p.time_taken_seconds)}</span>
                    </div>
                  );
                })}
                {solvedProblems.length === 0 && (
                  <div style={{ textAlign: "center", padding: "1.5rem", color: "#94a3b8", fontSize: "0.85rem" }}>
                    No solves yet. <button onClick={() => navigate("/sql/basics")} style={{ color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Start now →</button>
                  </div>
                )}
              </Card>
            </>
          )}

          {/* ── SOLVED PROBLEMS ───────────────────────────────────────── */}
          {activeSection === "problems" && (
            <Card>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div>
                  <SectionLabel text="Solved problems" />
                  <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    {solvedCount} solved · {accuracy}% first-try accuracy
                  </span>
                </div>
                <button onClick={() => navigate("/sql/basics")} style={{ padding: "8px 16px", borderRadius: "8px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.8rem", border: "none", cursor: "pointer" }}>
                  + Solve more
                </button>
              </div>

              {/* Table header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 80px 80px 80px", gap: "8px", padding: "6px 0", borderBottom: "1.5px solid #e2e8f0", fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <span>Problem</span><span>Category</span><span>Difficulty</span><span>Time</span><span>Attempts</span>
              </div>

              {solvedProblems.length === 0 && (
                <div style={{ padding: "2rem", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
                  No problems solved yet.{" "}
                  <button onClick={() => navigate("/sql/basics")} style={{ color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                    Start now →
                  </button>
                </div>
              )}

              {solvedProblems.map((p) => {
                const ds = DIFF_STYLE[p.difficulty] || DIFF_STYLE.Easy;
                return (
                  <div
                    key={`${p.problem_id}-${p.category}`}
                    onClick={() => navigate(p.path)}
                    style={{ display: "grid", gridTemplateColumns: "1fr 90px 80px 80px 80px", gap: "8px", padding: "10px 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer", alignItems: "center" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f8faff")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0f172a" }}>{p.title}</div>
                      <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "2px" }}>
                        Solved {toDateKey(p.updated_at)}
                      </div>
                    </div>
                    <span style={{ fontSize: "0.68rem", background: "#eff6ff", color: "#2563eb", padding: "3px 8px", borderRadius: "10px", fontWeight: 600, width: "fit-content" }}>
                      {p.categoryLabel}
                    </span>
                    <span style={{ fontSize: "0.68rem", padding: "3px 8px", borderRadius: "10px", fontWeight: 600, background: ds.bg, color: ds.color, border: `1px solid ${ds.border}`, width: "fit-content" }}>
                      {p.difficulty}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#475569" }}>{fmtTime(p.time_taken_seconds)}</span>
                    <span style={{ fontSize: "0.8rem", color: p.run_count === 1 ? "#16a34a" : "#64748b" }}>
                      {p.run_count === 1 ? "✓ 1st try" : `${p.run_count} runs`}
                    </span>
                  </div>
                );
              })}

              {solvedCount > 0 && solvedCount < totalProblems && (
                <div style={{ padding: "1rem 0 0", textAlign: "center" }}>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "8px" }}>
                    {totalProblems - solvedCount} problems remaining
                  </div>
                  <button onClick={() => navigate("/sql/basics")} style={{ padding: "8px 20px", borderRadius: "8px", border: "1.5px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                    Continue solving →
                  </button>
                </div>
              )}
            </Card>
          )}

          {/* ── SETTINGS ──────────────────────────────────────────────── */}
          {activeSection === "settings" && (
            <Card>
              <SettingsPanel
                profile={profile}
                authEmail={authEmail}
                onSaveProfile={handleSaveProfile}
                onSignOut={handleSignOut}
              />
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "3rem 2.5rem 2rem", marginTop: "2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a", marginBottom: "0.5rem" }}>Data Rejected</div>
              <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.7, maxWidth: "280px" }}>A free SQL practice platform built for data professionals who want to actually do the work.</div>
              <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>LinkedIn</a>
                <a href="https://youtube.com"  target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>YouTube</a>
                <a href="/contact" style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Contact Us</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Product</div>
              {[["Practice", "/sql"], ["Leaderboard", "/leaderboard"], ["Community", "/sql"]].map(([link, path]) => (
                <div key={link} onClick={() => navigate(path)} style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "0.4rem", cursor: "pointer" }}>{link}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Legal</div>
              {["Privacy Policy", "Terms of Use"].map((link) => (
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