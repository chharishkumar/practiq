import { useRef, useState } from "react";
import { getTierStyle } from "./badgeUtils";
import jsPDF from "jspdf";

// ─── CERTIFICATE DESIGN ───────────────────────────────────────────────────────

function CertificateDesign({ badge, userName, solvedCount, earnedDate, forExport = false }) {
  // Safely retrieve tier styles with full fallbacks
  let tierStyle = null;
  try {
    tierStyle = getTierStyle ? getTierStyle(badge) : null;
  } catch (e) {
    tierStyle = null;
  }

  // Fallback map if getTierStyle returns undefined or throws an error
  const defaultTierStyles = {
    bronze: { color: "#cd7f32", bg: "#fff7ed", border: "#fed7aa", label: "Bronze" },
    silver: { color: "#64748b", bg: "#f8fafc", border: "#cbd5e1", label: "Silver" },
    gold:   { color: "#eab308", bg: "#fefce8", border: "#fef08a", label: "Gold" },
  };

  const badgeTierKey = (badge?.tier || badge?.type || "bronze").toLowerCase();
  
  const tier = {
    color:  tierStyle?.color  || defaultTierStyles[badgeTierKey]?.color  || "#2563eb",
    bg:     tierStyle?.bg     || defaultTierStyles[badgeTierKey]?.bg     || "#eff6ff",
    border: tierStyle?.border || defaultTierStyles[badgeTierKey]?.border || "#bfdbfe",
    label:  tierStyle?.label  || badge?.tier || badge?.category || "Achievement",
  };

  const badgeTitle = badge?.title || badge?.name || "SQL Achievement";
  const badgeDescription = badge?.description || "Successfully unlocked this milestone on Repractiq.";
  const badgeIcon = badge?.icon || "🏆";

  const dateStr = earnedDate
    ? new Date(earnedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const width = forExport ? "1122px" : "800px";
  const height = forExport ? "794px" : "565px";

  return (
    <div
      style={{
        width: width,
        height: height,
        background: "#ffffff",
        borderRadius: forExport ? "0" : "12px",
        overflow: "hidden",
        position: "relative",
        fontFamily: "Inter, -apple-system, sans-serif",
        boxShadow: forExport ? "none" : "0 10px 30px rgba(0,0,0,0.08)",
        flexShrink: 0,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: forExport ? "3rem 4rem" : "2rem 2.5rem",
      }}
    >
      {/* Top border accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: forExport ? "8px" : "6px",
          background: `linear-gradient(90deg, ${tier.color}, #fbbf24, ${tier.color})`,
        }}
      />

      {/* Watermark corner decoration */}
      <div
        style={{
          position: "absolute",
          top: "30px",
          right: "35px",
          fontSize: forExport ? "7rem" : "5rem",
          opacity: 0.04,
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {badgeIcon}
      </div>

      {/* Header section */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: forExport ? "1.5rem" : "1rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: forExport ? "0.85rem" : "0.7rem",
                fontWeight: 800,
                color: "#2563eb",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: "2px",
              }}
            >
              REPRACTIQ
            </div>
            <div
              style={{
                fontSize: forExport ? "0.75rem" : "0.65rem",
                color: "#94a3b8",
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            >
              repractiq.com
            </div>
          </div>

          {/* Tier badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: tier.bg,
              border: `1.5px solid ${tier.border}`,
              borderRadius: "20px",
              padding: forExport ? "6px 16px" : "4px 12px",
              fontSize: forExport ? "0.75rem" : "0.65rem",
              fontWeight: 700,
              color: tier.color,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: tier.color,
                display: "inline-block",
              }}
            />
            {tier.label} Achievement
          </div>
        </div>

        {/* Certificate title */}
        <div
          style={{
            fontSize: forExport ? "0.85rem" : "0.7rem",
            fontWeight: 700,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: "0.25rem",
          }}
        >
          Certificate of Achievement
        </div>

        <div style={{ fontSize: forExport ? "0.95rem" : "0.8rem", color: "#64748b" }}>
          This certifies that
        </div>

        {/* User Name */}
        <div
          style={{
            fontSize: forExport ? "2.75rem" : "2rem",
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-1px",
            margin: "0.25rem 0",
            lineHeight: 1.1,
          }}
        >
          {userName}
        </div>

        {/* Divider */}
        <div
          style={{
            width: "50px",
            height: "3px",
            background: tier.color,
            borderRadius: "2px",
            margin: forExport ? "0.75rem 0" : "0.5rem 0",
          }}
        />

        <div style={{ fontSize: forExport ? "0.95rem" : "0.8rem", color: "#64748b", marginBottom: "0.5rem" }}>
          has successfully earned
        </div>

        {/* Badge icon + name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: forExport ? "1.25rem" : "0.85rem",
          }}
        >
          <div
            style={{
              fontSize: forExport ? "3rem" : "2.25rem",
              lineHeight: 1,
              background: tier.bg,
              border: `2px solid ${tier.border}`,
              borderRadius: "12px",
              padding: forExport ? "10px 14px" : "6px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {badgeIcon}
          </div>
          <div>
            <div
              style={{
                fontSize: forExport ? "1.5rem" : "1.2rem",
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.3px",
                lineHeight: 1.2,
              }}
            >
              {badgeTitle}
            </div>
            <div
              style={{
                fontSize: forExport ? "0.85rem" : "0.75rem",
                color: "#64748b",
                marginTop: "2px",
                lineHeight: 1.4,
              }}
            >
              {badgeDescription}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "flex",
            gap: "1.25rem",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            padding: forExport ? "0.85rem 1.25rem" : "0.65rem 1rem",
          }}
        >
          {[
            { label: "Problems Solved", val: badge?.threshold || solvedCount || "—" },
            { label: "Platform", val: "Repractiq" },
            { label: "Date Earned", val: dateStr },
          ].map((item) => (
            <div key={item.label} style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: forExport ? "0.65rem" : "0.58rem",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "2px",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: forExport ? "0.9rem" : "0.8rem",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #f1f5f9",
          paddingTop: "0.75rem",
        }}
      >
        <div style={{ fontSize: forExport ? "0.7rem" : "0.6rem", color: "#94a3b8", fontWeight: 500 }}>
          Verify at repractiq.com · Practice SQL & Python
        </div>
        <div style={{ fontSize: forExport ? "0.7rem" : "0.6rem", color: "#94a3b8", fontWeight: 500 }}>
          © {new Date().getFullYear()} Repractiq
        </div>
      </div>

      {/* Bottom accent */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)`,
        }}
      />
    </div>
  );
}

// ─── MAIN CERTIFICATE CARD ────────────────────────────────────────────────────

export default function CertificateCard({
  badge,
  userName = "Repractiq Learner",
  solvedCount = 0,
  earnedDate,
  isMobile = false,
  onClose,
}) {
  const exportRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!badge) return null;

  const badgeTitle = badge.title || badge.name || "SQL Badge";
  const badgeId = badge.id || badgeTitle.toLowerCase().replace(/\s+/g, "-");

  // ── Download PDF ────────────────────────────────────────────────────────
  const handleDownload = async () => {
    setDownloading(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const el = exportRef.current;

      if (!el) return;

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 1122,
        height: 794,
        windowWidth: 1122,
        windowHeight: 794,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save(`repractiq-${badgeId}-certificate.pdf`);
    } catch (err) {
      console.error("Certificate download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  // ── Copy share link ────────────────────────────────────────────────────────
  const handleCopyLink = () => {
    const url = `https://repractiq.com/certificate/${badgeId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── LinkedIn share ─────────────────────────────────────────────────────────
  const linkedInText = encodeURIComponent(
    badge.shareText || `I just earned the ${badgeTitle} badge on Repractiq!`
  );
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    "https://repractiq.com"
  )}&summary=${linkedInText}`;

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1.5px solid #e2e8f0",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem 1.375rem",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#f8fafc",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.68rem",
              color: "#64748b",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Shareable Certificate
          </div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
            {badge.icon || "🏆"} {badgeTitle}
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

      {/* Certificate UI Preview */}
      <div
        style={{
          overflow: "hidden",
          padding: isMobile ? "0.75rem" : "1.25rem",
          background: "#f1f5f9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: "100%", overflowX: "auto" }}>
          <CertificateDesign
            badge={badge}
            userName={userName}
            solvedCount={solvedCount}
            earnedDate={earnedDate}
            forExport={false}
          />
        </div>
      </div>

      {/* Off-screen fixed A4 Certificate Node for PDF Export */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "1122px",
          height: "794px",
          opacity: 0,
          zIndex: -1,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div ref={exportRef}>
          <CertificateDesign
            badge={badge}
            userName={userName}
            solvedCount={solvedCount}
            earnedDate={earnedDate}
            forExport={true}
          />
        </div>
      </div>

      {/* Action buttons */}
      <div
        style={{
          padding: "1rem 1.375rem",
          borderTop: "1px solid #f1f5f9",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            flex: "1 1 auto",
            padding: "9px 16px",
            borderRadius: "8px",
            background: downloading ? "#94a3b8" : "#0f172a",
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.82rem",
            border: "none",
            cursor: downloading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          {downloading ? "Preparing..." : "⬇ Download PDF"}
        </button>

        <a
          href={linkedInUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            flex: "1 1 auto",
            padding: "9px 16px",
            borderRadius: "8px",
            background: "#0a66c2",
            color: "#fff",
            fontWeight: "700",
            fontSize: "0.82rem",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          Share on LinkedIn
        </a>

        <button
          onClick={handleCopyLink}
          style={{
            padding: "9px 14px",
            borderRadius: "8px",
            background: copied ? "#f0fdf4" : "#ffffff",
            color: copied ? "#16a34a" : "#64748b",
            border: `1.5px solid ${copied ? "#bbf7d0" : "#e2e8f0"}`,
            fontWeight: 600,
            fontSize: "0.82rem",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {copied ? "✓ Copied!" : "🔗 Copy link"}
        </button>
      </div>
    </div>
  );
}

// ─── CERTIFICATE MODAL WRAPPER ────────────────────────────────────────────────

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
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3000,
        padding: isMobile ? "0.75rem" : "1.5rem",
        backdropFilter: "blur(4px)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "840px",
        }}
      >
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