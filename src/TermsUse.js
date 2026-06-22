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
    <h2 style={sectionHeaderStyle}>1. Acceptance of Terms</h2>

    <p>
      By accessing or using Repractiq, you agree to comply with and be bound by these Terms of Use. If you do not agree with these terms, please do not use the platform.
    </p>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>2. Platform Purpose</h2>

    <p>
    Repractiq is an educational platform designed to help users learn, practice, and improve technical skills through SQL challenges, sandbox environments, coding exercises, community content, and related learning features.
    </p>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>3. User Accounts</h2>

    <p style={{ marginBottom: "1rem" }}>
      When creating an account, you agree to:
    </p>

    <ul style={{ paddingLeft: "1.25rem" }}>
      <li style={{ marginBottom: "0.5rem" }}>
        Provide accurate and truthful information.
      </li>

      <li style={{ marginBottom: "0.5rem" }}>
        Maintain the security of your account credentials.
      </li>

      <li style={{ marginBottom: "0.5rem" }}>
        Be responsible for all activity associated with your account.
      </li>

      <li style={{ marginBottom: "0.5rem" }}>
        Notify us immediately if you suspect unauthorized access to your account.
      </li>
    </ul>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>4. Acceptable Use</h2>

    <p style={{ marginBottom: "1rem" }}>
      You agree not to:
    </p>

    <ul style={{ paddingLeft: "1.25rem" }}>
      <li style={{ marginBottom: "0.5rem" }}>
        Attempt to disrupt, damage, or overload the platform infrastructure.
      </li>

      <li style={{ marginBottom: "0.5rem" }}>
        Submit malicious SQL queries, scripts, or harmful code.
      </li>

      <li style={{ marginBottom: "0.5rem" }}>
        Use automated tools to abuse platform resources or manipulate rankings.
      </li>

      <li style={{ marginBottom: "0.5rem" }}>
        Post unlawful, abusive, hateful, or misleading content.
      </li>

      <li style={{ marginBottom: "0.5rem" }}>
        Attempt unauthorized access to internal systems, accounts, or databases.
      </li>
    </ul>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>5. Community Content</h2>

    <p>
      Users may create posts, comments, and other community content on the platform. You retain ownership of your content, but by publishing it on Repractiq, you grant us permission to display, distribute, and use that content within the platform for operational and community purposes.
    </p>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>6. SQL Sandbox Usage</h2>

    <p>
      The SQL sandbox environment is provided for educational and practice purposes only. We reserve the right to limit, restrict, or terminate query execution that may impact platform stability, security, or other users.
    </p>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>7. Intellectual Property</h2>

    <p>
      The platform design, branding, datasets, SQL problems, educational content, and platform features are the intellectual property of Repractiq unless otherwise stated. You may not reproduce, distribute, or commercially exploit platform materials without permission.
    </p>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>8. Account Suspension & Termination</h2>

    <p>
      We reserve the right to suspend or terminate accounts that violate these Terms of Use, abuse platform systems, engage in fraudulent activity, or harm the platform or community experience.
    </p>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>9. Limitation of Liability</h2>

    <p>
    Repractiq is provided on an “as is” and “as available” basis. We do not guarantee uninterrupted service, complete accuracy, or error-free operation. To the maximum extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from platform usage.
    </p>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>10. Changes to Terms</h2>

    <p>
      We may update these Terms of Use periodically. Continued use of the platform after changes become effective constitutes acceptance of the revised terms.
    </p>
  </section>

  <section style={{ marginBottom: "2.5rem" }}>
    <h2 style={sectionHeaderStyle}>11. Contact Us</h2>

    <p>
      If you have any questions regarding these Terms of Use, please contact us at:
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
