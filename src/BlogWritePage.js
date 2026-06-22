import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "./supabase";
import { useMobile } from "./hooks/useMobile";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import sql from "highlight.js/lib/languages/sql";
import { usePageMeta } from "./hooks/usePageMeta";
import { marked } from "marked";

const lowlight = createLowlight();
lowlight.register({ sql });

const TAGS = [
  "SQL Basics", "Joins", "Window Functions", "CTEs",
  "Subqueries", "Aggregations", "Interview Prep", "Career",
  "Real-world Scenarios", "Performance", "Tips & Tricks", "Community Solution"
];

const CATEGORIES = [
  "SQL Basics", "SQL Intermediate", "SQL Advanced",
  "Interview Prep", "Career", "Real-world Scenarios", "Tips & Tricks", "Community"
];

function generateExcerpt(html) {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 160 ? text.slice(0, 157) + "..." : text;
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    + "-" + Date.now().toString(36);
}

function MenuBar({ editor, onImportMarkdown }) {
  if (!editor) return null;

  const btn = (action, label, isActive = false) => (
    <button
      onClick={action}
      style={{
        padding: "5px 10px",
        borderRadius: "5px",
        border: "1px solid",
        borderColor: isActive ? "#2563eb" : "#e2e8f0",
        background: isActive ? "#eff6ff" : "#fff",
        color: isActive ? "#2563eb" : "#64748b",
        fontSize: "0.75rem",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", padding: "0.5rem", fontSize: "0.7rem", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
      {btn(() => editor.chain().focus().toggleBold().run(), "Bold", editor.isActive("bold"))}
      {btn(() => editor.chain().focus().toggleItalic().run(), "Italic", editor.isActive("italic"))}
      {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), "H2", editor.isActive("heading", { level: 2 }))}
      {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), "H3", editor.isActive("heading", { level: 3 }))}
      {btn(() => editor.chain().focus().toggleBulletList().run(), "• List", editor.isActive("bulletList"))}
      {btn(() => editor.chain().focus().toggleOrderedList().run(), "1. List", editor.isActive("orderedList"))}
      {btn(() => editor.chain().focus().toggleBlockquote().run(), "Quote", editor.isActive("blockquote"))}
      {btn(() => editor.chain().focus().toggleCode().run(), "Code", editor.isActive("code"))}
      {btn(() => editor.chain().focus().toggleCodeBlock({ language: "sql" }).run(), "SQL Block", editor.isActive("codeBlock"))}
      {btn(() => editor.chain().focus().setHorizontalRule().run(), "--- Rule")}
      {btn(() => editor.chain().focus().undo().run(), "↩ Undo")}
      {btn(() => editor.chain().focus().redo().run(), "↪ Redo")}
      <div style={{ width: "1px", background: "#e2e8f0", margin: "0 4px" }} />
      <button
        onClick={onImportMarkdown}
        style={{ padding: "5px 10px", borderRadius: "5px", border: "1px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
      >
        📋 Import Markdown
      </button>
    </div>
  );
}

export default function BlogWritePage() {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMarkdownImport, setShowMarkdownImport] = useState(false);
const [markdownInput, setMarkdownInput] = useState("");

