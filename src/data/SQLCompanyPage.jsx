import { useState, useEffect, useMemo, useRef, useCallback, lazy, Suspense } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";
import { SQL_COMPANY_PROBLEMS, COMPANY_LIST, COMPANY_TAGS } from "../data/sqlCompanyProblems";
import ShareModal from "../ShareModel";
import { useProStatus } from "../hooks/useProStatus";
import { useMobile } from "../hooks/useMobile";
import MobileSQLLayout from "../components/MobileSQLLayout";
import { checkAndSaveBadges } from "../badges/useBadges";
import BadgeUnlockModal from "../badges/BadgeUnlockModal";
import { usePageMeta } from "../hooks/usePageMeta";
import StructuredData from "../components/StructuredData";

// Lazy-load Monaco — only the expanded/selected question's editor needs it,
// and with 300 questions on one page we don't want to eagerly bundle/render
// an editor instance per row.
const DB_SCHEMAS = {
  customers: [
    { name: "customer_id", type: "int64" },
    { name: "customer_name", type: "string" },
    { name: "email", type: "string" },
    { name: "phone", type: "string" },
    { name: "city", type: "string" },
    { name: "state", type: "string" },
    { name: "country", type: "string" },
    { name: "postal_code", type: "string" },
    { name: "created_date", type: "datetime" },
    { name: "activated_date", type: "datetime" },
    { name: "last_login_date", type: "datetime" },
    { name: "last_order_date", type: "datetime" },
    { name: "status", type: "string" },
    { name: "customer_type", type: "string" },
    { name: "acquisition_channel", type: "string" },
    { name: "lifetime_value", type: "decimal" },
    { name: "is_verified", type: "boolean" },
    { name: "created_at", type: "datetime" },
    { name: "updated_at", type: "datetime" }
  ],
  delivery_partners: [
    { name: "delivery_partner_id", type: "int64" },
    { name: "partner_name", type: "string" },
    { name: "phone", type: "string" },
    { name: "vehicle_type", type: "string" },
    { name: "vehicle_number", type: "string" },
    { name: "city", type: "string" },
    { name: "status", type: "string" },
    { name: "joining_date", type: "datetime" },
    { name: "last_active_date", type: "datetime" },
    { name: "rating", type: "decimal" },
    { name: "total_deliveries", type: "int64" },
    { name: "created_at", type: "datetime" },
    { name: "updated_at", type: "datetime" }
  ],
  feedback: [
    { name: "feedback_id", type: "int64" },
    { name: "customer_id", type: "int64" },
    { name: "order_id", type: "int64" },
    { name: "rating", type: "decimal" },
    { name: "review_text", type: "string" },
    { name: "feedback_channel", type: "string" },
    { name: "issue_category", type: "string" },
    { name: "created_at", type: "datetime" },
    { name: "updated_at", type: "datetime" }
  ],
  order_items: [
    { name: "item_id", type: "int64" },
    { name: "order_id", type: "int64" },
    { name: "product_id", type: "int64" },
    { name: "quantity", type: "int64" },
    { name: "unit_price", type: "decimal" },
    { name: "discount_amount", type: "decimal" },
    { name: "tax_amount", type: "decimal" },
    { name: "total_price", type: "decimal" },
    { name: "item_status", type: "string" },
    { name: "currency", type: "string" },
    { name: "created_at", type: "datetime" },
    { name: "updated_at", type: "datetime" }
  ],
  orders: [
    { name: "order_id", type: "int64" },
    { name: "customer_id", type: "int64" },
    { name: "order_date", type: "datetime" },
    { name: "order_status", type: "string" },
    { name: "payment_status", type: "string" },
    { name: "delivery_partner_id", type: "int64" },
    { name: "subtotal_amount", type: "decimal" },
    { name: "tax_amount", type: "decimal" },
    { name: "discount_amount", type: "decimal" },
    { name: "delivery_fee", type: "decimal" },
    { name: "total_amount", type: "decimal" },
    { name: "currency", type: "string" },
    { name: "estimated_delivery_time", type: "datetime" },
    { name: "out_for_delivery_time", type: "datetime" },
    { name: "delivered_date", type: "datetime" },
    { name: "cancelled_date", type: "datetime" },
    { name: "cancellation_reason", type: "string" },
    { name: "created_at", type: "datetime" },
    { name: "updated_at", type: "datetime" }
  ],
  payments: [
    { name: "payment_id", type: "int64" },
    { name: "order_id", type: "int64" },
    { name: "payment_method", type: "string" },
    { name: "payment_provider", type: "string" },
    { name: "transaction_reference", type: "string" },
    { name: "payment_status", type: "string" },
    { name: "amount", type: "decimal" },
    { name: "currency", type: "string" },
    { name: "refund_amount", type: "decimal" },
    { name: "refund_date", type: "datetime" },
    { name: "failure_reason", type: "string" },
    { name: "payment_date", type: "datetime" },
    { name: "attempt_number", type: "int64" },
    { name: "created_at", type: "datetime" },
    { name: "updated_at", type: "datetime" }
  ],
  products: [
    { name: "product_id", type: "int64" },
    { name: "product_name", type: "string" },
    { name: "product_description", type: "string" },
    { name: "category", type: "string" },
    { name: "subcategory", type: "string" },
    { name: "brand", type: "string" },
    { name: "sku", type: "string" },
    { name: "price", type: "decimal" },
    { name: "cost_price", type: "decimal" },
    { name: "currency", type: "string" },
    { name: "is_active", type: "boolean" },
    { name: "created_at", type: "datetime" },
    { name: "updated_at", type: "datetime" }
  ]
};

