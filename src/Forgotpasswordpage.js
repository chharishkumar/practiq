import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "./supabase";

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
    { label: "Special character", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const levels = [
    { label: "Too weak", color: "#dc2626" },
    { label: "Weak", color: "#f97316" },
    { label: "Fair", color: "#eab308" },
    { label: "Good", color: "#22c55e" },
    { label: "Strong", color: "#16a34a" },
  ];
  const { label, color } = levels[score];
  return (
    <div style={{ marginTop: "10px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", background: i < score ? color : "#e2e8f0", transition: "background 0.2s" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {checks.map(c => (
            <span key={c.label} style={{ fontSize: "0.65rem", color: c.pass ? "#16a34a" : "#94a3b8", display: "flex", gap: "3px", alignItems: "center" }}>
              <span>{c.pass ? "✓" : "○"}</span>{c.label}
            </span>
          ))}
        </div>
        <span style={{ fontSize: "0.68rem", fontWeight: 700, color }}>{label}</span>
      </div>
    </div>
  );
}

const inputBase = {
  width: "100%", padding: "11px 14px", borderRadius: "8px",
  border: "1.5px solid #e2e8f0", fontSize: "0.9rem", color: "#0f172a",
  outline: "none", boxSizing: "border-box", background: "#ffffff",
  fontFamily: "Inter, sans-serif",
};

const labelStyle = {
  display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#64748b",
  textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "6px",
};

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // Detect if this is a callback from Supabase reset link
  const [isResetCallback, setIsResetCallback] = useState(false);

  // Step 0 — request reset
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Step 1 — set new password (after callback)
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwError, setPwError] = useState("");
  const [done, setDone] = useState(false);

  // Detect Supabase auth callback in URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery") || hash.includes("access_token")) {
      setIsResetCallback(true);
      // Let Supabase process the token from the URL
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) {
          // Token not yet processed — try exchanging it
          supabase.auth.exchangeCodeForSession(window.location.href).catch(() => {});
        }
      });
    }
  }, []);

  const handleSendReset = async (e) => {
    e.preventDefault();
    setEmailError("");
    const val = email.trim();
    if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(val, {
      redirectTo: `${window.location.origin}/forgot-password`,
    });
    setLoading(false);
    if (error) {
      setEmailError(error.message || "Something went wrong. Try again.");
    } else {
      setEmailSent(true);
    }
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setPwError("");
    if (password.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setPwError("Passwords don't match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setPwError(error.message || "Failed to update password. Try again.");
    } else {
      setDone(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      {/* Left branding panel */}
      <div style={{ width: "42%", background: "#0f172a", padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Link to="/" style={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem", letterSpacing: "-0.3px", textDecoration: "none" }}>
          Data Rejected
        </Link>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#60a5fa", background: "rgba(96,165,250,0.1)", padding: "5px 14px", borderRadius: "20px", border: "1px solid rgba(96,165,250,0.2)", marginBottom: "1.5rem", fontWeight: 600 }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#60a5fa", display: "inline-block" }} />
            Account recovery
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: "1rem" }}>
            Let's get you<br /><span style={{ color: "#60a5fa" }}>back in.</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.75, marginBottom: "2rem" }}>
            {isResetCallback
              ? "You're one step away. Set a new strong password for your account."
              : "Enter your email and we'll send you a secure link to reset your password."}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { num: "01", title: "Enter your email", desc: "We'll send a secure reset link.", done: isResetCallback || emailSent },
              { num: "02", title: "Click the link in your email", desc: "Opens this page with a verified token.", done: isResetCallback },
              { num: "03", title: "Set a new password", desc: "Choose something strong.", done: done },
            ].map((s) => (
              <div key={s.num} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", border: `1.5px solid ${s.done ? "#60a5fa" : "rgba(96,165,250,0.25)"}`, background: s.done ? "rgba(96,165,250,0.15)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.65rem", fontWeight: 800, color: s.done ? "#60a5fa" : "#475569" }}>
                  {s.done ? "✓" : s.num}
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: s.done ? "#ffffff" : "#94a3b8" }}>{s.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "2px" }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: "0.75rem", color: "#475569" }}>© 2025 Data Rejected. All rights reserved.</div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.78rem", color: "#64748b", textDecoration: "none", fontWeight: 500, marginBottom: "1.75rem" }}>
            ← Back to login
          </Link>

          {/* STATE 1 — Email sent confirmation */}
          {emailSent && !isResetCallback && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#eff6ff", border: "2px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontSize: "1.75rem" }}>
                ✉
              </div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.75px", margin: "0 0 0.5rem" }}>Check your email</h2>
              <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.65, marginBottom: "0.5rem" }}>
                We sent a reset link to
              </p>
              <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: "1.5rem" }}>{email}</p>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem", marginBottom: "1.5rem", fontSize: "0.82rem", color: "#64748b", lineHeight: 1.65, textAlign: "left" }}>
                <strong style={{ color: "#0f172a" }}>Next steps:</strong><br />
                1. Open your email inbox<br />
                2. Click the reset link we sent<br />
                3. You'll be brought back here to set a new password<br /><br />
                <span style={{ color: "#94a3b8" }}>Don't see it? Check your spam folder.</span>
              </div>
              <button
                onClick={() => { setEmailSent(false); setEmail(""); }}
                style={{ width: "100%", padding: "11px", background: "#ffffff", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}
              >
                Use a different email
              </button>
            </div>
          )}

          {/* STATE 2 — Request reset email */}
          {!emailSent && !isResetCallback && (
            <>
              <div style={{ marginBottom: "1.75rem" }}>
                <h2 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.75px", margin: "0 0 6px" }}>Forgot your password?</h2>
                <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0 }}>Enter your account email and we'll send a reset link.</p>
              </div>

              {emailError && (
                <div style={{ marginBottom: "1rem", padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#dc2626", fontSize: "0.82rem" }}>
                  {emailError}
                </div>
              )}

              <form onSubmit={handleSendReset}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={labelStyle}>Email address</label>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setEmailError(""); }}
                    autoFocus
                    style={inputBase}
                    onFocus={e => e.target.style.borderColor = "#2563eb"}
                    onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  />
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "6px" }}>
                    We'll send a secure link to this email address.
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  style={{ width: "100%", padding: "12px", background: loading || !email.trim() ? "#94a3b8" : "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.9rem", cursor: loading || !email.trim() ? "not-allowed" : "pointer" }}
                >
                  {loading ? "Sending link…" : "Send reset link →"}
                </button>
              </form>

              <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.83rem", color: "#64748b" }}>
                Remembered your password?{" "}
                <Link to="/login" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
              </p>
            </>
          )}

          {/* STATE 3 — Set new password (after clicking email link) */}
          {isResetCallback && !done && (
            <>
              <div style={{ marginBottom: "1.75rem" }}>
                <h2 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.75px", margin: "0 0 6px" }}>Set a new password</h2>
                <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0 }}>Choose a strong password you haven't used before.</p>
              </div>

              {pwError && (
                <div style={{ marginBottom: "1rem", padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#dc2626", fontSize: "0.82rem" }}>
                  {pwError}
                </div>
              )}

              <form onSubmit={handleSetPassword}>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={labelStyle}>New password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setPwError(""); }}
                      autoFocus
                      style={{ ...inputBase, paddingRight: "52px" }}
                      onFocus={e => e.target.style.borderColor = "#2563eb"}
                      onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                </div>

                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={labelStyle}>Confirm new password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat new password"
                      value={confirm}
                      onChange={e => { setConfirm(e.target.value); setPwError(""); }}
                      style={{ ...inputBase, paddingRight: "52px", borderColor: confirm && password !== confirm ? "#fca5a5" : confirm && password === confirm ? "#86efac" : "#e2e8f0" }}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>
                      {showConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                  {confirm && password !== confirm && <div style={{ fontSize: "0.72rem", color: "#dc2626", marginTop: "5px" }}>Passwords don't match</div>}
                  {confirm && password === confirm && <div style={{ fontSize: "0.72rem", color: "#16a34a", marginTop: "5px" }}>✓ Passwords match</div>}
                </div>

                <button
                  type="submit"
                  disabled={loading || !password || !confirm || password !== confirm || password.length < 8}
                  style={{ width: "100%", padding: "12px", background: (loading || !password || !confirm || password !== confirm || password.length < 8) ? "#94a3b8" : "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
                >
                  {loading ? "Updating password…" : "Update password →"}
                </button>
              </form>
            </>
          )}

          {/* STATE 4 — Done */}
          {done && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f0fdf4", border: "2px solid #86efac", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontSize: "1.75rem" }}>
                ✓
              </div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.75px", margin: "0 0 0.5rem" }}>Password updated!</h2>
              <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.65, marginBottom: "2rem" }}>
                Your password has been changed successfully. You can now sign in with your new password.
              </p>
              <button
                onClick={() => navigate("/login")}
                style={{ width: "100%", padding: "12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", marginBottom: "1rem" }}
              >
                Sign in now →
              </button>
              <button
                onClick={() => navigate("/")}
                style={{ width: "100%", padding: "12px", background: "#ffffff", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer" }}
              >
                Back to home
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}