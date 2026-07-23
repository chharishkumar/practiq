export const SQL_SCENARIOS_PROBLEMS = [
  {
    id: 1,
    title: "Revenue Drop Investigation",
    difficulty: "Intermediate",
    slug: "revenue-drop-investigation",
    seoTitle: "SQL Scenario | Revenue Drop Investigation",
    metaDescription: "Investigate revenue trends over the latest two weeks of available order data using SQL.",
    tags: [
      "Revenue Analysis",
      "Time Series",
      "CTE",
      "Business Scenario"
    ],
    description: "The business team suspects revenue has declined recently. Calculate the daily revenue for the most recent 14 days available in the dataset.",
    explanation: "Instead of relying on the current system date, first determine the latest order date in the dataset and then calculate revenue for the previous 14 days.",
    scenario: "During the weekly business review, leadership noticed that revenue appears to have declined. They need a daily revenue report for the latest two weeks of available data before investigating deeper.",
    useCases: [
      "Revenue reporting",
      "Business dashboards",
      "Trend analysis"
    ],
    hint: "Find MAX(order_date) first, then filter the last 14 days.",
    starterQuery: `SELECT
  order_date,
  ROUND(SUM(total_amount),2) AS revenue
  FROM orders
  GROUP BY order_date
  ORDER BY order_date DESC;`,
    expectedColumns: [
      "order_date",
      "daily_revenue"
    ],
    expectedRowCount: 14,
    validateBy: "exact",
    solutionQuery: `WITH latest_date AS (
      SELECT MAX(order_date) AS max_date
      FROM orders
  )
  SELECT
      o.order_date,
      ROUND(SUM(o.total_amount),2) AS daily_revenue
  FROM orders o
  CROSS JOIN latest_date l
  WHERE o.order_date BETWEEN DATE(l.max_date,'-13 days') AND l.max_date
  GROUP BY o.order_date
  ORDER BY o.order_date DESC;`
  },
  
  {
    id: 2,
    title: "Top Customers by Refund Amount",
    difficulty: "Intermediate",
    slug: "top-customers-by-refund-amount",
    seoTitle: "SQL Scenario | Top Customers by Refund Amount",
    metaDescription: "Identify customers who have received the highest refund amounts using SQL joins and aggregation.",
    tags: [
      "Refund Analysis",
      "Aggregation",
      "GROUP BY",
      "Business Scenario"
    ],
    description: "The finance team wants to identify customers who have received the highest total refund amount.",
    explanation: "Join payments with orders and customers, then calculate the total refund amount for each customer. Rank the customers from highest to lowest refund amount.",
    scenario: "As part of a monthly financial review, the finance team wants to identify customers receiving the largest refunds to investigate potential issues with products, payments, or fraudulent activity.",
    useCases: [
      "Refund reporting",
      "Customer analysis",
      "Financial auditing"
    ],
    hint: "Join payments, orders, and customers. Aggregate refund_amount by customer.",
    starterQuery: `SELECT
  c.customer_id,
  c.customer_name,
  SUM(p.refund_amount) AS total_refund
  FROM payments p
  JOIN orders o
  ON p.order_id = o.order_id
  JOIN customers c
  ON o.customer_id = c.customer_id
  GROUP BY c.customer_id, c.customer_name;`,
    expectedColumns: [
      "customer_id",
      "customer_name",
      "total_refund"
    ],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: `SELECT
  c.customer_id,
  c.customer_name,
  ROUND(SUM(COALESCE(p.refund_amount,0)),2) AS total_refund
  FROM payments p
  JOIN orders o
  ON p.order_id = o.order_id
  JOIN customers c
  ON o.customer_id = c.customer_id
  GROUP BY
  c.customer_id,
  c.customer_name
  ORDER BY total_refund DESC
  LIMIT 10;`
  },
  {
    id: 3,
    title: "Delivery Delay Root Cause",
    difficulty: "Intermediate",
    description: "Customers are complaining about late deliveries. Identify which delivery partners or cities are causing delays.",
    explanation: "Calculate delivery delay and group by partner and location.",
    scenario: "Operations team wants to fix delivery performance issues.",
    useCases: ["SLA monitoring", "Logistics optimization"],
    hint: "Compare delivered_date and estimated_delivery_time",
    starterQuery: "SELECT delivery_partner_id,\nAVG(julianday(delivered_date) - julianday(estimated_delivery_time)) as delay\nFROM orders\nGROUP BY delivery_partner_id;",
    expectedColumns: ["delivery_partner_id", "delay"],
    expectedRowCount: 5,
    solutionQuery: "SELECT\n    dp.delivery_partner_id,\n    dp.partner_name,\n    dp.city,\n    ROUND(\n        AVG(julianday(o.delivered_date) - julianday(o.estimated_delivery_time)),\n        2\n    ) AS avg_delay_days,\n    COUNT(o.order_id) AS total_orders\nFROM delivery_partners dp\nJOIN orders o\n    ON dp.delivery_partner_id = o.delivery_partner_id\nWHERE o.delivered_date IS NOT NULL\nGROUP BY dp.delivery_partner_id, dp.partner_name, dp.city\nORDER BY avg_delay_days DESC;",
    slug: "delivery-delay-root-cause",
    seoTitle: "SLA Tracking in SQL: Finding Delivery Network Delay Bottlenecks",
    metaDescription: "Examine transport logistics performance. Apply date manipulation calculations to rank delivery service suppliers by expected arrival variance.",
    tags: ["Logistics Optimization", "Date Arithmetic", "SLA Monitoring", "Operations Analytics"]
  },
  
  {
    id: 4,
    title: "Customer Churn Risk Identification",
    difficulty: "Intermediate",
    description: "Identify customers who are likely to churn based on declining activity.",
    explanation: "Analyze recency and frequency trends in orders.",
    scenario: "Marketing wants to target customers before they churn.",
    useCases: ["Retention", "CRM", "Customer lifecycle"],
    hint: "Compare last order date and frequency over time",
    starterQuery: "SELECT customer_id, MAX(order_date) as last_order\nFROM orders\nGROUP BY customer_id;",
    expectedColumns: ["customer_id", "last_order"],
    expectedRowCount: 5,
    solutionQuery: "SELECT\n    customer_id,\n    MAX(order_date) AS last_order,\n    COUNT(order_id) AS total_orders,\n    ROUND(\n        julianday('now') - julianday(MAX(order_date)),\n        2\n    ) AS days_since_last_order,\n    CASE\n        WHEN julianday('now') - julianday(MAX(order_date)) > 90 THEN 'High Risk'\n        WHEN julianday('now') - julianday(MAX(order_date)) > 60 THEN 'Medium Risk'\n        ELSE 'Low Risk'\n    END AS churn_risk\nFROM orders\nGROUP BY customer_id;",
    slug: "customer-churn-risk-identification",
    seoTitle: "Predictive Churn Profiling via SQL Recency Tracking Scales",
    metaDescription: "Isolate customer attrition metrics. Build dynamic risk categories using case conditions evaluating time elapsed since historic buying timestamps.",
    tags: ["Customer Churn", "Conditional Logic", "Recency Analysis", "CRM Segmentation"]
  },
  
  {
    id: 5,
    title: "Payment Failure Investigation",
    difficulty: "Intermediate",
    description: "Payments are failing more frequently. Identify which providers or methods are causing issues.",
    explanation: "Analyze payment failure rates grouped by provider and method.",
    scenario: "Payments team wants to improve success rates.",
    useCases: ["Payment optimization", "Failure analysis"],
    hint: "Filter failed payments and group by provider",
    starterQuery: "SELECT payment_provider, COUNT(*) as failures\nFROM payments\nWHERE payment_status = 'failed'\nGROUP BY payment_provider;",
    expectedColumns: ["payment_provider", "failures"],
    expectedRowCount: 4,
    solutionQuery: "SELECT\n    payment_provider,\n    payment_method,\n    COUNT(*) AS failures,\n    ROUND(SUM(amount), 2) AS failed_amount\nFROM payments\nWHERE payment_status = 'failed'\nGROUP BY payment_provider, payment_method\nORDER BY failures DESC;",
    slug: "payment-failure-investigation",
    seoTitle: "Fintech SQL Analysis: Auditing Payment Method Failure Rates",
    metaDescription: "Quantify financial pipeline friction. Write grouped multi-attribute transaction scripts aggregating deficit values from interrupted checkouts.",
    tags: ["Fintech Analysis", "Error Auditing", "Multi-Column Grouping", "Revenue Protection"]
  },
  
  {
    id: 6,
    title: "Customer Lifetime Value Accuracy Check",
    difficulty: "Intermediate",
    description: "The business suspects stored lifetime_value is incorrect. Validate it against actual spend.",
    explanation: "Compare stored lifetime_value with SUM of order total_amount per customer.",
    scenario: "Finance team auditing customer metrics.",
    useCases: ["Data validation", "Customer analytics"],
    hint: "JOIN customers + orders",
    starterQuery: "SELECT c.customer_id, c.lifetime_value, SUM(o.total_amount) as actual\nFROM customers c JOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.customer_id;",
    expectedColumns: ["customer_id", "lifetime_value", "actual"],
    expectedRowCount: 5,
    solutionQuery: "SELECT\n    c.customer_id,\n    c.customer_name,\n    ROUND(c.lifetime_value, 2) AS stored_lifetime_value,\n    ROUND(SUM(o.total_amount), 2) AS actual_spend,\n    ROUND(\n        SUM(o.total_amount) - c.lifetime_value,\n        2\n    ) AS difference_value\nFROM customers c\nJOIN orders o\n    ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.customer_name, c.lifetime_value\nORDER BY ABS(difference_value) DESC;",
    slug: "customer-lifetime-value-accuracy-check",
    seoTitle: "Data Warehouse Auditing: Checking CLV Discrepancies with SQL",
    metaDescription: "Validate data synchronization status. Use algebraic distance functions to detect divergence between stored profiles and live item totals.",
    tags: ["Data Validation", "Absolute Value Math", "Financial Recon", "E-commerce Audits"]
  },
  
  {
    id: 7,
    title: "Discount Effectiveness Analysis",
    difficulty: "Intermediate",
    description: "Analyze whether higher discounts lead to higher order volume.",
    explanation: "Compare discount_amount with order frequency or total revenue.",
    scenario: "Marketing evaluates promotions.",
    useCases: ["Pricing strategy", "Promotions"],
    hint: "Group by discount buckets",
    starterQuery: "SELECT discount_amount, COUNT(*) as orders\nFROM orders\nGROUP BY discount_amount;",
    expectedColumns: ["discount_amount", "orders"],
    expectedRowCount: 6,
    solutionQuery: "SELECT\n    CASE\n        WHEN discount_amount = 0 THEN 'No Discount'\n        WHEN discount_amount <= 10 THEN 'Low Discount'\n        WHEN discount_amount <= 50 THEN 'Medium Discount'\n        ELSE 'High Discount'\n    END AS discount_bucket,\n    COUNT(order_id) AS total_orders,\n    ROUND(AVG(total_amount), 2) AS avg_order_value,\n    ROUND(SUM(total_amount), 2) AS total_revenue\nFROM orders\nGROUP BY discount_bucket\nORDER BY total_orders DESC;",
    slug: "discount-effectiveness-analysis",
    seoTitle: "Marketing SQL: Evaluating Promo Code Volume & Elasticity Tiers",
    metaDescription: "Learn to build user-defined categorization bands using CASE operations to evaluate promotional elasticity across volume thresholds.",
    tags: ["Data Binning", "Promotional Mechanics", "Pricing Strategy", "E-commerce Growth"]
  },
  
  {
    id: 8,
    title: "Product Profitability Analysis",
    difficulty: "Intermediate",
    description: "Identify products with low or negative profit margins.",
    explanation: "Use price and cost_price with order_items quantity.",
    scenario: "Finance tracks profitability.",
    useCases: ["Profit analysis", "Cost control"],
    hint: "JOIN products + order_items",
    starterQuery: "SELECT p.product_id, SUM((p.price - p.cost_price)*oi.quantity) as profit\nFROM products p JOIN order_items oi ON p.product_id = oi.product_id\nGROUP BY p.product_id;",
    expectedColumns: ["product_id", "profit"],
    expectedRowCount: 5,
    solutionQuery: "SELECT\n    p.product_id,\n    p.product_name,\n    ROUND(SUM(oi.total_price), 2) AS revenue,\n    ROUND(SUM(p.cost_price * oi.quantity), 2) AS total_cost,\n    ROUND(\n        SUM(oi.total_price) - SUM(p.cost_price * oi.quantity),\n        2\n    ) AS profit\nFROM products p\nJOIN order_items oi\n    ON p.product_id = oi.product_id\nGROUP BY p.product_id, p.product_name\nORDER BY profit ASC;",
    slug: "product-profitability-analysis",
    seoTitle: "SQL Margins Tracking: Auditing Direct Product Net Unit Profits",
    metaDescription: "Uncover leaking gross margins. Join catalog pricing details against historical order quantity logs to extract true enterprise net profits.",
    tags: ["Margin Extraction", "Cost Accounting", "Catalog Optimization", "Revenue Health"]
  },
  
  {
    id: 9,
    title: "Customer Verification Impact",
    difficulty: "Intermediate",
    description: "Check whether verified customers spend more than non-verified ones.",
    explanation: "Compare AVG(total_amount) grouped by is_verified.",
    scenario: "Risk team evaluating trust signals.",
    useCases: ["Segmentation", "Risk analysis"],
    hint: "GROUP BY is_verified",
    starterQuery: "SELECT c.is_verified, AVG(o.total_amount)\nFROM customers c JOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.is_verified;",
    expectedColumns: ["is_verified", "avg"],
    expectedRowCount: 2,
    solutionQuery: "SELECT\n    c.is_verified,\n    ROUND(AVG(o.total_amount), 2) AS avg_order_value,\n    ROUND(SUM(o.total_amount), 2) AS total_revenue,\n    COUNT(DISTINCT c.customer_id) AS total_customers\nFROM customers c\nJOIN orders o\n    ON c.customer_id = o.customer_id\nGROUP BY c.is_verified;",
    slug: "customer-verification-impact",
    seoTitle: "SQL Trust Metrics: Quantifying Verification Spending Uplift",
    metaDescription: "Evaluate security validation programs. Group transactional behaviors by profile validation indicators to check average order sizes.",
    tags: ["Trust Signaling", "Behavioral Variance", "A/B Profiling", "Risk Management"]
  },
  
  {
    id: 10,
    title: "Delivery Partner Rating vs Performance",
    difficulty: "Intermediate+",
    description: "Analyze if higher-rated delivery partners actually deliver faster.",
    explanation: "Compare rating with delivery time.",
    scenario: "Operations evaluating partner quality.",
    useCases: ["Performance analysis", "SLA"],
    hint: "JOIN delivery_partners + orders",
    starterQuery: "SELECT d.rating, AVG(julianday(o.delivered_date) - julianday(o.order_date)) as avg_time\nFROM delivery_partners d JOIN orders o ON d.delivery_partner_id = o.delivery_partner_id\nGROUP BY d.rating;",
    expectedColumns: ["rating", "avg_time"],
    expectedRowCount: 5,
    solutionQuery: "SELECT\n    d.delivery_partner_id,\n    d.partner_name,\n    d.rating,\n    ROUND(\n        AVG(julianday(o.delivered_date) - julianday(o.order_date)),\n        2\n    ) AS avg_delivery_time,\n    COUNT(o.order_id) AS total_deliveries\nFROM delivery_partners d\nJOIN orders o\n    ON d.delivery_partner_id = o.delivery_partner_id\nWHERE o.delivered_date IS NOT NULL\nGROUP BY d.delivery_partner_id, d.partner_name, d.rating\nORDER BY d.rating DESC, avg_delivery_time ASC;",
    slug: "delivery-partner-rating-vs-performance",
    seoTitle: "Evaluating Feedback Scores Against Courier Transit Speeds via SQL",
    metaDescription: "Test customer sentiment integrity. Correlate delivery partner subjective reviews against precise time tracking parameters via join groupings.",
    tags: ["Sentiment Correlation", "Transit Analytics", "Performance Benchmark", "Multi-Key Sort"]
  },
  
  {
    id: 11,
    title: "Customer Acquisition Channel Quality",
    difficulty: "Intermediate+",
    description: "Find which acquisition_channel brings highest lifetime value customers.",
    explanation: "Aggregate revenue by acquisition_channel.",
    scenario: "Marketing budget allocation.",
    useCases: ["Attribution", "ROI"],
    hint: "GROUP BY acquisition_channel",
    starterQuery: "SELECT c.acquisition_channel, SUM(o.total_amount) as revenue\nFROM customers c JOIN orders o ON c.customer_id = o.customer_id\nGROUP BY c.acquisition_channel;",
    expectedColumns: ["acquisition_channel", "revenue"],
    expectedRowCount: 4,
    solutionQuery: "SELECT\n    c.acquisition_channel,\n    COUNT(DISTINCT c.customer_id) AS total_customers,\n    ROUND(SUM(o.total_amount), 2) AS total_revenue,\n    ROUND(AVG(o.total_amount), 2) AS avg_order_value,\n    ROUND(AVG(c.lifetime_value), 2) AS avg_lifetime_value\nFROM customers c\nJOIN orders o\n    ON c.customer_id = o.customer_id\nGROUP BY c.acquisition_channel\nORDER BY avg_lifetime_value DESC;",
    slug: "customer-acquisition-channel-quality",
    seoTitle: "SQL Attribution Models: Ranking Marketing Acquisition Channels",
    metaDescription: "Optimize performance spend allocation. Query customer demographic profiles alongside purchase history to highlight top-performing pipeline drivers.",
    tags: ["Attribution Logic", "Channel Performance", "E-commerce LTV", "Budget Optimization"]
  },
  
  {
    id: 12,
    title: "Payment Retry Behavior",
    difficulty: "Intermediate+",
    description: "Analyze how many attempts are needed before a successful payment.",
    explanation: "Track attempt_number and payment_status.",
    scenario: "Payments optimization.",
    useCases: ["Retry logic", "Conversion"],
    hint: "Filter success and group by attempt_number",
    starterQuery: "SELECT attempt_number, COUNT(*)\nFROM payments WHERE payment_status='success'\nGROUP BY attempt_number;",
    expectedColumns: ["attempt_number", "count"],
    expectedRowCount: 4,
    solutionQuery: "SELECT\n    attempt_number,\n    COUNT(*) AS successful_payments,\n    ROUND(SUM(amount), 2) AS recovered_revenue,\n    ROUND(\n        COUNT(*) * 100.0 /\n        SUM(COUNT(*)) OVER (),\n        2\n    ) AS success_distribution_pct\nFROM payments\nWHERE payment_status = 'success'\nGROUP BY attempt_number\nORDER BY attempt_number;",
    slug: "payment-retry-behavior",
    seoTitle: "Fintech SQL Queries: Analyzing Payment Retry Recovery Curves",
    metaDescription: "Examine checkout optimization tracks. Implement empty-window aggregation ratios to isolate recovered revenue across escalating checkout steps.",
    tags: ["Window Totals", "Recovery Optimization", "Friction Analysis", "Fintech Scaling"]
  },
  
  {
    id: 13,
    title: "Inactive Customer Revenue Loss",
    difficulty: "Intermediate+",
    description: "Estimate revenue lost from customers who became inactive.",
    explanation: "Compare past vs recent activity.",
    scenario: "Retention strategy.",
    useCases: ["Churn analysis", "Revenue"],
    hint: "Use last_order_date",
    starterQuery: "SELECT customer_id, last_order_date\nFROM customers;",
    expectedColumns: ["customer_id", "last_order_date"],
    expectedRowCount: 5,
    solutionQuery: "SELECT\n    c.customer_id,\n    c.customer_name,\n    c.last_order_date,\n    ROUND(SUM(o.total_amount), 2) AS historical_revenue,\n    ROUND(\n        julianday('now') - julianday(c.last_order_date),\n        2\n    ) AS inactive_days,\n    CASE\n        WHEN julianday('now') - julianday(c.last_order_date) > 90 THEN 'High Risk'\n        WHEN julianday('now') - julianday(c.last_order_date) > 60 THEN 'Medium Risk'\n        ELSE 'Low Risk'\n    END AS churn_risk\nFROM customers c\nJOIN orders o\n    ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.customer_name, c.last_order_date\nORDER BY inactive_days DESC;",
    slug: "inactive-customer-revenue-loss",
    seoTitle: "Quantifying Sleeping Account Revenue Leakage via SQL Logs",
    metaDescription: "Calculate the explicit financial impact of dormant subscriber files. Apply cross-table time deltas to gauge top historical users dropping off.",
    tags: ["Dormancy Audits", "Revenue Projections", "Account Maintenance", "Subscriber Metrics"]
  },
  
  {
    id: 14,
    title: "Feedback Issue Category Impact",
    difficulty: "Intermediate+",
    description: "Identify which issue_category leads to lowest ratings.",
    explanation: "Aggregate rating by issue_category.",
    scenario: "Customer experience improvement.",
    useCases: ["Feedback analysis", "Quality"],
    hint: "GROUP BY issue_category",
    starterQuery: "SELECT issue_category, AVG(rating)\nFROM feedback GROUP BY issue_category;",
    expectedColumns: ["issue_category", "avg"],
    expectedRowCount: 4,
    solutionQuery: "SELECT\n    issue_category,\n    ROUND(AVG(rating), 2) AS avg_rating,\n    COUNT(feedback_id) AS total_feedback,\n    ROUND(\n        COUNT(CASE WHEN rating <= 2 THEN 1 END) * 100.0 /\n        COUNT(feedback_id),\n        2\n    ) AS negative_feedback_pct\nFROM feedback\nGROUP BY issue_category\nORDER BY avg_rating ASC;",
    slug: "feedback-issue-category-impact",
    seoTitle: "SQL Sentiment Analysis: Tracking Issue Category Severity",
    metaDescription: "Locate product and support structural errors. Group complaints using conditional counting mechanisms to isolate highest critical-failure frequencies.",
    tags: ["Sentiment Scoring", "Conditional Filtering", "Quality Assurance", "Customer Success"]
  },
  
  {
    id: 15,
    title: "Order Cancellation Patterns",
    difficulty: "Intermediate+",
    description: "Analyze why orders are being cancelled.",
    explanation: "Group by cancellation_reason.",
    scenario: "Operations reducing cancellations.",
    useCases: ["Root cause", "Operations"],
    hint: "GROUP BY cancellation_reason",
    starterQuery: "SELECT cancellation_reason, COUNT(*)\nFROM orders WHERE order_status='cancelled'\nGROUP BY cancellation_reason;",
    expectedColumns: ["cancellation_reason", "count"],
    expectedRowCount: 4,
    solutionQuery: "SELECT\n    cancellation_reason,\n    COUNT(order_id) AS cancelled_orders,\n    ROUND(SUM(total_amount), 2) AS cancelled_revenue,\n    ROUND(AVG(total_amount), 2) AS avg_order_value\nFROM orders\nWHERE order_status = 'cancelled'\nGROUP BY cancellation_reason\nORDER BY cancelled_orders DESC;",
    slug: "order-cancellation-patterns",
    seoTitle: "E-commerce SQL: Profiling Order Cancellation Value Deficits",
    metaDescription: "Trace abandoned transactional flows. Aggregate non-delivered checkout logs to determine exactly which justification flags carry maximum fiscal exposure.",
    tags: ["Fulfillment Metrics", "Revenue Interruption", "Categorical Grouping", "Operational Auditing"]
  },
  
  {
    id: 16,
    title: "Revenue per Delivery Partner",
    difficulty: "Advanced",
    description: "Calculate revenue handled by each delivery partner.",
    explanation: "Join orders and aggregate total_amount.",
    scenario: "Partner evaluation.",
    useCases: ["Performance", "Revenue"],
    hint: "GROUP BY delivery_partner_id",
    starterQuery: "SELECT delivery_partner_id, SUM(total_amount)\nFROM orders GROUP BY delivery_partner_id;",
    expectedColumns: ["delivery_partner_id", "sum"],
    expectedRowCount: 4,
    solutionQuery: "SELECT\n    dp.delivery_partner_id,\n    dp.partner_name,\n    COUNT(o.order_id) AS total_orders,\n    ROUND(SUM(o.total_amount), 2) AS total_revenue,\n    ROUND(AVG(o.total_amount), 2) AS avg_order_value\nFROM delivery_partners dp\nJOIN orders o\n    ON dp.delivery_partner_id = o.delivery_partner_id\nGROUP BY dp.delivery_partner_id, dp.partner_name\nORDER BY total_revenue DESC;",
    slug: "revenue-per-delivery-partner",
    seoTitle: "SQL Vendor Operations: Tracking Partner Pipeline Exposure",
    metaDescription: "Evaluate supply chain contractor scale. Combine shipping vendor identifiers with total value sums to map concentrations in asset allocation paths.",
    tags: ["Vendor Management", "Pipeline Allocation", "Distribution Risks", "Logistics Scaling"]
  },
  
  {
    id: 17,
    title: "Top Repeat Customers",
    difficulty: "Advanced",
    slug: "top-repeat-customers",
    seoTitle: "Advanced SQL | Identify Repeat Customers",
    metaDescription: "Analyze customer purchase frequency using SQL aggregation to identify the most loyal customers.",
    tags: [
      "Customer Analytics",
      "GROUP BY",
      "Aggregation",
      "Business Scenario"
    ],
    description: "Identify customers who have placed the highest number of orders.",
    explanation: "Repeat customers are valuable for retention analysis. Count the number of orders placed by each customer and rank them from highest to lowest.",
    scenario: "The marketing team wants to reward loyal customers who purchase frequently.",
    useCases: [
      "Customer retention",
      "Loyalty programs",
      "Business analytics"
    ],
    hint: "Count orders for each customer and sort in descending order.",
    starterQuery: `SELECT
  customer_id,
  COUNT(*) AS total_orders
  FROM orders
  GROUP BY customer_id;`,
    expectedColumns: [
      "customer_id",
      "customer_name",
      "total_orders"
    ],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: `SELECT
  c.customer_id,
  c.customer_name,
  COUNT(o.order_id) AS total_orders
  FROM customers c
  JOIN orders o
  ON c.customer_id = o.customer_id
  GROUP BY
  c.customer_id,
  c.customer_name
  ORDER BY total_orders DESC,
  c.customer_id
  LIMIT 10;`
  },

  {
    id: 18,
    title: "High Value Product Dependency",
    difficulty: "Advanced",
    description: "Check if a small number of products contribute majority of revenue.",
    explanation: "Pareto analysis on products.",
    scenario: "Revenue concentration risk.",
    useCases: ["Pareto", "Risk"],
    hint: "Cumulative revenue",
    starterQuery: "SELECT product_id FROM order_items;",
    expectedColumns: ["product_id"],
    expectedRowCount: 5,
    solutionQuery: "WITH product_revenue AS (\n    SELECT\n        p.product_id,\n        p.product_name,\n        ROUND(SUM(oi.total_price), 2) AS revenue\n    FROM products p\n    JOIN order_items oi\n        ON p.product_id = oi.product_id\n    GROUP BY p.product_id, p.product_name\n),\nrevenue_distribution AS (\n    SELECT\n        *,\n        ROUND(\n            SUM(revenue) OVER (\n                ORDER BY revenue DESC\n            ) * 100.0 /\n            SUM(revenue) OVER (),\n            2\n        ) AS cumulative_revenue_pct\n    FROM product_revenue\n)\nSELECT\n    product_id,\n    product_name,\n    revenue,\n    cumulative_revenue_pct\nFROM revenue_distribution\nWHERE cumulative_revenue_pct <= 80\nORDER BY revenue DESC;",
    slug: "high-value-product-dependency",
    seoTitle: "Building a 80-20 Pareto Revenue Distribution Model in SQL",
    metaDescription: "Detect portfolio catalog concentration vulnerabilities. Utilize window frame cumulative calculations to extract items powering core gross earnings channels.",
    tags: ["Pareto Analytics", "Cumulative Sums", "Concentration Risk", "Catalog Rationalization"]
  },
  
  {
    id: 19,
    title: "Customer Geo Revenue Analysis",
    difficulty: "Advanced",
    description: "Analyze revenue distribution by city, state, and country.",
    explanation: "Group by multiple geography fields.",
    scenario: "Geo expansion strategy.",
    useCases: ["Geo analysis", "Strategy"],
    hint: "GROUP BY city, state, country",
    starterQuery: "SELECT city, SUM(total_amount)\nFROM customers c JOIN orders o ON c.customer_id = o.customer_id\nGROUP BY city;",
    expectedColumns: ["city", "sum"],
    expectedRowCount: 6,
    solutionQuery: "SELECT\n    c.country,\n    c.state,\n    c.city,\n    COUNT(DISTINCT c.customer_id) AS total_customers,\n    COUNT(o.order_id) AS total_orders,\n    ROUND(SUM(o.total_amount), 2) AS total_revenue,\n    ROUND(AVG(o.total_amount), 2) AS avg_order_value\nFROM customers c\nJOIN orders o\n    ON c.customer_id = o.customer_id\nGROUP BY c.country, c.state, c.city\nORDER BY total_revenue DESC;",
    slug: "customer-geo-revenue-analysis",
    seoTitle: "Geographical Hierarchical Grouping & Territory Yield in SQL",
    metaDescription: "Examine geographic expansion options. Apply multi-layered sorting matrices to aggregate transaction scale from country down to individual city tiers.",
    tags: ["Territory Analysis", "Hierarchical Grouping", "Market Penetration", "Spatial Breakdown"]
  },
  
  {
    id: 20,
    title: "Product Category Performance Over Time",
    difficulty: "Advanced",
    description: "Track category-level revenue trends month-over-month.",
    explanation: "Join orders, order_items, products.",
    scenario: "Product strategy.",
    useCases: ["Trend analysis", "Planning"],
    hint: "strftime('%Y-%m')",
    starterQuery: "SELECT strftime('%Y-%m', o.order_date), p.category, SUM(oi.total_price)\nFROM orders o JOIN order_items oi ON o.order_id=oi.order_id JOIN products p ON oi.product_id=p.product_id\nGROUP BY 1,2;",
    expectedColumns: ["month", "category", "revenue"],
    expectedRowCount: 10,
    solutionQuery: "WITH monthly_category_revenue AS (\n    SELECT\n        strftime('%Y-%m', o.order_date) AS revenue_month,\n        p.category,\n        ROUND(SUM(oi.total_price), 2) AS revenue\n    FROM orders o\n    JOIN order_items oi\n        ON o.order_id = oi.order_id\n    JOIN products p\n        ON oi.product_id = p.product_id\n    GROUP BY revenue_month, p.category\n)\nSELECT\n    revenue_month,\n    category,\n    revenue,\n    ROUND(\n        revenue - LAG(revenue) OVER (\n            PARTITION BY category\n            ORDER BY revenue_month\n        ),\n        2\n    ) AS mom_growth\nFROM monthly_category_revenue\nORDER BY revenue_month, revenue DESC;",
    slug: "product-category-performance-over-time",
    seoTitle: "SQL Window Functions: Calculating MoM Catalog Growth Trends",
    metaDescription: "Construct clean time-series trend tracking frameworks. Apply date formatting blocks with windowed partitions to track specific department growth shifts.",
    tags: ["Time Series", "MoM Scaling Delta", "Window Functions", "Inventory Planning"]
  },
  
  {
    id: 21,
    title: "Customer Feedback vs Repeat Orders",
    difficulty: "Advanced",
    description: "Check if customers giving high ratings tend to reorder more.",
    explanation: "Join feedback and orders, compare counts.",
    scenario: "Customer satisfaction impact.",
    useCases: ["Retention", "Experience"],
    hint: "GROUP BY rating",
    starterQuery: "SELECT rating, COUNT(*) FROM feedback GROUP BY rating;",
    expectedColumns: ["rating", "count"],
    expectedRowCount: 5,
    solutionQuery: "SELECT\n    f.rating,\n    COUNT(DISTINCT f.customer_id) AS total_customers,\n    COUNT(o.order_id) AS total_orders,\n    ROUND(\n        COUNT(o.order_id) * 1.0 /\n        COUNT(DISTINCT f.customer_id),\n        2\n    ) AS avg_orders_per_customer\nFROM feedback f\nJOIN orders o\n    ON f.customer_id = o.customer_id\nGROUP BY f.rating\nORDER BY f.rating DESC;",
    slug: "customer-feedback-vs-repeat-orders",
    seoTitle: "Correlating CSAT Feedback Tiers Against Order Retention via SQL",
    metaDescription: "Quantify the business value of user satisfaction. Join qualitative review parameters directly to transactional frequencies to track retention uplift.",
    tags: ["CSAT Correlation", "User Engagement Loops", "Relational Joins", "Retention Mechanics"]
  },
  
  {
    id: 22,
    title: "Currency Impact on Revenue",
    difficulty: "Advanced",
    description: "Analyze how revenue differs across currencies.",
    explanation: "Group by currency in orders.",
    scenario: "Global expansion.",
    useCases: ["Finance", "Global"],
    hint: "GROUP BY currency",
    starterQuery: "SELECT currency, SUM(total_amount) FROM orders GROUP BY currency;",
    expectedColumns: ["currency", "sum"],
    expectedRowCount: 3,
    solutionQuery: "SELECT\n    currency,\n    COUNT(order_id) AS total_orders,\n    ROUND(SUM(total_amount), 2) AS total_revenue,\n    ROUND(AVG(total_amount), 2) AS avg_order_value,\n    ROUND(MAX(total_amount), 2) AS highest_order_value\nFROM orders\nGROUP BY currency\nORDER BY total_revenue DESC;",
    slug: "currency-impact-on-revenue",
    seoTitle: "FX & Localization SQL: Profiling Multi-Currency Invoice Distribution",
    metaDescription: "Examine international marketplace operations. Map billing currency parameters across transaction values to capture global sizing insights.",
    tags: ["FX Analytics", "Localization Audits", "E-commerce Optimization", "Global Markets"]
  },
  
  {
    id: 23,
    title: "Customer Signup to First Order Lag",
    difficulty: "Advanced",
    description: "Measure how long it takes customers to place their first order after signup.",
    explanation: "Compare created_date and MIN(order_date).",
    scenario: "Conversion funnel.",
    useCases: ["Conversion", "Growth"],
    hint: "MIN(order_date)",
    starterQuery: "SELECT customer_id FROM customers;",
    expectedColumns: ["customer_id"],
    expectedRowCount: 5,
    solutionQuery: "SELECT\n    c.customer_id,\n    c.customer_name,\n    c.created_date,\n    MIN(o.order_date) AS first_order_date,\n    ROUND(\n        julianday(MIN(o.order_date)) - julianday(c.created_date),\n        2\n    ) AS signup_to_order_days\nFROM customers c\nJOIN orders o\n    ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.customer_name, c.created_date\nORDER BY signup_to_order_days ASC;",
    slug: "customer-signup-to-first-order-lag",
    seoTitle: "SQL Funnel Velocities: Measuring Activation Lag Timelines",
    metaDescription: "Track lifecycle conversion bottlenecks. Join account registration logs against absolute earliest checkout instances to monitor activation friction.",
    tags: ["Funnel Speeds", "First Aggregates", "Activation Latency", "Onboarding Performance"]
  },
  
  {
    id: 24,
    title: "Delivery Partner Workload Imbalance",
    difficulty: "Advanced",
    description: "Identify imbalance in order distribution across delivery partners.",
    explanation: "Compare counts vs average.",
    scenario: "Operations optimization.",
    useCases: ["Workload", "Efficiency"],
    hint: "COUNT vs AVG",
    starterQuery: "SELECT delivery_partner_id, COUNT(*) FROM orders GROUP BY delivery_partner_id;",
    expectedColumns: ["delivery_partner_id", "count"],
    expectedRowCount: 4,
    solutionQuery: "WITH partner_orders AS (\n    SELECT\n        delivery_partner_id,\n        COUNT(order_id) AS total_orders\n    FROM orders\n    GROUP BY delivery_partner_id\n),\navg_orders AS (\n    SELECT AVG(total_orders) AS avg_order_count\n    FROM partner_orders\n)\nSELECT\n    p.delivery_partner_id,\n    p.total_orders,\n    ROUND(a.avg_order_count, 2) AS avg_order_count,\n    ROUND(\n        p.total_orders - a.avg_order_count,\n        2\n    ) AS workload_difference\nFROM partner_orders p\nCROSS JOIN avg_orders a\nORDER BY workload_difference DESC;",
    slug: "delivery-partner-workload-imbalance",
    seoTitle: "Logistics Load Distribution Auditing via SQL Cross Joins",
    metaDescription: "Detect supply chain dispatch capacity stress points. Contrast isolated individual partner loads against uniform baseline averages using cross-evaluation schemas.",
    tags: ["Cross Join Evaluation", "Workload Disparity", "Capacity Planning", "Dispatch Efficiency"]
  },
  
  {
    id: 25,
    title: "Payment Method Success Rate",
    difficulty: "Advanced",
    description: "Compare success rates across payment methods.",
    explanation: "Conditional aggregation.",
    scenario: "Payments optimization.",
    useCases: ["Conversion", "Payments"],
    hint: "CASE WHEN",
    starterQuery: "SELECT payment_method, COUNT(*) FROM payments GROUP BY payment_method;",
    expectedColumns: ["payment_method", "count"],
    expectedRowCount: 4,
    solutionQuery: "SELECT\n    payment_method,\n    COUNT(payment_id) AS total_transactions,\n    SUM(CASE WHEN payment_status = 'success' THEN 1 ELSE 0 END) AS successful_transactions,\n    ROUND(\n        SUM(CASE WHEN payment_status = 'success' THEN 1 ELSE 0 END) * 100.0 /\n        COUNT(payment_id),\n        2\n    ) AS success_rate_pct\nFROM payments\nGROUP BY payment_method\nORDER BY success_rate_pct DESC;",
    slug: "payment-method-success-rate",
    seoTitle: "Fintech Aggregations: Calculating Authorization Success Rates in SQL",
    metaDescription: "Examine checkout optimization tracks. Implement complex filter logic alongside status trackers to calculate gateway performance trends.",
    tags: ["Fintech Core", "Conditional Aggregations", "Gateway Integrity", "Success Ratios"]
  },
  
  {
    id: 26,
    title: "Customer Type Revenue Contribution",
    difficulty: "Advanced+",
    description: "Analyze revenue contribution by customer_type.",
    explanation: "Join customers and orders.",
    scenario: "Segmentation strategy.",
    useCases: ["Segmentation", "Revenue"],
    hint: "GROUP BY customer_type",
    starterQuery: "SELECT customer_type, SUM(total_amount) FROM customers c JOIN orders o ON c.customer_id=o.customer_id GROUP BY customer_type;",
    expectedColumns: ["customer_type", "sum"],
    expectedRowCount: 4,
    solutionQuery: "SELECT\n    c.customer_type,\n    COUNT(DISTINCT c.customer_id) AS total_customers,\n    COUNT(o.order_id) AS total_orders,\n    ROUND(SUM(o.total_amount), 2) AS total_revenue,\n    ROUND(AVG(o.total_amount), 2) AS avg_order_value,\n    ROUND(\n        SUM(o.total_amount) * 100.0 /\n        SUM(SUM(o.total_amount)) OVER (),\n        2\n    ) AS revenue_contribution_pct\nFROM customers c\nJOIN orders o\n    ON c.customer_id = o.customer_id\nGROUP BY c.customer_type\nORDER BY total_revenue DESC;",
    slug: "customer-type-revenue-contribution",
    seoTitle: "SQL CRM Insights: Extracting Cohort Revenue Share Ratios",
    metaDescription: "Build dynamic B2B vs B2C segment tracking frameworks. Deploy analytical total distributions over partition scales to establish relative portfolio weights.",
    tags: ["Window Totals", "Revenue Profiles", "Portfolio Concentration", "Strategic Segmenting"]
  },
  
  {
    id: 27,
    title: "Product Performance Since Launch",
    difficulty: "Advanced+",
    slug: "product-performance-since-launch",
    seoTitle: "Advanced SQL | Product Performance Since Launch",
    metaDescription: "Analyze product performance by combining product age, sales volume, and revenue using SQL joins and aggregations.",
    tags: [
      "Product Analytics",
      "Revenue Analysis",
      "Aggregation",
      "Business Scenario"
    ],
    description: "Analyze how each product has performed since it was introduced by calculating its age, total units sold, and total revenue.",
    explanation: "Join the products and order_items tables to calculate sales metrics for every product. Instead of using today's date, calculate the product age relative to the newest product in the catalog, ensuring consistent results across datasets.",
    scenario: "The product team wants to identify which products have generated the highest revenue since launch while considering how long they have been available.",
    useCases: [
      "Product performance",
      "Catalog optimization",
      "Business analytics"
    ],
    hint: "Use MAX(created_at) to determine the latest product date and calculate each product's age.",
    starterQuery: `SELECT
  product_id,
  product_name,
  created_at
  FROM products;`,
    expectedColumns: [
      "product_id",
      "product_name",
      "product_age_days",
      "total_units_sold",
      "total_revenue"
    ],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: `WITH latest_product AS (
      SELECT MAX(created_at) AS latest_created_at
      FROM products
  )
  SELECT
      p.product_id,
      p.product_name,
      CAST(julianday(lp.latest_created_at) - julianday(p.created_at) AS INTEGER) AS product_age_days,
      COALESCE(SUM(oi.quantity),0) AS total_units_sold,
      ROUND(COALESCE(SUM(oi.total_price),0),2) AS total_revenue
  FROM products p
  CROSS JOIN latest_product lp
  LEFT JOIN order_items oi
      ON p.product_id = oi.product_id
  GROUP BY
      p.product_id,
      p.product_name,
      p.created_at,
      lp.latest_created_at
  ORDER BY
      total_revenue DESC,
      total_units_sold DESC
  LIMIT 10;`
  },
  {
    id: 28,
    title: "Customer Login vs Purchase Behavior",
    difficulty: "Advanced+",
    description: "Analyze if frequent logins lead to higher purchases.",
    explanation: "Compare last_login_date and order activity.",
    scenario: "Engagement analysis.",
    useCases: ["Behavior", "Conversion"],
    hint: "JOIN customers + orders",
    starterQuery: "SELECT customer_id, last_login_date FROM customers;",
    expectedColumns: ["customer_id", "last_login_date"],
    expectedRowCount: 5,
    solutionQuery: "SELECT\n    c.customer_id,\n    c.customer_name,\n    c.last_login_date,\n    COUNT(o.order_id) AS total_orders,\n    ROUND(SUM(o.total_amount), 2) AS total_spend,\n    ROUND(AVG(o.total_amount), 2) AS avg_order_value\nFROM customers c\nLEFT JOIN orders o\n    ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.customer_name, c.last_login_date\nORDER BY total_spend DESC;",
    slug: "customer-login-vs-purchase-behavior",
    seoTitle: "SQL Behavioral Mapping: Correlating App Activity with Orders",
    metaDescription: "Audit platform engagement loops. Formulate loose relational left-joins cross-referencing login histories against total conversion scale.",
    tags: ["Engagement Mapping", "Left Join Verification", "User Conversions", "Behavioral Auditing"]
  },
  
  {
    id: 29,
    title: "Delivery Time Analysis",
    difficulty: "Advanced+",
    slug: "delivery-time-analysis",
    seoTitle: "Advanced SQL | Delivery Time Analysis",
    metaDescription: "Calculate delivery turnaround time for completed orders using SQL date functions.",
    tags: [
      "Date Functions",
      "Operations Analytics",
      "Delivery Performance",
      "Business Scenario"
    ],
    description: "Calculate the number of days taken to deliver each completed order.",
    explanation: "Use the julianday() function to calculate the difference between the order date and the delivered date.",
    scenario: "The operations team wants to identify orders with the longest delivery times to improve customer satisfaction.",
    useCases: [
      "Delivery performance",
      "SLA monitoring",
      "Operations reporting"
    ],
    hint: "Calculate the difference between delivered_date and order_date using julianday().",
    starterQuery: "SELECT order_id, order_date, delivered_date FROM orders;",
    expectedColumns: [
      "order_id",
      "order_date",
      "delivered_date",
      "delivery_days"
    ],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "SELECT\n    order_id,\n    order_date,\n    delivered_date,\n    ROUND(julianday(delivered_date) - julianday(order_date),2) AS delivery_days\nFROM orders\nWHERE delivered_date IS NOT NULL\nORDER BY delivery_days DESC\nLIMIT 10;"
  },
  
  {
    id: 30,
    title: "Top Revenue Categories",
    difficulty: "Advanced+",
    description: "Identify which product categories generate the highest revenue.",
    explanation: "Join orders, order_items, and products to calculate revenue by category.",
    scenario: "The management team wants to know which product categories contribute the most to overall sales.",
    useCases: ["Revenue analysis", "Category performance", "Business reporting"],
    hint: "Join order_items with products and aggregate total_price by category.",
    starterQuery: "SELECT category FROM products;",
    expectedColumns: ["category", "total_revenue", "total_units_sold"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "SELECT\n    p.category,\n    ROUND(SUM(oi.total_price),2) AS total_revenue,\n    SUM(oi.quantity) AS total_units_sold\nFROM order_items oi\nJOIN products p\n    ON oi.product_id = p.product_id\nGROUP BY p.category\nORDER BY total_revenue DESC;",
    slug: "top-revenue-categories",
    seoTitle: "SQL Category Revenue Analysis | Business Intelligence",
    metaDescription: "Analyze revenue contribution by product category using SQL joins and aggregations.",
    tags: ["Revenue Analysis", "Category Analytics", "GROUP BY", "Business Intelligence"]
  },
  {
    id: 31,
    title: "Top Customers by Lifetime Revenue",
    difficulty: "Advanced+",
    description: "Identify the customers who generated the highest revenue.",
    explanation: "Aggregate total_amount for every customer.",
    scenario: "The sales team wants to identify VIP customers for loyalty rewards.",
    useCases: ["Customer analytics", "Loyalty programs", "Revenue reporting"],
    hint: "Join customers with orders and SUM(total_amount).",
    starterQuery: "SELECT customer_id FROM customers;",
    expectedColumns: ["customer_id", "customer_name", "total_orders", "total_revenue"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "SELECT\n    c.customer_id,\n    c.customer_name,\n    COUNT(o.order_id) AS total_orders,\n    ROUND(SUM(o.total_amount),2) AS total_revenue\nFROM customers c\nJOIN orders o\n    ON c.customer_id = o.customer_id\nGROUP BY c.customer_id, c.customer_name\nORDER BY total_revenue DESC\nLIMIT 10;",
    slug: "top-customers-lifetime-revenue",
    seoTitle: "SQL Customer Lifetime Revenue Analysis",
    metaDescription: "Find the customers generating the highest revenue using SQL aggregations.",
    tags: ["Customer Analytics", "Revenue Analysis", "Aggregation", "Business Intelligence"]
  },
  {
    id: 32,
    title: "Delivery Partner Performance",
    difficulty: "Advanced+",
    description: "Evaluate delivery partners based on completed deliveries and generated revenue.",
    explanation: "Join delivery partners with orders and calculate deliveries and revenue.",
    scenario: "Operations wants to identify the best-performing delivery partners.",
    useCases: ["Delivery analytics", "Operations reporting", "Performance monitoring"],
    hint: "Join delivery_partners and orders using delivery_partner_id.",
    starterQuery: "SELECT partner_name FROM delivery_partners;",
    expectedColumns: ["delivery_partner_id", "partner_name", "total_deliveries", "total_revenue"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "SELECT\n    dp.delivery_partner_id,\n    dp.partner_name,\n    COUNT(o.order_id) AS total_deliveries,\n    ROUND(SUM(o.total_amount),2) AS total_revenue\nFROM delivery_partners dp\nJOIN orders o\n    ON dp.delivery_partner_id = o.delivery_partner_id\nGROUP BY dp.delivery_partner_id, dp.partner_name\nORDER BY total_revenue DESC\nLIMIT 10;",
    slug: "delivery-partner-performance",
    seoTitle: "SQL Delivery Partner Performance Dashboard",
    metaDescription: "Analyze delivery partner performance using completed deliveries and revenue.",
    tags: ["Delivery Analytics", "Operations", "Performance Analysis", "GROUP BY"]
  },
  {
    id: 33,
    title: "Payment Method Performance",
    difficulty: "Advanced+",
    description: "Analyze how much revenue is collected through each payment method.",
    explanation: "Aggregate payment amounts by payment method.",
    scenario: "The finance team wants to understand customer payment preferences.",
    useCases: ["Payment analysis", "Financial reporting", "Business intelligence"],
    hint: "Group by payment_method.",
    starterQuery: "SELECT payment_method FROM payments;",
    expectedColumns: ["payment_method", "total_transactions", "total_amount"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "SELECT\n    payment_method,\n    COUNT(payment_id) AS total_transactions,\n    ROUND(SUM(amount),2) AS total_amount\nFROM payments\nGROUP BY payment_method\nORDER BY total_amount DESC;",
    slug: "payment-method-performance",
    seoTitle: "SQL Payment Method Performance Analysis",
    metaDescription: "Compare payment methods using SQL aggregations and business reporting queries.",
    tags: ["Payment Analytics", "Finance", "GROUP BY", "Business Intelligence"]
  },
  {
    id: 34,
    title: "Top Selling Products",
    difficulty: "Advanced+",
    description: "Identify the products that generate the highest sales revenue.",
    explanation: "Join products with order_items and aggregate revenue and quantity sold.",
    scenario: "The product team wants to identify best-selling products for inventory planning.",
    useCases: ["Product analytics", "Inventory planning", "Sales reporting"],
    hint: "Join products with order_items and SUM(total_price).",
    starterQuery: "SELECT product_id, product_name FROM products;",
    expectedColumns: ["product_id", "product_name", "total_units_sold", "total_revenue"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "SELECT\n    p.product_id,\n    p.product_name,\n    SUM(oi.quantity) AS total_units_sold,\n    ROUND(SUM(oi.total_price),2) AS total_revenue\nFROM products p\nJOIN order_items oi\n    ON p.product_id = oi.product_id\nGROUP BY p.product_id, p.product_name\nORDER BY total_revenue DESC\nLIMIT 10;",
    slug: "top-selling-products",
    seoTitle: "SQL Top Selling Products Analysis",
    metaDescription: "Identify best-selling products using SQL joins, aggregations, and business analytics.",
    tags: ["Product Analytics", "Revenue Analysis", "Aggregation", "Business Intelligence"]
  },
  {
    id: 35,
    title: "Top 3 Products in Each Category",
    difficulty: "Advanced+",
    description: "Find the top three revenue-generating products within every product category.",
    explanation: "Use window functions to rank products by revenue inside each category.",
    scenario: "The merchandising team wants to feature the top-selling products from every category on the homepage.",
    useCases: ["Product ranking", "Category analysis", "Merchandising"],
    hint: "Use ROW_NUMBER() PARTITION BY category.",
    starterQuery: "SELECT product_id, category FROM products;",
    expectedColumns: ["category", "product_id", "product_name", "total_revenue", "category_rank"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH product_revenue AS (\n    SELECT\n        p.category,\n        p.product_id,\n        p.product_name,\n        ROUND(SUM(oi.total_price),2) AS total_revenue\n    FROM products p\n    JOIN order_items oi\n        ON p.product_id = oi.product_id\n    GROUP BY p.category,p.product_id,p.product_name\n)\nSELECT *\nFROM (\n    SELECT\n        *,\n        ROW_NUMBER() OVER(PARTITION BY category ORDER BY total_revenue DESC) AS category_rank\n    FROM product_revenue\n)\nWHERE category_rank <= 3\nORDER BY category, category_rank;",
    slug: "top-products-per-category",
    seoTitle: "SQL ROW_NUMBER Product Ranking",
    metaDescription: "Rank the top revenue-generating products within every category using SQL window functions.",
    tags: ["ROW_NUMBER","Window Functions","Ranking","Category Analytics"]
  },
  {
    id: 36,
    title: "Monthly Revenue Growth Analysis",
    difficulty: "Advanced+",
    description: "Compare every month's revenue with the previous month.",
    explanation: "Aggregate monthly revenue and compare it using LAG().",
    scenario: "Leadership wants to monitor month-over-month business growth.",
    useCases: ["Revenue trend","Business dashboard","Executive reporting"],
    hint: "Use LAG() after calculating monthly revenue.",
    starterQuery: "SELECT order_date,total_amount FROM orders;",
    expectedColumns: ["order_month","monthly_revenue","previous_month_revenue","revenue_change"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH monthly_sales AS (\n    SELECT\n        strftime('%Y-%m',order_date) AS order_month,\n        ROUND(SUM(total_amount),2) AS monthly_revenue\n    FROM orders\n    GROUP BY order_month\n)\nSELECT\n    order_month,\n    monthly_revenue,\n    LAG(monthly_revenue) OVER(ORDER BY order_month) AS previous_month_revenue,\n    ROUND(monthly_revenue - LAG(monthly_revenue) OVER(ORDER BY order_month),2) AS revenue_change\nFROM monthly_sales\nORDER BY order_month;",
    slug: "monthly-revenue-growth-analysis",
    seoTitle: "SQL Monthly Revenue Growth using LAG",
    metaDescription: "Analyze month-over-month revenue growth using SQL window functions.",
    tags: ["LAG","Revenue Analysis","Time Series","Business Intelligence"]
  },
  {
    id: 37,
    title: "Customers Purchasing Across Multiple Categories",
    difficulty: "Advanced+",
    description: "Identify customers who purchased from the highest number of different product categories.",
    explanation: "Use COUNT(DISTINCT category) to measure purchasing diversity.",
    scenario: "Marketing wants to identify highly engaged customers for cross-selling campaigns.",
    useCases: ["Customer segmentation","Cross-selling","Behavior analysis"],
    hint: "COUNT(DISTINCT category).",
    starterQuery: "SELECT customer_id FROM customers;",
    expectedColumns: ["customer_id","customer_name","categories_purchased","total_orders"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "SELECT\n    c.customer_id,\n    c.customer_name,\n    COUNT(DISTINCT p.category) AS categories_purchased,\n    COUNT(DISTINCT o.order_id) AS total_orders\nFROM customers c\nJOIN orders o\n    ON c.customer_id=o.customer_id\nJOIN order_items oi\n    ON o.order_id=oi.order_id\nJOIN products p\n    ON oi.product_id=p.product_id\nGROUP BY c.customer_id,c.customer_name\nORDER BY categories_purchased DESC,total_orders DESC\nLIMIT 10;",
    slug: "customer-category-diversity",
    seoTitle: "SQL Customer Category Diversity Analysis",
    metaDescription: "Identify customers purchasing across multiple product categories.",
    tags: ["Customer Analytics","COUNT DISTINCT","Cross Selling","Advanced SQL"]
  },
  {
    id: 38,
    title: "Revenue Contribution by Category",
    difficulty: "Advanced+",
    description: "Calculate what percentage of total revenue each category contributes.",
    explanation: "Combine category revenue with overall revenue using CTEs.",
    scenario: "Executives want to know which categories drive the business.",
    useCases: ["Executive dashboard","Revenue contribution","Business reporting"],
    hint: "Calculate total revenue once in a CTE.",
    starterQuery: "SELECT category FROM products;",
    expectedColumns: ["category","category_revenue","revenue_percentage"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH total_sales AS (\n    SELECT SUM(total_price) AS total_revenue\n    FROM order_items\n)\nSELECT\n    p.category,\n    ROUND(SUM(oi.total_price),2) AS category_revenue,\n    ROUND(SUM(oi.total_price)*100.0/t.total_revenue,2) AS revenue_percentage\nFROM order_items oi\nJOIN products p\n    ON oi.product_id=p.product_id\nCROSS JOIN total_sales t\nGROUP BY p.category\nORDER BY revenue_percentage DESC;",
    slug: "category-revenue-contribution",
    seoTitle: "SQL Revenue Contribution Analysis",
    metaDescription: "Calculate each product category's contribution to total revenue using SQL.",
    tags: ["CTE","Revenue Analytics","Business Intelligence","Aggregation"]
  },
  {
    id: 39,
    title: "Revenue Concentration Analysis",
    difficulty: "Elite",
    description: "Determine what percentage of total revenue comes from the top 10 customers.",
    explanation: "Rank customers by revenue, calculate cumulative revenue, and compare it against total business revenue.",
    scenario: "Executives want to understand whether revenue is concentrated among a few large customers.",
    useCases: ["Customer concentration","Executive reporting","Revenue analysis"],
    hint: "Use ROW_NUMBER(), CTEs, and CROSS JOIN.",
    starterQuery: "SELECT customer_id,total_amount FROM orders;",
    expectedColumns: ["top_10_customer_revenue","total_revenue","revenue_percentage"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "WITH customer_revenue AS (\n    SELECT\n        customer_id,\n        SUM(total_amount) AS revenue\n    FROM orders\n    GROUP BY customer_id\n),\ntop_customers AS (\n    SELECT revenue\n    FROM customer_revenue\n    ORDER BY revenue DESC\n    LIMIT 10\n),\ntotal_sales AS (\n    SELECT SUM(total_amount) AS total_revenue\n    FROM orders\n)\nSELECT\n    ROUND(SUM(tc.revenue),2) AS top_10_customer_revenue,\n    ROUND(ts.total_revenue,2) AS total_revenue,\n    ROUND(SUM(tc.revenue)*100.0/ts.total_revenue,2) AS revenue_percentage\nFROM top_customers tc\nCROSS JOIN total_sales ts;",
    slug: "revenue-concentration-analysis",
    seoTitle: "Advanced SQL Revenue Concentration Analysis",
    metaDescription: "Measure how much business revenue is generated by the top customers using advanced SQL.",
    tags: ["CTE","Business Analytics","Executive Dashboard","Elite SQL"]
  },
  
  {
    id: 40,
    title: "Customer Revenue Ranking",
    difficulty: "Elite",
    description: "Rank customers based on total revenue generated.",
    explanation: "Calculate customer revenue and assign a rank using DENSE_RANK().",
    scenario: "The finance team wants to identify the highest-value customers without gaps in ranking.",
    useCases: ["Customer segmentation", "Revenue ranking", "Executive reporting"],
    hint: "Use DENSE_RANK() over total revenue.",
    starterQuery: "SELECT customer_id, total_amount FROM orders;",
    expectedColumns: ["customer_id", "customer_name", "total_revenue", "customer_rank"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH customer_revenue AS (\n    SELECT\n        c.customer_id,\n        c.customer_name,\n        ROUND(SUM(o.total_amount),2) AS total_revenue\n    FROM customers c\n    JOIN orders o\n        ON c.customer_id=o.customer_id\n    GROUP BY c.customer_id,c.customer_name\n)\nSELECT\n    customer_id,\n    customer_name,\n    total_revenue,\n    DENSE_RANK() OVER(ORDER BY total_revenue DESC) AS customer_rank\nFROM customer_revenue\nORDER BY customer_rank\nLIMIT 10;",
    slug: "customer-revenue-ranking",
    seoTitle: "SQL Customer Revenue Ranking using DENSE_RANK",
    metaDescription: "Rank customers by revenue using SQL window functions.",
    tags: ["DENSE_RANK","Revenue","Customer Analytics","Window Functions"]
  },
  
  {
    id: 41,
    title: "Monthly Top Selling Product",
    difficulty: "Elite",
    description: "Find the highest revenue-generating product every month.",
    explanation: "Aggregate monthly revenue per product and rank them.",
    scenario: "Business wants to highlight the top-performing product every month.",
    useCases: ["Sales analysis","Monthly reporting","Product analytics"],
    hint: "ROW_NUMBER() partitioned by month.",
    starterQuery: "SELECT order_date FROM orders;",
    expectedColumns: ["order_month","product_name","monthly_revenue"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH monthly_products AS (\nSELECT\nstrftime('%Y-%m',o.order_date) AS order_month,\np.product_name,\nSUM(oi.total_price) AS monthly_revenue\nFROM orders o\nJOIN order_items oi ON o.order_id=oi.order_id\nJOIN products p ON oi.product_id=p.product_id\nGROUP BY order_month,p.product_name)\nSELECT order_month,product_name,ROUND(monthly_revenue,2) AS monthly_revenue\nFROM(\nSELECT *,ROW_NUMBER() OVER(PARTITION BY order_month ORDER BY monthly_revenue DESC) rn\nFROM monthly_products)\nWHERE rn=1\nORDER BY order_month;",
    slug: "monthly-top-selling-product",
    seoTitle: "SQL Monthly Best Selling Product",
    metaDescription: "Find the highest revenue product every month using ROW_NUMBER.",
    tags: ["ROW_NUMBER","Sales","Monthly Analysis","Window Functions"]
  },
  
  {
    id: 42,
    title: "Average Order Value by Customer",
    difficulty: "Elite",
    description: "Calculate average order value for every customer.",
    explanation: "Aggregate customer orders and compute average spend.",
    scenario: "Marketing wants to identify customers with the highest average purchase value.",
    useCases: ["Customer insights","AOV","Marketing"],
    hint: "AVG(total_amount).",
    starterQuery: "SELECT customer_id,total_amount FROM orders;",
    expectedColumns: ["customer_id","customer_name","total_orders","average_order_value"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "SELECT\nc.customer_id,\nc.customer_name,\nCOUNT(o.order_id) AS total_orders,\nROUND(AVG(o.total_amount),2) AS average_order_value\nFROM customers c\nJOIN orders o\nON c.customer_id=o.customer_id\nGROUP BY c.customer_id,c.customer_name\nORDER BY average_order_value DESC\nLIMIT 10;",
    slug: "average-order-value-customer",
    seoTitle: "SQL Average Order Value Analysis",
    metaDescription: "Calculate average customer spend using SQL aggregation.",
    tags: ["Average","Customer Analytics","Revenue","Aggregation"]
  },
  
  {
    id: 43,
    title: "Category Revenue Share",
    difficulty: "Elite",
    description: "Calculate each category's percentage contribution within the business.",
    explanation: "Use CTEs to compare category revenue with total revenue.",
    scenario: "Executives need a revenue distribution report.",
    useCases: ["Business KPI","Revenue dashboard","Executive analytics"],
    hint: "Use CROSS JOIN with total revenue.",
    starterQuery: "SELECT category FROM products;",
    expectedColumns: ["category","category_revenue","revenue_percentage"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH total_sales AS(\nSELECT SUM(total_price) total_revenue FROM order_items)\nSELECT\np.category,\nROUND(SUM(oi.total_price),2) category_revenue,\nROUND((SUM(oi.total_price)*100.0)/t.total_revenue,2) revenue_percentage\nFROM order_items oi\nJOIN products p\nON oi.product_id=p.product_id\nCROSS JOIN total_sales t\nGROUP BY p.category\nORDER BY revenue_percentage DESC;",
    slug: "category-revenue-share",
    seoTitle: "SQL Revenue Share Analysis",
    metaDescription: "Measure category contribution to total business revenue.",
    tags: ["CTE","Revenue","Business KPI","Analytics"]
  },
  
  {
    id: 44,
    title: "Customer Purchase Frequency",
    difficulty: "Elite",
    description: "Measure the average number of days between customer purchases.",
    explanation: "Use LAG() to calculate purchase intervals.",
    scenario: "Retention teams want to understand repeat buying behavior.",
    useCases: ["Retention","Customer analytics","Purchase behavior"],
    hint: "LAG(order_date).",
    starterQuery: "SELECT customer_id,order_date FROM orders;",
    expectedColumns: ["customer_id","customer_name","average_days_between_orders"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH purchase_history AS(\nSELECT\ncustomer_id,\norder_date,\nLAG(order_date) OVER(PARTITION BY customer_id ORDER BY order_date) previous_order\nFROM orders)\nSELECT\nc.customer_id,\nc.customer_name,\nROUND(AVG(julianday(order_date)-julianday(previous_order)),2) average_days_between_orders\nFROM purchase_history ph\nJOIN customers c\nON ph.customer_id=c.customer_id\nWHERE previous_order IS NOT NULL\nGROUP BY c.customer_id,c.customer_name\nORDER BY average_days_between_orders\nLIMIT 10;",
    slug: "customer-purchase-frequency",
    seoTitle: "SQL Customer Purchase Frequency",
    metaDescription: "Analyze customer repeat purchase intervals using SQL LAG.",
    tags: ["LAG","Customer Analytics","Date Functions","Window Functions"]
  },
  
  {
    id: 45,
    title: "Running Revenue Dashboard",
    difficulty: "Elite+",
    description: "Calculate cumulative business revenue over time.",
    explanation: "Generate a running revenue total ordered by date.",
    scenario: "Executives monitor cumulative business growth on a daily dashboard.",
    useCases: ["Executive dashboard","Revenue trend","Finance"],
    hint: "Use SUM() OVER(ORDER BY order_date).",
    starterQuery: "SELECT order_date,total_amount FROM orders;",
    expectedColumns: ["order_date","daily_revenue","running_revenue"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH daily_sales AS(\nSELECT\norder_date,\nROUND(SUM(total_amount),2) daily_revenue\nFROM orders\nGROUP BY order_date)\nSELECT\norder_date,\ndaily_revenue,\nROUND(SUM(daily_revenue) OVER(ORDER BY order_date),2) running_revenue\nFROM daily_sales\nORDER BY order_date;",
    slug: "running-revenue-dashboard",
    seoTitle: "SQL Running Revenue Dashboard",
    metaDescription: "Build a cumulative revenue dashboard using SQL window functions.",
    tags: ["Running Total","Window Functions","Dashboard","Finance"]
  },
  {
    id: 46,
    title: "Top 20% Customers Revenue Contribution",
    difficulty: "Elite+",
    description: "Calculate how much revenue is generated by the top 20% of customers.",
    explanation: "Rank customers by revenue, determine the top 20%, and calculate their contribution to total revenue.",
    scenario: "The finance team wants to validate whether a small percentage of customers generates most of the company's revenue.",
    useCases: ["Pareto Analysis", "Customer Segmentation", "Executive Dashboard"],
    hint: "Use ROW_NUMBER(), COUNT() OVER(), and CTEs.",
    starterQuery: "SELECT customer_id, total_amount FROM orders;",
    expectedColumns: ["top_customer_count", "top_customer_revenue", "total_revenue", "revenue_percentage"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "WITH customer_sales AS (\nSELECT customer_id,SUM(total_amount) revenue\nFROM orders\nGROUP BY customer_id\n), ranked AS (\nSELECT *,ROW_NUMBER() OVER(ORDER BY revenue DESC) rn,COUNT(*) OVER() total_customers\nFROM customer_sales\n), total_sales AS (\nSELECT SUM(revenue) total_revenue FROM customer_sales\n)\nSELECT\nCOUNT(*) AS top_customer_count,\nROUND(SUM(revenue),2) AS top_customer_revenue,\nROUND(ts.total_revenue,2) AS total_revenue,\nROUND(SUM(revenue)*100.0/ts.total_revenue,2) AS revenue_percentage\nFROM ranked\nCROSS JOIN total_sales ts\nWHERE rn<=CEIL(total_customers*0.2);",
    slug: "top-20-percent-customer-revenue",
    seoTitle: "SQL Pareto Customer Revenue Analysis",
    metaDescription: "Measure revenue generated by the top 20 percent of customers using SQL.",
    tags: ["Pareto Analysis","Window Functions","Customer Analytics","Elite SQL"]
  },
  
  {
    id: 47,
    title: "Monthly Customer Acquisition Trend",
    difficulty: "Elite+",
    description: "Track the number of new customers acquired each month.",
    explanation: "Group customers by their registration month and calculate cumulative growth.",
    scenario: "Management wants to monitor customer acquisition trends over time.",
    useCases: ["Growth Analytics","Executive Dashboard","Customer Acquisition"],
    hint: "Use strftime() and running totals.",
    starterQuery: "SELECT created_date FROM customers;",
    expectedColumns: ["month","new_customers","cumulative_customers"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH monthly_signup AS(\nSELECT strftime('%Y-%m',created_date) month,COUNT(*) new_customers\nFROM customers\nGROUP BY month)\nSELECT\nmonth,\nnew_customers,\nSUM(new_customers) OVER(ORDER BY month) cumulative_customers\nFROM monthly_signup\nORDER BY month;",
    slug: "monthly-customer-acquisition",
    seoTitle: "SQL Customer Acquisition Trend",
    metaDescription: "Analyze monthly customer acquisition using SQL window functions.",
    tags: ["Growth Analytics","Running Total","Customer Analytics","Elite SQL"]
  },
  
  {
    id: 48,
    title: "Highest Revenue Order Per Customer",
    difficulty: "Elite+",
    description: "Find each customer's single highest-value order.",
    explanation: "Rank orders within each customer by order value.",
    scenario: "Account managers want to understand each customer's largest purchase.",
    useCases: ["Customer Insights","Sales Analysis","Order Analytics"],
    hint: "ROW_NUMBER() partitioned by customer.",
    starterQuery: "SELECT customer_id,total_amount FROM orders;",
    expectedColumns: ["customer_id","customer_name","order_id","total_amount"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH ranked_orders AS(\nSELECT\no.order_id,\no.customer_id,\no.total_amount,\nROW_NUMBER() OVER(PARTITION BY o.customer_id ORDER BY o.total_amount DESC) rn\nFROM orders o)\nSELECT\nc.customer_id,\nc.customer_name,\nr.order_id,\nROUND(r.total_amount,2) total_amount\nFROM ranked_orders r\nJOIN customers c\nON r.customer_id=c.customer_id\nWHERE rn=1\nORDER BY total_amount DESC;",
    slug: "highest-revenue-order-per-customer",
    seoTitle: "SQL Highest Value Order Analysis",
    metaDescription: "Identify each customer's largest purchase using SQL window functions.",
    tags: ["ROW_NUMBER","Order Analytics","Customer Analytics","Elite SQL"]
  },
  
  {
    id: 49,
    title: "Customer Revenue Distribution",
    difficulty: "Elite+",
    description: "Divide customers into revenue quartiles.",
    explanation: "Use NTILE() to segment customers by total revenue.",
    scenario: "Marketing wants to build premium, gold, silver, and bronze customer segments.",
    useCases: ["Customer Segmentation","Marketing","Revenue Analysis"],
    hint: "Use NTILE(4).",
    starterQuery: "SELECT customer_id,total_amount FROM orders;",
    expectedColumns: ["customer_id","customer_name","total_revenue","revenue_quartile"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH revenue AS(\nSELECT\nc.customer_id,\nc.customer_name,\nSUM(o.total_amount) total_revenue\nFROM customers c\nJOIN orders o\nON c.customer_id=o.customer_id\nGROUP BY c.customer_id,c.customer_name)\nSELECT\ncustomer_id,\ncustomer_name,\nROUND(total_revenue,2) total_revenue,\nNTILE(4) OVER(ORDER BY total_revenue DESC) revenue_quartile\nFROM revenue\nORDER BY total_revenue DESC;",
    slug: "customer-revenue-distribution",
    seoTitle: "SQL Customer Revenue Quartiles",
    metaDescription: "Segment customers into revenue quartiles using SQL NTILE.",
    tags: ["NTILE","Customer Segmentation","Window Functions","Elite SQL"]
  },
  
  {
    id: 50,
    title: "Category Leaderboard by Month",
    difficulty: "Elite+",
    description: "Find the highest revenue product category for every month.",
    explanation: "Aggregate revenue by category and month, then rank categories within each month.",
    scenario: "Business leaders want to know which product category dominated sales every month.",
    useCases: ["Monthly Dashboard","Category Analysis","Executive Reporting"],
    hint: "Combine GROUP BY with ROW_NUMBER().",
    starterQuery: "SELECT order_date FROM orders;",
    expectedColumns: ["order_month","category","monthly_revenue"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH monthly_category AS(\nSELECT\nstrftime('%Y-%m',o.order_date) order_month,\np.category,\nSUM(oi.total_price) monthly_revenue\nFROM orders o\nJOIN order_items oi\nON o.order_id=oi.order_id\nJOIN products p\nON oi.product_id=p.product_id\nGROUP BY order_month,p.category)\nSELECT\norder_month,\ncategory,\nROUND(monthly_revenue,2) monthly_revenue\nFROM(\nSELECT *,ROW_NUMBER() OVER(PARTITION BY order_month ORDER BY monthly_revenue DESC) rn\nFROM monthly_category)\nWHERE rn=1\nORDER BY order_month;",
    slug: "category-leaderboard-by-month",
    seoTitle: "SQL Monthly Category Revenue Leaderboard",
    metaDescription: "Find the top revenue-generating category every month using SQL window functions.",
    tags: ["ROW_NUMBER","Monthly Analysis","Category Analytics","Elite SQL"]
  },
  {
    id: 51,
    title: "Customer Lifetime Value Ranking",
    difficulty: "Elite+",
    description: "Rank customers based on their lifetime value generated through completed orders.",
    explanation: "Aggregate customer revenue and assign a rank based on lifetime spending.",
    scenario: "The marketing team wants to identify the highest-value customers for premium loyalty programs.",
    useCases: ["Customer Lifetime Value", "Loyalty Programs", "Revenue Analysis"],
    hint: "Aggregate revenue first, then use DENSE_RANK().",
    starterQuery: "SELECT customer_id, total_amount FROM orders;",
    expectedColumns: ["customer_id", "customer_name", "lifetime_revenue", "customer_rank"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH customer_sales AS (\nSELECT c.customer_id,c.customer_name,SUM(o.total_amount) lifetime_revenue\nFROM customers c\nJOIN orders o ON c.customer_id=o.customer_id\nGROUP BY c.customer_id,c.customer_name\n)\nSELECT customer_id,customer_name,ROUND(lifetime_revenue,2) lifetime_revenue,DENSE_RANK() OVER(ORDER BY lifetime_revenue DESC) customer_rank\nFROM customer_sales\nORDER BY customer_rank\nLIMIT 10;",
    slug: "customer-lifetime-value-ranking",
    seoTitle: "SQL Customer Lifetime Value Ranking",
    metaDescription: "Rank customers by lifetime revenue using SQL window functions.",
    tags: ["Customer Analytics","DENSE_RANK","Revenue","Elite SQL"]
  },
  
  {
    id: 52,
    title: "Monthly Running Revenue",
    difficulty: "Elite+",
    description: "Calculate cumulative monthly revenue over time.",
    explanation: "Generate monthly revenue and compute a running total.",
    scenario: "Finance wants to visualize cumulative business growth month over month.",
    useCases: ["Finance Dashboard", "Revenue Trends", "Business Intelligence"],
    hint: "Use SUM() OVER().",
    starterQuery: "SELECT order_date,total_amount FROM orders;",
    expectedColumns: ["order_month","monthly_revenue","running_revenue"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH monthly_sales AS(\nSELECT strftime('%Y-%m',order_date) order_month,SUM(total_amount) monthly_revenue\nFROM orders\nGROUP BY order_month)\nSELECT order_month,ROUND(monthly_revenue,2) monthly_revenue,ROUND(SUM(monthly_revenue) OVER(ORDER BY order_month),2) running_revenue\nFROM monthly_sales\nORDER BY order_month;",
    slug: "monthly-running-revenue",
    seoTitle: "SQL Running Revenue Dashboard",
    metaDescription: "Calculate cumulative monthly revenue using SQL window functions.",
    tags: ["Running Total","Finance","Window Functions","Elite SQL"]
  },
  
  {
    id: 53,
    title: "Top Delivery Partner Each Month",
    difficulty: "Elite+",
    description: "Identify the delivery partner generating the highest revenue every month.",
    explanation: "Calculate monthly revenue by delivery partner and rank them.",
    scenario: "Operations wants to recognize the highest-performing delivery partners each month.",
    useCases: ["Operations Analytics","Delivery Performance","Monthly Reporting"],
    hint: "Use ROW_NUMBER() partitioned by month.",
    starterQuery: "SELECT delivery_partner_id,order_date FROM orders;",
    expectedColumns: ["order_month","partner_name","monthly_revenue"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH monthly_partner AS(\nSELECT strftime('%Y-%m',o.order_date) order_month,dp.partner_name,SUM(o.total_amount) monthly_revenue\nFROM orders o\nJOIN delivery_partners dp ON o.delivery_partner_id=dp.delivery_partner_id\nGROUP BY order_month,dp.partner_name)\nSELECT order_month,partner_name,ROUND(monthly_revenue,2) monthly_revenue\nFROM(\nSELECT *,ROW_NUMBER() OVER(PARTITION BY order_month ORDER BY monthly_revenue DESC) rn\nFROM monthly_partner)\nWHERE rn=1\nORDER BY order_month;",
    slug: "top-delivery-partner-monthly",
    seoTitle: "SQL Monthly Delivery Partner Performance",
    metaDescription: "Find the best-performing delivery partner every month using SQL.",
    tags: ["ROW_NUMBER","Delivery Analytics","Operations","Elite SQL"]
  },
  
  {
    id: 54,
    title: "Revenue Share by Payment Method",
    difficulty: "Elite+",
    description: "Calculate each payment method's contribution to total revenue.",
    explanation: "Compare payment method revenue against overall payment revenue.",
    scenario: "Finance wants to understand customer payment preferences and revenue distribution.",
    useCases: ["Payment Analytics","Finance","Executive Dashboard"],
    hint: "Use a CTE for total revenue.",
    starterQuery: "SELECT payment_method,amount FROM payments;",
    expectedColumns: ["payment_method","payment_revenue","revenue_percentage"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH total_revenue AS(\nSELECT SUM(amount) total_amount FROM payments)\nSELECT p.payment_method,ROUND(SUM(p.amount),2) payment_revenue,ROUND(SUM(p.amount)*100.0/t.total_amount,2) revenue_percentage\nFROM payments p\nCROSS JOIN total_revenue t\nGROUP BY p.payment_method\nORDER BY payment_revenue DESC;",
    slug: "payment-method-revenue-share",
    seoTitle: "SQL Payment Method Revenue Analysis",
    metaDescription: "Calculate payment method contribution to overall revenue using SQL.",
    tags: ["Payment Analytics","Finance","CTE","Elite SQL"]
  },
  
  {
    id: 55,
    title: "Customer Purchase Consistency",
    difficulty: "Elite+",
    description: "Find customers whose monthly purchasing activity remained the most consistent.",
    explanation: "Calculate monthly order counts and compare each customer's highest and lowest monthly order volume.",
    scenario: "The retention team wants to identify customers with consistently active purchasing behavior.",
    useCases: ["Customer Retention","Behavior Analysis","Business Intelligence"],
    hint: "Aggregate monthly orders first, then compare MIN() and MAX().",
    starterQuery: "SELECT customer_id,order_date FROM orders;",
    expectedColumns: ["customer_id","customer_name","minimum_monthly_orders","maximum_monthly_orders"],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH monthly_orders AS(\nSELECT customer_id,strftime('%Y-%m',order_date) order_month,COUNT(*) monthly_orders\nFROM orders\nGROUP BY customer_id,order_month)\nSELECT c.customer_id,c.customer_name,MIN(monthly_orders) minimum_monthly_orders,MAX(monthly_orders) maximum_monthly_orders\nFROM monthly_orders mo\nJOIN customers c ON mo.customer_id=c.customer_id\nGROUP BY c.customer_id,c.customer_name\nORDER BY maximum_monthly_orders-minimum_monthly_orders ASC,maximum_monthly_orders DESC\nLIMIT 10;",
    slug: "customer-purchase-consistency",
    seoTitle: "SQL Customer Purchase Consistency Analysis",
    metaDescription: "Identify customers with the most consistent purchasing behavior using SQL.",
    tags: ["Customer Analytics","CTE","Behavior Analysis","Elite SQL"]
  },
  
  {
    id: 56,
    title: "Delivery Partner Lifecycle Analysis",
    slug: "delivery-partner-tenure-lifecycle-efficiency",
    seoTitle: "Very Advanced SQL: Modeling Logistics Resource Lifecycle Demographics and Densities",
    metaDescription: "Deconstruct partner performance tenure timelines. Correlate resource longevity milestones against daily operational volumes and feedback profiles.",
    tags: ["Logistics Longevity", "Resource Densities", "Fulfillment Ratios", "Performance Lifecycles"],
    difficulty: "Very Advanced",
    description: "Analyze performance from joining_date to present.",
    explanation: "Compare joining_date vs deliveries.",
    scenario: "Partner lifecycle.",
    useCases: ["Lifecycle", "Operations"],
    hint: "Use joining_date",
    starterQuery: "SELECT joining_date FROM delivery_partners;",
    expectedColumns: ["joining_date"],
    expectedRowCount: 4,
    solutionQuery: "SELECT\n    dp.delivery_partner_id,\n    dp.partner_name,\n    dp.joining_date,\n    ROUND(\n        julianday('now') - julianday(dp.joining_date),\n        2\n    ) AS partner_age_days,\n    dp.total_deliveries,\n    ROUND(dp.rating, 2) AS rating,\n    ROUND(\n        dp.total_deliveries * 1.0 /\n        (julianday('now') - julianday(dp.joining_date) + 1),\n        2\n    ) AS deliveries_per_day\nFROM delivery_partners dp\nORDER BY deliveries_per_day DESC;",
  },
  
  {
    id: 57,
    title: "Order Lifecycle Duration Distribution",
    slug: "order-lifecycle-fulfillment-duration-sla",
    seoTitle: "Very Advanced SQL: Mapping Logistics Lifecycle Fulfillment Durations",
    metaDescription: "Dissect workflow cycle latencies. Map time gaps from placement to recipient delivery, categorizing volume shares across strategic SLA execution scales.",
    tags: ["Workflow Cycle Latency", "Fulfillment Milestones", "SLA Scale Metrics", "Process Auditing"],
    difficulty: "Very Advanced",
    description: "Analyze total lifecycle from order to delivery.",
    explanation: "Compare order_date and delivered_date.",
    scenario: "Process efficiency.",
    useCases: ["SLA", "Operations"],
    hint: "Date difference",
    starterQuery: "SELECT order_id FROM orders;",
    expectedColumns: ["order_id"],
    expectedRowCount: 6,
    solutionQuery: "SELECT\n    CASE\n        WHEN julianday(delivered_date) - julianday(order_date) <= 1 THEN '0-1 Days'\n        WHEN julianday(delivered_date) - julianday(order_date) <= 3 THEN '2-3 Days'\n        WHEN julianday(delivered_date) - julianday(order_date) <= 7 THEN '4-7 Days'\n        ELSE '7+ Days'\n    END AS lifecycle_bucket,\n    COUNT(order_id) AS total_orders,\n    ROUND(AVG(total_amount), 2) AS avg_order_value\nFROM orders\nWHERE delivered_date IS NOT NULL\nGROUP BY lifecycle_bucket\nORDER BY total_orders DESC;",
  },
  
  {
    id: 58,
    title: "Revenue Leakage from Failed Payments",
    slug: "revenue-leakage-failed-payment-gateways",
    seoTitle: "Very Advanced SQL: Quantifying System Financial Leakage from Gateway Drops",
    metaDescription: "Isolate capital losses from processing drops. Construct clear structural aggregates to track lost transactional value and evaluate revenue recovery risks.",
    tags: ["Capital Remediation", "Processing Drops", "Leakage Quantification", "Recovery Risk Frameworks"],
    difficulty: "Very Advanced",
    description: "Estimate lost revenue due to failed payments.",
    explanation: "Compare failed vs successful payments.",
    scenario: "Revenue recovery.",
    useCases: ["Payments", "Revenue"],
    hint: "payment_status",
    starterQuery: "SELECT payment_status FROM payments;",
    expectedColumns: ["payment_status"],
    expectedRowCount: 3,
    solutionQuery: "SELECT\n    payment_status,\n    COUNT(payment_id) AS total_transactions,\n    ROUND(SUM(amount), 2) AS total_amount,\n    ROUND(AVG(amount), 2) AS avg_transaction_value,\n    ROUND(\n        SUM(CASE WHEN payment_status = 'failed' THEN amount ELSE 0 END),\n        2\n    ) AS lost_revenue\nFROM payments\nGROUP BY payment_status\nORDER BY lost_revenue DESC;",
  },
  
  {
    id: 59,
    title: "Customer Feedback Delay Analysis",
    slug: "customer-feedback-submission-latency",
    seoTitle: "Very Advanced SQL: Measuring Submission Latency and Feedback Engagement",
    metaDescription: "Calculate the chronological latency between product receipt and post-purchase evaluations. Expose operational response speeds and user sentiment gaps.",
    tags: ["Submission Latency", "Evaluation Gaps", "Chronological Milestones", "Post-Purchase Behaviors"],
    difficulty: "Very Advanced",
    description: "Measure how long customers take to give feedback after delivery.",
    explanation: "Compare delivered_date vs feedback created_at.",
    scenario: "Customer behavior.",
    useCases: ["Feedback", "Engagement"],
    hint: "Date difference",
    starterQuery: "SELECT feedback_id FROM feedback;",
    expectedColumns: ["feedback_id"],
    expectedRowCount: 5,
    solutionQuery: "SELECT\n    f.feedback_id,\n    f.customer_id,\n    o.order_id,\n    o.delivered_date,\n    f.created_at AS feedback_date,\n    ROUND(\n        julianday(f.created_at) - julianday(o.delivered_date),\n        2\n    ) AS feedback_delay_days,\n    f.rating\nFROM feedback f\nJOIN orders o\n    ON f.order_id = o.order_id\nWHERE o.delivered_date IS NOT NULL\nORDER BY feedback_delay_days DESC;",
  },
  
  {
    id: 60,
    title: "Full Business Health Diagnosis",
    slug: "full-business-health-diagnostic-view",
    seoTitle: "FAANG SQL Interview Challenge: Engineering a Unified Enterprise Diagnostic Matrix",
    metaDescription: "Build a multi-entity dashboard query. Synthesize baseline revenue pipelines, active user churn, logistical SLA delays, and payment failure footprints into a single executive table.",
    tags: ["Enterprise Dashboards", "Cross-Entity Optimization", "FAANG Interview Architecture", "Unified System Performance"],
    difficulty: "Very Advanced (FAANG)",
    description: "Analyze revenue, churn, delays, refunds, and feedback in a single diagnostic view.",
    explanation: "Combine all tables to identify key business issues.",
    scenario: "CEO asks for full system health.",
    useCases: ["Executive analytics", "BI"],
    hint: "Combine all tables",
    starterQuery: "SELECT COUNT(*) FROM orders;",
    expectedColumns: ["metrics"],
    expectedRowCount: 1,
    solutionQuery: "WITH customer_metrics AS (\n    SELECT\n        customer_id,\n        COUNT(order_id) AS total_orders,\n        julianday('now') - julianday(MAX(order_date)) AS recency_days\n    FROM orders\n    GROUP BY customer_id\n)\nSELECT\n    ROUND(SUM(o.total_amount), 2) AS total_revenue,\n    COUNT(DISTINCT c.customer_id) AS active_customer_base\nFROM customers c\nLEFT JOIN orders o ON c.customer_id = o.customer_id;"
  },
  {
    id: 61,
    title: "Revenue vs Experience Trade-off",
    slug: "revenue-vs-experience-trade-off-sql-problem",
    seoTitle: "Advanced SQL Query: Analyzing Revenue Growth vs Customer Experience",
    metaDescription: "Master advanced SQL joins and aggregations to identify products, partners, or regions causing customer satisfaction declines despite rising revenues.",
    difficulty: "Elite",
    description: "Revenue is increasing but customer ratings are dropping. Identify which products, partners, or regions are causing this mismatch.",
    explanation: "Combine revenue trends with feedback ratings across products, delivery partners, and geographies.",
    scenario: "Leadership suspects growth is hurting customer experience.",
    useCases: ["CX vs Revenue", "Root cause"],
    tags: ["JOINs", "Aggregation", "Business Metrics", "Customer Experience"],
    hint: "JOIN orders, products, feedback, delivery_partners, customers",
    starterQuery: "SELECT order_date, SUM(total_amount) FROM orders GROUP BY order_date;",
    expectedColumns: ["dimension", "metric"],
    expectedRowCount: 10,
    solutionQuery: "SELECT\n    p.category,\n    dp.partner_name,\n    c.country,\n    ROUND(SUM(o.total_amount), 2) AS total_revenue,\n    ROUND(AVG(f.rating), 2) AS avg_rating,\n    COUNT(DISTINCT o.order_id) AS total_orders\nFROM orders o\nJOIN order_items oi\n    ON o.order_id = oi.order_id\nJOIN products p\n    ON oi.product_id = p.product_id\nLEFT JOIN feedback f\n    ON o.order_id = f.order_id\nLEFT JOIN delivery_partners dp\n    ON o.delivery_partner_id = dp.delivery_partner_id\nLEFT JOIN customers c\n    ON o.customer_id = c.customer_id\nGROUP BY p.category, dp.partner_name, c.country\nHAVING total_revenue > 0\nORDER BY avg_rating ASC, total_revenue DESC;",
  },
  
  {
    id: 62,
    title: "Hidden Customer Churn Segments",
    slug: "hidden-customer-churn-segments-sql",
    seoTitle: "SQL Churn Analysis: Detecting Silent Customer Attrition Segments",
    metaDescription: "Write complex SQLite / PostgreSQL queries to calculate customer inactivity intervals and segments hidden churn risks using dynamic CASE logic.",
    difficulty: "Elite",
    description: "Identify segments of customers who are silently churning despite occasional activity.",
    explanation: "Compare long gaps, declining frequency, and low spending trends.",
    scenario: "Marketing cannot detect churn using simple rules.",
    useCases: ["Churn detection", "Retention"],
    tags: ["CTEs", "Date Functions", "CASE Statements", "Customer Retention"],
    hint: "Use last_order_date, order frequency trend",
    starterQuery: "SELECT customer_id, last_order_date FROM customers;",
    expectedColumns: ["customer_id"],
    expectedRowCount: 5,
    solutionQuery: "WITH customer_metrics AS (\n    SELECT\n        c.customer_id,\n        c.customer_type,\n        MAX(o.order_date) AS last_order_date,\n        COUNT(o.order_id) AS total_orders,\n        ROUND(AVG(o.total_amount), 2) AS avg_order_value,\n        ROUND(\n            julianday('now') - julianday(MAX(o.order_date)),\n            2\n        ) AS inactive_days\n    FROM customers c\n    LEFT JOIN orders o\n        ON c.customer_id = o.customer_id\n    GROUP BY c.customer_id, c.customer_type\n)\nSELECT\n    customer_id,\n    customer_type,\n    total_orders,\n    avg_order_value,\n    inactive_days,\n    CASE\n        WHEN inactive_days > 90 AND total_orders <= 2 THEN 'High Churn Risk'\n        WHEN inactive_days > 60 THEN 'Medium Churn Risk'\n        ELSE 'Low Churn Risk'\n    END AS churn_segment\nFROM customer_metrics\nORDER BY inactive_days DESC;",
  },
  
  {
    id: 63,
    title: "End-to-End Revenue Leakage Map",
    slug: "revenue-leakage-map-sql-union",
    seoTitle: "Financial Audit SQL: Mapping End-to-End Business Revenue Leakage",
    metaDescription: "Learn how to consolidate multiple operational datasets using UNION ALL to detect margins lost to refunds, discounts, and failed payments.",
    difficulty: "Elite",
    description: "Identify all possible points where revenue is lost: discounts, failed payments, refunds, cancellations.",
    explanation: "Combine discount_amount, payment_status, refund_amount, cancellation_reason.",
    scenario: "Finance wants a full leakage breakdown.",
    useCases: ["Audit", "Profitability"],
    tags: ["UNION ALL", "Financial Data", "Data Aggregation", "Revenue Audit"],
    hint: "Combine orders + payments",
    starterQuery: "SELECT order_id, discount_amount FROM orders;",
    expectedColumns: ["leakage_type", "amount"],
    expectedRowCount: 6,
    solutionQuery: "SELECT\n    'Discount Leakage' AS leakage_type,\n    ROUND(SUM(discount_amount), 2) AS amount\nFROM orders\n\nUNION ALL\n\nSELECT\n    'Refund Leakage' AS leakage_type,\n    ROUND(SUM(refund_amount), 2) AS amount\nFROM payments\n\nUNION ALL\n\nSELECT\n    'Failed Payment Leakage' AS leakage_type,\n    ROUND(SUM(amount), 2) AS amount\nFROM payments\nWHERE payment_status = 'failed'\n\nUNION ALL\n\nSELECT\n    'Cancelled Order Leakage' AS leakage_type,\n    ROUND(SUM(total_amount), 2) AS amount\nFROM orders\nWHERE order_status = 'Cancelled';",
  },
  
  {
    id: 64,
    title: "Customer Journey Fragmentation",
    slug: "customer-journey-fragmentation-funnel-sql",
    seoTitle: "UX Funnel SQL Analytics: Finding Broken Customer Journeys",
    metaDescription: "Utilize nested LEFT JOIN paths across orders, payments, and feedback schemas to isolate system friction and user journey dropping points.",
    difficulty: "Elite",
    description: "Detect customers whose journey is incomplete or inconsistent (login but no order, order but no payment, etc.).",
    explanation: "Track presence across customers → orders → payments → feedback.",
    scenario: "Product team wants to fix broken journeys.",
    useCases: ["Funnel", "UX"],
    tags: ["LEFT JOIN", "Conditional Logic", "Funnel Metrics", "Product Analytics"],
    hint: "LEFT JOIN across all stages",
    starterQuery: "SELECT customer_id FROM customers;",
    expectedColumns: ["customer_id"],
    expectedRowCount: 6,
    solutionQuery: "SELECT\n    c.customer_id,\n    c.customer_name,\n    CASE\n        WHEN o.order_id IS NULL THEN 'No Orders'\n        WHEN p.payment_id IS NULL THEN 'No Payments'\n        WHEN f.feedback_id IS NULL THEN 'No Feedback'\n        ELSE 'Complete Journey'\n    END AS journey_status,\n    COUNT(DISTINCT o.order_id) AS total_orders,\n    COUNT(DISTINCT p.payment_id) AS total_payments,\n    COUNT(DISTINCT f.feedback_id) AS total_feedback\nFROM customers c\nLEFT JOIN orders o\n    ON c.customer_id = o.customer_id\nLEFT JOIN payments p\n    ON o.order_id = p.order_id\nLEFT JOIN feedback f\n    ON o.order_id = f.order_id\nGROUP BY c.customer_id, c.customer_name, journey_status\nORDER BY total_orders ASC;",
  },
  
  {
    id: 65,
    title: "Delivery Network Inefficiency Zones",
    slug: "delivery-network-inefficiency-logistics-sql",
    seoTitle: "Supply Chain & Logistics SQL: Finding Inefficiency Zones",
    metaDescription: "Track distribution network delays and resource delivery densities by applying multi-variable GROUP BY statements to geospatial fields.",
    difficulty: "Elite",
    description: "Identify cities where delivery partners are underperforming relative to order volume.",
    explanation: "Compare delivery delays, partner count, and order density per city.",
    scenario: "Operations wants to optimize logistics network.",
    useCases: ["Logistics", "Optimization"],
    tags: ["Operations", "Date Differences", "SLA Performance", "Logistics Analysis"],
    hint: "GROUP BY city",
    starterQuery: "SELECT city FROM delivery_partners;",
    expectedColumns: ["city"],
    expectedRowCount: 5,
    solutionQuery: "SELECT\n    dp.city,\n    COUNT(DISTINCT dp.delivery_partner_id) AS total_partners,\n    COUNT(o.order_id) AS total_orders,\n    ROUND(\n        AVG(julianday(o.delivered_date) - julianday(o.estimated_delivery_time)),\n        2\n    ) AS avg_delay_days,\n    ROUND(\n        COUNT(o.order_id) * 1.0 /\n        COUNT(DISTINCT dp.delivery_partner_id),\n        2\n    ) AS orders_per_partner\nFROM delivery_partners dp\nLEFT JOIN orders o\n    ON dp.delivery_partner_id = o.delivery_partner_id\nWHERE o.delivered_date IS NOT NULL\nGROUP BY dp.city\nORDER BY avg_delay_days DESC, orders_per_partner DESC;",
  },
  
  {
    id: 66,
    title: "Product Lifecycle Profit Decay",
    slug: "product-lifecycle-profit-decay-sql",
    seoTitle: "Product Economics SQL: Tracking Margin Decay Over Time",
    metaDescription: "Calculate localized product age alongside running cost-to-price margin variations to locate product lifecycle profitability anomalies.",
    difficulty: "Elite",
    description: "Identify products whose profitability declines after launch.",
    explanation: "Compare margin over time since created_at.",
    scenario: "Product team wants lifecycle insights.",
    useCases: ["Product lifecycle", "Margins"],
    tags: ["Product Growth", "Margin Math", "Financial Reporting", "SQLite Julianday"],
    hint: "Compare cost_price vs price over time",
    starterQuery: "SELECT product_id, created_at FROM products;",
    expectedColumns: ["product_id"],
    expectedRowCount: 5,
    solutionQuery: "SELECT\n    p.product_id,\n    p.product_name,\n    p.created_at,\n    ROUND(p.price - p.cost_price, 2) AS current_margin,\n    ROUND(SUM(oi.total_price), 2) AS total_revenue,\n    ROUND(SUM((p.price - p.cost_price) * oi.quantity), 2) AS total_profit,\n    ROUND(\n        julianday('now') - julianday(p.created_at),\n        2\n    ) AS product_age_days\nFROM products p\nLEFT JOIN order_items oi\n    ON p.product_id = oi.product_id\nGROUP BY p.product_id, p.product_name, p.created_at, p.price, p.cost_price\nORDER BY total_profit ASC;",
  },
  
  {
    id: 67,
    title: "Customers Shopping Across Multiple Cities",
    slug: "customers-shopping-across-multiple-cities",
    seoTitle: "Advanced SQL Customer Geographic Activity Analysis",
    metaDescription: "Identify customers who have placed orders from multiple cities using SQL aggregations and business analytics.",
    difficulty: "Elite",
    description: "Identify customers who have placed orders from multiple cities.",
    explanation: "Analyze customer activity by counting the number of distinct cities associated with each customer.",
    scenario: "The operations team wants to identify customers who frequently purchase from different cities to understand travel patterns and optimize regional marketing campaigns.",
    useCases: [
      "Customer analytics",
      "Geographic analysis",
      "Marketing segmentation"
    ],
    tags: [
      "COUNT DISTINCT",
      "GROUP BY",
      "Customer Analytics",
      "Business Intelligence"
    ],
    hint: "Count DISTINCT city values for each customer.",
    starterQuery: "SELECT customer_id, city FROM customers;",
    expectedColumns: [
      "customer_id",
      "customer_name",
      "cities_visited"
    ],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "SELECT\n    customer_id,\n    customer_name,\n    COUNT(DISTINCT city) AS cities_visited\nFROM customers\nGROUP BY customer_id, customer_name\nORDER BY cities_visited DESC, customer_name\nLIMIT 10;"
  },
  
  {
    id: 68,
    title: "Order Value vs Basket Complexity",
    slug: "order-value-vs-basket-complexity-sql",
    seoTitle: "E-commerce Basket Analysis: Item Count vs Order Value SQL",
    metaDescription: "Analyze the cross-relationship between item category varieties and resulting purchase basket size revenues using deep descriptive SQL indicators.",
    difficulty: "Elite",
    description: "Analyze how number of items and categories per order impacts revenue.",
    explanation: "Combine order_items and products.",
    scenario: "Upsell strategy.",
    useCases: ["Basket analysis", "Revenue"],
    tags: ["Basket Analysis", "Retail Analytics", "Count Distinct", "E-commerce Insights"],
    hint: "COUNT(order_items), COUNT DISTINCT category",
    starterQuery: "SELECT order_id FROM order_items;",
    expectedColumns: ["order_id"],
    expectedRowCount: 6,
    solutionQuery: "SELECT\n    oi.order_id,\n    COUNT(oi.item_id) AS total_items,\n    COUNT(DISTINCT p.category) AS unique_categories,\n    ROUND(SUM(oi.total_price), 2) AS basket_revenue,\n    ROUND(AVG(oi.unit_price), 2) AS avg_item_price\nFROM order_items oi\nJOIN products p\n    ON oi.product_id = p.product_id\nGROUP BY oi.order_id\nORDER BY basket_revenue DESC;",
  },
  
  {
    id: 69,
    title: "Payment Provider Failure Cascade",
    slug: "payment-provider-failure-cascade-window-sql",
    seoTitle: "Fintech SQL Analytics: Mapping Cascading Gateway Failures",
    metaDescription: "Master SQL analytical window operations like LAG() to parse chronological sequences of nested merchant payment transaction errors.",
    difficulty: "Elite",
    description: "Detect if failure in one provider leads to retries in another provider.",
    explanation: "Track sequence of payment_provider and attempt_number.",
    scenario: "Payments team debugging cascading failures.",
    useCases: ["Payments", "Reliability"],
    tags: ["Window Functions", "LAG", "Transaction Sequences", "Fintech Systems"],
    hint: "ORDER BY attempt_number",
    starterQuery: "SELECT order_id, payment_provider FROM payments;",
    expectedColumns: ["order_id"],
    expectedRowCount: 5,
    solutionQuery: "WITH payment_sequence AS (\n    SELECT\n        order_id,\n        payment_provider,\n        payment_status,\n        attempt_number,\n        LAG(payment_provider) OVER (\n            PARTITION BY order_id\n            ORDER BY attempt_number\n        ) AS previous_provider,\n        LAG(payment_status) OVER (\n            PARTITION BY order_id\n            ORDER BY attempt_number\n        ) AS previous_status\n    FROM payments\n)\nSELECT\n    order_id,\n    previous_provider,\n    payment_provider AS retry_provider,\n    attempt_number,\n    previous_status,\n    payment_status\nFROM payment_sequence\nWHERE previous_status = 'failed'\nAND previous_provider != payment_provider;",
  },
  
  {
    id: 70,
    title: "Customer Value Concentration Risk",
    slug: "customer-value-concentration-pareto-sql",
    seoTitle: "Corporate Risk SQL: 80/20 Pareto Concentration Analysis",
    metaDescription: "Construct a running cumulative percentage matrix in SQL using partitioned sums to execute an advanced enterprise Pareto risk assessment.",
    difficulty: "Elite",
    description: "Identify if a small set of customers contribute disproportionate revenue.",
    explanation: "Pareto analysis on customers.",
    scenario: "Business risk analysis.",
    useCases: ["Revenue concentration", "Risk"],
    tags: ["Cumulative Window Sum", "Pareto Principle", "Risk Assessment", "Customer Analytics"],
    hint: "Cumulative revenue",
    starterQuery: "SELECT customer_id FROM orders;",
    expectedColumns: ["customer_id"],
    expectedRowCount: 5,
    solutionQuery: "WITH customer_revenue AS (\n    SELECT\n        customer_id,\n        ROUND(SUM(total_amount), 2) AS total_revenue\n    FROM orders\n    GROUP BY customer_id\n),\nranked_customers AS (\n    SELECT\n        customer_id,\n        total_revenue,\n        ROUND(\n            SUM(total_revenue) OVER (\n                ORDER BY total_revenue DESC\n            ) * 100.0 /\n            SUM(total_revenue) OVER (),\n            2\n        ) AS cumulative_revenue_pct\n    FROM customer_revenue\n)\nSELECT\n    customer_id,\n    total_revenue,\n    cumulative_revenue_pct\nFROM ranked_customers\nWHERE cumulative_revenue_pct <= 80\nORDER BY total_revenue DESC;",
  },
              
  {
    id: 71,
    title: "Delivery Partner Lifecycle Drop-off",
    slug: "delivery-partner-lifecycle-drop-off-sql",
    seoTitle: "Gig Economy Logistics SQL: Attrition and Partner Retention Index",
    metaDescription: "Apply date comparative timestamps against active delivery logs to evaluate localized gig worker retention periods and churn statuses.",
    difficulty: "Elite",
    description: "Identify partners who were active initially but stopped delivering.",
    explanation: "Compare joining_date vs last_active_date and deliveries.",
    scenario: "Operations retention.",
    useCases: ["Partner churn", "Workforce"],
    tags: ["Workforce Analytics", "Conditional Flags", "Operations Matrix", "Date Calculations"],
    hint: "Compare joining_date vs last_active_date",
    starterQuery: "SELECT delivery_partner_id FROM delivery_partners;",
    expectedColumns: ["delivery_partner_id"],
    expectedRowCount: 4,
    solutionQuery: "SELECT\n    delivery_partner_id,\n    partner_name,\n    joining_date,\n    last_active_date,\n    total_deliveries,\n    ROUND(\n        julianday('now') - julianday(last_active_date),\n        2\n    ) AS inactive_days,\n    CASE\n        WHEN julianday('now') - julianday(last_active_date) > 90 THEN 'Dropped Off'\n        WHEN julianday('now') - julianday(last_active_date) > 30 THEN 'At Risk'\n        ELSE 'Active'\n    END AS partner_status\nFROM delivery_partners\nORDER BY inactive_days DESC;",
  },
  
  {
    id: 72,
    title: "Customer Experience Degradation Timeline",
    slug: "customer-experience-degradation-timeline-sql",
    seoTitle: "Trend Analytics SQL: Mapping MoM Customer Sentiment Drift",
    metaDescription: "Examine chronological changes in user survey responses using combinations of monthly groupers and sequential window variations.",
    difficulty: "Elite",
    description: "Detect when customer satisfaction started declining.",
    explanation: "Track rating trends over time.",
    scenario: "CX monitoring.",
    useCases: ["Experience", "Trend"],
    tags: ["Time Series", "MoM Trends", "Customer Feedback", "Window Functions"],
    hint: "ORDER BY feedback created_at",
    starterQuery: "SELECT rating, created_at FROM feedback;",
    expectedColumns: ["rating", "created_at"],
    expectedRowCount: 10,
    solutionQuery: "SELECT\n    strftime('%Y-%m', created_at) AS feedback_month,\n    ROUND(AVG(rating), 2) AS avg_rating,\n    COUNT(feedback_id) AS total_feedback,\n    ROUND(\n        AVG(rating) - LAG(AVG(rating)) OVER (\n            ORDER BY strftime('%Y-%m', created_at)\n        ),\n        2\n    ) AS rating_change\nFROM feedback\nGROUP BY feedback_month\nORDER BY feedback_month;",
  },
  
  {
    id: 73,
    title: "Order Fulfillment Speed Analysis",
    slug: "order-fulfillment-speed-analysis",
    seoTitle: "Advanced SQL Order Fulfillment Speed Analysis",
    metaDescription: "Analyze delivery turnaround times and classify orders based on fulfillment speed using SQL.",
    difficulty: "Elite",
    description: "Measure the time taken to fulfill each delivered order and classify delivery performance.",
    explanation: "Calculate the number of days between order placement and delivery, then categorize orders into different fulfillment speed buckets.",
    scenario: "The operations team wants to monitor delivery performance and identify slow-moving orders that impact customer satisfaction.",
    useCases: [
      "Operations Analytics",
      "Delivery Performance",
      "SLA Monitoring"
    ],
    tags: [
      "Date Functions",
      "CASE Statement",
      "Operations Analytics",
      "Business Intelligence"
    ],
    hint: "Use julianday() and CASE.",
    starterQuery: "SELECT order_id, order_date, delivered_date FROM orders;",
    expectedColumns: [
      "order_id",
      "customer_id",
      "order_date",
      "delivered_date",
      "delivery_days",
      "delivery_speed"
    ],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "SELECT\n    order_id,\n    customer_id,\n    order_date,\n    delivered_date,\n    CAST(julianday(delivered_date) - julianday(order_date) AS INTEGER) AS delivery_days,\n    CASE\n        WHEN julianday(delivered_date) - julianday(order_date) <= 2 THEN 'Fast Delivery'\n        WHEN julianday(delivered_date) - julianday(order_date) <= 5 THEN 'Standard Delivery'\n        ELSE 'Delayed Delivery'\n    END AS delivery_speed\nFROM orders\nWHERE delivered_date IS NOT NULL\nORDER BY delivery_days DESC\nLIMIT 10;"
  },
  
  {
    id: 74,
    title: "Cross-Category Purchase Migration",
    slug: "cross-category-purchase-migration-sql",
    seoTitle: "Customer Behavior SQL: Tracking Multi-Period Purchase Shifts",
    metaDescription: "Write advanced multi-layered SQL CTE blocks to identify user purchasing trend transfers between distinct historic and current windows.",
    difficulty: "Elite",
    description: "Track how customers shift spending across categories over time.",
    explanation: "Compare category spend in early vs recent periods.",
    scenario: "Product strategy.",
    useCases: ["Behavior", "Segmentation"],
    tags: ["Customer Journey", "Cohort Segmentation", "Advanced CTEs", "Spending Trends"],
    hint: "Split time windows",
    starterQuery: "SELECT category FROM products;",
    expectedColumns: ["category"],
    expectedRowCount: 5,
    solutionQuery: "WITH category_periods AS (\n    SELECT\n        o.customer_id,\n        p.category,\n        CASE\n            WHEN o.order_date < DATE('now', '-6 months') THEN 'Early'\n            ELSE 'Recent'\n        END AS purchase_period,\n        ROUND(SUM(oi.total_price), 2) AS category_spend\n    FROM orders o\n    JOIN order_items oi\n        ON o.order_id = oi.order_id\n    JOIN products p\n        ON oi.product_id = p.product_id\n    GROUP BY o.customer_id, p.category, purchase_period\n)\nSELECT\n    customer_id,\n    category,\n    purchase_period,\n    category_spend\nFROM category_periods\nORDER BY customer_id, category_spend DESC;",
  },
  
  {
    id: 75,
    title: "Geo-Level Pricing Sensitivity",
    slug: "geo-level-pricing-sensitivity-sql",
    seoTitle: "Geospatial Revenue SQL: Identifying Regional Price Elasticity",
    metaDescription: "Group transactional values against location elements to discover average promotional discount interactions by area code.",
    difficulty: "Elite",
    description: "Analyze how pricing and discounts impact different regions.",
    explanation: "Combine geography with pricing fields.",
    scenario: "Regional pricing strategy.",
    useCases: ["Pricing", "Geo"],
    tags: ["Geospatial Analysis", "Pricing Strategy", "Multi-Level Aggregation", "Revenue Optimisation"],
    hint: "GROUP BY city/state/country",
    starterQuery: "SELECT city, state FROM customers;",
    expectedColumns: ["city", "state"],
    expectedRowCount: 6,
    solutionQuery: "SELECT\n    c.country,\n    c.state,\n    c.city,\n    COUNT(o.order_id) AS total_orders,\n    ROUND(AVG(o.discount_amount), 2) AS avg_discount,\n    ROUND(AVG(o.total_amount), 2) AS avg_order_value,\n    ROUND(SUM(o.total_amount), 2) AS total_revenue\nFROM customers c\nJOIN orders o\n    ON c.customer_id = o.customer_id\nGROUP BY c.country, c.state, c.city\nORDER BY avg_discount DESC, total_revenue DESC;",
  },
  
  {
    id: 76,
    title: "Customer Conversion Funnel Leakage",
    slug: "customer-conversion-funnel-leakage-sql",
    seoTitle: "Growth Hacking SQL: Aggregating End-to-End Funnel Conversion",
    metaDescription: "Map transaction drop-off counts at every stage from signup to delivery using SQL UNION sets for comprehensive funnel analytics.",
    difficulty: "Elite",
    description: "Identify where maximum drop-off happens in funnel and quantify loss.",
    explanation: "Track counts across each stage.",
    scenario: "Growth optimization.",
    useCases: ["Funnel", "Conversion"],
    tags: ["Conversion Funnel", "Growth Analytics", "UNION Structures", "Data Auditing"],
    hint: "COUNT DISTINCT across tables",
    starterQuery: "SELECT COUNT(*) FROM customers;",
    expectedColumns: ["stage", "count"],
    expectedRowCount: 4,
    solutionQuery: "SELECT\n    'Customers Signed Up' AS stage,\n    COUNT(DISTINCT customer_id) AS customer_count\nFROM customers\n\nUNION ALL\n\nSELECT\n    'Customers Ordered' AS stage,\n    COUNT(DISTINCT customer_id) AS customer_count\nFROM orders\n\nUNION ALL\n\nSELECT\n    'Successful Payments' AS stage,\n    COUNT(DISTINCT order_id) AS customer_count\nFROM payments\nWHERE payment_status = 'success'\n\nUNION ALL\n\nSELECT\n    'Orders Delivered' AS stage,\n    COUNT(DISTINCT order_id) AS customer_count\nFROM orders\nWHERE delivered_date IS NOT NULL;",
  },
  
  {
    id: 77,
    title: "Product Cost Inflation Detection",
    slug: "product-cost-inflation-detection-sql",
    seoTitle: "Margin Protection SQL: Monitoring Product Cost Inflation Risks",
    metaDescription: "Write advanced margin ratio filters to isolate inventory units suffering compressed profitability due to rising supply procurement costs.",
    difficulty: "Elite",
    description: "Identify products where cost_price is increasing faster than selling price.",
    explanation: "Compare cost trends vs price trends.",
    scenario: "Profit risk.",
    useCases: ["Margins", "Cost control"],
    tags: ["Cost Control", "Margin Protection", "Asset Inflation", "E-commerce Economics"],
    hint: "Compare cost_price vs price",
    starterQuery: "SELECT product_id FROM products;",
    expectedColumns: ["product_id"],
    expectedRowCount: 5,
    solutionQuery: "SELECT\n    product_id,\n    product_name,\n    ROUND(price, 2) AS selling_price,\n    ROUND(cost_price, 2) AS cost_price,\n    ROUND(price - cost_price, 2) AS margin,\n    ROUND(\n        ((price - cost_price) * 100.0) / price,\n        2\n    ) AS margin_pct,\n    CASE\n        WHEN cost_price / price > 0.8 THEN 'High Cost Risk'\n        WHEN cost_price / price > 0.6 THEN 'Moderate Risk'\n        ELSE 'Healthy Margin'\n    END AS profitability_status\nFROM products\nORDER BY margin_pct ASC;",
  },
  
  {
    id: 78,
    title: "Order Status Revenue Analysis",
    slug: "order-status-revenue-analysis",
    seoTitle: "Advanced SQL Order Status Revenue Analysis",
    metaDescription: "Analyze revenue, order volume, and average order value by order status using SQL aggregations.",
    difficulty: "Elite",
    description: "Compare order volume and revenue across different order statuses.",
    explanation: "Group orders by their current status and calculate total orders, revenue, and average order value.",
    scenario: "The operations team wants to understand which order statuses contribute the most revenue and identify potential operational bottlenecks.",
    useCases: [
      "Operations Analytics",
      "Revenue Reporting",
      "Business Dashboard"
    ],
    tags: [
      "GROUP BY",
      "Business Analytics",
      "Revenue Analysis",
      "Order Management"
    ],
    hint: "Aggregate orders by order_status.",
    starterQuery: "SELECT order_status, total_amount FROM orders;",
    expectedColumns: [
      "order_status",
      "total_orders",
      "total_revenue",
      "average_order_value"
    ],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "SELECT\n    order_status,\n    COUNT(order_id) AS total_orders,\n    ROUND(SUM(total_amount),2) AS total_revenue,\n    ROUND(AVG(total_amount),2) AS average_order_value\nFROM orders\nGROUP BY order_status\nORDER BY total_revenue DESC;"
  },
  {
    id: 79,
    title: "Customer Feedback Trustworthiness",
    slug: "customer-feedback-trustworthiness-sql",
    seoTitle: "NLP Text Parsing SQL: Auditing Review & Sentiment Congruence",
    metaDescription: "Apply explicit text keyword criteria patterns over numerical survey scoring fields to audit user sentiment validity anomalies.",
    difficulty: "Elite",
    description: "Detect inconsistencies between rating and review_text.",
    explanation: "Text vs numeric mismatch.",
    scenario: "Feedback quality audit.",
    useCases: ["Sentiment", "Trust"],
    tags: ["Text Pattern Matching", "LOWER Functions", "Sentiment Discrepancies", "Feedback Integrity"],
    hint: "rating vs keywords",
    starterQuery: "SELECT rating, review_text FROM feedback;",
    expectedColumns: ["rating", "review_text"],
    expectedRowCount: 5,
    solutionQuery: "SELECT\n    feedback_id,\n    customer_id,\n    rating,\n    review_text,\n    CASE\n        WHEN rating >= 4\n             AND (\n                 LOWER(review_text) LIKE '%bad%'\n                 OR LOWER(review_text) LIKE '%poor%'\n                 OR LOWER(review_text) LIKE '%terrible%'\n             ) THEN 'Positive Rating with Negative Review'\n        WHEN rating <= 2\n             AND (\n                 LOWER(review_text) LIKE '%great%'\n                 OR LOWER(review_text) LIKE '%excellent%'\n                 OR LOWER(review_text) LIKE '%amazing%'\n             ) THEN 'Negative Rating with Positive Review'\n        ELSE 'Consistent'\n    END AS feedback_consistency\nFROM feedback\nWHERE review_text IS NOT NULL;",
  },
  
  {
    id: 80,
    title: "Full Business Risk Dashboard",
    slug: "full-business-risk-dashboard-sql",
    seoTitle: "Executive Reporting SQL: Consolidating Corporate Risk Vectors",
    metaDescription: "Synthesize operational risk indicators across logistics delays, financial returns, and attrition risks into a single unified business health matrix.",
    difficulty: "Elite (FAANG)",
    description: "Build a unified view showing revenue risk, churn risk, delivery risk, and payment risk.",
    explanation: "Combine all risk indicators across tables.",
    scenario: "CEO wants a risk overview.",
    useCases: ["Risk", "BI"],
    tags: ["Executive Scorecards", "Multi-Source Metrics", "Risk Mapping", "Advanced Aggregations"],
    hint: "Combine all tables and metrics",
    starterQuery: "SELECT COUNT(*) FROM orders;",
    expectedColumns: ["risk_type", "metric"],
    expectedRowCount: 6,
    solutionQuery: "SELECT\n    'Revenue Risk' AS risk_type,\n    ROUND(SUM(discount_amount), 2) AS metric\nFROM orders\n\nUNION ALL\n\nSELECT\n    'Refund Risk' AS risk_type,\n    ROUND(SUM(refund_amount), 2) AS metric\nFROM payments\n\nUNION ALL\n\nSELECT\n    'Failed Payment Risk' AS risk_type,\n    ROUND(SUM(amount), 2) AS metric\nFROM payments\nWHERE payment_status = 'failed'\n\nUNION ALL\n\nSELECT\n    'Delivery Delay Risk' AS risk_type,\n    ROUND(\n        AVG(\n            julianday(delivered_date) - julianday(estimated_delivery_time)\n        ),\n        2\n    ) AS metric\nFROM orders\nWHERE delivered_date IS NOT NULL\n\nUNION ALL\n\nSELECT\n    'Customer Churn Risk' AS risk_type,\n    COUNT(*) AS metric\nFROM customers\nWHERE julianday('now') - julianday(last_order_date) > 90\n\nUNION ALL\n\nSELECT\n    'Customer Experience Risk' AS risk_type,\n    ROUND(AVG(rating), 2) AS metric\nFROM feedback;",
  },
  
  {
    id: 81,
    title: "Enterprise Revenue Reconciliation Audit",
    slug: "enterprise-revenue-reconciliation-audit",
    seoTitle: "Advanced SQL Revenue Reconciliation & Financial Integrity Audit",
    metaDescription: "Perform a full financial reconciliation by comparing order totals, item totals, and payment collections across regions and currencies using multiple CTEs.",
    difficulty: "Elite+",
    description: "Audit financial integrity by reconciling order totals, item totals, and collected payments for every region and currency.",
    explanation: "Aggregate orders, order items, and payments separately before comparing financial totals to identify reconciliation issues.",
    scenario: "During quarter-end financial closing, the finance team discovered discrepancies between customer orders, invoice line items, and payment collections. They need a reconciliation report highlighting every mismatch by country, currency, and month.",
    useCases: [
      "Financial Auditing",
      "Revenue Reconciliation",
      "Data Quality",
      "Finance Reporting"
    ],
    tags: [
      "CTE",
      "Financial Audit",
      "Revenue Reconciliation",
      "Data Integrity"
    ],
    hint: "Aggregate each fact table separately before joining the results.",
    starterQuery: "SELECT order_id, total_amount, currency FROM orders;",
    expectedColumns: [
      "revenue_month",
      "country",
      "currency",
      "order_total",
      "item_total",
      "payment_total",
      "order_item_gap",
      "order_payment_gap",
      "audit_status"
    ],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH order_summary AS (\n\
  SELECT\n\
  o.order_id,\n\
  strftime('%Y-%m',o.order_date) AS revenue_month,\n\
  c.country,\n\
  o.currency,\n\
  o.total_amount\n\
  FROM orders o\n\
  JOIN customers c\n\
  ON o.customer_id=c.customer_id\n\
  ),\n\
  item_summary AS (\n\
  SELECT\n\
  order_id,\n\
  SUM(total_price) AS item_total\n\
  FROM order_items\n\
  GROUP BY order_id\n\
  ),\n\
  payment_summary AS (\n\
  SELECT\n\
  order_id,\n\
  SUM(amount) AS payment_total\n\
  FROM payments\n\
  GROUP BY order_id\n\
  )\n\
  SELECT\n\
  os.revenue_month,\n\
  os.country,\n\
  os.currency,\n\
  ROUND(SUM(os.total_amount),2) AS order_total,\n\
  ROUND(SUM(COALESCE(isu.item_total,0)),2) AS item_total,\n\
  ROUND(SUM(COALESCE(ps.payment_total,0)),2) AS payment_total,\n\
  ROUND(SUM(os.total_amount)-SUM(COALESCE(isu.item_total,0)),2) AS order_item_gap,\n\
  ROUND(SUM(os.total_amount)-SUM(COALESCE(ps.payment_total,0)),2) AS order_payment_gap,\n\
  CASE\n\
  WHEN ABS(SUM(os.total_amount)-SUM(COALESCE(isu.item_total,0)))<0.01\n\
  AND ABS(SUM(os.total_amount)-SUM(COALESCE(ps.payment_total,0)))<0.01\n\
  THEN 'Balanced'\n\
  ELSE 'Mismatch Detected'\n\
  END AS audit_status\n\
  FROM order_summary os\n\
  LEFT JOIN item_summary isu\n\
  ON os.order_id=isu.order_id\n\
  LEFT JOIN payment_summary ps\n\
  ON os.order_id=ps.order_id\n\
  GROUP BY\n\
  os.revenue_month,\n\
  os.country,\n\
  os.currency\n\
  ORDER BY\n\
  ABS(SUM(os.total_amount)-SUM(COALESCE(ps.payment_total,0))) DESC,\n\
  ABS(SUM(os.total_amount)-SUM(COALESCE(isu.item_total,0))) DESC;"
  },

  {
  id: 82,
  title: "Customer Revenue Segmentation Dashboard",
  slug: "customer-revenue-segmentation-dashboard",
  seoTitle: "Advanced SQL Customer Revenue Segmentation using Window Functions",
  metaDescription: "Segment customers into High, Medium, and Low value groups based on their contribution to total revenue using advanced SQL analytics.",
  difficulty: "Elite+",
  description: "Build a customer revenue segmentation dashboard by calculating each customer's lifetime revenue, percentage contribution, cumulative revenue, and business segment.",
  explanation: "Aggregate customer revenue, rank customers by spending, calculate cumulative revenue, and classify them into business segments using window functions.",
  scenario: "The marketing team wants to identify VIP customers, regular customers, and low-value customers to create personalized campaigns and loyalty programs.",
  useCases: [
    "Customer Segmentation",
    "Marketing Analytics",
    "Executive Dashboard",
    "Revenue Analysis"
  ],
  tags: [
    "CTE",
    "Window Functions",
    "Cumulative Sum",
    "Business Intelligence"
  ],
  hint: "Aggregate customer revenue first, then use SUM() OVER() to calculate cumulative revenue percentages.",
  starterQuery: "SELECT customer_id, total_amount FROM orders;",
  expectedColumns: [
    "customer_id",
    "customer_name",
    "lifetime_revenue",
    "revenue_percentage",
    "cumulative_percentage",
    "customer_segment"
  ],
  expectedRowCount: 10,
  validateBy: "exact",
  solutionQuery: "WITH customer_revenue AS (\n\
SELECT\n\
c.customer_id,\n\
c.customer_name,\n\
SUM(o.total_amount) AS lifetime_revenue\n\
FROM customers c\n\
JOIN orders o\n\
ON c.customer_id=o.customer_id\n\
GROUP BY c.customer_id,c.customer_name\n\
),\n\
ranked_customers AS (\n\
SELECT\n\
customer_id,\n\
customer_name,\n\
lifetime_revenue,\n\
SUM(lifetime_revenue) OVER() AS total_revenue,\n\
SUM(lifetime_revenue) OVER(ORDER BY lifetime_revenue DESC) AS cumulative_revenue\n\
FROM customer_revenue\n\
)\n\
SELECT\n\
customer_id,\n\
customer_name,\n\
ROUND(lifetime_revenue,2) AS lifetime_revenue,\n\
ROUND(lifetime_revenue*100.0/total_revenue,2) AS revenue_percentage,\n\
ROUND(cumulative_revenue*100.0/total_revenue,2) AS cumulative_percentage,\n\
CASE\n\
WHEN cumulative_revenue*100.0/total_revenue<=20 THEN 'VIP'\n\
WHEN cumulative_revenue*100.0/total_revenue<=60 THEN 'High Value'\n\
WHEN cumulative_revenue*100.0/total_revenue<=90 THEN 'Medium Value'\n\
ELSE 'Low Value'\n\
END AS customer_segment\n\
FROM ranked_customers\n\
ORDER BY lifetime_revenue DESC;"
},
  
{
  id: 83,
  title: "Payment Provider Revenue & Success Analysis",
  slug: "payment-provider-revenue-success-analysis",
  seoTitle: "Advanced SQL Payment Provider Performance Dashboard",
  metaDescription: "Analyze payment provider performance by comparing transaction volume, revenue, average transaction value, and success rates using advanced SQL.",
  difficulty: "Elite+",
  description: "Evaluate the performance of each payment provider by analyzing transaction volume, successful payments, revenue collected, and average transaction value.",
  explanation: "Aggregate payment metrics by provider and calculate success rates and revenue KPIs for operational reporting.",
  scenario: "The finance team wants to compare payment gateways to determine which provider processes the highest revenue while maintaining the best payment success rate.",
  useCases: [
    "Finance Dashboard",
    "Payment Analytics",
    "Gateway Performance",
    "Executive Reporting"
  ],
  tags: [
    "CASE",
    "Conditional Aggregation",
    "Business Intelligence",
    "Finance Analytics"
  ],
  hint: "Use CASE expressions inside SUM() and COUNT().",
  starterQuery: "SELECT payment_provider, payment_status, amount FROM payments;",
  expectedColumns: [
    "payment_provider",
    "total_transactions",
    "successful_transactions",
    "success_rate",
    "total_revenue",
    "average_transaction_value"
  ],
  expectedRowCount: 10,
  validateBy: "exact",
  solutionQuery: "SELECT\n    payment_provider,\n    COUNT(payment_id) AS total_transactions,\n    SUM(CASE WHEN payment_status='Completed' THEN 1 ELSE 0 END) AS successful_transactions,\n    ROUND(\n        SUM(CASE WHEN payment_status='Completed' THEN 1.0 ELSE 0 END) * 100.0 /\n        COUNT(payment_id),\n        2\n    ) AS success_rate,\n    ROUND(\n        SUM(CASE WHEN payment_status='Completed' THEN amount ELSE 0 END),\n        2\n    ) AS total_revenue,\n    ROUND(\n        AVG(CASE WHEN payment_status='Completed' THEN amount END),\n        2\n    ) AS average_transaction_value\nFROM payments\nGROUP BY payment_provider\nORDER BY total_revenue DESC;"
},
  
{
  id: 84,
  title: "Delivery Partner Performance Scorecard",
  slug: "delivery-partner-performance-scorecard",
  seoTitle: "Advanced SQL Delivery Partner Performance Dashboard",
  metaDescription: "Evaluate delivery partner performance by analyzing completed orders, revenue, average delivery time, and average order value using SQL.",
  difficulty: "Elite+",
  description: "Build a performance scorecard for each delivery partner by comparing completed deliveries, generated revenue, average delivery time, and average order value.",
  explanation: "Combine delivery partner and order data to calculate operational KPIs used for partner evaluation.",
  scenario: "The operations team conducts a quarterly review to determine which delivery partners consistently deliver orders efficiently while generating the highest business value.",
  useCases: [
    "Operations Dashboard",
    "Partner Performance",
    "SLA Monitoring",
    "Executive Reporting"
  ],
  tags: [
    "CTE",
    "Business Intelligence",
    "Operations Analytics",
    "Date Functions"
  ],
  hint: "Calculate delivery KPIs by joining delivery_partners with orders.",
  starterQuery: "SELECT delivery_partner_id, partner_name FROM delivery_partners;",
  expectedColumns: [
    "delivery_partner_id",
    "partner_name",
    "completed_orders",
    "total_revenue",
    "average_order_value",
    "average_delivery_days"
  ],
  expectedRowCount: 10,
  validateBy: "exact",
  solutionQuery: "SELECT\n    dp.delivery_partner_id,\n    dp.partner_name,\n    COUNT(o.order_id) AS completed_orders,\n    ROUND(SUM(o.total_amount),2) AS total_revenue,\n    ROUND(AVG(o.total_amount),2) AS average_order_value,\n    ROUND(AVG(julianday(o.delivered_date)-julianday(o.order_date)),2) AS average_delivery_days\nFROM delivery_partners dp\nJOIN orders o\n    ON dp.delivery_partner_id=o.delivery_partner_id\nWHERE o.delivered_date IS NOT NULL\nGROUP BY dp.delivery_partner_id,dp.partner_name\nORDER BY total_revenue DESC,average_delivery_days ASC;"
},
  {
    id: 85,
    title: "Price–Discount–Demand Elasticity by Region",
    slug: "price-discount-demand-elasticity-by-region-sql",
    seoTitle: "Pricing Strategy SQL: Region-Wise Price Elasticity Modeling",
    metaDescription: "Extract purchasing volume response structures relative to discount distributions across cascading geographical parameters.",
    difficulty: "Elite+",
    description: "Model how price, discount, and demand interact across country/state/city and product category.",
    explanation: "Join products, order_items, orders, customers; analyze quantity vs (price, discount) by geo and category.",
    scenario: "Strategy team wants region-wise elasticity signals.",
    useCases: ["Pricing", "Strategy", "Geo"],
    tags: ["Price Elasticity", "Strategic Analytics", "Geographical Groupings", "Revenue Maximization"],
    hint: "Aggregate quantity vs price/discount by geo and category",
    starterQuery: "SELECT p.category, c.country, SUM(oi.quantity)\nFROM order_items oi JOIN products p ON oi.product_id=p.product_id\nJOIN orders o ON oi.order_id=o.order_id\nJOIN customers c ON o.customer_id=c.customer_id\nGROUP BY p.category, c.country;",
    expectedColumns: ["category", "country", "metric"],
    expectedRowCount: 12,
    solutionQuery: "SELECT\n    p.category,\n    c.country,\n    c.state,\n    c.city,\n    ROUND(AVG(oi.unit_price), 2) AS avg_unit_price,\n    ROUND(AVG(oi.discount_amount), 2) AS avg_discount,\n    SUM(oi.quantity) AS total_quantity_sold,\n    ROUND(SUM(oi.total_price), 2) AS total_revenue\nFROM order_items oi\nJOIN products p\n    ON oi.product_id = p.product_id\nJOIN orders o\n    ON oi.order_id = o.order_id\nJOIN customers c\n    ON o.customer_id = c.customer_id\nGROUP BY p.category, c.country, c.state, c.city\nORDER BY total_quantity_sold DESC;",
  },
  
  {
    id: 86,
    title: "Cross-Channel Funnel Attribution with Leakage",
    slug: "cross-channel-funnel-attribution-leakage-sql",
    seoTitle: "Marketing Attribution SQL: End-to-End Funnel Leakage Map",
    metaDescription: "Build multi-stage customer marketing conversion models tracking acquisition retention efficiencies via complex nested union scripts.",
    difficulty: "Elite+",
    description: "Build a funnel from signup→activation→order→successful payment→delivery→feedback and quantify leakage per acquisition_channel.",
    explanation: "Use customers.created_date/activated_date, orders, payments, delivery timestamps, feedback presence.",
    scenario: "Growth wants leakage per channel end-to-end.",
    useCases: ["Funnel", "Attribution"],
    tags: ["Marketing Attribution", "Conversion Paths", "Multi-Phase Funnel", "Data Mining"],
    hint: "COUNT DISTINCT users at each stage grouped by acquisition_channel",
    starterQuery: "SELECT acquisition_channel, COUNT(*) FROM customers GROUP BY acquisition_channel;",
    expectedColumns: ["acquisition_channel", "stage", "count"],
    expectedRowCount: 12,
    solutionQuery: "SELECT\n    acquisition_channel,\n    'Signed Up' AS funnel_stage,\n    COUNT(DISTINCT customer_id) AS customer_count\nFROM customers\nGROUP BY acquisition_channel\n\nUNION ALL\n\nSELECT\n    acquisition_channel,\n    'Activated' AS funnel_stage,\n    COUNT(DISTINCT customer_id) AS customer_count\nFROM customers\nWHERE activated_date IS NOT NULL\nGROUP BY acquisition_channel\n\nUNION ALL\n\nSELECT\n    c.acquisition_channel,\n    'Placed Order' AS funnel_stage,\n    COUNT(DISTINCT o.customer_id) AS customer_count\nFROM customers c\nJOIN orders o\n    ON c.customer_id = o.customer_id\nGROUP BY c.acquisition_channel\n\nUNION ALL\n\nSELECT\n    c.acquisition_channel,\n    'Successful Payment' AS funnel_stage,\n    COUNT(DISTINCT o.customer_id) AS customer_count\nFROM customers c\nJOIN orders o\n    ON c.customer_id = o.customer_id\nJOIN payments p\n    ON o.order_id = p.order_id\nWHERE p.payment_status = 'success'\nGROUP BY c.acquisition_channel\n\nUNION ALL\n\nSELECT\n    c.acquisition_channel,\n    'Delivered' AS funnel_stage,\n    COUNT(DISTINCT o.customer_id) AS customer_count\nFROM customers c\nJOIN orders o\n    ON c.customer_id = o.customer_id\nWHERE o.delivered_date IS NOT NULL\nGROUP BY c.acquisition_channel\n\nUNION ALL\n\nSELECT\n    c.acquisition_channel,\n    'Feedback Given' AS funnel_stage,\n    COUNT(DISTINCT f.customer_id) AS customer_count\nFROM customers c\nJOIN feedback f\n    ON c.customer_id = f.customer_id\nGROUP BY c.acquisition_channel;",
  },
  {
    id: 87,
    title: "Product Profit True-Up (Cost vs Item-Level Reality)",
    slug: "product-profit-true-up-sql-reconciliation",
    seoTitle: "Financial Reconciliation SQL: Product Margin Profit True-Up",
    metaDescription: "Master item-level profit reconciliation in SQL. Learn to true-up realized margins by factoring in item prices, distributed discounts, taxes, and refunds.",
    difficulty: "Elite+",
    description: "Reconcile product-level profit using products.cost_price vs realized unit_price, discounts, taxes, and refunds.",
    explanation: "Compute profit at item level and adjust for order-level discounts and payment refunds.",
    scenario: "Finance suspects product margins are overstated.",
    useCases: ["Profitability", "Audit"],
    tags: ["Financial Controls", "Margin Reconciliation", "LEFT JOIN Operations", "Gross Sales Calculation"],
    hint: "Use order_items.unit_price, discount_amount, tax_amount and payments.refund_amount",
    starterQuery: "SELECT p.product_id FROM products p;",
    expectedColumns: ["product_id", "metric"],
    expectedRowCount: 10,
    solutionQuery: "SELECT\n    p.product_id,\n    p.product_name,\n    ROUND(SUM(oi.quantity * oi.unit_price), 2) AS gross_sales,\n    ROUND(SUM(oi.discount_amount), 2) AS total_discount,\n    ROUND(SUM(oi.tax_amount), 2) AS total_tax,\n    ROUND(COALESCE(SUM(pm.refund_amount), 0), 2) AS total_refunds,\n    ROUND(SUM(p.cost_price * oi.quantity), 2) AS total_cost,\n    ROUND(\n        SUM(oi.total_price)\n        - SUM(p.cost_price * oi.quantity)\n        - COALESCE(SUM(pm.refund_amount), 0),\n        2\n    ) AS adjusted_profit\nFROM products p\nJOIN order_items oi\n    ON p.product_id = oi.product_id\nLEFT JOIN orders o\n    ON oi.order_id = o.order_id\nLEFT JOIN payments pm\n    ON o.order_id = pm.order_id\nGROUP BY p.product_id, p.product_name\nORDER BY adjusted_profit DESC;",
  },
  
  {
    id: 88,
    title: "Customer Lifecycle State Machine (Robust)",
    slug: "customer-lifecycle-state-machine-sql",
    seoTitle: "Advanced CRM Analytics: Building a Customer Lifecycle State Machine in SQL",
    metaDescription: "Write complex date-threshold conditional CASE blocks to cleanly segment users into active, at-risk, and churned programmatic states.",
    difficulty: "Elite+",
    description: "Classify customers into New, Activated, Active, At-Risk, Churned using created_date, activated_date, last_login_date, last_order_date and recent order/payment behavior.",
    explanation: "Define states using multiple timestamps and activity windows.",
    scenario: "CRM needs precise lifecycle states for campaigns.",
    useCases: ["Lifecycle", "CRM"],
    tags: ["State Machines", "Cohort Lifecycles", "Date Thresholds", "CRM Optimization"],
    hint: "Use CASE with multiple date thresholds",
    starterQuery: "SELECT customer_id, created_date, activated_date, last_login_date, last_order_date FROM customers;",
    expectedColumns: ["customer_id", "state"],
    expectedRowCount: 10,
    solutionQuery: "SELECT\n    customer_id,\n    customer_name,\n    created_date,\n    activated_date,\n    last_login_date,\n    last_order_date,\n    CASE\n        WHEN activated_date IS NULL THEN 'New'\n        WHEN last_order_date >= DATE('now', '-30 days') THEN 'Active'\n        WHEN last_order_date >= DATE('now', '-90 days') THEN 'At-Risk'\n        WHEN last_order_date < DATE('now', '-90 days') THEN 'Churned'\n        ELSE 'Activated'\n    END AS lifecycle_state\nFROM customers\nORDER BY lifecycle_state;",
  },
  
  {
    id: 89,
    title: "Order Status vs Payment Status Consistency",
    slug: "order-payment-status-consistency-sql",
    seoTitle: "Data Quality Audit: Catching Order and Payment State Contradictions",
    metaDescription: "Examine multi-table transactional records for processing edge cases like delivered products tied to failed payment gateways.",
    difficulty: "Elite+",
    description: "Detect inconsistencies between order_status, payment_status, cancelled_date, delivered_date across currencies.",
    explanation: "Cross-validate lifecycle fields for logical contradictions.",
    scenario: "Data team found inconsistent states in production.",
    useCases: ["Data quality", "Audit"],
    tags: ["Data Engineering Quality", "Logical Anomalies", "Exception Reporting", "State Auditing"],
    hint: "Find Delivered orders with Failed payments, Cancelled after Delivered, etc.",
    starterQuery: "SELECT order_id, order_status, payment_status FROM orders o JOIN payments p ON o.order_id=p.order_id;",
    expectedColumns: ["order_id"],
    expectedRowCount: 8,
    solutionQuery: "SELECT\n    o.order_id,\n    o.currency,\n    o.order_status,\n    p.payment_status,\n    o.cancelled_date,\n    o.delivered_date,\n    CASE\n        WHEN o.order_status = 'delivered' AND p.payment_status = 'failed'\n            THEN 'Delivered with Failed Payment'\n        WHEN o.order_status = 'cancelled' AND o.delivered_date IS NOT NULL\n            THEN 'Cancelled after Delivery'\n        WHEN o.cancelled_date IS NOT NULL AND o.delivered_date IS NOT NULL\n            THEN 'Both Cancelled and Delivered'\n        WHEN o.order_status = 'pending' AND p.payment_status = 'success'\n            THEN 'Pending Order with Successful Payment'\n        ELSE 'Consistent'\n    END AS consistency_status\nFROM orders o\nJOIN payments p\n    ON o.order_id = p.order_id\nWHERE (\n    o.order_status = 'delivered' AND p.payment_status = 'failed'\n) OR (\n    o.order_status = 'cancelled' AND o.delivered_date IS NOT NULL\n) OR (\n    o.cancelled_date IS NOT NULL AND o.delivered_date IS NOT NULL\n) OR (\n    o.order_status = 'pending' AND p.payment_status = 'success'\n);",
  },
  
  {
    id: 90,
    title: "Partner Efficiency vs Workload vs Rating Triangle",
    slug: "partner-efficiency-workload-rating-triangle-sql",
    seoTitle: "Operations Balancing: Workload Volatility vs Partner Ratings SQL",
    metaDescription: "Model multi-variable constraints across logistics assignment rates, fulfillment lag times, and consumer sentiment scores.",
    difficulty: "Elite+",
    description: "Evaluate if higher workload (total_deliveries, assigned orders) degrades rating and increases delays by vehicle_type and city.",
    explanation: "Combine delivery_partners.total_deliveries, rating with order delays.",
    scenario: "Ops balancing load vs quality.",
    useCases: ["Optimization", "Performance"],
    tags: ["Capacity Optimization", "Gig Workload Density", "Fulfillment Latency", "Performance Multi-Join"],
    hint: "Join orders with delivery_partners and compute delays",
    starterQuery: "SELECT delivery_partner_id, rating, total_deliveries FROM delivery_partners;",
    expectedColumns: ["delivery_partner_id", "metric"],
    expectedRowCount: 10,
    solutionQuery: "SELECT\n    dp.delivery_partner_id,\n    dp.partner_name,\n    dp.vehicle_type,\n    dp.city,\n    dp.rating,\n    dp.total_deliveries,\n    COUNT(o.order_id) AS assigned_orders,\n    ROUND(\n        AVG(julianday(o.delivered_date) - julianday(o.estimated_delivery_time)),\n        2\n    ) AS avg_delay_days,\n    ROUND(AVG(o.total_amount), 2) AS avg_order_value\nFROM delivery_partners dp\nLEFT JOIN orders o\n    ON dp.delivery_partner_id = o.delivery_partner_id\nWHERE o.delivered_date IS NOT NULL\nGROUP BY dp.delivery_partner_id, dp.partner_name, dp.vehicle_type, dp.city, dp.rating, dp.total_deliveries\nORDER BY avg_delay_days DESC, dp.rating ASC;",
  },
  
  {
    id: 91,
    title: "Multi-Currency Revenue Normalization Gap",
    slug: "multi-currency-revenue-normalization-gap-sql",
    seoTitle: "Global Finance SQL: Spotting Multi-Currency Normalization Errors",
    metaDescription: "Audit global reporting systems by mapping variances between transaction declarations and actual banking gateway settlement currencies.",
    difficulty: "Elite+",
    description: "Identify distortions in revenue reporting due to mixing currencies without normalization.",
    explanation: "Aggregate by currency and compare shares vs totals.",
    scenario: "Global reporting inconsistency.",
    useCases: ["Finance", "Global"],
    tags: ["Multi-Currency Normalization", "Forex Discrepancies", "Corporate Audit", "Revenue Leakage"],
    hint: "GROUP BY orders.currency and payments.currency",
    starterQuery: "SELECT currency, SUM(total_amount) FROM orders GROUP BY currency;",
    expectedColumns: ["currency", "metric"],
    expectedRowCount: 6,
    solutionQuery: "SELECT\n    o.currency AS order_currency,\n    p.currency AS payment_currency,\n    COUNT(DISTINCT o.order_id) AS total_orders,\n    ROUND(SUM(o.total_amount), 2) AS order_revenue,\n    ROUND(SUM(p.amount), 2) AS payment_revenue,\n    ROUND(\n        SUM(o.total_amount) - SUM(p.amount),\n        2\n    ) AS normalization_gap\nFROM orders o\nJOIN payments p\n    ON o.order_id = p.order_id\nGROUP BY o.currency, p.currency\nORDER BY ABS(normalization_gap) DESC;",
  },
  
  {
    id: 92,
    title: "SKU-Level Volatility vs Inventory Risk",
    slug: "sku-level-volatility-inventory-risk-sql",
    seoTitle: "Supply Chain Analytics: SKU-Level Demand Volatility Analysis",
    metaDescription: "Calculate demand variance and identify catalog-to-cart selling price drift at individual SKU levels using advanced statistical math.",
    difficulty: "Elite+",
    description: "Find SKUs with high demand volatility and inconsistent pricing (price vs unit_price drift).",
    explanation: "Compare monthly quantity variance and price deviations.",
    scenario: "Inventory team wants to reduce stock risk.",
    useCases: ["Inventory", "Risk"],
    tags: ["Inventory Stock Protection", "SKU Risk Metrics", "Price Drift Index", "Demand Variance Math"],
    hint: "Use products.sku, order_items.unit_price, quantity",
    starterQuery: "SELECT sku FROM products;",
    expectedColumns: ["sku", "metric"],
    expectedRowCount: 10,
    solutionQuery: "SELECT\n    p.sku,\n    p.product_name,\n    ROUND(AVG(oi.unit_price), 2) AS avg_sold_price,\n    ROUND(p.price, 2) AS catalog_price,\n    ROUND(AVG(oi.unit_price) - p.price, 2) AS price_drift,\n    SUM(oi.quantity) AS total_quantity,\n    ROUND(\n        AVG(oi.quantity * oi.quantity) - AVG(oi.quantity) * AVG(oi.quantity),\n        2\n    ) AS demand_variance\nFROM products p\nJOIN order_items oi\n    ON p.product_id = oi.product_id\nGROUP BY p.sku, p.product_name, p.price\nORDER BY demand_variance DESC;",
  },
  
  {
    id: 93,
    title: "Customer Geo-Cluster Profitability",
    slug: "customer-geo-cluster-profitability-sql",
    seoTitle: "Geospatial Strategy: Calculating Net Regional Unit Profitability",
    metaDescription: "Construct localized micro-profit maps by combining regional delivery surcharges, promotional markdowns, and returns in a three-way join.",
    difficulty: "Elite+",
    description: "Measure profitability by fine-grained geo (city/state/postal_code) considering discounts, taxes, delivery_fee, refunds.",
    explanation: "Compute net profit per geo cluster.",
    scenario: "Expansion decisions by region.",
    useCases: ["Geo strategy", "Profitability"],
    tags: ["Micro-Geo Targeting", "Regional Net Margin", "Zip Code Yields", "Spatial Profitability"],
    hint: "Join customers + orders + payments",
    starterQuery: "SELECT city, state, postal_code FROM customers;",
    expectedColumns: ["city", "state", "postal_code", "metric"],
    expectedRowCount: 12,
    solutionQuery: "SELECT\n    c.country,\n    c.state,\n    c.city,\n    c.postal_code,\n    ROUND(SUM(o.total_amount), 2) AS total_revenue,\n    ROUND(SUM(o.discount_amount), 2) AS total_discount,\n    ROUND(SUM(o.delivery_fee), 2) AS total_delivery_fee,\n    ROUND(COALESCE(SUM(p.refund_amount), 0), 2) AS total_refunds,\n    ROUND(\n        SUM(o.total_amount)\n        - SUM(o.discount_amount)\n        - COALESCE(SUM(p.refund_amount), 0),\n        2\n    ) AS estimated_profit\nFROM customers c\nJOIN orders o\n    ON c.customer_id = o.customer_id\nLEFT JOIN payments p\n    ON o.order_id = p.order_id\nGROUP BY c.country, c.state, c.city, c.postal_code\nORDER BY estimated_profit DESC;",
  },
  
  {
    id: 94,
    title: "Feedback Signal Reliability (Text vs Rating vs Behavior)",
    slug: "feedback-signal-reliability-sentiment-sql",
    seoTitle: "CX Auditing: Matching Text Sentiment with User Star Ratings",
    metaDescription: "Cross-examine textual reviews against recorded star values and sequential chargeback logs to discover conflicting signals.",
    difficulty: "Elite+",
    description: "Detect inconsistencies between review_text sentiment, rating, refunds, and repeat purchases.",
    explanation: "Correlate text cues with rating and subsequent behavior.",
    scenario: "Product questions reliability of feedback signals.",
    useCases: ["NLP-lite", "CX"],
    tags: ["Text Classification", "Survey Validation", "CX Inconsistencies", "Repurchase Velocity"],
    hint: "rating vs keywords in review_text and repeat orders",
    starterQuery: "SELECT rating, review_text FROM feedback;",
    expectedColumns: ["dimension", "metric"],
    expectedRowCount: 10,
    solutionQuery: "SELECT\n    f.feedback_id,\n    f.customer_id,\n    f.rating,\n    f.review_text,\n    COUNT(DISTINCT o.order_id) AS repeat_orders,\n    ROUND(COALESCE(SUM(p.refund_amount), 0), 2) AS total_refunds,\n    CASE\n        WHEN f.rating >= 4\n             AND (\n                 LOWER(f.review_text) LIKE '%bad%'\n                 OR LOWER(f.review_text) LIKE '%poor%'\n                 OR LOWER(f.review_text) LIKE '%terrible%'\n             ) THEN 'Positive Rating with Negative Sentiment'\n        WHEN f.rating <= 2\n             AND (\n                 LOWER(f.review_text) LIKE '%great%'\n                 OR LOWER(f.review_text) LIKE '%excellent%'\n             ) THEN 'Negative Rating with Positive Sentiment'\n        ELSE 'Consistent'\n    END AS feedback_signal_status\nFROM feedback f\nLEFT JOIN orders o\n    ON f.customer_id = o.customer_id\nLEFT JOIN payments p\n    ON o.order_id = p.order_id\nGROUP BY f.feedback_id, f.customer_id, f.rating, f.review_text;",
  },
  
  {
    id: 95,
    title: "Customer Revenue Concentration Risk",
    slug: "customer-revenue-concentration-risk",
    seoTitle: "Advanced SQL Revenue Concentration Risk Analysis",
    metaDescription: "Measure customer revenue concentration to identify business dependency on a small group of high-value customers using advanced SQL.",
    difficulty: "Elite+",
    description: "Analyze how dependent the business is on its highest-value customers by measuring cumulative revenue contribution.",
    explanation: "Calculate each customer's lifetime revenue, rank customers by revenue, compute cumulative revenue, and identify how quickly total business revenue is accumulated.",
    scenario: "The executive team wants to understand whether revenue is overly dependent on a small number of customers, creating a business concentration risk.",
    useCases: [
        "Executive Dashboard",
        "Risk Analysis",
        "Customer Analytics",
        "Business Intelligence"
    ],
    tags: [
        "Window Functions",
        "Cumulative Sum",
        "Revenue Analytics",
        "Executive Reporting"
    ],
    hint: "Use SUM() OVER(), DENSE_RANK(), and cumulative revenue calculations.",
    starterQuery: "SELECT customer_id, total_amount FROM orders;",
    expectedColumns: [
        "customer_rank",
        "customer_id",
        "customer_name",
        "lifetime_revenue",
        "cumulative_revenue_percentage"
    ],
    expectedRowCount: 10,
    validateBy: "exact",
    solutionQuery: "WITH customer_revenue AS (\n\
SELECT\n\
c.customer_id,\n\
c.customer_name,\n\
SUM(o.total_amount) AS lifetime_revenue\n\
FROM customers c\n\
JOIN orders o\n\
ON c.customer_id=o.customer_id\n\
GROUP BY c.customer_id,c.customer_name\n\
), ranked_customers AS (\n\
SELECT\n\
customer_id,\n\
customer_name,\n\
lifetime_revenue,\n\
DENSE_RANK() OVER(ORDER BY lifetime_revenue DESC) AS customer_rank,\n\
SUM(lifetime_revenue) OVER(ORDER BY lifetime_revenue DESC) AS cumulative_revenue,\n\
SUM(lifetime_revenue) OVER() AS total_revenue\n\
FROM customer_revenue\n\
)\n\
SELECT\n\
customer_rank,\n\
customer_id,\n\
customer_name,\n\
ROUND(lifetime_revenue,2) AS lifetime_revenue,\n\
ROUND(cumulative_revenue*100.0/total_revenue,2) AS cumulative_revenue_percentage\n\
FROM ranked_customers\n\
ORDER BY customer_rank\n\
LIMIT 10;"
},
  
  {
    id: 96,
    title: "Customer Engagement vs Monetization Lag",
    slug: "customer-engagement-monetization-lag-sql",
    seoTitle: "Behavioral Economics SQL: App Engagement to Conversion Latency",
    metaDescription: "Measure time lag between active platform login sessions and downstream checkout occurrences across multiple user segments.",
    difficulty: "Elite+",
    description: "Analyze lag between last_login_date spikes and revenue realization across segments.",
    explanation: "Correlate login activity with subsequent orders and payments.",
    scenario: "Growth suspects engagement doesn’t convert immediately.",
    useCases: ["Conversion", "Behavior"],
    tags: ["Engagement Velocity", "Monetization Windows", "Latent Conversions", "Segment Timelines"],
    hint: "Compare last_login_date with following order/payment dates",
    starterQuery: "SELECT customer_id, last_login_date FROM customers;",
    expectedColumns: ["segment", "metric"],
    expectedRowCount: 10,
    solutionQuery: "SELECT\n    c.customer_type AS segment,\n    COUNT(DISTINCT c.customer_id) AS total_customers,\n    ROUND(\n        AVG(\n            julianday(o.order_date) - julianday(c.last_login_date)\n        ),\n        2\n    ) AS avg_login_to_order_days,\n    ROUND(\n        AVG(\n            julianday(p.payment_date) - julianday(c.last_login_date)\n        ),\n        2\n    ) AS avg_login_to_payment_days,\n    ROUND(SUM(o.total_amount), 2) AS total_revenue\nFROM customers c\nLEFT JOIN orders o\n    ON c.customer_id = o.customer_id\nLEFT JOIN payments p\n    ON o.order_id = p.order_id\nWHERE c.last_login_date IS NOT NULL\nGROUP BY c.customer_type\nORDER BY avg_login_to_payment_days DESC;",
  },
  
  {
    id: 97,
    title: "Order Item Tax & Discount Allocation Accuracy",
    slug: "order-item-tax-discount-allocation-sql",
    seoTitle: "Tax Compliance Audit: Line-Item vs Header Aggregation Gaps",
    metaDescription: "Build financial verification models checking discrepancies between invoice totals and aggregated item-level taxes.",
    difficulty: "Elite+",
    description: "Validate allocation of tax_amount and discount_amount between order level and item level across currencies.",
    explanation: "Reconcile item-level vs order-level totals.",
    scenario: "Finance disputes tax/discount allocation logic.",
    useCases: ["Audit", "Compliance"],
    tags: ["Compliance Math", "Tax Reconciliation", "Rounding Error Detection", "Line-Item Auditing"],
    hint: "Compare SUM(oi.tax_amount/discount_amount) vs order fields",
    starterQuery: "SELECT order_id, tax_amount, discount_amount FROM orders;",
    expectedColumns: ["order_id"],
    expectedRowCount: 8,
    solutionQuery: "SELECT\n    o.order_id,\n    o.currency,\n    ROUND(o.tax_amount, 2) AS order_tax_amount,\n    ROUND(SUM(oi.tax_amount), 2) AS item_tax_amount,\n    ROUND(o.discount_amount, 2) AS order_discount_amount,\n    ROUND(SUM(oi.discount_amount), 2) AS item_discount_amount,\n    ROUND(o.tax_amount - SUM(oi.tax_amount), 2) AS tax_gap,\n    ROUND(o.discount_amount - SUM(oi.discount_amount), 2) AS discount_gap\nFROM orders o\nJOIN order_items oi\n    ON o.order_id = oi.order_id\nGROUP BY o.order_id, o.currency, o.tax_amount, o.discount_amount\nHAVING ABS(o.tax_amount - SUM(oi.tax_amount)) > 0\n    OR ABS(o.discount_amount - SUM(oi.discount_amount)) > 0\nORDER BY ABS(discount_gap) DESC;",
  },
  
  {
    id: 98,
    title: "Partner Availability vs Demand Mismatch",
    slug: "partner-availability-demand-mismatch-sql",
    seoTitle: "Marketplace Equilibrium SQL: Driver Availability vs Order Spikes",
    metaDescription: "Pinpoint marketplace balance issues by comparing temporal order demand density with active gig-worker availability windows.",
    difficulty: "Elite+",
    description: "Identify times/regions where partner availability (last_active_date) lags behind demand (orders).",
    explanation: "Compare order volume with partner activity windows by city.",
    scenario: "Ops planning supply-demand balance.",
    useCases: ["Capacity planning", "Logistics"],
    tags: ["Fulfillment Bottlenecks", "Marketplace Equilibrium", "Logistics Supply Deficit", "Capacity Micro-Windows"],
    hint: "Group by city and time windows",
    starterQuery: "SELECT city, last_active_date FROM delivery_partners;",
    expectedColumns: ["city", "metric"],
    expectedRowCount: 10,
    solutionQuery: "SELECT\n    dp.city,\n    COUNT(DISTINCT dp.delivery_partner_id) AS total_partners,\n    COUNT(o.order_id) AS total_orders,\n    ROUND(\n        AVG(\n            julianday('now') - julianday(dp.last_active_date)\n        ),\n        2\n    ) AS avg_partner_inactive_days,\n    ROUND(\n        COUNT(o.order_id) * 1.0 /\n        COUNT(DISTINCT dp.delivery_partner_id),\n        2\n    ) AS demand_per_partner\nFROM delivery_partners dp\nLEFT JOIN orders o\n    ON dp.delivery_partner_id = o.delivery_partner_id\nGROUP BY dp.city\nORDER BY demand_per_partner DESC, avg_partner_inactive_days DESC;",
  },
  
  {
    id: 99,
    title: "Customer Type vs Channel vs Product Interaction",
    slug: "customer-type-channel-product-interaction-sql",
    seoTitle: "Matrix Attribution SQL: Demographics, Funnels, & Product Line Yields",
    metaDescription: "Process high-dimensional cross-joins spanning user cohorts, specific channels, and merchandise categories for deep strategic alignment.",
    difficulty: "Elite+",
    description: "Analyze how customer_type and acquisition_channel interact with product category/subcategory performance.",
    explanation: "Three-way interaction across customers, products, orders.",
    scenario: "Marketing + Product joint strategy.",
    useCases: ["Attribution", "Segmentation"],
    tags: ["Three-Way Attribution Matrices", "Multi-Layer Cross Segmentation", "High-Dimensional Splits", "Strategic Cohorts"],
    hint: "GROUP BY customer_type, acquisition_channel, category, subcategory",
    starterQuery: "SELECT customer_type, acquisition_channel FROM customers;",
    expectedColumns: ["customer_type", "acquisition_channel", "metric"],
    expectedRowCount: 15,
    solutionQuery: "SELECT\n    c.customer_type,\n    c.acquisition_channel,\n    p.category,\n    p.subcategory,\n    COUNT(DISTINCT o.order_id) AS total_orders,\n    SUM(oi.quantity) AS total_quantity,\n    ROUND(SUM(oi.total_price), 2) AS total_revenue,\n    ROUND(AVG(oi.unit_price), 2) AS avg_unit_price\nFROM customers c\nJOIN orders o\n    ON c.customer_id = o.customer_id\nJOIN order_items oi\n    ON o.order_id = oi.order_id\nJOIN products p\n    ON oi.product_id = p.product_id\nGROUP BY c.customer_type, c.acquisition_channel, p.category, p.subcategory\nORDER BY total_revenue DESC;",
  },
  
  {
    id: 100,
    title: "Full System Forensic Audit (Everything Together)",
    slug: "full-system-forensic-audit-everything-sql",
    seoTitle: "System Forensic SQL: Comprehensive Pre-IPO Database Validation",
    metaDescription: "The ultimate database challenge. Build a multi-join forensic script auditing lifecycle anomalies and financial inconsistencies across 7 core schemas.",
    difficulty: "Elite+ (FAANG)",
    description: "Produce a unified forensic report detecting anomalies across customers, orders, order_items, products, payments, delivery_partners, and feedback using all lifecycle timestamps and financial fields.",
    explanation: "Cross-validate identities, lifecycle sequences, financial totals, geo patterns, and feedback signals in one comprehensive query or layered CTEs.",
    scenario: "Pre-IPO audit requires full system validation with no blind spots.",
    useCases: ["Data engineering", "Audit", "Executive"],
    tags: ["Forensic Data Engineering", "Systemic Leakage Audits", "Full Enterprise Architecture Validation", "Exception Diagnostics"],
    hint: "Join ALL tables and check: lifecycle consistency, financial mismatches, geo anomalies, feedback inconsistencies",
    starterQuery: "SELECT o.order_id\nFROM orders o\nLEFT JOIN customers c ON o.customer_id = c.customer_id\nLEFT JOIN order_items oi ON o.order_id = oi.order_id\nLEFT JOIN products p ON oi.product_id = p.product_id\nLEFT JOIN payments pm ON o.order_id = pm.order_id\nLEFT JOIN delivery_partners d ON o.delivery_partner_id = d.delivery_partner_id\nLEFT JOIN feedback f ON o.order_id = f.order_id;",
    expectedColumns: ["order_id"],
    expectedRowCount: 10,
    solutionQuery: "SELECT\n    o.order_id,\n    c.customer_id,\n    c.customer_name,\n    o.order_status,\n    pm.payment_status,\n    d.partner_name,\n    p.product_name,\n    ROUND(o.total_amount, 2) AS order_total,\n    ROUND(SUM(oi.total_price), 2) AS item_total,\n    ROUND(SUM(pm.amount), 2) AS payment_total,\n    ROUND(COALESCE(SUM(pm.refund_amount), 0), 2) AS total_refunds,\n    ROUND(AVG(f.rating), 2) AS avg_rating,\n    CASE\n        WHEN o.order_status = 'Delivered' AND pm.payment_status = 'failed'\n            THEN 'Delivery-Payment Mismatch'\n        WHEN ABS(o.total_amount - SUM(oi.total_price)) > 1\n            THEN 'Order vs Item Total Mismatch'\n        WHEN ABS(o.total_amount - SUM(pm.amount)) > 1\n            THEN 'Order vs Payment Mismatch'\n        WHEN o.cancelled_date IS NOT NULL AND o.delivered_date IS NOT NULL\n            THEN 'Cancelled and Delivered Conflict'\n        WHEN f.rating >= 4\n             AND LOWER(f.review_text) LIKE '%bad%'\n            THEN 'Feedback Sentiment Conflict'\n        ELSE 'Valid'\n    END AS forensic_status\nFROM orders o\nLEFT JOIN customers c\n    ON o.customer_id = c.customer_id\nLEFT JOIN order_items oi\n    ON o.order_id = oi.order_id\nLEFT JOIN products p\n    ON oi.product_id = p.product_id\nLEFT JOIN payments pm\n    ON o.order_id = pm.order_id\nLEFT JOIN delivery_partners d\n    ON o.delivery_partner_id = d.delivery_partner_id\nLEFT JOIN feedback f\n    ON o.order_id = f.order_id\nGROUP BY o.order_id, c.customer_id, c.customer_name, o.order_status, pm.payment_status, d.partner_name, p.product_name, o.total_amount, o.cancelled_date, o.delivered_date;",
  }
      
  ];