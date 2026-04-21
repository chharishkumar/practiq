import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "./supabase";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/sql" }
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
  
    if (loginError) {
      setError(loginError.message);
      setIsLoading(false);
      return;
    }
  
    const user = data.user;
  
    if (!user) {
      // setError("Login failed. Try again.");
      // setIsLoading(false);
      setError(loginError.message);
console.log("LOGIN ERROR:", loginError);
      return;
    }
  
    // 🔥 OPTIONAL (but important for your platform)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
  
    if (profileError) {
      console.warn("Profile fetch issue:", profileError.message);
    } else {
      console.log("User Profile:", profile);
    }
  
    setIsLoading(false);
  
    navigate("/home");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      {/* Left Panel — Branding */}
      <div style={{ width: "42%", background: "#0f172a", padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Link to="/" style={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem", letterSpacing: "-0.3px", textDecoration: "none" }}>Data Rejected</Link>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#60a5fa", background: "rgba(96,165,250,0.1)", padding: "5px 14px", borderRadius: "20px", border: "1px solid rgba(96,165,250,0.2)", marginBottom: "1.5rem", fontWeight: 600 }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#60a5fa", display: "inline-block" }}></span>
            Welcome back
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: "1rem" }}>
            Continue your<br /><span style={{ color: "#60a5fa" }}>SQL Practice</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.75, marginBottom: "2rem" }}>
            Pick up where you left off. Your progress, leaderboard rank and saved solutions are waiting.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {["Your progress is saved automatically", "Leaderboard rank updated in real time", "Access all 1000+ SQL problems", "Free forever to practice"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#60a5fa", fontSize: "0.65rem", fontWeight: 800 }}>✓</span>
                </div>
                <span style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: "0.75rem", color: "#475569" }}>© 2025 Data Rejected. All rights reserved.</div>
      </div>

      {/* Right Panel — Form */}
      <div style={{ flex: 1, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 8px" }}>Sign in to your account</h2>
            <p style={{ fontSize: "0.88rem", color: "#64748b" }}>Welcome back. Let's get practicing.</p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            style={{ width: "100%", padding: "11px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "0.88rem", fontWeight: 600, color: "#0f172a", marginBottom: "1.25rem" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 500 }}>or sign in with email</span>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
          </div>

          {error && (
            <div style={{ marginBottom: "1.25rem", padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#dc2626", fontSize: "0.82rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Email</label>
              <input name="email" type="email" required placeholder="name@company.com" onChange={handleChange} style={inputStyle} />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "0.5rem" }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input name="password" type={showPassword ? "text" : "password"} required placeholder="••••••••" onChange={handleChange} style={{ ...inputStyle, paddingRight: "44px" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div style={{ textAlign: "right", marginBottom: "1.75rem" }}>
              <Link to="/forgot-password" style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ width: "100%", padding: "12px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.9rem", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.8 : 1 }}
            >
              {isLoading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.83rem", color: "#64748b" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Sign up free</Link>
          </p>

          <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.6 }}>
            By signing in you agree to our{" "}
            <Link to="/terms" style={{ color: "#2563eb", textDecoration: "none" }}>Terms of Use</Link>{" "}
            and{" "}
            <Link to="/privacy" style={{ color: "#2563eb", textDecoration: "none" }}>Privacy Policy</Link>
          
          </p>
          <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.6 }}>
          Have questions?{" "}
            <Link to="/contact" style={{ color: "#2563eb", textDecoration: "none" }}>Contact Us</Link>
            
          </p>
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