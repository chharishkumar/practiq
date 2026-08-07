import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./supabase";
import { useMobile } from "./hooks/useMobile";

// ─── PRACTICE MENU CONFIG ─────────────────────────────────────────────────
const PRACTICE_MENU = [
  {
    key: "sql",
    label: "SQL",
    icon: "🗄️",
    color: "#2563eb",
    bg: "#eff6ff",
    headerPath: "/sql",
    items: [
      { label: "SQL Basics", path: "/sql/basics" },
      { label: "SQL Intermediate", path: "/sql/intermediate" },
      { label: "SQL Advanced", path: "/sql/advanced" },
      { label: "SQL Interview", path: "/sql/interview" },
      { label: "SQL Scenarios", path: "/sql/scenarios" },
    ],
  },
  {
    key: "python",
    label: "Python",
    icon: "🐍",
    color: "#7c3aed",
    bg: "#f5f3ff",
    headerPath: "/python",
    items: [
      { label: "Python Basics", path: "/python/basics" },
      { label: "Python Intermediate", path: null, comingSoon: true },
      { label: "Python Advanced", path: null, comingSoon: true },
    ],
  },
];

const NAV_LINKS = [
  { label: "Home", path: "/home" },
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "Blog", path: "/Blog" },
];

// ─── HELPERS ───────────────────────────────────────────────────────────────
function getInitials(name = "") {
  return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";
}

