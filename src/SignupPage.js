import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "./supabase";

const COUNTRIES = [
  { name: "India", code: "+91", states: ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh","Puducherry","Chandigarh"] },
  { name: "United States", code: "+1", states: ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"] },
  { name: "United Kingdom", code: "+44", states: ["England","Scotland","Wales","Northern Ireland"] },
  { name: "Canada", code: "+1", states: ["Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland","Nova Scotia","Ontario","Prince Edward Island","Quebec","Saskatchewan"] },
  { name: "Australia", code: "+61", states: ["New South Wales","Victoria","Queensland","South Australia","Western Australia","Tasmania","ACT","Northern Territory"] },
  { name: "Germany", code: "+49", states: ["Bavaria","Berlin","Brandenburg","Bremen","Hamburg","Hesse","Lower Saxony","Mecklenburg-Vorpommern","North Rhine-Westphalia","Rhineland-Palatinate","Saarland","Saxony","Saxony-Anhalt","Schleswig-Holstein","Thuringia"] },
  { name: "Singapore", code: "+65", states: ["Central Region","East Region","North Region","North-East Region","West Region"] },
  { name: "UAE", code: "+971", states: ["Abu Dhabi","Dubai","Sharjah","Ajman","Umm Al Quwain","Ras Al Khaimah","Fujairah"] },
  { name: "Netherlands", code: "+31", states: ["Noord-Holland","Zuid-Holland","Utrecht","Noord-Brabant","Gelderland","Overijssel","Groningen","Friesland","Drenthe","Zeeland","Flevoland","Limburg"] },
  { name: "France", code: "+33", states: ["Île-de-France","Provence","Normandy","Brittany","Occitanie","Nouvelle-Aquitaine","Auvergne-Rhône-Alpes","Grand Est","Hauts-de-France","Pays de la Loire","Bourgogne-Franche-Comté","Centre-Val de Loire"] },
  { name: "Other", code: "+", states: ["Other"] },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    countryCode: "+91",
    country: "India",
    state: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const selectedCountry = COUNTRIES.find(c => c.name === formData.country) || COUNTRIES[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      const found = COUNTRIES.find(c => c.name === value);
      setFormData(prev => ({ ...prev, country: value, countryCode: found?.code || "+", state: "" }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/sql" } });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    const { data, error: signupError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
  
    if (signupError) {
      setError(signupError.message);
      setIsLoading(false);
      return;
    }
  
    const user = data.user;
  
    if (!user) {
      setError("Signup failed. Try again.");
      setIsLoading(false);
      return;
    }
  
    // 🔥 INSERT INTO profiles table
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        mobile: `${formData.countryCode}${formData.mobile}`,
        country: formData.country,
        state: formData.state,
      },
    ]);
  
    if (profileError) {
      console.error(profileError);
      // setError("Profile creation failed");
      // setIsLoading(false);
      console.error("PROFILE ERROR:", profileError);
setError(profileError.message);
      return;
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
            Free to start — always
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: "1rem" }}>
            Practice SQL on<br /><span style={{ color: "#60a5fa" }}>Real Business Data</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.75, marginBottom: "2rem" }}>
            Join thousands of data professionals who practice on real datasets — customer churn, revenue analysis, support tickets and more.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {["1000+ real SQL problems across all levels", "Free sandbox — write and run SQL instantly", "Leaderboard, certificates and community", "No setup. No downloads. Just SQL."].map((item, i) => (
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
      <div style={{ flex: 1, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 8px" }}>Create your account</h2>
            <p style={{ fontSize: "0.88rem", color: "#64748b" }}>Start solving 1,000+ real-world SQL problems.</p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignup}
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
            <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 500 }}>or sign up with email</span>
            <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }}></div>
          </div>

          {error && (
            <div style={{ marginBottom: "1.25rem", padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#dc2626", fontSize: "0.82rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>

            {/* Full Name */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Full Name</label>
              <input name="fullName" type="text" required placeholder="John Doe" onChange={handleChange} style={inputStyle} />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Work Email</label>
              <input name="email" type="email" required placeholder="name@company.com" onChange={handleChange} style={inputStyle} />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input name="password" type={showPassword ? "text" : "password"} required placeholder="Min. 8 characters" onChange={handleChange} style={{ ...inputStyle, paddingRight: "44px" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Mobile + Country Code */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Mobile Number</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  style={{ ...inputStyle, width: "110px", flexShrink: 0, paddingLeft: "10px" }}
                >
                  {COUNTRIES.map(c => (
                    <option key={c.name} value={c.code}>{c.code} {c.name.slice(0, 8)}</option>
                  ))}
                </select>
                <input name="mobile" type="tel" required placeholder="9876543210" onChange={handleChange} style={{ ...inputStyle, flex: 1 }} />
              </div>
            </div>

            {/* Country */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Country</label>
              <select name="country" value={formData.country} onChange={handleChange} style={{ ...inputStyle, paddingLeft: "14px" }}>
                {COUNTRIES.map(c => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* State — auto filtered */}
            <div style={{ marginBottom: "1.75rem" }}>
              <label style={labelStyle}>State / Province</label>
              <select name="state" value={formData.state} onChange={handleChange} required style={{ ...inputStyle, paddingLeft: "14px" }}>
                <option value="">Select state</option>
                {selectedCountry.states.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{ width: "100%", padding: "12px", background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "0.9rem", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.8 : 1 }}
            >
              {isLoading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.83rem", color: "#64748b" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>

          <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.6 }}>
            By signing up you agree to our{" "}
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