const handleMarkdownImport = () => {
  if (!markdownInput.trim()) return;
  const html = marked.parse(markdownInput);
  editor?.commands.setContent(html);
  setShowMarkdownImport(false);
  setMarkdownInput("");
};

  usePageMeta({
    title: "SQL Tips & Tutorials | Repractiq Blog",
    description: "Learn SQL concepts, interview tips, and data analysis techniques. Practical articles for data analysts and aspiring SQL professionals.",
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight, defaultLanguage: "sql" }),
    ],
    content: "<p>Start writing your post here...</p>",
    editorProps: {
      attributes: {
        style: "min-height: 400px; padding: 1.25rem; outline: none; font-size: 0.95rem; line-height: 1.85; color: #1e293b; font-family: Inter, sans-serif;",
      },
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      if (!session) { navigate("/login"); return; }
      setIsLoggedIn(true);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .maybeSingle();

      setCurrentUser({
        id: session.user.id,
        name: profile?.full_name || session.user.email?.split("@")[0] || "User",
      });
    };
    checkAuth();
  }, [navigate]);

  const toggleTag = useCallback((tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required";
    if (selectedTags.length === 0) e.tags = "Select at least one tag";
    const content = editor?.getHTML();
    if (!content || content === "<p>Start writing your post here...</p>" || content === "<p></p>") {
      e.content = "Post content cannot be empty";
    }
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setSubmitting(true);
  
    const slug = slugify(title);
    const content = editor.getHTML();
    const excerpt = generateExcerpt(content);
  
    const { error } = await supabase.from("blogs").insert({
      title: title.trim(),
      slug,
      content,
      excerpt,
      author_id: currentUser.id,
      author_name: currentUser.name,
      category: "Community",
      tags: selectedTags,
      status: "pending",
    });
  
    setSubmitting(false);
  
    if (error) {
      setErrors({ submit: "Failed to submit. Please try again." });
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", background: "#fff" }}>
      <div style={{ textAlign: "center", maxWidth: "440px", padding: "2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.75rem" }}>Post submitted for review!</h2>
        <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          Your post is now pending approval. Once reviewed, it will appear on the blog for everyone to read.
        </p>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", width: isMobile ? "100%" : "auto", gap: "10px", justifyContent: "center" }}>
          <button onClick={() => navigate("/blog")} style={{ padding: "10px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
            Back to Blog
          </button>
          <button onClick={() => { setSubmitted(false); setTitle(""); setSelectedTags([]); editor?.commands.setContent("<p>Start writing your post here...</p>"); }} style={{ padding: "10px 24px", background: "#fff", color: "#2563eb", border: "1.5px solid #bfdbfe", borderRadius: "8px", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}>
            Write Another
          </button>
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) return null;

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      {/* Nav */}
      <nav style={{ padding: isMobile ? "0.75rem 1rem" : "0.875rem 2.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.97)", zIndex: 100 }}>
  {/* Logo / Brand */}
  <span onClick={() => navigate("/")} style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", letterSpacing: "-0.3px", cursor: "pointer" }}>Repractiq</span>
  
  {isMobile ? (
    /* Mobile Layout */
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <button 
        onClick={handleSubmit} 
        disabled={submitting} 
        style={{ padding: "6px 14px", borderRadius: "7px", background: submitting ? "#94a3b8" : "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.78rem", border: "none", cursor: submitting ? "not-allowed" : "pointer" }}
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
      <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#0f172a", display: "flex", alignItems: "center" }}>
        {menuOpen ? "✕" : "☰"}
      </button>
    </div>
  ) : (
    /* Desktop Layout */
    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
      <Link to="/home" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>Home</Link>
      <Link to="/sql" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>Practice</Link>
      <Link to="/leaderboard" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>Leaderboard</Link>
      <Link to="/blog" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 600 }}>Blog</Link>
      
      {/* Editorial Action Separator */}
      <div style={{ height: "16px", width: "1px", background: "#e2e8f0", margin: "0 4px" }} />
      
      <button onClick={() => navigate("/blog")} style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>← Back to Blog</button>
      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{ padding: "8px 18px", borderRadius: "7px", background: submitting ? "#94a3b8" : "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: submitting ? "not-allowed" : "pointer" }}
      >
        {submitting ? "Submitting..." : "Submit for Review →"}
      </button>
    </div>
  )}

  {/* Mobile Dropdown Menu Container */}
  {isMobile && menuOpen && (
    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "0.5rem 0", zIndex: 200 }}>
      {[
        ["Home", "/home"], 
        ["Practice", "/sql"], 
        ["Leaderboard", "/leaderboard"], 
        ["Blog", "/blog"]
      ].map(([label, path]) => (
        <div key={label} onClick={() => { navigate(path); setMenuOpen(false); }} style={{ padding: "0.75rem 1.25rem", fontSize: "0.9rem", color: "#0f172a", fontWeight: 500, cursor: "pointer", borderBottom: "1px solid #f1f5f9" }}>
          {label}
        </div>
      ))}
      <div onClick={() => { navigate("/blog"); setMenuOpen(false); }} style={{ padding: "0.75rem 1.25rem", fontSize: "0.9rem", color: "#64748b", fontWeight: 500, cursor: "pointer" }}>
        ← Back to Blog
      </div>
    </div>
  )}
</nav>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: isMobile ? "1rem" : "2.5rem 2.5rem" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.72rem", color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Write a Post</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 0.5rem", color: "#0f172a" }}>Share your SQL knowledge</h1>
          <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>Posts are reviewed before publishing. Keep it helpful and SQL-related.</p>
        </div>

        {errors.submit && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontSize: "0.85rem", color: "#dc2626" }}>
            {errors.submit}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Title */}
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
              Title *
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to use Window Functions in SQL"
              style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${errors.title ? "#fca5a5" : "#e2e8f0"}`, borderRadius: "8px", fontSize: "0.95rem", outline: "none", color: "#0f172a", boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
              onFocus={(e) => e.target.style.borderColor = "#2563eb"}
              onBlur={(e) => e.target.style.borderColor = errors.title ? "#fca5a5" : "#e2e8f0"}
            />
            {errors.title && <div style={{ fontSize: "0.75rem", color: "#dc2626", marginTop: "4px" }}>{errors.title}</div>}
          </div>

          {/* Word count indicator */}
<div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px 14px", width: "fit-content" }}>
  <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>Content length</div>
  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a" }}>
    {editor?.getText().trim().split(/\s+/).filter(Boolean).length || 0} words
  </div>
</div>

          {/* Tags */}
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
              Tags * <span style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 500, textTransform: "none" }}>(select all that apply)</span>
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{ padding: "6px 14px", borderRadius: "20px", border: "1.5px solid", borderColor: selectedTags.includes(tag) ? "#2563eb" : "#e2e8f0", background: selectedTags.includes(tag) ? "#eff6ff" : "#fff", color: selectedTags.includes(tag) ? "#2563eb" : "#64748b", fontWeight: selectedTags.includes(tag) ? 700 : 500, fontSize: "0.78rem", cursor: "pointer" }}
                >
                  {selectedTags.includes(tag) ? "✓ " : ""}{tag}
                </button>
              ))}
            </div>
            {errors.tags && <div style={{ fontSize: "0.75rem", color: "#dc2626", marginTop: "6px" }}>{errors.tags}</div>}
          </div>

          {/* Rich Text Editor */}
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
              Content *
            </label>
            <div style={{ border: `1.5px solid ${errors.content ? "#fca5a5" : "#e2e8f0"}`, borderRadius: "12px", overflow: "hidden" }}>
            <MenuBar editor={editor} onImportMarkdown={() => setShowMarkdownImport(true)} />
              <EditorContent editor={editor} />
            </div>
            {errors.content && <div style={{ fontSize: "0.75rem", color: "#dc2626", marginTop: "4px" }}>{errors.content}</div>}
            <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "6px" }}>
              Tip: Use the "SQL Block" button to add formatted SQL code examples with syntax highlighting.
            </div>
          </div>

          {/* Guidelines */}
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem 1.25rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>📋 Submission Guidelines</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {[
                "Keep content SQL-related and helpful to the community",
                "Include code examples where possible",
                "Explain concepts clearly — write for someone learning",
                "Posts are reviewed before publishing (usually within 24h)",
                "No spam, self-promotion or off-topic content",
              ].map((g, i) => (
                <div key={i} style={{ fontSize: "0.78rem", color: "#64748b", display: "flex", gap: "6px" }}>
                  <span style={{ color: "#16a34a" }}>✓</span> {g}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", width: isMobile ? "100%" : "auto", justifyContent: "flex-end", gap: "10px", paddingBottom: "2rem"}}>
            <button onClick={() => navigate("/blog")} style={{ padding: "11px 22px", background: "#fff", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ padding: "11px 28px", background: submitting ? "#94a3b8" : "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.88rem", cursor: submitting ? "not-allowed" : "pointer" }}
            >
              {submitting ? "Submitting..." : "Submit for Review →"}
            </button>
          </div>
        </div>
      </div>
      {showMarkdownImport && (
  <div
    style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
    onClick={(e) => { if (e.target === e.currentTarget) setShowMarkdownImport(false); }}
  >
    <div style={{ background: "#ffffff", borderRadius: "16px", padding: "1.75rem", width: "640px", maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
      <h3 style={{ margin: "0 0 4px", fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>Import Markdown</h3>
      <p style={{ margin: "0 0 1rem", fontSize: "0.82rem", color: "#64748b" }}>
        Paste your Markdown content below. Headings, code blocks, bold, lists and links will convert automatically.
      </p>
      <textarea
        value={markdownInput}
        onChange={(e) => setMarkdownInput(e.target.value)}
        placeholder="## Heading&#10;&#10;Your content here...&#10;&#10;```sql&#10;SELECT * FROM customers;&#10;```"
        rows={12}
        style={{ width: "100%", padding: "0.75rem", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.82rem", fontFamily: "monospace", outline: "none", resize: "vertical", color: "#0f172a", boxSizing: "border-box", marginBottom: "1.25rem" }}
        onFocus={(e) => e.target.style.borderColor = "#2563eb"}
        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
      />
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button onClick={() => setShowMarkdownImport(false)} style={{ padding: "8px 18px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "#ffffff", color: "#64748b", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
          Cancel
        </button>
        <button onClick={handleMarkdownImport} style={{ padding: "8px 22px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#ffffff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
          Convert & Insert →
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}