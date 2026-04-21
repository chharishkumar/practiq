import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SQL_PROBLEMS } from "./data/sqlProblems";
import { SQL_INTERMEDIATE_PROBLEMS } from "./data/sqlIntermediateProblems";
import { SQL_ADVANCED_PROBLEMS } from "./data/sqlAdvancedProblems";
import { SQL_INTERVIEW_PROBLEMS } from "./data/sqlInterviewProblems";
import { SQL_SCENARIOS_PROBLEMS } from "./data/sqlScenariosProblems";

// ─── Mock data (replace with Supabase calls in production) ──────────────────

const MOCK_USER = {
  fullName: "Rahul Kumar",
  username: "rahulk_data",
  level: 7,
  xp: 2340,
  xpNext: 3000,
  streak: 14,
  rank: 184,
  totalUsers: 12400,
  solvedCount: 23,
  accuracy: 81,
  weeklyCount: 7,
  lastWeekCount: 4,
  lastProblem: {
    id: 23,
    title: "BETWEEN for range filtering",
    category: "Basics",
    difficulty: "Easy",
    path: "/sql/basics",
  },
};

const DAILY_CHALLENGE = {
  id: 17,
  title: "Join customers and orders",
  category: "Basics",
  difficulty: "Easy",
  description: "Return customer_name alongside each of their orders using an INNER JOIN.",
  path: "/sql/basics",
  solvedToday: 341,
};

const LEADERBOARD = [
  { rank: 1, name: "Rahul S.",  username: "rahuls",  solved: 142, streak: 42, badge: "🥇" },
  { rank: 2, name: "Priya M.",  username: "priyam",  solved: 118, streak: 31, badge: "🥈" },
  { rank: 3, name: "Arjun K.", username: "arjunk",  solved: 97,  streak: 21, badge: "🥉" },
  { rank: 4, name: "Sneha R.", username: "snehar",  solved: 84,  streak: 14, badge: "" },
  { rank: 5, name: "Vikram D.",username: "vikramd", solved: 71,  streak: 9,  badge: "" },
];

const COMMUNITY_FEED = [
  { user: "Priya M.",  avatar: "PM", problem: "Cohort Retention Analysis",    category: "Scenarios",    time: "3m ago",  type: "solved" },
  { user: "Arjun K.", avatar: "AK", problem: "Window Functions Running Total", category: "Advanced",     time: "11m ago", type: "solved" },
  { user: "Sneha R.", avatar: "SR", problem: "Find Duplicate Emails",          category: "Basics",       time: "19m ago", type: "solved" },
  { user: "Meera T.", avatar: "MT", problem: "Second Highest Salary",          category: "Interview",    time: "28m ago", type: "solved" },
];

const RECOMMENDED = [
  { id: 17, title: "Join customers and orders",      category: "Basics",    difficulty: "Easy",   reason: "Next in sequence",  path: "/sql/basics" },
  { id: 18, title: "LEFT JOIN — find missing rows",  category: "Basics",    difficulty: "Easy",   reason: "Related to joins",  path: "/sql/basics" },
  { id: 11, title: "Count orders per customer",      category: "Basics",    difficulty: "Easy",   reason: "Practice GROUP BY", path: "/sql/basics" },
  { id: 15, title: "Filter groups with HAVING",      category: "Basics",    difficulty: "Easy",   reason: "Weak area",         path: "/sql/basics" },
];

