import { useRef, useState } from "react";
import { getTierStyle } from "./badgeUtils";

// ─── CERTIFICATE DESIGN ───────────────────────────────────────────────────────

function CertificateDesign({ badge, userName, solvedCount, earnedDate, forExport = false }) {
  const tier = getTierStyle(badge);

  const dateStr = earnedDate
    ? new Date(earnedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div style={{
      width:          "680px",
      background:     "#ffffff",
      borderRadius:   forExport ? "0" : "16px",
      overflow:       "hidden",
      position:       "relative",
      fontFamily:     "Inter, -apple-system, sans-serif",
      boxShadow:      forExport ? "none" : "0 8px 40px rgba(0,0,0,0.12)",
      flexShrink:     0,
    }}>

      {/* Top border accent */}
      <div style={{
        height:     "6px",
        background: `linear-gradient(90deg, ${tier.color}, #fbbf24, ${tier.color})`,
      }} />

      {/* Main content */}
      <div style={{
        padding:  "2.5rem 3rem",
        position: "relative",
      }}>

        {/* Watermark corner decoration */}
        <div style={{
          position:     "absolute",
          top:          "20px",
          right:        "24px",
          fontSize:     "5rem",
          opacity:      0.04,
          lineHeight:   1,
          pointerEvents:"none",
          userSelect:   "none",
        }}>
          {badge.icon}
        </div>

        {/* Header row */}
        <div style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "flex-start",
          marginBottom:   "2rem",
        }}>
          <div>
            <div style={{
              fontSize:      "0.65rem",
              fontWeight:    700,
              color:         "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom:  "2px",
            }}>
              Repractiq
            </div>
            <div style={{
              fontSize:   "0.75rem",
              color:      "#64748b",
              fontWeight: 500,
            }}>
              repractiq.com
            </div>
          </div>

          {/* Tier badge */}
          <div style={{
            display:       "flex",
            alignItems:    "center",
            gap:           "5px",
            background:    tier.bg,
            border:        `1.5px solid ${tier.border}`,
            borderRadius:  "20px",
            padding:       "4px 12px",
            fontSize:      "0.65rem",
            fontWeight:    700,
            color:         tier.color,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}>
            <span style={{
              width:        "5px",
              height:       "5px",
              borderRadius: "50%",
              background:   tier.color,
              display:      "inline-block",
            }} />
            {tier.label} Achievement
          </div>
        </div>

        {/* Certificate title */}
        <div style={{
          fontSize:      "0.72rem",
          fontWeight:    700,
          color:         "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom:  "0.375rem",
        }}>
          Certificate of Achievement
        </div>

        {/* This is awarded to */}
        <div style={{
          fontSize:     "0.82rem",
          color:        "#64748b",
          marginBottom: "0.25rem",
        }}>
          This certifies that
        </div>

        {/* Name */}
        <div style={{
          fontSize:      "2rem",
          fontWeight:    800,
          color:         "#0f172a",
          letterSpacing: "-1px",
          marginBottom:  "0.25rem",
          lineHeight:    1.1,
        }}>
          {userName}
        </div>

        {/* Divider */}
        <div style={{
          width:        "48px",
          height:       "3px",
          background:   tier.color,
          borderRadius: "2px",
          margin:       "0.875rem 0",
        }} />

        {/* Achievement text */}
        <div style={{
          fontSize:     "0.85rem",
          color:        "#64748b",
          marginBottom: "0.5rem",
        }}>
          has successfully earned
        </div>

        {/* Badge icon + name */}
        <div style={{
          display:     "flex",
          alignItems:  "center",
          gap:         "12px",
          marginBottom:"1.25rem",
        }}>
          <div style={{
            fontSize:       "2.5rem",
            lineHeight:     1,
            background:     tier.bg,
            border:         `2px solid ${tier.border}`,
            borderRadius:   "12px",
            padding:        "8px 10px",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
          }}>
            {badge.icon}
          </div>
          <div>
            <div style={{
              fontSize:      "1.3rem",
              fontWeight:    800,
              color:         "#0f172a",
              letterSpacing: "-0.3px",
              lineHeight:    1.2,
            }}>
              {badge.title}
            </div>
            <div style={{
              fontSize:   "0.78rem",
              color:      "#64748b",
              marginTop:  "3px",
              lineHeight: 1.5,
            }}>
              {badge.description}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display:      "flex",
          gap:          "1.5rem",
          background:   "#f8fafc",
          border:       "1px solid #e2e8f0",
          borderRadius: "10px",
          padding:      "0.875rem 1.125rem",
          marginBottom: "1.5rem",
        }}>
          {[
            { label: "Problems Solved", val: solvedCount || "—" },
            { label: "Platform",        val: "Repractiq" },
            { label: "Date Earned",     val: dateStr },
          ].map((item) => (
            <div key={item.label} style={{ flex: 1 }}>
              <div style={{
                fontSize:      "0.6rem",
                fontWeight:    700,
                color:         "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom:  "3px",
              }}>
                {item.label}
              </div>
              <div style={{
                fontSize:   "0.82rem",
                fontWeight: 700,
                color:      "#0f172a",
              }}>
                {item.val}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          borderTop:      "1px solid #f1f5f9",
          paddingTop:     "1rem",
        }}>
          <div style={{
            fontSize:   "0.65rem",
            color:      "#cbd5e1",
            fontWeight: 500,
          }}>
            Verify at repractiq.com · SQL Practice Platform
          </div>
          <div style={{
            fontSize:   "0.65rem",
            color:      "#cbd5e1",
            fontWeight: 500,
          }}>
            © {new Date().getFullYear()} Repractiq
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div style={{
        height:     "3px",
        background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)`,
      }} />
    </div>
  );
}

// ─── MAIN CERTIFICATE CARD ────────────────────────────────────────────────────

/**
 * CertificateCard — renders a certificate and provides download + share actions.
 *
 * Props:
 *   badge        {object}   — badge definition (must have certificate: true)
 *   userName     {string}   — full name of the user
 *   solvedCount  {number}   — total problems solved
 *   earnedDate   {string}   — ISO date string when badge was earned
 *   isMobile     {boolean}
 *   onClose      {function} — optional, if shown inside a modal
 */
export default function CertificateCard({
  badge,
  userName    = "SQL Learner",
  solvedCount = 0,
  earnedDate,
  isMobile    = false,
  onClose,
}) {
  const certRef  = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied]           = useState(false);

  if (!badge) return null;

  // const tier = getTierStyle(badge);

  // ── Download as PNG ────────────────────────────────────────────────────────
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(certRef.current, {
        scale:           2,
        useCORS:         true,
        backgroundColor: "#ffffff",
        logging:         false,
      });
      const link      = document.createElement("a");
      link.download   = `repractiq-${badge.id}-certificate.png`;
      link.href       = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Certificate download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  // ── Copy share link ────────────────────────────────────────────────────────
  const handleCopyLink = () => {
    const url = `https://repractiq.com/certificate/${badge.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── LinkedIn share ─────────────────────────────────────────────────────────
  const linkedInText = encodeURIComponent(
    badge.shareText || `I just earned the ${badge.title} badge on Repractiq!`
  );
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://repractiq.com")}&summary=${linkedInText}`;

  return (
    <div style={{
      background:   "#ffffff",
      borderRadius: "16px",
      overflow:     "hidden",
      border:       "1.5px solid #e2e8f0",
    }}>
      {/* Header */}
      <div style={{
        padding:        "1rem 1.375rem",
        borderBottom:   "1px solid #f1f5f9",
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "center",
        background:     "#f8fafc",
      }}>
        <div>
          <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Shareable Certificate
          </div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
            {badge.icon} {badge.title}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.1rem", cursor: "pointer" }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Certificate preview — scrollable on mobile */}
      <div style={{
        overflowX: "auto",
        padding:   isMobile ? "1rem" : "1.5rem",
        background:"#f8fafc",
        display:   "flex",
        justifyContent: "center",
      }}>
        <div ref={certRef}>
          <CertificateDesign
            badge={badge}
            userName={userName}
            solvedCount={solvedCount}
            earnedDate={earnedDate}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div style={{
        padding:    "1rem 1.375rem",
        borderTop:  "1px solid #f1f5f9",
        display:    "flex",
        gap:        "8px",
        flexWrap:   "wrap",
      }}>
        {/* Download PNG */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            flex:         "1 1 auto",
            padding:      "9px 16px",
            borderRadius: "8px",
            background:   downloading ? "#94a3b8" : "#0f172a",
            color:        "#fff",
            fontWeight:   700,
            fontSize:     "0.82rem",
            border:       "none",
            cursor:       downloading ? "not-allowed" : "pointer",
            display:      "flex",
            alignItems:   "center",
            justifyContent:"center",
            gap:          "6px",
          }}
        >
          {downloading ? "Preparing..." : "⬇ Download PNG"}
        </button>

        {/* Share on LinkedIn */}
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            flex:           "1 1 auto",
            padding:        "9px 16px",
            borderRadius:   "8px",
            background:     "#0a66c2",
            color:          "#fff",
            fontWeight:     700,
            fontSize:       "0.82rem",
            textDecoration: "none",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            gap:            "6px",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Share on LinkedIn
        </a>

        {/* Copy link */}
        <button
          onClick={handleCopyLink}
          style={{
            padding:      "9px 14px",
            borderRadius: "8px",
            background:   copied ? "#f0fdf4" : "#ffffff",
            color:        copied ? "#16a34a" : "#64748b",
            border:       `1.5px solid ${copied ? "#bbf7d0" : "#e2e8f0"}`,
            fontWeight:   600,
            fontSize:     "0.82rem",
            cursor:       "pointer",
            whiteSpace:   "nowrap",
          }}
        >
          {copied ? "✓ Copied!" : "🔗 Copy link"}
        </button>
      </div>
    </div>
  );
}

