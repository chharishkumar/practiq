import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SQL_PROBLEMS } from "./sqlProblems";

export default function SQLProblemPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const problem = useMemo(
    () => SQL_PROBLEMS.find((item) => String(item.id) === String(id)),
    [id]
  );

  if (!problem) {
    return (
      <div style={{ padding: "2rem", fontFamily: "Inter, sans-serif" }}>
        <h2 style={{ marginTop: 0 }}>Problem not found</h2>
        <button
          onClick={() => navigate("/sql/basics")}
          style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}
        >
          Back to SQL Basics
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff", padding: "2rem", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <button
          onClick={() => navigate("/sql/basics")}
          style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}
        >
          ← Back to SQL Basics
        </button>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => navigate("/home")}
            style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}
          >
            Home
          </button>
          <button
            onClick={() => navigate("/profile")}
            style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer" }}
          >
            Profile
          </button>
        </div>
      </div>

      <h1 style={{ margin: "0 0 0.5rem" }}>{problem.title}</h1>
      <p style={{ color: "#64748b", marginTop: 0 }}>{problem.description}</p>

      <div
        style={{
          marginTop: "1rem",
          background: "#0f172a",
          color: "#7dd3fc",
          borderRadius: "10px",
          padding: "1rem",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
        }}
      >
        {problem.starterQuery}
      </div>
    </div>
  );
}