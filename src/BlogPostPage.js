import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "./supabase";
import { useMobile } from "./hooks/useMobile";

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
        <div style={{ fontSize: "0.88rem", color: "#64748b" }}>Loading post...</div>
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isMobile = useMobile();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      // Auth check
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      setIsLoggedIn(!!session);

      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .maybeSingle();
        setCurrentUser({ id: session.user.id, name: profile?.full_name || session.user.email?.split("@")[0] || "User" });
      }

      // Fetch post
      const { data: postData, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error || !postData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setPost(postData);
      setLikeCount(postData.likes || 0);

      // Increment view count
      await supabase
        .from("blogs")
        .update({ views: (postData.views || 0) + 1 })
        .eq("id", postData.id);

      // Check if current user liked this post
      if (session) {
        const { data: likeData } = await supabase
          .from("blog_likes")
          .select("id")
          .eq("blog_id", postData.id)
          .eq("user_id", session.user.id)
          .maybeSingle();
        setLiked(!!likeData);
      }

      // Fetch comments
      const { data: commentsData } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("blog_id", postData.id)
        .order("created_at", { ascending: true });

      setComments(commentsData || []);
      setLoading(false);
    };

    load();
  }, [slug]);

  const handleLike = async () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    if (!post) return;

    if (liked) {
      // Unlike
      await supabase
        .from("blog_likes")
        .delete()
        .eq("blog_id", post.id)
        .eq("user_id", currentUser.id);

      await supabase
        .from("blogs")
        .update({ likes: Math.max(0, likeCount - 1) })
        .eq("id", post.id);

      setLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
    } else {
      // Like
      await supabase
        .from("blog_likes")
        .insert({ blog_id: post.id, user_id: currentUser.id });

      await supabase
        .from("blogs")
        .update({ likes: likeCount + 1 })
        .eq("id", post.id);

      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleComment = async () => {
    if (!isLoggedIn) { navigate("/login"); return; }
    if (!commentText.trim() || !post) return;

    setSubmittingComment(true);

    const { data, error } = await supabase
      .from("blog_comments")
      .insert({
        blog_id: post.id,
        user_id: currentUser.id,
        author_name: currentUser.name,
        content: commentText.trim(),
      })
      .select()
      .single();

    if (!error && data) {
      setComments((prev) => [...prev, data]);
      setCommentText("");
    }

    setSubmittingComment(false);
  };

  if (loading) return <LoadingScreen />;

  if (notFound) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", flexDirection: "column", gap: "1rem" }}>
      <div style={{ fontSize: "3rem" }}>📭</div>
      <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>Post not found</div>
      <div style={{ fontSize: "0.88rem", color: "#64748b" }}>This post may have been removed or doesn't exist.</div>
      <button onClick={() => navigate("/blog")} style={{ padding: "10px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer" }}>Back to Blog</button>
    </div>
  );

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      {/* Nav */}
      <nav style={{ padding: isMobile ? "0.75rem 1rem" : "0.875rem 2.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.97)", zIndex: 100 }}>
  <span onClick={() => navigate("/")} style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", letterSpacing: "-0.3px", cursor: "pointer" }}>Repractiq</span>
  {isMobile ? (
    <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#0f172a" }}>
      {menuOpen ? "✕" : "☰"}
    </button>
  ) : (
    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
      <Link to="/sql" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Practice</Link>
      <Link to="/blog" style={{ fontSize: "0.85rem", color: "#2563eb", textDecoration: "none", fontWeight: 600, borderBottom: "2px solid #2563eb", paddingBottom: "2px" }}>Blog</Link>
      {isLoggedIn ? (
        <button onClick={() => navigate("/home")} style={{ padding: "8px 18px", borderRadius: "7px", background: "#f8fafc", color: "#0f172a", fontWeight: 600, fontSize: "0.85rem", border: "1px solid #e2e8f0", cursor: "pointer" }}>Home</button>
      ) : (
        <Link to="/login" style={{ padding: "8px 18px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>Login</Link>
      )}
    </div>
  )}
  {isMobile && menuOpen && (
    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "0.5rem 0", zIndex: 200 }}>
      {[["Practice", "/sql"], ["Blog", "/blog"], [isLoggedIn ? "Home" : "Login", isLoggedIn ? "/home" : "/login"]].map(([label, path]) => (
        <div key={label} onClick={() => { navigate(path); setMenuOpen(false); }} style={{ padding: "0.75rem 1.25rem", fontSize: "0.9rem", color: "#0f172a", fontWeight: 500, cursor: "pointer", borderBottom: "1px solid #f1f5f9" }}>
          {label}
        </div>
      ))}
    </div>
  )}
