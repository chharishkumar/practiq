import { getTierStyle, getBadgeProgress, formatProgress } from "./badgeUtils";

/**
 * BadgeCard — renders a single badge in earned or locked state.
 *
 * Props:
 *   badge       {object}   — badge definition from badgeDefinitions.js
 *   earned      {boolean}  — true = full color, false = locked/grayed
 *   current     {number}   — current count toward this badge (for progress bar)
 *   size        {string}   — "sm" | "md" | "lg"  (default "md")
 *   onClick     {function} — optional click handler
 *   showProgress{boolean}  — show progress bar when not earned (default true)
 *   highlight   {boolean}  — glowing border, used for newly unlocked
 */
export default function BadgeCard({
  badge,
  earned       = false,
  current      = 0,
  size         = "md",
  onClick,
  showProgress = true,
  highlight    = false,
}) {
  if (!badge) return null;

  const tier    = getTierStyle(badge);
  const progress = getBadgeProgress(badge, current);
  const label   = formatProgress(badge, current);

  // ── Size tokens ────────────────────────────────────────────────────────────
  const sizes = {
    sm: { card: { padding: "0.625rem 0.75rem", borderRadius: "10px" }, icon: "1.4rem", title: "0.72rem", sub: "0.65rem" },
    md: { card: { padding: "1rem 1.125rem",    borderRadius: "12px" }, icon: "1.75rem", title: "0.82rem", sub: "0.72rem" },
    lg: { card: { padding: "1.25rem 1.375rem", borderRadius: "14px" }, icon: "2.2rem",  title: "0.95rem", sub: "0.78rem" },
  };
  const s = sizes[size] || sizes.md;

  // ── Color scheme ───────────────────────────────────────────────────────────
  const scheme = earned
    ? { bg: tier.bg, border: highlight ? tier.color : tier.border, color: tier.color }
    : { bg: "#f8fafc", border: "#e2e8f0", color: "#94a3b8" };

  // ── Glow animation for newly unlocked ─────────────────────────────────────
  const glowStyle = highlight
    ? { boxShadow: `0 0 0 3px ${tier.border}, 0 4px 20px ${tier.bg}` }
    : {};

  return (
    <div
      onClick={onClick}
      style={{
        ...s.card,
        background:  scheme.bg,
        border:      `1.5px solid ${scheme.border}`,
        cursor:      onClick ? "pointer" : "default",
        transition:  "border-color 0.15s, box-shadow 0.2s",
        position:    "relative",
        overflow:    "hidden",
        ...glowStyle,
      }}
      onMouseEnter={onClick ? (e) => {
        e.currentTarget.style.borderColor = tier.color;
      } : undefined}
      onMouseLeave={onClick ? (e) => {
        e.currentTarget.style.borderColor = scheme.border;
      } : undefined}
    >
      {/* Tier label top-right */}
      <div style={{
        position:   "absolute",
        top:        "8px",
        right:      "10px",
        fontSize:   "0.6rem",
        fontWeight: 700,
        color:      earned ? tier.color : "#cbd5e1",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}>
        {tier.label}
      </div>

      {/* Icon */}
      <div style={{
        fontSize:     s.icon,
        marginBottom: "6px",
        filter:       earned ? "none" : "grayscale(100%) opacity(0.4)",
        lineHeight:   1,
      }}>
        {badge.icon}
      </div>

      {/* Title */}
      <div style={{
        fontSize:     s.title,
        fontWeight:   700,
        color:        earned ? "#0f172a" : "#94a3b8",
        marginBottom: "3px",
        lineHeight:   1.3,
        paddingRight: "2rem", // avoid overlap with tier label
      }}>
        {badge.title}
      </div>

      {/* Description */}
      <div style={{
        fontSize:   s.sub,
        color:      earned ? "#64748b" : "#cbd5e1",
        lineHeight: 1.5,
        marginBottom: (!earned && showProgress && badge.threshold) ? "10px" : "0",
      }}>
        {badge.description}
      </div>

      {/* Progress bar — only when locked and threshold exists */}
      {!earned && showProgress && badge.threshold && (
        <div>
          <div style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
            marginBottom:   "4px",
          }}>
            <span style={{ fontSize: "0.62rem", color: "#94a3b8" }}>{label}</span>
            <span style={{ fontSize: "0.62rem", color: "#94a3b8", fontWeight: 600 }}>{progress}%</span>
          </div>
          <div style={{
            height:       "4px",
            background:   "#e2e8f0",
            borderRadius: "2px",
            overflow:     "hidden",
          }}>
            <div style={{
              width:        `${progress}%`,
              height:       "100%",
              background:   progress > 0 ? tier.color : "#e2e8f0",
              borderRadius: "2px",
              transition:   "width 0.4s ease",
              opacity:      0.6,
            }} />
          </div>
        </div>
      )}

      {/* Earned checkmark */}
      {earned && (
        <div style={{
          position:    "absolute",
          bottom:      "8px",
          right:       "10px",
          width:       "18px",
          height:      "18px",
          borderRadius:"50%",
          background:  tier.color,
          display:     "flex",
          alignItems:  "center",
          justifyContent: "center",
          fontSize:    "0.6rem",
          color:       "#fff",
          fontWeight:  700,
        }}>
          ✓
        </div>
      )}
    </div>
  );
}

// ─── COMPACT VARIANT ─────────────────────────────────────────────────────────
// Small pill used in leaderboard rows and nav

/**
 * BadgePill — inline badge pill showing icon + title.
 * Used in leaderboard rows, nav bar.
 */
export function BadgePill({ badge, size = "sm" }) {
  if (!badge) return null;
  const tier = getTierStyle(badge);
  const isSmall = size === "xs";

  return (
    <div style={{
      display:      "inline-flex",
      alignItems:   "center",
      gap:          "4px",
      background:   tier.bg,
      border:       `1px solid ${tier.border}`,
      borderRadius: "20px",
      padding:      isSmall ? "2px 7px" : "3px 10px",
      fontSize:     isSmall ? "0.62rem" : "0.68rem",
      fontWeight:   600,
      color:        tier.color,
      whiteSpace:   "nowrap",
    }}>
      <span style={{ fontSize: isSmall ? "0.7rem" : "0.8rem" }}>{badge.icon}</span>
      {badge.title}
    </div>
  );
}

// ─── ICON ONLY VARIANT ───────────────────────────────────────────────────────
// Tiny icon circle used in nav avatar area

/**
 * BadgeIcon — just the icon in a colored circle.
 * Used next to nav avatar.
 */
export function BadgeIcon({ badge, size = 24 }) {
  if (!badge) return null;
  const tier = getTierStyle(badge);

  return (
    <div
      title={badge.title}
      style={{
        width:          `${size}px`,
        height:         `${size}px`,
        borderRadius:   "50%",
        background:     tier.bg,
        border:         `1.5px solid ${tier.border}`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        fontSize:       `${size * 0.5}px`,
        flexShrink:     0,
      }}
    >
      {badge.icon}
    </div>
  );
}