const PRACTICE_CATEGORIES = [
  {
    key: "sql",
    label: "SQL",
    sublabel: "Basics → Advanced",
    icon: "⬡",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    total: SQL_PROBLEMS.length + SQL_INTERMEDIATE_PROBLEMS.length + SQL_ADVANCED_PROBLEMS.length + SQL_INTERVIEW_PROBLEMS.length + SQL_SCENARIOS_PROBLEMS.length,
    path: "/sql",
    active: true,
  },
  {
    key: "python",
    label: "Python",
    sublabel: "Coming soon",
    icon: "⬡",
    color: "#94a3b8",
    bg: "#f8fafc",
    border: "#e2e8f0",
    total: null,
    path: null,
    active: false,
  },
  {
    key: "java",
    label: "Java",
    sublabel: "Coming soon",
    icon: "⬡",
    color: "#94a3b8",
    bg: "#f8fafc",
    border: "#e2e8f0",
    total: null,
    path: null,
    active: false,
  },
  {
    key: "scenarios",
    label: "Real-world",
    sublabel: "Business scenarios",
    icon: "⬡",
    color: "#0f172a",
    bg: "#f8fafc",
    border: "#e2e8f0",
    total: SQL_SCENARIOS_PROBLEMS.length,
    path: "/sql/scenarios",
    active: true,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

const DIFF = {
  Easy:   { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Medium: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Hard:   { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

function DiffPill({ d }) {
  const s = DIFF[d] || DIFF.Easy;
  return (
    <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "10px", fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {d}
    </span>
  );
}

function CatPill({ cat }) {
  return (
    <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "10px", fontWeight: 600, background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}>
      {cat}
    </span>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({ user, navigate }) {
  return (
    <nav style={{ padding: "0.875rem 2.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.97)", zIndex: 100 }}>
      <span onClick={() => navigate("/")} style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", letterSpacing: "-0.3px", cursor: "pointer" }}>
        Data Rejected
      </span>
      <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
        <span onClick={() => navigate("/home")} style={{ fontSize: "0.85rem", color: "#2563eb", fontWeight: 600, cursor: "pointer", borderBottom: "2px solid #2563eb", paddingBottom: "2px" }}>Home</span>
        <span onClick={() => navigate("/sql")} style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500, cursor: "pointer" }}>Practice</span>
        <span onClick={() => navigate("/leaderboard")} style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500, cursor: "pointer" }}>Leaderboard</span>
        <span onClick={() => navigate("/profile")} style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500, cursor: "pointer" }}>Profile</span>
        {/* Avatar shortcut */}
        <div onClick={() => navigate("/profile")} style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#eff6ff", border: "1.5px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem", color: "#2563eb", cursor: "pointer" }}>
          {getInitials(user.fullName)}
        </div>
      </div>
    </nav>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({ label, title, action, actionFn, children, style = {} }) {
  return (
    <div style={style}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          {label && <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px" }}>{label}</div>}
          {title && <h2 style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "-0.3px", margin: 0, color: "#0f172a" }}>{title}</h2>}
        </div>
        {action && (
          <button onClick={actionFn} style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            {action} →
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Card shell ──────────────────────────────────────────────────────────────

function Card({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "14px", padding: "1.25rem 1.375rem", ...style, cursor: onClick ? "pointer" : "default" }}
      onMouseEnter={onClick ? e => e.currentTarget.style.borderColor = "#bfdbfe" : undefined}
      onMouseLeave={onClick ? e => e.currentTarget.style.borderColor = "#e2e8f0" : undefined}
    >
      {children}
    </div>
  );
}

// ─── Hero greeting ───────────────────────────────────────────────────────────

function HeroGreeting({ user, navigate }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const weeklyDiff = user.weeklyCount - user.lastWeekCount;

  return (
    <div style={{ background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)", borderBottom: "1px solid #e2e8f0", padding: "2rem 2.5rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", color: "#16a34a", background: "#f0fdf4", padding: "4px 12px", borderRadius: "20px", border: "1px solid #bbf7d0", marginBottom: "0.75rem", fontWeight: 600 }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16a34a", display: "inline-block" }}></span>
              🔥 {user.streak}-day streak — keep it going!
            </div>
            <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, letterSpacing: "-0.75px", margin: "0 0 0.5rem", color: "#0f172a" }}>
              {greeting}, {user.fullName.split(" ")[0]} 👋
            </h1>
            <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0, lineHeight: 1.6 }}>
              {weeklyDiff > 0
                ? `You solved ${user.weeklyCount} problems this week — ${weeklyDiff} more than last week. You're on a roll!`
                : `You've solved ${user.weeklyCount} problems this week. Keep the momentum going.`}
            </p>
          </div>

          {/* Primary CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
            <button
              onClick={() => navigate(user.lastProblem.path)}
              style={{ padding: "12px 28px", borderRadius: "10px", background: "#2563eb", color: "#fff", fontWeight: 800, fontSize: "0.95rem", border: "none", cursor: "pointer", letterSpacing: "-0.2px", whiteSpace: "nowrap" }}
            >
              ▶ Continue Practice
            </button>
            <span style={{ fontSize: "0.72rem", color: "#94a3b8", textAlign: "right" }}>
              Last: {user.lastProblem.title}
            </span>
          </div>
        </div>

        {/* Quick stats strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginTop: "1.5rem" }}>
          {[
            { label: "Problems solved", val: user.solvedCount,                   sub: `of ${SQL_PROBLEMS.length + SQL_INTERMEDIATE_PROBLEMS.length} SQL total` },
            { label: "Current streak",  val: `${user.streak}d`,                  sub: "days in a row" },
            { label: "Accuracy",        val: `${user.accuracy}%`,                sub: "correct on first try" },
            { label: "Global rank",     val: `#${user.rank}`,                    sub: `top ${Math.round((user.rank / user.totalUsers) * 100)}%` },
          ].map(s => (
            <div key={s.label} style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "0.875rem 1rem" }}>
              <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "5px" }}>{s.label}</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-1px", color: "#0f172a", lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginTop: "4px" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Daily Challenge card ─────────────────────────────────────────────────────

function DailyChallenge({ challenge, navigate }) {
  const [done, setDone] = useState(false);

  return (
    <div style={{ background: "#0f172a", borderRadius: "14px", padding: "1.25rem 1.375rem", color: "#fff", position: "relative", overflow: "hidden" }}>
      {/* background texture */}
      <div style={{ position: "absolute", right: "-20px", top: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(37,99,235,0.18)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: "40px", bottom: "-30px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(37,99,235,0.1)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#fbbf24", background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: "20px", padding: "3px 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          🔥 Daily Challenge
        </span>
        <span style={{ fontSize: "0.68rem", color: "#64748b" }}>{challenge.solvedToday.toLocaleString()} solved today</span>
      </div>

      <div style={{ fontSize: "1rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.375rem", letterSpacing: "-0.2px" }}>
        {challenge.title}
      </div>
      <div style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.6, marginBottom: "1rem", maxWidth: "340px" }}>
        {challenge.description}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={() => { setDone(true); navigate(challenge.path); }}
          style={{ padding: "8px 20px", borderRadius: "8px", background: done ? "#16a34a" : "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.82rem", border: "none", cursor: "pointer" }}
        >
          {done ? "✓ Solved!" : "Solve today's challenge →"}
        </button>
        <DiffPill d={challenge.difficulty} />
        <CatPill cat={challenge.category} />
      </div>
    </div>
  );
}