const getTypeBadgeStyle = (type) => {
  switch (type) {
    case "int64": return { color: "#0ea5e9", bg: "#f0f9ff" };     // Sky blue
    case "boolean": return { color: "#16a34a", bg: "#f0fdf4" };   // Emerald green
    case "string": return { color: "#a855f7", bg: "#f3e8ff" };    // Purple text badge
    case "decimal": return { color: "#06b6d4", bg: "#ecfeff" };   // Teal decimal badge
    case "datetime": return { color: "#ea580c", bg: "#fff7ed" };  // Orange timestamp badge
    default: return { color: "#64748b", bg: "#f1f5f9" };         // Fallback slate
  }
};
const Editor = lazy(() => import("@monaco-editor/react"));

function slugifyCompany(name) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

// ─── VALIDATION (Interview-style — extra/missing/wrong columns + values) ─────

function validateResults(userResult, referenceResult) {
  if (!userResult || !referenceResult) return null;

  if (userResult.values.length !== referenceResult.values.length) {
    return "almost";
  }

  if (userResult.columns.length > referenceResult.columns.length) {
    return "extra_columns";
  }
  if (userResult.columns.length < referenceResult.columns.length) {
    return "missing_columns";
  }

  const normalizeColumn = (col) => String(col).trim().toLowerCase();
  const userCols = userResult.columns.map(normalizeColumn).sort();
  const refCols = referenceResult.columns.map(normalizeColumn).sort();

  if (JSON.stringify(userCols) !== JSON.stringify(refCols)) {
    return "wrong_columns";
  }

  const normalizeValue = (v) => {
    if (v === null || v === undefined) return "null";
    if (!isNaN(v) && v !== "") return Number(v).toFixed(2);
    return String(v).trim().toLowerCase();
  };

  const normalizeRows = (result) =>
    result.values.map((row) => row.map(normalizeValue).sort().join("|")).sort().join("\n");

  return normalizeRows(userResult) === normalizeRows(referenceResult) ? "correct" : "almost";
}

// ─── SHARED PROBLEM-DETAIL BLOCK (REQUIRED OUTPUT COLUMNS, scenario, use cases) ──

function ExpandedProblemDetails({ p }) {
  return (
    <>
      {p.expectedColumns && (
        <div style={{ marginTop: "10px", padding: "14px 16px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#2563eb", marginBottom: "10px", letterSpacing: "0.03em" }}>
            REQUIRED OUTPUT COLUMNS
          </div>
          {p.expectedColumns.map((col) => (
            <div key={col} style={{ fontSize: "13px", color: "#0f172a", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#2563eb", fontSize: "14px" }}>•</span> {col}
            </div>
          ))}
          <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px dashed #bfdbfe" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#2563eb", fontWeight: 700, marginBottom: "8px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
            Expected Rows: {p.expectedRowCount}
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "#1d4ed8", lineHeight: 1.5 }}>
            <span style={{ fontSize: "14px", flexShrink: 0 }}>ⓘ</span>
            <span>Return ONLY these columns. Additional columns will be marked incorrect.</span>
          </div>
        </div>
      )}
    </>
  );
}

