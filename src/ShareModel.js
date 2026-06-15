import { useState, useRef, useEffect, useCallback } from "react";

// ─── Card styles ──────────────────────────────────────────────────────────────
const CARD_STYLES = [
  { id: "dark",      label: "Dark",      desc: "Bold & minimal" },
  { id: "milestone", label: "Milestone", desc: "Achievement look" },
  { id: "gradient",  label: "Gradient",  desc: "Vibrant & modern" },
  { id: "neon",      label: "Neon",      desc: "Cyber glow" },       // ADD
  { id: "clean",     label: "Clean",     desc: "Light & professional" }, // ADD
];

// ─── Difficulty colors ────────────────────────────────────────────────────────
const DIFF_COLOR = {
  Easy:   "#22c55e",
  Medium: "#f59e0b",
  Hard:   "#ef4444",
};

// ─── Milestone thresholds ─────────────────────────────────────────────────────
function getMilestone(solvedCount) {
  if (solvedCount >= 200) return { label: "200 Problems!", emoji: "🏆" };
  if (solvedCount >= 100) return { label: "Century Club!", emoji: "💯" };
  if (solvedCount >= 50)  return { label: "50 Solved!",   emoji: "⚡" };
  if (solvedCount >= 25)  return { label: "25 Solved!",   emoji: "🔥" };
  if (solvedCount >= 10)  return { label: "10 Solved!",   emoji: "🎯" };
  return null;
}

// ─── Caption generator ────────────────────────────────────────────────────────
function generateCaption({ user, problem, solvedCount, streak, timeTaken, firstTry }) {
  const milestone = getMilestone(solvedCount);
  const timeStr = timeTaken ? ` in ${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s` : "";
  const firstTryStr = firstTry ? " on the first try" : "";
  const streakStr = streak > 1 ? ` Day ${streak} of my streak.` : "";

  const name = user.fullName || "I";
  const openers = [
    `${name} just solved "${problem.title}"${timeStr}${firstTryStr} on Repractiq. 🎯`,
    `SQL practice update: ${name} cracked "${problem.title}"${timeStr}.`,
    `Problem #${solvedCount} done${firstTryStr} — "${problem.title}" on Repractiq.`,
    `Keeping the streak alive 🔥 — ${name} solved "${problem.title}" today.`,
  ];

  const middles = [
    ` This one covered ${problem.category} concepts — ${problem.description}`,
    ` The concept: ${problem.title}. One of those fundamentals that comes up in every data interview.`,
    `Category: ${problem.category || "SQL"}. Difficulty: ${problem.difficulty || "Easy"}. Building real SQL muscle memory.`,
  ];

  const closers = [
    `\n\nIf you're learning SQL or prepping for data interviews, check out Repractiq — it's free and has real business problems to solve.\n👉 https://www.repractiq.com`,
    `\n\nBuilding SQL skills one problem at a time on Repractiq. Free to start, no setup needed.\n👉 https://www.repractiq.com`,
    `\n\nPracticing daily on Repractiq — free SQL practice on real business data.\n👉 https://www.repractiq.com`,
  ];

  // Deterministic-ish variation based on solvedCount so it changes per solve
  const pick = (arr) => arr[solvedCount % arr.length];

  let caption = pick(openers) + pick(middles);
  if (milestone) caption = `${milestone.emoji} ${milestone.label} — ${caption}`;
  caption += ` ${streakStr}`;
  caption += pick(closers);
  caption += `\n\n🌐 https://www.repractiq.com\n#SQL #DataAnalytics #LearningInPublic #DataInterview #Repractiq`;

  return caption;
}

