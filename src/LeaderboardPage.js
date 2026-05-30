import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

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
  "SQL Master":      { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  "Streak King":     { color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  "Top Solver":      { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  "Rising Star":     { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  "Interview Pro":   { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  "Scenario Expert": { color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc" },
  "Consistent":      { color: "#64748b", bg: "#f8fafc", border: "#e2e8f0" },
};

const CATEGORY_MAP = {
  "SQL Basics":       "sql_basics",
  "SQL Intermediate": "sql_intermediate",
  "SQL Advanced":     "sql_advanced",
  "SQL Interview":    "sql_interview",
  "SQL Scenarios":    "sql_scenario",
};

const STRENGTH_LABEL = {
  sql_basics:       "Basics",
  sql_intermediate: "Intermediate",
  sql_advanced:     "Advanced",
  sql_interview:    "Interview",
  sql_scenario:     "Scenarios",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function getBadge(solved, streak) {
  if (streak >= 30)  return "Streak King";
  if (solved >= 100) return "SQL Master";
  if (solved >= 50)  return "Top Solver";
  if (streak >= 7)   return "Consistent";
  return "Rising Star";
}

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⏳</div>
        <div style={{ fontSize: "0.88rem", color: "#64748b" }}>Loading leaderboard...</div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]     = useState("Overall");
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [allUsers, setAllUsers]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [stats, setStats]             = useState({ total: 0, today: 0, countries: 0 });

  // ── Fetch everything on mount ─────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      // 1. Check auth
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      setIsLoggedIn(!!session);
      setCurrentUserId(session?.user?.id || null);

      // 2. Fetch all correct submissions
      const { data: allCorrect } = await supabase
        .from("submissions")
        .select("user_id, problem_id, category, updated_at")
        .eq("status", "correct");

      // 3. Fetch all profiles
      const { data: allProfiles } = await supabase
        .from("profiles")
        .select("id, full_name, country");

      // 4. Fetch all streaks
      const { data: allStreaks } = await supabase
        .from("user_streaks")
        .select("user_id, current_streak");

      const profileMap = {};
      (allProfiles || []).forEach((p) => {
        profileMap[p.id] = { name: p.full_name || "Anonymous", country: p.country || "🌍 Unknown" };
      });

      const streakMap = {};
      (allStreaks || []).forEach((s) => {
        streakMap[s.user_id] = s.current_streak || 0;
      });

      // 5. Build per-user stats
      const userMap = {};
      (allCorrect || []).forEach(({ user_id, problem_id, category, updated_at }) => {
        if (!userMap[user_id]) {
          userMap[user_id] = {
            userId: user_id,
            solvedSet: new Set(),
            categoryCount: {},
            weeklySolvedSet: new Set(),
            categorySolvedSets: {},
          };
        }

        const u = userMap[user_id];
        const key = `${category}-${problem_id}`;
        u.solvedSet.add(key);

        // Weekly
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (new Date(updated_at) >= weekAgo) {
          u.weeklySolvedSet.add(key);
        }

        // Category counts
        u.categoryCount[category] = (u.categoryCount[category] || 0) + 1;

        // Per-category solved sets
        if (!u.categorySolvedSets[category]) u.categorySolvedSets[category] = new Set();
        u.categorySolvedSets[category].add(problem_id);
      });

      // 6. Build final user list
      const built = Object.values(userMap).map((u) => {
        const profile  = profileMap[u.userId] || { name: "Anonymous", country: "🌍 Unknown" };
        const streak   = streakMap[u.userId] || 0;
        const solved   = u.solvedSet.size;
        const weekly   = u.weeklySolvedSet.size;

        // Top strength = category with most correct submissions
        const topCat = Object.entries(u.categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "sql_basics";

        return {
          userId:            u.userId,
          name:              profile.name,
          country:           profile.country,
          solved,
          weekly,
          streak,
          strength:          STRENGTH_LABEL[topCat] || "Basics",
          badge:             getBadge(solved, streak),
          categoryCount:     u.categoryCount,
          categorySolvedSets: u.categorySolvedSets,
        };
      });

      // 7. Stats
      const today = new Date().toISOString().split("T")[0];
      const solvedToday = (allCorrect || []).filter(s => s.updated_at?.startsWith(today)).length;
      const uniqueCountries = new Set((allProfiles || []).map(p => p.country).filter(Boolean)).size;

      setStats({
        total:     Object.keys(userMap).length,
        today:     solvedToday,
        countries: uniqueCountries,
      });

      setAllUsers(built);
      setLoading(false);
    };

    load();
  }, []);

  // ── Tab filtering ─────────────────────────────────────────────────────────
  const getUsers = () => {
    let list = [...allUsers];

    if (activeTab === "Weekly") {
      list.sort((a, b) => b.weekly - a.weekly);
      return list.map((u, i) => ({ ...u, rank: i + 1, displaySolved: u.weekly }));
    }

    if (CATEGORY_MAP[activeTab]) {
      const cat = CATEGORY_MAP[activeTab];
      list = list
        .map((u) => ({
          ...u,
          displaySolved: u.categorySolvedSets[cat]?.size || 0,
        }))
        .filter((u) => u.displaySolved > 0)
        .sort((a, b) => b.displaySolved - a.displaySolved);
      return list.map((u, i) => ({ ...u, rank: i + 1 }));
    }

    // Overall
    list.sort((a, b) => b.solved - a.solved);
    return list.map((u, i) => ({ ...u, rank: i + 1, displaySolved: u.solved }));
  };

  if (loading) return <LoadingScreen />;

  const users   = getUsers();
  const top3 = users.slice(0, Math.min(3, users.length));

  // For guests: show 7, blur 7, hide rest
  const tableUsers  = users; // show ALL users in table including top 3
  const visibleRows = isLoggedIn ? tableUsers : tableUsers.slice(0, 7);
  const blurredRows = isLoggedIn ? [] : tableUsers.slice(7, 14);

  // Current user rank
  const myRank = users.findIndex((u) => u.userId === currentUserId) + 1;
  const myUser = users.find((u) => u.userId === currentUserId);

  const PODIUM_ORDER = top3.length === 3
  ? [top3[1], top3[0], top3[2]]
  : top3.length === 2
  ? [top3[1], top3[0], null]
  : [null, top3[0], null];

const PODIUM_HEIGHTS = top3.length === 3 
  ? ["80px", "110px", "60px"]
  : ["80px", "110px", "0px"];

const PODIUM_SIZES  = ["1rem", "1.2rem", "1rem"];
const PODIUM_MEDALS = ["🥈", "🥇", "🥉"];
const PODIUM_RANKS  = [2, 1, 3];

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      {/* Nav */}
      <nav style={{ padding: "1rem 2.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.97)", zIndex: 100 }}>
        <span onClick={() => navigate("/")} style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.3px", cursor: "pointer" }}>Data Rejected</span>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link to="/sql"          style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>Practice</Link>
          <Link to="/leaderboard"  style={{ fontSize: "0.85rem", color: "#2563eb", textDecoration: "none", fontWeight: 600, borderBottom: "2px solid #2563eb", paddingBottom: "2px" }}>Leaderboard</Link>
          <Link to="/blog"         style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>Blog</Link>
          {isLoggedIn ? (
            <Link to="/home" style={{ padding: "8px 18px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>Home</Link>
          ) : (
            <Link to="/login" style={{ padding: "8px 18px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>Login</Link>
          )}
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
          {[
            { num: stats.total.toLocaleString(),    label: "Total Practitioners" },
            { num: stats.today.toLocaleString(),    label: "Problems Solved Today" },
            { num: stats.countries.toLocaleString(), label: "Countries Represented" },
            { num: "Free",                           label: "To Start" },
          ].map(({ num, label }) => (
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
        {top3.length > 0 && (
  <div style={{ background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "2rem 2rem 0", marginBottom: "2rem" }}>
    <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
      <div style={{ fontSize: "0.72rem", color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Top 3 — {activeTab}</div>
    </div>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "1rem", width: "100%", maxWidth: "500px", margin: "0 auto" }}>
      {PODIUM_ORDER.map((user, i) => user ? (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, maxWidth: "200px" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>{PODIUM_MEDALS[i]}</div>
          <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#eff6ff", border: "2px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", fontWeight: 800, color: "#2563eb", marginBottom: "8px" }}>
            {getInitials(user?.name)}
          </div>
          <div style={{ fontSize: PODIUM_SIZES[i], fontWeight: 800, color: "#0f172a", marginBottom: "2px", textAlign: "center" }}>{user?.name}</div>
          <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "4px" }}>{user?.country}</div>
          <div style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: 600, marginBottom: "8px" }}>{user?.displaySolved} solved</div>
          <div style={{ background: BADGES[user?.badge]?.bg, color: BADGES[user?.badge]?.color, border: `1px solid ${BADGES[user?.badge]?.border}`, fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: "10px" }}>{user?.badge}</div>
          <div style={{ height: PODIUM_HEIGHTS[i], background: i === 1 ? "#2563eb" : "#bfdbfe", width: "100%", borderRadius: "8px 8px 0 0", marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "1.2rem", fontWeight: 800, color: i === 1 ? "#fff" : "#2563eb" }}>#{PODIUM_RANKS[i]}</span>
          </div>
        </div>
      ) : (
        <div key={i} style={{ flex: 1, maxWidth: "200px" }} />
      ))}
    </div>
  </div>
)}

{/* My Rank Banner — logged in and not in top 3 */}
{isLoggedIn && myUser && myRank > 3 && (
  <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: "#fff" }}>
        {getInitials(myUser.name)}
      </div>
      <div>
        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1d4ed8" }}>Your rank: #{myRank}</div>
        <div style={{ fontSize: "0.75rem", color: "#3b82f6" }}>{myUser.displaySolved} solved · 🔥 {myUser.streak}d streak</div>
      </div>
    </div>
    <div style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: 600 }}>
      {myRank > 1 ? `${users[myRank - 2]?.displaySolved - myUser.displaySolved + 1} more to reach #${myRank - 1}` : "You're #1! 🎉"}
    </div>
  </div>
)}

        {/* Leaderboard Table */}
        {users.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8", fontSize: "0.88rem" }}>
            No data yet for this category.
          </div>
        ) : (
          <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "16px", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 100px 80px 140px 130px", padding: "0.75rem 1.25rem", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Rank", "Practitioner", "Country", "Solved", "Streak", "Top Strength", "Badge"].map(h => (
                <div key={h} style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</div>
              ))}
            </div>

            {/* Visible Rows */}
            {visibleRows.map((user, i) => {
              const isMe = user.userId === currentUserId;
              return (
                <div
                  key={user.userId}
                  style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 100px 80px 140px 130px", padding: "0.875rem 1.25rem", borderBottom: "1px solid #f1f5f9", background: isMe ? "#eff6ff" : "#ffffff", borderLeft: isMe ? "3px solid #2563eb" : "3px solid transparent", alignItems: "center" }}
                >
                  <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#64748b" }}>#{user.rank}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: isMe ? "#dbeafe" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: isMe ? "#2563eb" : "#64748b", flexShrink: 0 }}>
                      {getInitials(user.name)}
                    </div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0f172a" }}>
                      {user.name}
                      {isMe && <span style={{ fontSize: "0.7rem", color: "#2563eb", background: "#eff6ff", padding: "1px 6px", borderRadius: "6px", marginLeft: "6px", fontWeight: 700 }}>You</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#64748b" }}>{user.country}</div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>{user.displaySolved}</div>
                  <div style={{ fontSize: "0.82rem", color: "#f59e0b", fontWeight: 600 }}>🔥 {user.streak}</div>
                  <div style={{ fontSize: "0.75rem", color: "#2563eb", background: "#eff6ff", padding: "3px 8px", borderRadius: "6px", fontWeight: 500, width: "fit-content" }}>{user.strength}</div>
                  <div style={{ fontSize: "0.7rem", padding: "3px 8px", borderRadius: "10px", fontWeight: 600, background: BADGES[user.badge]?.bg, color: BADGES[user.badge]?.color, border: `1px solid ${BADGES[user.badge]?.border}`, width: "fit-content" }}>{user.badge}</div>
                </div>
              );
            })}

            {/* Blurred Rows */}
            {blurredRows.map((user, i) => (
              <div
                key={i}
                style={{ display: "grid", gridTemplateColumns: "60px 1fr 120px 100px 80px 140px 130px", padding: "0.875rem 1.25rem", borderBottom: "1px solid #f1f5f9", filter: "blur(4px)", userSelect: "none", pointerEvents: "none", opacity: 0.6, alignItems: "center" }}
              >
                <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#64748b" }}>#{user.rank}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f1f5f9" }} />
                  <div style={{ fontSize: "0.88rem", fontWeight: 600 }}>{user.name}</div>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#64748b" }}>{user.country}</div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700 }}>{user.displaySolved}</div>
                <div style={{ fontSize: "0.82rem" }}>🔥 {user.streak}</div>
                <div style={{ fontSize: "0.75rem" }}>{user.strength}</div>
                <div style={{ fontSize: "0.7rem" }}>{user.badge}</div>
              </div>
            ))}

            {/* Signup Overlay — guests only */}
            {!isLoggedIn && (
              <div style={{ padding: "2.5rem", textAlign: "center", background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 40%)", borderTop: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>See where you rank</div>
                <p style={{ fontSize: "0.88rem", color: "#64748b", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                  Sign up free to see the full leaderboard, track your rank and compete with practitioners worldwide.
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <Link to="/signup" style={{ padding: "10px 24px", background: "#2563eb", color: "#fff", borderRadius: "8px", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>Sign Up Free →</Link>
                  <Link to="/login"  style={{ padding: "10px 24px", background: "#ffffff", color: "#2563eb", borderRadius: "8px", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none", border: "1.5px solid #bfdbfe" }}>Sign In</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "2rem 2.5rem", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "960px", margin: "0 auto", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>© 2025 Data Rejected. All rights reserved.</span>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link to="/privacy" style={{ fontSize: "0.75rem", color: "#64748b", textDecoration: "none" }}>Privacy Policy</Link>
            <Link to="/terms"   style={{ fontSize: "0.75rem", color: "#64748b", textDecoration: "none" }}>Terms of Use</Link>
            <Link to="/contact" style={{ fontSize: "0.75rem", color: "#64748b", textDecoration: "none" }}>Contact</Link>
          </div>
        </div>
      </div>

    </div>
  );
}

