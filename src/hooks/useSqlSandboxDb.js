import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const TABLES = [
  { name: "customers", columns: ["customer_id","customer_name","email","phone","city","state","country","postal_code","created_date","activated_date","last_login_date","last_order_date","status","customer_type","acquisition_channel","lifetime_value","is_verified"] },
  { name: "orders", columns: ["order_id","customer_id","order_date","order_status","payment_status","delivery_partner_id","subtotal_amount","tax_amount","discount_amount","delivery_fee","total_amount","currency","estimated_delivery_time","delivered_date","cancelled_date","cancellation_reason"] },
  { name: "order_items", columns: ["order_item_id","order_id","product_id","quantity","unit_price","discount_amount","tax_amount","total_price","item_status","currency"] },
  { name: "products", columns: ["product_id","product_name","product_description","category","subcategory","brand","sku","price","cost_price","currency","is_active"] },
  { name: "payments", columns: ["payment_id","order_id","payment_method","payment_provider","transaction_reference","payment_status","amount","currency","refund_amount","refund_date","failure_reason","payment_date","attempt_number"] },
  { name: "delivery_partners", columns: ["delivery_partner_id","partner_name","phone","vehicle_type","vehicle_number","city","status","joining_date","last_active_date","rating","total_deliveries"] },
  { name: "feedback", columns: ["feedback_id","customer_id","order_id","rating","review_text","feedback_channel","issue_category"] },
];

export function useSqlSandboxDb() {
  const [db, setDb] = useState(null);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initDb = async () => {
      try {
        const initSqlJs = (await import("sql.js")).default;
        const SQL = await initSqlJs({ locateFile: () => `${process.env.PUBLIC_URL}/sql-wasm.wasm` });
        const database = new SQL.Database();

        for (const table of TABLES) {
          const { data, error } = await supabase.from(table.name).select(table.columns.join(",")).limit(500);
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
                return val === null || val === undefined ? null : String(val);
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

  return { db, dbReady };
}