// ─── CERTIFICATE MODAL WRAPPER ────────────────────────────────────────────────

/**
 * CertificateModal — wraps CertificateCard in a full-screen modal.
 *
 * Usage on Profile page:
 *   const [certBadge, setCertBadge] = useState(null);
 *
 *   <button onClick={() => setCertBadge(badge)}>View Certificate</button>
 *
 *   <CertificateModal
 *     badge={certBadge}
 *     isOpen={!!certBadge}
 *     onClose={() => setCertBadge(null)}
 *     userName={user.fullName}
 *     solvedCount={user.solvedCount}
 *     isMobile={isMobile}
 *   />
 */
export function CertificateModal({
  badge,
  isOpen,
  onClose,
  userName,
  solvedCount,
  earnedDate,
  isMobile = false,
}) {
  if (!isOpen || !badge) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:       "fixed",
        inset:          0,
        background:     "rgba(15,23,42,0.7)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        zIndex:         3000,
        padding:        isMobile ? "1rem" : "2rem",
        backdropFilter: "blur(4px)",
        overflowY:      "auto",
      }}
    >
      <div style={{
        width:    "100%",
        maxWidth: "760px",
      }}>
        <CertificateCard
          badge={badge}
          userName={userName}
          solvedCount={solvedCount}
          earnedDate={earnedDate}
          isMobile={isMobile}
          onClose={onClose}
        />
      </div>
    </div>
  );
}