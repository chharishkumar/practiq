import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "./supabase";
import { useMobile } from "./hooks/useMobile";
import { usePageMeta } from "./hooks/usePageMeta";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const TAGS = [
  "All", "SQL Basics", "Joins", "Window Functions", "CTEs",
  "Subqueries", "Aggregations", "Interview Prep", "Career",
  "Real-world Scenarios", "Performance", "Tips & Tricks", "Community Solution"
];

const CATEGORY_EMOJI = {
  "Interview Prep": "🎯",
  "Career": "💼",
  "Real-world Scenarios": "🏢",
  "SQL Basics": "📘",
  "Window Functions": "🪟",
  "Joins": "🔗",
  "CTEs": "🔄",
  "Performance": "⚡",
  "Tips & Tricks": "💡",
  "Community Solution": "🌐",
  "default": "📝",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function readTime(text = "") {
  const words = text.split(" ").length;
  return Math.max(1, Math.ceil(words / 200));
}

function getCategoryEmoji(category) {
  return CATEGORY_EMOJI[category] || CATEGORY_EMOJI["default"];
}

// Avatar colors based on initials
const AVATAR_COLORS = [
  { bg: "#eff6ff", color: "#2563eb" },
  { bg: "#f0fdf4", color: "#16a34a" },
  { bg: "#fdf4ff", color: "#9333ea" },
  { bg: "#fff7ed", color: "#ea580c" },
  { bg: "#fef2f2", color: "#dc2626" },
];
function getAvatarColor(name = "") {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx] || AVATAR_COLORS[0];
}

// ─── LOADING ──────────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📝</div>
        <div style={{ fontSize: "0.88rem", color: "#64748b" }}>Loading feed...</div>
      </div>
    </div>
  );
}

// ─── SKELETON CARD ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{ background: "#ffffff", border: "1.5px solid #f1f5f9", borderRadius: "16px", padding: "1.25rem", marginBottom: "1rem" }}>
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f1f5f9" }} />
        <div>
          <div style={{ width: "120px", height: "12px", background: "#f1f5f9", borderRadius: "6px", marginBottom: "6px" }} />
          <div style={{ width: "80px", height: "10px", background: "#f1f5f9", borderRadius: "6px" }} />
        </div>
      </div>
      <div style={{ width: "80%", height: "16px", background: "#f1f5f9", borderRadius: "6px", marginBottom: "8px" }} />
      <div style={{ width: "100%", height: "12px", background: "#f1f5f9", borderRadius: "6px", marginBottom: "6px" }} />
      <div style={{ width: "60%", height: "12px", background: "#f1f5f9", borderRadius: "6px" }} />
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────

