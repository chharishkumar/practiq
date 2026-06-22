import { useNavigate } from "react-router-dom";

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      background: "#ffffff", 
      minHeight: "100vh", 
      fontFamily: "Inter, -apple-system, sans-serif", 
      color: "#0f172a",
      lineHeight: 1.6
    }}>
      
      {/* Mini Nav */}
      <nav style={{ 
        padding: "1rem 2.5rem", 
        borderBottom: "1px solid #e2e8f0", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        position: "sticky", 
        top: 0, 
        background: "rgba(255,255,255,0.97)", 
        zIndex: 100 
      }}>
        <span 
          onClick={() => navigate("/")} 
          style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", letterSpacing: "-0.3px", cursor: "pointer" }}
        >
          Repractiq
        </span>
        <span 
          onClick={() => navigate("/home")} 
          style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 500, cursor: "pointer" }}
        >
          Back to Home →
        </span>
      </nav>

      {/* Main Content Container */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "4rem 2rem 6rem" }}>
        
        {/* Header */}
        <header style={{ marginBottom: "3rem" }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: 800, 
            letterSpacing: "-1px", 
            margin: "0 0 0.5rem", 
            color: "#0f172a" 
          }}>
            Privacy Policy
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            Last updated: May 29, 2026
          </p>
        </header>

        <hr style={{ border: "0", borderTop: "1px solid #e2e8f0", margin: "2rem 0" }} />

        {/* Sections */}
        <main style={{ fontSize: "0.95rem", color: "#334155" }}>
  
  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>1. Introduction</h2>
    <p>
      Welcome to Repractiq. Your privacy matters to us. This Privacy Policy explains what information we collect, how we use it, and how we protect your data when you use our SQL learning and practice platform.
    </p>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>2. Information We Collect</h2>

    <p style={{ marginBottom: "1rem" }}>
      We collect only the information necessary to operate and improve the platform:
    </p>

    <ul style={{ paddingLeft: "1.25rem", margin: "0 0 1rem" }}>
      <li style={{ marginBottom: "0.5rem" }}>
        <strong>Account Information:</strong> Your name, email address, and authentication details when you create an account.
      </li>

      <li style={{ marginBottom: "0.5rem" }}>
        <strong>Practice Activity:</strong> SQL problem attempts, submissions, streaks, leaderboard activity, and learning progress.
      </li>

      <li style={{ marginBottom: "0.5rem" }}>
        <strong>Community Content:</strong> Blog posts, comments, likes, and other content you voluntarily publish on the platform.
      </li>

      <li style={{ marginBottom: "0.5rem" }}>
        <strong>Technical Information:</strong> Basic device, browser, and session information used to maintain platform security and performance.
      </li>
    </ul>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>3. How We Use Your Information</h2>

    <p style={{ marginBottom: "1rem" }}>
      We use collected information to:
    </p>

    <ul style={{ paddingLeft: "1.25rem" }}>
      <li style={{ marginBottom: "0.5rem" }}>
        Provide SQL practice, sandbox execution, and learning features.
      </li>

      <li style={{ marginBottom: "0.5rem" }}>
        Track progress, rankings, streaks, and leaderboard performance.
      </li>

      <li style={{ marginBottom: "0.5rem" }}>
        Improve platform stability, performance, and user experience.
      </li>

      <li style={{ marginBottom: "0.5rem" }}>
        Prevent abuse, spam, fraud, or misuse of the platform.
      </li>

      <li style={{ marginBottom: "0.5rem" }}>
        Send important updates related to your account or platform changes.
      </li>
    </ul>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>4. SQL Sandbox & Query Processing</h2>

    <p>
      SQL queries submitted through the platform may be processed on secure backend infrastructure to provide sandbox functionality, validate solutions, and power learning features. Queries are used only for educational platform functionality and are not sold, shared, or used for advertising purposes.
    </p>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>5. Cookies & Analytics</h2>

    <p>
      We may use cookies, authentication tokens, and basic analytics tools to keep you logged in, improve platform performance, understand usage patterns, and enhance the learning experience.
    </p>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>6. Third-Party Services</h2>

    <p style={{ marginBottom: "1rem" }}>
      We rely on trusted third-party infrastructure providers to operate the platform:
    </p>

    <ul style={{ paddingLeft: "1.25rem" }}>
      <li style={{ marginBottom: "0.5rem" }}>
        <strong>Supabase:</strong> Authentication, database infrastructure, and backend services.
      </li>

      <li style={{ marginBottom: "0.5rem" }}>
        <strong>Vercel:</strong> Website hosting and deployment infrastructure.
      </li>
    </ul>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>7. Data Security</h2>

    <p>
      We use industry-standard security practices, encrypted connections, and secure infrastructure providers to help protect your information. While no online platform can guarantee absolute security, we continuously work to improve platform safety and reliability.
    </p>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>8. Data Retention</h2>

    <p>
      We retain account information, submissions, and learning activity for as long as your account remains active or as needed to operate the platform. You may request deletion of your account and associated data at any time.
    </p>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>9. Your Rights</h2>

    <p>
      You may access, update, or request deletion of your account information at any time. If you wish to permanently delete your account or have questions regarding your data, please contact us directly.
    </p>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>10. Contact Us</h2>

    <p>
      If you have any questions regarding this Privacy Policy or your data, contact us at:
    </p>

    <p style={{ marginTop: "0.75rem", fontWeight: 600 }}>
    repractiq@gmail.com
    </p>
  </section>

</main>
      </div>

      {/* Footer */}
      <footer style={{ 
        borderTop: "1px solid #e2e8f0", 
        padding: "2rem", 
        textAlign: "center", 
        color: "#94a3b8", 
        fontSize: "0.78rem" 
      }}>
        © 2026 Repractiq · Built for data professionals.
      </footer>
    </div>
  );
}

// Reuse structural design variables
const sectionHeaderStyle = {
  fontSize: "1.2rem",
  fontWeight: 700,
  color: "#0f172a",
  letterSpacing: "-0.3px",
  marginBottom: "0.75rem"
};
