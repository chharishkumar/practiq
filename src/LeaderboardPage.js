import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const TABS = [
  "Overall",
  "Weekly",
  "SQL Basics",
  "SQL Intermediate",
  "SQL Advanced",
  "SQL Interview",
  "SQL Scenarios",
];

const BADGES = {
  "SQL Master": { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  "Streak King": { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  "Top Solver": { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  "Rising Star": { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  "Interview Pro": { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  "Scenario Expert": { color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc" },
  "Consistent": { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" },
};

const STRENGTHS = ["JOINs", "Window Functions", "CTEs", "Aggregations", "Subqueries", "GROUP BY", "Indexing", "Churn Analysis", "Revenue Modeling"];

const generateUsers = (count, seed = 0) =>
  Array.from({ length: count }, (_, i) => {
    const names = ["Rahul S.", "Priya M.", "Arjun K.", "Sneha R.", "Vikram D.", "Meera T.", "Karan P.", "Ananya B.", "Rohan V.", "Divya N.", "Amit J.", "Pooja L.", "Suresh K.", "Nisha G.", "Ravi M.", "Deepa S.", "Arun T.", "Kavya R.", "Sanjay P.", "Lakshmi V.", "Mohammed A.", "Sarah C.", "James W.", "Emma L.", "Lucas M.", "Sofia B.", "Liam O.", "Olivia P.", "Noah K.", "Ava T.", "Chen W.", "Yuki T.", "Park S.", "Lin M.", "Ahmed H."];
    const countries = ["🇮🇳 India", "🇺🇸 USA", "🇬🇧 UK", "🇸🇬 Singapore", "🇩🇪 Germany", "🇦🇺 Australia", "🇨🇦 Canada", "🇦🇪 UAE", "🇳🇱 Netherlands", "🇫🇷 France"];
    const badgeKeys = Object.keys(BADGES);
    const idx = (i + seed) % names.length;
    return {
      rank: i + 1,
      name: names[idx],
      country: countries[(i + seed) % countries.length],
      solved: Math.max(5, 180 - i * 4 - seed * 2 + Math.floor(Math.random() * 8)),
      streak: Math.max(1, 90 - i * 2 + Math.floor(Math.random() * 10)),
      strength: STRENGTHS[(i + seed) % STRENGTHS.length],
      badge: badgeKeys[(i + seed) % badgeKeys.length],
      isCurrentUser: i === 12,
    };
  });

const ALL_USERS = generateUsers(50);
const WEEKLY_USERS = generateUsers(50, 3);
const CATEGORY_USERS = {
  "SQL Basics": generateUsers(50, 1),
  "SQL Intermediate": generateUsers(50, 2),
  "SQL Advanced": generateUsers(50, 4),
  "SQL Interview": generateUsers(50, 5),
  "SQL Scenarios": generateUsers(50, 6),
};

const STATS = [
  { num: "12,847", label: "Total Practitioners" },
  { num: "3,291", label: "Problems Solved Today" },
  { num: "48", label: "Countries Represented" },
  { num: "94%", label: "Would Recommend" },
];

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overall");
  const [isLoggedIn] = useState(false);

  const getUsers = () => {
    if (activeTab === "Overall") return ALL_USERS;
    if (activeTab === "Weekly") return WEEKLY_USERS;
    return CATEGORY_USERS[activeTab] || ALL_USERS;
  };

  const users = getUsers();
  const top3 = users.slice(0, 3);
  const tableUsers = users.slice(3);
  const visibleRows = isLoggedIn ? tableUsers : tableUsers.slice(0, 7);
  const blurredRows = isLoggedIn ? [] : tableUsers.slice(7, 14);

  const PODIUM_ORDER = [top3[1], top3[0], top3[2]];
  const PODIUM_HEIGHTS = ["80px", "110px", "60px"];
  const PODIUM_SIZES = ["1rem", "1.2rem", "1rem"];
  const PODIUM_MEDALS = ["🥈", "🥇", "🥉"];
  const PODIUM_RANKS = [2, 1, 3];

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      {/* Nav */}
      <nav style={{ padding: "1rem 2.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.97)", zIndex: 100 }}>
        <span onClick={() => navigate("/")} style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.3px", cursor: "pointer" }}>Data Rejected</span>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link to="/sql" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Practice</Link>
          <Link to="/leaderboard" style={{ fontSize: "0.85rem", color: "#2563eb", textDecoration: "none", fontWeight: 600, borderBottom: "2px solid #2563eb", paddingBottom: "2px" }}>Leaderboard</Link>
          <Link to="/blog" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Blog</Link>
          <Link to="/login" style={{ padding: "8px 18px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>Login </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)", borderBottom: "1px solid #e2e8f0", padding: "3.5rem 2.5rem 3rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#2563eb", background: "#ffffff", padding: "5px 14px", borderRadius: "20px", border: "1px solid #bfdbfe", marginBottom: "1.25rem", fontWeight: 600 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2563eb", display: "inline-block" }}></span>
          Updated in real time
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-1.5px", margin: "0 0 1rem", color: "#0f172a" }}>
          Global SQL Leaderboard
        </h1>
        <p style={{ fontSize: "1rem", color: "#64748b", lineHeight: 1.75, maxWidth: "480px", margin: "0 auto" }}>
          Ranked by problems solved, consistency and skill depth. Prove your ability — not just on paper.
        </p>
      </div>

      {/* Stats Strip */}
      <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "1.5rem 2.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", textAlign: "center" }}>
          {STATS.map(({ num, label }) => (
            <div key={label}>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-1px" }}>{num}</div>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "3rem 2.5rem" }}>

        {/* Tab Switcher */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "2.5rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "1rem" }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ padding: "8px 16px", borderRadius: "8px", border: "1.5px solid", borderColor: activeTab === tab ? "#2563eb" : "#e2e8f0", background: activeTab === tab ? "#eff6ff" : "#ffffff", color: activeTab === tab ? "#2563eb" : "#64748b", fontWeight: activeTab === tab ? 700 : 500, fontSize: "0.82rem", cursor: "pointer" }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Podium */}
        <div style={{ background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "2rem 2rem 0", marginBottom: "2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.72rem", color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Top 3 — {activeTab}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "1rem" }}>
            {PODIUM_ORDER.map((user, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: "200px" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>{PODIUM_MEDALS[i]}</div>
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#eff6ff", border: "2px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 800, color: "#2563eb", marginBottom: "8px" }}>
                  {user?.name?.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{ fontSize: PODIUM_SIZES[i], fontWeight: 800, color: "#0f172a", marginBottom: "2px", textAlign: "center" }}>{user?.name}</div>
                <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "4px" }}>{user?.country}</div>
                <div style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: 600, marginBottom: "8px" }}>{user?.solved} solved</div>
                <div style={{ background: BADGES[user?.badge]?.bg, color: BADGES[user?.badge]?.color, border: `1px solid ${BADGES[user?.badge]?.border}`, fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", marginBottom: "0" }}>{user?.badge}</div>
                <div style={{ height: PODIUM_HEIGHTS[i], background: i === 1 ? "#2563eb" : "#bfdbfe", width: "100%", borderRadius: "8px 8px 0 0", marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "1.2rem", fontWeight: 800, color: i === 1 ? "#fff" : "#2563eb" }}>#{PODIUM_RANKS[i]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}>

          {/* Table Header */}
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 100px 80px 140px 130px", gap: "0", padding: "0.75rem 1.25rem", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
            {["Rank", "Practitioner", "Country", "Solved", "Streak", "Top Strength", "Badge"].map(h => (
              <div key={h} style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</div>
            ))}
          </div>

          {/* Visible Rows */}
          {visibleRows.map((user, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 120px 100px 80px 140px 130px",
                gap: "0",
                padding: "0.875rem 1.25rem",
                borderBottom: "1px solid #f1f5f9",
                background: user.isCurrentUser ? "#eff6ff" : "#ffffff",
                borderLeft: user.isCurrentUser ? "3px solid #2563eb" : "3px solid transparent",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "0.88rem", fontWeight: 800, color: user.rank <= 3 ? "#2563eb" : "#64748b" }}>#{user.rank + 3}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: user.isCurrentUser ? "#dbeafe" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: user.isCurrentUser ? "#2563eb" : "#64748b", flexShrink: 0 }}>
                  {user.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0f172a" }}>{user.name}{user.isCurrentUser && <span style={{ fontSize: "0.7rem", color: "#2563eb", background: "#eff6ff", padding: "1px 6px", borderRadius: "6px", marginLeft: "6px", fontWeight: 700 }}>You</span>}</div>
                </div>
              </div>
              <div style={{ fontSize: "0.82rem", color: "#64748b" }}>{user.country}</div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>{user.solved}</div>
              <div style={{ fontSize: "0.82rem", color: "#f59e0b", fontWeight: 600 }}>🔥 {user.streak}</div>
              <div style={{ fontSize: "0.75rem", color: "#2563eb", background: "#eff6ff", padding: "3px 8px", borderRadius: "6px", fontWeight: 500, width: "fit-content" }}>{user.strength}</div>
              <div style={{ fontSize: "0.7rem", padding: "3px 8px", borderRadius: "10px", fontWeight: 600, background: BADGES[user.badge]?.bg, color: BADGES[user.badge]?.color, border: `1px solid ${BADGES[user.badge]?.border}`, width: "fit-content" }}>{user.badge}</div>
            </div>
          ))}

          {/* Blurred Rows */}
          {blurredRows.map((user, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 120px 100px 80px 140px 130px",
                padding: "0.875rem 1.25rem",
                borderBottom: "1px solid #f1f5f9",
                filter: "blur(4px)",
                userSelect: "none",
                pointerEvents: "none",
                opacity: 0.6,
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#64748b" }}>#{user.rank + 3}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f1f5f9" }}></div>
                <div style={{ fontSize: "0.88rem", fontWeight: 600 }}>{user.name}</div>
              </div>
              <div style={{ fontSize: "0.82rem", color: "#64748b" }}>{user.country}</div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700 }}>{user.solved}</div>
              <div style={{ fontSize: "0.82rem" }}>🔥 {user.streak}</div>
              <div style={{ fontSize: "0.75rem" }}>{user.strength}</div>
              <div style={{ fontSize: "0.7rem" }}>{user.badge}</div>
            </div>
          ))}

          {/* Sign Up Overlay */}
          {!isLoggedIn && (
            <div style={{ padding: "2.5rem", textAlign: "center", background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 40%)", borderTop: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>See where you rank</div>
              <p style={{ fontSize: "0.88rem", color: "#64748b", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                Sign up free to see the full leaderboard, track your rank and compete with practitioners worldwide.
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <Link to="/signup" style={{ padding: "10px 24px", background: "#2563eb", color: "#fff", borderRadius: "8px", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>
                  Sign Up Free →
                </Link>
                <Link to="/login" style={{ padding: "10px 24px", background: "#ffffff", color: "#2563eb", borderRadius: "8px", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none", border: "1.5px solid #bfdbfe" }}>
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "2rem 2.5rem", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "960px", margin: "0 auto", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>© 2025 Data Rejected. All rights reserved.</span>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link to="/privacy" style={{ fontSize: "0.75rem", color: "#64748b", textDecoration: "none" }}>Privacy Policy</Link>
            <Link to="/terms" style={{ fontSize: "0.75rem", color: "#64748b", textDecoration: "none" }}>Terms of Use</Link>
            <Link to="/contact" style={{ fontSize: "0.75rem", color: "#64748b", textDecoration: "none" }}>Contact</Link>
          </div>
        </div>
      </div>

    </div>
  );
}