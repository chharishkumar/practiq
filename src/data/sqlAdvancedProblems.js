
export const SQL_ADVANCED_PROBLEMS = [
  {
    id: 1,
    title: "Customer Cohort Retention (Monthly)",
    difficulty: "Easy",
    slug: "sql-monthly-cohort-retention-analysis-with-cte",
    seoTitle: "SQL Monthly Cohort Retention Analysis via CTE and strftime",
    metaDescription: "Learn how to calculate lifecycle user retention matrices using window expressions and common table structures.",
    tags: ["SQL", "CTE", "Cohort Analysis", "strftime"],
    description: "Calculate monthly retention of customers based on their first order month.",
    explanation: "Cohort analysis groups users by their first activity and tracks repeat behavior over time.",
    scenario: "Growth team wants to understand how many users return after their first purchase.",
    useCases: ["Retention analysis", "Growth metrics"],
    hint: "Find first order month per customer, then join back to orders",
    starterQuery: "WITH first_order AS (\n  SELECT customer_id, MIN(strftime('%Y-%m', order_date)) as cohort_month\n  FROM orders GROUP BY customer_id\n),\nactivity AS (\n  SELECT o.customer_id, strftime('%Y-%m', o.order_date) as order_month, f.cohort_month\n  FROM orders o JOIN first_order f ON o.customer_id = f.customer_id\n)\nSELECT cohort_month, order_month, COUNT(DISTINCT customer_id) as active_users\nFROM activity\nGROUP BY cohort_month, order_month;",
    expectedColumns: ["cohort_month", "order_month", "active_users"],
    expectedRowCount: 10,
    solutionQuery: "WITH first_order AS (\n  SELECT customer_id, MIN(strftime('%Y-%m', order_date)) as cohort_month\n  FROM orders GROUP BY customer_id\n),\nactivity AS (\n  SELECT o.customer_id, strftime('%Y-%m', o.order_date) as order_month, f.cohort_month\n  FROM orders o JOIN first_order f ON o.customer_id = f.customer_id\n)\nSELECT cohort_month, order_month, COUNT(DISTINCT customer_id) as active_users\nFROM activity\nGROUP BY cohort_month, order_month;",
  },
  {
    id: 2,
    title: "Customer Lifetime Value (Dynamic)",
    difficulty: "Easy",
    slug: "sql-window-sum-partition-by-customer-running-ltv",
    seoTitle: "SQL Window SUM PARTITION BY Customer Running LTV",
    metaDescription: "Learn how to build dynamic running aggregations using financial column sums coupled with explicit window partitions.",
    tags: ["SQL", "Window Functions", "SUM", "PARTITION BY"],
    description: "Calculate rolling lifetime value per customer ordered by order_date.",
    explanation: "Window SUM allows cumulative spend tracking over time.",
    scenario: "Business wants to monitor how customer value evolves.",
    useCases: ["LTV tracking", "Revenue forecasting"],
    hint: "SUM(total_amount) OVER (PARTITION BY customer_id ORDER BY order_date)",
    starterQuery: "SELECT customer_id, order_date, \nSUM(total_amount) OVER (PARTITION BY customer_id ORDER BY order_date) as running_ltv \nFROM orders;",
    expectedColumns: ["customer_id", "order_date", "running_ltv"],
    expectedRowCount: 10,
    solutionQuery: "SELECT customer_id, order_date, \nSUM(total_amount) OVER (PARTITION BY customer_id ORDER BY order_date) as running_ltv \nFROM orders;",
  },
  {
    id: 3,
    title: "Top 2 Products per Category",
    difficulty: "Easy",
    slug: "sql-row-number-partition-by-category-top-n",
    seoTitle: "SQL ROW_NUMBER PARTITION BY Category Top-N Filter",
    metaDescription: "Learn how to isolate a constrained subset of rows within specific groups by applying nested window row metrics.",
    tags: ["SQL", "ROW_NUMBER", "PARTITION BY", "CTE"],
    description: "Find top 2 products by revenue within each category.",
    explanation: "ROW_NUMBER with PARTITION BY enables top-N per group.",
    scenario: "Product team wants best sellers per category.",
    useCases: ["Category ranking", "Top-N analysis"],
    hint: "ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC)",
    starterQuery: "WITH prod_rev AS (\n  SELECT p.product_id, p.category, SUM(oi.total_price) as revenue\n  FROM order_items oi JOIN products p ON oi.product_id = p.product_id\n  GROUP BY p.product_id, p.category\n)\nSELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) as rn\n  FROM prod_rev\n) t WHERE rn <= 2;",
    expectedColumns: ["product_id", "category", "revenue", "rn"],
    expectedRowCount: 6,
    solutionQuery: "WITH prod_rev AS (\n  SELECT p.product_id, p.category, SUM(oi.total_price) as revenue\n  FROM order_items oi JOIN products p ON oi.product_id = p.product_id\n  GROUP BY p.product_id, p.category\n)\nSELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) as rn\n  FROM prod_rev\n) t WHERE rn <= 2;",
  },
  {
    id: 4,
    title: "Revenue Contribution (Pareto 80/20)",
    difficulty: "Easy",
    slug: "sql-cumulative-sum-over-unbounded-ratio-pareto",
    seoTitle: "SQL Cumulative SUM over Unbounded Ratio for Pareto Analysis",
    metaDescription: "Learn how to evaluate density limits by calculating running percentages across whole datasets using unbounded window macros.",
    tags: ["SQL", "Window Functions", "SUM", "Pareto Analysis"],
    description: "Identify top customers contributing to 80% of revenue.",
    explanation: "Cumulative percentage using window functions helps Pareto analysis.",
    scenario: "Business checks dependency on top customers.",
    useCases: ["Pareto analysis", "Revenue concentration"],
    hint: "Cumulative SUM over ordered revenue",
    starterQuery: "WITH cust_rev AS (\n  SELECT customer_id, SUM(total_amount) as revenue FROM orders GROUP BY customer_id\n), ranked AS (\n  SELECT *, SUM(revenue) OVER (ORDER BY revenue DESC) * 1.0 / SUM(revenue) OVER() as cum_pct\n  FROM cust_rev\n)\nSELECT * FROM ranked WHERE cum_pct <= 0.8;",
    expectedColumns: ["customer_id", "revenue", "cum_pct"],
    expectedRowCount: 3,
    solutionQuery: "WITH cust_rev AS (\n  SELECT customer_id, SUM(total_amount) as revenue FROM orders GROUP BY customer_id\n), ranked AS (\n  SELECT *, SUM(revenue) OVER (ORDER BY revenue DESC) * 1.0 / SUM(revenue) OVER() as cum_pct\n  FROM cust_rev\n)\nSELECT * FROM ranked WHERE cum_pct <= 0.8;",
  },
  {
    id: 5,
    title: "Top Spending Customer in Each State",
    difficulty: "Easy",
    slug: "sql-dense-rank-top-customer-by-state",
    seoTitle: "SQL DENSE_RANK Partition by State",
    metaDescription: "Learn how to combine CTEs, aggregation, and DENSE_RANK() to identify the highest spending customer in each state.",
    tags: ["SQL", "CTE", "DENSE_RANK", "Window Functions", "JOIN"],
    description: "Find the highest spending customer in each state.",
    explanation: "First calculate each customer's total spending, then rank customers within each state using DENSE_RANK().",
    scenario: "Regional managers want to identify their highest-value customers.",
    useCases: ["Customer analytics", "Regional reporting", "Revenue analysis"],
    hint: "Create a CTE for customer revenue and rank customers within each state.",
    starterQuery: `WITH CustomerRevenue AS (
    SELECT
        c.state,
        c.customer_id,
        c.customer_name,
        SUM(o.total_amount) AS total_spent
    FROM customers c
    JOIN orders o
        ON c.customer_id = o.customer_id
    GROUP BY
        c.state,
        c.customer_id,
        c.customer_name
)
SELECT
    state,
    customer_name,
    total_spent
FROM (
    SELECT *,
           DENSE_RANK() OVER(
               PARTITION BY state
               ORDER BY total_spent DESC
           ) AS rank_no
    FROM CustomerRevenue
)
WHERE rank_no = 1;`,
    expectedColumns: ["state","customer_name","total_spent"],
    solutionQuery: `WITH CustomerRevenue AS (
    SELECT
        c.state,
        c.customer_id,
        c.customer_name,
        SUM(o.total_amount) AS total_spent
    FROM customers c
    JOIN orders o
        ON c.customer_id = o.customer_id
    GROUP BY
        c.state,
        c.customer_id,
        c.customer_name
)
SELECT
    state,
    customer_name,
    total_spent
FROM (
    SELECT *,
           DENSE_RANK() OVER(
               PARTITION BY state
               ORDER BY total_spent DESC
           ) AS rank_no
    FROM CustomerRevenue
)
WHERE rank_no = 1;`,
},
{
    id: 6,
    title: "Orders Above Customer Average",
    difficulty: "Easy",
    slug: "sql-correlated-subquery-average-orders",
    seoTitle: "SQL Correlated Subquery with AVG",
    metaDescription: "Learn how to compare each order with the customer's average order value using correlated subqueries.",
    tags: ["SQL", "Correlated Subquery", "AVG"],
    description: "Find orders whose total amount is greater than the customer's average order amount.",
    explanation: "The correlated subquery calculates the average order value separately for every customer.",
    scenario: "Analytics wants to identify unusually expensive purchases.",
    useCases: ["Customer analytics", "Anomaly detection", "Spending analysis"],
    hint: "Compare total_amount with AVG(total_amount) for the same customer.",
    starterQuery: `SELECT
    order_id,
    customer_id,
    total_amount
FROM orders o
WHERE total_amount >
(
    SELECT AVG(total_amount)
    FROM orders
    WHERE customer_id = o.customer_id
);`,
    expectedColumns: ["order_id","customer_id","total_amount"],
    solutionQuery: `SELECT
    order_id,
    customer_id,
    total_amount
FROM orders o
WHERE total_amount >
(
    SELECT AVG(total_amount)
    FROM orders
    WHERE customer_id = o.customer_id
);`,
},
{
    id: 7,
    title: "Top 10 Revenue Days",
    difficulty: "Easy",
    slug: "sql-cte-dense-rank-daily-revenue",
    seoTitle: "SQL CTE with DENSE_RANK for Daily Revenue",
    metaDescription: "Learn how to combine CTEs, aggregation, and DENSE_RANK() to rank daily revenue.",
    tags: ["SQL", "CTE", "DENSE_RANK", "Window Functions"],
    description: "Find the top 10 highest revenue days.",
    explanation: "Calculate daily revenue, then rank each day based on total revenue using DENSE_RANK().",
    scenario: "Finance wants to identify the highest revenue days.",
    useCases: ["Revenue analysis", "Trend analysis", "Executive reporting"],
    hint: "Create a CTE for daily revenue and rank it using DENSE_RANK().",
    starterQuery: `WITH DailyRevenue AS (
    SELECT
        order_date,
        SUM(total_amount) AS revenue
    FROM orders
    GROUP BY order_date
)
SELECT
    order_date,
    revenue
FROM (
    SELECT *,
           DENSE_RANK() OVER(
               ORDER BY revenue DESC
           ) AS rank_no
    FROM DailyRevenue
)
WHERE rank_no <= 10
ORDER BY revenue DESC;`,
    expectedColumns: ["order_date","revenue"],
    solutionQuery: `WITH DailyRevenue AS (
    SELECT
        order_date,
        SUM(total_amount) AS revenue
    FROM orders
    GROUP BY order_date
)
SELECT
    order_date,
    revenue
FROM (
    SELECT *,
           DENSE_RANK() OVER(
               ORDER BY revenue DESC
           ) AS rank_no
    FROM DailyRevenue
)
WHERE rank_no <= 10
ORDER BY revenue DESC;`,
},
{
  id: 8,
  title: "Rank Customers by Total Spending",
  difficulty: "Easy",
  slug: "sql-dense-rank-total-customer-spending",
  seoTitle: "SQL DENSE_RANK Window Function",
  metaDescription: "Learn how to rank customers by their total spending using SQL DENSE_RANK() and aggregation.",
  tags: ["SQL", "DENSE_RANK", "Window Functions", "GROUP BY"],
  description: "Rank customers based on their total spending.",
  explanation: "First calculate each customer's total spending using SUM(), then use DENSE_RANK() to assign rankings. Customers with the same spending receive the same rank.",
  scenario: "The sales team wants to identify the highest-value customers.",
  useCases: ["Customer ranking", "Revenue analysis", "Business reporting"],
  hint: "Aggregate total spending first, then apply DENSE_RANK() OVER (ORDER BY total_spent DESC).",
  starterQuery: `SELECT
  customer_id,
  total_spent,
  DENSE_RANK() OVER (ORDER BY total_spent DESC) AS customer_rank
FROM (
  SELECT
      customer_id,
      SUM(total_amount) AS total_spent
  FROM orders
  GROUP BY customer_id
) t;`,
  expectedColumns: ["customer_id", "total_spent", "customer_rank"],
  solutionQuery: `SELECT
  customer_id,
  total_spent,
  DENSE_RANK() OVER (ORDER BY total_spent DESC) AS customer_rank
FROM (
  SELECT
      customer_id,
      SUM(total_amount) AS total_spent
  FROM orders
  GROUP BY customer_id
) t;`,
},
{
  id: 9,
  title: "Customers Who Have Placed Orders",
  difficulty: "Easy",
  slug: "sql-exists-subquery",
  seoTitle: "SQL EXISTS Subquery Tutorial",
  metaDescription: "Learn how to use the SQL EXISTS operator to check whether related records exist.",
  tags: ["SQL", "EXISTS", "Subquery"],
  description: "Find all customers who have placed at least one order.",
  explanation: "The EXISTS operator returns TRUE if the subquery finds at least one matching row. It is commonly used instead of JOIN when checking for existence.",
  scenario: "The marketing team wants a list of customers who have already made a purchase.",
  useCases: ["Customer segmentation", "Purchase analysis", "Campaign targeting"],
  hint: "Use EXISTS with a correlated subquery.",
  starterQuery: `SELECT
  customer_id,
  customer_name
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.customer_id
);`,
  expectedColumns: ["customer_id", "customer_name"],
  solutionQuery: `SELECT
  customer_id,
  customer_name
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.customer_id
);`,
},
{
  id: 10,
  title: "Previous Order for Every Customer",
  difficulty: "Easy",
  slug: "sql-lag-window-function",
  seoTitle: "SQL LAG Window Function",
  metaDescription: "Learn how to access the previous row using the SQL LAG() window function.",
  tags: ["SQL", "LAG", "Window Functions"],
  description: "For every order, display the previous order date of the same customer.",
  explanation: "LAG() returns the value from the previous row within a partition. Here, orders are partitioned by customer and ordered by order_date.",
  scenario: "The analytics team wants to study the time between consecutive customer purchases.",
  useCases: ["Customer behavior", "Purchase history", "Window function practice"],
  hint: "Use LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date).",
  starterQuery: `SELECT
  customer_id,
  order_id,
  order_date,
  LAG(order_date) OVER (
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS previous_order_date
FROM orders;`,
  expectedColumns: ["customer_id", "order_id", "order_date", "previous_order_date"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  order_date,
  LAG(order_date) OVER (
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS previous_order_date
FROM orders;`,
},
{
  id: 11,
  title: "Next Order Date for Every Customer",
  difficulty: "Easy",
  slug: "sql-lead-window-function",
  seoTitle: "SQL LEAD Window Function Tutorial",
  metaDescription: "Learn how to use the SQL LEAD() window function to access the next row within a partition.",
  tags: ["SQL", "LEAD", "Window Functions"],
  description: "For every order, display the next order date of the same customer.",
  explanation: "LEAD() returns the value from the following row within the same partition. This is useful for analyzing future events without performing a self join.",
  scenario: "The analytics team wants to analyze the gap until each customer's next purchase.",
  useCases: ["Customer behavior", "Purchase interval analysis", "Window function practice"],
  hint: "Use LEAD(order_date) OVER (PARTITION BY customer_id ORDER BY order_date).",
  starterQuery: `SELECT
  customer_id,
  order_id,
  order_date,
  LEAD(order_date) OVER (
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS next_order_date
FROM orders;`,
  expectedColumns: ["customer_id", "order_id", "order_date", "next_order_date"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  order_date,
  LEAD(order_date) OVER (
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS next_order_date
FROM orders;`,
},
{
  id: 12,
  title: "First Order of Every Customer",
  difficulty: "Easy",
  slug: "sql-row-number-first-order",
  seoTitle: "SQL ROW_NUMBER First Record per Group",
  metaDescription: "Learn how to use ROW_NUMBER() to return the first record from each group.",
  tags: ["SQL", "ROW_NUMBER", "Window Functions"],
  description: "Find the first order placed by every customer.",
  explanation: "Assign a row number to each customer's orders based on order date, then return only the first row.",
  scenario: "The CRM team wants to identify every customer's first purchase.",
  useCases: ["Customer onboarding", "Purchase history", "Window function practice"],
  hint: "Use ROW_NUMBER() partitioned by customer_id ordered by order_date.",
  starterQuery: `SELECT
  customer_id,
  order_id,
  order_date
FROM (
  SELECT
      customer_id,
      order_id,
      order_date,
      ROW_NUMBER() OVER (
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS rn
  FROM orders
) t
WHERE rn = 1;`,
  expectedColumns: ["customer_id", "order_id", "order_date"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  order_date
FROM (
  SELECT
      customer_id,
      order_id,
      order_date,
      ROW_NUMBER() OVER (
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS rn
  FROM orders
) t
WHERE rn = 1;`,
},
{
  id: 13,
  title: "Customers Above Overall Average Spending",
  difficulty: "Easy",
  slug: "sql-cte-overall-average-comparison",
  seoTitle: "SQL CTE with Overall Average Comparison",
  metaDescription: "Learn how to use Common Table Expressions (CTEs) to compare grouped values against an overall average.",
  tags: ["SQL", "CTE", "AVG", "GROUP BY"],
  description: "Find customers whose total spending is greater than the average customer spending.",
  explanation: "First calculate the total spending for every customer. Then compare each customer's spending against the average of all customer totals using a CTE.",
  scenario: "The finance team wants to identify customers whose spending is above the company average.",
  useCases: ["Customer segmentation", "Revenue analysis", "Business reporting"],
  hint: "Create a CTE for customer totals, then compare against AVG(total_spent).",
  starterQuery: `WITH CustomerTotals AS (
  SELECT
      customer_id,
      SUM(total_amount) AS total_spent
  FROM orders
  GROUP BY customer_id
)
SELECT
  customer_id,
  total_spent
FROM CustomerTotals
WHERE total_spent >
(
  SELECT AVG(total_spent)
  FROM CustomerTotals
);`,
  expectedColumns: ["customer_id", "total_spent"],
  solutionQuery: `WITH CustomerTotals AS (
  SELECT
      customer_id,
      SUM(total_amount) AS total_spent
  FROM orders
  GROUP BY customer_id
)
SELECT
  customer_id,
  total_spent
FROM CustomerTotals
WHERE total_spent >
(
  SELECT AVG(total_spent)
  FROM CustomerTotals
);`,
},
{
  id: 14,
  title: "Latest Order for Every Customer",
  difficulty: "Easy",
  slug: "sql-row-number-latest-order",
  seoTitle: "SQL ROW_NUMBER Latest Record per Group",
  metaDescription: "Learn how to use ROW_NUMBER() to retrieve the most recent record from each group.",
  tags: ["SQL", "ROW_NUMBER", "Window Functions"],
  description: "Find the latest order placed by every customer.",
  explanation: "Assign a row number ordered by the most recent order date within each customer. The first ranked row represents the customer's latest order.",
  scenario: "The CRM team wants to know every customer's most recent purchase.",
  useCases: ["Customer activity", "Purchase history", "Window function practice"],
  hint: "Use ROW_NUMBER() partitioned by customer_id ordered by order_date DESC.",
  starterQuery: `SELECT
  customer_id,
  order_id,
  order_date
FROM (
  SELECT
      customer_id,
      order_id,
      order_date,
      ROW_NUMBER() OVER (
          PARTITION BY customer_id
          ORDER BY order_date DESC
      ) AS rn
  FROM orders
) t
WHERE rn = 1;`,
  expectedColumns: ["customer_id", "order_id", "order_date"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  order_date
FROM (
  SELECT
      customer_id,
      order_id,
      order_date,
      ROW_NUMBER() OVER (
          PARTITION BY customer_id
          ORDER BY order_date DESC
      ) AS rn
  FROM orders
) t
WHERE rn = 1;`,
},
{
  id: 15,
  title: "Rank Orders by Amount for Each Customer",
  difficulty: "Easy",
  slug: "sql-rank-orders-per-customer",
  seoTitle: "SQL RANK Window Function Tutorial",
  metaDescription: "Learn how to use SQL RANK() to rank rows within each customer partition.",
  tags: ["SQL", "RANK", "Window Functions"],
  description: "Rank every customer's orders based on total amount.",
  explanation: "Use RANK() to order each customer's purchases from highest to lowest. Orders with equal amounts receive the same rank.",
  scenario: "The sales team wants to identify each customer's biggest purchases.",
  useCases: ["Purchase analysis", "Customer insights", "Ranking"],
  hint: "Use RANK() OVER(PARTITION BY customer_id ORDER BY total_amount DESC).",
  starterQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  RANK() OVER (
      PARTITION BY customer_id
      ORDER BY total_amount DESC
  ) AS order_rank
FROM orders;`,
  expectedColumns: ["customer_id", "order_id", "total_amount", "order_rank"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  RANK() OVER (
      PARTITION BY customer_id
      ORDER BY total_amount DESC
  ) AS order_rank
FROM orders;`,
},
{
  id: 16,
  title: "Products Priced Above Category Average",
  difficulty: "Easy",
  slug: "sql-correlated-subquery-category-average",
  seoTitle: "SQL Correlated Subquery with Category Average",
  metaDescription: "Learn how to use correlated subqueries to compare each product against its category average.",
  tags: ["SQL", "Correlated Subquery", "AVG"],
  description: "Find products whose price is greater than the average price of products in the same category.",
  explanation: "The correlated subquery calculates the average product price for the current category and compares each product against it.",
  scenario: "The merchandising team wants to identify premium-priced products within every category.",
  useCases: ["Pricing analysis", "Product analytics", "Category benchmarking"],
  hint: "Compare price with AVG(price) for the same category.",
  starterQuery: `SELECT
  product_id,
  product_name,
  category,
  price
FROM products p
WHERE price >
(
  SELECT AVG(price)
  FROM products
  WHERE category = p.category
);`,
  expectedColumns: ["product_id", "product_name", "category", "price"],
  solutionQuery: `SELECT
  product_id,
  product_name,
  category,
  price
FROM products p
WHERE price >
(
  SELECT AVG(price)
  FROM products
  WHERE category = p.category
);`,
},  
{
  id: 17,
  title: "Second Highest Order for Every Customer",
  difficulty: "Easy",
  slug: "sql-row-number-second-highest-order",
  seoTitle: "SQL ROW_NUMBER Second Highest Order",
  metaDescription: "Learn how to use ROW_NUMBER() to retrieve the second highest order for every customer.",
  tags: ["SQL", "ROW_NUMBER", "Window Functions"],
  description: "Find the second highest order amount placed by every customer.",
  explanation: "Assign a row number based on descending order amount within each customer and return only the second ranked order.",
  scenario: "The sales team wants to analyze customers' second largest purchases.",
  useCases: ["Purchase analysis", "Customer insights", "Window Functions"],
  hint: "Use ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY total_amount DESC).",
  starterQuery: `SELECT
  customer_id,
  order_id,
  total_amount
FROM (
  SELECT
      customer_id,
      order_id,
      total_amount,
      ROW_NUMBER() OVER (
          PARTITION BY customer_id
          ORDER BY total_amount DESC
      ) AS rn
  FROM orders
) t
WHERE rn = 2;`,
  expectedColumns: ["customer_id", "order_id", "total_amount"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  total_amount
FROM (
  SELECT
      customer_id,
      order_id,
      total_amount,
      ROW_NUMBER() OVER (
          PARTITION BY customer_id
          ORDER BY total_amount DESC
      ) AS rn
  FROM orders
) t
WHERE rn = 2;`,
},
  {
    id: 18,
    title: "Customer Revenue Rank Change",
    difficulty: "Easy",
    slug: "sql-rank-over-partition-by-month-desc-sorting",
    seoTitle: "SQL RANK OVER PARTITION BY Month Revenue Rank Positioning",
    metaDescription: "Learn how to assign structural user ranking records inside calendar months by running ordered financial aggregate parameters.",
    tags: ["SQL", "RANK", "Window Functions", "strftime", "GROUP BY"],
    description: "Track change in customer rank between months.",
    explanation: "Use RANK and compare across months.",
    scenario: "Business tracks customer movement.",
    useCases: ["Ranking analysis", "Customer movement"],
    hint: "RANK() partitioned by month",
    starterQuery: "WITH monthly AS (\nSELECT customer_id, strftime('%Y-%m', order_date) as month, SUM(total_amount) as revenue\nFROM orders GROUP BY customer_id, month\n)\nSELECT customer_id, month, RANK() OVER (PARTITION BY month ORDER BY revenue DESC) as rnk\nFROM monthly;",
    expectedColumns: ["customer_id", "month", "rnk"],
    expectedRowCount: 10,
    solutionQuery: "WITH monthly AS (\nSELECT customer_id, strftime('%Y-%m', order_date) as month, SUM(total_amount) as revenue\nFROM orders GROUP BY customer_id, month\n)\nSELECT customer_id, month, RANK() OVER (PARTITION BY month ORDER BY revenue DESC) as rnk\nFROM monthly;",
  },
  {
    id: 19,
    title: "Late Delivery Impact on Ratings",
    difficulty: "Easy",
    slug: "sql-inner-join-with-avg-rating-conditional-group",
    seoTitle: "SQL INNER JOIN with AVG Rating and Conditional State Grouping",
    metaDescription: "Learn how to isolate operational friction values by asserting timestamp indicators inside aggregate grouping statements.",
    tags: ["SQL", "INNER JOIN", "AVG", "CASE WHEN", "GROUP BY"],
    description: "Compare average ratings for late vs on-time deliveries.",
    explanation: "Join orders with feedback and categorize.",
    scenario: "Business evaluates delivery impact.",
    useCases: ["Customer satisfaction", "Operational impact"],
    hint: "CASE WHEN delayed THEN category",
    starterQuery: "SELECT CASE WHEN o.delivered_date > o.estimated_delivery_time THEN 'Late' ELSE 'OnTime' END as status,\nAVG(f.rating) as avg_rating\nFROM orders o JOIN feedback f ON o.order_id = f.order_id\nGROUP BY status;",
    expectedColumns: ["status", "avg_rating"],
    expectedRowCount: 2,
    solutionQuery: "SELECT CASE WHEN o.delivered_date > o.estimated_delivery_time THEN 'Late' ELSE 'OnTime' END as status,\nAVG(f.rating) as avg_rating\nFROM orders o JOIN feedback f ON o.order_id = f.order_id\nGROUP BY status;",
  },
  {
    id: 20,
    title: "Top Customers Growth Rate",
    difficulty: "Easy",
    slug: "sql-lag-window-percentage-growth-calculation",
    seoTitle: "SQL LAG Window Percentage Month-over-Month Growth Metrics",
    metaDescription: "Learn how to measure performance trends by extracting historical row variables and applying transactional margin arithmetic.",
    tags: ["SQL", "LAG", "Window Functions", "strftime", "CTE"],
    description: "Calculate growth rate of revenue per customer over time.",
    explanation: "Compare current vs previous revenue.",
    scenario: "Identify fastest growing customers.",
    useCases: ["Growth tracking", "Upsell targeting"],
    hint: "LAG(revenue)",
    starterQuery: "WITH monthly AS (\nSELECT customer_id, strftime('%Y-%m', order_date) as month, SUM(total_amount) as revenue\nFROM orders GROUP BY customer_id, month\n)\nSELECT customer_id, month,\n(revenue - LAG(revenue) OVER (PARTITION BY customer_id ORDER BY month))*1.0/\nLAG(revenue) OVER (PARTITION BY customer_id ORDER BY month) as growth\nFROM monthly;",
    expectedColumns: ["customer_id", "month", "growth"],
    expectedRowCount: 10,
    solutionQuery: "WITH monthly AS (\nSELECT customer_id, strftime('%Y-%m', order_date) as month, SUM(total_amount) as revenue\nFROM orders GROUP BY customer_id, month\n)\nSELECT customer_id, month,\n(revenue - LAG(revenue) OVER (PARTITION BY customer_id ORDER BY month))*1.0/\nLAG(revenue) OVER (PARTITION BY customer_id ORDER BY month) as growth\nFROM monthly;",
  },
  {
    id: 21,
    title: "First Order Amount for Every Customer",
    difficulty: "Easy",
    slug: "sql-first-value-window-function",
    seoTitle: "SQL FIRST_VALUE Window Function",
    metaDescription: "Learn how to use SQL FIRST_VALUE() to retrieve the first value within each partition.",
    tags: ["SQL", "FIRST_VALUE", "Window Functions"],
    description: "For every order, display the amount of the customer's first order.",
    explanation: "FIRST_VALUE() returns the first value in each partition. Partition the data by customer_id and order the rows by order_date to display the amount from each customer's first purchase.",
    scenario: "The analytics team wants to compare every purchase against the customer's first purchase.",
    useCases: [
        "Customer behavior",
        "Purchase history",
        "Window function practice"
    ],
    hint: "Use FIRST_VALUE(total_amount) OVER(PARTITION BY customer_id ORDER BY order_date).",
    starterQuery: `SELECT
    customer_id,
    order_id,
    order_date,
    total_amount,
    FIRST_VALUE(total_amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS first_order_amount
FROM orders;`,
    expectedColumns: [
        "customer_id",
        "order_id",
        "order_date",
        "total_amount",
        "first_order_amount"
    ],
    solutionQuery: `SELECT
    customer_id,
    order_id,
    order_date,
    total_amount,
    FIRST_VALUE(total_amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS first_order_amount
FROM orders;`,
},
  {
    id: 22,
    title: "Difference from Previous Order Amount",
    difficulty: "Easy",
    slug: "sql-lag-order-difference",
    seoTitle: "SQL LAG Difference Between Rows",
    metaDescription: "Learn how to compare each order amount with the previous order using the SQL LAG() window function.",
    tags: ["SQL", "LAG", "Window Functions"],
    description: "For every customer, calculate the difference between the current order amount and the previous order amount.",
    explanation: "LAG() retrieves the previous order amount for each customer. Subtract it from the current order amount to measure spending changes.",
    scenario: "The analytics team wants to analyze spending trends between consecutive purchases.",
    useCases: ["Purchase trend analysis", "Customer analytics", "Window function practice"],
    hint: "Use LAG(total_amount) OVER(PARTITION BY customer_id ORDER BY order_date).",
    starterQuery: `SELECT
    customer_id,
    order_id,
    total_amount,
    total_amount -
    LAG(total_amount) OVER(
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS amount_difference
FROM orders;`,
    expectedColumns: ["customer_id", "order_id", "total_amount", "amount_difference"],
    solutionQuery: `SELECT
    customer_id,
    order_id,
    total_amount,
    total_amount -
    LAG(total_amount) OVER(
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS amount_difference
FROM orders;`,
},
{
    id: 23,
    title: "Top Product in Every Category",
    difficulty: "Easy",
    slug: "sql-row-number-top-product-category",
    seoTitle: "SQL ROW_NUMBER Top Product by Category",
    metaDescription: "Learn how to identify the highest revenue product in every category using ROW_NUMBER().",
    tags: ["SQL", "ROW_NUMBER", "JOIN", "GROUP BY", "Window Functions"],
    description: "Find the highest revenue product in each category.",
    explanation: "Calculate total revenue for every product, then assign a row number within each category ordered by revenue. Return only the top-ranked product.",
    scenario: "The merchandising team wants to identify the best-performing product in every category.",
    useCases: ["Product analytics", "Category reporting", "Revenue analysis"],
    hint: "Aggregate revenue first, then use ROW_NUMBER() PARTITION BY category.",
    starterQuery: `WITH ProductRevenue AS (
    SELECT
        p.category,
        p.product_id,
        p.product_name,
        SUM(oi.total_price) AS revenue
    FROM products p
    JOIN order_items oi
        ON p.product_id = oi.product_id
    GROUP BY
        p.category,
        p.product_id,
        p.product_name
)
SELECT
    category,
    product_name,
    revenue
FROM (
    SELECT *,
           ROW_NUMBER() OVER(
               PARTITION BY category
               ORDER BY revenue DESC
           ) AS rn
    FROM ProductRevenue
) t
WHERE rn = 1;`,
    expectedColumns: ["category", "product_name", "revenue"],
    solutionQuery: `WITH ProductRevenue AS (
    SELECT
        p.category,
        p.product_id,
        p.product_name,
        SUM(oi.total_price) AS revenue
    FROM products p
    JOIN order_items oi
        ON p.product_id = oi.product_id
    GROUP BY
        p.category,
        p.product_id,
        p.product_name
)
SELECT
    category,
    product_name,
    revenue
FROM (
    SELECT *,
           ROW_NUMBER() OVER(
               PARTITION BY category
               ORDER BY revenue DESC
           ) AS rn
    FROM ProductRevenue
) t
WHERE rn = 1;`,
},
  {
    id: 24,
    title: "Last Order Amount for Every Customer",
    difficulty: "Easy",
    slug: "sql-last-value-window-function",
    seoTitle: "SQL LAST_VALUE Window Function",
    metaDescription: "Learn how to use SQL LAST_VALUE() to retrieve the last value within each partition.",
    tags: ["SQL", "LAST_VALUE", "Window Functions"],
    description: "For every order, display the amount of the customer's most recent order.",
    explanation: "LAST_VALUE() returns the last value within the current window. Extend the window frame so every row can access the customer's final order amount.",
    scenario: "The analytics team wants to compare each purchase with the customer's latest purchase.",
    useCases: ["Customer analytics", "Purchase history", "Window Functions"],
    hint: "Use LAST_VALUE() with ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING.",
    starterQuery: `SELECT
    customer_id,
    order_id,
    order_date,
    total_amount,
    LAST_VALUE(total_amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS latest_order_amount
FROM orders;`,
    expectedColumns: ["customer_id","order_id","order_date","total_amount","latest_order_amount"],
    solutionQuery: `SELECT
    customer_id,
    order_id,
    order_date,
    total_amount,
    LAST_VALUE(total_amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS latest_order_amount
FROM orders;`,
},
{
    id: 25,
    title: "Customer Spending Percentage",
    difficulty: "Easy",
    slug: "sql-window-percentage-of-total",
    seoTitle: "SQL Percentage of Customer Total Using Window Functions",
    metaDescription: "Learn how to calculate each order's percentage contribution to a customer's total spending.",
    tags: ["SQL", "SUM OVER", "Window Functions"],
    description: "Show what percentage each order contributes to the customer's total spending.",
    explanation: "SUM() OVER(PARTITION BY customer_id) calculates each customer's lifetime spending without collapsing rows.",
    scenario: "The finance team wants to understand how important each purchase is within a customer's lifetime value.",
    useCases: ["Revenue analysis", "Customer lifetime value", "Window Functions"],
    hint: "Divide total_amount by SUM(total_amount) OVER(PARTITION BY customer_id).",
    starterQuery: `SELECT
    customer_id,
    order_id,
    total_amount,
    ROUND(
        total_amount * 100.0 /
        SUM(total_amount) OVER(PARTITION BY customer_id),
        2
    ) AS spending_percentage
FROM orders;`,
    expectedColumns: ["customer_id","order_id","total_amount","spending_percentage"],
    solutionQuery: `SELECT
    customer_id,
    order_id,
    total_amount,
    ROUND(
        total_amount * 100.0 /
        SUM(total_amount) OVER(PARTITION BY customer_id),
        2
    ) AS spending_percentage
FROM orders;`,
},
{
    id: 26,
    title: "Running Average Order Amount",
    difficulty: "Medium",
    slug: "sql-running-average-window-function",
    seoTitle: "SQL Running Average Using Window Functions",
    metaDescription: "Learn how to calculate a running average using SQL AVG() OVER().",
    tags: ["SQL", "AVG OVER", "Window Functions"],
    description: "Calculate the running average order amount for every customer.",
    explanation: "AVG() OVER() computes the average from the customer's first order up to the current order.",
    scenario: "The analytics team wants to observe how customer spending changes over time.",
    useCases: ["Trend analysis", "Customer analytics", "Window Functions"],
    hint: "Use AVG(total_amount) OVER(PARTITION BY customer_id ORDER BY order_date).",
    starterQuery: `SELECT
    customer_id,
    order_id,
    order_date,
    total_amount,
    AVG(total_amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS running_average
FROM orders;`,
    expectedColumns: ["customer_id","order_id","order_date","total_amount","running_average"],
    solutionQuery: `SELECT
    customer_id,
    order_id,
    order_date,
    total_amount,
    AVG(total_amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS running_average
FROM orders;`,
},
{
    id: 27,
    title: "Previous and Next Order Amount",
    difficulty: "Medium",
    slug: "sql-lag-lead-window-functions",
    seoTitle: "SQL LAG and LEAD Window Functions",
    metaDescription: "Learn how to use SQL LAG() and LEAD() together to compare neighboring rows.",
    tags: ["SQL", "LAG", "LEAD", "Window Functions"],
    description: "Display the previous and next order amount for every customer order.",
    explanation: "LAG() accesses the previous row while LEAD() accesses the following row within the same customer partition.",
    scenario: "The analytics team wants to compare purchases before and after each transaction.",
    useCases: ["Customer behavior", "Purchase sequence analysis", "Window Functions"],
    hint: "Use both LAG() and LEAD() partitioned by customer_id.",
    starterQuery: `SELECT
    customer_id,
    order_id,
    total_amount,
    LAG(total_amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS previous_amount,
    LEAD(total_amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS next_amount
FROM orders;`,
    expectedColumns: ["customer_id","order_id","total_amount","previous_amount","next_amount"],
    solutionQuery: `SELECT
    customer_id,
    order_id,
    total_amount,
    LAG(total_amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS previous_amount,
    LEAD(total_amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS next_amount
FROM orders;`,
},
  {
    id: 28,
    title: "Revenue Drop Detection",
    difficulty: "Medium",
    slug: "sql-lag-partition-by-month-threshold-exclusion",
    seoTitle: "SQL LAG PARTITION BY Month Threshold Exclusion Filtering",
    metaDescription: "Learn how to isolate negative performance exceptions by comparing monthly metrics to preceding positions using window operations.",
    tags: ["SQL", "LAG", "strftime", "Window Functions", "CTE"],
    description: "Find customers whose revenue dropped by more than 50% month-over-month.",
    explanation: "Compare monthly revenue using LAG.",
    scenario: "Identify potential churn risks.",
    useCases: ["Churn prediction", "Revenue monitoring"],
    hint: "LAG(monthly revenue)",
    starterQuery: "WITH monthly AS (\nSELECT customer_id, strftime('%Y-%m', order_date) as month, SUM(total_amount) as revenue\nFROM orders GROUP BY customer_id, month\n)\nSELECT customer_id, month\nFROM (\nSELECT *, LAG(revenue) OVER (PARTITION BY customer_id ORDER BY month) as prev_rev FROM monthly\n) t\nWHERE revenue < 0.5 * prev_rev;",
    expectedColumns: ["customer_id", "month"],
    expectedRowCount: 3,
    solutionQuery: "WITH monthly AS (\nSELECT customer_id, strftime('%Y-%m', order_date) as month, SUM(total_amount) as revenue\nFROM orders GROUP BY customer_id, month\n)\nSELECT customer_id, month\nFROM (\nSELECT *, LAG(revenue) OVER (PARTITION BY customer_id ORDER BY month) as prev_rev FROM monthly\n) t\nWHERE revenue < 0.5 * prev_rev;",
  },
  {
    id: 29,
    title: "Top Revenue Day per Month",
    difficulty: "Medium",
    slug: "sql-row-number-partition-by-month-revenue-desc",
    seoTitle: "SQL ROW_NUMBER PARTITION BY Month Revenue Peak Selectors",
    metaDescription: "Learn how to filter dynamic maximum temporal landmarks by grouping absolute daily summaries into chronological month window rows.",
    tags: ["SQL", "ROW_NUMBER", "strftime", "Window Functions", "CTE"],
    description: "Find the day with highest revenue in each month.",
    explanation: "ROW_NUMBER partitioned by month.",
    scenario: "Finance identifies peak days.",
    useCases: ["Trend analysis", "Peak detection"],
    hint: "ROW_NUMBER() OVER (PARTITION BY month ORDER BY revenue DESC)",
    starterQuery: "WITH daily AS (\nSELECT order_date, strftime('%Y-%m', order_date) as month, SUM(total_amount) as revenue\nFROM orders GROUP BY order_date\n)\nSELECT * FROM (\nSELECT *, ROW_NUMBER() OVER (PARTITION BY month ORDER BY revenue DESC) as rn FROM daily\n) t WHERE rn = 1;",
    expectedColumns: ["order_date", "month", "revenue", "rn"],
    expectedRowCount: 4,
    solutionQuery: "WITH daily AS (\nSELECT order_date, strftime('%Y-%m', order_date) as month, SUM(total_amount) as revenue\nFROM orders GROUP BY order_date\n)\nSELECT * FROM (\nSELECT *, ROW_NUMBER() OVER (PARTITION BY month ORDER BY revenue DESC) as rn FROM daily\n) t WHERE rn = 1;",
  },
  {
    id: 30,
    title: "Rank Orders by Date for Each Customer",
    difficulty: "Medium",
    slug: "sql-row-number-order-history",
    seoTitle: "SQL ROW_NUMBER Customer Order History",
    metaDescription: "Learn how to use SQL ROW_NUMBER() to assign a sequential number to every order for each customer.",
    tags: ["SQL", "ROW_NUMBER", "Window Functions"],
    description: "Assign a sequential order number to every customer's purchase history.",
    explanation: "ROW_NUMBER() generates a unique sequence within each customer based on order date.",
    scenario: "The analytics team wants to identify the first, second, third, and subsequent purchases for every customer.",
    useCases: ["Purchase history", "Customer journey", "Window Functions"],
    hint: "Use ROW_NUMBER() OVER(PARTITION BY customer_id ORDER BY order_date).",
    starterQuery: `SELECT
    customer_id,
    order_id,
    order_date,
    ROW_NUMBER() OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS purchase_number
FROM orders;`,
    expectedColumns: ["customer_id","order_id","order_date","purchase_number"],
    solutionQuery: `SELECT
    customer_id,
    order_id,
    order_date,
    ROW_NUMBER() OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS purchase_number
FROM orders;`,
},
{
    id: 31,
    title: "Customer Revenue Share",
    difficulty: "Medium",
    slug: "sql-window-percent-of-total-revenue",
    seoTitle: "SQL Window Functions Revenue Share",
    metaDescription: "Learn how to calculate each customer's contribution to the overall revenue using SQL window functions.",
    tags: ["SQL", "SUM OVER", "Window Functions"],
    description: "Calculate what percentage of the company's total revenue comes from each customer.",
    explanation: "First calculate total spending per customer. Then divide each customer's spending by the overall revenue using a window aggregate.",
    scenario: "Finance wants to understand which customers contribute the largest share of revenue.",
    useCases: ["Revenue analysis", "Customer segmentation", "Business intelligence"],
    hint: "Aggregate revenue by customer, then divide by SUM(total_spent) OVER().",
    starterQuery: `SELECT
    customer_id,
    total_spent,
    ROUND(
        total_spent * 100.0 /
        SUM(total_spent) OVER (),
        2
    ) AS revenue_percentage
FROM (
    SELECT
        customer_id,
        SUM(total_amount) AS total_spent
    FROM orders
    GROUP BY customer_id
) t;`,
    expectedColumns: ["customer_id","total_spent","revenue_percentage"],
    solutionQuery: `SELECT
    customer_id,
    total_spent,
    ROUND(
        total_spent * 100.0 /
        SUM(total_spent) OVER (),
        2
    ) AS revenue_percentage
FROM (
    SELECT
        customer_id,
        SUM(total_amount) AS total_spent
    FROM orders
    GROUP BY customer_id
) t;`,
},
{
    id: 32,
    title: "Order Amount Compared to Previous Order",
    difficulty: "Medium",
    slug: "sql-lag-order-comparison",
    seoTitle: "SQL Compare Current and Previous Rows Using LAG",
    metaDescription: "Learn how to compare every order with the customer's previous order using the SQL LAG() window function.",
    tags: ["SQL", "LAG", "CASE WHEN", "Window Functions"],
    description: "For every order, determine whether the customer spent more, less, or the same as their previous order.",
    explanation: "Use LAG() to retrieve the previous order amount and compare it with the current order using a CASE expression.",
    scenario: "The analytics team wants to identify whether customers are increasing or decreasing their spending over time.",
    useCases: ["Purchase trend analysis", "Customer behavior", "Window Functions"],
    hint: "Combine LAG() with a CASE expression.",
    starterQuery: `SELECT
    customer_id,
    order_id,
    total_amount,
    CASE
        WHEN total_amount > LAG(total_amount) OVER (
            PARTITION BY customer_id
            ORDER BY order_date
        ) THEN 'Higher'
        WHEN total_amount < LAG(total_amount) OVER (
            PARTITION BY customer_id
            ORDER BY order_date
        ) THEN 'Lower'
        ELSE 'Same'
    END AS comparison
FROM orders;`,
    expectedColumns: ["customer_id","order_id","total_amount","comparison"],
    solutionQuery: `SELECT
    customer_id,
    order_id,
    total_amount,
    CASE
        WHEN total_amount > LAG(total_amount) OVER (
            PARTITION BY customer_id
            ORDER BY order_date
        ) THEN 'Higher'
        WHEN total_amount < LAG(total_amount) OVER (
            PARTITION BY customer_id
            ORDER BY order_date
        ) THEN 'Lower'
        ELSE 'Same'
    END AS comparison
FROM orders;`,
},
  {
    id: 33,
    title: "Temporal Recency Case Segmentations",
    difficulty: "Medium",
    slug: "sql-date-recency-segmentation-case-when-aggregates",
    seoTitle: "SQL Date Recency Segmentation with CASE WHEN and MAX Aggregates",
    metaDescription: "Learn how to branch categorical records into non-overlapping temporal arrays by validating record date limits against structural offset flags.",
    tags: ["SQL", "CASE WHEN", "MAX", "DATE Functions", "GROUP BY"],
    description: "Classify customers into New, Active, or Dormant based on activity.",
    explanation: "CASE logic with date comparisons.",
    scenario: "CRM segmentation.",
    useCases: ["Lifecycle segmentation", "Retention"],
    hint: "Use MAX(order_date)",
    starterQuery: "SELECT customer_id,\nCASE WHEN MAX(order_date) >= DATE('now','-30 days') THEN 'Active'\nWHEN MAX(order_date) >= DATE('now','-90 days') THEN 'Dormant'\nELSE 'Churned' END as stage\nFROM orders GROUP BY customer_id;",
    expectedColumns: ["customer_id", "stage"],
    expectedRowCount: 5,
    solutionQuery: "SELECT customer_id,\nCASE WHEN MAX(order_date) >= DATE('now','-30 days') THEN 'Active'\nWHEN MAX(order_date) >= DATE('now','-90 days') THEN 'Dormant'\nELSE 'Churned' END as stage\nFROM orders GROUP BY customer_id;",
  },
  {
    id: 34,
    title: "Moving Average of Customer Orders",
    difficulty: "Medium",
    slug: "sql-moving-average-window-function",
    seoTitle: "SQL Moving Average Using Window Functions",
    metaDescription: "Learn how to calculate a moving average using SQL window frames with AVG() OVER().",
    tags: ["SQL", "AVG OVER", "Window Functions"],
    description: "Calculate a moving average of the current and previous order amount for every customer.",
    explanation: "Window frames allow you to define exactly which rows participate in a calculation. Here, AVG() computes the average of the current order and the immediately previous order.",
    scenario: "The analytics team wants to smooth customer spending trends over time.",
    useCases: ["Trend analysis", "Customer analytics", "Moving averages"],
    hint: "Use AVG() OVER(PARTITION BY customer_id ORDER BY order_date ROWS BETWEEN 1 PRECEDING AND CURRENT ROW).",
    starterQuery: `SELECT
    customer_id,
    order_id,
    order_date,
    total_amount,
    AVG(total_amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
        ROWS BETWEEN 1 PRECEDING AND CURRENT ROW
    ) AS moving_average
FROM orders;`,
    expectedColumns: ["customer_id","order_id","order_date","total_amount","moving_average"],
    solutionQuery: `SELECT
    customer_id,
    order_id,
    order_date,
    total_amount,
    AVG(total_amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
        ROWS BETWEEN 1 PRECEDING AND CURRENT ROW
    ) AS moving_average
FROM orders;`,
},
{
    id: 35,
    title: "Previous Order Gap in Days",
    difficulty: "Medium",
    slug: "sql-lag-date-difference",
    seoTitle: "SQL LAG with Date Difference",
    metaDescription: "Learn how to calculate the number of days between consecutive orders using SQL LAG() and julianday().",
    tags: ["SQL", "LAG", "julianday", "Window Functions"],
    description: "Calculate the number of days between every order and the customer's previous order.",
    explanation: "LAG() retrieves the previous order date while julianday() converts dates into numeric values so their difference can be calculated.",
    scenario: "The CRM team wants to measure the average time between customer purchases.",
    useCases: ["Purchase interval analysis", "Customer retention", "Window Functions"],
    hint: "Subtract julianday(LAG(order_date)) from julianday(order_date).",
    starterQuery: `SELECT
    customer_id,
    order_id,
    order_date,
    julianday(order_date) -
    julianday(
        LAG(order_date) OVER (
            PARTITION BY customer_id
            ORDER BY order_date
        )
    ) AS days_since_previous_order
FROM orders;`,
    expectedColumns: ["customer_id","order_id","order_date","days_since_previous_order"],
    solutionQuery: `SELECT
    customer_id,
    order_id,
    order_date,
    julianday(order_date) -
    julianday(
        LAG(order_date) OVER (
            PARTITION BY customer_id
            ORDER BY order_date
        )
    ) AS days_since_previous_order
FROM orders;`,
},
{
    id: 36,
    title: "Customer Purchase Quartiles",
    difficulty: "Medium",
    slug: "sql-ntile-window-function",
    seoTitle: "SQL NTILE Window Function Tutorial",
    metaDescription: "Learn how to divide rows into equal groups using the SQL NTILE() window function.",
    tags: ["SQL", "NTILE", "Window Functions"],
    description: "Divide customers into four spending groups based on their total spending.",
    explanation: "First calculate each customer's total spending, then use NTILE(4) to split customers into four equally sized groups ordered by spending.",
    scenario: "The marketing team wants to segment customers into spending tiers.",
    useCases: ["Customer segmentation", "Marketing", "Window Functions"],
    hint: "Calculate total spending first, then use NTILE(4) OVER(ORDER BY total_spent DESC).",
    starterQuery: `SELECT
    customer_id,
    total_spent,
    NTILE(4) OVER (
        ORDER BY total_spent DESC
    ) AS spending_quartile
FROM (
    SELECT
        customer_id,
        SUM(total_amount) AS total_spent
    FROM orders
    GROUP BY customer_id
) t;`,
    expectedColumns: ["customer_id","total_spent","spending_quartile"],
    solutionQuery: `SELECT
    customer_id,
    total_spent,
    NTILE(4) OVER (
        ORDER BY total_spent DESC
    ) AS spending_quartile
FROM (
    SELECT
        customer_id,
        SUM(total_amount) AS total_spent
    FROM orders
    GROUP BY customer_id
) t;`,
},
{
  id: 37,
  title: "Customer Revenue Growth",
  difficulty: "Medium",
  slug: "sql-running-revenue-growth",
  seoTitle: "SQL Running Revenue Growth Using Window Functions",
  metaDescription: "Learn how to compare each order with the cumulative revenue earned before it using SQL window functions.",
  tags: ["SQL", "SUM OVER", "Window Functions"],
  description: "For every customer, display the cumulative revenue before the current order.",
  explanation: "Window frames can exclude the current row. This allows you to compare the current purchase against everything the customer spent previously.",
  scenario: "The finance team wants to compare every purchase against the customer's historical revenue.",
  useCases: ["Customer lifetime value", "Revenue analysis", "Window Functions"],
  hint: "Use SUM() OVER() with ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING.",
  starterQuery: `SELECT
  customer_id,
  order_id,
  order_date,
  total_amount,
  SUM(total_amount) OVER (
      PARTITION BY customer_id
      ORDER BY order_date
      ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
  ) AS previous_revenue
FROM orders;`,
  expectedColumns: ["customer_id","order_id","order_date","total_amount","previous_revenue"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  order_date,
  total_amount,
  SUM(total_amount) OVER (
      PARTITION BY customer_id
      ORDER BY order_date
      ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
  ) AS previous_revenue
FROM orders;`,
},
{
  id: 38,
  title: "Customer Purchase Percentile",
  difficulty: "Medium",
  slug: "sql-percent-rank-window-function",
  seoTitle: "SQL PERCENT_RANK Window Function",
  metaDescription: "Learn how to calculate the percentile ranking of customer orders using SQL PERCENT_RANK().",
  tags: ["SQL", "PERCENT_RANK", "Window Functions"],
  description: "Calculate the percentile rank of every customer's order amount.",
  explanation: "PERCENT_RANK() assigns a percentile score between 0 and 1 based on the order amount within each customer.",
  scenario: "The analytics team wants to understand how each purchase compares to the customer's other purchases.",
  useCases: ["Customer analytics", "Percentile analysis", "Window Functions"],
  hint: "Use PERCENT_RANK() OVER(PARTITION BY customer_id ORDER BY total_amount).",
  starterQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  PERCENT_RANK() OVER (
      PARTITION BY customer_id
      ORDER BY total_amount
  ) AS percentile_rank
FROM orders;`,
  expectedColumns: ["customer_id","order_id","total_amount","percentile_rank"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  PERCENT_RANK() OVER (
      PARTITION BY customer_id
      ORDER BY total_amount
  ) AS percentile_rank
FROM orders;`,
},
{
  id: 39,
  title: "Customer Order Distribution",
  difficulty: "Medium",
  slug: "sql-cume-dist-window-function",
  seoTitle: "SQL CUME_DIST Window Function",
  metaDescription: "Learn how to calculate cumulative distribution using SQL CUME_DIST().",
  tags: ["SQL", "CUME_DIST", "Window Functions"],
  description: "Calculate the cumulative distribution of order amounts for every customer.",
  explanation: "CUME_DIST() returns the cumulative proportion of rows less than or equal to the current row within a partition.",
  scenario: "The analytics team wants to understand where each purchase sits within the customer's spending distribution.",
  useCases: ["Distribution analysis", "Customer behavior", "Window Functions"],
  hint: "Use CUME_DIST() OVER(PARTITION BY customer_id ORDER BY total_amount).",
  starterQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  CUME_DIST() OVER (
      PARTITION BY customer_id
      ORDER BY total_amount
  ) AS cumulative_distribution
FROM orders;`,
  expectedColumns: ["customer_id","order_id","total_amount","cumulative_distribution"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  CUME_DIST() OVER (
      PARTITION BY customer_id
      ORDER BY total_amount
  ) AS cumulative_distribution
FROM orders;`,
},
{
  id: 40,
  title: "Order Amount Compared to Customer Average",
  difficulty: "Medium",
  slug: "sql-window-average-comparison",
  seoTitle: "SQL Window Average Comparison",
  metaDescription: "Learn how to compare each row against a partition average using SQL window functions.",
  tags: ["SQL", "AVG OVER", "CASE WHEN", "Window Functions"],
  description: "Determine whether each order is above, below, or equal to the customer's average order amount.",
  explanation: "AVG() OVER(PARTITION BY customer_id) calculates the customer's average order amount without collapsing rows. A CASE expression is then used to classify every purchase.",
  scenario: "Business analysts want to classify purchases relative to each customer's normal spending.",
  useCases: ["Customer profiling", "Purchase analysis", "Business intelligence"],
  hint: "Combine AVG() OVER(PARTITION BY customer_id) with CASE.",
  starterQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  CASE
      WHEN total_amount > AVG(total_amount) OVER (PARTITION BY customer_id) THEN 'Above Average'
      WHEN total_amount < AVG(total_amount) OVER (PARTITION BY customer_id) THEN 'Below Average'
      ELSE 'Average'
  END AS spending_level
FROM orders;`,
  expectedColumns: ["customer_id","order_id","total_amount","spending_level"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  CASE
      WHEN total_amount > AVG(total_amount) OVER (PARTITION BY customer_id) THEN 'Above Average'
      WHEN total_amount < AVG(total_amount) OVER (PARTITION BY customer_id) THEN 'Below Average'
      ELSE 'Average'
  END AS spending_level
FROM orders;`,
},
{
  id: 41,
  title: "Customer Revenue with Purchase Rank",
  difficulty: "Medium",
  slug: "sql-cte-row-number-customer-revenue",
  seoTitle: "SQL CTE with ROW_NUMBER Window Function",
  metaDescription: "Learn how to combine Common Table Expressions and ROW_NUMBER() to rank customer purchases chronologically.",
  tags: ["SQL", "CTE", "ROW_NUMBER", "Window Functions"],
  description: "Show each customer's orders along with the purchase number and cumulative revenue.",
  explanation: "Use a CTE to prepare the data, then combine ROW_NUMBER() and SUM() OVER() to calculate purchase order and cumulative revenue.",
  scenario: "The analytics team wants to understand how customer lifetime value grows after each purchase.",
  useCases: ["Customer lifetime value", "Purchase history", "Revenue analysis"],
  hint: "Use ROW_NUMBER() and SUM() OVER() inside a CTE.",
  starterQuery: `WITH CustomerOrders AS (
  SELECT
      customer_id,
      order_id,
      order_date,
      total_amount
  FROM orders
)
SELECT
  customer_id,
  order_id,
  order_date,
  total_amount,
  ROW_NUMBER() OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS purchase_number,
  SUM(total_amount) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS cumulative_revenue
FROM CustomerOrders;`,
  expectedColumns: ["customer_id","order_id","order_date","total_amount","purchase_number","cumulative_revenue"],
  solutionQuery: `WITH CustomerOrders AS (
  SELECT
      customer_id,
      order_id,
      order_date,
      total_amount
  FROM orders
)
SELECT
  customer_id,
  order_id,
  order_date,
  total_amount,
  ROW_NUMBER() OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS purchase_number,
  SUM(total_amount) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS cumulative_revenue
FROM CustomerOrders;`,
},
{
  id: 42,
  title: "Customer Purchase Gap Analysis",
  difficulty: "Medium",
  slug: "sql-lag-julianday-gap-analysis",
  seoTitle: "SQL LAG with Date Difference Analysis",
  metaDescription: "Learn how to combine LAG() and julianday() to calculate the number of days between customer purchases.",
  tags: ["SQL", "LAG", "julianday", "Window Functions"],
  description: "For every order, display the previous order date and the number of days since the previous purchase.",
  explanation: "LAG() retrieves the previous order date, while julianday() converts dates into numeric values so their difference can be calculated.",
  scenario: "The retention team wants to measure the average gap between purchases.",
  useCases: ["Customer retention", "Purchase frequency", "Behavior analysis"],
  hint: "Combine LAG() with julianday().",
  starterQuery: `SELECT
  customer_id,
  order_id,
  order_date,
  LAG(order_date) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS previous_order_date,
  julianday(order_date) -
  julianday(
      LAG(order_date) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      )
  ) AS days_between_orders
FROM orders;`,
  expectedColumns: ["customer_id","order_id","order_date","previous_order_date","days_between_orders"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  order_date,
  LAG(order_date) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS previous_order_date,
  julianday(order_date) -
  julianday(
      LAG(order_date) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      )
  ) AS days_between_orders
FROM orders;`,
},
{
  id: 43,
  title: "Top 2 Orders per Customer",
  difficulty: "Medium",
  slug: "sql-row-number-top-n-per-group",
  seoTitle: "SQL Top N Records Per Group",
  metaDescription: "Learn how to retrieve the top N records within each group using ROW_NUMBER().",
  tags: ["SQL", "ROW_NUMBER", "Window Functions"],
  description: "Find the two highest-value orders for every customer.",
  explanation: "Assign a row number ordered by total_amount within each customer and return the first two rows.",
  scenario: "Sales managers want to review each customer's largest purchases.",
  useCases: ["Purchase analysis", "Customer insights", "Top-N reporting"],
  hint: "Use ROW_NUMBER() and filter rows where rn <= 2.",
  starterQuery: `SELECT
  customer_id,
  order_id,
  total_amount
FROM (
  SELECT
      customer_id,
      order_id,
      total_amount,
      ROW_NUMBER() OVER(
          PARTITION BY customer_id
          ORDER BY total_amount DESC
      ) AS rn
  FROM orders
) t
WHERE rn <= 2;`,
  expectedColumns: ["customer_id","order_id","total_amount"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  total_amount
FROM (
  SELECT
      customer_id,
      order_id,
      total_amount,
      ROW_NUMBER() OVER(
          PARTITION BY customer_id
          ORDER BY total_amount DESC
      ) AS rn
  FROM orders
) t
WHERE rn <= 2;`,
},
{
  id: 44,
  title: "Top Spending Day for Every Customer",
  difficulty: "Medium",
  slug: "sql-cte-row-number-top-day",
  seoTitle: "SQL ROW_NUMBER Top Spending Day per Customer",
  metaDescription: "Learn how to combine CTEs and ROW_NUMBER() to identify each customer's highest spending day.",
  tags: ["SQL", "CTE", "ROW_NUMBER", "Window Functions"],
  description: "Find the day on which each customer spent the most money.",
  explanation: "First calculate total spending per customer per day, then rank the days for each customer using ROW_NUMBER().",
  scenario: "Marketing wants to identify each customer's biggest shopping day.",
  useCases: ["Customer analytics", "Purchase behavior", "Window Functions"],
  hint: "Aggregate by customer_id and order_date, then use ROW_NUMBER().",
  starterQuery: `WITH DailySpend AS (
  SELECT
      customer_id,
      order_date,
      SUM(total_amount) AS daily_total
  FROM orders
  GROUP BY customer_id, order_date
)
SELECT
  customer_id,
  order_date,
  daily_total
FROM (
  SELECT *,
         ROW_NUMBER() OVER(
             PARTITION BY customer_id
             ORDER BY daily_total DESC
         ) AS rn
  FROM DailySpend
) t
WHERE rn = 1;`,
  expectedColumns: ["customer_id","order_date","daily_total"],
  solutionQuery: `WITH DailySpend AS (
  SELECT
      customer_id,
      order_date,
      SUM(total_amount) AS daily_total
  FROM orders
  GROUP BY customer_id, order_date
)
SELECT
  customer_id,
  order_date,
  daily_total
FROM (
  SELECT *,
         ROW_NUMBER() OVER(
             PARTITION BY customer_id
             ORDER BY daily_total DESC
         ) AS rn
  FROM DailySpend
) t
WHERE rn = 1;`,
},
{
  id: 45,
  title: "Customer Revenue Running Percentage",
  difficulty: "Medium",
  slug: "sql-running-percentage-window-function",
  seoTitle: "SQL Running Percentage Using Window Functions",
  metaDescription: "Learn how to calculate running revenue percentages using cumulative window aggregates.",
  tags: ["SQL", "SUM OVER", "Window Functions"],
  description: "For every customer, calculate the cumulative percentage of revenue after each order.",
  explanation: "Combine two window aggregates to calculate cumulative revenue and total customer revenue.",
  scenario: "Finance wants to know how quickly customers reach their lifetime value.",
  useCases: ["Revenue analysis", "Customer lifetime value", "Window Functions"],
  hint: "Use two SUM() OVER() functions.",
  starterQuery: `SELECT
  customer_id,
  order_id,
  order_date,
  total_amount,
  ROUND(
      SUM(total_amount) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) * 100.0 /
      SUM(total_amount) OVER(
          PARTITION BY customer_id
      ),
      2
  ) AS cumulative_percentage
FROM orders;`,
  expectedColumns: ["customer_id","order_id","order_date","total_amount","cumulative_percentage"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  order_date,
  total_amount,
  ROUND(
      SUM(total_amount) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) * 100.0 /
      SUM(total_amount) OVER(
          PARTITION BY customer_id
      ),
      2
  ) AS cumulative_percentage
FROM orders;`,
},
{
  id: 46,
  title: "Customer Spending Trend",
  difficulty: "Medium",
  slug: "sql-lag-case-trend-analysis",
  seoTitle: "SQL LAG with CASE Expression",
  metaDescription: "Learn how to combine LAG() and CASE expressions to classify customer spending trends.",
  tags: ["SQL", "LAG", "CASE WHEN", "Window Functions"],
  description: "Classify every order as Increased, Decreased or Unchanged compared to the previous order.",
  explanation: "Use LAG() to retrieve the previous order amount and compare it using CASE.",
  scenario: "Business analysts want to understand whether customers are spending more or less over time.",
  useCases: ["Trend analysis", "Customer behavior", "Window Functions"],
  hint: "Combine LAG() with CASE.",
  starterQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  CASE
      WHEN LAG(total_amount) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) IS NULL THEN 'First Order'
      WHEN total_amount >
           LAG(total_amount) OVER(
               PARTITION BY customer_id
               ORDER BY order_date
           ) THEN 'Increased'
      WHEN total_amount <
           LAG(total_amount) OVER(
               PARTITION BY customer_id
               ORDER BY order_date
           ) THEN 'Decreased'
      ELSE 'Unchanged'
  END AS spending_trend
FROM orders;`,
  expectedColumns: ["customer_id","order_id","total_amount","spending_trend"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  CASE
      WHEN LAG(total_amount) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) IS NULL THEN 'First Order'
      WHEN total_amount >
           LAG(total_amount) OVER(
               PARTITION BY customer_id
               ORDER BY order_date
           ) THEN 'Increased'
      WHEN total_amount <
           LAG(total_amount) OVER(
               PARTITION BY customer_id
               ORDER BY order_date
           ) THEN 'Decreased'
      ELSE 'Unchanged'
  END AS spending_trend
FROM orders;`,
},
{
  id: 47,
  title: "Top 3 Products by Revenue",
  difficulty: "Medium",
  slug: "sql-cte-dense-rank-product-revenue",
  seoTitle: "SQL DENSE_RANK Product Revenue",
  metaDescription: "Learn how to combine CTEs, aggregation and DENSE_RANK() to rank products by revenue.",
  tags: ["SQL", "CTE", "DENSE_RANK", "JOIN", "Window Functions"],
  description: "Find the three highest revenue generating products.",
  explanation: "Calculate revenue for every product using order_items, then rank products by revenue using DENSE_RANK().",
  scenario: "The merchandising team wants to identify the company's highest revenue products.",
  useCases: ["Product analytics", "Revenue analysis", "Business intelligence"],
  hint: "Aggregate revenue first, then use DENSE_RANK().",
  starterQuery: `WITH ProductRevenue AS (
  SELECT
      p.product_id,
      p.product_name,
      SUM(oi.total_price) AS revenue
  FROM products p
  JOIN order_items oi
      ON p.product_id = oi.product_id
  GROUP BY
      p.product_id,
      p.product_name
)
SELECT
  product_id,
  product_name,
  revenue
FROM (
  SELECT *,
         DENSE_RANK() OVER(
             ORDER BY revenue DESC
         ) AS rank_no
  FROM ProductRevenue
) t
WHERE rank_no <= 3;`,
  expectedColumns: ["product_id","product_name","revenue"],
  solutionQuery: `WITH ProductRevenue AS (
  SELECT
      p.product_id,
      p.product_name,
      SUM(oi.total_price) AS revenue
  FROM products p
  JOIN order_items oi
      ON p.product_id = oi.product_id
  GROUP BY
      p.product_id,
      p.product_name
)
SELECT
  product_id,
  product_name,
  revenue
FROM (
  SELECT *,
         DENSE_RANK() OVER(
             ORDER BY revenue DESC
         ) AS rank_no
  FROM ProductRevenue
) t
WHERE rank_no <= 3;`,
},
{
  id: 48,
  title: "Rank Products Within Each Category",
  difficulty: "Medium",
  slug: "sql-dense-rank-products-by-category",
  seoTitle: "SQL DENSE_RANK Products by Category",
  metaDescription: "Learn how to rank products within each category using DENSE_RANK() and window functions.",
  tags: ["SQL", "DENSE_RANK", "Window Functions", "JOIN"],
  description: "Rank every product by price within its category.",
  explanation: "DENSE_RANK() assigns rankings within each category. Products with the same price receive the same rank without gaps.",
  scenario: "The merchandising team wants to compare product pricing within each category.",
  useCases: ["Product ranking", "Pricing analysis", "Business reporting"],
  hint: "Partition by category and order by price DESC.",
  starterQuery: `SELECT
  category,
  product_id,
  product_name,
  price,
  DENSE_RANK() OVER(
      PARTITION BY category
      ORDER BY price DESC
  ) AS price_rank
FROM products;`,
  expectedColumns: ["category","product_id","product_name","price","price_rank"],
  solutionQuery: `SELECT
  category,
  product_id,
  product_name,
  price,
  DENSE_RANK() OVER(
      PARTITION BY category
      ORDER BY price DESC
  ) AS price_rank
FROM products;`,
},
{
  id: 49,
  title: "Customer Purchase Timeline",
  difficulty: "Medium",
  slug: "sql-lead-lag-purchase-timeline",
  seoTitle: "SQL LEAD and LAG Purchase Timeline",
  metaDescription: "Learn how to combine LAG() and LEAD() to analyze customer purchase history.",
  tags: ["SQL", "LAG", "LEAD", "Window Functions"],
  description: "For every order, display both the previous and next order dates of the customer.",
  explanation: "LAG() retrieves the previous order while LEAD() retrieves the next order, making it easy to analyze purchase sequences.",
  scenario: "The analytics team wants to understand customer purchase timelines.",
  useCases: ["Purchase history", "Customer analytics", "Window Functions"],
  hint: "Use both LAG() and LEAD() partitioned by customer_id.",
  starterQuery: `SELECT
  customer_id,
  order_id,
  order_date,
  LAG(order_date) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS previous_order,
  LEAD(order_date) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS next_order
FROM orders;`,
  expectedColumns: ["customer_id","order_id","order_date","previous_order","next_order"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  order_date,
  LAG(order_date) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS previous_order,
  LEAD(order_date) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS next_order
FROM orders;`,
},
{
  id: 50,
  title: "Customer Revenue Summary",
  difficulty: "Medium",
  slug: "sql-multiple-window-aggregates",
  seoTitle: "SQL Multiple Window Aggregates",
  metaDescription: "Learn how to calculate multiple customer metrics using SQL window aggregate functions.",
  tags: ["SQL", "SUM OVER", "AVG OVER", "COUNT OVER", "Window Functions"],
  description: "For every order, display the customer's total revenue, average order amount, and total number of orders.",
  explanation: "Window aggregates allow multiple customer-level metrics to be calculated without grouping the data.",
  scenario: "Finance wants a complete customer summary available on every order.",
  useCases: ["Customer analytics", "Revenue reporting", "Business intelligence"],
  hint: "Use SUM(), AVG(), and COUNT() as window functions.",
  starterQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  SUM(total_amount) OVER(
      PARTITION BY customer_id
  ) AS total_revenue,
  AVG(total_amount) OVER(
      PARTITION BY customer_id
  ) AS average_order,
  COUNT(*) OVER(
      PARTITION BY customer_id
  ) AS total_orders
FROM orders;`,
  expectedColumns: ["customer_id","order_id","total_amount","total_revenue","average_order","total_orders"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  SUM(total_amount) OVER(
      PARTITION BY customer_id
  ) AS total_revenue,
  AVG(total_amount) OVER(
      PARTITION BY customer_id
  ) AS average_order,
  COUNT(*) OVER(
      PARTITION BY customer_id
  ) AS total_orders
FROM orders;`,
},
{
  id: 51,
  title: "Highest Revenue Category",
  difficulty: "Medium+",
  slug: "sql-cte-category-revenue-ranking",
  seoTitle: "SQL Category Revenue Ranking",
  metaDescription: "Learn how to combine CTEs, JOINs, aggregation and ranking to identify the highest revenue product category.",
  tags: ["SQL", "CTE", "JOIN", "SUM", "ROW_NUMBER"],
  description: "Find the product category with the highest total revenue.",
  explanation: "Calculate revenue for every category using a CTE, then rank the categories using ROW_NUMBER().",
  scenario: "Leadership wants to know which category generates the most revenue.",
  useCases: ["Revenue analysis", "Category reporting", "Executive dashboard"],
  hint: "Aggregate revenue by category, then rank categories.",
  starterQuery: `WITH CategoryRevenue AS (
  SELECT
      p.category,
      SUM(oi.total_price) AS revenue
  FROM products p
  JOIN order_items oi
      ON p.product_id = oi.product_id
  GROUP BY p.category
)
SELECT
  category,
  revenue
FROM (
  SELECT *,
         ROW_NUMBER() OVER(
             ORDER BY revenue DESC
         ) AS rn
  FROM CategoryRevenue
) t
WHERE rn = 1;`,
  expectedColumns: ["category","revenue"],
  solutionQuery: `WITH CategoryRevenue AS (
  SELECT
      p.category,
      SUM(oi.total_price) AS revenue
  FROM products p
  JOIN order_items oi
      ON p.product_id = oi.product_id
  GROUP BY p.category
)
SELECT
  category,
  revenue
FROM (
  SELECT *,
         ROW_NUMBER() OVER(
             ORDER BY revenue DESC
         ) AS rn
  FROM CategoryRevenue
) t
WHERE rn = 1;`,
},
{
  id: 52,
  title: "Customer Revenue and Purchase Rank",
  difficulty: "Medium+",
  slug: "sql-multi-cte-customer-revenue-rank",
  seoTitle: "SQL Multiple CTEs with ROW_NUMBER",
  metaDescription: "Learn how to combine multiple CTEs with window functions to build customer revenue reports.",
  tags: ["SQL", "CTE", "ROW_NUMBER", "SUM", "Window Functions"],
  description: "For each customer, show every order, cumulative revenue, and purchase rank.",
  explanation: "The first CTE prepares order data, while the second applies multiple window functions to calculate purchase order and cumulative revenue.",
  scenario: "The finance team wants a chronological customer revenue report.",
  useCases: ["Customer analytics", "Revenue reporting", "Business intelligence"],
  hint: "Use two CTEs followed by ROW_NUMBER() and SUM() OVER().",
  starterQuery: `WITH CustomerOrders AS (
  SELECT
      customer_id,
      order_id,
      order_date,
      total_amount
  FROM orders
),
OrderMetrics AS (
  SELECT
      *,
      ROW_NUMBER() OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS purchase_rank,
      SUM(total_amount) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS cumulative_revenue
  FROM CustomerOrders
)
SELECT
  customer_id,
  order_id,
  order_date,
  total_amount,
  purchase_rank,
  cumulative_revenue
FROM OrderMetrics;`,
  expectedColumns: ["customer_id","order_id","order_date","total_amount","purchase_rank","cumulative_revenue"],
  solutionQuery: `WITH CustomerOrders AS (
  SELECT
      customer_id,
      order_id,
      order_date,
      total_amount
  FROM orders
),
OrderMetrics AS (
  SELECT
      *,
      ROW_NUMBER() OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS purchase_rank,
      SUM(total_amount) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS cumulative_revenue
  FROM CustomerOrders
)
SELECT
  customer_id,
  order_id,
  order_date,
  total_amount,
  purchase_rank,
  cumulative_revenue
FROM OrderMetrics;`,
},
{
  id: 53,
  title: "Order Value Compared to Running Average",
  difficulty: "Medium+",
  slug: "sql-running-average-comparison",
  seoTitle: "SQL Running Average Comparison",
  metaDescription: "Learn how to compare each order with the running average using SQL window functions.",
  tags: ["SQL", "AVG OVER", "CASE WHEN", "Window Functions"],
  description: "Determine whether each order is above or below the customer's running average.",
  explanation: "Calculate the running average using AVG() OVER() and compare the current order using a CASE expression.",
  scenario: "The analytics team wants to identify unusually large purchases as customers continue buying.",
  useCases: ["Purchase analysis", "Trend analysis", "Customer behavior"],
  hint: "Use AVG() OVER() together with CASE.",
  starterQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  CASE
      WHEN total_amount >
           AVG(total_amount) OVER(
               PARTITION BY customer_id
               ORDER BY order_date
           )
      THEN 'Above Average'
      ELSE 'Below Average'
  END AS comparison
FROM orders;`,
  expectedColumns: ["customer_id","order_id","total_amount","comparison"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  CASE
      WHEN total_amount >
           AVG(total_amount) OVER(
               PARTITION BY customer_id
               ORDER BY order_date
           )
      THEN 'Above Average'
      ELSE 'Below Average'
  END AS comparison
FROM orders;`,
},
{
  id: 54,
  title: "Customer Purchase Sequence Summary",
  difficulty: "Medium+",
  slug: "sql-first-last-order-summary",
  seoTitle: "SQL FIRST_VALUE and LAST_VALUE",
  metaDescription: "Learn how to combine FIRST_VALUE() and LAST_VALUE() to summarize customer purchases.",
  tags: ["SQL", "FIRST_VALUE", "LAST_VALUE", "Window Functions"],
  description: "For every order, display the customer's first order amount and latest order amount.",
  explanation: "Combine FIRST_VALUE() and LAST_VALUE() using a full window frame to retrieve the first and last purchase amounts.",
  scenario: "The sales team wants to compare customers' first purchase with their latest purchase.",
  useCases: ["Customer history", "Purchase analytics", "Window Functions"],
  hint: "Use FIRST_VALUE() and LAST_VALUE() together.",
  starterQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  FIRST_VALUE(total_amount) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS first_purchase,
  LAST_VALUE(total_amount) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
      ROWS BETWEEN UNBOUNDED PRECEDING
      AND UNBOUNDED FOLLOWING
  ) AS latest_purchase
FROM orders;`,
  expectedColumns: ["customer_id","order_id","total_amount","first_purchase","latest_purchase"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  FIRST_VALUE(total_amount) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS first_purchase,
  LAST_VALUE(total_amount) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
      ROWS BETWEEN UNBOUNDED PRECEDING
      AND UNBOUNDED FOLLOWING
  ) AS latest_purchase
FROM orders;`,
},
{
  id: 55,
  title: "Product Revenue Contribution",
  difficulty: "Medium+",
  slug: "sql-product-revenue-share",
  seoTitle: "SQL Product Revenue Share",
  metaDescription: "Learn how to calculate each product's contribution to total revenue using CTEs and window functions.",
  tags: ["SQL", "CTE", "SUM OVER", "JOIN", "Window Functions"],
  description: "Calculate each product's percentage contribution to overall product revenue.",
  explanation: "First aggregate revenue by product, then use SUM() OVER() to calculate each product's percentage contribution.",
  scenario: "Product managers want to know how much each product contributes to overall revenue.",
  useCases: ["Revenue reporting", "Product analytics", "Business intelligence"],
  hint: "Aggregate first, then divide by SUM(revenue) OVER().",
  starterQuery: `WITH ProductRevenue AS (
  SELECT
      p.product_id,
      p.product_name,
      SUM(oi.total_price) AS revenue
  FROM products p
  JOIN order_items oi
      ON p.product_id = oi.product_id
  GROUP BY
      p.product_id,
      p.product_name
)
SELECT
  product_id,
  product_name,
  revenue,
  ROUND(
      revenue * 100.0 /
      SUM(revenue) OVER(),
      2
  ) AS revenue_percentage
FROM ProductRevenue;`,
  expectedColumns: ["product_id","product_name","revenue","revenue_percentage"],
  solutionQuery: `WITH ProductRevenue AS (
  SELECT
      p.product_id,
      p.product_name,
      SUM(oi.total_price) AS revenue
  FROM products p
  JOIN order_items oi
      ON p.product_id = oi.product_id
  GROUP BY
      p.product_id,
      p.product_name
)
SELECT
  product_id,
  product_name,
  revenue,
  ROUND(
      revenue * 100.0 /
      SUM(revenue) OVER(),
      2
  ) AS revenue_percentage
FROM ProductRevenue;`,
},
{
  id: 56,
  title: "Customer Purchase Milestones",
  difficulty: "Medium+",
  slug: "sql-cte-row-number-milestones",
  seoTitle: "SQL Customer Purchase Milestones using ROW_NUMBER",
  metaDescription: "Learn how to identify customer purchase milestones using CTEs and ROW_NUMBER().",
  tags: ["SQL", "CTE", "ROW_NUMBER", "Window Functions"],
  description: "Display every customer's first, second and third purchase number.",
  explanation: "ROW_NUMBER() assigns an order to every purchase. The result can be used to identify customer milestones.",
  scenario: "The CRM team wants to trigger campaigns after a customer's first three purchases.",
  useCases: ["Customer lifecycle", "Marketing automation", "Purchase milestones"],
  hint: "Use ROW_NUMBER() inside a CTE.",
  starterQuery: `WITH RankedOrders AS (
  SELECT
      customer_id,
      order_id,
      order_date,
      ROW_NUMBER() OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS purchase_number
  FROM orders
)
SELECT
  customer_id,
  order_id,
  purchase_number
FROM RankedOrders
WHERE purchase_number <= 3;`,
  expectedColumns: ["customer_id","order_id","purchase_number"],
  solutionQuery: `WITH RankedOrders AS (
  SELECT
      customer_id,
      order_id,
      order_date,
      ROW_NUMBER() OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS purchase_number
  FROM orders
)
SELECT
  customer_id,
  order_id,
  purchase_number
FROM RankedOrders
WHERE purchase_number <= 3;`,
},
{
  id: 57,
  title: "Customer Revenue Difference",
  difficulty: "Medium+",
  slug: "sql-running-total-lag-difference",
  seoTitle: "SQL Running Total with LAG",
  metaDescription: "Learn how to combine running totals with LAG() to compare cumulative customer revenue.",
  tags: ["SQL", "SUM OVER", "LAG", "Window Functions"],
  description: "Show the increase in cumulative revenue after every customer order.",
  explanation: "First calculate a running total for each customer, then use LAG() to compare the current cumulative revenue with the previous cumulative revenue.",
  scenario: "The finance team wants to understand how much each new purchase increases a customer's lifetime revenue.",
  useCases: [
    "Revenue analysis",
    "Customer lifetime value",
    "Financial reporting"
  ],
  hint: "Calculate the running total in a CTE, then use LAG() on the cumulative revenue.",
  starterQuery: `WITH RevenueCTE AS (
SELECT
    customer_id,
    order_id,
    order_date,
    SUM(total_amount) OVER(
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS cumulative_revenue
FROM orders
)
SELECT
customer_id,
order_id,
cumulative_revenue,
cumulative_revenue -
LAG(cumulative_revenue) OVER(
    PARTITION BY customer_id
    ORDER BY order_date
) AS revenue_increase
FROM RevenueCTE
ORDER BY customer_id, order_date;`,
  expectedColumns: [
    "customer_id",
    "order_id",
    "cumulative_revenue",
    "revenue_increase"
  ],
  solutionQuery: `WITH RevenueCTE AS (
SELECT
    customer_id,
    order_id,
    order_date,
    SUM(total_amount) OVER(
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS cumulative_revenue
FROM orders
)
SELECT
customer_id,
order_id,
cumulative_revenue,
cumulative_revenue -
LAG(cumulative_revenue) OVER(
    PARTITION BY customer_id
    ORDER BY order_date
) AS revenue_increase
FROM RevenueCTE
ORDER BY customer_id, order_date;`,
},
{
  id: 58,
  title: "Top Revenue Product Per Category",
  difficulty: "Medium+",
  slug: "sql-category-product-ranking",
  seoTitle: "SQL Product Revenue Ranking by Category",
  metaDescription: "Learn how to rank products by revenue within each category using CTEs and window functions.",
  tags: ["SQL", "CTE", "JOIN", "ROW_NUMBER", "Window Functions"],
  description: "Find the highest revenue generating product in each category.",
  explanation: "Aggregate product revenue, then rank products within each category using ROW_NUMBER().",
  scenario: "The merchandising team wants to identify the best-performing product in every category.",
  useCases: ["Revenue analysis", "Category reporting", "Product analytics"],
  hint: "Aggregate first, then use ROW_NUMBER() partitioned by category.",
  starterQuery: `WITH ProductRevenue AS (
  SELECT
      p.category,
      p.product_id,
      p.product_name,
      SUM(oi.total_price) AS revenue
  FROM products p
  JOIN order_items oi
      ON p.product_id = oi.product_id
  GROUP BY
      p.category,
      p.product_id,
      p.product_name
)
SELECT
  category,
  product_name,
  revenue
FROM (
  SELECT *,
         ROW_NUMBER() OVER(
             PARTITION BY category
             ORDER BY revenue DESC
         ) AS rn
  FROM ProductRevenue
) t
WHERE rn = 1;`,
  expectedColumns: ["category","product_name","revenue"],
  solutionQuery: `WITH ProductRevenue AS (
  SELECT
      p.category,
      p.product_id,
      p.product_name,
      SUM(oi.total_price) AS revenue
  FROM products p
  JOIN order_items oi
      ON p.product_id = oi.product_id
  GROUP BY
      p.category,
      p.product_id,
      p.product_name
)
SELECT
  category,
  product_name,
  revenue
FROM (
  SELECT *,
         ROW_NUMBER() OVER(
             PARTITION BY category
             ORDER BY revenue DESC
         ) AS rn
  FROM ProductRevenue
) t
WHERE rn = 1;`,
},
{
  id: 59,
  title: "Customer Purchase Gap Classification",
  difficulty: "Medium+",
  slug: "sql-lag-julianday-case",
  seoTitle: "SQL LAG with Date Gap Classification",
  metaDescription: "Learn how to classify purchase frequency using LAG(), julianday(), and CASE.",
  tags: ["SQL", "LAG", "CASE WHEN", "julianday", "Window Functions"],
  description: "Classify the gap between consecutive customer purchases.",
  explanation: "Calculate the difference between consecutive orders and classify them as Short, Medium, or Long gaps.",
  scenario: "The retention team wants to identify purchasing frequency patterns.",
  useCases: ["Customer retention", "Behavior analysis", "Purchase frequency"],
  hint: "Combine LAG(), julianday(), and CASE.",
  starterQuery: `SELECT
  customer_id,
  order_id,
  order_date,
  CASE
      WHEN LAG(order_date) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) IS NULL THEN 'First Order'
      WHEN julianday(order_date) -
           julianday(LAG(order_date) OVER(
               PARTITION BY customer_id
               ORDER BY order_date
           )) <= 7 THEN 'Short Gap'
      WHEN julianday(order_date) -
           julianday(LAG(order_date) OVER(
               PARTITION BY customer_id
               ORDER BY order_date
           )) <= 30 THEN 'Medium Gap'
      ELSE 'Long Gap'
  END AS purchase_gap
FROM orders;`,
  expectedColumns: ["customer_id","order_id","order_date","purchase_gap"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  order_date,
  CASE
      WHEN LAG(order_date) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) IS NULL THEN 'First Order'
      WHEN julianday(order_date) -
           julianday(LAG(order_date) OVER(
               PARTITION BY customer_id
               ORDER BY order_date
           )) <= 7 THEN 'Short Gap'
      WHEN julianday(order_date) -
           julianday(LAG(order_date) OVER(
               PARTITION BY customer_id
               ORDER BY order_date
           )) <= 30 THEN 'Medium Gap'
      ELSE 'Long Gap'
  END AS purchase_gap
FROM orders;`,
},
{
  id: 60,
  title: "Customer Revenue Dashboard",
  difficulty: "Medium+",
  slug: "sql-customer-dashboard-window-functions",
  seoTitle: "SQL Customer Revenue Dashboard",
  metaDescription: "Learn how to build a customer dashboard using multiple SQL window functions.",
  tags: ["SQL", "SUM OVER", "AVG OVER", "ROW_NUMBER", "Window Functions"],
  description: "Build a customer dashboard showing purchase rank, total revenue, average order value and cumulative revenue.",
  explanation: "Combine multiple window functions in a single query to generate a customer analytics dashboard.",
  scenario: "Business analysts need all important customer metrics in one result set.",
  useCases: ["Customer dashboard", "Business intelligence", "Revenue reporting"],
  hint: "Use ROW_NUMBER(), SUM() OVER(), and AVG() OVER() together.",
  starterQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  ROW_NUMBER() OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS purchase_rank,
  SUM(total_amount) OVER(
      PARTITION BY customer_id
  ) AS total_revenue,
  AVG(total_amount) OVER(
      PARTITION BY customer_id
  ) AS average_order_value,
  SUM(total_amount) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS cumulative_revenue
FROM orders;`,
  expectedColumns: [
      "customer_id",
      "order_id",
      "total_amount",
      "purchase_rank",
      "total_revenue",
      "average_order_value",
      "cumulative_revenue"
  ],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  ROW_NUMBER() OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS purchase_rank,
  SUM(total_amount) OVER(
      PARTITION BY customer_id
  ) AS total_revenue,
  AVG(total_amount) OVER(
      PARTITION BY customer_id
  ) AS average_order_value,
  SUM(total_amount) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS cumulative_revenue
FROM orders;`,
},
{
  id: 61,
  title: "Customer Spending Deciles",
  difficulty: "Medium+",
  slug: "sql-ntile-customer-spending",
  seoTitle: "SQL NTILE Customer Spending Analysis",
  metaDescription: "Learn how to divide customers into spending deciles using SQL NTILE() window function.",
  tags: ["SQL", "NTILE", "SUM", "Window Functions"],
  description: "Divide customers into 10 spending groups based on their total revenue.",
  explanation: "First calculate total spending for every customer, then use NTILE(10) to assign customers into spending deciles.",
  scenario: "The marketing team wants to build Bronze, Silver, Gold, and Platinum style customer segments.",
  useCases: ["Customer segmentation", "Marketing", "Revenue analysis"],
  hint: "Aggregate customer revenue first, then use NTILE(10).",
  starterQuery: `WITH CustomerRevenue AS (
  SELECT
      customer_id,
      SUM(total_amount) AS total_revenue
  FROM orders
  GROUP BY customer_id
)
SELECT
  customer_id,
  total_revenue,
  NTILE(10) OVER(
      ORDER BY total_revenue DESC
  ) AS revenue_decile
FROM CustomerRevenue;`,
  expectedColumns: ["customer_id","total_revenue","revenue_decile"],
  solutionQuery: `WITH CustomerRevenue AS (
  SELECT
      customer_id,
      SUM(total_amount) AS total_revenue
  FROM orders
  GROUP BY customer_id
)
SELECT
  customer_id,
  total_revenue,
  NTILE(10) OVER(
      ORDER BY total_revenue DESC
  ) AS revenue_decile
FROM CustomerRevenue;`,
},
{
  id: 62,
  title: "Customer Purchase Velocity",
  difficulty: "Medium+",
  slug: "sql-lag-lead-purchase-velocity",
  seoTitle: "SQL Purchase Velocity Analysis",
  metaDescription: "Learn how to analyze purchase velocity using SQL LAG(), LEAD(), and date functions.",
  tags: ["SQL", "LAG", "LEAD", "julianday", "Window Functions"],
  description: "Display the number of days since the previous order and until the next order for every purchase.",
  explanation: "Combine LAG() and LEAD() with julianday() to calculate both backward and forward purchase intervals.",
  scenario: "The CRM team wants to understand customer buying frequency.",
  useCases: ["Retention", "Purchase frequency", "Customer analytics"],
  hint: "Use both LAG() and LEAD() together.",
  starterQuery: `SELECT
  customer_id,
  order_id,
  order_date,
  julianday(order_date) -
  julianday(LAG(order_date) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  )) AS days_since_previous,
  julianday(LEAD(order_date) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  )) -
  julianday(order_date) AS days_until_next
FROM orders;`,
  expectedColumns: ["customer_id","order_id","order_date","days_since_previous","days_until_next"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  order_date,
  julianday(order_date) -
  julianday(LAG(order_date) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  )) AS days_since_previous,
  julianday(LEAD(order_date) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  )) -
  julianday(order_date) AS days_until_next
FROM orders;`,
},
{
  id: 63,
  title: "Customer Revenue Trend Dashboard",
  difficulty: "Medium+",
  slug: "sql-window-dashboard-metrics",
  seoTitle: "SQL Window Function Dashboard",
  metaDescription: "Learn how to build a customer analytics dashboard using multiple SQL window functions.",
  tags: ["SQL", "ROW_NUMBER", "SUM OVER", "AVG OVER", "LAG"],
  description: "For every order, display purchase number, cumulative revenue, average order amount and previous order amount.",
  explanation: "Combine several window functions in a single query to create a customer analytics dashboard.",
  scenario: "Business analysts want multiple customer KPIs without grouping the data.",
  useCases: ["Dashboards", "Business Intelligence", "Customer Analytics"],
  hint: "Use ROW_NUMBER(), SUM(), AVG() and LAG() together.",
  starterQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  ROW_NUMBER() OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS purchase_number,
  SUM(total_amount) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS cumulative_revenue,
  AVG(total_amount) OVER(
      PARTITION BY customer_id
  ) AS average_order,
  LAG(total_amount) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS previous_order
FROM orders;`,
  expectedColumns: [
      "customer_id",
      "order_id",
      "total_amount",
      "purchase_number",
      "cumulative_revenue",
      "average_order",
      "previous_order"
  ],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  ROW_NUMBER() OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS purchase_number,
  SUM(total_amount) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS cumulative_revenue,
  AVG(total_amount) OVER(
      PARTITION BY customer_id
  ) AS average_order,
  LAG(total_amount) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS previous_order
FROM orders;`,
},
{
  id: 64,
  title: "Top Revenue Product Per Brand",
  difficulty: "Medium+",
  slug: "sql-brand-product-ranking",
  seoTitle: "SQL Product Ranking by Brand",
  metaDescription: "Learn how to rank products within every brand using SQL CTEs and ROW_NUMBER().",
  tags: ["SQL", "CTE", "JOIN", "ROW_NUMBER", "Window Functions"],
  description: "Find the highest revenue product for every brand.",
  explanation: "Aggregate revenue by product, then rank products within each brand using ROW_NUMBER().",
  scenario: "Product managers want to identify the flagship product for every brand.",
  useCases: ["Product analytics", "Revenue reporting", "Business intelligence"],
  hint: "Aggregate revenue first, then partition by brand.",
  starterQuery: `WITH ProductRevenue AS (
  SELECT
      p.brand,
      p.product_id,
      p.product_name,
      SUM(oi.total_price) AS revenue
  FROM products p
  JOIN order_items oi
      ON p.product_id = oi.product_id
  GROUP BY
      p.brand,
      p.product_id,
      p.product_name
)
SELECT
  brand,
  product_name,
  revenue
FROM (
  SELECT *,
         ROW_NUMBER() OVER(
             PARTITION BY brand
             ORDER BY revenue DESC
         ) AS rn
  FROM ProductRevenue
) t
WHERE rn = 1;`,
  expectedColumns: ["brand","product_name","revenue"],
  solutionQuery: `WITH ProductRevenue AS (
  SELECT
      p.brand,
      p.product_id,
      p.product_name,
      SUM(oi.total_price) AS revenue
  FROM products p
  JOIN order_items oi
      ON p.product_id = oi.product_id
  GROUP BY
      p.brand,
      p.product_id,
      p.product_name
)
SELECT
  brand,
  product_name,
  revenue
FROM (
  SELECT *,
         ROW_NUMBER() OVER(
             PARTITION BY brand
             ORDER BY revenue DESC
         ) AS rn
  FROM ProductRevenue
) t
WHERE rn = 1;`,
},
{
  id: 65,
  title: "Customer Purchase Summary",
  difficulty: "Medium+",
  slug: "sql-customer-window-summary",
  seoTitle: "SQL Customer Summary Using Window Functions",
  metaDescription: "Learn how to combine multiple window functions to create a customer purchase summary.",
  tags: ["SQL", "FIRST_VALUE", "LAST_VALUE", "COUNT OVER", "SUM OVER"],
  description: "For every order, display the customer's first purchase amount, latest purchase amount, total orders and lifetime revenue.",
  explanation: "This query combines multiple window functions to produce a compact customer summary without grouping rows.",
  scenario: "Executives need a customer summary embedded in every transaction record.",
  useCases: ["Executive dashboards", "Customer analytics", "Business intelligence"],
  hint: "Combine FIRST_VALUE(), LAST_VALUE(), COUNT() OVER() and SUM() OVER().",
  starterQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  FIRST_VALUE(total_amount) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS first_purchase,
  LAST_VALUE(total_amount) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
      ROWS BETWEEN UNBOUNDED PRECEDING
      AND UNBOUNDED FOLLOWING
  ) AS latest_purchase,
  COUNT(*) OVER(
      PARTITION BY customer_id
  ) AS total_orders,
  SUM(total_amount) OVER(
      PARTITION BY customer_id
  ) AS lifetime_revenue
FROM orders;`,
  expectedColumns: [
      "customer_id",
      "order_id",
      "total_amount",
      "first_purchase",
      "latest_purchase",
      "total_orders",
      "lifetime_revenue"
  ],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  FIRST_VALUE(total_amount) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
  ) AS first_purchase,
  LAST_VALUE(total_amount) OVER(
      PARTITION BY customer_id
      ORDER BY order_date
      ROWS BETWEEN UNBOUNDED PRECEDING
      AND UNBOUNDED FOLLOWING
  ) AS latest_purchase,
  COUNT(*) OVER(
      PARTITION BY customer_id
  ) AS total_orders,
  SUM(total_amount) OVER(
      PARTITION BY customer_id
  ) AS lifetime_revenue
FROM orders;`,
},
{
  id: 66,
  title: "Customer Order Statistics",
  difficulty: "Medium+",
  slug: "sql-multiple-window-statistics",
  seoTitle: "SQL Customer Statistics with Window Functions",
  metaDescription: "Learn how to combine multiple window aggregates to generate customer statistics.",
  tags: ["SQL", "MIN OVER", "MAX OVER", "AVG OVER", "Window Functions"],
  description: "For every order, display the customer's minimum, maximum and average order amount.",
  explanation: "Window aggregates allow statistical calculations without collapsing individual rows.",
  scenario: "Finance wants every transaction enriched with customer spending statistics.",
  useCases: ["Business Intelligence", "Customer Analytics", "Statistics"],
  hint: "Use MIN(), MAX() and AVG() OVER(PARTITION BY customer_id).",
  starterQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  MIN(total_amount) OVER(PARTITION BY customer_id) AS minimum_order,
  MAX(total_amount) OVER(PARTITION BY customer_id) AS maximum_order,
  AVG(total_amount) OVER(PARTITION BY customer_id) AS average_order
FROM orders;`,
  expectedColumns: ["customer_id","order_id","total_amount","minimum_order","maximum_order","average_order"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  MIN(total_amount) OVER(PARTITION BY customer_id) AS minimum_order,
  MAX(total_amount) OVER(PARTITION BY customer_id) AS maximum_order,
  AVG(total_amount) OVER(PARTITION BY customer_id) AS average_order
FROM orders;`,
},
{
  id: 67,
  title: "Order Value Relative to Customer Maximum",
  difficulty: "Medium+",
  slug: "sql-window-max-comparison",
  seoTitle: "SQL Compare Rows to Window Maximum",
  metaDescription: "Learn how to compare every row against the maximum value within its partition.",
  tags: ["SQL", "MAX OVER", "CASE WHEN", "Window Functions"],
  description: "Show how far each order is below the customer's highest order amount.",
  explanation: "Calculate the customer's highest order once using MAX() OVER(), then subtract the current order amount.",
  scenario: "Sales wants to know how close every purchase is to the customer's largest purchase.",
  useCases: ["Customer Analytics", "Revenue Analysis", "Window Functions"],
  hint: "Subtract total_amount from MAX(total_amount) OVER(PARTITION BY customer_id).",
  starterQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  MAX(total_amount) OVER(PARTITION BY customer_id) - total_amount AS difference_from_max
FROM orders;`,
  expectedColumns: ["customer_id","order_id","total_amount","difference_from_max"],
  solutionQuery: `SELECT
  customer_id,
  order_id,
  total_amount,
  MAX(total_amount) OVER(PARTITION BY customer_id) - total_amount AS difference_from_max
FROM orders;`,
},
{
  id: 68,
  title: "Category Revenue Ranking",
  difficulty: "Medium+",
  slug: "sql-category-revenue-dense-rank",
  seoTitle: "SQL Category Revenue Ranking",
  metaDescription: "Learn how to rank product categories based on total revenue.",
  tags: ["SQL", "CTE", "JOIN", "DENSE_RANK"],
  description: "Rank product categories by their total revenue.",
  explanation: "Aggregate revenue by category, then rank the categories using DENSE_RANK().",
  scenario: "Leadership wants to identify the strongest performing product categories.",
  useCases: ["Revenue Reporting", "Category Analysis", "Executive Dashboards"],
  hint: "Aggregate first, then use DENSE_RANK().",
  starterQuery: `WITH CategoryRevenue AS (
SELECT
  p.category,
  SUM(oi.total_price) AS revenue
FROM products p
JOIN order_items oi
ON p.product_id = oi.product_id
GROUP BY p.category
)
SELECT
  category,
  revenue,
  DENSE_RANK() OVER(ORDER BY revenue DESC) AS revenue_rank
FROM CategoryRevenue;`,
  expectedColumns: ["category","revenue","revenue_rank"],
  solutionQuery: `WITH CategoryRevenue AS (
SELECT
  p.category,
  SUM(oi.total_price) AS revenue
FROM products p
JOIN order_items oi
ON p.product_id = oi.product_id
GROUP BY p.category
)
SELECT
  category,
  revenue,
  DENSE_RANK() OVER(ORDER BY revenue DESC) AS revenue_rank
FROM CategoryRevenue;`,
},
{
  id: 69,
  title: "Customer Purchase Share",
  difficulty: "Medium+",
  slug: "sql-count-window-share",
  seoTitle: "SQL Customer Purchase Share",
  metaDescription: "Learn how to calculate each customer's contribution to the total number of orders.",
  tags: ["SQL", "COUNT OVER", "Window Functions"],
  description: "Calculate what percentage of all orders belongs to each customer.",
  explanation: "Aggregate order counts first, then compare them against the total number of orders.",
  scenario: "Operations wants to understand customer contribution to platform activity.",
  useCases: ["Customer Segmentation", "Business Reporting", "Analytics"],
  hint: "Aggregate first, then divide by SUM(order_count) OVER().",
  starterQuery: `SELECT
customer_id,
order_count,
ROUND(
order_count*100.0/
SUM(order_count) OVER(),
2
) AS order_share
FROM(
SELECT
customer_id,
COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
)t;`,
  expectedColumns: ["customer_id","order_count","order_share"],
  solutionQuery: `SELECT
customer_id,
order_count,
ROUND(
order_count*100.0/
SUM(order_count) OVER(),
2
) AS order_share
FROM(
SELECT
customer_id,
COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
)t;`,
},
{
  id: 70,
  title: "Customer Revenue Report",
  difficulty: "Medium+",
  slug: "sql-multi-cte-dashboard-report",
  seoTitle: "SQL Multiple CTE Revenue Dashboard",
  metaDescription: "Learn how to build a customer revenue report using multiple Common Table Expressions.",
  tags: ["SQL", "CTE", "JOIN", "SUM", "AVG"],
  description: "Create a report showing each customer's total revenue, total orders and average order value.",
  explanation: "Multiple CTEs make large reporting queries easier to build and maintain.",
  scenario: "Management needs a reusable customer revenue report.",
  useCases: ["Executive Dashboard", "Business Intelligence", "Customer Reporting"],
  hint: "Create separate CTEs for revenue and order counts before joining them.",
  starterQuery: `WITH Revenue AS (
SELECT
customer_id,
SUM(total_amount) AS total_revenue,
AVG(total_amount) AS average_order
FROM orders
GROUP BY customer_id
),
OrdersCount AS (
SELECT
customer_id,
COUNT(*) AS total_orders
FROM orders
GROUP BY customer_id
)
SELECT
r.customer_id,
r.total_revenue,
o.total_orders,
r.average_order
FROM Revenue r
JOIN OrdersCount o
ON r.customer_id=o.customer_id;`,
  expectedColumns: ["customer_id","total_revenue","total_orders","average_order"],
  solutionQuery: `WITH Revenue AS (
SELECT
customer_id,
SUM(total_amount) AS total_revenue,
AVG(total_amount) AS average_order
FROM orders
GROUP BY customer_id
),
OrdersCount AS (
SELECT
customer_id,
COUNT(*) AS total_orders
FROM orders
GROUP BY customer_id
)
SELECT
r.customer_id,
r.total_revenue,
o.total_orders,
r.average_order
FROM Revenue r
JOIN OrdersCount o
ON r.customer_id=o.customer_id;`,
},
{
  id: 71,
  title: "Customer Purchase Timeline Report",
  difficulty: "Medium+",
  slug: "sql-customer-purchase-timeline-report",
  seoTitle: "SQL Customer Purchase Timeline Report",
  metaDescription: "Learn how to combine multiple window functions to build a customer purchase timeline report.",
  tags: ["SQL", "ROW_NUMBER", "LAG", "LEAD", "Window Functions"],
  description: "Generate a purchase timeline showing purchase number, previous purchase date and next purchase date for every customer.",
  explanation: "Combine ROW_NUMBER(), LAG() and LEAD() to produce a complete purchase history timeline.",
  scenario: "CRM analysts need a timeline of every customer's shopping history.",
  useCases: ["Customer Journey", "Purchase Analysis", "Business Reporting"],
  hint: "Use ROW_NUMBER(), LAG() and LEAD() together.",
  starterQuery: `SELECT
customer_id,
order_id,
order_date,
ROW_NUMBER() OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS purchase_number,
LAG(order_date) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS previous_purchase,
LEAD(order_date) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS next_purchase
FROM orders;`,
  expectedColumns:["customer_id","order_id","order_date","purchase_number","previous_purchase","next_purchase"],
  solutionQuery:`SELECT
customer_id,
order_id,
order_date,
ROW_NUMBER() OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS purchase_number,
LAG(order_date) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS previous_purchase,
LEAD(order_date) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS next_purchase
FROM orders;`,
},
{
  id:72,
  title:"Category Revenue Dashboard",
  difficulty:"Medium+",
  slug:"sql-category-revenue-dashboard",
  seoTitle:"SQL Category Revenue Dashboard",
  metaDescription:"Learn how to build a category revenue dashboard using CTEs and window functions.",
  tags:["SQL","CTE","SUM","DENSE_RANK","Window Functions"],
  description:"Display every product category along with revenue, percentage contribution and category rank.",
  explanation:"Aggregate category revenue once and use window functions for ranking and percentage contribution.",
  scenario:"Executives need a category-level revenue dashboard.",
  useCases:["Executive Dashboard","Revenue Analysis","Business Intelligence"],
  hint:"Use a CTE followed by DENSE_RANK() and SUM() OVER().",
  starterQuery:`WITH CategoryRevenue AS(
SELECT
p.category,
SUM(oi.total_price) AS revenue
FROM products p
JOIN order_items oi
ON p.product_id=oi.product_id
GROUP BY p.category
)
SELECT
category,
revenue,
ROUND(revenue*100.0/
SUM(revenue) OVER(),2) AS revenue_share,
DENSE_RANK() OVER(
ORDER BY revenue DESC
) AS revenue_rank
FROM CategoryRevenue;`,
  expectedColumns:["category","revenue","revenue_share","revenue_rank"],
  solutionQuery:`WITH CategoryRevenue AS(
SELECT
p.category,
SUM(oi.total_price) AS revenue
FROM products p
JOIN order_items oi
ON p.product_id=oi.product_id
GROUP BY p.category
)
SELECT
category,
revenue,
ROUND(revenue*100.0/
SUM(revenue) OVER(),2) AS revenue_share,
DENSE_RANK() OVER(
ORDER BY revenue DESC
) AS revenue_rank
FROM CategoryRevenue;`,
},
{
  id:73,
  title:"Customer Order Distribution",
  difficulty:"Medium+",
  slug:"sql-customer-order-distribution",
  seoTitle:"SQL Customer Order Distribution",
  metaDescription:"Learn how to summarize customer order distributions using multiple window functions.",
  tags:["SQL","COUNT OVER","NTILE","Window Functions"],
  description:"Display each customer's order count along with their spending quartile.",
  explanation:"Aggregate order counts and revenue, then divide customers into quartiles using NTILE().",
  scenario:"Marketing wants to divide customers into purchasing segments.",
  useCases:["Segmentation","Customer Analytics","Reporting"],
  hint:"Aggregate first, then use NTILE().",
  starterQuery:`WITH CustomerSummary AS(
SELECT
customer_id,
COUNT(*) AS total_orders,
SUM(total_amount) AS revenue
FROM orders
GROUP BY customer_id
)
SELECT
customer_id,
total_orders,
revenue,
NTILE(4) OVER(
ORDER BY revenue DESC
) AS spending_group
FROM CustomerSummary;`,
  expectedColumns:["customer_id","total_orders","revenue","spending_group"],
  solutionQuery:`WITH CustomerSummary AS(
SELECT
customer_id,
COUNT(*) AS total_orders,
SUM(total_amount) AS revenue
FROM orders
GROUP BY customer_id
)
SELECT
customer_id,
total_orders,
revenue,
NTILE(4) OVER(
ORDER BY revenue DESC
) AS spending_group
FROM CustomerSummary;`,
},
{
  id:74,
  title:"Running Revenue vs Lifetime Revenue",
  difficulty:"Medium+",
  slug:"sql-running-vs-total-revenue",
  seoTitle:"SQL Running Revenue vs Lifetime Revenue",
  metaDescription:"Learn how to compare running revenue with lifetime revenue using window functions.",
  tags:["SQL","SUM OVER","Window Functions"],
  description:"For every order, display cumulative revenue alongside the customer's lifetime revenue.",
  explanation:"Use one ordered window and one partition window to compare running progress against the final total.",
  scenario:"Finance wants to visualize customer lifetime value growth.",
  useCases:["Revenue Analysis","Customer Lifetime Value","Business Reporting"],
  hint:"Use two SUM() OVER() functions.",
  starterQuery:`SELECT
customer_id,
order_id,
total_amount,
SUM(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS running_revenue,
SUM(total_amount) OVER(
PARTITION BY customer_id
) AS lifetime_revenue
FROM orders;`,
  expectedColumns:["customer_id","order_id","total_amount","running_revenue","lifetime_revenue"],
  solutionQuery:`SELECT
customer_id,
order_id,
total_amount,
SUM(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS running_revenue,
SUM(total_amount) OVER(
PARTITION BY customer_id
) AS lifetime_revenue
FROM orders;`,
},
{
  id:75,
  title:"Customer Performance Dashboard",
  difficulty:"Medium+",
  slug:"sql-customer-performance-dashboard",
  seoTitle:"SQL Customer Performance Dashboard",
  metaDescription:"Learn how to build a complete customer performance dashboard using multiple SQL window functions.",
  tags:["SQL","ROW_NUMBER","SUM OVER","AVG OVER","FIRST_VALUE","LAST_VALUE"],
  description:"Build a dashboard showing purchase number, first purchase, latest purchase, average order and cumulative revenue.",
  explanation:"This combines several window functions into a single business-ready report.",
  scenario:"Executives want a complete customer performance dashboard.",
  useCases:["Executive Dashboard","Business Intelligence","Customer Analytics"],
  hint:"Combine ROW_NUMBER(), FIRST_VALUE(), LAST_VALUE(), AVG() OVER() and SUM() OVER().",
  starterQuery:`SELECT
customer_id,
order_id,
order_date,
total_amount,
ROW_NUMBER() OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS purchase_number,
FIRST_VALUE(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS first_purchase,
LAST_VALUE(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
ROWS BETWEEN UNBOUNDED PRECEDING
AND UNBOUNDED FOLLOWING
) AS latest_purchase,
AVG(total_amount) OVER(
PARTITION BY customer_id
) AS average_order,
SUM(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS cumulative_revenue
FROM orders;`,
  expectedColumns:["customer_id","order_id","order_date","total_amount","purchase_number","first_purchase","latest_purchase","average_order","cumulative_revenue"],
  solutionQuery:`SELECT
customer_id,
order_id,
order_date,
total_amount,
ROW_NUMBER() OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS purchase_number,
FIRST_VALUE(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS first_purchase,
LAST_VALUE(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
ROWS BETWEEN UNBOUNDED PRECEDING
AND UNBOUNDED FOLLOWING
) AS latest_purchase,
AVG(total_amount) OVER(
PARTITION BY customer_id
) AS average_order,
SUM(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS cumulative_revenue
FROM orders;`,
},
{
  id: 76,
  title: "Top Spending Customer Per Country",
  difficulty: "Hard",
  slug: "sql-country-top-customer-row-number",
  seoTitle: "SQL Top Spending Customer Per Country",
  metaDescription: "Learn how to identify the highest spending customer in each country using CTEs and ROW_NUMBER().",
  tags: ["SQL", "CTE", "JOIN", "ROW_NUMBER", "SUM"],
  description: "Find the customer with the highest total revenue in every country.",
  explanation: "Aggregate customer revenue first, then rank customers within each country using ROW_NUMBER().",
  scenario: "Regional managers want to recognize their highest-value customer.",
  useCases: ["Regional reporting", "Customer analytics", "Revenue analysis"],
  hint: "Aggregate revenue first, then partition ROW_NUMBER() by country.",
  starterQuery: `WITH CustomerRevenue AS (
SELECT
c.country,
c.customer_id,
c.customer_name,
SUM(o.total_amount) AS revenue
FROM customers c
JOIN orders o
ON c.customer_id = o.customer_id
GROUP BY
c.country,
c.customer_id,
c.customer_name
)
SELECT
country,
customer_name,
revenue
FROM (
SELECT *,
ROW_NUMBER() OVER(
PARTITION BY country
ORDER BY revenue DESC
) AS rn
FROM CustomerRevenue
)t
WHERE rn=1;`,
  expectedColumns:["country","customer_name","revenue"],
  solutionQuery:`WITH CustomerRevenue AS (
SELECT
c.country,
c.customer_id,
c.customer_name,
SUM(o.total_amount) AS revenue
FROM customers c
JOIN orders o
ON c.customer_id = o.customer_id
GROUP BY
c.country,
c.customer_id,
c.customer_name
)
SELECT
country,
customer_name,
revenue
FROM (
SELECT *,
ROW_NUMBER() OVER(
PARTITION BY country
ORDER BY revenue DESC
) AS rn
FROM CustomerRevenue
)t
WHERE rn=1;`,
},
{
  id:77,
  title:"Customer Revenue Breakdown",
  difficulty:"Hard",
  slug:"sql-conditional-aggregation-dashboard",
  seoTitle:"SQL Conditional Aggregation Dashboard",
  metaDescription:"Learn how to build customer dashboards using CASE expressions inside aggregate functions.",
  tags:["SQL","CASE WHEN","SUM","GROUP BY"],
  description:"Show each customer's delivered, cancelled and total order revenue.",
  explanation:"Conditional aggregation allows multiple business metrics to be produced in a single grouped query.",
  scenario:"Operations wants a customer revenue breakdown by order status.",
  useCases:["Dashboards","Reporting","Business Intelligence"],
  hint:"Use SUM(CASE WHEN...).",
  starterQuery:`SELECT
customer_id,
SUM(CASE WHEN order_status='Delivered' THEN total_amount ELSE 0 END) AS delivered_revenue,
SUM(CASE WHEN order_status='Cancelled' THEN total_amount ELSE 0 END) AS cancelled_revenue,
SUM(total_amount) AS total_revenue
FROM orders
GROUP BY customer_id;`,
  expectedColumns:["customer_id","delivered_revenue","cancelled_revenue","total_revenue"],
  solutionQuery:`SELECT
customer_id,
SUM(CASE WHEN order_status='Delivered' THEN total_amount ELSE 0 END) AS delivered_revenue,
SUM(CASE WHEN order_status='Cancelled' THEN total_amount ELSE 0 END) AS cancelled_revenue,
SUM(total_amount) AS total_revenue
FROM orders
GROUP BY customer_id;`,
},
{
  id:78,
  title:"Customer Revenue Ranking Dashboard",
  difficulty:"Hard",
  slug:"sql-ranking-dashboard",
  seoTitle:"SQL Revenue Ranking Dashboard",
  metaDescription:"Learn how to combine aggregation and multiple ranking functions in SQL.",
  tags:["SQL","CTE","RANK","DENSE_RANK","ROW_NUMBER"],
  description:"Calculate customer revenue and display ROW_NUMBER(), RANK() and DENSE_RANK() together.",
  explanation:"This exercise demonstrates the difference between SQL ranking functions on the same dataset.",
  scenario:"The BI team wants to compare different ranking methods.",
  useCases:["Analytics","Reporting","Ranking"],
  hint:"Aggregate revenue first, then apply three ranking functions.",
  starterQuery:`WITH Revenue AS(
SELECT
customer_id,
SUM(total_amount) AS revenue
FROM orders
GROUP BY customer_id
)
SELECT
customer_id,
revenue,
ROW_NUMBER() OVER(ORDER BY revenue DESC) AS row_num,
RANK() OVER(ORDER BY revenue DESC) AS rank_num,
DENSE_RANK() OVER(ORDER BY revenue DESC) AS dense_rank_num
FROM Revenue;`,
  expectedColumns:["customer_id","revenue","row_num","rank_num","dense_rank_num"],
  solutionQuery:`WITH Revenue AS(
SELECT
customer_id,
SUM(total_amount) AS revenue
FROM orders
GROUP BY customer_id
)
SELECT
customer_id,
revenue,
ROW_NUMBER() OVER(ORDER BY revenue DESC) AS row_num,
RANK() OVER(ORDER BY revenue DESC) AS rank_num,
DENSE_RANK() OVER(ORDER BY revenue DESC) AS dense_rank_num
FROM Revenue;`,
},
{
  id:79,
  title:"Monthly Revenue Trend",
  difficulty:"Hard",
  slug:"sql-monthly-revenue-growth",
  seoTitle:"SQL Monthly Revenue Trend Analysis",
  metaDescription:"Learn how to compare monthly revenue using LAG() and Common Table Expressions.",
  tags:["SQL","CTE","LAG","SUM","Window Functions"],
  description:"Calculate monthly revenue and compare it with the previous month's revenue.",
  explanation:"Aggregate monthly revenue first, then use LAG() to compare consecutive months.",
  scenario:"Finance monitors month-over-month business performance.",
  useCases:["Trend Analysis","Financial Reporting","Business Intelligence"],
  hint:"Aggregate first, then apply LAG().",
  starterQuery:`WITH MonthlyRevenue AS(
SELECT
strftime('%Y-%m',order_date) AS month,
SUM(total_amount) AS revenue
FROM orders
GROUP BY month
)
SELECT
month,
revenue,
LAG(revenue) OVER(
ORDER BY month
) AS previous_month_revenue
FROM MonthlyRevenue;`,
  expectedColumns:["month","revenue","previous_month_revenue"],
  solutionQuery:`WITH MonthlyRevenue AS(
SELECT
strftime('%Y-%m',order_date) AS month,
SUM(total_amount) AS revenue
FROM orders
GROUP BY month
)
SELECT
month,
revenue,
LAG(revenue) OVER(
ORDER BY month
) AS previous_month_revenue
FROM MonthlyRevenue;`,
},
{
  id:80,
  title:"Customer Lifetime Value Dashboard",
  difficulty:"Hard",
  slug:"sql-customer-lifetime-dashboard",
  seoTitle:"SQL Customer Lifetime Value Dashboard",
  metaDescription:"Learn how to build a complete customer lifetime value report using multiple CTEs and window functions.",
  tags:["SQL","CTE","ROW_NUMBER","SUM OVER","AVG OVER","LAG"],
  description:"Build a customer lifetime dashboard showing purchase number, cumulative revenue, average order value, previous order amount and lifetime revenue.",
  explanation:"This combines multiple window functions with CTEs to produce a business-ready customer analytics report.",
  scenario:"Leadership wants a reusable customer lifetime value dashboard.",
  useCases:["Executive Dashboard","Customer Analytics","Business Intelligence"],
  hint:"Use a CTE and combine ROW_NUMBER(), SUM(), AVG() and LAG().",
  starterQuery:`WITH CustomerOrders AS(
SELECT
customer_id,
order_id,
order_date,
total_amount
FROM orders
)
SELECT
customer_id,
order_id,
order_date,
total_amount,
ROW_NUMBER() OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS purchase_number,
SUM(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS cumulative_revenue,
SUM(total_amount) OVER(
PARTITION BY customer_id
) AS lifetime_revenue,
AVG(total_amount) OVER(
PARTITION BY customer_id
) AS average_order,
LAG(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS previous_order_amount
FROM CustomerOrders;`,
  expectedColumns:[
"customer_id",
"order_id",
"order_date",
"total_amount",
"purchase_number",
"cumulative_revenue",
"lifetime_revenue",
"average_order",
"previous_order_amount"
],
  solutionQuery:`WITH CustomerOrders AS(
SELECT
customer_id,
order_id,
order_date,
total_amount
FROM orders
)
SELECT
customer_id,
order_id,
order_date,
total_amount,
ROW_NUMBER() OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS purchase_number,
SUM(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS cumulative_revenue,
SUM(total_amount) OVER(
PARTITION BY customer_id
) AS lifetime_revenue,
AVG(total_amount) OVER(
PARTITION BY customer_id
) AS average_order,
LAG(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS previous_order_amount
FROM CustomerOrders;`,
},
{
  id: 81,
  title: "Customer Revenue by Payment Method",
  difficulty: "Hard",
  slug: "sql-payment-method-revenue-dashboard",
  seoTitle: "SQL Revenue Dashboard by Payment Method",
  metaDescription: "Learn how to build customer revenue reports grouped by payment methods using SQL joins and window functions.",
  tags: ["SQL", "JOIN", "CTE", "SUM", "DENSE_RANK"],
  description: "Calculate the total revenue generated by each payment method and rank them from highest to lowest.",
  explanation: "Join orders with payments, aggregate revenue by payment method, then rank the payment methods using DENSE_RANK().",
  scenario: "Finance wants to know which payment methods generate the highest revenue.",
  useCases: ["Finance Reporting", "Payment Analytics", "Executive Dashboard"],
  hint: "Aggregate first, then apply DENSE_RANK().",
  starterQuery: `WITH PaymentRevenue AS (
SELECT
p.payment_method,
SUM(o.total_amount) AS revenue
FROM payments p
JOIN orders o
ON p.order_id=o.order_id
GROUP BY p.payment_method
)
SELECT
payment_method,
revenue,
DENSE_RANK() OVER(
ORDER BY revenue DESC
) AS revenue_rank
FROM PaymentRevenue;`,
  expectedColumns:["payment_method","revenue","revenue_rank"],
  solutionQuery:`WITH PaymentRevenue AS (
SELECT
p.payment_method,
SUM(o.total_amount) AS revenue
FROM payments p
JOIN orders o
ON p.order_id=o.order_id
GROUP BY p.payment_method
)
SELECT
payment_method,
revenue,
DENSE_RANK() OVER(
ORDER BY revenue DESC
) AS revenue_rank
FROM PaymentRevenue;`,
},
{
  id: 82,
  title: "Daily Revenue Performance",
  difficulty: "Hard",
  slug: "sql-daily-revenue-performance",
  seoTitle: "SQL Daily Revenue Performance Dashboard",
  metaDescription: "Learn how to compare daily revenue with historical averages using SQL window functions.",
  tags: ["SQL", "CTE", "AVG OVER", "LAG"],
  description: "Show daily revenue together with the previous day's revenue and the overall average daily revenue.",
  explanation: "Aggregate revenue by day, then combine LAG() and AVG() OVER() to create a daily performance report.",
  scenario: "Executives monitor revenue trends every morning.",
  useCases: ["Revenue Dashboard", "Trend Analysis", "Business Intelligence"],
  hint: "Aggregate daily revenue first.",
  starterQuery: `WITH DailyRevenue AS(
SELECT
order_date,
SUM(total_amount) AS revenue
FROM orders
GROUP BY order_date
)
SELECT
order_date,
revenue,
LAG(revenue) OVER(
ORDER BY order_date
) AS previous_day,
AVG(revenue) OVER() AS average_daily_revenue
FROM DailyRevenue;`,
  expectedColumns:["order_date","revenue","previous_day","average_daily_revenue"],
  solutionQuery:`WITH DailyRevenue AS(
SELECT
order_date,
SUM(total_amount) AS revenue
FROM orders
GROUP BY order_date
)
SELECT
order_date,
revenue,
LAG(revenue) OVER(
ORDER BY order_date
) AS previous_day,
AVG(revenue) OVER() AS average_daily_revenue
FROM DailyRevenue;`,
},
{
  id: 83,
  title: "Top Customer in Every City",
  difficulty: "Hard",
  slug: "sql-top-customer-per-city",
  seoTitle: "SQL Top Customer Per City",
  metaDescription: "Learn how to identify the highest revenue customer in every city using SQL window functions.",
  tags: ["SQL", "JOIN", "ROW_NUMBER", "CTE"],
  description: "Find the highest revenue customer in every city.",
  explanation: "Aggregate customer revenue by city, then rank customers within each city using ROW_NUMBER().",
  scenario: "Regional sales managers want to identify their best customer.",
  useCases: ["Regional Analytics", "Revenue Reporting", "Customer Insights"],
  hint: "Partition ROW_NUMBER() by city.",
  starterQuery: `WITH CustomerRevenue AS(
SELECT
c.city,
c.customer_name,
SUM(o.total_amount) AS revenue
FROM customers c
JOIN orders o
ON c.customer_id=o.customer_id
GROUP BY
c.city,
c.customer_name
)
SELECT
city,
customer_name,
revenue
FROM(
SELECT *,
ROW_NUMBER() OVER(
PARTITION BY city
ORDER BY revenue DESC
) AS rn
FROM CustomerRevenue
)t
WHERE rn=1;`,
  expectedColumns:["city","customer_name","revenue"],
  solutionQuery:`WITH CustomerRevenue AS(
SELECT
c.city,
c.customer_name,
SUM(o.total_amount) AS revenue
FROM customers c
JOIN orders o
ON c.customer_id=o.customer_id
GROUP BY
c.city,
c.customer_name
)
SELECT
city,
customer_name,
revenue
FROM(
SELECT *,
ROW_NUMBER() OVER(
PARTITION BY city
ORDER BY revenue DESC
) AS rn
FROM CustomerRevenue
)t
WHERE rn=1;`,
},
{
  id: 84,
  title: "Customer Order Frequency Report",
  difficulty: "Hard",
  slug: "sql-order-frequency-report",
  seoTitle: "SQL Customer Order Frequency Report",
  metaDescription: "Learn how to analyze customer ordering frequency using SQL date functions and window functions.",
  tags: ["SQL", "LAG", "AVG", "julianday"],
  description: "Calculate the average number of days between orders for each customer.",
  explanation: "Use LAG() to find the previous order date and calculate the average purchase interval for every customer.",
  scenario: "The CRM team wants to identify highly engaged customers.",
  useCases: ["Retention", "Customer Analytics", "Purchase Frequency"],
  hint: "Use LAG() inside a CTE, then calculate AVG().",
  starterQuery: `WITH OrderGap AS(
SELECT
customer_id,
julianday(order_date)-
julianday(
LAG(order_date) OVER(
PARTITION BY customer_id
ORDER BY order_date
)
) AS gap_days
FROM orders
)
SELECT
customer_id,
ROUND(AVG(gap_days),2) AS average_gap_days
FROM OrderGap
GROUP BY customer_id;`,
  expectedColumns:["customer_id","average_gap_days"],
  solutionQuery:`WITH OrderGap AS(
SELECT
customer_id,
julianday(order_date)-
julianday(
LAG(order_date) OVER(
PARTITION BY customer_id
ORDER BY order_date
)
) AS gap_days
FROM orders
)
SELECT
customer_id,
ROUND(AVG(gap_days),2) AS average_gap_days
FROM OrderGap
GROUP BY customer_id;`,
},
{
  id: 85,
  title: "Revenue Contribution by Country",
  difficulty: "Hard",
  slug: "sql-country-revenue-contribution",
  seoTitle: "SQL Country Revenue Contribution",
  metaDescription: "Learn how to calculate revenue contribution by country using SQL CTEs and window functions.",
  tags: ["SQL", "CTE", "JOIN", "SUM OVER"],
  description: "Calculate each country's contribution to total company revenue.",
  explanation: "Aggregate revenue by country, then divide by the grand total using SUM() OVER().",
  scenario: "Leadership wants to understand which countries generate the most revenue.",
  useCases: ["Executive Dashboard", "Regional Analysis", "Business Intelligence"],
  hint: "Aggregate first, then calculate the revenue percentage.",
  starterQuery: `WITH CountryRevenue AS(
SELECT
c.country,
SUM(o.total_amount) AS revenue
FROM customers c
JOIN orders o
ON c.customer_id=o.customer_id
GROUP BY c.country
)
SELECT
country,
revenue,
ROUND(
revenue*100.0/
SUM(revenue) OVER(),
2
) AS revenue_percentage
FROM CountryRevenue
ORDER BY revenue DESC;`,
  expectedColumns:["country","revenue","revenue_percentage"],
  solutionQuery:`WITH CountryRevenue AS(
SELECT
c.country,
SUM(o.total_amount) AS revenue
FROM customers c
JOIN orders o
ON c.customer_id=o.customer_id
GROUP BY c.country
)
SELECT
country,
revenue,
ROUND(
revenue*100.0/
SUM(revenue) OVER(),
2
) AS revenue_percentage
FROM CountryRevenue
ORDER BY revenue DESC;`,
},
{
  id: 86,
  title: "Monthly Top Customer",
  difficulty: "Hard",
  slug: "sql-monthly-top-customer",
  seoTitle: "SQL Monthly Top Customer by Revenue",
  metaDescription: "Learn how to identify the highest revenue customer for each month using CTEs and window functions.",
  tags: ["SQL", "CTE", "ROW_NUMBER", "SUM", "Window Functions"],
  description: "Find the highest revenue generating customer in every month.",
  explanation: "Aggregate revenue by customer and month, then rank customers within each month using ROW_NUMBER().",
  scenario: "Finance prepares a monthly recognition report for top customers.",
  useCases: ["Monthly Reporting", "Revenue Analysis", "Executive Dashboard"],
  hint: "Group by month and customer, then use ROW_NUMBER().",
  starterQuery: `WITH MonthlyRevenue AS (
SELECT
strftime('%Y-%m', o.order_date) AS month,
o.customer_id,
c.customer_name,
SUM(o.total_amount) AS revenue
FROM orders o
JOIN customers c
ON o.customer_id = c.customer_id
GROUP BY
month,
o.customer_id,
c.customer_name
)
SELECT
month,
customer_name,
revenue
FROM(
SELECT *,
ROW_NUMBER() OVER(
PARTITION BY month
ORDER BY revenue DESC
) AS rn
FROM MonthlyRevenue
)t
WHERE rn = 1;`,
  expectedColumns:["month","customer_name","revenue"],
  solutionQuery:`WITH MonthlyRevenue AS (
SELECT
strftime('%Y-%m', o.order_date) AS month,
o.customer_id,
c.customer_name,
SUM(o.total_amount) AS revenue
FROM orders o
JOIN customers c
ON o.customer_id = c.customer_id
GROUP BY
month,
o.customer_id,
c.customer_name
)
SELECT
month,
customer_name,
revenue
FROM(
SELECT *,
ROW_NUMBER() OVER(
PARTITION BY month
ORDER BY revenue DESC
) AS rn
FROM MonthlyRevenue
)t
WHERE rn = 1;`,
},
{
  id: 87,
  title: "Product Revenue by Brand",
  difficulty: "Hard",
  slug: "sql-product-brand-revenue",
  seoTitle: "SQL Product Revenue by Brand",
  metaDescription: "Learn how to calculate product revenue contribution within each brand using SQL window functions.",
  tags: ["SQL", "JOIN", "CTE", "SUM OVER"],
  description: "Calculate each product's revenue percentage within its brand.",
  explanation: "Aggregate revenue by product, then divide by the brand's total revenue using SUM() OVER(PARTITION BY brand).",
  scenario: "Product managers want to understand which products drive revenue within each brand.",
  useCases: ["Product Analytics", "Revenue Reporting", "Business Intelligence"],
  hint: "Use SUM(revenue) OVER(PARTITION BY brand).",
  starterQuery: `WITH ProductRevenue AS (
SELECT
p.brand,
p.product_name,
SUM(oi.total_price) AS revenue
FROM products p
JOIN order_items oi
ON p.product_id = oi.product_id
GROUP BY
p.brand,
p.product_name
)
SELECT
brand,
product_name,
revenue,
ROUND(
revenue * 100.0 /
SUM(revenue) OVER(PARTITION BY brand),
2
) AS revenue_share
FROM ProductRevenue;`,
  expectedColumns:["brand","product_name","revenue","revenue_share"],
  solutionQuery:`WITH ProductRevenue AS (
SELECT
p.brand,
p.product_name,
SUM(oi.total_price) AS revenue
FROM products p
JOIN order_items oi
ON p.product_id = oi.product_id
GROUP BY
p.brand,
p.product_name
)
SELECT
brand,
product_name,
revenue,
ROUND(
revenue * 100.0 /
SUM(revenue) OVER(PARTITION BY brand),
2
) AS revenue_share
FROM ProductRevenue;`,
},
{
  id: 88,
  title: "Customer Order Status Dashboard",
  difficulty: "Hard",
  slug: "sql-order-status-dashboard",
  seoTitle: "SQL Customer Order Status Dashboard",
  metaDescription: "Learn how to build a customer order status dashboard using conditional aggregation.",
  tags: ["SQL", "CASE WHEN", "GROUP BY", "COUNT"],
  description: "Display the number of delivered, pending and cancelled orders for every customer.",
  explanation: "Use conditional aggregation with CASE expressions to calculate multiple metrics in one query.",
  scenario: "Operations needs a customer-level order status report.",
  useCases: ["Operations Dashboard", "Reporting", "Customer Analytics"],
  hint: "Use COUNT(CASE WHEN...) or SUM(CASE WHEN...).",
  starterQuery: `SELECT
customer_id,
SUM(CASE WHEN order_status='Delivered' THEN 1 ELSE 0 END) AS delivered_orders,
SUM(CASE WHEN order_status='Pending' THEN 1 ELSE 0 END) AS pending_orders,
SUM(CASE WHEN order_status='Cancelled' THEN 1 ELSE 0 END) AS cancelled_orders
FROM orders
GROUP BY customer_id;`,
  expectedColumns:["customer_id","delivered_orders","pending_orders","cancelled_orders"],
  solutionQuery:`SELECT
customer_id,
SUM(CASE WHEN order_status='Delivered' THEN 1 ELSE 0 END) AS delivered_orders,
SUM(CASE WHEN order_status='Pending' THEN 1 ELSE 0 END) AS pending_orders,
SUM(CASE WHEN order_status='Cancelled' THEN 1 ELSE 0 END) AS cancelled_orders
FROM orders
GROUP BY customer_id;`,
},
{
  id: 89,
  title: "Customer Revenue Growth Report",
  difficulty: "Hard",
  slug: "sql-revenue-growth-report",
  seoTitle: "SQL Customer Revenue Growth Report",
  metaDescription: "Learn how to compare consecutive customer purchases using running totals and LAG().",
  tags: ["SQL", "CTE", "SUM OVER", "LAG"],
  description: "Show cumulative customer revenue and the increase after every purchase.",
  explanation: "Build cumulative revenue using SUM() OVER() and compare consecutive values using LAG().",
  scenario: "Finance wants to measure how each purchase increases customer lifetime value.",
  useCases: ["Customer Lifetime Value", "Finance", "Analytics"],
  hint: "Calculate cumulative revenue first using a CTE.",
  starterQuery: `WITH RevenueHistory AS (
SELECT
customer_id,
order_id,
order_date,
SUM(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS cumulative_revenue
FROM orders
)
SELECT
customer_id,
order_id,
cumulative_revenue,
cumulative_revenue -
LAG(cumulative_revenue) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS revenue_growth
FROM RevenueHistory;`,
  expectedColumns:["customer_id","order_id","cumulative_revenue","revenue_growth"],
  solutionQuery:`WITH RevenueHistory AS (
SELECT
customer_id,
order_id,
order_date,
SUM(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS cumulative_revenue
FROM orders
)
SELECT
customer_id,
order_id,
cumulative_revenue,
cumulative_revenue -
LAG(cumulative_revenue) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS revenue_growth
FROM RevenueHistory;`,
},
{
  id: 90,
  title: "Executive Sales Dashboard",
  difficulty: "Hard",
  slug: "sql-executive-sales-dashboard",
  seoTitle: "SQL Executive Sales Dashboard",
  metaDescription: "Learn how to combine multiple CTEs and window functions to build a complete executive sales dashboard.",
  tags: ["SQL", "CTE", "JOIN", "ROW_NUMBER", "SUM OVER", "AVG OVER"],
  description: "Generate a dashboard showing customer revenue, average order value, total orders and customer revenue rank.",
  explanation: "This report combines multiple CTEs with window functions to produce an executive-level sales dashboard.",
  scenario: "Leadership reviews customer performance every quarter.",
  useCases: ["Executive Dashboard", "Sales Analytics", "Business Intelligence"],
  hint: "Create customer metrics first, then apply ROW_NUMBER().",
  starterQuery: `WITH CustomerMetrics AS (
SELECT
customer_id,
SUM(total_amount) AS revenue,
AVG(total_amount) AS average_order,
COUNT(*) AS total_orders
FROM orders
GROUP BY customer_id
)
SELECT
customer_id,
revenue,
average_order,
total_orders,
ROW_NUMBER() OVER(
ORDER BY revenue DESC
) AS revenue_rank
FROM CustomerMetrics;`,
  expectedColumns:[
"customer_id",
"revenue",
"average_order",
"total_orders",
"revenue_rank"
],
  solutionQuery:`WITH CustomerMetrics AS (
SELECT
customer_id,
SUM(total_amount) AS revenue,
AVG(total_amount) AS average_order,
COUNT(*) AS total_orders
FROM orders
GROUP BY customer_id
)
SELECT
customer_id,
revenue,
average_order,
total_orders,
ROW_NUMBER() OVER(
ORDER BY revenue DESC
) AS revenue_rank
FROM CustomerMetrics;`,
},
{
  id: 91,
  title: "Customer Revenue and Order Status Dashboard",
  difficulty: "Hard",
  slug: "sql-customer-revenue-status-dashboard",
  seoTitle: "SQL Customer Revenue and Order Status Dashboard",
  metaDescription: "Build a customer dashboard combining revenue, order counts and status metrics using SQL.",
  tags: ["SQL","CTE","CASE WHEN","GROUP BY","JOIN"],
  description: "Generate a report showing total revenue, total orders, delivered orders and cancelled orders for every customer.",
  explanation: "Combine aggregation and conditional aggregation to create multiple business KPIs in a single report.",
  scenario: "Customer Success managers review customer performance every week.",
  useCases: ["Customer Dashboard","Executive Reporting","Business Intelligence"],
  hint: "Use SUM(CASE...) and COUNT().",
  starterQuery:`SELECT
c.customer_id,
c.customer_name,
SUM(o.total_amount) AS total_revenue,
COUNT(o.order_id) AS total_orders,
SUM(CASE WHEN o.order_status='Delivered' THEN 1 ELSE 0 END) AS delivered_orders,
SUM(CASE WHEN o.order_status='Cancelled' THEN 1 ELSE 0 END) AS cancelled_orders
FROM customers c
JOIN orders o
ON c.customer_id=o.customer_id
GROUP BY
c.customer_id,
c.customer_name;`,
  expectedColumns:["customer_id","customer_name","total_revenue","total_orders","delivered_orders","cancelled_orders"],
  solutionQuery:`SELECT
c.customer_id,
c.customer_name,
SUM(o.total_amount) AS total_revenue,
COUNT(o.order_id) AS total_orders,
SUM(CASE WHEN o.order_status='Delivered' THEN 1 ELSE 0 END) AS delivered_orders,
SUM(CASE WHEN o.order_status='Cancelled' THEN 1 ELSE 0 END) AS cancelled_orders
FROM customers c
JOIN orders o
ON c.customer_id=o.customer_id
GROUP BY
c.customer_id,
c.customer_name;`,
},
{
  id:92,
  title:"Customer Lifetime Value Ranking",
  difficulty:"Hard",
  slug:"sql-customer-ltv-ranking",
  seoTitle:"SQL Customer Lifetime Value Ranking",
  metaDescription:"Rank customers by lifetime revenue while calculating their revenue contribution.",
  tags:["SQL","CTE","ROW_NUMBER","SUM OVER"],
  description:"Rank customers by lifetime revenue and calculate each customer's contribution to total revenue.",
  explanation:"Aggregate customer revenue first, then use ROW_NUMBER() and SUM() OVER().",
  scenario:"Leadership wants to identify VIP customers.",
  useCases:["Customer Segmentation","Revenue Analysis","Executive Dashboard"],
  hint:"Aggregate revenue first.",
  starterQuery:`WITH Revenue AS(
SELECT
customer_id,
SUM(total_amount) AS revenue
FROM orders
GROUP BY customer_id
)
SELECT
customer_id,
revenue,
ROW_NUMBER() OVER(
ORDER BY revenue DESC
) AS revenue_rank,
ROUND(
revenue*100.0/
SUM(revenue) OVER(),
2
) AS revenue_share
FROM Revenue;`,
  expectedColumns:["customer_id","revenue","revenue_rank","revenue_share"],
  solutionQuery:`WITH Revenue AS(
SELECT
customer_id,
SUM(total_amount) AS revenue
FROM orders
GROUP BY customer_id
)
SELECT
customer_id,
revenue,
ROW_NUMBER() OVER(
ORDER BY revenue DESC
) AS revenue_rank,
ROUND(
revenue*100.0/
SUM(revenue) OVER(),
2
) AS revenue_share
FROM Revenue;`,
},
{
  id:93,
  title:"Monthly Customer Leaderboard",
  difficulty:"Hard",
  slug:"sql-monthly-customer-leaderboard",
  seoTitle:"SQL Monthly Customer Revenue Leaderboard",
  metaDescription:"Create a monthly customer leaderboard using SQL window functions.",
  tags:["SQL","CTE","DENSE_RANK","SUM"],
  description:"Rank customers by revenue within every month.",
  explanation:"Aggregate monthly revenue first, then rank customers inside each month.",
  scenario:"Regional sales teams review monthly top performers.",
  useCases:["Monthly Reporting","Revenue Dashboard","Sales Analytics"],
  hint:"Partition ranking by month.",
  starterQuery:`WITH MonthlyRevenue AS(
SELECT
strftime('%Y-%m',order_date) AS month,
customer_id,
SUM(total_amount) AS revenue
FROM orders
GROUP BY
month,
customer_id
)
SELECT
month,
customer_id,
revenue,
DENSE_RANK() OVER(
PARTITION BY month
ORDER BY revenue DESC
) AS revenue_rank
FROM MonthlyRevenue;`,
  expectedColumns:["month","customer_id","revenue","revenue_rank"],
  solutionQuery:`WITH MonthlyRevenue AS(
SELECT
strftime('%Y-%m',order_date) AS month,
customer_id,
SUM(total_amount) AS revenue
FROM orders
GROUP BY
month,
customer_id
)
SELECT
month,
customer_id,
revenue,
DENSE_RANK() OVER(
PARTITION BY month
ORDER BY revenue DESC
) AS revenue_rank
FROM MonthlyRevenue;`,
},
{
  id:94,
  title:"Customer Purchase Summary Report",
  difficulty:"Hard",
  slug:"sql-customer-summary-report",
  seoTitle:"SQL Customer Purchase Summary Report",
  metaDescription:"Build a customer summary report using multiple SQL window functions.",
  tags:["SQL","ROW_NUMBER","FIRST_VALUE","LAST_VALUE","AVG OVER"],
  description:"Display purchase number, first purchase amount, latest purchase amount and average order value for every order.",
  explanation:"Combine multiple window functions to create a customer purchase summary.",
  scenario:"CRM teams want a complete customer purchase history.",
  useCases:["Customer Analytics","Business Reporting","Executive Dashboard"],
  hint:"Use ROW_NUMBER(), FIRST_VALUE(), LAST_VALUE() and AVG().",
  starterQuery:`SELECT
customer_id,
order_id,
total_amount,
ROW_NUMBER() OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS purchase_number,
FIRST_VALUE(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS first_purchase,
LAST_VALUE(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
ROWS BETWEEN UNBOUNDED PRECEDING
AND UNBOUNDED FOLLOWING
) AS latest_purchase,
AVG(total_amount) OVER(
PARTITION BY customer_id
) AS average_order
FROM orders;`,
  expectedColumns:["customer_id","order_id","total_amount","purchase_number","first_purchase","latest_purchase","average_order"],
  solutionQuery:`SELECT
customer_id,
order_id,
total_amount,
ROW_NUMBER() OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS purchase_number,
FIRST_VALUE(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS first_purchase,
LAST_VALUE(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
ROWS BETWEEN UNBOUNDED PRECEDING
AND UNBOUNDED FOLLOWING
) AS latest_purchase,
AVG(total_amount) OVER(
PARTITION BY customer_id
) AS average_order
FROM orders;`,
},
{
  id:95,
  title:"Executive Customer Performance Dashboard",
  difficulty:"Hard",
  slug:"sql-executive-customer-dashboard",
  seoTitle:"SQL Executive Customer Performance Dashboard",
  metaDescription:"Build a complete customer performance dashboard using SQL CTEs, joins and window functions.",
  tags:["SQL","CTE","JOIN","ROW_NUMBER","SUM OVER","AVG OVER","CASE WHEN"],
  description:"Generate a customer dashboard containing revenue, average order value, delivered orders, purchase rank and lifetime revenue.",
  explanation:"This capstone combines aggregation, conditional aggregation and multiple window functions into a production-ready report.",
  scenario:"Executives review customer performance every month.",
  useCases:["Executive Dashboard","Business Intelligence","Customer Analytics"],
  hint:"Create customer metrics in a CTE, then apply ROW_NUMBER().",
  starterQuery:`WITH CustomerMetrics AS(
SELECT
customer_id,
SUM(total_amount) AS revenue,
AVG(total_amount) AS average_order,
SUM(CASE WHEN order_status='Delivered' THEN 1 ELSE 0 END) AS delivered_orders
FROM orders
GROUP BY customer_id
)
SELECT
customer_id,
revenue,
average_order,
delivered_orders,
ROW_NUMBER() OVER(
ORDER BY revenue DESC
) AS customer_rank
FROM CustomerMetrics;`,
  expectedColumns:[
"customer_id",
"revenue",
"average_order",
"delivered_orders",
"customer_rank"
],
  solutionQuery:`WITH CustomerMetrics AS(
SELECT
customer_id,
SUM(total_amount) AS revenue,
AVG(total_amount) AS average_order,
SUM(CASE WHEN order_status='Delivered' THEN 1 ELSE 0 END) AS delivered_orders
FROM orders
GROUP BY customer_id
)
SELECT
customer_id,
revenue,
average_order,
delivered_orders,
ROW_NUMBER() OVER(
ORDER BY revenue DESC
) AS customer_rank
FROM CustomerMetrics;`,
},
{
  id: 96,
  title: "Country Revenue Leaderboard",
  difficulty: "Hard",
  slug: "sql-country-revenue-leaderboard",
  seoTitle: "SQL Country Revenue Leaderboard",
  metaDescription: "Build a country revenue leaderboard using SQL CTEs and window functions.",
  tags: ["SQL", "CTE", "JOIN", "DENSE_RANK", "SUM OVER"],
  description: "Calculate total revenue for each country, rank countries by revenue and display each country's percentage contribution.",
  explanation: "Aggregate revenue by country, then combine DENSE_RANK() with SUM() OVER() to calculate rankings and contribution percentages.",
  scenario: "The executive team reviews country-wise business performance every quarter.",
  useCases: ["Executive Dashboard", "Regional Analytics", "Revenue Reporting"],
  hint: "Aggregate first, then use DENSE_RANK() and SUM() OVER().",
  starterQuery: `WITH CountryRevenue AS (
SELECT
c.country,
SUM(o.total_amount) AS revenue
FROM customers c
JOIN orders o
ON c.customer_id=o.customer_id
GROUP BY c.country
)
SELECT
country,
revenue,
DENSE_RANK() OVER(
ORDER BY revenue DESC
) AS revenue_rank,
ROUND(
revenue*100.0/
SUM(revenue) OVER(),
2
) AS revenue_share
FROM CountryRevenue;`,
  expectedColumns:["country","revenue","revenue_rank","revenue_share"],
  solutionQuery:`WITH CountryRevenue AS (
SELECT
c.country,
SUM(o.total_amount) AS revenue
FROM customers c
JOIN orders o
ON c.customer_id=o.customer_id
GROUP BY c.country
)
SELECT
country,
revenue,
DENSE_RANK() OVER(
ORDER BY revenue DESC
) AS revenue_rank,
ROUND(
revenue*100.0/
SUM(revenue) OVER(),
2
) AS revenue_share
FROM CountryRevenue;`,
},
{
  id: 97,
  title: "Monthly Revenue Dashboard",
  difficulty: "Hard",
  slug: "sql-monthly-revenue-dashboard",
  seoTitle: "SQL Monthly Revenue Dashboard",
  metaDescription: "Build a monthly revenue dashboard using SQL CTEs and window functions.",
  tags: ["SQL", "CTE", "LAG", "SUM", "AVG"],
  description: "Display monthly revenue, previous month's revenue and average monthly revenue.",
  explanation: "Aggregate monthly revenue first, then combine LAG() and AVG() OVER() to create a trend report.",
  scenario: "Finance prepares a monthly business review presentation.",
  useCases: ["Revenue Trends", "Finance Dashboard", "Business Intelligence"],
  hint: "Use LAG() after aggregating monthly revenue.",
  starterQuery:`WITH MonthlyRevenue AS(
SELECT
strftime('%Y-%m',order_date) AS month,
SUM(total_amount) AS revenue
FROM orders
GROUP BY month
)
SELECT
month,
revenue,
LAG(revenue) OVER(
ORDER BY month
) AS previous_month,
AVG(revenue) OVER() AS average_monthly_revenue
FROM MonthlyRevenue;`,
  expectedColumns:["month","revenue","previous_month","average_monthly_revenue"],
  solutionQuery:`WITH MonthlyRevenue AS(
SELECT
strftime('%Y-%m',order_date) AS month,
SUM(total_amount) AS revenue
FROM orders
GROUP BY month
)
SELECT
month,
revenue,
LAG(revenue) OVER(
ORDER BY month
) AS previous_month,
AVG(revenue) OVER() AS average_monthly_revenue
FROM MonthlyRevenue;`,
},
{
  id: 98,
  title: "Product Performance Dashboard",
  difficulty: "Hard",
  slug: "sql-product-performance-dashboard",
  seoTitle: "SQL Product Performance Dashboard",
  metaDescription: "Build a product performance dashboard using joins, CTEs and window functions.",
  tags: ["SQL", "JOIN", "CTE", "ROW_NUMBER", "SUM"],
  description: "Display each product's revenue, quantity sold and revenue rank within its category.",
  explanation: "Aggregate product metrics first, then rank products within each category using ROW_NUMBER().",
  scenario: "Product managers review top-performing products every month.",
  useCases: ["Product Analytics", "Revenue Dashboard", "Inventory Planning"],
  hint: "Aggregate first, then partition ranking by category.",
  starterQuery:`WITH ProductStats AS(
SELECT
p.category,
p.product_name,
SUM(oi.quantity) AS units_sold,
SUM(oi.total_price) AS revenue
FROM products p
JOIN order_items oi
ON p.product_id=oi.product_id
GROUP BY
p.category,
p.product_name
)
SELECT
category,
product_name,
units_sold,
revenue,
ROW_NUMBER() OVER(
PARTITION BY category
ORDER BY revenue DESC
) AS revenue_rank
FROM ProductStats;`,
  expectedColumns:["category","product_name","units_sold","revenue","revenue_rank"],
  solutionQuery:`WITH ProductStats AS(
SELECT
p.category,
p.product_name,
SUM(oi.quantity) AS units_sold,
SUM(oi.total_price) AS revenue
FROM products p
JOIN order_items oi
ON p.product_id=oi.product_id
GROUP BY
p.category,
p.product_name
)
SELECT
category,
product_name,
units_sold,
revenue,
ROW_NUMBER() OVER(
PARTITION BY category
ORDER BY revenue DESC
) AS revenue_rank
FROM ProductStats;`,
},
{
  id: 99,
  title: "Customer Lifetime Revenue Report",
  difficulty: "Hard",
  slug: "sql-customer-lifetime-report",
  seoTitle: "SQL Customer Lifetime Revenue Report",
  metaDescription: "Build a customer lifetime revenue report using SQL window functions.",
  tags: ["SQL", "ROW_NUMBER", "SUM OVER", "AVG OVER", "FIRST_VALUE", "LAST_VALUE"],
  description: "Generate a report showing purchase sequence, first purchase, latest purchase, cumulative revenue and lifetime revenue for every order.",
  explanation: "This report combines several window functions to produce a complete customer lifetime history.",
  scenario: "Customer Success reviews customer growth and lifetime value.",
  useCases: ["Customer Analytics", "Executive Dashboard", "Business Intelligence"],
  hint: "Combine multiple window functions in a single query.",
  starterQuery:`SELECT
customer_id,
order_id,
total_amount,
ROW_NUMBER() OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS purchase_number,
FIRST_VALUE(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS first_purchase,
LAST_VALUE(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
ROWS BETWEEN UNBOUNDED PRECEDING
AND UNBOUNDED FOLLOWING
) AS latest_purchase,
SUM(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS cumulative_revenue,
SUM(total_amount) OVER(
PARTITION BY customer_id
) AS lifetime_revenue
FROM orders;`,
  expectedColumns:["customer_id","order_id","total_amount","purchase_number","first_purchase","latest_purchase","cumulative_revenue","lifetime_revenue"],
  solutionQuery:`SELECT
customer_id,
order_id,
total_amount,
ROW_NUMBER() OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS purchase_number,
FIRST_VALUE(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS first_purchase,
LAST_VALUE(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
ROWS BETWEEN UNBOUNDED PRECEDING
AND UNBOUNDED FOLLOWING
) AS latest_purchase,
SUM(total_amount) OVER(
PARTITION BY customer_id
ORDER BY order_date
) AS cumulative_revenue,
SUM(total_amount) OVER(
PARTITION BY customer_id
) AS lifetime_revenue
FROM orders;`,
},
{
  id: 100,
  title: "Executive Business Performance Dashboard",
  difficulty: "Hard",
  slug: "sql-executive-business-performance-dashboard",
  seoTitle: "SQL Executive Business Performance Dashboard",
  metaDescription: "Create a complete executive business dashboard using SQL CTEs, joins, aggregation and window functions.",
  tags: ["SQL", "CTE", "JOIN", "ROW_NUMBER", "CASE WHEN", "SUM", "AVG"],
  description: "Build a customer performance report showing total revenue, average order value, delivered orders, cancelled orders and customer revenue ranking.",
  explanation: "This capstone combines joins, conditional aggregation, CTEs and window functions into a production-style business report.",
  scenario: "The CEO reviews this dashboard during the monthly business review meeting.",
  useCases: ["Executive Dashboard", "Business Intelligence", "Customer Performance"],
  hint: "Create customer metrics first, then rank customers by revenue.",
  starterQuery:`WITH CustomerMetrics AS(
SELECT
customer_id,
SUM(total_amount) AS revenue,
AVG(total_amount) AS average_order,
SUM(CASE WHEN order_status='Delivered' THEN 1 ELSE 0 END) AS delivered_orders,
SUM(CASE WHEN order_status='Cancelled' THEN 1 ELSE 0 END) AS cancelled_orders
FROM orders
GROUP BY customer_id
)
SELECT
customer_id,
revenue,
average_order,
delivered_orders,
cancelled_orders,
ROW_NUMBER() OVER(
ORDER BY revenue DESC
) AS revenue_rank
FROM CustomerMetrics;`,
  expectedColumns:[
"customer_id",
"revenue",
"average_order",
"delivered_orders",
"cancelled_orders",
"revenue_rank"
],
  solutionQuery:`WITH CustomerMetrics AS(
SELECT
customer_id,
SUM(total_amount) AS revenue,
AVG(total_amount) AS average_order,
SUM(CASE WHEN order_status='Delivered' THEN 1 ELSE 0 END) AS delivered_orders,
SUM(CASE WHEN order_status='Cancelled' THEN 1 ELSE 0 END) AS cancelled_orders
FROM orders
GROUP BY customer_id
)
SELECT
customer_id,
revenue,
average_order,
delivered_orders,
cancelled_orders,
ROW_NUMBER() OVER(
ORDER BY revenue DESC
) AS revenue_rank
FROM CustomerMetrics;`,
},
          
    
  ];