function Nav({ navigate, isLoggedIn, isMobile }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{
      padding: isMobile ? "0.75rem 1rem" : "0.875rem 2.5rem",
      borderBottom: "1px solid #e2e8f0",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      position: "sticky", top: 0,
      background: "rgba(255,255,255,0.97)",
      backdropFilter: "blur(8px)",
      zIndex: 100,
    }}>
      <span onClick={() => navigate("/")} style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", letterSpacing: "-0.3px", cursor: "pointer" }}>
        Repractiq
      </span>
      {isMobile ? (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {isLoggedIn && (
            <button onClick={() => navigate("/blog/write")} style={{ padding: "7px 12px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.78rem", border: "none", cursor: "pointer" }}>
              ✍️ Write
            </button>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#0f172a" }}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link to="/home" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>Home</Link>
          <Link to="/sql" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>Practice</Link>
          <Link to="/leaderboard" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>Leaderboard</Link>
          <Link to="/blog" style={{ fontSize: "0.85rem", color: "#2563eb", textDecoration: "none", fontWeight: 700, borderBottom: "2px solid #2563eb", paddingBottom: "2px" }}>Blog</Link>
          {isLoggedIn ? (
            <button onClick={() => navigate("/blog/write")} style={{ padding: "8px 18px", borderRadius: "8px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: "pointer" }}>
              ✍️ Write Post
            </button>
          ) : (
            <Link to="/login" style={{ padding: "8px 18px", borderRadius: "8px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>Login</Link>
          )}
        </div>
      )}
      {isMobile && menuOpen && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "0.5rem 0", zIndex: 200 }}>
          {[["Home", "/home"], ["Practice", "/sql"], ["Leaderboard", "/leaderboard"], ["Blog", "/blog"], [isLoggedIn ? "Profile" : "Login", isLoggedIn ? "/profile" : "/login"]].map(([label, path]) => (
            <div key={label} onClick={() => { navigate(path); setMenuOpen(false); }} style={{ padding: "0.75rem 1.25rem", fontSize: "0.9rem", color: "#0f172a", fontWeight: 500, cursor: "pointer", borderBottom: "1px solid #f1f5f9" }}>
              {label}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── TAG STRIP ────────────────────────────────────────────────────────────────

function TagStrip({ activeTag, setActiveTag }) {
  const ref = useRef(null);
  return (
    <div
      ref={ref}
      style={{
        display: "flex", gap: "8px", overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        paddingBottom: "4px",
      }}
    >
      {TAGS.map(tag => (
        <button
          key={tag}
          onClick={() => setActiveTag(tag)}
          style={{
            flexShrink: 0,
            padding: "6px 16px",
            borderRadius: "20px",
            border: "1.5px solid",
            borderColor: activeTag === tag ? "#2563eb" : "#e2e8f0",
            background: activeTag === tag ? "#2563eb" : "#ffffff",
            color: activeTag === tag ? "#ffffff" : "#64748b",
            fontWeight: activeTag === tag ? 700 : 500,
            fontSize: "0.78rem",
            cursor: "pointer",
            transition: "all 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

// ─── POST CARD (Feed style) ───────────────────────────────────────────────────

function PostCard({ post, navigate, featured = false }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const avatarColor = getAvatarColor(post.author_name);
  const emoji = getCategoryEmoji(post.category);
  const rt = readTime(post.excerpt || "");

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  if (featured) {
    return (
      <div
        onClick={() => navigate(`/blog/${post.slug}`)}
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
          borderRadius: "20px",
          padding: "2rem",
          marginBottom: "1rem",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          transition: "transform 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
      >
        {/* Background glow */}
        <div style={{ position: "absolute", right: "-40px", top: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(37,99,235,0.2)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "40%", bottom: "-60px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(139,92,246,0.15)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#fbbf24", background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: "20px", padding: "3px 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            ⭐ Featured
          </span>
          {post.category && (
            <span style={{ fontSize: "0.65rem", color: "#94a3b8", background: "rgba(255,255,255,0.08)", borderRadius: "20px", padding: "3px 10px" }}>
              {post.category}
            </span>
          )}
        </div>

        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#ffffff", margin: "0 0 0.75rem", letterSpacing: "-0.5px", lineHeight: 1.3, maxWidth: "80%" }}>
          {post.title}
        </h2>
        <p style={{ fontSize: "0.88rem", color: "#94a3b8", lineHeight: 1.7, margin: "0 0 1.5rem", maxWidth: "600px" }}>
          {post.excerpt}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, color: "#fff" }}>
              {getInitials(post.author_name)}
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#ffffff" }}>{post.author_name}</div>
              <div style={{ fontSize: "0.7rem", color: "#64748b" }}>{timeAgo(post.created_at)} · {rt} min read</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", fontSize: "0.75rem", color: "#64748b" }}>
            <span>👁 {post.views || 0}</span>
            <span>❤️ {likeCount}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1.5px solid #f1f5f9",
        borderRadius: "16px",
        padding: "1.25rem 1.375rem",
        marginBottom: "0.875rem",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#bfdbfe"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,99,235,0.06)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Author row */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.875rem" }}>
        <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: avatarColor.bg, border: `1.5px solid ${avatarColor.bg}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, color: avatarColor.color, flexShrink: 0 }}>
          {getInitials(post.author_name)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>{post.author_name}</div>
          <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{timeAgo(post.created_at)} · {rt} min read</div>
        </div>
        {post.category && (
          <span style={{ fontSize: "0.62rem", padding: "3px 9px", borderRadius: "20px", background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", fontWeight: 600, whiteSpace: "nowrap" }}>
            {getCategoryEmoji(post.category)} {post.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div onClick={() => navigate(`/blog/${post.slug}`)}>
        <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem", lineHeight: 1.4, letterSpacing: "-0.2px" }}>
          {post.title}
        </h3>
        <p style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.65, margin: "0 0 1rem" }}>
          {post.excerpt?.slice(0, 140)}{post.excerpt?.length > 140 ? "..." : ""}
        </p>
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div style={{ display: "flex", gap: "6px", marginBottom: "0.875rem", flexWrap: "wrap" }}>
          {(post.tags || []).slice(0, 3).map(tag => (
            <span key={tag} style={{ fontSize: "0.65rem", padding: "3px 9px", borderRadius: "20px", background: "#eff6ff", color: "#2563eb", fontWeight: 600 }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Engagement row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid #f8fafc" }}>
        <div style={{ display: "flex", gap: "16px" }}>
          <button
            onClick={handleLike}
            style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", fontSize: "0.78rem", color: liked ? "#dc2626" : "#94a3b8", fontWeight: liked ? 700 : 500, padding: 0, transition: "color 0.15s" }}
          >
            {liked ? "❤️" : "🤍"} {likeCount}
          </button>
          <button
            onClick={() => navigate(`/blog/${post.slug}`)}
            style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", fontSize: "0.78rem", color: "#94a3b8", fontWeight: 500, padding: 0 }}
          >
            💬 Comment
          </button>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.78rem", color: "#94a3b8" }}>
            👁 {post.views || 0}
          </span>
        </div>
        <button
          onClick={() => navigate(`/blog/${post.slug}`)}
          style={{ fontSize: "0.75rem", color: "#2563eb", fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          Read →
        </button>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

function Sidebar({ posts, navigate, isLoggedIn, activeTag, setActiveTag }) {
  const trending = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  // Top authors
  const authorMap = {};
  posts.forEach(p => {
    if (!authorMap[p.author_name]) authorMap[p.author_name] = { name: p.author_name, count: 0 };
    authorMap[p.author_name].count++;
  });
  const topAuthors = Object.values(authorMap).sort((a, b) => b.count - a.count).slice(0, 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

      {/* Write CTA */}
      {isLoggedIn ? (
        <div
          onClick={() => navigate("/blog/write")}
          style={{ background: "#0f172a", borderRadius: "14px", padding: "1.25rem", cursor: "pointer", position: "relative", overflow: "hidden" }}
        >
          <div style={{ position: "absolute", right: "-20px", top: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(37,99,235,0.2)", pointerEvents: "none" }} />
          <div style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>✍️</div>
          <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#ffffff", marginBottom: "4px" }}>Share your knowledge</div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.875rem" }}>Write a post for the community</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#2563eb", color: "#fff", borderRadius: "8px", padding: "7px 14px", fontSize: "0.78rem", fontWeight: 700 }}>
            Write Post →
          </div>
        </div>
      ) : (
        <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "14px", padding: "1.25rem" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f172a", marginBottom: "4px" }}>Join the community</div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.875rem", lineHeight: 1.6 }}>Sign up free to write posts and share solutions</div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => navigate("/signup")} style={{ flex: 1, padding: "7px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.78rem", border: "none", cursor: "pointer" }}>Sign Up</button>
            <button onClick={() => navigate("/login")} style={{ flex: 1, padding: "7px", borderRadius: "7px", background: "#fff", color: "#2563eb", fontWeight: 600, fontSize: "0.78rem", border: "1.5px solid #bfdbfe", cursor: "pointer" }}>Login</button>
          </div>
        </div>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <div style={{ background: "#ffffff", border: "1.5px solid #f1f5f9", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ padding: "0.875rem 1.125rem", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>🔥 Trending</div>
          </div>
          {trending.map((post, i) => (
            <div
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug}`)}
              style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "0.75rem 1.125rem", borderBottom: i < trending.length - 1 ? "1px solid #f8fafc" : "none", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#e2e8f0", minWidth: "20px" }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0f172a", lineHeight: 1.4, marginBottom: "3px" }}>{post.title}</div>
                <div style={{ fontSize: "0.67rem", color: "#94a3b8" }}>{post.views || 0} views · {timeAgo(post.created_at)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popular Tags */}
      <div style={{ background: "#ffffff", border: "1.5px solid #f1f5f9", borderRadius: "14px", padding: "1rem 1.125rem" }}>
        <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Popular Topics</div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {TAGS.filter(t => t !== "All").slice(0, 8).map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{
                padding: "5px 11px", borderRadius: "20px", border: "1.5px solid",
                borderColor: activeTag === tag ? "#2563eb" : "#e2e8f0",
                background: activeTag === tag ? "#eff6ff" : "#f8fafc",
                color: activeTag === tag ? "#2563eb" : "#64748b",
                fontSize: "0.72rem", fontWeight: activeTag === tag ? 700 : 500,
                cursor: "pointer",
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Top Authors */}
      {topAuthors.length > 0 && (
        <div style={{ background: "#ffffff", border: "1.5px solid #f1f5f9", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ padding: "0.875rem 1.125rem", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>Top Authors</div>
          </div>
          {topAuthors.map((author, i) => {
            const ac = getAvatarColor(author.name);
            return (
              <div key={author.name} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.625rem 1.125rem", borderBottom: i < topAuthors.length - 1 ? "1px solid #f8fafc" : "none" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: ac.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 800, color: ac.color, flexShrink: 0 }}>
                  {getInitials(author.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0f172a" }}>{author.name}</div>
                  <div style={{ fontSize: "0.67rem", color: "#94a3b8" }}>{author.count} post{author.count > 1 ? "s" : ""}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Practice CTA */}
      <div
        onClick={() => navigate("/sql")}
        style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", border: "1.5px solid #bfdbfe", borderRadius: "14px", padding: "1.125rem", cursor: "pointer" }}
      >
        <div style={{ fontSize: "1.25rem", marginBottom: "4px" }}>🧠</div>
        <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#1d4ed8", marginBottom: "3px" }}>Practice SQL</div>
        <div style={{ fontSize: "0.72rem", color: "#3b82f6", lineHeight: 1.5 }}>Put your knowledge to the test — 500+ real-world problems</div>
      </div>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────

function EmptyState({ navigate, isLoggedIn }) {
  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#f8fafc", border: "1.5px dashed #e2e8f0", borderRadius: "16px" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📭</div>
      <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.5rem" }}>No posts found</div>
      <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.5rem" }}>Try a different tag or search term</div>
      {isLoggedIn && (
        <button onClick={() => navigate("/blog/write")} style={{ padding: "10px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
          Write the first post →
        </button>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function BlogPage() {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("All");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  usePageMeta({
    title: "SQL Tips & Tutorials | Repractiq Blog",
    description: "Learn SQL concepts, interview tips, and data analysis techniques. Practical articles for data analysts and aspiring SQL professionals.",
  });

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setIsLoggedIn(!!sessionData?.session);

      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, slug, excerpt, author_name, category, tags, views, likes, created_at, cover_image_url")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (!error) setPosts(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = posts.filter((p) => {
    const matchTag = activeTag === "All" || (p.tags && p.tags.includes(activeTag));
    const matchSearch = !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchTag && matchSearch;
  });

  const featured = filtered[0];
  const feedPosts = filtered.slice(1, visibleCount + 1);
  const hasMore = filtered.length > visibleCount + 1;

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      <Nav navigate={navigate} isLoggedIn={isLoggedIn} isMobile={isMobile} />

      {/* Compact Hero */}
      <div style={{
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: isMobile ? "1.5rem 1rem" : "2rem 2.5rem",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
              Repractiq Community
            </div>
            <h1 style={{ fontSize: isMobile ? "1.4rem" : "1.75rem", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
              SQL Blog & Tutorials
            </h1>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "4px 0 0", lineHeight: 1.6 }}>
              {posts.length} posts · Written by the community, for the community
            </p>
          </div>

          {/* Search */}
          <div style={{ display: "flex", gap: "8px", width: isMobile ? "100%" : "340px" }}>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") setSearchTerm(searchInput.trim()); }}
              placeholder="Search posts..."
              style={{ flex: 1, padding: "9px 13px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.85rem", outline: "none", color: "#0f172a", background: "#f8fafc" }}
              onFocus={e => e.target.style.borderColor = "#2563eb"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
            <button
              onClick={() => setSearchTerm(searchInput.trim())}
              style={{ padding: "9px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Tag Strip */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: isMobile ? "0.75rem 1rem" : "0.875rem 2.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <TagStrip activeTag={activeTag} setActiveTag={setActiveTag} />
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: isMobile ? "1rem" : "1.75rem 2.5rem" }}>
        {filtered.length === 0 ? (
          <EmptyState navigate={navigate} isLoggedIn={isLoggedIn} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", gap: "1.5rem", alignItems: "start" }}>

            {/* Feed column */}
            <div>
              {/* Active filter indicator */}
              {(activeTag !== "All" || searchTerm) && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.78rem", color: "#64748b" }}>
                    {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                    {activeTag !== "All" ? ` for "${activeTag}"` : ""}
                    {searchTerm ? ` matching "${searchTerm}"` : ""}
                  </span>
                  <button
                    onClick={() => { setActiveTag("All"); setSearchTerm(""); setSearchInput(""); }}
                    style={{ fontSize: "0.72rem", color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "20px", padding: "2px 8px", cursor: "pointer", fontWeight: 600 }}
                  >
                    Clear ✕
                  </button>
                </div>
              )}

              {/* Featured post */}
              {featured && <PostCard post={featured} navigate={navigate} featured />}

              {/* Feed */}
              {loading ? (
                [1, 2, 3].map(i => <SkeletonCard key={i} />)
              ) : (
                feedPosts.map(post => (
                  <PostCard key={post.id} post={post} navigate={navigate} />
                ))
              )}

              {/* Load more */}
              {hasMore && (
                <button
                  onClick={() => setVisibleCount(prev => prev + 8)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1.5px solid #e2e8f0", background: "#ffffff", color: "#2563eb", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", marginTop: "0.5rem" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#bfdbfe"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                >
                  Load more posts ↓
                </button>
              )}

              {!hasMore && filtered.length > 1 && (
                <div style={{ textAlign: "center", padding: "1.5rem", fontSize: "0.8rem", color: "#94a3b8" }}>
                  You've seen all {filtered.length} posts 🎉
                </div>
              )}
            </div>

            {/* Sidebar — sticky on desktop */}
            {!isMobile && (
              <div style={{ position: "sticky", top: "80px" }}>
                <Sidebar
                  posts={posts}
                  navigate={navigate}
                  isLoggedIn={isLoggedIn}
                  activeTag={activeTag}
                  setActiveTag={setActiveTag}
                />
              </div>
            )}
          </div>
        )}

        {/* Mobile sidebar content at bottom */}
        {isMobile && filtered.length > 0 && (
          <div style={{ marginTop: "1.5rem" }}>
            <Sidebar
              posts={posts}
              navigate={navigate}
              isLoggedIn={isLoggedIn}
              activeTag={activeTag}
              setActiveTag={setActiveTag}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0", padding: isMobile ? "1.5rem 1rem" : "2rem 2.5rem", marginTop: "2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>© 2026 Repractiq. All rights reserved.</span>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
            <Link to="/privacy" style={{ fontSize: "0.75rem", color: "#64748b", textDecoration: "none" }}>Privacy Policy</Link>
            <Link to="/terms" style={{ fontSize: "0.75rem", color: "#64748b", textDecoration: "none" }}>Terms of Use</Link>
            <Link to="/contact" style={{ fontSize: "0.75rem", color: "#64748b", textDecoration: "none" }}>Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}