// ─── PRACTICE DROPDOWN (desktop with hover-gap fix) ────────────────────────
function PracticeDropdown({ navigate, isActive }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const go = (path) => {
    if (!path) return;
    setOpen(false);
    navigate(path);
  };

  return (
    <div
      ref={ref}
      style={{ position: "relative" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span
        onClick={() => setOpen((o) => !o)}
        style={{
          fontSize: "0.85rem",
          color: isActive ? "#2563eb" : "#64748b",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",
          paddingBottom: "2px",
        }}
      >
        Practice
        <span
          style={{
            fontSize: "0.6rem",
            marginTop: "1px",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
          }}
        >
          ▾
        </span>
      </span>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            paddingTop: "14px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 300,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1.5px solid #e2e8f0",
              borderRadius: "14px",
              boxShadow: "0 12px 32px rgba(15,23,42,0.12)",
              padding: "0.75rem",
              display: "flex",
              gap: "0.5rem",
              minWidth: "420px",
            }}
          >
            {PRACTICE_MENU.map((track) => (
              <div key={track.key} style={{ flex: 1, minWidth: "180px" }}>
                <div
  onClick={() => go(track.headerPath)} // 👈 ADD onClick
  style={{
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "0.4rem 0.6rem",
    marginBottom: "2px",
    cursor: "pointer", // 👈 ADD cursor pointer
    borderRadius: "6px",
    transition: "background 0.12s",
  }}
  onMouseEnter={(e) => { e.currentTarget.style.background = track.bg; }} // 👈 ADD hover effect
  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
>
  <span style={{ fontSize: "0.95rem" }}>{track.icon}</span>
  <span style={{ fontSize: "0.72rem", fontWeight: 800, color: track.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
    {track.label}
  </span>
</div>
                {track.items.map((item) => (
                  <div
                    key={item.label}
                    onClick={() => go(item.path)}
                    style={{
                      padding: "0.55rem 0.6rem",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: item.comingSoon ? "#cbd5e1" : "#0f172a",
                      cursor: item.comingSoon ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      if (!item.comingSoon) e.currentTarget.style.background = track.bg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {item.label}
                    {item.comingSoon && (
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          color: "#94a3b8",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          padding: "1px 6px",
                        }}
                      >
                        Soon
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PRACTICE ACCORDION (mobile) ──────────────────────────────────────────
function PracticeAccordion({ navigate, closeMenu }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ borderBottom: "1px solid #f1f5f9" }}>
      <div
        onClick={() => setExpanded((e) => (e ? null : "open"))}
        style={{
          padding: "0.75rem 1.25rem",
          fontSize: "0.9rem",
          color: "#0f172a",
          fontWeight: 500,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Practice
        <span style={{ fontSize: "0.65rem", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▾</span>
      </div>
      {expanded && (
        <div style={{ background: "#f8fafc", padding: "0.25rem 0 0.5rem" }}>
          {PRACTICE_MENU.map((track) => (
            <div key={track.key} style={{ marginBottom: "0.5rem" }}>
              <div
  onClick={() => {
    navigate(track.headerPath); // 👈 ADD onClick & close menu
    closeMenu();
  }}
  style={{
    padding: "0.4rem 1.5rem 0.2rem",
    fontSize: "0.68rem",
    fontWeight: 800,
    color: track.color,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    cursor: "pointer", // 👈 ADD cursor pointer
  }}
>
  {track.icon} {track.label}
</div>
              {track.items.map((item) => (
                <div
                  key={item.label}
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                      closeMenu();
                    }
                  }}
                  style={{
                    padding: "0.5rem 1.75rem",
                    fontSize: "0.84rem",
                    fontWeight: 500,
                    color: item.comingSoon ? "#cbd5e1" : "#0f172a",
                    cursor: item.comingSoon ? "default" : "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {item.label}
                  {item.comingSoon && <span style={{ fontSize: "0.6rem", color: "#94a3b8" }}>Soon</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN NAVBAR ───────────────────────────────────────────────────────────
export default function Navbar({ user: userProp = null, onSignOut = null }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(userProp);

  useEffect(() => {
    if (userProp) {
      setUser(userProp);
      return;
    }

    let cancelled = false;
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const authUser = sessionData?.session?.user;
      if (!authUser) {
        if (!cancelled) setUser(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, preferred_language")
        .eq("id", authUser.id)
        .maybeSingle();

      if (!cancelled) {
        setUser({
          fullName: profile?.full_name || authUser.email?.split("@")[0] || "User",
          preferredLanguage: profile?.preferred_language || null,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userProp]);

  const handleSignOut = async () => {
    if (onSignOut) {
      await onSignOut();
    } else {
      await supabase.auth.signOut();
      setUser(null);
      navigate("/login");
    }
  };

  const userName = user?.fullName || user?.full_name || user?.name || "";
  const isPracticeActive = location.pathname.startsWith("/sql") || location.pathname.startsWith("/python");
  const isHomeActive = location.pathname === "/home" || location.pathname === "/";

  return (
    <nav
      style={{
        padding: isMobile ? "0.75rem 1rem" : "0.875rem 2.5rem",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        background: "rgba(255,255,255,0.97)",
        zIndex: 100,
      }}
    >
      <span onClick={() => navigate("/")} style={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a", letterSpacing: "-0.3px", cursor: "pointer" }}>
        Repractiq
      </span>

      {isMobile ? (
        <button onClick={() => setMenuOpen((o) => !o)} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#0f172a" }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      ) : (
        <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          <span
            onClick={() => navigate("/home")}
            style={{
              fontSize: "0.85rem",
              color: isHomeActive ? "#2563eb" : "#64748b",
              fontWeight: 600,
              cursor: "pointer",
              borderBottom: isHomeActive ? "2px solid #2563eb" : "2px solid transparent",
              paddingBottom: "2px",
            }}
          >
            Home
          </span>

          <PracticeDropdown navigate={navigate} isActive={isPracticeActive} />

          {NAV_LINKS.filter((l) => l.label !== "Home").map((l) => {
            const active = location.pathname.toLowerCase() === l.path.toLowerCase();
            return (
              <span
                key={l.label}
                onClick={() => navigate(l.path)}
                style={{
                  fontSize: "0.85rem",
                  color: active ? "#2563eb" : "#64748b",
                  fontWeight: 600,
                  cursor: "pointer",
                  borderBottom: active ? "2px solid #2563eb" : "2px solid transparent",
                  paddingBottom: "2px",
                }}
              >
                {l.label}
              </span>
            );
          })}

          {user ? (
            <>
              <div
                onClick={() => navigate("/profile")}
                title={userName}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "#eff6ff",
                  border: "1.5px solid #bfdbfe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  color: "#2563eb",
                  cursor: "pointer",
                }}
              >
                {getInitials(userName)}
              </div>
              <button
                onClick={handleSignOut}
                style={{
                  fontSize: "0.78rem",
                  color: "#64748b",
                  background: "none",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "5px 12px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "8px 18px",
                borderRadius: "7px",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.85rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          )}
        </div>
      )}

      {/* Mobile Drawer */}
      {isMobile && menuOpen && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "0.5rem 0", zIndex: 200, boxShadow: "0 12px 24px rgba(15,23,42,0.08)" }}>
          <div onClick={() => { navigate("/home"); setMenuOpen(false); }} style={{ padding: "0.75rem 1.25rem", fontSize: "0.9rem", color: "#0f172a", fontWeight: 500, cursor: "pointer", borderBottom: "1px solid #f1f5f9" }}>
            Home
          </div>

          <PracticeAccordion navigate={navigate} closeMenu={() => setMenuOpen(false)} />

          {NAV_LINKS.filter((l) => l.label !== "Home").map((l) => (
            <div key={l.label} onClick={() => { navigate(l.path); setMenuOpen(false); }} style={{ padding: "0.75rem 1.25rem", fontSize: "0.9rem", color: "#0f172a", fontWeight: 500, cursor: "pointer", borderBottom: "1px solid #f1f5f9" }}>
              {l.label}
            </div>
          ))}

          {user ? (
            <>
              <div onClick={() => { navigate("/profile"); setMenuOpen(false); }} style={{ padding: "0.75rem 1.25rem", fontSize: "0.9rem", color: "#0f172a", fontWeight: 500, cursor: "pointer", borderBottom: "1px solid #f1f5f9" }}>
                Profile
              </div>
              <div onClick={() => { handleSignOut(); setMenuOpen(false); }} style={{ padding: "0.75rem 1.25rem", fontSize: "0.9rem", color: "#dc2626", fontWeight: 600, cursor: "pointer" }}>
                Sign out
              </div>
            </>
          ) : (
            <div onClick={() => { navigate("/login"); setMenuOpen(false); }} style={{ padding: "0.75rem 1.25rem", fontSize: "0.9rem", color: "#2563eb", fontWeight: 600, cursor: "pointer" }}>
              Login
            </div>
          )}
        </div>
      )}
    </nav>
  );
}