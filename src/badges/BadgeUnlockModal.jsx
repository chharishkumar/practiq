import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function BadgeUnlockModal({ badges, isOpen, onClose, onViewBadges, isMobile, userName }) {
  const certRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const badge = badges?.[0];
  if (!isOpen || !badge) return null;

  // Safe fallback properties for badge naming schema
  const badgeName = badge?.name || badge?.title || badge?.label || "SQL Achievement";
  const badgeDescription = badge?.description || "Completed SQL practice challenges on Repractiq.";
  const badgeIcon = badge?.icon || "🏆";

  const shareText = `I just earned the ${badgeName} badge on Repractiq! ${badgeDescription} 🎯\n\nPractice SQL & Python on real business datasets → www.repractiq.com`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent("https://www.repractiq.com");
    const text = encodeURIComponent(shareText);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, "_blank");
  };

  const downloadCertificate = async () => {
    const el = certRef.current;
    if (!el) {
      console.error("Certificate element reference not found.");
      return;
    }
    setDownloading(true);

    try {
      // Small pause to allow DOM styles to render properly before capture
      await new Promise((resolve) => setTimeout(resolve, 150));

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 1122,
        height: 794,
        windowWidth: 1122,
        windowHeight: 794,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Repractiq-${badgeName.replace(/\s+/g, "-")}-Certificate.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      {/* ── MODAL OVERLAY ─────────────────────────────────────────────── */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,23,42,0.6)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "440px",
            overflow: "hidden",
            boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
            fontFamily: "Inter, -apple-system, sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
              padding: "1.75rem 1.75rem 1.5rem",
              position: "relative",
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                color: "#ffffff",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                  flexShrink: 0,
                }}
              >
                {badgeIcon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.7)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "4px",
                  }}
                >
                  Achievement Unlocked
                </div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
                  {badgeName}
                </div>
                <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.8)", marginTop: "4px" }}>
                  {badgeDescription}
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "1.5rem 1.75rem" }}>
            {/* Motivational message */}
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "10px",
                padding: "0.875rem 1rem",
                marginBottom: "1.25rem",
                fontSize: "0.85rem",
                color: "#15803d",
                lineHeight: 1.6,
                textAlign: "center",
              }}
            >
              🎉 You've earned this. Share it with your network and show the world your progress.
            </div>

            {/* Share text preview */}
            <div
              style={{
                background: "#f8fafc",
                border: "1.5px solid #e2e8f0",
                borderRadius: "10px",
                padding: "0.875rem 1rem",
                marginBottom: "1.25rem",
                fontSize: "0.82rem",
                color: "#475569",
                lineHeight: 1.65,
                fontStyle: "italic",
              }}
            >
              {shareText}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Download Certificate */}
              <button
                onClick={downloadCertificate}
                disabled={downloading}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "10px",
                  background: downloading
                    ? "#94a3b8"
                    : "linear-gradient(135deg, #1e40af 0%, #2563eb 100%)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  border: "none",
                  cursor: downloading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: downloading ? "none" : "0 4px 12px rgba(37,99,235,0.3)",
                  transition: "all 0.2s",
                }}
              >
                {downloading ? "⏳ Generating PDF..." : "🏆 Download Certificate (PDF)"}
              </button>

              {/* Share on LinkedIn */}
              <button
                onClick={handleLinkedInShare}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  background: "#0077B5",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Share on LinkedIn
              </button>

              {/* Copy text */}
              <button
                onClick={handleCopy}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  background: "#f8fafc",
                  color: copied ? "#16a34a" : "#475569",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  border: "1.5px solid",
                  borderColor: copied ? "#bbf7d0" : "#e2e8f0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                }}
              >
                {copied ? "✓ Copied!" : "📋 Copy share text"}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: "0 1.75rem 1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
              www.repractiq.com · Practice SQL & Python
            </div>
          </div>
        </div>
      </div>

      {/* ── HIDDEN CERTIFICATE FOR PDF ────────────────── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "-9999px",
          width: "1122px",
          height: "794px",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          ref={certRef}
          style={{
            width: "1122px",
            height: "794px",
            background: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Georgia, serif",
            position: "relative",
            overflow: "hidden",
            padding: "60px 80px",
            boxSizing: "border-box",
          }}
        >
          {/* Top border */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "8px",
              background: "linear-gradient(90deg, #1e40af 0%, #2563eb 50%, #1e40af 100%)",
            }}
          />
          {/* Bottom border */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "8px",
              background: "linear-gradient(90deg, #1e40af 0%, #2563eb 50%, #1e40af 100%)",
            }}
          />

          {/* Corner decorations */}
          {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos, i) => (
            <div
              key={pos}
              style={{
                position: "absolute",
                top: i < 2 ? "24px" : "auto",
                bottom: i >= 2 ? "24px" : "auto",
                left: i % 2 === 0 ? "24px" : "auto",
                right: i % 2 !== 0 ? "24px" : "auto",
                width: "60px",
                height: "60px",
                border: "2px solid #e2e8f0",
                borderRadius: "4px",
              }}
            />
          ))}

          {/* Watermark background pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.03,
              backgroundImage: "radial-gradient(circle, #2563eb 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          {/* REPRACTIQ header */}
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#2563eb",
              letterSpacing: "5px",
              textTransform: "uppercase",
              marginBottom: "6px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            REPRACTIQ
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#94a3b8",
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "36px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Certificate of Achievement
          </div>

          {/* Top divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "36px",
              width: "100%",
              maxWidth: "600px",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2563eb" }} />
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "#94a3b8",
              marginBottom: "14px",
              fontFamily: "Inter, sans-serif",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            This is to certify that
          </div>

          {/* User name */}
          <div
            style={{
              fontSize: "46px",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "6px",
              fontFamily: "Georgia, serif",
              letterSpacing: "-1px",
              textAlign: "center",
            }}
          >
            {userName || "Repractiq User"}
          </div>

          {/* Name underline */}
          <div
            style={{
              width: "240px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #2563eb, transparent)",
              marginBottom: "24px",
            }}
          />

          <div
            style={{
              fontSize: "14px",
              color: "#64748b",
              marginBottom: "20px",
              fontFamily: "Inter, sans-serif",
              textAlign: "center",
              lineHeight: 1.8,
              maxWidth: "560px",
            }}
          >
            has demonstrated excellence, consistent practice, and the commitment
            <br />
            to grow as a data professional by successfully earning the
          </div>

          {/* Badge display */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "10px",
              background: "#f8fafc",
              border: "1.5px solid #e2e8f0",
              borderRadius: "14px",
              padding: "14px 28px",
            }}
          >
            <span style={{ fontSize: "44px" }}>{badgeIcon}</span>
            <div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#0f172a",
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: "-0.5px",
                }}
              >
                {badgeName}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  fontFamily: "Inter, sans-serif",
                  marginTop: "2px",
                }}
              >
                {badgeDescription}
              </div>
            </div>
          </div>

          {/* Bottom divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              margin: "28px 0",
              width: "100%",
              maxWidth: "600px",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2563eb" }} />
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          </div>

          {/* Date + Signature */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              width: "100%",
              maxWidth: "680px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#0f172a",
                  fontFamily: "Inter, sans-serif",
                  marginBottom: "6px",
                }}
              >
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div style={{ width: "160px", height: "1px", background: "#cbd5e1", marginBottom: "6px" }} />
              <div
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                Date Earned
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "26px",
                  fontFamily: "Georgia, serif",
                  color: "#2563eb",
                  fontStyle: "italic",
                  marginBottom: "6px",
                  letterSpacing: "1px",
                }}
              >
                Repractiq
              </div>
              <div style={{ width: "160px", height: "1px", background: "#cbd5e1", marginBottom: "6px" }} />
              <div
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                Authorized By
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ position: "absolute", bottom: "16px", left: 0, right: 0, textAlign: "center" }}>
            <div
              style={{
                fontSize: "10px",
                color: "#cbd5e1",
                fontFamily: "Inter, sans-serif",
                letterSpacing: "1px",
              }}
            >
              www.repractiq.com · Practice SQL & Python with real business datasets · Build skills that get you hired
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { useRef } from "react";
// import { useState, useEffect } from "react";
// import { getTierStyle } from "./badgeUtils";
// // import { BadgePill } from "./BadgeCard";

