import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "./supabase";
import { useMobile } from "./hooks/useMobile";

const PLANS = {
  monthly: { label: "Monthly", price: 99,  paise: 9900,  period: "per month",  save: null },
  yearly:  { label: "Yearly",  price: 499, paise: 49900, period: "per year",   save: "Save ₹689" },
};

const FREE_FEATURES = [
  "SQL Basics — all problems",
  "SQL Intermediate — all problems",
  "SQL Advanced — first 30 problems",
  "SQL Interview — first 10 problems",
  "SQL Scenarios — first 10 problems",
  "Live SQL sandbox",
  "Community feed",
  "Leaderboard access",
];

const PRO_FEATURES = [
  "Everything in Free",
  "SQL Advanced — all 100 problems",
  "SQL Interview — all 100 problems",
  "SQL Scenarios — all 100 problems",
  "Priority support",
  "Pro badge on profile",
  "Download solutions as PDF",
  "Early access to new problems",
];

export default function PricingPage() {
  const navigate  = useNavigate();
  const [activePlan, setActivePlan]     = useState("yearly");
  const [isLoggedIn, setIsLoggedIn]     = useState(false);
  const [isPro, setIsPro]               = useState(false);
  const [userId, setUserId]             = useState(null);
  const [userEmail, setUserEmail]       = useState("");
  const [userName, setUserName]         = useState("");
  const [loading, setLoading]           = useState(false);
  const [successMsg, setSuccessMsg]     = useState("");
  const isMobile = useMobile();
const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      if (!session) return;

      setIsLoggedIn(true);
      setUserId(session.user.id);
      setUserEmail(session.user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, is_pro, pro_expires_at, pro_plan")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profile) {
        setUserName(profile.full_name || "");
        // Check if pro and not expired
        if (profile.is_pro && profile.pro_expires_at) {
          const expires = new Date(profile.pro_expires_at);
          if (expires > new Date()) setIsPro(true);
        }
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!isLoggedIn) {
      navigate("/signup");
      return;
    }

    setLoading(true);

    const plan   = PLANS[activePlan];
    const SUPABASE_URL      = process.env.REACT_APP_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

    try {
      // Step 1: Create order
      const orderRes = await fetch(`${SUPABASE_URL}/functions/v1/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "apikey": SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          amount:  plan.paise,
          receipt: `pro_${activePlan}_${userId}_${Date.now()}`,
          notes:   { user_id: userId, plan: activePlan },
        }),
      });

      const order = await orderRes.json();
      if (order.error) throw new Error(order.error);

      // Step 2: Open Razorpay checkout
      const options = {
        key:          process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount:       plan.paise,
        currency:     "INR",
        name:         "Repractiq",
        description:  `Pro Plan — ${plan.label}`,
        order_id:     order.id,
        prefill: {
          name:  userName,
          email: userEmail,
        },
        theme: { color: "#2563eb" },
        handler: async (response) => {
          // Step 3: Verify payment
          const verifyRes = await fetch(`${SUPABASE_URL}/functions/v1/verify-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
              "apikey": SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              user_id:             userId,
              plan:                activePlan,
            }),
          });

          const result = await verifyRes.json();
          if (result.success) {
            setIsPro(true);
            setSuccessMsg(`🎉 You're now Pro! Your plan is active until ${new Date(result.expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
          setLoading(false);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      alert("Something went wrong: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a" }}>

      {/* Nav */}
      <nav style={{ padding: isMobile ? "0.75rem 1rem" : "1rem 2.5rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(255,255,255,0.97)", zIndex: 100 }}>
  <span onClick={() => navigate("/")} style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.3px", cursor: "pointer" }}>Repractiq</span>
  {isMobile ? (
    <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#0f172a" }}>
      {menuOpen ? "✕" : "☰"}
    </button>
  ) : (
    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
      <Link to="/sql" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Practice</Link>
      <Link to="/leaderboard" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Leaderboard</Link>
      <Link to="/blog" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Blog</Link>
      {isLoggedIn ? (
        <button onClick={() => navigate("/home")} style={{ padding: "8px 18px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", border: "none", cursor: "pointer" }}>Home</button>
      ) : (
        <Link to="/login" style={{ padding: "8px 18px", borderRadius: "7px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none" }}>Login</Link>
      )}
    </div>
  )}
  {isMobile && menuOpen && (
    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "0.5rem 0", zIndex: 200 }}>
      {[["Practice", "/sql"], ["Leaderboard", "/leaderboard"], ["Blog", "/blog"], [isLoggedIn ? "Home" : "Login", isLoggedIn ? "/home" : "/login"]].map(([label, path]) => (
        <div key={label} onClick={() => { navigate(path); setMenuOpen(false); }} style={{ padding: "0.75rem 1.25rem", fontSize: "0.9rem", color: "#0f172a", fontWeight: 500, cursor: "pointer", borderBottom: "1px solid #f1f5f9" }}>
          {label}
        </div>
      ))}
    </div>
  )}
</nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)", borderBottom: "1px solid #e2e8f0", padding: isMobile ? "2rem 1rem 1.5rem" : "4rem 2.5rem 3rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#2563eb", background: "#ffffff", padding: "5px 14px", borderRadius: "20px", border: "1px solid #bfdbfe", marginBottom: "1.25rem", fontWeight: 600 }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2563eb", display: "inline-block" }} />
          Simple, transparent pricing
        </div>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-1px", margin: "0 0 1rem", color: "#0f172a" }}>
          Start free. Go Pro when ready.
        </h1>
        <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: 1.75, maxWidth: "480px", margin: "0 auto" }}>
          Most SQL practice is completely free. Upgrade to Pro for full access to all advanced, interview and scenario problems.
        </p>
      </div>

      {/* Success message */}
      {successMsg && (
        <div style={{ maxWidth: "600px", margin: "2rem auto 0", padding: "1rem 1.5rem", background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: "12px", textAlign: "center", fontSize: "0.92rem", fontWeight: 600, color: "#15803d" }}>
          {successMsg}
        </div>
      )}

      {/* Already Pro banner */}
      {isPro && !successMsg && (
        <div style={{ maxWidth: "600px", margin: "2rem auto 0", padding: "1rem 1.5rem", background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: "12px", textAlign: "center", fontSize: "0.92rem", fontWeight: 600, color: "#1d4ed8" }}>
          ✓ You're already on the Pro plan — enjoy full access!
        </div>
      )}

<div style={{ maxWidth: "960px", margin: isMobile ? "1.5rem auto" : "3rem auto", padding: isMobile ? "0 1rem" : "0 2.5rem" }}>

        {/* Plan toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "4px", gap: "4px" }}>
            {Object.entries(PLANS).map(([key, plan]) => (
              <button
                key={key}
                onClick={() => setActivePlan(key)}
                style={{ padding: "8px 24px", borderRadius: "7px", border: "none", background: activePlan === key ? "#ffffff" : "transparent", color: activePlan === key ? "#0f172a" : "#64748b", fontWeight: activePlan === key ? 700 : 500, fontSize: "0.88rem", cursor: "pointer", boxShadow: activePlan === key ? "0 1px 4px rgba(0,0,0,0.08)" : "none", display: "flex", alignItems: "center", gap: "8px" }}
              >
                {plan.label}
                {plan.save && (
                  <span style={{ fontSize: "0.65rem", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "2px 6px", fontWeight: 700 }}>
                    {plan.save}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing cards */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.5rem", marginBottom: isMobile ? "2rem" : "4rem" }}>

          {/* Free card */}
          <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "16px", padding: "2rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>Free</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-2px", color: "#0f172a" }}>₹0</span>
              <span style={{ fontSize: "0.88rem", color: "#64748b" }}>forever</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.75rem", lineHeight: 1.6 }}>
              Everything you need to start practicing SQL on real data.
            </p>
            <button
              onClick={() => navigate(isLoggedIn ? "/sql" : "/signup")}
              style={{ width: "100%", padding: "11px", borderRadius: "8px", background: "#ffffff", color: "#0f172a", fontWeight: 700, fontSize: "0.88rem", border: "1.5px solid #e2e8f0", cursor: "pointer", marginBottom: "1.75rem" }}
            >
              {isLoggedIn ? "Continue practicing →" : "Get started free →"}
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {FREE_FEATURES.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <span style={{ color: "#16a34a", fontSize: "0.82rem", marginTop: "1px", flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: "0.85rem", color: "#475569" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro card */}
          <div style={{ background: "#0f172a", border: "1.5px solid #1e293b", borderRadius: "16px", padding: "2rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "150px", height: "150px", borderRadius: "50%", background: "rgba(37,99,235,0.15)", pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.06em" }}>Pro</span>
              <span style={{ fontSize: "0.65rem", background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)", borderRadius: "10px", padding: "2px 8px", fontWeight: 700 }}>Most Popular • Worldwide</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-2px", color: "#ffffff" }}>
                ₹{PLANS[activePlan].price}
              </span>
              <span style={{ fontSize: "0.88rem", color: "#94a3b8" }}>{PLANS[activePlan].period}</span>
              <div
  style={{
    fontSize: "0.82rem",
    color: "#94a3b8",
    marginTop: "4px",
    fontWeight: 500
  }}
>
  {activePlan === "yearly"
    ? "≈ $6/year"
    : "≈ $1.20/month"}
</div>
            </div>
            {activePlan === "yearly" && (
              <div style={{ fontSize: "0.78rem", color: "#4ade80", marginBottom: "0.25rem", fontWeight: 600 }}>
                That's just ₹41.58/month (~$0.50/month)
              </div>
            )}
           <p style={{
  fontSize: "0.85rem",
  color: "#94a3b8",
  marginBottom: "0.5rem",
  lineHeight: 1.6
}}>
  Full access to every problem on the platform.
</p>

<div
  style={{
    fontSize: "0.78rem",
    color: "#60a5fa",
    marginBottom: "1.5rem",
    fontWeight: 500
  }}
>
  🌍 International cards accepted • Approx. $6/year
</div>

            {isPro ? (
              <div style={{ width: "100%", padding: "11px", borderRadius: "8px", background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: "0.88rem", textAlign: "center", marginBottom: "1.75rem" }}>
                ✓ Active — You're on Pro
              </div>
            ) : (
                <>
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: "8px",
                      background: loading ? "#3b82f6" : "#2563eb",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.88rem",
                      border: "none",
                      cursor: loading ? "not-allowed" : "pointer"
                    }}
                  >
                    {loading ? "Opening payment..." : `Get Pro — ₹${PLANS[activePlan].price} →`}
                  </button>
              
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "10px",
                      marginBottom: "1.75rem",
                      fontSize: "0.72rem",
                      color: "#94a3b8"
                    }}
                  >
                    🔒 Secure payments • Visa • Mastercard • International Cards
                  </div>
                </>
              )}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {PRO_FEATURES.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <span style={{ color: "#4ade80", fontSize: "0.82rem", marginTop: "1px", flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature comparison table */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "1.5rem", textAlign: "center" }}>
            What's included
          </h2>
          <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "14px", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 70px 70px" : "1fr 120px 120px", background: "#f8fafc", padding: isMobile ? "0.75rem 0.75rem" : "1rem 1.5rem", borderBottom: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Feature</span>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>Free</span>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>Pro</span>
            </div>
            {[
              ["SQL Basics",         "All 100",        "All 100"],
              ["SQL Intermediate",   "All 100",        "All 100"],
              ["SQL Advanced",       "First 30",       "All 100"],
              ["SQL Interview",      "First 10",       "All 100"],
              ["SQL Scenarios",      "First 10",       "All 100"],
              ["Live SQL Sandbox",   "✓",              "✓"],
              ["Streak tracking",    "✓",              "✓"],
              ["Leaderboard",        "✓",              "✓"],
              ["Community feed",     "✓",              "✓"],
              ["Pro badge",          "—",              "✓"],
              ["Priority support",   "—",              "✓"],
              ["Early access",       "—",              "✓"],
            ].map(([feature, free, pro], i) => (
              <div
                key={feature}
                style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 70px 70px" : "1fr 120px 120px", padding: isMobile ? "0.625rem 0.75rem" : "0.875rem 1.5rem", borderBottom: i < 11 ? "1px solid #f1f5f9" : "none", background: i % 2 === 0 ? "#ffffff" : "#fafafa" }}
              >
                <span style={{ fontSize: "0.88rem", color: "#0f172a", fontWeight: 500 }}>{feature}</span>
                <span style={{ fontSize: "0.85rem", color: free === "✓" ? "#16a34a" : free === "—" ? "#cbd5e1" : "#64748b", textAlign: "center", fontWeight: free === "✓" ? 700 : 400 }}>{free}</span>
                <span style={{ fontSize: "0.85rem", color: pro === "✓" ? "#16a34a" : "#2563eb", textAlign: "center", fontWeight: 700 }}>{pro}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "1.5rem", textAlign: "center" }}>
            Frequently asked questions
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "1.25rem" }}>
            {[
              ["Can I cancel anytime?", "Yes. You can cancel your Pro plan anytime. You'll keep access until the end of your billing period."],
              ["What payment methods are accepted?",
                "UPI, credit cards, debit cards, netbanking, wallets and most international Visa/Mastercard cards are supported."],
              ["Is my payment secure?", "Yes. All payments are processed by Razorpay — a PCI DSS compliant payment gateway used by millions of Indian businesses."],
              ["What happens when my plan expires?", "Your account goes back to the free tier. All your progress and solved problems are saved permanently."],
              ["Do you offer student discounts?", "We're working on it! Email us at support@repractiq.com with your student ID."],
              ["Can I switch from monthly to yearly?", "Yes — upgrade anytime and we'll prorate the difference."],
            ].map(([q, a]) => (
              <div key={q} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem" }}>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>{q}</div>
                <div style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.7 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ background: "#0f172a", borderRadius: "16px", padding: isMobile ? "1.75rem 1.25rem" : "3rem", textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.5px", marginBottom: "0.75rem" }}>
            Ready to unlock everything?
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#94a3b8", marginBottom: "1.75rem", lineHeight: 1.7 }}>
            Get full access to 500+ advanced SQL problems for less than a cup of coffee per month.
          </p>
          {!isPro && (
  <>
    <button
      onClick={handlePayment}
      disabled={loading}
      style={{
        padding: "13px 32px",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontWeight: 700,
        fontSize: "0.95rem",
        cursor: "pointer"
      }}
    >
      {loading
        ? "Opening payment..."
        : `Get Pro — ₹${PLANS[activePlan].price}/${activePlan === "yearly" ? "yr" : "mo"} →`}
    </button>

    <div
      style={{
        marginTop: "12px",
        fontSize: "0.75rem",
        color: "#94a3b8"
      }}
    >
      🌍 International cards accepted
    </div>
  </>
)}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: isMobile ? "1.5rem 1rem" : "2rem 2.5rem" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>© 2026 Repractiq. All rights reserved.</span>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link to="/privacy" style={{ fontSize: "0.75rem", color: "#64748b", textDecoration: "none" }}>Privacy Policy</Link>
            <Link to="/terms"   style={{ fontSize: "0.75rem", color: "#64748b", textDecoration: "none" }}>Terms of Use</Link>
            <Link to="/contact" style={{ fontSize: "0.75rem", color: "#64748b", textDecoration: "none" }}>Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}