function TableStructure({ tables }) {
  const [openTable, setOpenTable] = useState(null);

  return (
    <div style={{ marginTop: "0.75rem" }}>
      <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
        📋 Table Structure
      </div>
      {tables.map(table => (
        <div key={table} style={{ marginBottom: "4px", border: "1px solid #e2e8f0", borderRadius: "6px", overflow: "hidden" }}>
          <div
            onClick={() => setOpenTable(openTable === table ? null : table)}
            style={{ padding: "6px 10px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", background: openTable === table ? "#eff6ff" : "#f8fafc" }}
          >
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: openTable === table ? "#2563eb" : "#0f172a", fontFamily: "monospace" }}>
              {table}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{DB_SCHEMAS[table]?.length || 0} cols</span>
              <span style={{ fontSize: "0.65rem", color: "#94a3b8", transform: openTable === table ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</span>
            </div>
          </div>
          {openTable === table && (
            <div style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
              {(DB_SCHEMAS[table] || []).map((col, i) => {
                const style = getTypeBadgeStyle(col.type);
                return (
                  <div
                    key={col.name}
                    style={{ padding: "5px 10px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < DB_SCHEMAS[table].length - 1 ? "1px solid #f1f5f9" : "none" }}
                  >
                    <span style={{ fontSize: "0.72rem", fontFamily: "monospace", color: "#0f172a" }}>{col.name}</span>
                    <span style={{ fontSize: "0.62rem", fontWeight: 600, padding: "1px 6px", borderRadius: "4px", background: style.bg, color: style.color }}>
                      {col.type}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── PROBLEM ROW (matches SQLInterviewPage's ProblemRow, plus company badge) ──

function ProblemRow({ p, isSelected, isExpanded, isSolved, selectedItemRef, onSelect }) {
  const diffColors = {
    Easy: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
    Medium: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
    Hard: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  };
  const ds = diffColors[p.difficulty] || diffColors.Easy;

  return (
    <div
      ref={isSelected ? selectedItemRef : null}
      style={{
        background: "#ffffff",
        border: "none",
        borderBottom: "1px solid #f1f5f9",
        overflow: "hidden",
        transition: "border-color 0.15s",
      }}
    >
      <div
        onClick={onSelect}
        style={{ padding: "0.75rem 0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", background: isSelected ? "#f8faff" : "transparent" }}
      >
        <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: isSolved ? "#16a34a" : isSelected ? "#eff6ff" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.62rem", fontWeight: 700, color: isSolved ? "#fff" : isSelected ? "#2563eb" : "#94a3b8", flexShrink: 0 }}>
          {isSolved ? "✓" : p.id}
        </div>
        <span style={{ fontSize: "0.83rem", fontWeight: isSelected ? 700 : 500, color: isSelected ? "#0f172a" : "#334155", flex: 1, lineHeight: 1.35 }}>
          {p.title}
        </span>
        <span style={{ fontSize: "0.62rem", padding: "2px 7px", borderRadius: "10px", background: ds.bg, color: ds.color, border: `1px solid ${ds.border}`, fontWeight: 600, whiteSpace: "nowrap" }}>
          {p.difficulty}
        </span>
        <span style={{ fontSize: "0.7rem", color: isExpanded ? "#2563eb" : "#94a3b8", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", lineHeight: 1 }}>▾</span>
      </div>

      {isExpanded && (
        <div style={{ borderTop: "1px solid #f1f5f9", padding: "0.875rem", background: "#fafbfc" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.65rem", padding: "2px 9px", borderRadius: "10px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", fontWeight: 700 }}>{p.company}</span>
            <span style={{ fontSize: "0.65rem", padding: "2px 9px", borderRadius: "10px", background: ds.bg, color: ds.color, border: `1px solid ${ds.border}`, fontWeight: 600 }}>{p.difficulty}</span>
            {(p.tags || []).map((tag) => (
              <span key={tag} style={{ fontSize: "0.65rem", padding: "2px 9px", borderRadius: "10px", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", fontWeight: 600 }}>{tag}</span>
            ))}
          </div>

          <div style={{ marginBottom: "0.875rem" }}>
            <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Task</div>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#0f172a", lineHeight: 1.6, fontWeight: 500 }}>{p.description}</p>
            <ExpandedProblemDetails p={p} />
          </div>
          <div style={{ marginBottom: "0.875rem" }}>
            <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Explanation</div>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#475569", lineHeight: 1.65 }}>{p.explanation}</p>
          </div>
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "0.625rem 0.75rem", marginBottom: "0.875rem" }}>
            <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "3px" }}>Real-world scenario</div>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#1e40af", lineHeight: 1.6 }}>{p.scenario}</p>
          </div>
          <div style={{ marginBottom: "0.875rem" }}>
            <div style={{ fontSize: "0.67rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "5px" }}>Common use cases</div>
            {(p.useCases || []).map((uc, i) => (
              <div key={i} style={{ display: "flex", gap: "6px", alignItems: "flex-start", marginBottom: "3px" }}>
                <span style={{ color: "#2563eb", fontSize: "0.7rem", marginTop: "2px" }}>→</span>
                <span style={{ fontSize: "0.77rem", color: "#475569", lineHeight: 1.5 }}>{uc}</span>
              </div>
            ))}
          </div>
          <details>
            <summary style={{ fontSize: "0.78rem", color: "#2563eb", fontWeight: 600, cursor: "pointer", listStyle: "none" }}>💡 Show hint</summary>
            <div style={{ marginTop: "6px", padding: "0.5rem 0.625rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "6px", fontSize: "0.78rem", color: "#92400e", lineHeight: 1.6, fontFamily: "monospace" }}>
              {p.hint}
            </div>
          </details>
          {/* {p.expectedColumns && (() => { */}
{(() => {
  // Detect which tables this problem uses based on solutionQuery or description
  const query = (p.solutionQuery || p.starterQuery || "").toLowerCase();
  const desc = (p.description || "").toLowerCase();
  const combined = query + " " + desc;

  const TABLE_SCHEMAS = {
    customers: ["customer_id","customer_name","email","phone","city","state","country","status","customer_type","lifetime_value"],
    orders: ["order_id","customer_id","order_date","order_status","payment_status","total_amount","currency","delivered_date"],
    order_items: ["item_id","order_id","product_id","quantity","unit_price","total_price","item_status"],
    products: ["product_id","product_name","category","subcategory","brand","price","cost_price"],
    payments: ["payment_id","order_id","payment_method","payment_status","amount","currency"],
    delivery_partners: ["delivery_partner_id","partner_name","vehicle_type","city","status","rating"],
    feedback: ["feedback_id","customer_id","order_id","rating","issue_category"],
  };

  const usedTables = Object.keys(TABLE_SCHEMAS).filter(t => combined.includes(t));
  if (usedTables.length === 0) return null;

  return (
    <TableStructure tables={usedTables} />
  );
})()}
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function SQLCompanyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { companySlug, problemSlug } = useParams();
  const editorRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const selectedItemRef = useRef(null);

  const runCountRef = useRef(0);
  const [runCountDisplay, setRunCountDisplay] = useState(0);
  const [, setCommunityFeed] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedCompany, setExpandedCompany] = useState(COMPANY_LIST[0] || null);
  const [selectedProblem, setSelectedProblem] = useState(SQL_COMPANY_PROBLEMS[0]);
  const [query, setQuery] = useState(SQL_COMPANY_PROBLEMS[0].starterQuery);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [db, setDb] = useState(null);
  const [dbReady, setDbReady] = useState(false);
  const [solvedIds, setSolvedIds] = useState(new Set());
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [modalComment, setModalComment] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [elapsed, setElapsed] = useState(null);
  const [userStreak, setUserStreak] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const { isGuest, isPro, userEmail, userName: userFullName } = useProStatus();
  const isMobile = useMobile();

  usePageMeta({
    title: selectedProblem
      ? `${selectedProblem.seoTitle} | Repractiq`
      : "Top Company SQL Interview Questions | Repractiq",
    description: selectedProblem
      ? selectedProblem.metaDescription
      : "Practice real SQL interview questions asked by Amazon, Google, Meta, Microsoft and other top tech companies.",
    canonical: selectedProblem
      ? `https://www.repractiq.com/sql/company/${slugifyCompany(selectedProblem.company)}/${selectedProblem.id}-${selectedProblem.slug}`
      : "https://www.repractiq.com/sql/company",
  });

  const solvedKey = (p) => `${p.company}::${p.id}`;

  const queryRef = useRef(query);
  useEffect(() => { queryRef.current = query; }, [query]);

  const selectedProblemRef = useRef(selectedProblem);
  useEffect(() => { selectedProblemRef.current = selectedProblem; }, [selectedProblem]);

  const dbRef = useRef(db);
  useEffect(() => { dbRef.current = db; }, [db]);

  useEffect(() => {
    const initDb = async () => {
      try {
        const initSqlJs = (await import("sql.js")).default;
        const SQL = await initSqlJs({
          locateFile: () => `${process.env.PUBLIC_URL}/sql-wasm.wasm`,
        });
        const database = new SQL.Database();

        const tables = [
          { name: "customers", columns: ["customer_id","customer_name","email","phone","city","state","country","postal_code","created_date","activated_date","last_login_date","last_order_date","status","customer_type","acquisition_channel","lifetime_value","is_verified"] },
          { name: "orders", columns: ["order_id","customer_id","order_date","order_status","payment_status","delivery_partner_id","subtotal_amount","tax_amount","discount_amount","delivery_fee","total_amount","currency","estimated_delivery_time","delivered_date","cancelled_date","cancellation_reason"] },
          { name: "order_items", columns: ["item_id","order_id","product_id","quantity","unit_price","discount_amount","tax_amount","total_price","item_status","currency"] },
          { name: "products", columns: ["product_id","product_name","product_description","category","subcategory","brand","sku","price","cost_price","currency","is_active"] },
          { name: "payments", columns: ["payment_id","order_id","payment_method","payment_provider","transaction_reference","payment_status","amount","currency","refund_amount","refund_date","failure_reason","payment_date","attempt_number"] },
          { name: "delivery_partners", columns: ["delivery_partner_id","partner_name","phone","vehicle_type","vehicle_number","city","status","joining_date","last_active_date","rating","total_deliveries"] },
          { name: "feedback", columns: ["feedback_id","customer_id","order_id","rating","review_text","feedback_channel","issue_category"] },
        ];

        for (const table of tables) {
          const { data, error } = await supabase
            .from(table.name)
            .select(table.columns.join(","))
            .limit(500);

          if (error || !data || data.length === 0) continue;

          const colDefs = table.columns.map(c => `"${c}" TEXT`).join(", ");
          database.run(`CREATE TABLE IF NOT EXISTS ${table.name} (${colDefs});`);

          const batchSize = 50;
          for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            const placeholders = batch.map(() => `(${table.columns.map(() => "?").join(",")})`).join(",");
            const values = batch.flatMap(row =>
              table.columns.map(col => {
                const val = row[col];
                if (val === null || val === undefined) return null;
                return String(val);
              })
            );
            database.run(
              `INSERT INTO ${table.name} (${table.columns.map(c => `"${c}"`).join(",")}) VALUES ${placeholders}`,
              values
            );
          }
        }

        setDb(database);
        setDbReady(true);
      } catch (err) {
        console.error("SQL.js failed to load:", err);
      }
    };
    initDb();
  }, []);

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      // Wait for auth to be ready
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Retry once after a short delay in case session is still loading
        setTimeout(async () => {
          const { data: { session: retrySession } } = await supabase.auth.getSession();
          if (!retrySession) return;
          await loadSolved(retrySession.user.id);
        }, 800);
        return;
      }
      await loadSolved(session.user.id);
    };
  
    const loadSolved = async (userId) => {
      const { data: streakRow } = await supabase
        .from("user_streaks")
        .select("current_streak")
        .eq("user_id", userId)
        .maybeSingle();
      setUserStreak(streakRow?.current_streak || 0);
  
      const { data, error } = await supabase
  .from("submissions")
  .select("problem_id, problem_title")
  .eq("user_id", userId)
  .eq("category", "sql_company")
  .eq("status", "correct");

// Reconstruct composite keys from problem_title which has "Company — Title"
const ids = new Set(data.map((row) => {
  // Extract company from problem_title "Amazon — Find top customers"
  const company = row.problem_title?.split(" — ")[0] || "";
  return `${company}::${row.problem_id}`;
}));
setSolvedIds(ids);
    };
  
    fetchSolvedProblems();
  }, []);

  async function updateStreak(userId) {
    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!existing) {
      await supabase.from("user_streaks").insert({
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_solved_date: today,
      });
      return;
    }

    if (existing.last_solved_date === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const newStreak = existing.last_solved_date === yesterdayStr
      ? (existing.current_streak || 0) + 1
      : 1;

    await supabase.from("user_streaks").update({
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, existing.longest_streak || 0),
      last_solved_date: today,
    }).eq("user_id", userId);
  }

  const runQuery = useCallback(async () => {
    const currentDb = dbRef.current;
    const currentQuery = queryRef.current;
    const currentProblem = selectedProblemRef.current;

    if (!currentDb) return;
    setError(null);
    setResults(null);

    try {
      const res = currentDb.exec(currentQuery);
      if (res.length === 0) {
        setError("Query executed but returned no rows. Check your logic.");
        return;
      }

      const resultData = res[0];
      setResults(resultData);

      runCountRef.current += 1;
      const newRunCount = runCountRef.current;
      setRunCountDisplay(newRunCount);

      let status = "attempted";
      if (currentProblem.solutionQuery) {
        try {
          const ref = currentDb.exec(currentProblem.solutionQuery);
          if (ref.length > 0) {
            status = validateResults(resultData, ref[0]);
            setValidationStatus(status);
            if (status === "correct") {
              setSolvedIds(prev => new Set([...prev, solvedKey(currentProblem)]));
              setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
              const { data: sessionData } = await supabase.auth.getSession();
              if (sessionData?.session?.user?.id) {
                const newBadges = await checkAndSaveBadges(sessionData.session.user.id);
                if (newBadges.length > 0) setUnlockedBadges(newBadges);
              }
            }
          }
        } catch (_) {
          // solution query failed silently — don't block the user
        }
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        const userId = sessionData.session.user.id;
        
        const { data: existing } = await supabase
          .from("submissions")
          .select("id, status")
          .eq("user_id", userId)
          .eq("problem_id", currentProblem.id)
          .eq("category", "sql_company")
          .maybeSingle();

        if (existing?.status === "correct" && status !== "correct") {
          await updateStreak(userId);
          return;
        }

        if (existing) {
          const { data, error } = await supabase
  .from("submissions")
  .update({
    query: currentQuery,
    status,
    run_count: newRunCount,
    is_best_attempt: status === "correct",
    time_taken_seconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
    updated_at: new Date().toISOString(),
  })
  .eq("id", existing.id)
  .select();

console.log("UPDATE DATA:", data);
console.log("UPDATE ERROR:", error);
        } else {
          const { data, error } = await supabase
  .from("submissions")
  .insert({
    user_id: userId,
    problem_id: currentProblem.id,
    category: "sql_company",
    problem_title: `${currentProblem.company} — ${currentProblem.title}`,
    query: currentQuery,
    status,
    run_count: newRunCount,
    is_best_attempt: status === "correct",
    time_taken_seconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
  })
  .select();

console.log("INSERT DATA:", data);
console.log("INSERT ERROR:", error);
        }

        await updateStreak(userId);
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const handleSelectProblem = useCallback((p) => {
    startTimeRef.current = Date.now();
    runCountRef.current = 0;
    setRunCountDisplay(0);
    setSelectedProblem(p);
    setQuery("-- Explore the data first, then write your solution below\nSELECT * FROM customers LIMIT 5;");
    setResults(null);
    setError(null);
    setValidationStatus(null);
    navigate(`/sql/company/${slugifyCompany(p.company)}/${p.id}-${p.slug}`);
  }, [navigate]);

  const handleToggleExpand = (p) => {
    const key = solvedKey(p);
    setExpandedId((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    const incoming = location.state || {};
    if (incoming.searchQuery) {
      setSearchInput(incoming.searchQuery);
      setSearchTerm(incoming.searchQuery);
    }

    if (companySlug && problemSlug) {
      const idFromUrl = Number((problemSlug || "").split("-")[0]);
      const target = SQL_COMPANY_PROBLEMS.find(
        (p) => slugifyCompany(p.company) === companySlug && p.id === idFromUrl
      );
      if (target) {
        handleSelectProblem(target);
        setExpandedCompany(target.company);
        setExpandedId(solvedKey(target));
      }
    }
  }, [companySlug, problemSlug, location.state, handleSelectProblem]);

  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedProblem]);

  const handlePostCommunity = () => {
    setShowModal(true);
    setModalComment("");
    setPostSuccess(false);
  };

  const submitPost = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session) {
      const userId = sessionData.session.user.id;
      await supabase.from("submissions").upsert({
        user_id: userId,
        problem_id: solvedKey(selectedProblem),
        category: "sql_company",
        problem_title: `${selectedProblem.company} — ${selectedProblem.title}`,
        query: query,
        status: "attempted",
        is_best_attempt: true,
        comment: modalComment,
        run_count: runCountRef.current,
        time_taken_seconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
      });
    }
    setCommunityFeed((prev) => [{
      user: "You",
      problem: selectedProblem.title,
      category: "sql_company",
      query: query,
      comment: modalComment,
      time: "Just now",
    }, ...prev]);
    setPostSuccess(true);
    setTimeout(() => setShowModal(false), 1800);
  };

  const filteredProblems = useMemo(() => {
    return SQL_COMPANY_PROBLEMS.filter((p) => {
      const matchSearch = !searchTerm.trim() ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCompany = companyFilter === "All" || p.company === companyFilter;
      const matchDifficulty = difficultyFilter === "All" || p.difficulty === difficultyFilter;
      const matchTopic = topicFilter === "All" || (p.tags || []).includes(topicFilter);
      return matchSearch && matchCompany && matchDifficulty && matchTopic;
    });
  }, [searchTerm, companyFilter, difficultyFilter, topicFilter]);

  const isFiltering = searchTerm.trim() || companyFilter !== "All" || difficultyFilter !== "All" || topicFilter !== "All";

  const groupedByCompany = useMemo(() => {
    const groups = {};
    for (const company of COMPANY_LIST) {
      groups[company] = filteredProblems.filter((p) => p.company === company);
    }
    return groups;
  }, [filteredProblems]);

  const totalProblems = SQL_COMPANY_PROBLEMS.length;
  const solvedCount = solvedIds.size;

  const validationBanner = () => {
    if (!validationStatus) return null;
    const configs = {
      correct: { bg: "#f0fdf4", border: "#86efac", icon: "✓", iconColor: "#16a34a", title: "Correct!", msg: "Your output matches the expected result perfectly.", titleColor: "#15803d" },
      almost: { bg: "#fffbeb", border: "#fcd34d", icon: "~", iconColor: "#d97706", title: "Almost there", msg: "Your result structure looks right but the values don't match. Check your filters or logic.", titleColor: "#b45309" },
      wrong: { bg: "#fef2f2", border: "#fca5a5", icon: "✗", iconColor: "#dc2626", title: "Not quite", msg: "The returned rows do not match the expected output. Check your filters, joins, grouping, or calculations.", titleColor: "#b91c1c" },
      extra_columns: { bg: "#fef2f2", border: "#fca5a5", icon: "!", iconColor: "#dc2626", title: "Extra Columns Returned", msg: "Return only the columns requested in the problem statement.", titleColor: "#b91c1c" },
      missing_columns: { bg: "#fef2f2", border: "#fca5a5", icon: "!", iconColor: "#dc2626", title: "Missing Columns", msg: "One or more required columns are missing.", titleColor: "#b91c1c" },
      wrong_columns: { bg: "#fef2f2", border: "#fca5a5", icon: "!", iconColor: "#dc2626", title: "Incorrect Column Names", msg: "Column names do not match the required output.", titleColor: "#b91c1c" },
    };
    const c = configs[validationStatus];
    return (
      <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "0.875rem 1rem", marginBottom: "1rem", display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: c.iconColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
          {c.icon}
        </div>
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: c.titleColor }}>{c.title}</div>
          <div style={{ fontSize: "0.8rem", color: "#475569", marginTop: "2px" }}>{c.msg}</div>
          {validationStatus === "correct" && (
            <div style={{ display: "flex", gap: "8px", marginTop: "0.5rem", flexWrap: "wrap" }}>
              <button onClick={handlePostCommunity} style={{ fontSize: "0.78rem", color: "#2563eb", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "6px", padding: "4px 12px", cursor: "pointer", fontWeight: 600 }}>
                🎉 Share to Community
              </button>
              <button onClick={() => setShareOpen(true)} style={{ fontSize: "0.78rem", color: "#0a66c2", background: "#e8f0fe", border: "1px solid #b0c4f7", borderRadius: "6px", padding: "4px 12px", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#0a66c2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Share on LinkedIn
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isMobile) {
    return (
      <MobileSQLLayout
        problems={filteredProblems}
        selectedProblem={selectedProblem}
        onSelectProblem={handleSelectProblem}
        query={query}
        onQueryChange={setQuery}
        onRun={runQuery}
        onReset={() => { setQuery(selectedProblem.starterQuery); setResults(null); setError(null); }}
        dbReady={dbReady}
        results={results}
        error={error}
        validationStatus={validationStatus}
        solvedIds={solvedIds}
        isGuest={isGuest}
        isPro={isPro}
        paywallThreshold={9999}
        guestThreshold={10}
        onNavigateSignup={() => navigate("/signup")}
        onNavigateLogin={() => navigate("/login")}
        onNavigatePricing={() => navigate("/pricing")}
        pageTitle="Top Company Questions"
        totalProblems={totalProblems}
        runCountDisplay={runCountDisplay}
        onPostCommunity={handlePostCommunity}
        setShareOpen={setShareOpen}
        user={{ fullName: userFullName, username: userFullName || userEmail?.split("@")[0] || "user" }}
        solvedCount={solvedCount}
        streak={userStreak}
        firstTry={runCountDisplay === 1}
        elapsed={elapsed}
        ShareModalComponent={ShareModal}
      />
    );
  }

  return (
    <div style={{ background: "#ffffff", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "Inter, -apple-system, sans-serif", color: "#0f172a", overflow: "hidden" }}>
      <StructuredData problem={selectedProblem} category="company" />

      <nav style={{ padding: "0.85rem 2rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.97)", flexShrink: 0 }}>
        <span onClick={() => navigate("/")} style={{ fontWeight: 800, cursor: "pointer", fontSize: "1.1rem", letterSpacing: "-0.3px" }}>Repractiq</span>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span onClick={() => navigate("/home")} style={{ cursor: "pointer", color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}>Home</span>
          <span onClick={() => navigate("/profile")} style={{ cursor: "pointer", color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}>Profile</span>
          <div style={{ fontSize: "0.78rem", color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "4px 12px", fontWeight: 600 }}>
            ✓ {solvedCount} / {totalProblems} completed
          </div>
          <span onClick={() => navigate("/sql")} style={{ cursor: "pointer", color: "#2563eb", fontSize: "0.85rem", fontWeight: 600 }}>← Back to Practice</span>
        </div>
      </nav>

      <div style={{ background: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)", borderBottom: "1px solid #e2e8f0", padding: "0.875rem 2rem", display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
        <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.3px", color: "#0f172a" }}>Top Company SQL Questions</h2>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        <div style={{ width: "360px", minWidth: "320px", borderRight: "1px solid #e2e8f0", overflowY: "auto", background: "#f8fafc", flexShrink: 0 }}>

          <div style={{ padding: "1rem 1rem 0.5rem" }}>
            <span style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Questions</span>

            <div style={{ marginTop: "0.65rem", display: "flex", gap: "8px" }}>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") setSearchTerm(searchInput.trim()); }}
                placeholder="Search questions..."
                style={{ flex: 1, fontSize: "0.75rem", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "7px 9px", outline: "none" }}
              />
              <button
                onClick={() => setSearchTerm(searchInput.trim())}
                style={{ fontSize: "0.75rem", border: "1px solid #bfdbfe", color: "#2563eb", background: "#eff6ff", borderRadius: "8px", padding: "7px 10px", cursor: "pointer", fontWeight: 600 }}
              >
                Search
              </button>
            </div>

            <div style={{ marginTop: "8px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                style={{ fontSize: "0.72rem", border: "1px solid #cbd5e1", borderRadius: "7px", padding: "6px 4px", outline: "none", background: "#fff", color: "#0f172a" }}
              >
                <option value="All">All companies</option>
                {COMPANY_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                style={{ fontSize: "0.72rem", border: "1px solid #cbd5e1", borderRadius: "7px", padding: "6px 4px", outline: "none", background: "#fff", color: "#0f172a" }}
              >
                <option value="All">All difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                style={{ fontSize: "0.72rem", border: "1px solid #cbd5e1", borderRadius: "7px", padding: "6px 4px", outline: "none", background: "#fff", color: "#0f172a" }}
              >
                <option value="All">All topics</option>
                {COMPANY_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {isFiltering && (
            <div style={{ margin: "0 0.75rem 0.5rem", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "10px", padding: "0.625rem 0.75rem" }}>
              <div style={{ fontSize: "0.72rem", color: "#1d4ed8", fontWeight: 700 }}>
                {filteredProblems.length} question{filteredProblems.length !== 1 ? "s" : ""} found
              </div>
            </div>
          )}

          {COMPANY_LIST.map((company) => {
            const companyProblems = groupedByCompany[company] || [];
            if (isFiltering && companyProblems.length === 0) return null;

            const allCompanyProblems = SQL_COMPANY_PROBLEMS.filter((p) => p.company === company);
            const solvedInCompany = allCompanyProblems.filter((p) => solvedIds.has(solvedKey(p))).length;
            const totalInCompany = allCompanyProblems.length;
            const isOpen = expandedCompany === company;

            const diffScore = { Easy: 1, Medium: 2, Hard: 3 };
            const avgScore = allCompanyProblems.reduce((sum, p) => sum + (diffScore[p.difficulty] || 2), 0) / (allCompanyProblems.length || 1);
            const avgDifficultyLabel = avgScore < 1.5 ? "Easy" : avgScore < 2.5 ? "Medium" : "Hard";

            return (
              <div key={company} style={{ margin: "0 0.75rem 0.75rem" }}>
                <div
                  onClick={() => setExpandedCompany(isOpen ? null : company)}
                  style={{
                    background: isOpen ? "#eff6ff" : "#ffffff",
                    border: `1.5px solid ${isOpen ? "#bfdbfe" : "#e2e8f0"}`,
                    borderRadius: isOpen ? "10px 10px 0 0" : "10px",
                    padding: "0.75rem 0.875rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "border-radius 0.15s",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>{company}</div>
                    <div style={{ fontSize: "0.65rem", color: "#94a3b8", marginTop: "2px" }}>
                      {totalInCompany} Questions · Avg. Difficulty {avgDifficultyLabel}
                    </div>
                    <div style={{ marginTop: "6px", height: "3px", background: "#e2e8f0", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: `${totalInCompany > 0 ? Math.round((solvedInCompany / totalInCompany) * 100) : 0}%`, height: "100%", background: "#2563eb", borderRadius: "2px", transition: "width 0.4s ease" }} />
                    </div>
                    <div style={{ fontSize: "0.62rem", color: "#94a3b8", marginTop: "3px" }}>
                      {solvedInCompany}/{totalInCompany} solved
                    </div>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: isOpen ? "#2563eb" : "#94a3b8", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▾</span>
                </div>

                {isOpen && (
                  <div style={{ border: "1.5px solid #e2e8f0", borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
                    {companyProblems.map((p) => (
                      <ProblemRow
                        key={solvedKey(p)}
                        p={p}
                        isSelected={selectedProblem.company === p.company && selectedProblem.id === p.id}
                        isExpanded={expandedId === solvedKey(p)}
                        isSolved={solvedIds.has(solvedKey(p))}
                        selectedItemRef={selectedItemRef}
                        onSelect={() => {
                          handleSelectProblem(p);
                          handleToggleExpand(p);
                          if (editorRef.current) editorRef.current.focus();
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ height: "1.5rem" }} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#ffffff" }}>
          <>
            <div style={{ padding: "1.25rem 1.75rem 1rem", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: "10px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", fontWeight: 700 }}>{selectedProblem.company}</span>
                    <span style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: "10px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", fontWeight: 600 }}>{selectedProblem.difficulty}</span>
                    <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>#{selectedProblem.id}</span>
                    {solvedIds.has(solvedKey(selectedProblem)) && (
                      <span style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: "10px", background: "#f0fdf4", color: "#16a34a", fontWeight: 600 }}>✓ Solved</span>
                    )}
                  </div>
                  <h1 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.3px", color: "#0f172a" }}>{selectedProblem.title}</h1>
                </div>
                {/* <button
                  onClick={handlePostCommunity}
                  style={{ padding: "8px 16px", borderRadius: "8px", background: "#ffffff", color: "#2563eb", fontWeight: 600, fontSize: "0.8rem", border: "1.5px solid #bfdbfe", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}
                >
                  🌐 Post to Community
                </button> */}
              </div>
              <div style={{ marginTop: "0.875rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderLeft: "3px solid #2563eb", borderRadius: "0 8px 8px 0", padding: "0.625rem 0.875rem" }}>
                <span style={{ fontSize: "0.67rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "3px" }}>Task</span>
                <p style={{ margin: 0, fontSize: "0.88rem", color: "#0f172a", lineHeight: 1.6 }}>{selectedProblem.description}</p>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.75rem" }}>
              {validationBanner()}

              <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", marginBottom: "1rem" }}>
                <div style={{ background: "#f8fafc", padding: "0.625rem 1rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.7rem", background: "#e2e8f0", color: "#0f172a", padding: "3px 9px", borderRadius: "20px", fontWeight: 700 }}>SQL</span>
                    <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Ctrl+Enter to run</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                  <button
  onClick={() => { setQuery("-- Explore the data first, then write your solution below"); setResults(null); setError(null); setValidationStatus(null); }}
  style={{ fontSize: "0.75rem", color: "#64748b", background: "transparent", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }}
>
  Reset
</button>
<button
  onClick={() => { setQuery(selectedProblem.solutionQuery); setResults(null); setValidationStatus(null); }}
  style={{ fontSize: "0.75rem", color: "#d97706", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}
>
  💡 Solution
</button>
                    <button
                      onClick={runQuery}
                      disabled={!dbReady}
                      style={{ padding: "6px 18px", borderRadius: "6px", background: dbReady ? "#2563eb" : "#94a3b8", color: "#fff", fontWeight: 700, fontSize: "0.8rem", border: "none", cursor: dbReady ? "pointer" : "not-allowed" }}
                    >
                      {dbReady ? "▶ Run" : "Loading…"}
                    </button>
                  </div>
                </div>
                <Suspense fallback={<div style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: "0.85rem", background: "#1e1e1e" }}>Loading editor…</div>}>
                  <Editor
                    height="400px"
                    language="sql"
                    value={query}
                    onChange={(value) => setQuery(value || "")}
                    theme="vs-dark"
                    options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: "on", scrollBeyondLastLine: false, padding: { top: 10, bottom: 10 }, lineNumbers: "on" }}
                    onMount={(editor) => {
                      editorRef.current = editor;
                      editor.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.Enter, () => runQuery());
                    }}
                  />
                </Suspense>
              </div>

              <div style={{ border: "1.5px solid #e2e8f0", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ background: "#f8fafc", padding: "0.625rem 1rem", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Output</span>
                  {results && (
                    <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{results.values.length} row{results.values.length !== 1 ? "s" : ""}</span>
                  )}
                </div>
                <div style={{ minHeight: "120px", padding: "0.875rem 1rem", background: "#ffffff" }}>
                  {!results && !error && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100px", color: "#94a3b8", fontSize: "0.82rem" }}>
                      Run your query to see results here
                    </div>
                  )}
                  {error && (
                    <div style={{ color: "#ef4444", fontSize: "0.82rem", fontFamily: "monospace", lineHeight: 1.6, background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "0.75rem" }}>
                      {error}
                    </div>
                  )}
                  {results && (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ borderCollapse: "collapse", fontSize: "0.8rem", width: "100%" }}>
                        <thead>
                          <tr>
                            {results.columns.map((col) => (
                              <th key={col} style={{ textAlign: "left", padding: "6px 12px", color: "#64748b", fontWeight: 600, borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {results.values.map((row, i) => (
                            <tr key={i} style={{ background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                              {row.map((cell, j) => (
                                <td key={j} style={{ padding: "7px 12px", color: "#0f172a", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {runCountDisplay > 2 && validationStatus !== "correct" && (
                <div style={{ marginTop: "1rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.8rem", color: "#92400e" }}>
                  <strong>Stuck?</strong> Click the question on the left and expand the hint section.
                </div>
              )}

              <div style={{ height: "2rem" }} />
            </div>
          </>
        </div>
      </div>

      {showModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "1.75rem", width: "480px", maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            {postSuccess ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🎉</div>
                <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a" }}>Posted to Community!</div>
                <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>Your solution is now live on the community feed.</div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "1.25rem" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>Share to Community</h3>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748b" }}>Your query and comment will appear in the community feed.</p>
                </div>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "0.625rem 0.875rem", marginBottom: "1rem", fontSize: "0.82rem", color: "#0f172a", fontWeight: 600 }}>
                  📝 {selectedProblem.company} — {selectedProblem.title}
                </div>
                <div style={{ background: "#0f172a", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontFamily: "monospace", fontSize: "0.8rem", color: "#7dd3fc", whiteSpace: "pre-wrap", maxHeight: "100px", overflowY: "auto" }}>
                  {query}
                </div>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>
                    Add a comment (optional)
                  </label>
                  <textarea
                    value={modalComment}
                    onChange={(e) => setModalComment(e.target.value)}
                    placeholder="Share what you learned, a tip, or a question..."
                    rows={3}
                    style={{ width: "100%", padding: "0.625rem 0.75rem", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontSize: "0.85rem", fontFamily: "Inter, sans-serif", outline: "none", resize: "none", color: "#0f172a", boxSizing: "border-box" }}
                    onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button onClick={() => setShowModal(false)} style={{ padding: "8px 18px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "#ffffff", color: "#64748b", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button onClick={submitPost} style={{ padding: "8px 22px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#ffffff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
                    Post →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        problem={{ ...selectedProblem, category: `${selectedProblem.company} — Company` }}
        user={{
          fullName: userFullName,
          username: userFullName || userEmail?.split("@")[0] || "user",
        }}
        solvedCount={solvedCount}
        streak={userStreak}
        firstTry={runCountDisplay === 1}
        timeTaken={elapsed}
      />
      <BadgeUnlockModal
        badges={unlockedBadges}
        isOpen={unlockedBadges.length > 0}
        onClose={() => setUnlockedBadges([])}
        onViewBadges={() => navigate("/profile?tab=badges")}
        isMobile={isMobile}
      />
    </div>
  );
}