// // ─── CONFETTI ─────────────────────────────────────────────────────────────────

// function Confetti({ color }) {
//   const pieces = Array.from({ length: 18 }, (_, i) => i);

//   return (
//     <div style={{
//       position:      "absolute",
//       inset:         0,
//       pointerEvents: "none",
//       overflow:      "hidden",
//       borderRadius:  "inherit",
//     }}>
//       {pieces.map((i) => {
//         const left    = `${(i / 18) * 100}%`;
//         const delay   = `${(i * 0.08).toFixed(2)}s`;
//         const size    = `${4 + (i % 4)}px`;
//         const rotate  = `${i * 37}deg`;
//         const shape   = i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "0";

//         return (
//           <div
//             key={i}
//             style={{
//               position:        "absolute",
//               top:             "-10px",
//               left,
//               width:           size,
//               height:          size,
//               background:      i % 2 === 0 ? color : "#fbbf24",
//               borderRadius:    shape,
//               transform:       `rotate(${rotate})`,
//               animation:       `confettiFall 1.4s ${delay} ease-in forwards`,
//               opacity:         0,
//             }}
//           />
//         );
//       })}
//       <style>{`
//         @keyframes confettiFall {
//           0%   { transform: translateY(0) rotate(0deg);    opacity: 1; }
//           100% { transform: translateY(280px) rotate(720deg); opacity: 0; }
//         }
//       `}</style>
//     </div>
//   );
// }

