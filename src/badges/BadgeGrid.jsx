import { useState } from "react";
import BadgeCard from "./BadgeCard";
import { CATEGORY_LABELS, TIER_STYLES } from "./badgeDefinitions";
import { getSectionBadgesByCategory } from "./badgeUtils";
import CertificateCard from "./CertificateCard";

// ─── SECTION HEADER ───────────────────────────────────────────────────────────

function SectionHeader({ label, earned, total }) {
  return (
    <div style={{
      display:        "flex",
      alignItems:     "center",
      justifyContent: "space-between",
      marginBottom:   "0.875rem",
    }}>
      <div>
        <div style={{
          fontSize:      "0.68rem",
          fontWeight:    700,
          color:         "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          marginBottom:  "2px",
        }}>
          {label}
        </div>
      </div>
      <div style={{
        fontSize:   "0.72rem",
        fontWeight: 600,
        color:      earned === total ? "#16a34a" : "#94a3b8",
        background: earned === total ? "#f0fdf4" : "#f8fafc",
        border:     `1px solid ${earned === total ? "#bbf7d0" : "#e2e8f0"}`,
        borderRadius: "20px",
        padding:    "2px 10px",
      }}>
        {earned} / {total} earned
      </div>
    </div>
  );
}

// ─── CATEGORY ROW ─────────────────────────────────────────────────────────────
// FIXED: Added setClickedBadge to destructured props here
function CategoryRow({ categoryKey, badges, countMap, earnedIds, isMobile, setClickedBadge }) {
  const label         = CATEGORY_LABELS[categoryKey] || categoryKey;
  const currentCount  = countMap[categoryKey] || 0;
  const earnedInCat   = badges.filter((b) => earnedIds.includes(b.id)).length;

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {/* Category label */}
      <div style={{
        display:      "flex",
        alignItems:   "center",
        gap:          "8px",
        marginBottom: "0.625rem",
      }}>
        <div style={{
          fontSize:   "0.75rem",
          fontWeight: 700,
          color:      "#0f172a",
        }}>
          {label}
        </div>
        <div style={{
          fontSize:      "0.65rem",
          color:         "#94a3b8",
          background:    "#f1f5f9",
          borderRadius:  "20px",
          padding:       "1px 8px",
          fontWeight:    600,
        }}>
          {currentCount} solved
        </div>
        {earnedInCat > 0 && (
          <div style={{
            fontSize:   "0.65rem",
            color:      "#16a34a",
            background: "#f0fdf4",
            border:     "1px solid #bbf7d0",
            borderRadius: "20px",
            padding:    "1px 8px",
            fontWeight: 600,
          }}>
            {earnedInCat} badge{earnedInCat > 1 ? "s" : ""} earned
          </div>
        )}
      </div>

      {/* Badge cards */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
        gap:                 "10px",
      }}>
        {badges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            earned={earnedIds.includes(badge.id)}
            current={currentCount}
            size="md"
            showProgress={true}
            onClick={earnedIds.includes(badge.id) ? () => setClickedBadge(badge) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

// ─── TAB BAR ──────────────────────────────────────────────────────────────────

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{
      display:      "flex",
      gap:          "4px",
      background:   "#f8fafc",
      border:       "1px solid #e2e8f0",
      borderRadius: "10px",
      padding:      "4px",
      marginBottom: "1.5rem",
      overflowX:    "auto",
    }}>
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              flex:         "0 0 auto",
              padding:      "7px 14px",
              borderRadius: "7px",
              border:       "none",
              background:   isActive ? "#ffffff" : "transparent",
              color:        isActive ? "#0f172a" : "#64748b",
              fontWeight:   isActive ? 700 : 500,
              fontSize:     "0.78rem",
              cursor:       "pointer",
              boxShadow:    isActive ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              whiteSpace:   "nowrap",
              transition:   "all 0.15s",
            }}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span style={{
                marginLeft:   "6px",
                fontSize:     "0.65rem",
                background:   isActive ? "#eff6ff" : "#f1f5f9",
                color:        isActive ? "#2563eb" : "#94a3b8",
                borderRadius: "20px",
                padding:      "1px 6px",
                fontWeight:   700,
              }}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── GRANDMASTER BANNER ───────────────────────────────────────────────────────

