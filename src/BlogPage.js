import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "./supabase";
import { useMobile } from "./hooks/useMobile";

const TAGS = [
  "All", "SQL Basics", "Joins", "Window Functions", "CTEs",
  "Subqueries", "Aggregations", "Interview Prep", "Career",
  "Real-world Scenarios", "Performance", "Tips & Tricks", "Community Solution"
];

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

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📝</div>
        <div style={{ fontSize: "0.88rem", color: "#64748b" }}>Loading blog...</div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("All");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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
  const rest = filtered.slice(1);

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      {/* Nav */}
      <nav style={{ padding: isMobile ? "0.75rem 1rem" : "0.875rem 2.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.97)", zIndex: 100 }}>
  <span onClick={() => navigate("/")} style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", letterSpacing: "-0.3px", cursor: "pointer" }}>Data Rejected</span>
  {isMobile ? (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      {isLoggedIn && (
        <button onClick={() => navigate("/blog/write")} style={{ padding: "7px 12px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.78rem", border: "none", cursor: "pointer" }}>Write</button>
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
      <Link to="/blog" style={{ fontSize: "0.85rem", color: "#2563eb", textDecoration: "none", fontWeight: 600, borderBottom: "2px solid #2563eb", paddingBottom: "2px" }}>Blog</Link>
      {isLoggedIn ? (
        <button onClick={() => navigate("/blog/write")} style={{ padding: "8px 18px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: "pointer" }}>Write Post</button>
      ) : (
        <Link to="/login" style={{ padding: "8px 18px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>Login</Link>
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

      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)", borderBottom: "1px solid #e2e8f0", padding: isMobile ? "2rem 1rem" : "3rem 2.5rem 2.5rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#2563eb", background: "#ffffff", padding: "5px 14px", borderRadius: "20px", border: "1px solid #bfdbfe", marginBottom: "1.25rem", fontWeight: 600 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2563eb", display: "inline-block" }} />
          SQL insights, tips & community posts
        </div>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 1rem", color: "#0f172a" }}>
          The Data Rejected Blog
        </h1>
        <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: 1.75, maxWidth: "480px", margin: "0 auto 1.5rem" }}>
          SQL tutorials, interview breakdowns, real-world scenarios and community solutions — written by practitioners for practitioners.
        </p>

        {/* Search */}
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "8px", justifyContent: "center", maxWidth: "420px", margin: "0 auto" }}>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") setSearchTerm(searchInput.trim()); }}
            placeholder="Search posts..."
            style={{ flex: 1, padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.88rem", outline: "none", color: "#0f172a" }}
          />
          <button
            onClick={() => setSearchTerm(searchInput.trim())}
            style={{ padding: "10px 18px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
          >
            Search
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: isMobile ? "1rem" : "2.5rem 2.5rem" }}>

        {/* Tag Filter */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "2rem" }}>
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              style={{ padding: "6px 14px", borderRadius: "20px", border: "1.5px solid", borderColor: activeTag === tag ? "#2563eb" : "#e2e8f0", background: activeTag === tag ? "#eff6ff" : "#ffffff", color: activeTag === tag ? "#2563eb" : "#64748b", fontWeight: activeTag === tag ? 700 : 500, fontSize: "0.78rem", cursor: "pointer" }}
            >
              {tag}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#94a3b8" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📭</div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>No posts found</div>
            <div style={{ fontSize: "0.85rem" }}>Try a different tag or search term</div>
            {isLoggedIn && (
              <button onClick={() => navigate("/blog/write")} style={{ marginTop: "1.5rem", padding: "10px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
                Write the first post →
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featured && (
              <div
                onClick={() => navigate(`/blog/${featured.slug}`)}
                style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "16px", padding: isMobile ? "1.25rem" : "2rem", marginBottom: "2.5rem", cursor: "pointer", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "2rem", alignItems: "center" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#bfdbfe"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <div>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "1rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.68rem", padding: "3px 10px", borderRadius: "20px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", fontWeight: 700 }}>Featured</span>
                    {featured.category && (
                      <span style={{ fontSize: "0.68rem", padding: "3px 10px", borderRadius: "20px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", fontWeight: 600 }}>{featured.category}</span>
                    )}
                  </div>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.75rem", letterSpacing: "-0.5px", lineHeight: 1.3 }}>{featured.title}</h2>
                  <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.7, margin: "0 0 1.25rem" }}>{featured.excerpt}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "#2563eb" }}>
                      {getInitials(featured.author_name)}
                    </div>
                    <div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f172a" }}>{featured.author_name}</div>
                      <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{timeAgo(featured.created_at)} · {featured.views || 0} views</div>
                    </div>
                  </div>
                </div>
                {!isMobile && (
  <div
    style={{
      background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      borderRadius: "12px",
      height: "220px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "4rem"
    }}
  >
    📊
  </div>
)}
              </div>
            )}

            {/* Post Grid */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "1.25rem" }}>
              {rest.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "14px", overflow: "hidden", cursor: "pointer", transition: "border-color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#bfdbfe"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                >
                  {/* Card Image */}
                  <div style={{ background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)", height: "120px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>
                    {post.category === "Interview Prep" ? "🎯" : post.category === "Career" ? "💼" : post.category === "Real-world Scenarios" ? "🏢" : "📝"}
                  </div>

                  <div style={{ padding: "1.125rem" }}>
                    {/* Tags */}
                    <div style={{ display: "flex", gap: "6px", marginBottom: "0.625rem", flexWrap: "wrap" }}>
                      {(post.tags || []).slice(0, 2).map(tag => (
                        <span key={tag} style={{ fontSize: "0.62rem", padding: "2px 7px", borderRadius: "10px", background: "#eff6ff", color: "#2563eb", fontWeight: 600 }}>{tag}</span>
                      ))}
                    </div>

                    <h3 style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem", lineHeight: 1.4, letterSpacing: "-0.2px" }}>{post.title}</h3>
                    <p style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.6, margin: "0 0 1rem" }}>
                      {post.excerpt?.slice(0, 100)}{post.excerpt?.length > 100 ? "..." : ""}
                    </p>

                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: "#2563eb" }}>
                          {getInitials(post.author_name)}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#0f172a" }}>{post.author_name}</div>
                          <div style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{timeAgo(post.created_at)}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", fontSize: "0.68rem", color: "#94a3b8" }}>
                        <span>👁 {post.views || 0}</span>
                        <span>❤️ {post.likes || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Write CTA for guests */}
        {!isLoggedIn && (
          <div style={{ marginTop: "3rem", background: "#0f172a", borderRadius: "16px", padding: "2rem", textAlign: "center", color: "#fff" }}>
            <div style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "0.5rem" }}>Share your SQL knowledge</div>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.25rem", lineHeight: 1.6 }}>
              Sign up to write blog posts, share solutions and help the community grow.
            </p>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "10px", justifyContent: "center" }}>
              <Link to="/signup" style={{ padding: "10px 24px", background: "#2563eb", color: "#fff", borderRadius: "8px", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>Sign Up Free →</Link>
              <Link to="/login" style={{ padding: "10px 24px", background: "transparent", color: "#fff", borderRadius: "8px", fontWeight: 600, fontSize: "0.88rem", textDecoration: "none", border: "1px solid #334155" }}>Login</Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "2rem 2.5rem", marginTop: "2rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>© 2025 Data Rejected. All rights reserved.</span>
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