// // ─── SINGLE BADGE UNLOCK PANEL ────────────────────────────────────────────────

// function UnlockPanel({ badge, onShare, onViewBadges, onClose, isMobile }) {
//   const tier     = getTierStyle(badge);
//   const [popped, setPopped] = useState(false);

//   useEffect(() => {
//     const t = setTimeout(() => setPopped(true), 80);
//     return () => clearTimeout(t);
//   }, []);

//   const linkedInText = encodeURIComponent(badge.shareText || `I just earned the ${badge.title} badge on Repractiq!`);
//   const linkedInUrl  = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://repractiq.com")}&summary=${linkedInText}`;

//   return (
//     <div style={{
//       background:    "#ffffff",
//       borderRadius:  "20px",
//       padding:       isMobile ? "1.75rem 1.25rem" : "2.25rem 2rem",
//       width:         "100%",
//       maxWidth:      "420px",
//       textAlign:     "center",
//       position:      "relative",
//       overflow:      "hidden",
//       boxShadow:     "0 24px 60px rgba(0,0,0,0.18)",
//       transform:     popped ? "scale(1)" : "scale(0.88)",
//       opacity:       popped ? 1 : 0,
//       transition:    "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease",
//     }}>
//       {/* Confetti */}
//       <Confetti color={tier.color} />

//       {/* Top accent bar */}
//       <div style={{
//         position:     "absolute",
//         top:          0,
//         left:         0,
//         right:        0,
//         height:       "4px",
//         background:   `linear-gradient(90deg, ${tier.color}, #fbbf24, ${tier.color})`,
//       }} />

//       {/* Tier label */}
//       <div style={{
//         display:       "inline-flex",
//         alignItems:    "center",
//         gap:           "5px",
//         fontSize:      "0.65rem",
//         fontWeight:    700,
//         color:         tier.color,
//         background:    tier.bg,
//         border:        `1px solid ${tier.border}`,
//         borderRadius:  "20px",
//         padding:       "3px 10px",
//         marginBottom:  "1rem",
//         textTransform: "uppercase",
//         letterSpacing: "0.08em",
//       }}>
//         <span style={{
//           width:       "5px",
//           height:      "5px",
//           borderRadius:"50%",
//           background:  tier.color,
//           display:     "inline-block",
//         }} />
//         {tier.label} Badge Unlocked
//       </div>

//       {/* Icon */}
//       <div style={{
//         fontSize:     "4rem",
//         lineHeight:   1,
//         marginBottom: "0.75rem",
//         animation:    "badgeBounce 0.6s 0.3s ease both",
//       }}>
//         {badge.icon}
//       </div>

//       {/* Title */}
//       <h2 style={{
//         fontSize:      "1.4rem",
//         fontWeight:    800,
//         color:         "#0f172a",
//         margin:        "0 0 0.375rem",
//         letterSpacing: "-0.5px",
//       }}>
//         {badge.title}
//       </h2>

//       {/* Description */}
//       <p style={{
//         fontSize:     "0.85rem",
//         color:        "#64748b",
//         lineHeight:   1.65,
//         margin:       "0 0 1.5rem",
//         maxWidth:     "300px",
//         marginLeft:   "auto",
//         marginRight:  "auto",
//       }}>
//         {badge.description}
//       </p>

//       {/* Certificate note for certificate badges */}
//       {badge.certificate && (
//         <div style={{
//           background:   "#fffbeb",
//           border:       "1px solid #fde68a",
//           borderRadius: "8px",
//           padding:      "0.5rem 0.875rem",
//           fontSize:     "0.75rem",
//           color:        "#92400e",
//           fontWeight:   600,
//           marginBottom: "1.25rem",
//         }}>
//           🎓 A shareable certificate is now available on your profile
//         </div>
//       )}

//       {/* Action buttons */}
//       <div style={{
//         display:       "flex",
//         flexDirection: "column",
//         gap:           "8px",
//         marginBottom:  "0.875rem",
//       }}>
//         {/* LinkedIn share */}
//         <a
//           href={linkedInUrl}
//           target="_blank"
//           rel="noreferrer"
//           style={{
//             display:        "flex",
//             alignItems:     "center",
//             justifyContent: "center",
//             gap:            "7px",
//             padding:        "10px 20px",
//             borderRadius:   "8px",
//             background:     "#0a66c2",
//             color:          "#fff",
//             fontWeight:     700,
//             fontSize:       "0.85rem",
//             textDecoration: "none",
//           }}
//         >
//           <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
//             <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
//           </svg>
//           Share on LinkedIn
//         </a>