function GrandmasterBanner({ badge, earned }) {
  const tier = TIER_STYLES.diamond;

  return (
    <div style={{
      background:   earned
        ? "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)"
        : "#f8fafc",
      border:       `2px solid ${earned ? tier.color : "#e2e8f0"}`,
      borderRadius: "16px",
      padding:      "1.5rem",
      display:      "flex",
      gap:          "1.25rem",
      alignItems:   "center",
      marginBottom: "2rem",
      position:     "relative",
      overflow:     "hidden",
    }}>
      {/* Background glow for earned state */}
      {earned && (
        <div style={{
          position:     "absolute",
          right:        "-40px",
          top:          "-40px",
          width:        "180px",
          height:       "180px",
          borderRadius: "50%",
          background:   "rgba(34,184,204,0.12)",
          pointerEvents:"none",
        }} />
      )}

      {/* Icon */}
      <div style={{
        fontSize:   "3rem",
        lineHeight: 1,
        filter:     earned ? "none" : "grayscale(100%) opacity(0.3)",
        flexShrink: 0,
      }}>
        {badge.icon}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize:      "0.65rem",
          fontWeight:    700,
          color:         earned ? tier.color : "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom:  "4px",
        }}>
          {earned ? "✓ Unlocked" : "Ultimate Badge"}
        </div>
        <div style={{
          fontSize:     "1.1rem",
          fontWeight:   800,
          color:        earned ? "#ffffff" : "#0f172a",
          marginBottom: "4px",
          letterSpacing:"-0.3px",
        }}>
          {badge.title}
        </div>
        <div style={{
          fontSize:   "0.78rem",
          color:      earned ? "#94a3b8" : "#64748b",
          lineHeight: 1.6,
          maxWidth:   "480px",
        }}>
          {badge.description}
        </div>

        {/* Requirements when locked */}
        {!earned && (
          <div style={{
            marginTop:  "0.75rem",
            fontSize:   "0.7rem",
            color:      "#94a3b8",
            fontWeight: 600,
          }}>
            Requires: Complete all 5 Gold badges across every category
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN BADGE GRID ──────────────────────────────────────────────────────────

export default function BadgeGrid({ profileBadges, earnedIds = [], stats = {}, isMobile = false }) {
  const [activeTab, setActiveTab] = useState("section");
  const [clickedBadge, setClickedBadge] = useState(null);

  if (!profileBadges) return null;

  const { section, global, special, grandmaster } = profileBadges;

  // Count earned per group
  const sectionEarned = section.filter((b) => earnedIds.includes(b.id)).length;
  const globalEarned  = global.filter((b)  => earnedIds.includes(b.id)).length;
  const specialEarned = special.filter((b) => earnedIds.includes(b.id)).length;
  const totalEarned   = earnedIds.length;

  // Category → count map for progress bars
  const countMap = {
    sql_basics:       stats.basicsCount       || 0,
    sql_intermediate: stats.intermediateCount || 0,
    sql_advanced:     stats.advancedCount     || 0,
    sql_interview:    stats.interviewCount    || 0,
    sql_scenario:     stats.scenariosCount    || 0,
  };

  // Section badges grouped by category
  const byCategory = getSectionBadgesByCategory(earnedIds);

  const tabs = [
    { key: "section", label: "By Category",   count: sectionEarned },
    { key: "global",  label: "Global",         count: globalEarned  },
    { key: "special", label: "Achievements",   count: specialEarned },
  ];

  return (
    <div>
      {/* Summary strip */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
        gap:                 "10px",
        marginBottom:        "1.5rem",
      }}>
        {[
          { label: "Total earned",    val: totalEarned,   sub: `of ${section.length + global.length + special.length + 1} badges` },
          { label: "Category badges", val: sectionEarned, sub: `of ${section.length}` },
          { label: "Global badges",   val: globalEarned,  sub: `of ${global.length}`  },
          { label: "Achievements",    val: specialEarned, sub: `of ${special.length}` },
        ].map((s) => (
          <div key={s.label} style={{
            background:   "#f8fafc",
            border:       "1.5px solid #e2e8f0",
            borderRadius: "12px",
            padding:      "0.875rem 1rem",
            textAlign:    "center",
          }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", lineHeight: 1 }}>
              {s.val}
            </div>
            <div style={{ fontSize: "0.65rem", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "4px" }}>
              {s.label}
            </div>
            <div style={{ fontSize: "0.65rem", color: "#94a3b8", marginTop: "2px" }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Grandmaster banner always on top */}
      <GrandmasterBanner badge={grandmaster} earned={earnedIds.includes(grandmaster.id)} />

      {/* Tabs */}
      <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {/* ── Section / Category tab ── */}
      {activeTab === "section" && (
        <div>
          <SectionHeader
            label="Category Badges"
            earned={sectionEarned}
            total={section.length}
          />
          {Object.entries(byCategory).map(([catKey, badges]) => (
            <CategoryRow
              key={catKey}
              categoryKey={catKey}
              badges={badges}
              countMap={countMap}
              earnedIds={earnedIds}
              isMobile={isMobile}
              setClickedBadge={setClickedBadge} // FIXED: Passed the setter function here
            />
          ))}
        </div>
      )}

      {/* ── Global tab ── */}
      {activeTab === "global" && (
        <div>
          <SectionHeader
            label="Global Progress Badges"
            earned={globalEarned}
            total={global.length}
          />
          <div style={{
            display:             "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            gap:                 "10px",
          }}>
            {global.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                earned={earnedIds.includes(badge.id)}
                current={stats.totalCount || 0}
                size="md"
                showProgress={true}
                onClick={earnedIds.includes(badge.id) ? () => setClickedBadge(badge) : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Special Achievements tab ── */}
      {activeTab === "special" && (
        <div>
          <SectionHeader
            label="Special Achievements"
            earned={specialEarned}
            total={special.length}
          />
          <div style={{
            display:             "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            gap:                 "10px",
          }}>
            {special.map((badge) => {
              const currentForBadge = {
                streak:     stats.longestStreak  || 0,
                speed:      stats.todayCount     || 0,
                accuracy:   stats.accuracy       || 0,
                weekend:    stats.weekendCount   || 0,
                leaderboard: 0,
              }[badge.type] || 0;

              return (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  earned={earnedIds.includes(badge.id)}
                  current={currentForBadge}
                  size="md"
                  showProgress={badge.type !== "leaderboard"}
                  onClick={earnedIds.includes(badge.id) ? () => setClickedBadge(badge) : undefined}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Badge Detail Modal */}
      {clickedBadge && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setClickedBadge(null); }}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(15,23,42,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 3000, padding: "1rem",
            backdropFilter: "blur(4px)",
            overflowY: "auto",
          }}
        >
          <div style={{
            background: "#ffffff", borderRadius: "20px",
            width: "100%", maxWidth: "520px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
            overflow: "hidden",
          }}>
            {/* Modal header */}
            <div style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid #f1f5f9",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.75rem" }}>{clickedBadge.icon}</span>
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>{clickedBadge.title}</div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "2px" }}>{clickedBadge.description}</div>
                </div>
              </div>
              <button
                onClick={() => setClickedBadge(null)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", color: "#94a3b8", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* Certificate or simple share */}
            {clickedBadge.certificate ? (
              <div style={{ padding: "1rem" }}>
                <CertificateCard
                  badge={clickedBadge}
                  userName={stats?.fullName || "SQL Learner"}
                  solvedCount={stats?.totalCount || 0}
                  isMobile={isMobile}
                  onClose={() => setClickedBadge(null)}
                />
              </div>
            ) : (
              <div style={{ padding: "1.5rem" }}>
                {/* Share text preview */}
                <div style={{
                  background: "#f8fafc", border: "1px solid #e2e8f0",
                  borderRadius: "10px", padding: "1rem",
                  fontSize: "0.85rem", color: "#475569",
                  lineHeight: 1.65, marginBottom: "1.25rem",
                }}>
                  {clickedBadge.shareText}
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {/* LinkedIn */}
                  {/* FIXED: Restored missing opening '<a' tag hook hook here */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://repractiq.com")}&summary=${encodeURIComponent(clickedBadge.shareText || "")}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                      padding: "10px 20px", borderRadius: "8px",
                      background: "#0a66c2", color: "#fff",
                      fontWeight: 700, fontSize: "0.85rem", textDecoration: "none",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Share on LinkedIn
                  </a>

                  {/* Copy text */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(clickedBadge.shareText || "");
                    }}
                    style={{
                      padding: "10px 20px", borderRadius: "8px",
                      background: "#ffffff", color: "#64748b",
                      border: "1.5px solid #e2e8f0",
                      fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
                    }}
                  >
                    📋 Copy share text
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}