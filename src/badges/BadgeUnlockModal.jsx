import { useState, useEffect } from "react";
import { getTierStyle } from "./badgeUtils";
// import { BadgePill } from "./BadgeCard";

// ─── CONFETTI ─────────────────────────────────────────────────────────────────

function Confetti({ color }) {
  const pieces = Array.from({ length: 18 }, (_, i) => i);

  return (
    <div style={{
      position:      "absolute",
      inset:         0,
      pointerEvents: "none",
      overflow:      "hidden",
      borderRadius:  "inherit",
    }}>
      {pieces.map((i) => {
        const left    = `${(i / 18) * 100}%`;
        const delay   = `${(i * 0.08).toFixed(2)}s`;
        const size    = `${4 + (i % 4)}px`;
        const rotate  = `${i * 37}deg`;
        const shape   = i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "0";

        return (
          <div
            key={i}
            style={{
              position:        "absolute",
              top:             "-10px",
              left,
              width:           size,
              height:          size,
              background:      i % 2 === 0 ? color : "#fbbf24",
              borderRadius:    shape,
              transform:       `rotate(${rotate})`,
              animation:       `confettiFall 1.4s ${delay} ease-in forwards`,
              opacity:         0,
            }}
          />
        );
      })}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg);    opacity: 1; }
          100% { transform: translateY(280px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── SINGLE BADGE UNLOCK PANEL ────────────────────────────────────────────────

function UnlockPanel({ badge, onShare, onViewBadges, onClose, isMobile }) {
  const tier     = getTierStyle(badge);
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPopped(true), 80);
    return () => clearTimeout(t);
  }, []);

  const linkedInText = encodeURIComponent(badge.shareText || `I just earned the ${badge.title} badge on Repractiq!`);
  const linkedInUrl  = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://repractiq.com")}&summary=${linkedInText}`;

  return (
    <div style={{
      background:    "#ffffff",
      borderRadius:  "20px",
      padding:       isMobile ? "1.75rem 1.25rem" : "2.25rem 2rem",
      width:         "100%",
      maxWidth:      "420px",
      textAlign:     "center",
      position:      "relative",
      overflow:      "hidden",
      boxShadow:     "0 24px 60px rgba(0,0,0,0.18)",
      transform:     popped ? "scale(1)" : "scale(0.88)",
      opacity:       popped ? 1 : 0,
      transition:    "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
    }}>
      {/* Confetti */}
      <Confetti color={tier.color} />

      {/* Top accent bar */}
      <div style={{
        position:     "absolute",
        top:          0,
        left:         0,
        right:        0,
        height:       "4px",
        background:   `linear-gradient(90deg, ${tier.color}, #fbbf24, ${tier.color})`,
      }} />

      {/* Tier label */}
      <div style={{
        display:       "inline-flex",
        alignItems:    "center",
        gap:           "5px",
        fontSize:      "0.65rem",
        fontWeight:    700,
        color:         tier.color,
        background:    tier.bg,
        border:        `1px solid ${tier.border}`,
        borderRadius:  "20px",
        padding:       "3px 10px",
        marginBottom:  "1rem",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}>
        <span style={{
          width:       "5px",
          height:      "5px",
          borderRadius:"50%",
          background:  tier.color,
          display:     "inline-block",
        }} />
        {tier.label} Badge Unlocked
      </div>

      {/* Icon */}
      <div style={{
        fontSize:     "4rem",
        lineHeight:   1,
        marginBottom: "0.75rem",
        animation:    "badgeBounce 0.6s 0.3s ease both",
      }}>
        {badge.icon}
      </div>

      {/* Title */}
      <h2 style={{
        fontSize:      "1.4rem",
        fontWeight:    800,
        color:         "#0f172a",
        margin:        "0 0 0.375rem",
        letterSpacing: "-0.5px",
      }}>
        {badge.title}
      </h2>

      {/* Description */}
      <p style={{
        fontSize:     "0.85rem",
        color:        "#64748b",
        lineHeight:   1.65,
        margin:       "0 0 1.5rem",
        maxWidth:     "300px",
        marginLeft:   "auto",
        marginRight:  "auto",
      }}>
        {badge.description}
      </p>

      {/* Certificate note for certificate badges */}
      {badge.certificate && (
        <div style={{
          background:   "#fffbeb",
          border:       "1px solid #fde68a",
          borderRadius: "8px",
          padding:      "0.5rem 0.875rem",
          fontSize:     "0.75rem",
          color:        "#92400e",
          fontWeight:   600,
          marginBottom: "1.25rem",
        }}>
          🎓 A shareable certificate is now available on your profile
        </div>
      )}

      {/* Action buttons */}
      <div style={{
        display:       "flex",
        flexDirection: "column",
        gap:           "8px",
        marginBottom:  "0.875rem",
      }}>
        {/* LinkedIn share */}
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            gap:            "7px",
            padding:        "10px 20px",
            borderRadius:   "8px",
            background:     "#0a66c2",
            color:          "#fff",
            fontWeight:     700,
            fontSize:       "0.85rem",
            textDecoration: "none",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Share on LinkedIn
        </a>

        {/* View all badges */}
        <button
          onClick={onViewBadges}
          style={{
            padding:      "10px 20px",
            borderRadius: "8px",
            background:   tier.bg,
            color:        tier.color,
            border:       `1.5px solid ${tier.border}`,
            fontWeight:   700,
            fontSize:     "0.85rem",
            cursor:       "pointer",
          }}
        >
          View all my badges →
        </button>
      </div>

      {/* Dismiss */}
      <button
        onClick={onClose}
        style={{
          background:  "none",
          border:      "none",
          color:       "#94a3b8",
          fontSize:    "0.78rem",
          cursor:      "pointer",
          fontWeight:  500,
        }}
      >
        Continue practicing
      </button>

      <style>{`
        @keyframes badgeBounce {
          0%   { transform: scale(0.5) rotate(-10deg); opacity: 0; }
          60%  { transform: scale(1.15) rotate(4deg);  opacity: 1; }
          100% { transform: scale(1) rotate(0deg);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── MULTI-BADGE QUEUE ────────────────────────────────────────────────────────
// If multiple badges unlock at once, show them one at a time

function MultiQueue({ badges, onDone, onViewBadges, isMobile }) {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index < badges.length - 1) {
      setIndex(index + 1);
    } else {
      onDone();
    }
  };

  return (
    <div>
      {/* Counter when multiple badges */}
      {badges.length > 1 && (
        <div style={{
          textAlign:    "center",
          marginBottom: "1rem",
          fontSize:     "0.75rem",
          color:        "#fff",
          fontWeight:   600,
          opacity:      0.7,
        }}>
          {index + 1} of {badges.length} badges unlocked
        </div>
      )}
      <UnlockPanel
        key={badges[index].id}
        badge={badges[index]}
        onShare={() => {}}
        onViewBadges={onViewBadges}
        onClose={handleNext}
        isMobile={isMobile}
      />
      {/* Dot indicators */}
      {badges.length > 1 && (
        <div style={{
          display:        "flex",
          justifyContent: "center",
          gap:            "6px",
          marginTop:      "1rem",
        }}>
          {badges.map((_, i) => (
            <div key={i} style={{
              width:        i === index ? "20px" : "6px",
              height:       "6px",
              borderRadius: "3px",
              background:   i === index ? "#ffffff" : "rgba(255,255,255,0.3)",
              transition:   "width 0.2s ease",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN MODAL ───────────────────────────────────────────────────────────────

/**
 * BadgeUnlockModal — celebration modal shown when badges are newly earned.
 *
 * Props:
 *   badges       {object[]}  — array of newly unlocked badge objects
 *   isOpen       {boolean}
 *   onClose      {function}  — called when dismissed
 *   onViewBadges {function}  — navigate to profile badges tab
 *   isMobile     {boolean}
 *
 * Usage in your SQL practice pages:
 *   const [unlockedBadges, setUnlockedBadges] = useState([]);
 *
 *   // After correct submission:
 *   const newBadges = await checkAndSaveBadges(userId);
 *   if (newBadges.length > 0) setUnlockedBadges(newBadges);
 *
 *   <BadgeUnlockModal
 *     badges={unlockedBadges}
 *     isOpen={unlockedBadges.length > 0}
 *     onClose={() => setUnlockedBadges([])}
 *     onViewBadges={() => navigate("/profile?tab=badges")}
 *     isMobile={isMobile}
 *   />
 */
export default function BadgeUnlockModal({
  badges    = [],
  isOpen    = false,
  onClose,
  onViewBadges,
  isMobile  = false,
}) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || badges.length === 0) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:       "fixed",
        inset:          0,
        background:     "rgba(15,23,42,0.75)",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        zIndex:         3000,
        padding:        isMobile ? "1rem" : "2rem",
        backdropFilter: "blur(4px)",
      }}
    >
      <MultiQueue
        badges={badges}
        onDone={onClose}
        onViewBadges={() => { onClose(); onViewBadges?.(); }}
        isMobile={isMobile}
      />
    </div>
  );
}