//         {/* View all badges */}
//         <button
//           onClick={onViewBadges}
//           style={{
//             padding:      "10px 20px",
//             borderRadius: "8px",
//             background:   tier.bg,
//             color:        tier.color,
//             border:       `1.5px solid ${tier.border}`,
//             fontWeight:   700,
//             fontSize:     "0.85rem",
//             cursor:       "pointer",
//           }}
//         >
//           View all my badges →
//         </button>
//       </div>

//       {/* Dismiss */}
//       <button
//         onClick={onClose}
//         style={{
//           background:  "none",
//           border:      "none",
//           color:       "#94a3b8",
//           fontSize:    "0.78rem",
//           cursor:      "pointer",
//           fontWeight:  500,
//         }}
//       >
//         Continue practicing
//       </button>

//       <style>{`
//         @keyframes badgeBounce {
//           0%   { transform: scale(0.5) rotate(-10deg); opacity: 0; }
//           60%  { transform: scale(1.15) rotate(4deg);  opacity: 1; }
//           100% { transform: scale(1) rotate(0deg);     opacity: 1; }
//         }
//       `}</style>
//     </div>
//   );
// }

// // ─── MULTI-BADGE QUEUE ────────────────────────────────────────────────────────
// // If multiple badges unlock at once, show them one at a time

// function MultiQueue({ badges, onDone, onViewBadges, isMobile }) {
//   const [index, setIndex] = useState(0);

//   const handleNext = () => {
//     if (index < badges.length - 1) {
//       setIndex(index + 1);
//     } else {
//       onDone();
//     }
//   };

//   return (
//     <div>
//       {/* Counter when multiple badges */}
//       {badges.length > 1 && (
//         <div style={{
//           textAlign:    "center",
//           marginBottom: "1rem",
//           fontSize:     "0.75rem",
//           color:        "#fff",
//           fontWeight:   600,
//           opacity:      0.7,
//         }}>
//           {index + 1} of {badges.length} badges unlocked
//         </div>
//       )}
//       <UnlockPanel
//         key={badges[index].id}
//         badge={badges[index]}
//         onShare={() => {}}
//         onViewBadges={onViewBadges}
//         onClose={handleNext}
//         isMobile={isMobile}
//       />
//       {/* Dot indicators */}
//       {badges.length > 1 && (
//         <div style={{
//           display:        "flex",
//           justifyContent: "center",
//           gap:            "6px",
//           marginTop:      "1rem",
//         }}>
//           {badges.map((_, i) => (
//             <div key={i} style={{
//               width:        i === index ? "20px" : "6px",
//               height:       "6px",
//               borderRadius: "3px",
//               background:   i === index ? "#ffffff" : "rgba(255,255,255,0.3)",
//               transition:   "width 0.2s ease",
//             }} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── MAIN MODAL ───────────────────────────────────────────────────────────────

// /**
//  * BadgeUnlockModal — celebration modal shown when badges are newly earned.
//  *
//  * Props:
//  *   badges       {object[]}  — array of newly unlocked badge objects
//  *   isOpen       {boolean}
//  *   onClose      {function}  — called when dismissed
//  *   onViewBadges {function}  — navigate to profile badges tab
//  *   isMobile     {boolean}
//  *
//  * Usage in your SQL practice pages:
//  *   const [unlockedBadges, setUnlockedBadges] = useState([]);
//  *
//  *   // After correct submission:
//  *   const newBadges = await checkAndSaveBadges(userId);
//  *   if (newBadges.length > 0) setUnlockedBadges(newBadges);
//  *
//  *   <BadgeUnlockModal
//  *     badges={unlockedBadges}
//  *     isOpen={unlockedBadges.length > 0}
//  *     onClose={() => setUnlockedBadges([])}
//  *     onViewBadges={() => navigate("/profile?tab=badges")}
//  *     isMobile={isMobile}
//  *   />
//  */
// export default function BadgeUnlockModal({
//   badges    = [],
//   isOpen    = false,
//   onClose,
//   onViewBadges,
//   isMobile  = false,
// }) {
//   // Lock body scroll when open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => { document.body.style.overflow = ""; };
//   }, [isOpen]);

//   if (!isOpen || badges.length === 0) return null;

//   return (
//     <div
//       onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
//       style={{
//         position:       "fixed",
//         inset:          0,
//         background:     "rgba(15,23,42,0.75)",
//         display:        "flex",
//         flexDirection:  "column",
//         alignItems:     "center",
//         justifyContent: "center",
//         zIndex:         3000,
//         padding:        isMobile ? "1rem" : "2rem",
//         backdropFilter: "blur(4px)",
//       }}
//     >
//       <MultiQueue
//         badges={badges}
//         onDone={onClose}
//         onViewBadges={() => { onClose(); onViewBadges?.(); }}
//         isMobile={isMobile}
//       />
//     </div>
//   );
// }