// ─── Practice categories ──────────────────────────────────────────────────────

function PracticeCategories({ navigate }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
      {PRACTICE_CATEGORIES.map(cat => (
        <div
          key={cat.key}
          onClick={() => cat.active && cat.path && navigate(cat.path)}
          style={{ background: cat.bg, border: `1.5px solid ${cat.border}`, borderRadius: "12px", padding: "1.125rem", cursor: cat.active ? "pointer" : "default", opacity: cat.active ? 1 : 0.6, transition: "border-color 0.15s" }}
          onMouseEnter={cat.active ? e => e.currentTarget.style.borderColor = "#93c5fd" : undefined}
          onMouseLeave={cat.active ? e => e.currentTarget.style.borderColor = cat.border : undefined}
        >
          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: cat.color, marginBottom: "3px" }}>{cat.label}</div>
          <div style={{ fontSize: "0.7rem", color: "#94a3b8", marginBottom: "8px" }}>{cat.sublabel}</div>
          {cat.total !== null
            ? <div style={{ fontSize: "0.68rem", color: cat.color, fontWeight: 600, background: "#fff", padding: "2px 8px", borderRadius: "10px", border: `1px solid ${cat.border}`, width: "fit-content" }}>{cat.total}+ problems</div>
            : <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 500 }}>Coming soon</div>
          }
        </div>
      ))}
    </div>
  );
}

// ─── Continue where you left off ─────────────────────────────────────────────