// ─── Canvas renderer ──────────────────────────────────────────────────────────
function drawCard(canvas, { style, user, problem, solvedCount, streak, firstTry, timeTaken }) {
  const ctx = canvas.getContext("2d");
  const W = 1200;
  const H = 628; // LinkedIn optimal OG ratio
  canvas.width = W;
  canvas.height = H;

  const milestone = getMilestone(solvedCount);
  const diffColor = DIFF_COLOR[problem.difficulty] || "#22c55e";

  // ── DARK style ──────────────────────────────────────────────────────────────
  if (style === "dark") {
    // Background
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, H);

    // Subtle grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Blue accent bar left
    ctx.fillStyle = "#2563eb";
    ctx.fillRect(0, 0, 6, H);

    // Glow circle top-right
    const grd = ctx.createRadialGradient(W - 100, 80, 10, W - 100, 80, 280);
    grd.addColorStop(0, "rgba(37,99,235,0.25)");
    grd.addColorStop(1, "rgba(37,99,235,0)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    // Brand
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("Repractiq", 52, 58);

    ctx.fillStyle = "#475569";
    ctx.font = "15px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("repractiq.com", 52, 82);

    // Divider
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(52, 100, W - 104, 1);

    // Achievement label
    if (milestone) {
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(`${milestone.emoji}  ${milestone.label}`, 52, 145);
    }

    // Main headline
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${problem.title.length > 30 ? "42" : "52"}px -apple-system, BlinkMacSystemFont, sans-serif`;
    const titleY = milestone ? 200 : 185;
    wrapText(ctx, problem.title, 52, titleY, W - 200, 62);

    // Description
    ctx.fillStyle = "#94a3b8";
    ctx.font = "18px -apple-system, BlinkMacSystemFont, sans-serif";
    wrapText(ctx, problem.description, 52, titleY + 130, W - 200, 28);

    // Difficulty pill
    ctx.fillStyle = diffColor + "22";
    roundRect(ctx, 52, H - 120, 110, 36, 18);
    ctx.fillStyle = diffColor;
    ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(problem.difficulty, 107, H - 96);
    ctx.textAlign = "left";

    // Category pill
    ctx.fillStyle = "rgba(37,99,235,0.18)";
    roundRect(ctx, 172, H - 120, 140, 36, 18);
    ctx.fillStyle = "#60a5fa";
    ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(problem.category, 242, H - 96);
    ctx.textAlign = "left";

    // Stats row
    const stats = [
      { label: "Problems solved", val: solvedCount },
      { label: "Day streak",      val: `${streak}🔥` },
      { label: "First try",       val: firstTry ? "Yes ✓" : "No" },
    ];
    if (timeTaken) stats.push({ label: "Time", val: `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s` });

    let sx = W - 340;
    stats.forEach(s => {
      ctx.fillStyle = "#1e293b";
      roundRect(ctx, sx, H - 170, 140, 70, 12);
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold 22px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(String(s.val), sx + 70, H - 130);
      ctx.fillStyle = "#64748b";
      ctx.font = "12px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(s.label, sx + 70, H - 112);
      ctx.textAlign = "left";
      sx += 154;
    });

    // User name
    ctx.fillStyle = "#334155";
    ctx.font = "15px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(user.username, W - 200, H - 30);
  }

  // ── MILESTONE style ─────────────────────────────────────────────────────────
  else if (style === "milestone") {
    // Warm cream background
    ctx.fillStyle = "#fffbf0";
    ctx.fillRect(0, 0, W, H);

    // Dark top band
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, 180);

    // Gold accent
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(0, 0, W, 5);

    // Trophy / milestone emoji big
    ctx.font = "80px serif";
    ctx.textAlign = "center";
    ctx.fillText(milestone?.emoji || "🎯", W / 2, 130);
    ctx.textAlign = "left";

    // Brand on top band
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("Repractiq", 40, 50);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(milestone?.label || `Problem #${solvedCount}`, W / 2, 163);
    ctx.textAlign = "left";

    // Name
    ctx.fillStyle = "#0f172a";
    ctx.font = `bold 48px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(user.fullName, W / 2, 260);

    ctx.fillStyle = "#64748b";
    ctx.font = "20px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("just solved", W / 2, 296);
    ctx.textAlign = "left";

    // Problem title box
    ctx.fillStyle = "#0f172a";
    roundRect(ctx, 100, 315, W - 200, 90, 16);
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${problem.title.length > 35 ? "26" : "32"}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(`"${problem.title}"`, W / 2, 372);
    ctx.textAlign = "left";

    // Stats row
    const mstats = [
      { val: solvedCount, label: "Problems Solved" },
      { val: `${streak}d`, label: "Streak" },
      { val: problem.difficulty, label: "Difficulty" },
    ];
    let mx = 140;
    mstats.forEach(s => {
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold 36px -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = "#0f172a";
      ctx.fillText(String(s.val), mx + 120, 470);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "15px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(s.label, mx + 120, 492);
      // Divider
      if (mx < 400) {
        ctx.fillStyle = "#e2e8f0";
        ctx.fillRect(mx + 235, 445, 1, 55);
      }
      mx += 240;
      ctx.textAlign = "left";
    });

    // Bottom
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("repractiq.com — Free SQL Practice Platform", W / 2, 580);
    ctx.textAlign = "left";
  }

  // ── GRADIENT style ──────────────────────────────────────────────────────────
  else if (style === "gradient") {
    // Deep blue to purple gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#1e1b4b");
    bg.addColorStop(0.5, "#1d4ed8");
    bg.addColorStop(1, "#0f172a");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Glowing orbs
    const orb1 = ctx.createRadialGradient(200, 150, 10, 200, 150, 300);
    orb1.addColorStop(0, "rgba(139,92,246,0.35)");
    orb1.addColorStop(1, "rgba(139,92,246,0)");
    ctx.fillStyle = orb1;
    ctx.fillRect(0, 0, W, H);

    const orb2 = ctx.createRadialGradient(W - 150, H - 100, 10, W - 150, H - 100, 250);
    orb2.addColorStop(0, "rgba(59,130,246,0.4)");
    orb2.addColorStop(1, "rgba(59,130,246,0)");
    ctx.fillStyle = orb2;
    ctx.fillRect(0, 0, W, H);

    // Brand
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText("Repractiq", 52, 55);

    // Solved badge
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    roundRect(ctx, 52, 75, 180, 32, 16);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "13px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(`✓  Problem #${solvedCount} solved`, 68, 96);

    // Big number
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.font = `bold 220px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText(`${solvedCount}`, W - 40, H - 20);
    ctx.textAlign = "left";

    // Main text
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${problem.title.length > 28 ? "44" : "54"}px -apple-system, BlinkMacSystemFont, sans-serif`;
    wrapText(ctx, problem.title, 52, 185, W - 200, 64);

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "19px -apple-system, BlinkMacSystemFont, sans-serif";
    wrapText(ctx, problem.description, 52, 310, W - 180, 30);

    // Bottom stats
    const gstats = [
      { label: "Streak", val: `${streak}🔥` },
      { label: "Category", val: problem.category },
      { label: "Difficulty", val: problem.difficulty },
    ];
    let gx = 52;
    gstats.forEach((s, i) => {
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      roundRect(ctx, gx, H - 110, 170, 68, 12);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(s.val), gx + 85, H - 72);
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.font = "13px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillText(s.label, gx + 85, H - 52);
      ctx.textAlign = "left";
      gx += 184;
    });

    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "14px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(user.username, W - 52, H - 28);
    ctx.textAlign = "left";
  }

  // ── NEON style ──────────────────────────────────────────────────────────
