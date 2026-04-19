import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

const FAQS = [
  {
    q: "Is the platform completely free?",
    a: "Yes. The SQL sandbox and a large set of problems are completely free. We will introduce a Pro tier in the future for advanced features but the core practice experience will always be free."
  },
  {
    q: "Do I need to install anything?",
    a: "No. Everything runs in your browser. Open the platform, write SQL, and run it instantly. No setup, no downloads, no configuration."
  },
  {
    q: "What datasets are available to practice on?",
    a: "We have 25+ real business datasets across e-commerce, SaaS, finance, HR and healthcare. Every dataset is realistic and structured like you would find in a real company."
  },
  {
    q: "How is this different from LeetCode or HackerRank?",
    a: "LeetCode focuses on algorithms and data structures. We focus exclusively on real business problems — the kind of SQL work you actually do as a data analyst or engineer at a company."
  },
  {
    q: "Can I share my profile with recruiters?",
    a: "Yes. Every profile has a public URL you can share. Recruiters can see your solved problems, skill breakdown, streak and badges — proof of ability, not just a resume claim."
  },
  {
    q: "How do I report a bug or suggest a new problem?",
    a: "Use the contact form on this page or email us directly. We read every message and respond within 48 hours."
  },
];

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const { error: insertError } = await supabase.from("contact_messages").insert([{
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    }]);
    if (insertError) {
      setError("Something went wrong. Please try again or email us directly.");
      setIsLoading(false);
    } else {
      setSubmitted(true);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      {/* Nav */}
      <nav style={{ padding: "1rem 2.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.97)", zIndex: 100 }}>
        <span onClick={() => navigate("/")} style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.3px", cursor: "pointer" }}>Data Rejected</span>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link to="/sql" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Practice</Link>
          <Link to="/leaderboard" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Leaderboard</Link>
          <Link to="/signup" style={{ padding: "8px 18px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>Sign Up Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)", borderBottom: "1px solid #e2e8f0", padding: "4rem 2.5rem 3.5rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#2563eb", background: "#ffffff", padding: "5px 14px", borderRadius: "20px", border: "1px solid #bfdbfe", marginBottom: "1.25rem", fontWeight: 600 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2563eb", display: "inline-block" }}></span>
          We respond within 48 hours
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-1.5px", margin: "0 0 1rem", color: "#0f172a" }}>
          Get in Touch
        </h1>
        <p style={{ fontSize: "1rem", color: "#64748b", lineHeight: 1.75, maxWidth: "480px", margin: "0 auto" }}>
          Have a question, found a bug, or want to suggest a new problem? We read every message and respond personally.
        </p>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "4rem 2.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "4rem", alignItems: "start" }}>

          {/* Left — Contact Info */}
          <div>
            <div style={{ marginBottom: "2.5rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Contact Info</div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 0.75rem" }}>We are here to help</h2>
              <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.75 }}>
                Whether you have a technical issue, a feature request, or just want to say hello — reach out and we will get back to you.
              </p>
            </div>

            {/* Contact Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
              {[
                { icon: "✉", label: "Email us", value: "hello@datarejected.com", sub: "We reply within 48 hours" },
                { icon: "💼", label: "LinkedIn", value: "Data Rejected", sub: "Follow for SQL tips and updates" },
                { icon: "▶", label: "YouTube", value: "Data Rejected", sub: "Watch our SQL tutorials" },
              ].map((item, i) => (
                <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1rem 1.25rem", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", margin: "2px 0" }}>{item.value}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Response time badge */}
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "1.2rem" }}>⚡</span>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#16a34a" }}>Fast response guaranteed</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Average response time is under 24 hours</div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div style={{ background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
            {!submitted ? (
              <>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1.5rem", letterSpacing: "-0.3px" }}>Send us a message</h3>

                {error && (
                  <div style={{ marginBottom: "1.25rem", padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#dc2626", fontSize: "0.82rem" }}>{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={labelStyle}>Your Name</label>
                      <input name="name" type="text" required placeholder="John Doe" onChange={handleChange} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address</label>
                      <input name="email" type="email" required placeholder="john@company.com" onChange={handleChange} style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={labelStyle}>Subject</label>
                    <select name="subject" required onChange={handleChange} style={{ ...inputStyle, paddingLeft: "14px" }}>
                      <option value="">Select a topic</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Problem Suggestion">Problem Suggestion</option>
                      <option value="Account Issue">Account Issue</option>
                      <option value="Partnership">Partnership</option>
                      <option value="General Question">General Question</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={labelStyle}>Message</label>
                    <textarea
                      name="message"
                      required
                      placeholder="Tell us what's on your mind..."
                      onChange={handleChange}
                      rows={5}
                      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{ width: "100%", padding: "12px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.9rem", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.8 : 1 }}
                  >
                    {isLoading ? "Sending..." : "Send Message →"}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#f0fdf4", border: "2px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontSize: "1.5rem" }}>✓</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 0.5rem", letterSpacing: "-0.3px" }}>Message sent successfully</h3>
                <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  Thanks for reaching out. We will get back to you at <strong>{formData.email}</strong> within 48 hours.
                </p>
                <button
                  onClick={() => navigate("/sql")}
                  style={{ padding: "10px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}
                >
                  Back to Practice →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "5rem 2.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.72rem", color: "#2563eb", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>FAQ</div>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 0.75rem" }}>Frequently asked questions</h2>
            <p style={{ color: "#64748b", fontSize: "0.95rem" }}>Can't find what you're looking for? Send us a message above.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{ background: "#ffffff", border: `1.5px solid ${openFaq === i ? "#bfdbfe" : "#e2e8f0"}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.15s" }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", padding: "1.1rem 1.25rem", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left", gap: "1rem" }}
                >
                  <span style={{ fontSize: "0.92rem", fontWeight: 600, color: "#0f172a" }}>{faq.q}</span>
                  <span style={{ fontSize: "1rem", color: "#2563eb", flexShrink: 0, fontWeight: 700, transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 1.25rem 1.1rem", fontSize: "0.87rem", color: "#64748b", lineHeight: 1.75 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "2rem 2.5rem", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1000px", margin: "0 auto", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>© 2025 Data Rejected. All rights reserved.</span>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link to="/privacy" style={{ fontSize: "0.75rem", color: "#64748b", textDecoration: "none" }}>Privacy Policy</Link>
            <Link to="/terms" style={{ fontSize: "0.75rem", color: "#64748b", textDecoration: "none" }}>Terms of Use</Link>
          </div>
        </div>
      </div>

    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginBottom: "6px",
};

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "8px",
  border: "1.5px solid #e2e8f0",
  fontSize: "0.9rem",
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
  background: "#ffffff",
};