function ContinueCard({ problem, navigate }) {
  return (
    <Card onClick={() => navigate(problem.path)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
      <div>
        <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "5px" }}>Resume where you left off</div>
        <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>{problem.title}</div>
        <div style={{ display: "flex", gap: "6px" }}>
          <CatPill cat={problem.category} />
          <DiffPill d={problem.difficulty} />
        </div>
      </div>
      <button
        onClick={e => { e.stopPropagation(); navigate(problem.path); }}
        style={{ padding: "9px 20px", borderRadius: "8px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.82rem", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
      >
        Resume →
      </button>
    </Card>
  );
}

// ─── Recommended problems ─────────────────────────────────────────────────────

function RecommendedProblems({ navigate }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
      {RECOMMENDED.map(p => (
        <Card key={p.id} onClick={() => navigate(p.path)} style={{ padding: "1rem 1.125rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
            <DiffPill d={p.difficulty} />
            <span style={{ fontSize: "0.65rem", color: "#94a3b8", background: "#f8fafc", padding: "2px 7px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>{p.reason}</span>
          </div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", margin: "6px 0 4px" }}>{p.title}</div>
          <div style={{ fontSize: "0.72rem", color: "#2563eb", fontWeight: 600 }}>Solve this →</div>
        </Card>
      ))}
    </div>
  );
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

function LeaderboardCard({ user }) {
  const YOU_RANK = MOCK_USER.rank;

  return (
    <Card style={{ padding: "0" }}>
      {/* header */}
      <div style={{ padding: "1rem 1.375rem 0.75rem", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Top solvers this week</div>
      </div>

      {LEADERBOARD.map((u, i) => (
        <div key={u.rank} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.7rem 1.375rem", borderBottom: i < LEADERBOARD.length - 1 ? "1px solid #f1f5f9" : "none" }}>
          <div style={{ width: "22px", textAlign: "center", fontSize: "0.82rem" }}>{u.badge || <span style={{ color: "#94a3b8", fontSize: "0.72rem" }}>#{u.rank}</span>}</div>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "#2563eb", flexShrink: 0 }}>
            {getInitials(u.name)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f172a" }}>{u.name}</div>
            <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>🔥 {u.streak}d streak</div>
          </div>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2563eb" }}>{u.solved} solved</div>
        </div>
      ))}

      {/* Your rank */}
      <div style={{ margin: "0", padding: "0.75rem 1.375rem", background: "#eff6ff", borderTop: "1.5px solid #bfdbfe", borderRadius: "0 0 12px 12px", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "22px", textAlign: "center", fontSize: "0.75rem", color: "#2563eb", fontWeight: 700 }}>#{YOU_RANK}</div>
        <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
          {getInitials(user.fullName)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1d4ed8" }}>You</div>
          <div style={{ fontSize: "0.68rem", color: "#60a5fa" }}>top {Math.round((YOU_RANK / user.totalUsers) * 100)}% globally</div>
        </div>
        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1d4ed8" }}>{user.solvedCount} solved</div>
      </div>
    </Card>
  );
}

// ─── Community feed ───────────────────────────────────────────────────────────

function CommunityFeed() {
  return (
    <Card style={{ padding: "0" }}>
      <div style={{ padding: "1rem 1.375rem 0.75rem", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Community — solving right now</div>
      </div>
      {COMMUNITY_FEED.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "0.75rem 1.375rem", borderBottom: i < COMMUNITY_FEED.length - 1 ? "1px solid #f1f5f9" : "none" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "#2563eb", flexShrink: 0 }}>
            {item.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.8rem", color: "#0f172a" }}>
              <span style={{ fontWeight: 700 }}>{item.user}</span> <span style={{ color: "#64748b" }}>solved</span> <span style={{ fontWeight: 600 }}>{item.problem}</span>
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "4px" }}>
              <CatPill cat={item.category} />
              <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{item.time}</span>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
}

// ─── Progress feedback ────────────────────────────────────────────────────────

function ProgressFeedback({ user }) {
  const weeklyDiff = user.weeklyCount - user.lastWeekCount;
  const pct = Math.round((user.solvedCount / (SQL_PROBLEMS.length + SQL_INTERMEDIATE_PROBLEMS.length)) * 100);

  return (
    <Card style={{ background: "#f8fafc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "5px" }}>Your progress this week</div>
          <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>
            {weeklyDiff > 0
              ? `📈 Up ${weeklyDiff} problems vs last week`
              : weeklyDiff === 0
              ? `Steady pace — same as last week`
              : `📉 Down ${Math.abs(weeklyDiff)} vs last week`}
          </div>
          <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
            {user.weeklyCount} solved this week · {user.solvedCount} total · {pct}% of SQL Basics complete
          </div>
        </div>
        {/* Mini XP bar */}
        <div style={{ minWidth: "180px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#64748b", marginBottom: "4px" }}>
            <span>Level {user.level}</span>
            <span>{user.xp} / {user.xpNext} XP</span>
          </div>
          <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ width: `${Math.round((user.xp / user.xpNext) * 100)}%`, height: "100%", background: "#2563eb", borderRadius: "3px" }} />
          </div>
          <div style={{ fontSize: "0.65rem", color: "#94a3b8", marginTop: "4px", textAlign: "right" }}>
            {user.xpNext - user.xp} XP to Level {user.level + 1}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── Empty state (new users) ──────────────────────────────────────────────────

function EmptyState({ navigate }) {
  return (
    <div style={{ textAlign: "center", padding: "3rem 2rem", background: "#f8fafc", border: "1.5px dashed #e2e8f0", borderRadius: "14px" }}>
      <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🚀</div>
      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>Start your first problem</div>
      <div style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: "360px", margin: "0 auto 1.5rem" }}>
        You haven't solved anything yet — that's fine. Pick a category and write your first SQL query. No setup needed.
      </div>
      <button
        onClick={() => navigate("/sql/basics")}
        style={{ padding: "10px 24px", borderRadius: "8px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.88rem", border: "none", cursor: "pointer" }}
      >
        Start SQL Basics →
      </button>
    </div>
  );
}

// ─── MAIN HOMEPAGE ────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();
  const user = MOCK_USER;
  const isNewUser = user.solvedCount === 0;

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>
      <Nav user={user} navigate={navigate} />
      <HeroGreeting user={user} navigate={navigate} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 2.5rem" }}>

        {isNewUser ? (
          <EmptyState navigate={navigate} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

            {/* Daily challenge + Continue */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <Section label="Daily challenge" title="">
                <DailyChallenge challenge={DAILY_CHALLENGE} navigate={navigate} />
              </Section>
              <Section label="Resume" title="">
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <ContinueCard problem={user.lastProblem} navigate={navigate} />
                  {/* Progress feedback sits naturally here */}
                  <ProgressFeedback user={user} />
                </div>
              </Section>
            </div>

            {/* Practice categories */}
            <Section label="Practice" title="What do you want to work on?" action="All categories" actionFn={() => navigate("/sql")}>
              <PracticeCategories navigate={navigate} />
            </Section>

            {/* Recommended + Leaderboard */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.25rem", alignItems: "start" }}>
              <Section label="Recommended for you" title="Problems to try next" action="Browse all" actionFn={() => navigate("/sql/basics")}>
                <RecommendedProblems navigate={navigate} />
              </Section>
              <Section label="Leaderboard" title="">
                <LeaderboardCard user={user} />
              </Section>
            </div>

            {/* Community feed */}
            <Section label="Community" title="See what others are solving" action="View all" actionFn={() => navigate("/sql")}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                <CommunityFeed />
                {/* Gamification nudge */}
                <Card style={{ background: "#f8fafc", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Badges you can earn</div>
                  {[
                    { icon: "🔥", title: "30-day streak",   sub: "Solve 1 problem every day for 30 days", progress: Math.round((user.streak / 30) * 100) },
                    { icon: "💯", title: "Century club",    sub: "Solve 100 problems total",              progress: Math.round((user.solvedCount / 100) * 100) },
                    { icon: "⚡", title: "Speed demon",     sub: "Solve 10 problems under 2 minutes",     progress: 40 },
                  ].map(b => (
                    <div key={b.title}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                        <span style={{ fontSize: "1rem" }}>{b.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0f172a" }}>{b.title}</div>
                          <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>{b.sub}</div>
                        </div>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#2563eb" }}>{b.progress}%</span>
                      </div>
                      <div style={{ height: "4px", background: "#e2e8f0", borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ width: `${b.progress}%`, height: "100%", background: "#2563eb", borderRadius: "2px" }} />
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            </Section>

          </div>
        )}
      </div>

      {/* Footer — identical to your other pages */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "3rem 2.5rem 2rem", marginTop: "2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a", marginBottom: "0.5rem" }}>Data Rejected</div>
              <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.7, maxWidth: "280px" }}>A free SQL practice platform built for data professionals who want to actually do the work.</div>
              <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>LinkedIn</a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>YouTube</a>
                <a href="/contact" target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Contact Us</a>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Product</div>
              {["Practice", "Leaderboard", "Community"].map(link => (
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