else if (style === "neon") {
  ctx.fillStyle = "#0d0d0d";
  ctx.fillRect(0, 0, W, H);

  // Neon green top bar
  ctx.fillStyle = "#39ff14";
  ctx.fillRect(0, 0, W, 5);

  // Scanline overlay effect
  ctx.fillStyle = "rgba(57,255,20,0.03)";
  for (let y = 0; y < H; y += 4) {
    ctx.fillRect(0, y, W, 2);
  }

  // Glow behind title
  const glow = ctx.createRadialGradient(W/2, 220, 20, W/2, 220, 400);
  glow.addColorStop(0, "rgba(57,255,20,0.12)");
  glow.addColorStop(1, "rgba(57,255,20,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Brand
  ctx.fillStyle = "#39ff14";
  ctx.font = "bold 20px monospace";
  ctx.fillText("> repractiq", 52, 58);

  // Solved badge
  ctx.fillStyle = "rgba(57,255,20,0.12)";
  roundRect(ctx, 52, 75, 200, 30, 6);
  ctx.fillStyle = "#39ff14";
  ctx.font = "13px monospace";
  ctx.fillText(`[ SOLVED #${solvedCount} ]`, 64, 95);

  // Title
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${problem.title.length > 30 ? "40" : "50"}px monospace`;
  wrapText(ctx, problem.title, 52, 190, W - 200, 60);

  // Description
  ctx.fillStyle = "rgba(57,255,20,0.75)";
  ctx.font = "16px monospace";
  wrapText(ctx, "> " + problem.description, 52, 310, W - 200, 26);

  // Stats
  const nstats = [
    { label: "STREAK", val: `${streak}d` },
    { label: "CATEGORY", val: problem.category },
    { label: "DIFFICULTY", val: problem.difficulty },
  ];
  let nx = 52;
  nstats.forEach(s => {
    ctx.fillStyle = "rgba(57,255,20,0.1)";
    ctx.strokeStyle = "#39ff14";
    ctx.lineWidth = 1;
    ctx.beginPath();
    roundRect(ctx, nx, H - 115, 160, 68, 8);
    ctx.stroke();
    ctx.fillStyle = "#39ff14";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.fillText(String(s.val), nx + 80, H - 75);
    ctx.fillStyle = "rgba(57,255,20,0.5)";
    ctx.font = "11px monospace";
    ctx.fillText(s.label, nx + 80, H - 56);
    ctx.textAlign = "left";
    nx += 174;
  });

  ctx.fillStyle = "rgba(57,255,20,0.4)";
  ctx.font = "13px monospace";
  ctx.textAlign = "right";
  ctx.fillText(user.username, W - 52, H - 28);
  ctx.textAlign = "left";
}

// ── CLEAN style ──────────────────────────────────────────────────────────
else if (style === "clean") {
  // White bg
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // Left blue accent strip
  ctx.fillStyle = "#2563eb";
  ctx.fillRect(0, 0, 8, H);

  // Top section bg
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(8, 0, W - 8, 180);

  // Border between sections
  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(8, 180, W - 8, 1);

  // Brand
  ctx.fillStyle = "#2563eb";
  ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Repractiq", 52, 65);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "14px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("repractiq.com · SQL Practice Platform", 52, 90);

  // Solved count chip
  ctx.fillStyle = "#eff6ff";
  roundRect(ctx, 52, 110, 200, 36, 18);
  ctx.fillStyle = "#2563eb";
  ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`✓ ${solvedCount} Problems Solved`, 152, 133);
  ctx.textAlign = "left";

  // Title
  ctx.fillStyle = "#0f172a";
  ctx.font = `bold ${problem.title.length > 32 ? "38" : "48"}px -apple-system, BlinkMacSystemFont, sans-serif`;
  wrapText(ctx, problem.title, 52, 250, W - 100, 58);

  // Thin divider
  ctx.fillStyle = "#e2e8f0";
  ctx.fillRect(52, 340, 120, 2);

  // Description
  ctx.fillStyle = "#64748b";
  ctx.font = "18px -apple-system, BlinkMacSystemFont, sans-serif";
  wrapText(ctx, problem.description, 52, 380, W - 100, 28);

  // Bottom stats row — pill style
  const cstats = [
    { label: "Day Streak", val: `${streak} 🔥` },
    { label: "Category", val: problem.category },
    { label: "Difficulty", val: problem.difficulty },
    { label: "First Try", val: firstTry ? "Yes ✓" : "No" },
  ];
  let cx2 = 52;
  cstats.forEach(s => {
    const w2 = 155;
    ctx.fillStyle = "#f1f5f9";
    roundRect(ctx, cx2, H - 100, w2, 56, 10);
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(s.val), cx2 + w2/2, H - 63);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(s.label, cx2 + w2/2, H - 46);
    ctx.textAlign = "left";
    cx2 += w2 + 12;
  });

  // Username bottom right
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(user.username, W - 40, H - 24);
  ctx.textAlign = "left";
}
}

// ─── Canvas helpers ───────────────────────────────────────────────────────────
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
      if (currentY > y + lineHeight * 2) { ctx.fillText(line + "…", x, currentY); return; }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ShareModal({ isOpen, onClose, problem, user, solvedCount, streak, firstTry, timeTaken }) {
  const canvasRef = useRef(null);
  const [cardStyle, setCardStyle] = useState("dark");
  const [caption, setCaption] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [imgDataUrl, setImgDataUrl] = useState(null);

  // Auto-select milestone style when applicable
  useEffect(() => {
    if (!isOpen) return;
    const m = getMilestone(solvedCount);
    if (m) setCardStyle("milestone");
    else setCardStyle("dark");
  }, [isOpen, solvedCount]);

  // Render canvas whenever style or data changes
  useEffect(() => {
    if (!isOpen || !canvasRef.current || !problem) return;
    const canvas = canvasRef.current;
    drawCard(canvas, { style: cardStyle, user, problem, solvedCount, streak, firstTry, timeTaken });
    setImgDataUrl(canvas.toDataURL("image/png"));
  }, [isOpen, cardStyle, problem, user, solvedCount, streak, firstTry, timeTaken]);

  // Generate caption
  useEffect(() => {
    if (!isOpen || !problem) return;
    setCaption(generateCaption({ user, problem, solvedCount, streak, timeTaken, firstTry }));
  }, [isOpen, problem, solvedCount, user, streak, timeTaken, firstTry]);

  const handleCopyCaption = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = caption;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [caption]);

  const handleDownload = useCallback(() => {
    if (!imgDataUrl) return;
    setDownloading(true);
    const a = document.createElement("a");
    a.href = imgDataUrl;
    a.download = `repractiq-${problem?.title?.replace(/\s+/g, "-").toLowerCase() || "solved"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(false), 1000);
  }, [imgDataUrl, problem]);

  const handleShareLinkedIn = useCallback(async () => {
    // Copy caption to clipboard first
    try { await navigator.clipboard.writeText(caption); } catch {}
    // Download image
    handleDownload();
    // Open LinkedIn new post
    setTimeout(() => {
      window.open("https://www.linkedin.com/feed/?shareActive=true", "_blank", "noopener,noreferrer");
    }, 400);
  }, [caption, handleDownload]);

  if (!isOpen || !problem) return null;

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: "1rem" }}
    >
      <div style={{ background: "#ffffff", borderRadius: "18px", width: "100%", maxWidth: "820px", maxHeight: "94vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}>

        {/* Header */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.3px" }}>Share on LinkedIn</h3>
            <p style={{ margin: "3px 0 0", fontSize: "0.75rem", color: "#64748b" }}>Download the image · paste caption · post on LinkedIn</p>
          </div>
          <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1.5px solid #e2e8f0", background: "#f8fafc", cursor: "pointer", fontSize: "1rem", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Style picker */}
          <div>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.625rem" }}>Card style</div>
            <div style={{ display: "flex", gap: "8px" }}>
              {CARD_STYLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setCardStyle(s.id)}
                  style={{ padding: "7px 16px", borderRadius: "8px", border: "1.5px solid", borderColor: cardStyle === s.id ? "#2563eb" : "#e2e8f0", background: cardStyle === s.id ? "#eff6ff" : "#ffffff", cursor: "pointer", textAlign: "left" }}
                >
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: cardStyle === s.id ? "#2563eb" : "#0f172a" }}>{s.label}</div>
                  <div style={{ fontSize: "0.67rem", color: "#94a3b8", marginTop: "1px" }}>{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Canvas preview */}
          <div>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.625rem" }}>Preview</div>
            <div style={{ borderRadius: "10px", overflow: "hidden", border: "1.5px solid #e2e8f0", background: "#f8fafc", lineHeight: 0 }}>
              <canvas
                ref={canvasRef}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
            <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginTop: "6px", textAlign: "center" }}>
              1200 × 628px · optimised for LinkedIn feed
            </div>
          </div>

          {/* Caption editor */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.625rem" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Post caption</div>
              <button
                onClick={handleCopyCaption}
                style={{ fontSize: "0.75rem", fontWeight: 600, color: copied ? "#16a34a" : "#2563eb", background: copied ? "#f0fdf4" : "#eff6ff", border: `1px solid ${copied ? "#86efac" : "#bfdbfe"}`, borderRadius: "6px", padding: "4px 12px", cursor: "pointer" }}
              >
                {copied ? "✓ Copied!" : "Copy caption"}
              </button>
            </div>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={7}
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "0.82rem", color: "#0f172a", lineHeight: 1.65, fontFamily: "Inter, sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box", background: "#f8fafc" }}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
            <div style={{ fontSize: "0.68rem", color: "#94a3b8", marginTop: "4px" }}>
              You can edit this before posting. Caption is copied automatically when you click "Share on LinkedIn".
            </div>
          </div>

          {/* Instructions */}
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem 1.125rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.625rem" }}>How to post (3 steps)</div>
            {[
              ["1", "Click \"Share on LinkedIn\" below — image downloads + caption copies + LinkedIn opens"],
              ["2", "In LinkedIn: click \"Start a post\" → click the image icon → select the downloaded image"],
              ["3", "Click in the caption area → Ctrl+V (or ⌘V) to paste → Post"],
            ].map(([n, text]) => (
              <div key={n} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "6px" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "#2563eb", flexShrink: 0, marginTop: "1px" }}>{n}</div>
                <span style={{ fontSize: "0.78rem", color: "#475569", lineHeight: 1.55 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{ flex: 1, padding: "11px", borderRadius: "9px", border: "1.5px solid #e2e8f0", background: "#ffffff", color: "#0f172a", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
            >
              {downloading ? "Downloading…" : "⬇ Download image"}
            </button>
            <button
              onClick={handleShareLinkedIn}
              style={{ flex: 2, padding: "11px", borderRadius: "9px", border: "none", background: "#0a66c2", color: "#ffffff", fontWeight: 800, fontSize: "0.88rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Share on LinkedIn
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}