</nav>

      {/* Breadcrumb */}
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: isMobile ? "1rem 1rem 0"  : "1.25rem 2.5rem 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.78rem", color: "#94a3b8" }}>
          <span onClick={() => navigate("/blog")} style={{ cursor: "pointer", color: "#2563eb", fontWeight: 600 }}>Blog</span>
          <span>→</span>
          <span style={{ color: "#64748b" }}>{post.category}</span>
        </div>
      </div>

      {/* Post Content */}
      <article style={{ maxWidth: "780px", margin: "0 auto", padding: isMobile ? "1rem" : "2rem 2.5rem" }}>

        {/* Tags */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          {(post.tags || []).map(tag => (
            <span key={tag} style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: "20px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", fontWeight: 600 }}>{tag}</span>
          ))}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.75px", lineHeight: 1.25, margin: "0 0 1.25rem", color: "#0f172a" }}>
          {post.title}
        </h1>

        {/* Author + Meta */}
        <div style={{ display: "flex",  flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between",  gap: isMobile ? "12px" : "0", padding: "1rem 0", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#eff6ff", border: "1.5px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 700, color: "#2563eb" }}>
              {getInitials(post.author_name)}
            </div>
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>{post.author_name}</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{timeAgo(post.created_at)} · {post.views || 0} views</div>
            </div>
          </div>
          <div
  style={{
    display: "flex",
    gap: "12px",
    alignItems: "center",
    padding: "8px 18px",
    width: isMobile ? "100%" : "auto",
    justifyContent: "center"
  }}
>
            <button
              onClick={handleLike}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", border: `1.5px solid ${liked ? "#fca5a5" : "#e2e8f0"}`, background: liked ? "#fef2f2" : "#fff", color: liked ? "#dc2626" : "#64748b", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}
            >
              {liked ? "❤️" : "🤍"} {likeCount}
            </button>
          </div>
        </div>

        {/* Post Body — rendered as HTML from rich text editor */}
        <div
  style={{ fontSize: isMobile ? "0.9rem" : "0.95rem", lineHeight: 1.85, color: "#1e293b", overflowX: "hidden", wordBreak: "break-word" }}
  dangerouslySetInnerHTML={{ __html: post.content }}
/>

        {/* Tags at bottom */}
        {(post.tags || []).length > 0 && (
          <div style={{ marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Tags</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {post.tags.map(tag => (
                <span key={tag} onClick={() => navigate(`/blog?tag=${tag}`)} style={{ fontSize: "0.78rem", padding: "4px 12px", borderRadius: "20px", background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", cursor: "pointer", fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Like + share */}
        <div
  style={{
    marginTop: "2.5rem",
    padding: "1.5rem",
    background: "#f8fafc",
    borderRadius: "14px",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "stretch" : "center",
    justifyContent: "space-between",
    gap: isMobile ? "12px" : "0"
  }}
>
          <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#0f172a" }}>Found this helpful?</div>
          <button
            onClick={handleLike}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", borderRadius: "8px", border: `1.5px solid ${liked ? "#fca5a5" : "#e2e8f0"}`, background: liked ? "#fef2f2" : "#fff", color: liked ? "#dc2626" : "#64748b", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}
          >
            {liked ? "❤️ Liked!" : "🤍 Like this post"} · {likeCount}
          </button>
        </div>

        {/* Comments */}
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", margin: "0 0 1.5rem", letterSpacing: "-0.3px" }}>
            Comments ({comments.length})
          </h2>

          {/* Comment Input */}
          {isLoggedIn ? (
            <div style={{ marginBottom: "1.5rem", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "1rem" }}>
              <div
  style={{
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: "10px",
    alignItems: "flex-start"
  }}
>
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: "#2563eb", flexShrink: 0 }}>
                  {getInitials(currentUser?.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts or questions..."
                    rows={3}
                    style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", outline: "none", resize: "none", color: "#0f172a", boxSizing: "border-box", background: "#fff" }}
                    onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                    onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                    <button
                      onClick={handleComment}
                      disabled={submittingComment || !commentText.trim()}
                      style={{ padding: "8px 20px", background: commentText.trim() ? "#2563eb" : "#94a3b8", color: "#fff", border: "none", borderRadius: "7px", fontWeight: 700, fontSize: "0.82rem", cursor: commentText.trim() ? "pointer" : "not-allowed" }}
                    >
                      {submittingComment ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: "1.5rem", background: "#f8fafc", border: "1.5px dashed #e2e8f0", borderRadius: "12px", padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.75rem" }}>Sign in to leave a comment</div>
              <div
  style={{
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: "8px",
    justifyContent: "center"
  }}
>
                <button onClick={() => navigate("/login")} style={{ padding: "8px 18px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "7px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>Login</button>
                <button onClick={() => navigate("/signup")} style={{ padding: "8px 18px", background: "#fff", color: "#2563eb", border: "1.5px solid #bfdbfe", borderRadius: "7px", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}>Sign Up Free</button>
              </div>
            </div>
          )}

          {/* Comments List */}
          {comments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8", fontSize: "0.85rem" }}>
              No comments yet — be the first to share your thoughts!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {comments.map((c) => (
                <div key={c.id} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 700, color: "#2563eb", flexShrink: 0 }}>
                    {getInitials(c.author_name)}
                  </div>
                  <div style={{ flex: 1, background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "10px", padding: "0.875rem" }}>
                    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", marginBottom: "0.375rem", gap: "4px"}}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a" }}>{c.author_name}</span>
                      <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>{timeAgo(c.created_at)}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#334155", lineHeight: 1.6 }}>{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to blog */}
        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #f1f5f9" }}>
          <button
            onClick={() => navigate("/blog")}
            style={{ fontSize: "0.85rem", color: "#2563eb", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            ← Back to Blog
          </button>
        </div>
      </article>
    </div>
  );
}