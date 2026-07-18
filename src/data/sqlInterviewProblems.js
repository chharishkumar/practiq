
export const SQL_INTERVIEW_PROBLEMS = [

  {
    id: 1,
    title: "Second Highest Order Amount",
    difficulty: "Easy",
    slug: "sql-second-highest-order-amount",
    seoTitle: "SQL Interview Question | Find the Second Highest Order Amount",
    metaDescription: "Learn how to find the second highest order amount using SQL.",
    tags: ["SQL", "Interview", "MAX", "Subquery", "Easy"],
    description: "Find the second highest order amount from the orders table.",
    explanation: "Find the maximum order amount that is smaller than the highest order amount.",
    scenario: "An interviewer asks you to retrieve the second largest order value without using LIMIT OFFSET.",
    useCases: [
      "SQL interviews",
      "Ranking values",
      "Business reporting"
    ],
    hint: "Use MAX() with a subquery.",
    starterQuery: `SELECT MAX(total_amount) AS second_highest_order
  FROM orders
  WHERE total_amount < (
      SELECT MAX(total_amount)
      FROM orders
  );`,
    expectedColumns: [
      "second_highest_order"
    ],
    solutionQuery: `SELECT
      MAX(total_amount) AS second_highest_order
  FROM orders
  WHERE total_amount < (
      SELECT MAX(total_amount)
      FROM orders
  );`,
  },
  {
    id: 2,
    title: "Customers Without Orders",
    difficulty: "Easy",
    slug: "sql-customers-without-orders",
    seoTitle: "SQL Interview Question | Customers Without Orders",
    metaDescription: "Find customers who have never placed an order using SQL.",
    tags: ["SQL", "Interview", "LEFT JOIN", "IS NULL", "Easy"],
    description: "Find all customers who have never placed an order.",
    explanation: "Use a LEFT JOIN and filter rows where no matching order exists.",
    scenario: "The marketing team wants to target inactive customers.",
    useCases: [
      "Customer segmentation",
      "Marketing",
      "SQL interviews"
    ],
    hint: "LEFT JOIN orders and filter NULL values.",
    starterQuery: `SELECT
  c.customer_id,
  c.customer_name
  FROM customers c
  LEFT JOIN orders o
  ON c.customer_id = o.customer_id
  WHERE o.order_id IS NULL;`,
    expectedColumns: [
      "customer_id",
      "customer_name"
    ],
    solutionQuery: `SELECT
      c.customer_id,
      c.customer_name
  FROM customers c
  LEFT JOIN orders o
      ON c.customer_id = o.customer_id
  WHERE o.order_id IS NULL;`,
  },
  {
    id: 3,
    title: "Highest Spending Customer",
    difficulty: "Easy",
    slug: "sql-highest-spending-customer",
    seoTitle: "SQL Interview Question | Highest Spending Customer",
    metaDescription: "Find the customer who has spent the most money using SQL.",
    tags: ["SQL", "Interview", "GROUP BY", "SUM", "ORDER BY"],
    description: "Find the customer with the highest total spending.",
    explanation: "Aggregate customer spending using SUM() and sort by revenue in descending order.",
    scenario: "Sales wants to identify the highest value customer.",
    useCases: [
      "Customer analytics",
      "Revenue analysis",
      "SQL interviews"
    ],
    hint: "GROUP BY customer_id and ORDER BY SUM(total_amount).",
    starterQuery: `SELECT
  customer_id,
  SUM(total_amount) AS total_spent
  FROM orders
  GROUP BY customer_id
  ORDER BY total_spent DESC
  LIMIT 1;`,
    expectedColumns: [
      "customer_id",
      "total_spent"
    ],
    solutionQuery: `SELECT
      customer_id,
      SUM(total_amount) AS total_spent
  FROM orders
  GROUP BY customer_id
  ORDER BY total_spent DESC
  LIMIT 1;`,
  },
  {
    id: 4,
    title: "Products Never Ordered",
    difficulty: "Easy",
    slug: "sql-products-never-ordered",
    seoTitle: "SQL Interview Question | Products Never Ordered",
    metaDescription: "Find products that have never been ordered using SQL.",
    tags: ["SQL", "Interview", "LEFT JOIN", "IS NULL", "Easy"],
    description: "Find all products that have never appeared in any order.",
    explanation: "LEFT JOIN products with order_items and return unmatched rows.",
    scenario: "Inventory managers want to identify products with zero sales.",
    useCases: [
      "Inventory analysis",
      "Sales reporting",
      "SQL interviews"
    ],
    hint: "LEFT JOIN order_items and check for NULL.",
    starterQuery: `SELECT
  p.product_id,
  p.product_name
  FROM products p
  LEFT JOIN order_items oi
  ON p.product_id = oi.product_id
  WHERE oi.item_id IS NULL;`,
    expectedColumns: [
      "product_id",
      "product_name"
    ],
    solutionQuery: `SELECT
      p.product_id,
      p.product_name
  FROM products p
  LEFT JOIN order_items oi
      ON p.product_id = oi.product_id
  WHERE oi.item_id IS NULL;`,
  },
  {
    id: 5,
    title: "Customers Above Average Spending",
    difficulty: "Easy",
    slug: "sql-customers-above-average-spending",
    seoTitle: "SQL Interview Question | Customers Above Average Spending",
    metaDescription: "Find customers whose total spending is greater than the average customer spending.",
    tags: ["SQL", "Interview", "GROUP BY", "HAVING", "Subquery"],
    description: "Find customers whose total spending is greater than the average spending of all customers.",
    explanation: "First calculate each customer's spending, then compare it with the average customer spending.",
    scenario: "The finance team wants to identify high-value customers.",
    useCases: [
      "Customer segmentation",
      "Revenue analysis",
      "SQL interviews"
    ],
    hint: "Use GROUP BY with HAVING and a subquery.",
    starterQuery: `SELECT
  customer_id,
  SUM(total_amount) AS total_spent
  FROM orders
  GROUP BY customer_id
  HAVING SUM(total_amount) >
  (
  SELECT AVG(customer_total)
  FROM
  (
  SELECT
  SUM(total_amount) AS customer_total
  FROM orders
  GROUP BY customer_id
  )t
  );`,
    expectedColumns: [
      "customer_id",
      "total_spent"
    ],
    solutionQuery: `SELECT
      customer_id,
      SUM(total_amount) AS total_spent
  FROM orders
  GROUP BY customer_id
  HAVING SUM(total_amount) >
  (
  SELECT AVG(customer_total)
  FROM
  (
  SELECT
  SUM(total_amount) AS customer_total
  FROM orders
  GROUP BY customer_id
  )t
  );`,
  },
  {
    id: 6,
    title: "Top 3 Highest Order Amounts",
    difficulty: "Easy",
    slug: "sql-top-3-highest-order-amounts",
    seoTitle: "SQL Interview Question | Top 3 Highest Order Amounts",
    metaDescription: "Find the top three highest order amounts using SQL.",
    tags: ["SQL", "Interview", "ORDER BY", "LIMIT", "Easy"],
    description: "Retrieve the three highest order amounts.",
    explanation: "Sort the orders by total_amount in descending order and limit the result to three rows.",
    scenario: "The finance team wants to review the three largest orders placed.",
    useCases: [
      "Sales analysis",
      "Order reporting",
      "SQL interviews"
    ],
    hint: "Sort in descending order and use LIMIT.",
    starterQuery: `SELECT
  order_id,
  total_amount
  FROM orders
  ORDER BY total_amount DESC
  LIMIT 3;`,
    expectedColumns: [
      "order_id",
      "total_amount"
    ],
    solutionQuery: `SELECT
      order_id,
      total_amount
  FROM orders
  ORDER BY total_amount DESC
  LIMIT 3;`,
  },
  {
    id: 7,
    title: "Customers With More Than 1 Order",
    difficulty: "Easy",
    slug: "sql-customers-with-more-than-five-orders",
    seoTitle: "SQL Interview Question | Customers With More Than 1 Order",
    metaDescription: "Find customers who have placed more than one order.",
    tags: ["SQL", "Interview", "GROUP BY", "HAVING", "COUNT"],
    description: "Find customers who have placed more than 1 order.",
    explanation: "Group orders by customer and filter using HAVING.",
    scenario: "The loyalty team wants to identify frequent customers.",
    useCases: [
      "Customer loyalty",
      "Marketing",
      "SQL interviews"
    ],
    hint: "Use COUNT() with HAVING.",
    starterQuery: `SELECT
  customer_id,
  COUNT(*) AS total_orders
  FROM orders
  GROUP BY customer_id
  HAVING COUNT(*) > 1;`,
    expectedColumns: [
      "customer_id",
      "total_orders"
    ],
    solutionQuery: `SELECT
      customer_id,
      COUNT(*) AS total_orders
  FROM orders
  GROUP BY customer_id
  HAVING COUNT(*) > 1;`,
  },
  {
    id: 8,
    title: "Most Ordered Product",
    difficulty: "Easy",
    slug: "sql-most-ordered-product",
    seoTitle: "SQL Interview Question | Most Ordered Product",
    metaDescription: "Find the product that has been ordered the most.",
    tags: ["SQL", "Interview", "GROUP BY", "SUM", "JOIN"],
    description: "Find the product with the highest total quantity sold.",
    explanation: "Join products with order_items, aggregate quantity and return the highest selling product.",
    scenario: "The product team wants to identify the best-selling product.",
    useCases: [
      "Sales reporting",
      "Inventory planning",
      "SQL interviews"
    ],
    hint: "SUM(quantity) and ORDER BY descending.",
    starterQuery: `SELECT
  p.product_id,
  p.product_name,
  SUM(oi.quantity) AS total_quantity
  FROM products p
  JOIN order_items oi
  ON p.product_id = oi.product_id
  GROUP BY
  p.product_id,
  p.product_name
  ORDER BY total_quantity DESC
  LIMIT 1;`,
    expectedColumns: [
      "product_id",
      "product_name",
      "total_quantity"
    ],
    solutionQuery: `SELECT
      p.product_id,
      p.product_name,
      SUM(oi.quantity) AS total_quantity
  FROM products p
  JOIN order_items oi
      ON p.product_id = oi.product_id
  GROUP BY
      p.product_id,
      p.product_name
  ORDER BY total_quantity DESC
  LIMIT 1;`,
  },
  {
    id: 9,
    title: "Orders Above Average Value",
    difficulty: "Easy",
    slug: "sql-orders-above-average-value",
    seoTitle: "SQL Interview Question | Orders Above Average Value",
    metaDescription: "Find all orders whose value is greater than the average order value.",
    tags: ["SQL", "Interview", "AVG", "Subquery", "WHERE"],
    description: "Find orders whose total amount is greater than the average order amount.",
    explanation: "Compare each order against the average order amount using a subquery.",
    scenario: "Finance wants to review unusually large orders.",
    useCases: [
      "Order analysis",
      "Revenue reporting",
      "SQL interviews"
    ],
    hint: "Use AVG() inside a subquery.",
    starterQuery: `SELECT
  order_id,
  customer_id,
  total_amount
  FROM orders
  WHERE total_amount >
  (
  SELECT AVG(total_amount)
  FROM orders
  );`,
    expectedColumns: [
      "order_id",
      "customer_id",
      "total_amount"
    ],
    solutionQuery: `SELECT
      order_id,
      customer_id,
      total_amount
  FROM orders
  WHERE total_amount >
  (
  SELECT AVG(total_amount)
  FROM orders
  );`,
  },
  {
    id: 10,
    title: "Find Customers With Multiple Orders",
    difficulty: "Easy",
    slug: "sql-customers-with-multiple-orders",
    seoTitle: "SQL Interview Question | Find Customers With Multiple Orders",
    metaDescription: "Find customers who have placed more than one order using SQL.",
    tags: ["SQL", "Interview", "GROUP BY", "HAVING", "COUNT"],
    description: "Find customers who have placed more than one order.",
    explanation: "Group orders by customer and use HAVING to filter customers with more than one order.",
    scenario: "The sales team wants to identify repeat customers.",
    useCases: [
      "Customer analytics",
      "Repeat customer analysis",
      "SQL interviews"
    ],
    hint: "Use GROUP BY customer_id and HAVING COUNT(*) > 1.",
    starterQuery: `SELECT
  customer_id,
  COUNT(*) AS total_orders
  FROM orders
  GROUP BY customer_id
  HAVING COUNT(*) > 1;`,
    expectedColumns: [
      "customer_id",
      "total_orders"
    ],
    expectedRowCount: 8,
    solutionQuery: `SELECT
      customer_id,
      COUNT(*) AS total_orders
  FROM orders
  GROUP BY customer_id
  HAVING COUNT(*) > 1;`,
  },
  {
    id: 11,
    title: "Customers With Delivered Orders Only",
    difficulty: "Easy",
    slug: "sql-customers-with-delivered-orders-only",
    seoTitle: "SQL Interview Question | Customers With Delivered Orders Only",
    metaDescription: "Find customers whose every order has been delivered.",
    tags: ["SQL", "Interview", "NOT EXISTS", "Easy"],
    description: "Find customers who have placed orders, and every order they placed has been delivered.",
    explanation: "Use NOT EXISTS to eliminate customers having any non-delivered orders.",
    scenario: "Operations wants to identify customers with a perfect delivery history.",
    useCases: [
      "Customer segmentation",
      "Delivery analytics",
      "SQL interviews"
    ],
    hint: "Look for customers where no non-delivered order exists.",
    starterQuery: `SELECT
  c.customer_id,
  c.customer_name
  FROM customers c
  WHERE EXISTS (
      SELECT 1
      FROM orders o
      WHERE o.customer_id = c.customer_id
  )
  AND NOT EXISTS (
      SELECT 1
      FROM orders o
      WHERE o.customer_id = c.customer_id
      AND o.order_status <> 'delivered'
  );`,
    expectedColumns:[
      "customer_id",
      "customer_name"
    ],
    solutionQuery:`SELECT
      c.customer_id,
      c.customer_name
  FROM customers c
  WHERE EXISTS (
      SELECT 1
      FROM orders o
      WHERE o.customer_id = c.customer_id
  )
  AND NOT EXISTS (
      SELECT 1
      FROM orders o
      WHERE o.customer_id = c.customer_id
        AND o.order_status <> 'delivered'
  );`,
  },
  {
    id: 12,
    title: "Customers Who Purchased Electronics",
    difficulty: "Easy",
    slug: "sql-customers-purchased-electronics",
    seoTitle: "SQL Interview Question | Customers Who Purchased Electronics",
    metaDescription: "Find customers who have purchased at least one Electronics product.",
    tags:["SQL","Interview","EXISTS","JOIN","Easy"],
    description:"Find customers who have purchased at least one product from the Electronics category.",
    explanation:"Join orders, order_items and products using EXISTS.",
    scenario:"Marketing wants to launch an electronics loyalty campaign.",
    useCases:[
      "Marketing",
      "Customer segmentation",
      "SQL interviews"
    ],
    hint:"Use EXISTS with products.category.",
    starterQuery:`SELECT
  c.customer_id,
  c.customer_name
  FROM customers c
  WHERE EXISTS (
  SELECT 1
  FROM orders o
  JOIN order_items oi
  ON o.order_id=oi.order_id
  JOIN products p
  ON oi.product_id=p.product_id
  WHERE o.customer_id=c.customer_id
  AND p.category='Electronics'
  );`,
    expectedColumns:[
      "customer_id",
      "customer_name"
    ],
    solutionQuery:`SELECT
      c.customer_id,
      c.customer_name
  FROM customers c
  WHERE EXISTS (
  SELECT 1
  FROM orders o
  JOIN order_items oi
      ON o.order_id=oi.order_id
  JOIN products p
      ON oi.product_id=p.product_id
  WHERE o.customer_id=c.customer_id
  AND p.category='Electronics'
  );`,
  },
  {
    id: 13,
    title: "Orders Paid by  Card",
    difficulty: "Easy",
    slug: "sql-orders-paid-credit-card",
    seoTitle: "SQL Interview Question | Orders Paid Using Credit Card or Debit Card",
    metaDescription: "Find all orders paid using a credit card.",
    tags:["SQL","Interview","JOIN","WHERE","Easy"],
    description:"Find all orders where the payment method is Credit Card or Debit Card.",
    explanation:"Join orders and payments and filter by payment_method.",
    scenario:"Finance wants to review all credit card transactions.",
    useCases:[
      "Finance",
      "Payment analytics",
      "SQL interviews"
    ],
    hint:"Join payments with orders.",
    starterQuery:`SELECT
  o.order_id,
  o.customer_id,
  p.payment_method
  FROM orders o
  JOIN payments p
  ON o.order_id=p.order_id
  WHERE p.payment_method='card';`,
    expectedColumns:[
      "order_id",
      "customer_id",
      "payment_method"
    ],
    solutionQuery:`SELECT
      o.order_id,
      o.customer_id,
      p.payment_method
  FROM orders o
  JOIN payments p
      ON o.order_id=p.order_id
  WHERE p.payment_method='card';`,
  },
  {
    id: 14,
    title: "Customers With Above Average Orders",
    difficulty: "Easy",
    slug: "sql-customers-with-above-average-orders",
    seoTitle: "SQL Interview Question | Customers With Above Average Orders",
    metaDescription: "Find customers who have placed more orders than the average customer.",
    tags:["SQL","Interview","GROUP BY","HAVING","Subquery"],
    description:"Find customers whose number of orders is greater than the average number of orders placed by customers.",
    explanation:"Calculate each customer's order count, then compare it with the average order count.",
    scenario:"Business wants to identify highly engaged customers.",
    useCases:[
      "Customer analytics",
      "Engagement",
      "SQL interviews"
    ],
    hint:"Use HAVING with a nested subquery.",
    starterQuery:`SELECT
  customer_id,
  COUNT(*) AS total_orders
  FROM orders
  GROUP BY customer_id
  HAVING COUNT(*)>(
  SELECT AVG(order_count)
  FROM(
  SELECT COUNT(*) AS order_count
  FROM orders
  GROUP BY customer_id
  )t
  );`,
    expectedColumns:[
      "customer_id",
      "total_orders"
    ],
    solutionQuery:`SELECT
      customer_id,
      COUNT(*) AS total_orders
  FROM orders
  GROUP BY customer_id
  HAVING COUNT(*)>(
  SELECT AVG(order_count)
  FROM(
  SELECT COUNT(*) AS order_count
  FROM orders
  GROUP BY customer_id
  )t
  );`,
  },
  {
    id: 15,
    title: "Classify Orders by Value",
    difficulty: "Easy",
    slug: "sql-classify-orders-by-value",
    seoTitle: "SQL Interview Question | Classify Orders by Value",
    metaDescription: "Categorize orders into High, Medium and Low value using SQL CASE.",
    tags:["SQL","Interview","CASE","Easy"],
    description:"Classify every order as High, Medium or Low value based on total_amount.",
    explanation:"Use a CASE expression to categorize each order.",
    scenario:"Finance wants to classify order values for reporting.",
    useCases:[
      "Reporting",
      "Order analysis",
      "SQL interviews"
    ],
    hint:"Use CASE WHEN.",
    starterQuery:`SELECT
  order_id,
  total_amount,
  CASE
  WHEN total_amount>=1000 THEN 'High'
  WHEN total_amount>=500 THEN 'Medium'
  ELSE 'Low'
  END AS order_category
  FROM orders;`,
    expectedColumns:[
      "order_id",
      "total_amount",
      "order_category"
    ],
    solutionQuery:`SELECT
      order_id,
      total_amount,
      CASE
          WHEN total_amount>=1000 THEN 'High'
          WHEN total_amount>=500 THEN 'Medium'
          ELSE 'Low'
      END AS order_category
  FROM orders;`,
  },
  {
    id: 16,
    title: "Latest Order for Each Customer",
    difficulty: "Easy",
    slug: "sql-latest-order-for-each-customer",
    seoTitle: "SQL Interview Question | Latest Order for Each Customer",
    metaDescription: "Find the latest order placed by each customer using ROW_NUMBER().",
    tags: ["SQL", "Interview", "ROW_NUMBER", "Window Functions", "Easy"],
    description: "Find the most recent order placed by each customer.",
    explanation: "Assign a row number ordered by order_date in descending order for each customer, then return only the first row.",
    scenario: "Customer support wants to quickly view each customer's latest purchase.",
    useCases: [
      "Customer analytics",
      "Recent purchases",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() partitioned by customer_id.",
    starterQuery: `WITH LatestOrders AS (
  SELECT
  order_id,
  customer_id,
  order_date,
  ROW_NUMBER() OVER(
  PARTITION BY customer_id
  ORDER BY order_date DESC
  ) AS rn
  FROM orders
  )
  SELECT
  order_id,
  customer_id,
  order_date
  FROM LatestOrders
  WHERE rn = 1;`,
    expectedColumns: [
      "order_id",
      "customer_id",
      "order_date"
    ],
    solutionQuery: `WITH LatestOrders AS (
  SELECT
      order_id,
      customer_id,
      order_date,
      ROW_NUMBER() OVER(
          PARTITION BY customer_id
          ORDER BY order_date DESC
      ) AS rn
  FROM orders
  )
  SELECT
      order_id,
      customer_id,
      order_date
  FROM LatestOrders
  WHERE rn = 1;`,
  },
  {
    id: 17,
    title: "Rank Products by Price",
    difficulty: "Easy",
    slug: "sql-rank-products-by-price",
    seoTitle: "SQL Interview Question | Rank Products by Price",
    metaDescription: "Rank products by price using SQL RANK().",
    tags: ["SQL", "Interview", "RANK", "Window Functions"],
    description: "Rank all products from highest price to lowest price.",
    explanation: "Use the RANK() window function ordered by price descending.",
    scenario: "The product team wants to rank products based on price.",
    useCases: [
      "Pricing analysis",
      "Ranking",
      "SQL interviews"
    ],
    hint: "Use RANK() OVER(ORDER BY price DESC).",
    starterQuery: `SELECT
  product_id,
  product_name,
  price,
  RANK() OVER(
  ORDER BY price DESC
  ) AS price_rank
  FROM products;`,
    expectedColumns: [
      "product_id",
      "product_name",
      "price",
      "price_rank"
    ],
    solutionQuery: `SELECT
      product_id,
      product_name,
      price,
      RANK() OVER(
          ORDER BY price DESC
      ) AS price_rank
  FROM products;`,
  },
  {
    id: 18,
    title: "Top 2 Highest Orders for Each Customer",
    difficulty: "Easy",
    slug: "sql-top-2-highest-orders-per-customer",
    seoTitle: "SQL Interview Question | Top 2 Highest Orders Per Customer",
    metaDescription: "Find the top two highest order amounts for each customer using ROW_NUMBER().",
    tags: ["SQL", "Interview", "ROW_NUMBER", "Window Functions", "Partition"],
    description: "Find the two highest value orders placed by each customer.",
    explanation: "Assign a row number ordered by total_amount for each customer and return the top two rows.",
    scenario: "The sales team wants to review each customer's highest value purchases.",
    useCases: [
      "Customer analytics",
      "Sales reporting",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() partitioned by customer_id and filter rn <= 2.",
    starterQuery: `WITH RankedOrders AS (
  SELECT
  order_id,
  customer_id,
  total_amount,
  ROW_NUMBER() OVER(
  PARTITION BY customer_id
  ORDER BY total_amount DESC
  ) AS rn
  FROM orders
  )
  SELECT
  order_id,
  customer_id,
  total_amount
  FROM RankedOrders
  WHERE rn <= 2;`,
    expectedColumns: [
      "order_id",
      "customer_id",
      "total_amount"
    ],
    solutionQuery: `WITH RankedOrders AS (
  SELECT
      order_id,
      customer_id,
      total_amount,
      ROW_NUMBER() OVER(
          PARTITION BY customer_id
          ORDER BY total_amount DESC
      ) AS rn
  FROM orders
  )
  SELECT
      order_id,
      customer_id,
      total_amount
  FROM RankedOrders
  WHERE rn <= 2;`,
  },
  {
    id: 19,
    title: "Customer Revenue Ranking",
    difficulty: "Easy",
    slug: "sql-customer-revenue-ranking",
    seoTitle: "SQL Interview Question | Rank Customers by Revenue",
    metaDescription: "Rank customers based on their total revenue using SQL.",
    tags: ["SQL", "Interview", "RANK", "GROUP BY", "Revenue"],
    description: "Rank customers based on their total spending.",
    explanation: "Calculate total revenue per customer, then rank them from highest to lowest.",
    scenario: "Management wants to identify top revenue-generating customers.",
    useCases: [
      "Customer ranking",
      "Sales analytics",
      "SQL interviews"
    ],
    hint: "Aggregate first, then apply RANK().",
    starterQuery: `SELECT
  customer_id,
  SUM(total_amount) AS total_revenue,
  RANK() OVER(
  ORDER BY SUM(total_amount) DESC
  ) AS revenue_rank
  FROM orders
  GROUP BY customer_id;`,
    expectedColumns: [
      "customer_id",
      "total_revenue",
      "revenue_rank"
    ],
    solutionQuery: `SELECT
      customer_id,
      SUM(total_amount) AS total_revenue,
      RANK() OVER(
          ORDER BY SUM(total_amount) DESC
      ) AS revenue_rank
  FROM orders
  GROUP BY customer_id;`,
  },
  {
    id: 20,
    title: "Find Customers Who Placed Their First Order",
    difficulty: "Easy",
    slug: "sql-find-customers-first-order",
    seoTitle: "SQL Interview Question | Find Each Customer's First Order",
    metaDescription: "Find the first order placed by every customer using ROW_NUMBER().",
    tags: ["SQL", "Interview", "ROW_NUMBER", "Window Functions", "CTE"],
    description: "Find the first order placed by each customer.",
    explanation: "Rank each customer's orders by order_date in ascending order and return the first order.",
    scenario: "Customer success wants to analyze customers' first purchases.",
    useCases: [
      "Customer journey",
      "Sales analysis",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() ordered by order_date ASC.",
    starterQuery: `WITH FirstOrders AS (
  SELECT
  order_id,
  customer_id,
  order_date,
  ROW_NUMBER() OVER(
  PARTITION BY customer_id
  ORDER BY order_date ASC
  ) AS rn
  FROM orders
  )
  SELECT
  order_id,
  customer_id,
  order_date
  FROM FirstOrders
  WHERE rn = 1;`,
    expectedColumns: [
      "order_id",
      "customer_id",
      "order_date"
    ],
    solutionQuery: `WITH FirstOrders AS (
  SELECT
      order_id,
      customer_id,
      order_date,
      ROW_NUMBER() OVER(
          PARTITION BY customer_id
          ORDER BY order_date ASC
      ) AS rn
  FROM orders
  )
  SELECT
      order_id,
      customer_id,
      order_date
  FROM FirstOrders
  WHERE rn = 1;`,
  },
  {
    id: 21,
    title: "Rank Customers by Total Orders",
    difficulty: "Easy",
    slug: "sql-rank-customers-by-total-orders",
    seoTitle: "SQL Interview Question | Rank Customers by Total Orders",
    metaDescription: "Rank customers based on the number of orders they have placed using SQL.",
    tags: ["SQL", "Interview", "RANK", "GROUP BY", "Window Functions"],
    description: "Rank customers based on the total number of orders they have placed.",
    explanation: "Aggregate orders by customer and apply the RANK() window function.",
    scenario: "The marketing team wants to identify the most active customers.",
    useCases: [
      "Customer analytics",
      "Customer ranking",
      "SQL interviews"
    ],
    hint: "COUNT() first, then apply RANK().",
    starterQuery: `SELECT
  customer_id,
  COUNT(*) AS total_orders,
  RANK() OVER(
  ORDER BY COUNT(*) DESC
  ) AS customer_rank
  FROM orders
  GROUP BY customer_id;`,
    expectedColumns: [
      "customer_id",
      "total_orders",
      "customer_rank"
    ],
    solutionQuery: `SELECT
      customer_id,
      COUNT(*) AS total_orders,
      RANK() OVER(
          ORDER BY COUNT(*) DESC
      ) AS customer_rank
  FROM orders
  GROUP BY customer_id;`,
  },
  {
    id: 22,
    title: "Third Highest Order Amount",
    difficulty: "Easy",
    slug: "sql-third-highest-order-amount",
    seoTitle: "SQL Interview Question | Third Highest Order Amount",
    metaDescription: "Find the third highest order amount using SQL.",
    tags: ["SQL", "Interview", "DENSE_RANK", "Window Functions"],
    description: "Find the third highest distinct order amount.",
    explanation: "Assign a dense rank based on order amount and return rank 3.",
    scenario: "An interviewer asks you to retrieve the third highest order value.",
    useCases: [
      "SQL interviews",
      "Ranking",
      "Business reporting"
    ],
    hint: "Use DENSE_RANK().",
    starterQuery: `WITH RankedOrders AS (
  SELECT
  total_amount,
  DENSE_RANK() OVER(
  ORDER BY total_amount DESC
  ) AS ranking
  FROM orders
  )
  SELECT
  total_amount
  FROM RankedOrders
  WHERE ranking = 3;`,
    expectedColumns: [
      "total_amount"
    ],
    solutionQuery: `WITH RankedOrders AS (
  SELECT
      total_amount,
      DENSE_RANK() OVER(
          ORDER BY total_amount DESC
      ) AS ranking
  FROM orders
  )
  SELECT
      total_amount
  FROM RankedOrders
  WHERE ranking = 3;`,
  },
  {
    id: 23,
    title: "Previous Order Amount for Every Order",
    difficulty: "Easy",
    slug: "sql-previous-order-amount",
    seoTitle: "SQL Interview Question | Previous Order Amount Using LAG",
    metaDescription: "Retrieve the previous order amount for every customer using SQL LAG().",
    tags: ["SQL", "Interview", "LAG", "Window Functions"],
    description: "Display each order along with the previous order amount for the same customer.",
    explanation: "Use the LAG() window function partitioned by customer.",
    scenario: "Sales wants to compare every purchase with the customer's previous purchase.",
    useCases: [
      "Purchase analysis",
      "Customer analytics",
      "SQL interviews"
    ],
    hint: "Use LAG(total_amount).",
    starterQuery: `SELECT
  order_id,
  customer_id,
  order_date,
  total_amount,
  LAG(total_amount) OVER(
  PARTITION BY customer_id
  ORDER BY order_date
  ) AS previous_order_amount
  FROM orders;`,
    expectedColumns: [
      "order_id",
      "customer_id",
      "order_date",
      "total_amount",
      "previous_order_amount"
    ],
    solutionQuery: `SELECT
      order_id,
      customer_id,
      order_date,
      total_amount,
      LAG(total_amount) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS previous_order_amount
  FROM orders;`,
  },
  {
    id: 24,
    title: "Orders Above Customer Average",
    difficulty: "Easy",
    slug: "sql-orders-above-customer-average",
    seoTitle: "SQL Interview Question | Orders Above Customer Average",
    metaDescription: "Find orders whose value is greater than the customer's average order amount.",
    tags: ["SQL", "Interview", "AVG", "Correlated Subquery"],
    description: "Find all orders where the order amount is greater than that customer's average order amount.",
    explanation: "Compare every order against the average order value for the same customer.",
    scenario: "Business wants to identify unusually large purchases made by customers.",
    useCases: [
      "Purchase analysis",
      "Fraud detection",
      "SQL interviews"
    ],
    hint: "Use a correlated subquery with AVG().",
    starterQuery: `SELECT
  o.order_id,
  o.customer_id,
  o.total_amount
  FROM orders o
  WHERE o.total_amount >
  (
  SELECT AVG(total_amount)
  FROM orders
  WHERE customer_id = o.customer_id
  );`,
    expectedColumns: [
      "order_id",
      "customer_id",
      "total_amount"
    ],
    solutionQuery: `SELECT
      o.order_id,
      o.customer_id,
      o.total_amount
  FROM orders o
  WHERE o.total_amount >
  (
  SELECT AVG(total_amount)
  FROM orders
  WHERE customer_id = o.customer_id
  );`,
  },
  {
    id: 25,
    title: "Highest Priced Product in Each Category",
    difficulty: "Easy",
    slug: "sql-highest-priced-product-per-category",
    seoTitle: "SQL Interview Question | Highest Priced Product Per Category",
    metaDescription: "Find the highest priced product in every category using ROW_NUMBER().",
    tags: ["SQL", "Interview", "ROW_NUMBER", "Partition", "Window Functions"],
    description: "Find the highest priced product from each product category.",
    explanation: "Assign row numbers within each category ordered by price descending and return the first product.",
    scenario: "The merchandising team wants to identify the premium product in each category.",
    useCases: [
      "Product analytics",
      "Pricing",
      "SQL interviews"
    ],
    hint: "Partition by category.",
    starterQuery: `WITH RankedProducts AS (
  SELECT
  product_id,
  product_name,
  category,
  price,
  ROW_NUMBER() OVER(
  PARTITION BY category
  ORDER BY price DESC
  ) AS rn
  FROM products
  )
  SELECT
  product_id,
  product_name,
  category,
  price
  FROM RankedProducts
  WHERE rn = 1;`,
    expectedColumns: [
      "product_id",
      "product_name",
      "category",
      "price"
    ],
    solutionQuery: `WITH RankedProducts AS (
  SELECT
      product_id,
      product_name,
      category,
      price,
      ROW_NUMBER() OVER(
          PARTITION BY category
          ORDER BY price DESC
      ) AS rn
  FROM products
  )
  SELECT
      product_id,
      product_name,
      category,
      price
  FROM RankedProducts
  WHERE rn = 1;`,
  },
  {
    id: 26,
    title: "Next Order Amount for Every Customer",
    difficulty: "Medium",
    slug: "sql-next-order-amount-for-every-customer",
    seoTitle: "SQL Interview Question | Next Order Amount Using LEAD",
    metaDescription: "Display the next order amount for every customer using SQL LEAD().",
    tags: ["SQL", "Interview", "LEAD", "Window Functions", "Medium"],
    description: "Display each order along with the next order amount placed by the same customer.",
    explanation: "Use LEAD() partitioned by customer_id and ordered by order_date.",
    scenario: "Sales wants to compare each purchase with the customer's next purchase.",
    useCases: [
      "Purchase analysis",
      "Customer analytics",
      "SQL interviews"
    ],
    hint: "Use LEAD(total_amount).",
    starterQuery: `SELECT
  order_id,
  customer_id,
  order_date,
  total_amount,
  LEAD(total_amount) OVER(
  PARTITION BY customer_id
  ORDER BY order_date
  ) AS next_order_amount
  FROM orders;`,
    expectedColumns: [
      "order_id",
      "customer_id",
      "order_date",
      "total_amount",
      "next_order_amount"
    ],
    solutionQuery: `SELECT
      order_id,
      customer_id,
      order_date,
      total_amount,
      LEAD(total_amount) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS next_order_amount
  FROM orders;`,
  },
  {
    id: 27,
    title: "Running Total of Customer Spending",
    difficulty: "Medium",
    slug: "sql-running-total-customer-spending",
    seoTitle: "SQL Interview Question | Running Total of Customer Spending",
    metaDescription: "Calculate the cumulative spending of every customer using SQL.",
    tags: ["SQL", "Interview", "SUM", "Window Functions", "Running Total"],
    description: "Calculate the running total of spending for each customer.",
    explanation: "Use SUM() OVER() ordered by order_date.",
    scenario: "Finance wants to monitor cumulative customer spending.",
    useCases: [
      "Revenue analysis",
      "Customer analytics",
      "SQL interviews"
    ],
    hint: "Use SUM() OVER().",
    starterQuery: `SELECT
  order_id,
  customer_id,
  order_date,
  total_amount,
  SUM(total_amount) OVER(
  PARTITION BY customer_id
  ORDER BY order_date
  ) AS running_total
  FROM orders;`,
    expectedColumns: [
      "order_id",
      "customer_id",
      "order_date",
      "total_amount",
      "running_total"
    ],
    solutionQuery: `SELECT
      order_id,
      customer_id,
      order_date,
      total_amount,
      SUM(total_amount) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS running_total
  FROM orders;`,
  },
  {
    id: 28,
    title: "Running Average Order Amount",
    difficulty: "Medium",
    slug: "sql-running-average-order-amount",
    seoTitle: "SQL Interview Question | Running Average Order Amount",
    metaDescription: "Calculate the running average order amount for every customer.",
    tags: ["SQL", "Interview", "AVG", "Window Functions", "Medium"],
    description: "Calculate the running average order amount for each customer.",
    explanation: "Use AVG() OVER() ordered by order_date.",
    scenario: "Business wants to observe how customer spending changes over time.",
    useCases: [
      "Trend analysis",
      "Customer analytics",
      "SQL interviews"
    ],
    hint: "Use AVG() OVER().",
    starterQuery: `SELECT
  order_id,
  customer_id,
  order_date,
  total_amount,
  AVG(total_amount) OVER(
  PARTITION BY customer_id
  ORDER BY order_date
  ) AS running_average
  FROM orders;`,
    expectedColumns: [
      "order_id",
      "customer_id",
      "order_date",
      "total_amount",
      "running_average"
    ],
    solutionQuery: `SELECT
      order_id,
      customer_id,
      order_date,
      total_amount,
      AVG(total_amount) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS running_average
  FROM orders;`,
  },
  {
    id: 29,
    title: "Customers Whose Latest Order Exceeds Their Average",
    difficulty: "Medium",
    slug: "sql-latest-order-greater-than-average",
    seoTitle: "SQL Interview Question | Latest Order Greater Than Customer Average",
    metaDescription: "Find customers whose latest order amount is greater than their average order amount.",
    tags: ["SQL", "Interview", "ROW_NUMBER", "AVG", "CTE"],
    description: "Find customers whose latest order amount is greater than their average order amount.",
    explanation: "Calculate customer averages and compare them with the latest order.",
    scenario: "Sales wants to identify customers increasing their spending.",
    useCases: [
      "Customer analytics",
      "Revenue growth",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() and AVG().",
    starterQuery: `WITH CustomerOrders AS (
  SELECT
  order_id,
  customer_id,
  order_date,
  total_amount,
  AVG(total_amount) OVER(PARTITION BY customer_id) AS avg_amount,
  ROW_NUMBER() OVER(
  PARTITION BY customer_id
  ORDER BY order_date DESC
  ) AS rn
  FROM orders
  )
  SELECT
  customer_id,
  order_id,
  total_amount,
  avg_amount
  FROM CustomerOrders
  WHERE rn = 1
  AND total_amount > avg_amount;`,
    expectedColumns: [
      "customer_id",
      "order_id",
      "total_amount",
      "avg_amount"
    ],
    solutionQuery: `WITH CustomerOrders AS (
  SELECT
      order_id,
      customer_id,
      order_date,
      total_amount,
      AVG(total_amount) OVER(PARTITION BY customer_id) AS avg_amount,
      ROW_NUMBER() OVER(
          PARTITION BY customer_id
          ORDER BY order_date DESC
      ) AS rn
  FROM orders
  )
  SELECT
      customer_id,
      order_id,
      total_amount,
      avg_amount
  FROM CustomerOrders
  WHERE rn = 1
  AND total_amount > avg_amount;`,
  },
  {
    id: 30,
    title: "Customers With Increasing Order Amounts",
    difficulty: "Medium",
    slug: "sql-customers-with-increasing-order-amounts",
    seoTitle: "SQL Interview Question | Customers With Increasing Order Amounts",
    metaDescription: "Find orders where the current order amount is greater than the customer's previous order amount.",
    tags: ["SQL", "Interview", "LAG", "Window Functions", "Medium"],
    description: "Find orders where the current order amount is greater than the previous order placed by the same customer.",
    explanation: "Use LAG() to compare the current order amount with the previous order amount for each customer.",
    scenario: "The sales team wants to identify customers who are spending more over time.",
    useCases: [
      "Customer analytics",
      "Revenue trends",
      "SQL interviews"
    ],
    hint: "Use LAG(total_amount) and compare it with the current total_amount.",
    starterQuery: `WITH OrderHistory AS (
  SELECT
  order_id,
  customer_id,
  order_date,
  total_amount,
  LAG(total_amount) OVER(
  PARTITION BY customer_id
  ORDER BY order_date
  ) AS previous_order_amount
  FROM orders
  )
  SELECT
  order_id,
  customer_id,
  order_date,
  total_amount,
  previous_order_amount
  FROM OrderHistory
  WHERE previous_order_amount IS NOT NULL
  AND total_amount > previous_order_amount;`,
    expectedColumns: [
      "order_id",
      "customer_id",
      "order_date",
      "total_amount",
      "previous_order_amount"
    ],
    solutionQuery: `WITH OrderHistory AS (
  SELECT
      order_id,
      customer_id,
      order_date,
      total_amount,
      LAG(total_amount) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS previous_order_amount
  FROM orders
  )
  SELECT
      order_id,
      customer_id,
      order_date,
      total_amount,
      previous_order_amount
  FROM OrderHistory
  WHERE previous_order_amount IS NOT NULL
  AND total_amount > previous_order_amount;`,
  },
  {
    id: 31,
    title: "Customer's Highest Order",
    difficulty: "Medium",
    slug: "sql-customers-highest-order",
    seoTitle: "SQL Interview Question | Customer's Highest Order",
    metaDescription: "Find the highest value order placed by each customer using SQL.",
    tags: ["SQL", "Interview", "ROW_NUMBER", "Window Functions", "Medium"],
    description: "Find the highest value order placed by every customer.",
    explanation: "Rank each customer's orders by total_amount and return the highest one.",
    scenario: "The sales team wants to review each customer's biggest purchase.",
    useCases: [
      "Customer analytics",
      "Revenue reporting",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() partitioned by customer_id.",
    starterQuery: `WITH RankedOrders AS (
  SELECT
  order_id,
  customer_id,
  total_amount,
  ROW_NUMBER() OVER(
  PARTITION BY customer_id
  ORDER BY total_amount DESC
  ) AS rn
  FROM orders
  )
  SELECT
  order_id,
  customer_id,
  total_amount
  FROM RankedOrders
  WHERE rn = 1;`,
    expectedColumns: [
      "order_id",
      "customer_id",
      "total_amount"
    ],
    solutionQuery: `WITH RankedOrders AS (
  SELECT
      order_id,
      customer_id,
      total_amount,
      ROW_NUMBER() OVER(
          PARTITION BY customer_id
          ORDER BY total_amount DESC
      ) AS rn
  FROM orders
  )
  SELECT
      order_id,
      customer_id,
      total_amount
  FROM RankedOrders
  WHERE rn = 1;`,
  },
  {
    id: 32,
    title: "Revenue Contribution Percentage",
    difficulty: "Medium",
    slug: "sql-revenue-contribution-percentage",
    seoTitle: "SQL Interview Question | Revenue Contribution Percentage",
    metaDescription: "Calculate each customer's contribution to total revenue.",
    tags: ["SQL", "Interview", "SUM", "Window Functions", "Percentage"],
    description: "Calculate each customer's percentage contribution to total revenue.",
    explanation: "Aggregate customer revenue and divide it by the overall revenue.",
    scenario: "Management wants to understand which customers contribute the most revenue.",
    useCases: [
      "Revenue analysis",
      "Business intelligence",
      "SQL interviews"
    ],
    hint: "Use SUM() OVER() to calculate the grand total.",
    starterQuery: `SELECT
  customer_id,
  SUM(total_amount) AS customer_revenue,
  ROUND(
  100.0 * SUM(total_amount) /
  SUM(SUM(total_amount)) OVER (),
  2
  ) AS revenue_percentage
  FROM orders
  GROUP BY customer_id;`,
    expectedColumns: [
      "customer_id",
      "customer_revenue",
      "revenue_percentage"
    ],
    solutionQuery: `SELECT
      customer_id,
      SUM(total_amount) AS customer_revenue,
      ROUND(
          100.0 * SUM(total_amount) /
          SUM(SUM(total_amount)) OVER (),
          2
      ) AS revenue_percentage
  FROM orders
  GROUP BY customer_id;`,
  },
  {
    id: 33,
    title: "Customers With Two or More Orders",
    difficulty: "Medium",
    slug: "sql-customers-two-or-more-orders",
    seoTitle: "SQL Interview Question | Customers With two or More Orders",
    metaDescription: "Find customers who have placed at least three orders.",
    tags: ["SQL", "Interview", "GROUP BY", "HAVING"],
    description: "Find customers who have placed two or more orders.",
    explanation: "Count orders for every customer and filter those with at least 2 or more orders.",
    scenario: "The loyalty team wants to identify repeat customers.",
    useCases: [
      "Customer retention",
      "Loyalty programs",
      "SQL interviews"
    ],
    hint: "Use HAVING COUNT(*) >= 2.",
    starterQuery: `SELECT
  customer_id,
  COUNT(*) AS total_orders
  FROM orders
  GROUP BY customer_id
  HAVING COUNT(*) >= 2;`,
    expectedColumns: [
      "customer_id",
      "total_orders"
    ],
    solutionQuery: `SELECT
      customer_id,
      COUNT(*) AS total_orders
  FROM orders
  GROUP BY customer_id
  HAVING COUNT(*) >= 2;`,
  },
  {
    id: 34,
    title: "Most Expensive Product Purchased by Each Customer",
    difficulty: "Medium",
    slug: "sql-most-expensive-product-per-customer",
    seoTitle: "SQL Interview Question | Most Expensive Product Purchased by Each Customer",
    metaDescription: "Find the most expensive product purchased by every customer.",
    tags: ["SQL", "Interview", "JOIN", "ROW_NUMBER", "Window Functions"],
    description: "Find the highest priced product purchased by every customer.",
    explanation: "Join orders, order_items and products, then rank products by price for each customer.",
    scenario: "Marketing wants to identify premium buyers.",
    useCases: [
      "Customer segmentation",
      "Product analysis",
      "SQL interviews"
    ],
    hint: "Partition by customer_id and order by price DESC.",
    starterQuery: `WITH RankedProducts AS (
  SELECT
  o.customer_id,
  p.product_name,
  p.price,
  ROW_NUMBER() OVER(
  PARTITION BY o.customer_id
  ORDER BY p.price DESC
  ) AS rn
  FROM orders o
  JOIN order_items oi
  ON o.order_id = oi.order_id
  JOIN products p
  ON oi.product_id = p.product_id
  )
  SELECT
  customer_id,
  product_name,
  price
  FROM RankedProducts
  WHERE rn = 1;`,
    expectedColumns: [
      "customer_id",
      "product_name",
      "price"
    ],
    solutionQuery: `WITH RankedProducts AS (
  SELECT
      o.customer_id,
      p.product_name,
      p.price,
      ROW_NUMBER() OVER(
          PARTITION BY o.customer_id
          ORDER BY p.price DESC
      ) AS rn
  FROM orders o
  JOIN order_items oi
  ON o.order_id = oi.order_id
  JOIN products p
  ON oi.product_id = p.product_id
  )
  SELECT
      customer_id,
      product_name,
      price
  FROM RankedProducts
  WHERE rn = 1;`,
  },
  {
    id: 35,
    title: "Revenue Difference From Previous Order",
    difficulty: "Medium",
    slug: "sql-revenue-difference-from-previous-order",
    seoTitle: "SQL Interview Question | Revenue Difference From Previous Order",
    metaDescription: "Calculate the difference between the current and previous order amount for each customer.",
    tags: ["SQL", "Interview", "LAG", "Window Functions"],
    description: "Calculate the difference between each order amount and the customer's previous order amount.",
    explanation: "Use LAG() to retrieve the previous order amount and subtract it from the current amount.",
    scenario: "Finance wants to analyze how customer spending changes from one purchase to the next.",
    useCases: [
      "Trend analysis",
      "Revenue analysis",
      "SQL interviews"
    ],
    hint: "Use LAG() and subtraction.",
    starterQuery: `SELECT
  order_id,
  customer_id,
  order_date,
  total_amount,
  total_amount -
  LAG(total_amount) OVER(
  PARTITION BY customer_id
  ORDER BY order_date
  ) AS amount_difference
  FROM orders;`,
    expectedColumns: [
      "order_id",
      "customer_id",
      "order_date",
      "total_amount",
      "amount_difference"
    ],
    solutionQuery: `SELECT
      order_id,
      customer_id,
      order_date,
      total_amount,
      total_amount -
      LAG(total_amount) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS amount_difference
  FROM orders;`,
  },
  
  {
    id: 36,
    title: "Top Selling Product in Each Category",
    difficulty: "Medium",
    slug: "sql-top-selling-product-per-category",
    seoTitle: "SQL Interview Question | Top Selling Product in Each Category",
    metaDescription: "Find the best-selling product in each category using SQL.",
    tags: ["SQL", "Interview", "ROW_NUMBER", "CTE", "JOIN"],
    description: "Find the product with the highest quantity sold in each category.",
    explanation: "Calculate total quantity sold for each product, rank products within each category, and return the top one.",
    scenario: "Management wants to identify the best-selling product from every category.",
    useCases: [
      "Sales reporting",
      "Inventory planning",
      "SQL interviews"
    ],
    hint: "Aggregate first, then use ROW_NUMBER().",
    starterQuery: `WITH ProductSales AS (
  SELECT
  p.category,
  p.product_id,
  p.product_name,
  SUM(oi.quantity) AS total_quantity,
  ROW_NUMBER() OVER(
  PARTITION BY p.category
  ORDER BY SUM(oi.quantity) DESC
  ) AS rn
  FROM products p
  JOIN order_items oi
  ON p.product_id = oi.product_id
  GROUP BY p.category,p.product_id,p.product_name
  )
  SELECT
  category,
  product_name,
  total_quantity
  FROM ProductSales
  WHERE rn = 1;`,
    expectedColumns: [
      "category",
      "product_name",
      "total_quantity"
    ],
    solutionQuery: `WITH ProductSales AS (
  SELECT
      p.category,
      p.product_id,
      p.product_name,
      SUM(oi.quantity) AS total_quantity,
      ROW_NUMBER() OVER(
          PARTITION BY p.category
          ORDER BY SUM(oi.quantity) DESC
      ) AS rn
  FROM products p
  JOIN order_items oi
  ON p.product_id = oi.product_id
  GROUP BY p.category,p.product_id,p.product_name
  )
  SELECT
      category,
      product_name,
      total_quantity
  FROM ProductSales
  WHERE rn = 1;`,
  },
  {
    id: 37,
    title: "Monthly Revenue Growth",
    difficulty: "Medium",
    slug: "sql-monthly-revenue-growth",
    seoTitle: "SQL Interview Question | Monthly Revenue Growth",
    metaDescription: "Compare monthly revenue with the previous month using SQL.",
    tags: ["SQL", "Interview", "LAG", "Window Functions"],
    description: "Calculate monthly revenue and compare it with the previous month.",
    explanation: "Aggregate revenue by month and use LAG() to retrieve the previous month's revenue.",
    scenario: "Finance wants to monitor month-over-month revenue changes.",
    useCases: [
      "Business intelligence",
      "Revenue trends",
      "SQL interviews"
    ],
    hint: "Use strftime('%Y-%m', order_date).",
    starterQuery: `WITH MonthlyRevenue AS (
  SELECT
  strftime('%Y-%m', order_date) AS month,
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
    expectedColumns: [
      "month",
      "revenue",
      "previous_month_revenue"
    ],
    solutionQuery: `WITH MonthlyRevenue AS (
  SELECT
      strftime('%Y-%m', order_date) AS month,
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
    id: 38,
    title: "Orders With Multiple Quantities",
    difficulty: "Medium",
    slug: "sql-orders-with-multiple-quantities",
    seoTitle: "SQL Interview Question | Orders With Multiple Quantities",
    metaDescription: "Find orders that contain at least one product with a quantity greater than one.",
    tags: ["SQL", "Interview", "JOIN", "GROUP BY", "HAVING"],
    description: "Find orders that include at least one product where the quantity ordered is greater than one.",
    explanation: "Join orders with order_items and filter rows where the ordered quantity exceeds one.",
    scenario: "The warehouse team wants to identify bulk purchases for packaging purposes.",
    useCases: [
      "Order analysis",
      "Warehouse operations",
      "SQL interviews"
    ],
    hint: "Filter quantity > 1 after joining the tables.",
    starterQuery: `SELECT
  o.order_id,
  o.customer_id,
  SUM(oi.quantity) AS total_quantity
  FROM orders o
  JOIN order_items oi
  ON o.order_id = oi.order_id
  WHERE oi.quantity > 1
  GROUP BY o.order_id, o.customer_id;`,
    expectedColumns: [
      "order_id",
      "customer_id",
      "total_quantity"
    ],
    solutionQuery: `SELECT
      o.order_id,
      o.customer_id,
      SUM(oi.quantity) AS total_quantity
  FROM orders o
  JOIN order_items oi
  ON o.order_id = oi.order_id
  WHERE oi.quantity > 1
  GROUP BY o.order_id, o.customer_id;`,
  },
  {
    id: 39,
    title: "Second Highest Product Price in Each Category",
    difficulty: "Medium",
    slug: "sql-second-highest-price-per-category",
    seoTitle: "SQL Interview Question | Second Highest Product Price Per Category",
    metaDescription: "Find the second highest priced product in each category.",
    tags: ["SQL", "Interview", "DENSE_RANK", "Window Functions"],
    description: "Find the second highest priced product in every category.",
    explanation: "Assign a dense rank within each category ordered by price descending.",
    scenario: "Pricing analysts want to review premium products in each category.",
    useCases: [
      "Pricing analysis",
      "Retail analytics",
      "SQL interviews"
    ],
    hint: "Use DENSE_RANK().",
    starterQuery: `WITH RankedProducts AS (
  SELECT
  product_name,
  category,
  price,
  DENSE_RANK() OVER(
  PARTITION BY category
  ORDER BY price DESC
  ) AS ranking
  FROM products
  )
  SELECT
  product_name,
  category,
  price
  FROM RankedProducts
  WHERE ranking = 2;`,
    expectedColumns: [
      "product_name",
      "category",
      "price"
    ],
    solutionQuery: `WITH RankedProducts AS (
  SELECT
      product_name,
      category,
      price,
      DENSE_RANK() OVER(
          PARTITION BY category
          ORDER BY price DESC
      ) AS ranking
  FROM products
  )
  SELECT
      product_name,
      category,
      price
  FROM RankedProducts
  WHERE ranking = 2;`,
  },
  {
    id: 40,
    title: "Customers Whose Spending Increased",
    difficulty: "Medium",
    slug: "sql-customers-whose-spending-increased",
    seoTitle: "SQL Interview Question | Customers Whose Spending Increased",
    metaDescription: "Find customers whose latest order amount is higher than their previous order amount.",
    tags: ["SQL", "Interview", "LAG", "Window Functions"],
    description: "Find customers whose latest purchase is greater than their previous purchase.",
    explanation: "Compare the latest and previous order amounts using LAG().",
    scenario: "The sales team wants to identify customers increasing their spending.",
    useCases: [
      "Customer analytics",
      "Sales trends",
      "SQL interviews"
    ],
    hint: "Use LAG() and filter where the current amount is greater.",
    starterQuery: `WITH OrderHistory AS (
  SELECT
  order_id,
  customer_id,
  order_date,
  total_amount,
  LAG(total_amount) OVER(
  PARTITION BY customer_id
  ORDER BY order_date
  ) AS previous_amount
  FROM orders
  )
  SELECT
  order_id,
  customer_id,
  total_amount,
  previous_amount
  FROM OrderHistory
  WHERE previous_amount IS NOT NULL
  AND total_amount > previous_amount;`,
    expectedColumns: [
      "order_id",
      "customer_id",
      "total_amount",
      "previous_amount"
    ],
    solutionQuery: `WITH OrderHistory AS (
  SELECT
      order_id,
      customer_id,
      order_date,
      total_amount,
      LAG(total_amount) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS previous_amount
  FROM orders
  )
  SELECT
      order_id,
      customer_id,
      total_amount,
      previous_amount
  FROM OrderHistory
  WHERE previous_amount IS NOT NULL
  AND total_amount > previous_amount;`,
  },
  {
    id: 41,
    title: "Top 3 Customers by Revenue",
    difficulty: "Medium",
    slug: "sql-top-3-customers-by-revenue",
    seoTitle: "SQL Interview Question | Top 3 Customers by Revenue",
    metaDescription: "Find the top three customers based on total revenue.",
    tags: ["SQL", "Interview", "GROUP BY", "ORDER BY", "LIMIT"],
    description: "Find the top three customers based on their total spending.",
    explanation: "Calculate total revenue for each customer, sort in descending order, and return the top three.",
    scenario: "The sales team wants to reward the highest spending customers.",
    useCases: [
      "Customer analytics",
      "Revenue reporting",
      "SQL interviews"
    ],
    hint: "Use GROUP BY, ORDER BY DESC and LIMIT.",
    starterQuery: `SELECT
  customer_id,
  SUM(total_amount) AS total_revenue
  FROM orders
  GROUP BY customer_id
  ORDER BY total_revenue DESC
  LIMIT 3;`,
    expectedColumns: [
      "customer_id",
      "total_revenue"
    ],
    solutionQuery: `SELECT
      customer_id,
      SUM(total_amount) AS total_revenue
  FROM orders
  GROUP BY customer_id
  ORDER BY total_revenue DESC
  LIMIT 3;`,
  },
  {
    id: 42,
    title: "Customers With More Delivered Orders Than Cancelled Orders",
    difficulty: "Medium",
    slug: "sql-customers-more-delivered-than-cancelled-orders",
    seoTitle: "SQL Interview Question | Customers With More Delivered Than Cancelled Orders",
    metaDescription: "Find customers who have more delivered orders than cancelled orders using SQL.",
    tags: ["SQL", "Interview", "CASE", "GROUP BY", "Conditional Aggregation"],
    description: "Find customers who have completed more delivered orders than cancelled orders.",
    explanation: "Use conditional aggregation to count delivered and cancelled orders separately for each customer.",
    scenario: "The customer success team wants to identify reliable customers with successful order histories.",
    useCases: [
      "Customer analytics",
      "Order analysis",
      "SQL interviews"
    ],
    hint: "Use SUM(CASE WHEN ... THEN 1 ELSE 0 END).",
    starterQuery: `SELECT
  customer_id,
  SUM(CASE WHEN order_status = 'delivered' THEN 1 ELSE 0 END) AS delivered_orders,
  SUM(CASE WHEN order_status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_orders
  FROM orders
  GROUP BY customer_id
  HAVING delivered_orders > cancelled_orders;`,
    expectedColumns: [
      "customer_id",
      "delivered_orders",
      "cancelled_orders"
    ],
    solutionQuery: `SELECT
      customer_id,
      SUM(CASE WHEN order_status = 'delivered' THEN 1 ELSE 0 END) AS delivered_orders,
      SUM(CASE WHEN order_status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_orders
  FROM orders
  GROUP BY customer_id
  HAVING delivered_orders > cancelled_orders;`,
  },
  {
    id: 43,
    title: "Most Popular Product",
    difficulty: "Medium",
    slug: "sql-most-popular-product",
    seoTitle: "SQL Interview Question | Most Popular Product",
    metaDescription: "Find the product purchased by the highest number of customers.",
    tags: ["SQL", "Interview", "JOIN", "GROUP BY", "LIMIT"],
    description: "Find the product purchased by the highest number of unique customers.",
    explanation: "Count distinct customers for every product and return the highest.",
    scenario: "Marketing wants to identify the most popular product.",
    useCases: [
      "Product analytics",
      "Marketing",
      "SQL interviews"
    ],
    hint: "Use COUNT(DISTINCT customer_id).",
    starterQuery: `SELECT
  p.product_name,
  COUNT(DISTINCT o.customer_id) AS customer_count
  FROM products p
  JOIN order_items oi
  ON p.product_id = oi.product_id
  JOIN orders o
  ON oi.order_id = o.order_id
  GROUP BY p.product_id,p.product_name
  ORDER BY customer_count DESC
  LIMIT 1;`,
    expectedColumns: [
      "product_name",
      "customer_count"
    ],
    solutionQuery: `SELECT
      p.product_name,
      COUNT(DISTINCT o.customer_id) AS customer_count
  FROM products p
  JOIN order_items oi
  ON p.product_id = oi.product_id
  JOIN orders o
  ON oi.order_id = o.order_id
  GROUP BY p.product_id,p.product_name
  ORDER BY customer_count DESC
  LIMIT 1;`,
  },
  {
    id: 44,
    title: "Products Never Purchased",
    difficulty: "Medium",
    slug: "sql-products-never-purchased",
    seoTitle: "SQL Interview Question | Products Never Purchased",
    metaDescription: "Find products that have never been ordered.",
    tags: ["SQL", "Interview", "LEFT JOIN", "NULL"],
    description: "Find all products that have never been purchased.",
    explanation: "Left join products with order_items and keep unmatched products.",
    scenario: "Inventory wants to identify products with zero sales.",
    useCases: [
      "Inventory analysis",
      "Sales reporting",
      "SQL interviews"
    ],
    hint: "Use LEFT JOIN and IS NULL.",
    starterQuery: `SELECT
  p.product_id,
  p.product_name
  FROM products p
  LEFT JOIN order_items oi
  ON p.product_id = oi.product_id
  WHERE oi.product_id IS NULL;`,
    expectedColumns: [
      "product_id",
      "product_name"
    ],
    solutionQuery: `SELECT
      p.product_id,
      p.product_name
  FROM products p
  LEFT JOIN order_items oi
  ON p.product_id = oi.product_id
  WHERE oi.product_id IS NULL;`,
  },
  {
    id: 45,
    title: "Average Days Between Customer Orders",
    difficulty: "Medium",
    slug: "sql-average-days-between-orders",
    seoTitle: "SQL Interview Question | Average Days Between Customer Orders",
    metaDescription: "Calculate the average number of days between consecutive customer orders.",
    tags: ["SQL", "Interview", "LAG", "julianday", "Window Functions"],
    description: "Calculate the average number of days between consecutive orders for every customer.",
    explanation: "Use LAG() to retrieve the previous order date and julianday() to calculate the difference.",
    scenario: "Business wants to understand customer purchase frequency.",
    useCases: [
      "Customer analytics",
      "Purchase behavior",
      "SQL interviews"
    ],
    hint: "Use julianday() with LAG().",
    starterQuery: `WITH OrderHistory AS (
  SELECT
  customer_id,
  order_date,
  LAG(order_date) OVER(
  PARTITION BY customer_id
  ORDER BY order_date
  ) AS previous_order_date
  FROM orders
  )
  SELECT
  customer_id,
  ROUND(AVG(julianday(order_date) - julianday(previous_order_date)),2) AS average_days
  FROM OrderHistory
  WHERE previous_order_date IS NOT NULL
  GROUP BY customer_id;`,
    expectedColumns: [
      "customer_id",
      "average_days"
    ],
    solutionQuery: `WITH OrderHistory AS (
  SELECT
      customer_id,
      order_date,
      LAG(order_date) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS previous_order_date
  FROM orders
  )
  SELECT
      customer_id,
      ROUND(AVG(julianday(order_date) - julianday(previous_order_date)),2) AS average_days
  FROM OrderHistory
  WHERE previous_order_date IS NOT NULL
  GROUP BY customer_id;`,
  },
  {
    id: 46,
    title: "Customer With Highest Average Order Value",
    difficulty: "Medium",
    slug: "sql-customer-highest-average-order-value",
    seoTitle: "SQL Interview Question | Customer With Highest Average Order Value",
    metaDescription: "Find the customer with the highest average order value using SQL.",
    tags: ["SQL", "Interview", "AVG", "GROUP BY", "LIMIT"],
    description: "Find the customer whose average order amount is the highest.",
    explanation: "Calculate the average order amount for each customer and return the highest.",
    scenario: "The business wants to identify customers who consistently place high-value orders.",
    useCases: [
      "Customer analytics",
      "Revenue analysis",
      "SQL interviews"
    ],
    hint: "Use AVG() with GROUP BY and LIMIT.",
    starterQuery: `SELECT
  customer_id,
  AVG(total_amount) AS average_order_value
  FROM orders
  GROUP BY customer_id
  ORDER BY average_order_value DESC
  LIMIT 1;`,
    expectedColumns: [
      "customer_id",
      "average_order_value"
    ],
    solutionQuery: `SELECT
      customer_id,
      AVG(total_amount) AS average_order_value
  FROM orders
  GROUP BY customer_id
  ORDER BY average_order_value DESC
  LIMIT 1;`,
  },
  {
    id: 47,
    title: "Customers With Orders in Multiple Months",
    difficulty: "Medium",
    slug: "sql-customers-orders-in-multiple-months",
    seoTitle: "SQL Interview Question | Customers With Orders in Multiple Months",
    metaDescription: "Find customers who have placed orders in more than one month using SQL.",
    tags: ["SQL", "Interview", "COUNT DISTINCT", "GROUP BY", "SQLite"],
    description: "Find customers who have placed orders in more than one distinct month.",
    explanation: "Group orders by customer and count the number of distinct months in which they placed orders.",
    scenario: "The retention team wants to identify customers who return and purchase across multiple months.",
    useCases: [
      "Customer retention",
      "Purchase behavior",
      "SQL interviews"
    ],
    hint: "Use COUNT(DISTINCT strftime('%Y-%m', order_date)).",
    starterQuery: `SELECT
  customer_id,
  COUNT(DISTINCT strftime('%Y-%m', order_date)) AS active_months
  FROM orders
  GROUP BY customer_id
  HAVING COUNT(DISTINCT strftime('%Y-%m', order_date)) > 1;`,
    expectedColumns: [
      "customer_id",
      "active_months"
    ],
    solutionQuery: `SELECT
      customer_id,
      COUNT(DISTINCT strftime('%Y-%m', order_date)) AS active_months
  FROM orders
  GROUP BY customer_id
  HAVING COUNT(DISTINCT strftime('%Y-%m', order_date)) > 1;`,
  },
  {
    id: 48,
    title: "Products Ordered More Than Average",
    difficulty: "Medium",
    slug: "sql-products-ordered-more-than-average",
    seoTitle: "SQL Interview Question | Products Ordered More Than Average",
    metaDescription: "Find products ordered more times than the average product.",
    tags: ["SQL", "Interview", "GROUP BY", "HAVING", "Subquery"],
    description: "Find products whose total ordered quantity is greater than the average quantity ordered across all products.",
    explanation: "Calculate total quantity per product and compare it with the overall average.",
    scenario: "Inventory wants to identify products performing above average.",
    useCases: [
      "Inventory planning",
      "Sales analytics",
      "SQL interviews"
    ],
    hint: "Aggregate first and compare with a subquery.",
    starterQuery: `SELECT
  product_id,
  SUM(quantity) AS total_quantity
  FROM order_items
  GROUP BY product_id
  HAVING SUM(quantity) >
  (
  SELECT AVG(total_quantity)
  FROM (
  SELECT SUM(quantity) AS total_quantity
  FROM order_items
  GROUP BY product_id
  )
  );`,
    expectedColumns: [
      "product_id",
      "total_quantity"
    ],
    solutionQuery: `SELECT
      product_id,
      SUM(quantity) AS total_quantity
  FROM order_items
  GROUP BY product_id
  HAVING SUM(quantity) >
  (
      SELECT AVG(total_quantity)
      FROM (
          SELECT SUM(quantity) AS total_quantity
          FROM order_items
          GROUP BY product_id
      )
  );`,
  },
  {
    id: 49,
    title: "Top Customer in Each City",
    difficulty: "Medium",
    slug: "sql-top-customer-in-each-city",
    seoTitle: "SQL Interview Question | Top Customer in Each City",
    metaDescription: "Find the highest spending customer in each city.",
    tags: ["SQL", "Interview", "ROW_NUMBER", "JOIN", "Window Functions"],
    description: "Find the customer with the highest revenue in every city.",
    explanation: "Aggregate customer revenue by city and rank customers within each city.",
    scenario: "Regional managers want to recognize their top customers.",
    useCases: [
      "Regional reporting",
      "Customer analytics",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() partitioned by city.",
    starterQuery: `WITH CustomerRevenue AS (
  SELECT
  c.city,
  c.customer_id,
  SUM(o.total_amount) AS revenue,
  ROW_NUMBER() OVER(
  PARTITION BY c.city
  ORDER BY SUM(o.total_amount) DESC
  ) AS rn
  FROM customers c
  JOIN orders o
  ON c.customer_id = o.customer_id
  GROUP BY c.city,c.customer_id
  )
  SELECT
  city,
  customer_id,
  revenue
  FROM CustomerRevenue
  WHERE rn = 1;`,
    expectedColumns: [
      "city",
      "customer_id",
      "revenue"
    ],
    solutionQuery: `WITH CustomerRevenue AS (
  SELECT
      c.city,
      c.customer_id,
      SUM(o.total_amount) AS revenue,
      ROW_NUMBER() OVER(
          PARTITION BY c.city
          ORDER BY SUM(o.total_amount) DESC
      ) AS rn
  FROM customers c
  JOIN orders o
  ON c.customer_id = o.customer_id
  GROUP BY c.city,c.customer_id
  )
  SELECT
      city,
      customer_id,
      revenue
  FROM CustomerRevenue
  WHERE rn = 1;`,
  },
  {
    id: 50,
    title: "Customers Above Overall Average Revenue",
    difficulty: "Medium",
    slug: "sql-customers-above-overall-average-revenue",
    seoTitle: "SQL Interview Question | Customers Above Overall Average Revenue",
    metaDescription: "Find customers whose total revenue exceeds the average customer revenue.",
    tags: ["SQL", "Interview", "GROUP BY", "HAVING", "Subquery"],
    description: "Find customers whose total spending is greater than the average customer spending.",
    explanation: "Calculate total revenue per customer and compare it against the average revenue of all customers.",
    scenario: "Marketing wants to target high-value customers.",
    useCases: [
      "Customer segmentation",
      "Revenue analysis",
      "SQL interviews"
    ],
    hint: "Compare grouped totals with an aggregated subquery.",
    starterQuery: `SELECT
  customer_id,
  SUM(total_amount) AS total_revenue
  FROM orders
  GROUP BY customer_id
  HAVING SUM(total_amount) >
  (
  SELECT AVG(customer_revenue)
  FROM (
  SELECT SUM(total_amount) AS customer_revenue
  FROM orders
  GROUP BY customer_id
  )
  );`,
    expectedColumns: [
      "customer_id",
      "total_revenue"
    ],
    solutionQuery: `SELECT
      customer_id,
      SUM(total_amount) AS total_revenue
  FROM orders
  GROUP BY customer_id
  HAVING SUM(total_amount) >
  (
      SELECT AVG(customer_revenue)
      FROM (
          SELECT SUM(total_amount) AS customer_revenue
          FROM orders
          GROUP BY customer_id
      )
  );`,
  },
  {
    id: 51,
    title: "Top 5 Customers by Total Orders",
    difficulty: "Medium",
    slug: "sql-top-5-customers-by-total-orders",
    seoTitle: "SQL Interview Question | Top 5 Customers by Total Orders",
    metaDescription: "Find the top five customers based on the number of orders placed.",
    tags: ["SQL", "Interview", "GROUP BY", "ORDER BY", "LIMIT"],
    description: "Find the top five customers who placed the highest number of orders.",
    explanation: "Count orders for each customer and return the top five.",
    scenario: "The sales team wants to identify the most active customers.",
    useCases: [
      "Customer analytics",
      "Sales reporting",
      "SQL interviews"
    ],
    hint: "Use COUNT(*) with ORDER BY DESC.",
    starterQuery: `SELECT
  customer_id,
  COUNT(*) AS total_orders
  FROM orders
  GROUP BY customer_id
  ORDER BY total_orders DESC
  LIMIT 5;`,
    expectedColumns: [
      "customer_id",
      "total_orders"
    ],
    solutionQuery: `SELECT
      customer_id,
      COUNT(*) AS total_orders
  FROM orders
  GROUP BY customer_id
  ORDER BY total_orders DESC
  LIMIT 5;`,
  },
  {
    id: 52,
    title: "Revenue by Payment Method",
    difficulty: "Medium",
    slug: "sql-revenue-by-payment-method",
    seoTitle: "SQL Interview Question | Revenue by Payment Method",
    metaDescription: "Calculate total revenue generated by each payment method.",
    tags: ["SQL", "Interview", "JOIN", "GROUP BY", "SUM"],
    description: "Calculate the total revenue generated through each payment method.",
    explanation: "Join orders with payments and aggregate revenue by payment method.",
    scenario: "Finance wants to understand revenue contribution by payment method.",
    useCases: [
      "Revenue reporting",
      "Finance",
      "SQL interviews"
    ],
    hint: "Join payments with orders.",
    starterQuery: `SELECT
  p.payment_method,
  SUM(o.total_amount) AS total_revenue
  FROM payments p
  JOIN orders o
  ON p.order_id = o.order_id
  GROUP BY p.payment_method
  ORDER BY total_revenue DESC;`,
    expectedColumns: [
      "payment_method",
      "total_revenue"
    ],
    solutionQuery: `SELECT
      p.payment_method,
      SUM(o.total_amount) AS total_revenue
  FROM payments p
  JOIN orders o
  ON p.order_id = o.order_id
  GROUP BY p.payment_method
  ORDER BY total_revenue DESC;`,
  },
  {
    id: 53,
    title: "Customers Who Purchased More Than 5 Different Products",
    difficulty: "Medium",
    slug: "sql-customers-purchased-more-than-5-products",
    seoTitle: "SQL Interview Question | Customers Who Purchased More Than 5 Different Products",
    metaDescription: "Find customers who have purchased more than five different products using SQL.",
    tags: ["SQL", "Interview", "COUNT DISTINCT", "JOIN", "HAVING"],
    description: "Find customers who have purchased more than five different products.",
    explanation: "Join orders with order_items, count distinct products purchased by each customer, and filter customers with more than five unique products.",
    scenario: "The marketing team wants to identify customers with diverse purchasing behavior.",
    useCases: [
      "Customer segmentation",
      "Cross-selling",
      "SQL interviews"
    ],
    hint: "Use COUNT(DISTINCT product_id).",
    starterQuery: `SELECT
  o.customer_id,
  COUNT(DISTINCT oi.product_id) AS unique_products
  FROM orders o
  JOIN order_items oi
  ON o.order_id = oi.order_id
  GROUP BY o.customer_id
  HAVING COUNT(DISTINCT oi.product_id) > 5;`,
    expectedColumns: [
      "customer_id",
      "unique_products"
    ],
    solutionQuery: `SELECT
      o.customer_id,
      COUNT(DISTINCT oi.product_id) AS unique_products
  FROM orders o
  JOIN order_items oi
  ON o.order_id = oi.order_id
  GROUP BY o.customer_id
  HAVING COUNT(DISTINCT oi.product_id) > 5;`,
  },
  {
    id: 54,
    title: "Monthly Order Count",
    difficulty: "Medium",
    slug: "sql-monthly-order-count",
    seoTitle: "SQL Interview Question | Monthly Order Count",
    metaDescription: "Calculate the total number of orders placed each month.",
    tags: ["SQL", "Interview", "strftime", "GROUP BY"],
    description: "Calculate the total number of orders placed in every month.",
    explanation: "Group orders by year and month using SQLite's strftime().",
    scenario: "Management wants a monthly order summary.",
    useCases: [
      "Business reporting",
      "Trend analysis",
      "SQL interviews"
    ],
    hint: "Use strftime('%Y-%m', order_date).",
    starterQuery: `SELECT
  strftime('%Y-%m', order_date) AS month,
  COUNT(*) AS total_orders
  FROM orders
  GROUP BY month
  ORDER BY month;`,
    expectedColumns: [
      "month",
      "total_orders"
    ],
    solutionQuery: `SELECT
      strftime('%Y-%m', order_date) AS month,
      COUNT(*) AS total_orders
  FROM orders
  GROUP BY month
  ORDER BY month;`,
  },
  {
    id: 55,
    title: "Products With Highest Revenue",
    difficulty: "Medium",
    slug: "sql-products-with-highest-revenue",
    seoTitle: "SQL Interview Question | Products With Highest Revenue",
    metaDescription: "Find the products generating the highest revenue.",
    tags: ["SQL", "Interview", "JOIN", "SUM", "GROUP BY"],
    description: "Find products ranked by the total revenue they generated.",
    explanation: "Calculate revenue as quantity × unit_price and rank products by revenue.",
    scenario: "Product managers want to identify their highest revenue-generating products.",
    useCases: [
      "Revenue analysis",
      "Product performance",
      "SQL interviews"
    ],
    hint: "Use SUM(quantity * unit_price).",
    starterQuery: `SELECT
  p.product_id,
  p.product_name,
  SUM(oi.quantity * oi.unit_price) AS total_revenue
  FROM products p
  JOIN order_items oi
  ON p.product_id = oi.product_id
  GROUP BY p.product_id,p.product_name
  ORDER BY total_revenue DESC;`,
    expectedColumns: [
      "product_id",
      "product_name",
      "total_revenue"
    ],
    solutionQuery: `SELECT
      p.product_id,
      p.product_name,
      SUM(oi.quantity * oi.unit_price) AS total_revenue
  FROM products p
  JOIN order_items oi
  ON p.product_id = oi.product_id
  GROUP BY p.product_id,p.product_name
  ORDER BY total_revenue DESC;`,
  },
  {
    id: 56,
    title: "Customers With More Than One Completed Order",
    difficulty: "Medium",
    slug: "sql-customers-more-than-one-completed-order",
    seoTitle: "SQL Interview Question | Customers With More Than One Completed Order",
    metaDescription: "Find customers who have placed more than one delivered order using SQL.",
    tags: ["SQL", "Interview", "GROUP BY", "HAVING", "WHERE"],
    description: "Find customers who have placed more than one delivered order.",
    explanation: "Filter delivered orders, group them by customer, and return customers having more than one completed order.",
    scenario: "The loyalty team wants to identify repeat customers who have successfully completed multiple purchases.",
    useCases: [
      "Customer retention",
      "Loyalty analysis",
      "SQL interviews"
    ],
    hint: "Filter delivered orders before grouping.",
    starterQuery: `SELECT
  customer_id,
  COUNT(*) AS delivered_orders
  FROM orders
  WHERE order_status = 'delivered'
  GROUP BY customer_id
  HAVING COUNT(*) > 1;`,
    expectedColumns: [
      "customer_id",
      "delivered_orders"
    ],
    solutionQuery: `SELECT
      customer_id,
      COUNT(*) AS delivered_orders
  FROM orders
  WHERE order_status = 'delivered'
  GROUP BY customer_id
  HAVING COUNT(*) > 1;`,
  },
  {
    id: 57,
    title: "Top Revenue Product in Each Category",
    difficulty: "Medium",
    slug: "sql-top-revenue-product-in-each-category",
    seoTitle: "SQL Interview Question | Top Revenue Product in Each Category",
    metaDescription: "Find the highest revenue-generating product in each category.",
    tags: ["SQL", "Interview", "ROW_NUMBER", "CTE", "Window Functions"],
    description: "Find the product generating the highest revenue within each category.",
    explanation: "Calculate product revenue and rank products within each category.",
    scenario: "Business wants to identify the best-performing product in every category.",
    useCases: [
      "Product analytics",
      "Revenue reporting",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() partitioned by category.",
    starterQuery: `WITH ProductRevenue AS (
  SELECT
  p.category,
  p.product_id,
  p.product_name,
  SUM(oi.quantity * oi.unit_price) AS revenue,
  ROW_NUMBER() OVER(
  PARTITION BY p.category
  ORDER BY SUM(oi.quantity * oi.unit_price) DESC
  ) AS rn
  FROM products p
  JOIN order_items oi
  ON p.product_id = oi.product_id
  GROUP BY p.category,p.product_id,p.product_name
  )
  SELECT
  category,
  product_id,
  product_name,
  revenue
  FROM ProductRevenue
  WHERE rn = 1;`,
    expectedColumns: [
      "category",
      "product_id",
      "product_name",
      "revenue"
    ],
    solutionQuery: `WITH ProductRevenue AS (
  SELECT
      p.category,
      p.product_id,
      p.product_name,
      SUM(oi.quantity * oi.unit_price) AS revenue,
      ROW_NUMBER() OVER(
          PARTITION BY p.category
          ORDER BY SUM(oi.quantity * oi.unit_price) DESC
      ) AS rn
  FROM products p
  JOIN order_items oi
  ON p.product_id = oi.product_id
  GROUP BY p.category,p.product_id,p.product_name
  )
  SELECT
      category,
      product_id,
      product_name,
      revenue
  FROM ProductRevenue
  WHERE rn = 1;`,
  },
  {
    id: 58,
    title: "Customers Without Delivered Orders",
    difficulty: "Medium",
    slug: "sql-customers-without-delivered-orders",
    seoTitle: "SQL Interview Question | Customers Without Delivered Orders",
    metaDescription: "Find customers who have never had a delivered order.",
    tags: ["SQL", "Interview", "GROUP BY", "HAVING", "CASE"],
    description: "Find customers who have never placed a delivered order.",
    explanation: "Use conditional aggregation to count delivered orders and filter customers with zero deliveries.",
    scenario: "Support wants to identify customers whose orders have never been successfully delivered.",
    useCases: [
      "Customer support",
      "Order analysis",
      "SQL interviews"
    ],
    hint: "Use SUM(CASE WHEN...).",
    starterQuery: `SELECT
  customer_id
  FROM orders
  GROUP BY customer_id
  HAVING SUM(CASE WHEN order_status='delivered' THEN 1 ELSE 0 END)=0;`,
    expectedColumns: [
      "customer_id"
    ],
    solutionQuery: `SELECT
      customer_id
  FROM orders
  GROUP BY customer_id
  HAVING SUM(CASE WHEN order_status='delivered' THEN 1 ELSE 0 END)=0;`,
  },
  {
    id: 59,
    title: "Average Order Value by Customer Type",
    difficulty: "Medium",
    slug: "sql-average-order-value-by-customer-type",
    seoTitle: "SQL Interview Question | Average Order Value by Customer Type",
    metaDescription: "Calculate the average order value for each customer type.",
    tags: ["SQL", "Interview", "JOIN", "AVG", "GROUP BY"],
    description: "Calculate the average order amount for every customer type.",
    explanation: "Join customers and orders, then calculate the average order value for each customer type.",
    scenario: "Marketing wants to compare spending across different customer segments.",
    useCases: [
      "Customer analytics",
      "Business reporting",
      "SQL interviews"
    ],
    hint: "Join customers with orders.",
    starterQuery: `SELECT
  c.customer_type,
  ROUND(AVG(o.total_amount),2) AS average_order_value
  FROM customers c
  JOIN orders o
  ON c.customer_id=o.customer_id
  GROUP BY c.customer_type;`,
    expectedColumns: [
      "customer_type",
      "average_order_value"
    ],
    solutionQuery: `SELECT
      c.customer_type,
      ROUND(AVG(o.total_amount),2) AS average_order_value
  FROM customers c
  JOIN orders o
  ON c.customer_id=o.customer_id
  GROUP BY c.customer_type;`,
  },
  {
    id: 60,
    title: "Customer Revenue Rank Within Each City",
    difficulty: "Medium",
    slug: "sql-customer-revenue-rank-within-city",
    seoTitle: "SQL Interview Question | Customer Revenue Rank Within Each City",
    metaDescription: "Rank customers by revenue within each city using SQL window functions.",
    tags: ["SQL", "Interview", "RANK", "Window Functions", "JOIN"],
    description: "Rank customers based on their total revenue within each city.",
    explanation: "Aggregate revenue for each customer and use RANK() to rank them within every city.",
    scenario: "Regional managers want to compare customer performance city-wise.",
    useCases: [
      "Regional reporting",
      "Revenue analysis",
      "SQL interviews"
    ],
    hint: "Use RANK() OVER(PARTITION BY city ORDER BY revenue DESC).",
    starterQuery: `WITH CustomerRevenue AS (
  SELECT
  c.city,
  c.customer_id,
  SUM(o.total_amount) AS revenue
  FROM customers c
  JOIN orders o
  ON c.customer_id=o.customer_id
  GROUP BY c.city,c.customer_id
  )
  SELECT
  city,
  customer_id,
  revenue,
  RANK() OVER(
  PARTITION BY city
  ORDER BY revenue DESC
  ) AS revenue_rank
  FROM CustomerRevenue;`,
    expectedColumns: [
      "city",
      "customer_id",
      "revenue",
      "revenue_rank"
    ],
    solutionQuery: `WITH CustomerRevenue AS (
  SELECT
      c.city,
      c.customer_id,
      SUM(o.total_amount) AS revenue
  FROM customers c
  JOIN orders o
  ON c.customer_id=o.customer_id
  GROUP BY c.city,c.customer_id
  )
  SELECT
      city,
      customer_id,
      revenue,
      RANK() OVER(
          PARTITION BY city
          ORDER BY revenue DESC
      ) AS revenue_rank
  FROM CustomerRevenue;`,
  },
  {
    id: 61,
    title: "Top 3 Customers by Revenue in Each State",
    difficulty: "Hard",
    slug: "sql-top-3-customers-by-revenue-each-state",
    seoTitle: "SQL Hard Interview Question | Top 3 Customers by Revenue in Each State",
    metaDescription: "Find the top three customers by revenue in each state using SQL window functions.",
    tags: ["SQL", "Interview", "ROW_NUMBER", "CTE", "Window Functions"],
    description: "Find the top three customers with the highest total revenue in every state.",
    explanation: "Aggregate customer revenue and rank customers within each state using ROW_NUMBER().",
    scenario: "Regional sales managers want to identify their highest-value customers.",
    useCases: [
      "Regional sales analysis",
      "Customer analytics",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() partitioned by state.",
    starterQuery: `WITH CustomerRevenue AS (
  SELECT
  c.state,
  c.customer_id,
  SUM(o.total_amount) AS revenue,
  ROW_NUMBER() OVER(
  PARTITION BY c.state
  ORDER BY SUM(o.total_amount) DESC
  ) AS rn
  FROM customers c
  JOIN orders o
  ON c.customer_id=o.customer_id
  GROUP BY c.state,c.customer_id
  )
  SELECT
  state,
  customer_id,
  revenue
  FROM CustomerRevenue
  WHERE rn<=3;`,
    expectedColumns: [
      "state",
      "customer_id",
      "revenue"
    ],
    solutionQuery: `WITH CustomerRevenue AS (
  SELECT
      c.state,
      c.customer_id,
      SUM(o.total_amount) AS revenue,
      ROW_NUMBER() OVER(
          PARTITION BY c.state
          ORDER BY SUM(o.total_amount) DESC
      ) AS rn
  FROM customers c
  JOIN orders o
  ON c.customer_id=o.customer_id
  GROUP BY c.state,c.customer_id
  )
  SELECT
      state,
      customer_id,
      revenue
  FROM CustomerRevenue
  WHERE rn<=3;`,
  },
  {
    id: 62,
    title: "Longest Gap Between Customer Orders",
    difficulty: "Hard",
    slug: "sql-longest-gap-between-customer-orders",
    seoTitle: "SQL Hard Interview Question | Longest Gap Between Customer Orders",
    metaDescription: "Find the longest gap between consecutive customer orders.",
    tags: ["SQL", "Interview", "LAG", "Window Functions", "julianday"],
    description: "Find the maximum number of days between consecutive orders for every customer.",
    explanation: "Use LAG() to compare the current order date with the previous one and calculate the difference using julianday().",
    scenario: "The retention team wants to identify inactive periods for customers.",
    useCases: [
      "Customer retention",
      "Purchase behavior",
      "SQL interviews"
    ],
    hint: "Use LAG() and julianday().",
    starterQuery: `WITH OrderGap AS (
  SELECT
  customer_id,
  order_date,
  LAG(order_date) OVER(
  PARTITION BY customer_id
  ORDER BY order_date
  ) AS previous_order
  FROM orders
  )
  SELECT
  customer_id,
  MAX(julianday(order_date)-julianday(previous_order)) AS longest_gap_days
  FROM OrderGap
  WHERE previous_order IS NOT NULL
  GROUP BY customer_id;`,
    expectedColumns: [
      "customer_id",
      "longest_gap_days"
    ],
    solutionQuery: `WITH OrderGap AS (
  SELECT
      customer_id,
      order_date,
      LAG(order_date) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS previous_order
  FROM orders
  )
  SELECT
      customer_id,
      MAX(julianday(order_date)-julianday(previous_order)) AS longest_gap_days
  FROM OrderGap
  WHERE previous_order IS NOT NULL
  GROUP BY customer_id;`,
  },
  {
    id: 63,
    title: "Top Revenue Category in Each Month",
    difficulty: "Hard",
    slug: "sql-top-revenue-category-each-month",
    seoTitle: "SQL Hard Interview Question | Top Revenue Category in Each Month",
    metaDescription: "Find the highest revenue-generating product category for every month.",
    tags: ["SQL", "Interview", "CTE", "ROW_NUMBER", "Window Functions"],
    description: "Find the product category generating the highest revenue in each month.",
    explanation: "Calculate monthly category revenue and rank categories within each month.",
    scenario: "Management wants to know which category performed best every month.",
    useCases: [
      "Revenue reporting",
      "Business intelligence",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() partitioned by month.",
    starterQuery: `WITH MonthlyRevenue AS (
  SELECT
  strftime('%Y-%m',o.order_date) AS month,
  p.category,
  SUM(oi.quantity*oi.unit_price) AS revenue,
  ROW_NUMBER() OVER(
  PARTITION BY strftime('%Y-%m',o.order_date)
  ORDER BY SUM(oi.quantity*oi.unit_price) DESC
  ) AS rn
  FROM orders o
  JOIN order_items oi
  ON o.order_id=oi.order_id
  JOIN products p
  ON oi.product_id=p.product_id
  GROUP BY month,p.category
  )
  SELECT
  month,
  category,
  revenue
  FROM MonthlyRevenue
  WHERE rn=1;`,
    expectedColumns: [
      "month",
      "category",
      "revenue"
    ],
    solutionQuery: `WITH MonthlyRevenue AS (
  SELECT
      strftime('%Y-%m',o.order_date) AS month,
      p.category,
      SUM(oi.quantity*oi.unit_price) AS revenue,
      ROW_NUMBER() OVER(
          PARTITION BY strftime('%Y-%m',o.order_date)
          ORDER BY SUM(oi.quantity*oi.unit_price) DESC
      ) AS rn
  FROM orders o
  JOIN order_items oi
  ON o.order_id=oi.order_id
  JOIN products p
  ON oi.product_id=p.product_id
  GROUP BY month,p.category
  )
  SELECT
      month,
      category,
      revenue
  FROM MonthlyRevenue
  WHERE rn=1;`,
  },
  {
    id: 64,
    title: "Customers Whose Latest Order Is Their Largest",
    difficulty: "Hard",
    slug: "sql-customers-latest-order-largest",
    seoTitle: "SQL Hard Interview Question | Customers Whose Latest Order Is Their Largest",
    metaDescription: "Find customers whose latest order is also their highest-value order.",
    tags: ["SQL", "Interview", "ROW_NUMBER", "CTE", "Window Functions"],
    description: "Find customers whose most recent order has the highest order value.",
    explanation: "Rank orders by date and amount separately, then compare the rankings.",
    scenario: "The business wants to identify customers whose spending is increasing.",
    useCases: [
      "Customer behavior",
      "Revenue analysis",
      "SQL interviews"
    ],
    hint: "Use two ROW_NUMBER() calculations.",
    starterQuery: `WITH RankedOrders AS (
  SELECT
  customer_id,
  order_id,
  order_date,
  total_amount,
  ROW_NUMBER() OVER(
  PARTITION BY customer_id
  ORDER BY order_date DESC
  ) AS latest_rank,
  ROW_NUMBER() OVER(
  PARTITION BY customer_id
  ORDER BY total_amount DESC
  ) AS amount_rank
  FROM orders
  )
  SELECT
  customer_id,
  order_id,
  order_date,
  total_amount
  FROM RankedOrders
  WHERE latest_rank=1
  AND amount_rank=1;`,
    expectedColumns: [
      "customer_id",
      "order_id",
      "order_date",
      "total_amount"
    ],
    solutionQuery: `WITH RankedOrders AS (
  SELECT
      customer_id,
      order_id,
      order_date,
      total_amount,
      ROW_NUMBER() OVER(
          PARTITION BY customer_id
          ORDER BY order_date DESC
      ) AS latest_rank,
      ROW_NUMBER() OVER(
          PARTITION BY customer_id
          ORDER BY total_amount DESC
      ) AS amount_rank
  FROM orders
  )
  SELECT
      customer_id,
      order_id,
      order_date,
      total_amount
  FROM RankedOrders
  WHERE latest_rank=1
  AND amount_rank=1;`,
  },
  {
    id: 65,
    title: "Customers With Highest Revenue Growth Between Consecutive Orders",
    difficulty: "Hard",
    slug: "sql-customers-highest-revenue-growth-between-orders",
    seoTitle: "SQL Hard Interview Question | Customers With Highest Revenue Growth Between Consecutive Orders",
    metaDescription: "Find customers whose order amount increased the most between consecutive orders.",
    tags: ["SQL", "Interview", "CTE", "LAG", "Window Functions"],
    description: "Find the largest increase in order value between consecutive orders for each customer.",
    explanation: "Use LAG() to compare every order with the customer's previous order, calculate the increase, and return the maximum increase for each customer.",
    scenario: "The analytics team wants to identify customers whose spending has grown significantly over time.",
    useCases: [
      "Customer analytics",
      "Revenue growth",
      "SQL interviews"
    ],
    hint: "Use LAG() with julianday-independent calculations.",
    starterQuery: `WITH OrderHistory AS (
  SELECT
  customer_id,
  order_date,
  total_amount,
  LAG(total_amount) OVER(
  PARTITION BY customer_id
  ORDER BY order_date
  ) AS previous_amount
  FROM orders
  )
  SELECT
  customer_id,
  MAX(total_amount - previous_amount) AS highest_growth
  FROM OrderHistory
  WHERE previous_amount IS NOT NULL
  GROUP BY customer_id
  ORDER BY highest_growth DESC;`,
    expectedColumns: [
      "customer_id",
      "highest_growth"
    ],
    solutionQuery: `WITH OrderHistory AS (
  SELECT
      customer_id,
      order_date,
      total_amount,
      LAG(total_amount) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS previous_amount
  FROM orders
  )
  SELECT
      customer_id,
      MAX(total_amount - previous_amount) AS highest_growth
  FROM OrderHistory
  WHERE previous_amount IS NOT NULL
  GROUP BY customer_id
  ORDER BY highest_growth DESC;`,
  },
  {
    id: 66,
    title: "Customers With Consecutive Increasing Order Values",
    difficulty: "Hard",
    slug: "sql-customers-consecutive-increasing-order-values",
    seoTitle: "SQL Hard Interview Question | Customers With Consecutive Increasing Order Values",
    metaDescription: "Find customers whose order value increased compared to their previous order.",
    tags: ["SQL", "Interview", "LAG", "Window Functions"],
    description: "Find every order where the customer spent more than on their previous order.",
    explanation: "Use LAG() to compare each order amount with the previous order amount.",
    scenario: "The business wants to identify customers whose spending trend is increasing.",
    useCases: [
      "Customer analytics",
      "Revenue trends",
      "SQL interviews"
    ],
    hint: "Compare total_amount with LAG(total_amount).",
    starterQuery: `WITH CustomerOrders AS (
  SELECT
  customer_id,
  order_id,
  order_date,
  total_amount,
  LAG(total_amount) OVER(
  PARTITION BY customer_id
  ORDER BY order_date
  ) AS previous_amount
  FROM orders
  )
  SELECT
  customer_id,
  order_id,
  order_date,
  previous_amount,
  total_amount
  FROM CustomerOrders
  WHERE total_amount > previous_amount;`,
    expectedColumns: [
      "customer_id",
      "order_id",
      "order_date",
      "previous_amount",
      "total_amount"
    ],
    solutionQuery: `WITH CustomerOrders AS (
  SELECT
      customer_id,
      order_id,
      order_date,
      total_amount,
      LAG(total_amount) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS previous_amount
  FROM orders
  )
  SELECT
      customer_id,
      order_id,
      order_date,
      previous_amount,
      total_amount
  FROM CustomerOrders
  WHERE total_amount > previous_amount;`,
  },
  {
    id: 67,
    title: "Customers With Highest Cancelled Order Rate",
    difficulty: "Hard",
    slug: "sql-customers-highest-cancelled-order-rate",
    seoTitle: "SQL Hard Interview Question | Highest Cancelled Order Rate",
    metaDescription: "Find customers having the highest percentage of cancelled orders.",
    tags: ["SQL", "Interview", "CASE", "Aggregation"],
    description: "Calculate the cancellation rate for every customer.",
    explanation: "Divide cancelled orders by total orders using conditional aggregation.",
    scenario: "Customer support wants to identify customers experiencing frequent cancellations.",
    useCases: [
      "Customer analytics",
      "Order quality",
      "SQL interviews"
    ],
    hint: "Use SUM(CASE...) and COUNT(*).",
    starterQuery: `SELECT
  customer_id,
  ROUND(
  100.0 * SUM(CASE WHEN order_status='cancelled' THEN 1 ELSE 0 END) / COUNT(*),
  2
  ) AS cancellation_rate
  FROM orders
  GROUP BY customer_id
  ORDER BY cancellation_rate DESC;`,
    expectedColumns: [
      "customer_id",
      "cancellation_rate"
    ],
    solutionQuery: `SELECT
      customer_id,
      ROUND(
          100.0 * SUM(CASE WHEN order_status='cancelled' THEN 1 ELSE 0 END) / COUNT(*),
          2
      ) AS cancellation_rate
  FROM orders
  GROUP BY customer_id
  ORDER BY cancellation_rate DESC;`,
  },
  {
    id: 68,
    title: "Highest Revenue Order for Every Customer",
    difficulty: "Hard",
    slug: "sql-highest-revenue-order-per-customer",
    seoTitle: "SQL Hard Interview Question | Highest Revenue Order Per Customer",
    metaDescription: "Find each customer's highest revenue order.",
    tags: ["SQL", "Interview", "ROW_NUMBER", "Window Functions"],
    description: "Return the highest-value order placed by every customer.",
    explanation: "Rank customer orders by total_amount and return the first row.",
    scenario: "Sales wants to review each customer's biggest purchase.",
    useCases: [
      "Sales analysis",
      "Customer insights",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() ordered by total_amount DESC.",
    starterQuery: `WITH RankedOrders AS (
  SELECT
  customer_id,
  order_id,
  total_amount,
  ROW_NUMBER() OVER(
  PARTITION BY customer_id
  ORDER BY total_amount DESC
  ) AS rn
  FROM orders
  )
  SELECT
  customer_id,
  order_id,
  total_amount
  FROM RankedOrders
  WHERE rn=1;`,
    expectedColumns: [
      "customer_id",
      "order_id",
      "total_amount"
    ],
    solutionQuery: `WITH RankedOrders AS (
  SELECT
      customer_id,
      order_id,
      total_amount,
      ROW_NUMBER() OVER(
          PARTITION BY customer_id
          ORDER BY total_amount DESC
      ) AS rn
  FROM orders
  )
  SELECT
      customer_id,
      order_id,
      total_amount
  FROM RankedOrders
  WHERE rn=1;`,
  },
  {
    id: 69,
    title: "Customers Whose Latest Order Was Cancelled",
    difficulty: "Hard",
    slug: "sql-customers-latest-order-cancelled",
    seoTitle: "SQL Hard Interview Question | Latest Order Cancelled",
    metaDescription: "Find customers whose most recent order was cancelled.",
    tags: ["SQL", "Interview", "ROW_NUMBER", "CTE"],
    description: "Return customers whose latest order has a status of cancelled.",
    explanation: "Rank orders by date and return the latest cancelled order.",
    scenario: "Support wants to proactively contact customers whose most recent order failed.",
    useCases: [
      "Customer support",
      "Order management",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() ordered by order_date DESC.",
    starterQuery: `WITH LatestOrders AS (
  SELECT
  customer_id,
  order_id,
  order_status,
  ROW_NUMBER() OVER(
  PARTITION BY customer_id
  ORDER BY order_date DESC
  ) AS rn
  FROM orders
  )
  SELECT
  customer_id,
  order_id
  FROM LatestOrders
  WHERE rn=1
  AND order_status='cancelled';`,
    expectedColumns: [
      "customer_id",
      "order_id"
    ],
    solutionQuery: `WITH LatestOrders AS (
  SELECT
      customer_id,
      order_id,
      order_status,
      ROW_NUMBER() OVER(
          PARTITION BY customer_id
          ORDER BY order_date DESC
      ) AS rn
  FROM orders
  )
  SELECT
      customer_id,
      order_id
  FROM LatestOrders
  WHERE rn=1
  AND order_status='cancelled';`,
  },
  {
    id: 70,
    title: "Top Revenue Customer in Each Customer Type",
    difficulty: "Hard",
    slug: "sql-top-revenue-customer-each-customer-type",
    seoTitle: "SQL Hard Interview Question | Top Revenue Customer in Each Customer Type",
    metaDescription: "Find the highest revenue customer within every customer type.",
    tags: ["SQL", "Interview", "ROW_NUMBER", "JOIN", "CTE"],
    description: "Find the customer generating the highest revenue in each customer type.",
    explanation: "Aggregate customer revenue and rank customers within each customer type.",
    scenario: "Marketing wants to identify the best-performing customer in each segment.",
    useCases: [
      "Customer segmentation",
      "Revenue reporting",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() partitioned by customer_type.",
    starterQuery: `WITH CustomerRevenue AS (
  SELECT
  c.customer_type,
  c.customer_id,
  SUM(o.total_amount) AS revenue,
  ROW_NUMBER() OVER(
  PARTITION BY c.customer_type
  ORDER BY SUM(o.total_amount) DESC
  ) AS rn
  FROM customers c
  JOIN orders o
  ON c.customer_id=o.customer_id
  GROUP BY c.customer_type,c.customer_id
  )
  SELECT
  customer_type,
  customer_id,
  revenue
  FROM CustomerRevenue
  WHERE rn=1;`,
    expectedColumns: [
      "customer_type",
      "customer_id",
      "revenue"
    ],
    solutionQuery: `WITH CustomerRevenue AS (
  SELECT
      c.customer_type,
      c.customer_id,
      SUM(o.total_amount) AS revenue,
      ROW_NUMBER() OVER(
          PARTITION BY c.customer_type
          ORDER BY SUM(o.total_amount) DESC
      ) AS rn
  FROM customers c
  JOIN orders o
  ON c.customer_id=o.customer_id
  GROUP BY c.customer_type,c.customer_id
  )
  SELECT
      customer_type,
      customer_id,
      revenue
  FROM CustomerRevenue
  WHERE rn=1;`,
  },
  {
    id: 71,
    title: "Monthly Revenue Difference From Previous Month",
    difficulty: "Hard",
    slug: "sql-monthly-revenue-difference-previous-month",
    seoTitle: "SQL Hard Interview Question | Monthly Revenue Difference From Previous Month",
    metaDescription: "Calculate the month-over-month revenue difference using SQL window functions.",
    tags: ["SQL", "Interview", "LAG", "CTE", "Window Functions"],
    description: "Calculate the revenue difference between the current month and the previous month.",
    explanation: "Aggregate monthly revenue, then use LAG() to compare it with the previous month's revenue.",
    scenario: "Finance wants to analyze month-over-month revenue changes.",
    useCases: [
      "Revenue reporting",
      "Business intelligence",
      "SQL interviews"
    ],
    hint: "Aggregate first, then apply LAG().",
    starterQuery: `WITH MonthlyRevenue AS (
  SELECT
  strftime('%Y-%m', order_date) AS month,
  SUM(total_amount) AS revenue
  FROM orders
  GROUP BY month
  )
  SELECT
  month,
  revenue,
  revenue - LAG(revenue) OVER(ORDER BY month) AS revenue_difference
  FROM MonthlyRevenue;`,
    expectedColumns: [
      "month",
      "revenue",
      "revenue_difference"
    ],
    solutionQuery: `WITH MonthlyRevenue AS (
  SELECT
      strftime('%Y-%m', order_date) AS month,
      SUM(total_amount) AS revenue
  FROM orders
  GROUP BY month
  )
  SELECT
      month,
      revenue,
      revenue - LAG(revenue) OVER(ORDER BY month) AS revenue_difference
  FROM MonthlyRevenue;`,
  },
  {
    id: 72,
    title: "Longest Order Streak Per Customer",
    difficulty: "Hard",
    slug: "sql-longest-order-streak-per-customer",
    seoTitle: "SQL Hard Interview Question | Longest Order Streak Per Customer",
    metaDescription: "Find customers with the highest number of consecutive ordering days.",
    tags: ["SQL", "Interview", "ROW_NUMBER", "CTE", "Date Functions"],
    description: "Find consecutive daily ordering streaks for every customer.",
    explanation: "Create groups of consecutive dates using ROW_NUMBER() and julianday(), then count each streak.",
    scenario: "The engagement team wants to identify highly active customers.",
    useCases: [
      "Customer engagement",
      "Behavior analysis",
      "SQL interviews"
    ],
    hint: "Subtract ROW_NUMBER() from julianday(order_date).",
    starterQuery: `WITH DailyOrders AS (
  SELECT DISTINCT
  customer_id,
  date(order_date) AS order_day
  FROM orders
  ),
  Groups AS (
  SELECT
  customer_id,
  order_day,
  julianday(order_day) -
  ROW_NUMBER() OVER(
  PARTITION BY customer_id
  ORDER BY order_day
  ) AS grp
  FROM DailyOrders
  )
  SELECT
  customer_id,
  COUNT(*) AS streak_days
  FROM Groups
  GROUP BY customer_id, grp
  ORDER BY streak_days DESC;`,
    expectedColumns: [
      "customer_id",
      "streak_days"
    ],
    solutionQuery: `WITH DailyOrders AS (
  SELECT DISTINCT
      customer_id,
      date(order_date) AS order_day
  FROM orders
  ),
  Groups AS (
  SELECT
      customer_id,
      order_day,
      julianday(order_day) -
      ROW_NUMBER() OVER(
          PARTITION BY customer_id
          ORDER BY order_day
      ) AS grp
  FROM DailyOrders
  )
  SELECT
      customer_id,
      COUNT(*) AS streak_days
  FROM Groups
  GROUP BY customer_id, grp
  ORDER BY streak_days DESC;`,
  },
  {
    id: 73,
    title: "Top Revenue Brand in Each Category",
    difficulty: "Hard",
    slug: "sql-top-revenue-brand-each-category",
    seoTitle: "SQL Hard Interview Question | Top Revenue Brand in Each Category",
    metaDescription: "Find the highest revenue brand within every product category.",
    tags: ["SQL", "Interview", "ROW_NUMBER", "JOIN", "CTE"],
    description: "Find the top revenue-generating brand for each category.",
    explanation: "Aggregate revenue by category and brand, then rank the brands.",
    scenario: "Category managers want to know the best-performing brand in each category.",
    useCases: [
      "Sales reporting",
      "Product analytics",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() partitioned by category.",
    starterQuery: `WITH BrandRevenue AS (
  SELECT
  p.category,
  p.brand,
  SUM(oi.quantity * oi.unit_price) AS revenue,
  ROW_NUMBER() OVER(
  PARTITION BY p.category
  ORDER BY SUM(oi.quantity * oi.unit_price) DESC
  ) AS rn
  FROM products p
  JOIN order_items oi
  ON p.product_id = oi.product_id
  GROUP BY p.category, p.brand
  )
  SELECT
  category,
  brand,
  revenue
  FROM BrandRevenue
  WHERE rn = 1;`,
    expectedColumns: [
      "category",
      "brand",
      "revenue"
    ],
    solutionQuery: `WITH BrandRevenue AS (
  SELECT
      p.category,
      p.brand,
      SUM(oi.quantity * oi.unit_price) AS revenue,
      ROW_NUMBER() OVER(
          PARTITION BY p.category
          ORDER BY SUM(oi.quantity * oi.unit_price) DESC
      ) AS rn
  FROM products p
  JOIN order_items oi
  ON p.product_id = oi.product_id
  GROUP BY p.category, p.brand
  )
  SELECT
      category,
      brand,
      revenue
  FROM BrandRevenue
  WHERE rn = 1;`,
  },
  {
    id: 74,
    title: "Customers Spending Above Their Own Average",
    difficulty: "Hard",
    slug: "sql-customers-spending-above-own-average",
    seoTitle: "SQL Hard Interview Question | Orders Above Customer Average",
    metaDescription: "Find orders where the customer spent more than their own average order value.",
    tags: ["SQL", "Interview", "CTE", "AVG", "JOIN"],
    description: "Return orders whose value is greater than the customer's average order amount.",
    explanation: "Calculate each customer's average order amount and compare every order against it.",
    scenario: "The business wants to identify unusually high-value purchases.",
    useCases: [
      "Customer analytics",
      "Fraud detection",
      "SQL interviews"
    ],
    hint: "Calculate averages in a CTE and join back.",
    starterQuery: `WITH CustomerAverage AS (
  SELECT
  customer_id,
  AVG(total_amount) AS avg_order
  FROM orders
  GROUP BY customer_id
  )
  SELECT
  o.customer_id,
  o.order_id,
  o.total_amount,
  ca.avg_order
  FROM orders o
  JOIN CustomerAverage ca
  ON o.customer_id = ca.customer_id
  WHERE o.total_amount > ca.avg_order;`,
    expectedColumns: [
      "customer_id",
      "order_id",
      "total_amount",
      "avg_order"
    ],
    solutionQuery: `WITH CustomerAverage AS (
  SELECT
      customer_id,
      AVG(total_amount) AS avg_order
  FROM orders
  GROUP BY customer_id
  )
  SELECT
      o.customer_id,
      o.order_id,
      o.total_amount,
      ca.avg_order
  FROM orders o
  JOIN CustomerAverage ca
  ON o.customer_id = ca.customer_id
  WHERE o.total_amount > ca.avg_order;`,
  },
  {
    id: 75,
    title: "Top 2 Products by Quantity Sold in Each Category",
    difficulty: "Hard",
    slug: "sql-top-2-products-by-quantity-each-category",
    seoTitle: "SQL Hard Interview Question | Top 2 Products by Quantity Sold",
    metaDescription: "Find the top two selling products by quantity in each category.",
    tags: ["SQL", "Interview", "ROW_NUMBER", "JOIN", "Window Functions"],
    description: "Return the two products with the highest quantity sold in every category.",
    explanation: "Aggregate quantities sold, rank products within each category, and return the top two.",
    scenario: "Inventory managers want to identify the most popular products in every category.",
    useCases: [
      "Inventory planning",
      "Sales reporting",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() partitioned by category.",
    starterQuery: `WITH ProductSales AS (
  SELECT
  p.category,
  p.product_id,
  p.product_name,
  SUM(oi.quantity) AS total_quantity,
  ROW_NUMBER() OVER(
  PARTITION BY p.category
  ORDER BY SUM(oi.quantity) DESC
  ) AS rn
  FROM products p
  JOIN order_items oi
  ON p.product_id = oi.product_id
  GROUP BY p.category, p.product_id, p.product_name
  )
  SELECT
  category,
  product_id,
  product_name,
  total_quantity
  FROM ProductSales
  WHERE rn <= 2;`,
    expectedColumns: [
      "category",
      "product_id",
      "product_name",
      "total_quantity"
    ],
    solutionQuery: `WITH ProductSales AS (
  SELECT
      p.category,
      p.product_id,
      p.product_name,
      SUM(oi.quantity) AS total_quantity,
      ROW_NUMBER() OVER(
          PARTITION BY p.category
          ORDER BY SUM(oi.quantity) DESC
      ) AS rn
  FROM products p
  JOIN order_items oi
  ON p.product_id = oi.product_id
  GROUP BY p.category, p.product_id, p.product_name
  )
  SELECT
      category,
      product_id,
      product_name,
      total_quantity
  FROM ProductSales
  WHERE rn <= 2;`,
  },
  {
    id: 76,
    title: "Customers With the Largest Increase Between Consecutive Orders",
    difficulty: "Hard",
    slug: "sql-largest-increase-between-consecutive-orders",
    seoTitle: "SQL Hard Interview Question | Largest Increase Between Consecutive Orders",
    metaDescription: "Find the largest increase in order value between consecutive orders for each customer.",
    tags: ["SQL", "Interview", "LAG", "CTE", "Window Functions"],
    description: "Find the maximum increase in order value between two consecutive orders for every customer.",
    explanation: "Use LAG() to compare each order with the previous order and calculate the increase. Return the largest increase for each customer.",
    scenario: "The analytics team wants to identify customers whose spending increased significantly over time.",
    useCases: [
      "Customer analytics",
      "Revenue growth",
      "SQL interviews"
    ],
    hint: "Calculate the difference using LAG(), then use MAX().",
    starterQuery: `WITH OrderGrowth AS (
  SELECT
  customer_id,
  order_id,
  order_date,
  total_amount,
  total_amount - LAG(total_amount) OVER(
  PARTITION BY customer_id
  ORDER BY order_date
  ) AS growth
  FROM orders
  )
  SELECT
  customer_id,
  MAX(growth) AS highest_growth
  FROM OrderGrowth
  WHERE growth IS NOT NULL
  GROUP BY customer_id
  ORDER BY highest_growth DESC;`,
    expectedColumns: [
      "customer_id",
      "highest_growth"
    ],
    solutionQuery: `WITH OrderGrowth AS (
  SELECT
      customer_id,
      order_id,
      order_date,
      total_amount,
      total_amount - LAG(total_amount) OVER(
          PARTITION BY customer_id
          ORDER BY order_date
      ) AS growth
  FROM orders
  )
  SELECT
      customer_id,
      MAX(growth) AS highest_growth
  FROM OrderGrowth
  WHERE growth IS NOT NULL
  GROUP BY customer_id
  ORDER BY highest_growth DESC;`,
  },
  {
    id: 77,
    title: "Customers With Highest Average Delivery Time",
    difficulty: "Hard",
    slug: "sql-customers-highest-average-delivery-time",
    seoTitle: "SQL Hard Interview Question | Highest Average Delivery Time",
    metaDescription: "Find customers whose delivered orders have the highest average delivery time.",
    tags: ["SQL", "Interview", "AVG", "julianday", "GROUP BY"],
    description: "Calculate the average delivery time for each customer.",
    explanation: "Use julianday() to calculate delivery duration for delivered orders.",
    scenario: "Operations wants to identify customers facing longer delivery times.",
    useCases: [
      "Delivery analytics",
      "Operations reporting",
      "SQL interviews"
    ],
    hint: "Use julianday(delivered_date)-julianday(order_date).",
    starterQuery: `SELECT
  customer_id,
  ROUND(AVG(julianday(delivered_date)-julianday(order_date)),2) AS avg_delivery_days
  FROM orders
  WHERE delivered_date IS NOT NULL
  GROUP BY customer_id
  ORDER BY avg_delivery_days DESC;`,
    expectedColumns: [
      "customer_id",
      "avg_delivery_days"
    ],
    solutionQuery: `SELECT
      customer_id,
      ROUND(AVG(julianday(delivered_date)-julianday(order_date)),2) AS avg_delivery_days
  FROM orders
  WHERE delivered_date IS NOT NULL
  GROUP BY customer_id
  ORDER BY avg_delivery_days DESC;`,
  },
  {
    id: 78,
    title: "Top 3 Products Purchased by Each Customer",
    difficulty: "Hard",
    slug: "sql-top-3-products-purchased-by-each-customer",
    seoTitle: "SQL Hard Interview Question | Top 3 Products Purchased By Each Customer",
    metaDescription: "Find each customer's three most frequently purchased products.",
    tags: ["SQL", "Interview", "ROW_NUMBER", "JOIN", "Window Functions"],
    description: "Return the three most purchased products for every customer.",
    explanation: "Aggregate purchase quantity by customer and product, then rank within each customer.",
    scenario: "Recommendation systems use this information to personalize suggestions.",
    useCases: [
      "Recommendation engine",
      "Customer analytics",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() partitioned by customer.",
    starterQuery: `WITH ProductSales AS (
  SELECT
  o.customer_id,
  p.product_id,
  p.product_name,
  SUM(oi.quantity) AS quantity_sold,
  ROW_NUMBER() OVER(
  PARTITION BY o.customer_id
  ORDER BY SUM(oi.quantity) DESC
  ) AS rn
  FROM orders o
  JOIN order_items oi ON o.order_id=oi.order_id
  JOIN products p ON oi.product_id=p.product_id
  GROUP BY o.customer_id,p.product_id,p.product_name
  )
  SELECT
  customer_id,
  product_id,
  product_name,
  quantity_sold
  FROM ProductSales
  WHERE rn<=3;`,
    expectedColumns: [
      "customer_id",
      "product_id",
      "product_name",
      "quantity_sold"
    ],
    solutionQuery: `WITH ProductSales AS (
  SELECT
      o.customer_id,
      p.product_id,
      p.product_name,
      SUM(oi.quantity) AS quantity_sold,
      ROW_NUMBER() OVER(
          PARTITION BY o.customer_id
          ORDER BY SUM(oi.quantity) DESC
      ) AS rn
  FROM orders o
  JOIN order_items oi ON o.order_id=oi.order_id
  JOIN products p ON oi.product_id=p.product_id
  GROUP BY o.customer_id,p.product_id,p.product_name
  )
  SELECT
      customer_id,
      product_id,
      product_name,
      quantity_sold
  FROM ProductSales
  WHERE rn<=3;`,
  },
  {
    id: 79,
    title: "Revenue Contribution of Each Category",
    difficulty: "Hard",
    slug: "sql-revenue-contribution-each-category",
    seoTitle: "SQL Hard Interview Question | Revenue Contribution by Category",
    metaDescription: "Calculate the percentage contribution of every product category to total revenue.",
    tags: ["SQL", "Interview", "CTE", "SUM", "Percentage"],
    description: "Calculate how much each product category contributes to the total revenue.",
    explanation: "Calculate category revenue first, then divide by overall revenue.",
    scenario: "Management wants to understand revenue distribution across product categories.",
    useCases: [
      "Business reporting",
      "Revenue analysis",
      "SQL interviews"
    ],
    hint: "Use a CTE for category totals.",
    starterQuery: `WITH CategoryRevenue AS (
  SELECT
  p.category,
  SUM(oi.quantity*oi.unit_price) AS revenue
  FROM products p
  JOIN order_items oi
  ON p.product_id=oi.product_id
  GROUP BY p.category
  )
  SELECT
  category,
  revenue,
  ROUND(
  100.0*revenue/(SELECT SUM(revenue) FROM CategoryRevenue),
  2
  ) AS contribution_percentage
  FROM CategoryRevenue
  ORDER BY contribution_percentage DESC;`,
    expectedColumns: [
      "category",
      "revenue",
      "contribution_percentage"
    ],
    solutionQuery: `WITH CategoryRevenue AS (
  SELECT
      p.category,
      SUM(oi.quantity*oi.unit_price) AS revenue
  FROM products p
  JOIN order_items oi
  ON p.product_id=oi.product_id
  GROUP BY p.category
  )
  SELECT
      category,
      revenue,
      ROUND(
          100.0*revenue/(SELECT SUM(revenue) FROM CategoryRevenue),
          2
      ) AS contribution_percentage
  FROM CategoryRevenue
  ORDER BY contribution_percentage DESC;`,
  },
  {
    id: 80,
    title: "Customers With the Largest Single Order in Each State",
    difficulty: "Hard",
    slug: "sql-largest-single-order-each-state",
    seoTitle: "SQL Hard Interview Question | Largest Single Order in Each State",
    metaDescription: "Find the customer with the largest single order in every state.",
    tags: ["SQL", "Interview", "ROW_NUMBER", "JOIN", "CTE"],
    description: "Return the highest-value individual order from each state.",
    explanation: "Join customers with orders and rank orders by value within each state.",
    scenario: "Regional sales managers want to identify the largest individual purchase made in each state.",
    useCases: [
      "Regional reporting",
      "Sales analysis",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() partitioned by state.",
    starterQuery: `WITH RankedOrders AS (
  SELECT
  c.state,
  o.customer_id,
  o.order_id,
  o.total_amount,
  ROW_NUMBER() OVER(
  PARTITION BY c.state
  ORDER BY o.total_amount DESC
  ) AS rn
  FROM customers c
  JOIN orders o
  ON c.customer_id=o.customer_id
  )
  SELECT
  state,
  customer_id,
  order_id,
  total_amount
  FROM RankedOrders
  WHERE rn=1;`,
    expectedColumns: [
      "state",
      "customer_id",
      "order_id",
      "total_amount"
    ],
    solutionQuery: `WITH RankedOrders AS (
  SELECT
      c.state,
      o.customer_id,
      o.order_id,
      o.total_amount,
      ROW_NUMBER() OVER(
          PARTITION BY c.state
          ORDER BY o.total_amount DESC
      ) AS rn
  FROM customers c
  JOIN orders o
  ON c.customer_id=o.customer_id
  )
  SELECT
      state,
      customer_id,
      order_id,
      total_amount
  FROM RankedOrders
  WHERE rn=1;`,
  },
  {
    id: 81,
    title: "Monthly Revenue Rank",
    difficulty: "Hard",
    slug: "sql-monthly-revenue-rank",
    seoTitle: "SQL Hard Interview Question | Monthly Revenue Rank",
    metaDescription: "Rank months based on total revenue using SQL window functions.",
    tags: ["SQL", "Interview", "RANK", "Window Functions", "CTE"],
    description: "Rank each month according to its total revenue.",
    explanation: "Aggregate monthly revenue first, then use RANK() to rank months from highest to lowest revenue.",
    scenario: "Finance wants to compare monthly business performance.",
    useCases: [
      "Revenue reporting",
      "Business intelligence",
      "SQL interviews"
    ],
    hint: "Aggregate first, then apply RANK().",
    starterQuery: `WITH MonthlyRevenue AS (
  SELECT
  strftime('%Y-%m', order_date) AS month,
  SUM(total_amount) AS revenue
  FROM orders
  GROUP BY month
  )
  SELECT
  month,
  revenue,
  RANK() OVER(
  ORDER BY revenue DESC
  ) AS revenue_rank
  FROM MonthlyRevenue;`,
    expectedColumns: [
      "month",
      "revenue",
      "revenue_rank"
    ],
    solutionQuery: `WITH MonthlyRevenue AS (
  SELECT
      strftime('%Y-%m', order_date) AS month,
      SUM(total_amount) AS revenue
  FROM orders
  GROUP BY month
  )
  SELECT
      month,
      revenue,
      RANK() OVER(
          ORDER BY revenue DESC
      ) AS revenue_rank
  FROM MonthlyRevenue;`,
  },
  {
    id: 82,
    title: "Top Revenue Day for Each Month",
    difficulty: "Hard",
    slug: "sql-top-revenue-day-each-month",
    seoTitle: "SQL Hard Interview Question | Top Revenue Day for Each Month",
    metaDescription: "Find the highest revenue day in every month.",
    tags: ["SQL", "Interview", "ROW_NUMBER", "CTE", "Window Functions"],
    description: "Return the day that generated the highest revenue in each month.",
    explanation: "Calculate daily revenue and rank each day within its month.",
    scenario: "The finance team wants to identify the strongest sales day every month.",
    useCases: [
      "Sales reporting",
      "Revenue analysis",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() partitioned by month.",
    starterQuery: `WITH DailyRevenue AS (
  SELECT
  strftime('%Y-%m', order_date) AS month,
  date(order_date) AS order_day,
  SUM(total_amount) AS revenue,
  ROW_NUMBER() OVER(
  PARTITION BY strftime('%Y-%m', order_date)
  ORDER BY SUM(total_amount) DESC
  ) AS rn
  FROM orders
  GROUP BY month,order_day
  )
  SELECT
  month,
  order_day,
  revenue
  FROM DailyRevenue
  WHERE rn=1;`,
    expectedColumns: [
      "month",
      "order_day",
      "revenue"
    ],
    solutionQuery: `WITH DailyRevenue AS (
  SELECT
      strftime('%Y-%m', order_date) AS month,
      date(order_date) AS order_day,
      SUM(total_amount) AS revenue,
      ROW_NUMBER() OVER(
          PARTITION BY strftime('%Y-%m', order_date)
          ORDER BY SUM(total_amount) DESC
      ) AS rn
  FROM orders
  GROUP BY month,order_day
  )
  SELECT
      month,
      order_day,
      revenue
  FROM DailyRevenue
  WHERE rn=1;`,
  },
  {
    id: 83,
    title: "Products Purchased Together Most Often",
    difficulty: "Hard",
    slug: "sql-products-purchased-together-most-often",
    seoTitle: "SQL Hard Interview Question | Products Purchased Together",
    metaDescription: "Find pairs of products that appear together in the same orders most frequently.",
    tags: ["SQL", "Interview", "Self Join", "GROUP BY"],
    description: "Find product pairs that are purchased together most frequently.",
    explanation: "Self join order_items on order_id and count unique product pairs.",
    scenario: "Recommendation systems use frequently purchased-together products.",
    useCases: [
      "Market basket analysis",
      "Recommendations",
      "SQL interviews"
    ],
    hint: "Self join order_items using order_id.",
    starterQuery: `SELECT
  oi1.product_id AS product1,
  oi2.product_id AS product2,
  COUNT(*) AS times_purchased_together
  FROM order_items oi1
  JOIN order_items oi2
  ON oi1.order_id=oi2.order_id
  AND oi1.product_id<oi2.product_id
  GROUP BY oi1.product_id,oi2.product_id
  ORDER BY times_purchased_together DESC;`,
    expectedColumns: [
      "product1",
      "product2",
      "times_purchased_together"
    ],
    solutionQuery: `SELECT
      oi1.product_id AS product1,
      oi2.product_id AS product2,
      COUNT(*) AS times_purchased_together
  FROM order_items oi1
  JOIN order_items oi2
  ON oi1.order_id=oi2.order_id
  AND oi1.product_id<oi2.product_id
  GROUP BY oi1.product_id,oi2.product_id
  ORDER BY times_purchased_together DESC;`,
  },
  {
    id: 84,
    title: "Customers With Revenue Above Monthly Average",
    difficulty: "Hard",
    slug: "sql-customers-revenue-above-monthly-average",
    seoTitle: "SQL Hard Interview Question | Revenue Above Monthly Average",
    metaDescription: "Find customers whose monthly revenue exceeds the monthly average.",
    tags: ["SQL", "Interview", "CTE", "AVG", "JOIN"],
    description: "Find customer-month combinations where revenue is above the month's average customer revenue.",
    explanation: "Calculate customer revenue by month, then compare it with the average revenue for that month.",
    scenario: "Business wants to identify high-value customers every month.",
    useCases: [
      "Revenue analysis",
      "Customer segmentation",
      "SQL interviews"
    ],
    hint: "Use two CTEs and join them.",
    starterQuery: `WITH CustomerRevenue AS (
  SELECT
  strftime('%Y-%m',order_date) AS month,
  customer_id,
  SUM(total_amount) AS revenue
  FROM orders
  GROUP BY month,customer_id
  ),
  MonthlyAverage AS (
  SELECT
  month,
  AVG(revenue) AS avg_revenue
  FROM CustomerRevenue
  GROUP BY month
  )
  SELECT
  cr.month,
  cr.customer_id,
  cr.revenue
  FROM CustomerRevenue cr
  JOIN MonthlyAverage ma
  ON cr.month=ma.month
  WHERE cr.revenue>ma.avg_revenue;`,
    expectedColumns: [
      "month",
      "customer_id",
      "revenue"
    ],
    solutionQuery: `WITH CustomerRevenue AS (
  SELECT
      strftime('%Y-%m',order_date) AS month,
      customer_id,
      SUM(total_amount) AS revenue
  FROM orders
  GROUP BY month,customer_id
  ),
  MonthlyAverage AS (
  SELECT
      month,
      AVG(revenue) AS avg_revenue
  FROM CustomerRevenue
  GROUP BY month
  )
  SELECT
      cr.month,
      cr.customer_id,
      cr.revenue
  FROM CustomerRevenue cr
  JOIN MonthlyAverage ma
  ON cr.month=ma.month
  WHERE cr.revenue>ma.avg_revenue;`,
  },
  {
    id: 85,
    title: "Payment Success Rate by Payment Method",
    difficulty: "Hard",
    slug: "sql-payment-success-rate-by-payment-method",
    seoTitle: "SQL Hard Interview Question | Payment Success Rate by Payment Method",
    metaDescription: "Calculate the payment success rate for each payment method using SQL aggregation and conditional counting.",
    tags: ["SQL", "Interview", "Payments", "CASE", "Aggregation"],
    description: "Calculate the payment success rate for every payment method. Return the payment method, total payment attempts, successful payments, and success rate percentage.",
    explanation: "Group payments by payment_method and use conditional aggregation to count successful payments. Divide successful payments by total attempts to calculate the success rate.",
    scenario: "The finance team wants to evaluate which payment methods have the highest success rate.",
    useCases: [
      "Payment analytics",
      "Transaction monitoring",
      "Finance reporting",
      "SQL interviews"
    ],
    hint: "Use COUNT(*) and SUM(CASE WHEN payment_status='Success' THEN 1 ELSE 0 END).",
    starterQuery: `SELECT
  payment_method,
  COUNT(*) AS total_attempts,
  SUM(CASE
  WHEN payment_status='Success' THEN 1
  ELSE 0
  END) AS successful_payments,
  ROUND(
  100.0 * SUM(CASE
  WHEN payment_status='Success' THEN 1
  ELSE 0
  END) / COUNT(*),
  2
  ) AS success_rate
  FROM payments
  GROUP BY payment_method
  ORDER BY success_rate DESC;`,
    expectedColumns: [
      "payment_method",
      "total_attempts",
      "successful_payments",
      "success_rate"
    ],
    solutionQuery: `SELECT
      payment_method,
      COUNT(*) AS total_attempts,
      SUM(CASE
          WHEN payment_status='Success' THEN 1
          ELSE 0
      END) AS successful_payments,
      ROUND(
          100.0 * SUM(CASE
              WHEN payment_status='Success' THEN 1
              ELSE 0
          END) / COUNT(*),
          2
      ) AS success_rate
  FROM payments
  GROUP BY payment_method
  ORDER BY success_rate DESC;`
  },
  {
    id: 86,
    title: "Orders With Multiple Payment Attempts",
    difficulty: "Hard",
    slug: "sql-orders-with-multiple-payment-attempts",
    seoTitle: "SQL Hard Interview Question | Orders With Multiple Payment Attempts",
    metaDescription: "Find orders that required multiple payment attempts before completion.",
    tags: ["SQL", "Interview", "Payments", "HAVING", "Aggregation"],
    description: "Find orders that have more than one payment attempt. Return the order ID, number of attempts, and latest payment date.",
    explanation: "Group payment records by order and use HAVING to identify orders with multiple attempts.",
    scenario: "Payment teams want to investigate orders that experienced payment issues.",
    useCases: [
      "Fraud detection",
      "Payment monitoring",
      "Operational analytics",
      "SQL interviews"
    ],
    hint: "Use COUNT(*) with HAVING COUNT(*) > 1.",
    starterQuery: `SELECT
  order_id,
  COUNT(*) AS payment_attempts,
  MAX(payment_date) AS latest_payment_date
  FROM payments
  GROUP BY order_id
  HAVING COUNT(*) > 1
  ORDER BY payment_attempts DESC,
  latest_payment_date DESC;`,
    expectedColumns: [
      "order_id",
      "payment_attempts",
      "latest_payment_date"
    ],
    solutionQuery: `SELECT
      order_id,
      COUNT(*) AS payment_attempts,
      MAX(payment_date) AS latest_payment_date
  FROM payments
  GROUP BY order_id
  HAVING COUNT(*) > 1
  ORDER BY payment_attempts DESC,
           latest_payment_date DESC;`
  },
  {
    id: 87,
    title: "Products Ordered Most Frequently",
    difficulty: "Hard",
    slug: "sql-products-ordered-most-frequently",
    seoTitle: "SQL Hard Interview Question | Products Ordered Most Frequently",
    metaDescription: "Find the most frequently ordered products using SQL aggregation and ranking.",
    tags: ["SQL", "Interview", "Products", "ROW_NUMBER", "Aggregation"],
    description: "Calculate how many times each product has been ordered. Return the product ID, product name, total orders, and rank them from highest to lowest.",
    explanation: "Join products with order_items, count how many orders each product appears in, then rank them using ROW_NUMBER().",
    scenario: "The product team wants to identify the products that customers order most frequently.",
    useCases: [
      "Product analytics",
      "Sales reporting",
      "Inventory planning",
      "SQL interviews"
    ],
    hint: "COUNT(DISTINCT order_id) gives the number of orders containing each product.",
    starterQuery: `WITH ProductOrders AS (
  SELECT
  p.product_id,
  p.product_name,
  COUNT(DISTINCT oi.order_id) AS total_orders
  FROM products p
  JOIN order_items oi
  ON p.product_id=oi.product_id
  GROUP BY
  p.product_id,
  p.product_name
  )
  SELECT
  product_id,
  product_name,
  total_orders,
  ROW_NUMBER() OVER(
  ORDER BY total_orders DESC
  ) AS product_rank
  FROM ProductOrders;`,
    expectedColumns: [
      "product_id",
      "product_name",
      "total_orders",
      "product_rank"
    ],
    solutionQuery: `WITH ProductOrders AS (
  SELECT
      p.product_id,
      p.product_name,
      COUNT(DISTINCT oi.order_id) AS total_orders
  FROM products p
  JOIN order_items oi
  ON p.product_id=oi.product_id
  GROUP BY
      p.product_id,
      p.product_name
  )
  SELECT
      product_id,
      product_name,
      total_orders,
      ROW_NUMBER() OVER(
          ORDER BY total_orders DESC
      ) AS product_rank
  FROM ProductOrders;`
  },
  {
    id: 88,
    title: "Average Rating by Feedback Channel",
    difficulty: "Hard",
    slug: "sql-average-rating-by-feedback-channel",
    seoTitle: "SQL Hard Interview Question | Average Rating by Feedback Channel",
    metaDescription: "Calculate the average customer rating for each feedback channel using SQL aggregation.",
    tags: ["SQL", "Interview", "Feedback", "Aggregation", "AVG"],
    description: "Calculate the average customer rating for each feedback channel. Return the feedback channel, total feedback count, average rating, and rank the channels by average rating.",
    explanation: "Group feedback records by feedback_channel, calculate the average rating and total feedback count, then rank the channels based on their average rating.",
    scenario: "The customer experience team wants to identify which feedback channels receive the highest customer satisfaction ratings.",
    useCases: [
      "Customer satisfaction analysis",
      "Feedback reporting",
      "Business intelligence",
      "SQL interviews"
    ],
    hint: "Use AVG(), COUNT(), and ROW_NUMBER() after grouping by feedback_channel.",
    starterQuery: `WITH ChannelRatings AS (
  SELECT
  feedback_channel,
  COUNT(*) AS feedback_count,
  ROUND(AVG(rating),2) AS average_rating
  FROM feedback
  GROUP BY feedback_channel
  )
  SELECT
  feedback_channel,
  feedback_count,
  average_rating,
  ROW_NUMBER() OVER(
  ORDER BY average_rating DESC,
  feedback_count DESC
  ) AS channel_rank
  FROM ChannelRatings;`,
    expectedColumns: [
      "feedback_channel",
      "feedback_count",
      "average_rating",
      "channel_rank"
    ],
    solutionQuery: `WITH ChannelRatings AS (
  SELECT
      feedback_channel,
      COUNT(*) AS feedback_count,
      ROUND(AVG(rating),2) AS average_rating
  FROM feedback
  GROUP BY feedback_channel
  )
  SELECT
      feedback_channel,
      feedback_count,
      average_rating,
      ROW_NUMBER() OVER(
          ORDER BY average_rating DESC,
                   feedback_count DESC
      ) AS channel_rank
  FROM ChannelRatings;`
  },
  {
    id: 89,
    title: "Rank Delivery Partners by Average Delivery Time",
    difficulty: "Hard",
    slug: "sql-rank-delivery-partners-average-delivery-time",
    seoTitle: "SQL Hard Interview Question | Rank Delivery Partners by Delivery Time",
    metaDescription: "Rank delivery partners based on their average delivery time.",
    tags: ["SQL", "Interview", "Delivery", "ROW_NUMBER", "julianday"],
    description: "Calculate the average delivery time for every delivery partner and rank them from fastest to slowest.",
    explanation: "Use julianday() to calculate delivery duration, group by delivery partner, and rank using ROW_NUMBER().",
    scenario: "Operations managers want to compare delivery partner performance.",
    useCases: [
      "Delivery analytics",
      "Performance reporting",
      "Operations dashboard",
      "SQL interviews"
    ],
    hint: "Use julianday(delivered_date)-julianday(order_date).",
    starterQuery: `WITH DeliveryStats AS (
  SELECT
  dp.delivery_partner_id,
  dp.partner_name,
  ROUND(AVG(
  julianday(o.delivered_date)-julianday(o.order_date)
  ),2) AS average_delivery_days
  FROM delivery_partners dp
  JOIN orders o
  ON dp.delivery_partner_id=o.delivery_partner_id
  WHERE o.delivered_date IS NOT NULL
  GROUP BY
  dp.delivery_partner_id,
  dp.partner_name
  )
  SELECT
  delivery_partner_id,
  partner_name,
  average_delivery_days,
  ROW_NUMBER() OVER(
  ORDER BY average_delivery_days
  ) AS partner_rank
  FROM DeliveryStats;`,
    expectedColumns: [
      "delivery_partner_id",
      "partner_name",
      "average_delivery_days",
      "partner_rank"
    ],
    solutionQuery: `WITH DeliveryStats AS (
  SELECT
      dp.delivery_partner_id,
      dp.partner_name,
      ROUND(
          AVG(
              julianday(o.delivered_date)-julianday(o.order_date)
          ),
          2
      ) AS average_delivery_days
  FROM delivery_partners dp
  JOIN orders o
  ON dp.delivery_partner_id=o.delivery_partner_id
  WHERE o.delivered_date IS NOT NULL
  GROUP BY
      dp.delivery_partner_id,
      dp.partner_name
  )
  SELECT
      delivery_partner_id,
      partner_name,
      average_delivery_days,
      ROW_NUMBER() OVER(
          ORDER BY average_delivery_days
      ) AS partner_rank
  FROM DeliveryStats;`
  },
  {
    id: 90,
    title: "Customer Revenue and Satisfaction Dashboard",
    difficulty: "Hard",
    slug: "sql-customer-revenue-and-satisfaction-dashboard",
    seoTitle: "SQL Hard Interview Question | Customer Revenue and Satisfaction Dashboard",
    metaDescription: "Build a customer dashboard combining revenue, payments, and feedback information.",
    tags: ["SQL", "Interview", "CTE", "Dashboard", "Multi Table"],
    description: "Build a customer summary showing total orders, total revenue, successful payments, average feedback rating, and the latest order date.",
    explanation: "Join customers, orders, payments, and feedback to produce a business dashboard for each customer.",
    scenario: "Business leaders want a single dashboard showing customer value and satisfaction.",
    useCases: [
      "Executive dashboard",
      "Customer analytics",
      "Business reporting",
      "SQL interviews"
    ],
    hint: "Aggregate orders, payments, and feedback separately before joining them.",
    starterQuery: `WITH OrderSummary AS (
  SELECT
  customer_id,
  COUNT(*) AS total_orders,
  SUM(total_amount) AS total_revenue,
  MAX(order_date) AS latest_order_date
  FROM orders
  GROUP BY customer_id
  ),
  PaymentSummary AS (
  SELECT
  o.customer_id,
  SUM(CASE
  WHEN p.payment_status='Success' THEN 1
  ELSE 0
  END) AS successful_payments
  FROM payments p
  JOIN orders o
  ON p.order_id=o.order_id
  GROUP BY o.customer_id
  ),
  FeedbackSummary AS (
  SELECT
  customer_id,
  ROUND(AVG(rating),2) AS average_rating
  FROM feedback
  GROUP BY customer_id
  )
  SELECT
  c.customer_id,
  c.customer_name,
  os.total_orders,
  os.total_revenue,
  ps.successful_payments,
  fs.average_rating,
  os.latest_order_date
  FROM customers c
  LEFT JOIN OrderSummary os
  ON c.customer_id=os.customer_id
  LEFT JOIN PaymentSummary ps
  ON c.customer_id=ps.customer_id
  LEFT JOIN FeedbackSummary fs
  ON c.customer_id=fs.customer_id
  ORDER BY os.total_revenue DESC;`,
    expectedColumns: [
      "customer_id",
      "customer_name",
      "total_orders",
      "total_revenue",
      "successful_payments",
      "average_rating",
      "latest_order_date"
    ],
    solutionQuery: `WITH OrderSummary AS (
  SELECT
      customer_id,
      COUNT(*) AS total_orders,
      SUM(total_amount) AS total_revenue,
      MAX(order_date) AS latest_order_date
  FROM orders
  GROUP BY customer_id
  ),
  PaymentSummary AS (
  SELECT
      o.customer_id,
      SUM(CASE
          WHEN p.payment_status='Success' THEN 1
          ELSE 0
      END) AS successful_payments
  FROM payments p
  JOIN orders o
  ON p.order_id=o.order_id
  GROUP BY o.customer_id
  ),
  FeedbackSummary AS (
  SELECT
      customer_id,
      ROUND(AVG(rating),2) AS average_rating
  FROM feedback
  GROUP BY customer_id
  )
  SELECT
      c.customer_id,
      c.customer_name,
      os.total_orders,
      os.total_revenue,
      ps.successful_payments,
      fs.average_rating,
      os.latest_order_date
  FROM customers c
  LEFT JOIN OrderSummary os
  ON c.customer_id=os.customer_id
  LEFT JOIN PaymentSummary ps
  ON c.customer_id=ps.customer_id
  LEFT JOIN FeedbackSummary fs
  ON c.customer_id=fs.customer_id
  ORDER BY os.total_revenue DESC;`
  },
  {
    id: 91,
    title: "Most Used Payment Method",
    difficulty: "Hard",
    slug: "sql-most-used-payment-method",
    seoTitle: "SQL Hard Interview Question | Most Used Payment Method",
    metaDescription: "Find the most frequently used payment methods using SQL aggregation and ranking.",
    tags: ["SQL", "Interview", "Payments", "ROW_NUMBER", "Aggregation"],
    description: "Calculate how many payments were made using each payment method. Return the payment method, total payments, and rank them from highest to lowest.",
    explanation: "Group payment records by payment_method and count the number of payments. Rank the methods using ROW_NUMBER().",
    scenario: "The finance team wants to understand customer payment preferences.",
    useCases: [
      "Payment analytics",
      "Business reporting",
      "Customer behavior",
      "SQL interviews"
    ],
    hint: "Use COUNT(*) and ROW_NUMBER().",
    starterQuery: `WITH PaymentSummary AS (
  SELECT
  payment_method,
  COUNT(*) AS total_payments
  FROM payments
  GROUP BY payment_method
  )
  SELECT
  payment_method,
  total_payments,
  ROW_NUMBER() OVER(
  ORDER BY total_payments DESC
  ) AS payment_rank
  FROM PaymentSummary;`,
    expectedColumns: [
      "payment_method",
      "total_payments",
      "payment_rank"
    ],
    solutionQuery: `WITH PaymentSummary AS (
  SELECT
      payment_method,
      COUNT(*) AS total_payments
  FROM payments
  GROUP BY payment_method
  )
  SELECT
      payment_method,
      total_payments,
      ROW_NUMBER() OVER(
          ORDER BY total_payments DESC
      ) AS payment_rank
  FROM PaymentSummary;`
  },
  {
    id: 92,
    title: "Payment Provider Usage",
    difficulty: "Hard",
    slug: "sql-payment-provider-usage",
    seoTitle: "SQL Hard Interview Question | Payment Provider Usage",
    metaDescription: "Calculate payment volume handled by each payment provider.",
    tags: ["SQL", "Interview", "Payments", "Aggregation", "SUM"],
    description: "Calculate the total number of payments and total payment amount handled by each payment provider.",
    explanation: "Group payments by payment_provider and calculate both the payment count and total payment amount.",
    scenario: "The finance team wants to compare payment providers based on transaction volume.",
    useCases: [
      "Provider analytics",
      "Finance reporting",
      "Business intelligence",
      "SQL interviews"
    ],
    hint: "Use COUNT(*) and SUM(amount).",
    starterQuery: `SELECT
  payment_provider,
  COUNT(*) AS payment_count,
  ROUND(SUM(amount),2) AS total_amount
  FROM payments
  GROUP BY payment_provider
  ORDER BY total_amount DESC;`,
    expectedColumns: [
      "payment_provider",
      "payment_count",
      "total_amount"
    ],
    solutionQuery: `SELECT
      payment_provider,
      COUNT(*) AS payment_count,
      ROUND(SUM(amount),2) AS total_amount
  FROM payments
  GROUP BY payment_provider
  ORDER BY total_amount DESC;`
  },
  {
    id: 93,
    title: "Most Common Customer Issue Category",
    difficulty: "Hard",
    slug: "sql-most-common-customer-issue-category",
    seoTitle: "SQL Hard Interview Question | Most Common Customer Issue Category",
    metaDescription: "Find the most frequently reported customer issue categories using SQL aggregation and ranking.",
    tags: ["SQL", "Interview", "Feedback", "ROW_NUMBER", "Aggregation"],
    description: "Find the issue categories reported by customers and rank them based on how frequently they occur.",
    explanation: "Group feedback by issue_category, count the number of reports, and rank the categories using ROW_NUMBER().",
    scenario: "The customer support team wants to identify the most frequently reported issues.",
    useCases: [
      "Support analytics",
      "Customer experience",
      "Business reporting",
      "SQL interviews"
    ],
    hint: "Use COUNT(*) and ROW_NUMBER() after grouping by issue_category.",
    starterQuery: `WITH IssueSummary AS (
  SELECT
  issue_category,
  COUNT(*) AS issue_count
  FROM feedback
  GROUP BY issue_category
  )
  SELECT
  issue_category,
  issue_count,
  ROW_NUMBER() OVER(
  ORDER BY issue_count DESC
  ) AS issue_rank
  FROM IssueSummary;`,
    expectedColumns: [
      "issue_category",
      "issue_count",
      "issue_rank"
    ],
    solutionQuery: `WITH IssueSummary AS (
  SELECT
      issue_category,
      COUNT(*) AS issue_count
  FROM feedback
  GROUP BY issue_category
  )
  SELECT
      issue_category,
      issue_count,
      ROW_NUMBER() OVER(
          ORDER BY issue_count DESC
      ) AS issue_rank
  FROM IssueSummary;`
  },
  {
    id: 94,
    title: "Top Delivery Partners by deliveries",
    difficulty: "Hard",
    slug: "sql-top-delivery-partners-by-deliveries",
    seoTitle: "SQL Hard Interview Question | Top Delivery Partners by deliveries",
    metaDescription: "Rank delivery partners based on the number of completed deliveries.",
    tags: ["SQL", "Interview", "Delivery", "ROW_NUMBER", "Aggregation"],
    description: "Rank delivery partners based on the number of orders they have delivered. Return the delivery partner, completed deliveries, and rank.",
    explanation: "Join delivery_partners with orders, count delivered orders for each partner, and rank them using ROW_NUMBER().",
    scenario: "Operations wants to identify the best-performing delivery partners.",
    useCases: [
      "Operations reporting",
      "Partner performance",
      "Logistics analytics",
      "SQL interviews"
    ],
    hint: "Filter delivered orders before grouping.",
    starterQuery: `WITH PartnerSummary AS (
  SELECT
  dp.delivery_partner_id,
  dp.partner_name,
  COUNT(o.order_id) AS completed_deliveries
  FROM delivery_partners dp
  JOIN orders o
  ON dp.delivery_partner_id=o.delivery_partner_id
  WHERE o.order_status='delivered'
  GROUP BY
  dp.delivery_partner_id,
  dp.partner_name
  )
  SELECT
  delivery_partner_id,
  partner_name,
  completed_deliveries,
  ROW_NUMBER() OVER(
  ORDER BY completed_deliveries DESC
  ) AS partner_rank
  FROM PartnerSummary;`,
    expectedColumns: [
      "delivery_partner_id",
      "partner_name",
      "completed_deliveries",
      "partner_rank"
    ],
    solutionQuery: `WITH PartnerSummary AS (
  SELECT
      dp.delivery_partner_id,
      dp.partner_name,
      COUNT(o.order_id) AS completed_deliveries
  FROM delivery_partners dp
  JOIN orders o
  ON dp.delivery_partner_id=o.delivery_partner_id
  WHERE o.order_status='delivered'
  GROUP BY
      dp.delivery_partner_id,
      dp.partner_name
  )
  SELECT
      delivery_partner_id,
      partner_name,
      completed_deliveries,
      ROW_NUMBER() OVER(
          ORDER BY completed_deliveries DESC
      ) AS partner_rank
  FROM PartnerSummary;`
  },
  {
    id: 95,
    title: "Cities With Highest Order Revenue",
    difficulty: "Hard",
    slug: "sql-cities-with-highest-order-revenue",
    seoTitle: "SQL Hard Interview Question | Cities With Highest Order Revenue",
    metaDescription: "Calculate total order revenue by city and rank cities using SQL.",
    tags: ["SQL", "Interview", "Orders", "Customers", "ROW_NUMBER", "SUM"],
    description: "Calculate the total revenue generated by customers from each city. Return the city, total revenue, total orders, and rank the cities by revenue.",
    explanation: "Join customers and orders, aggregate revenue by city, and rank the cities using ROW_NUMBER().",
    scenario: "Business leaders want to identify the highest revenue-generating cities.",
    useCases: [
      "Regional performance",
      "Revenue reporting",
      "Business intelligence",
      "SQL interviews"
    ],
    hint: "Group by city and use SUM(total_amount).",
    starterQuery: `WITH CityRevenue AS (
  SELECT
  c.city,
  COUNT(o.order_id) AS total_orders,
  ROUND(SUM(o.total_amount),2) AS total_revenue
  FROM customers c
  JOIN orders o
  ON c.customer_id=o.customer_id
  GROUP BY c.city
  )
  SELECT
  city,
  total_orders,
  total_revenue,
  ROW_NUMBER() OVER(
  ORDER BY total_revenue DESC
  ) AS city_rank
  FROM CityRevenue;`,
    expectedColumns: [
      "city",
      "total_orders",
      "total_revenue",
      "city_rank"
    ],
    solutionQuery: `WITH CityRevenue AS (
  SELECT
      c.city,
      COUNT(o.order_id) AS total_orders,
      ROUND(SUM(o.total_amount),2) AS total_revenue
  FROM customers c
  JOIN orders o
  ON c.customer_id=o.customer_id
  GROUP BY c.city
  )
  SELECT
      city,
      total_orders,
      total_revenue,
      ROW_NUMBER() OVER(
          ORDER BY total_revenue DESC
      ) AS city_rank
  FROM CityRevenue;`
  },
  {
    id: 96,
    title: "Highest Rated Delivery Partners",
    difficulty: "Hard",
    slug: "sql-highest-rated-delivery-partners",
    seoTitle: "SQL Hard Interview Question | Highest Rated Delivery Partners",
    metaDescription: "Rank delivery partners based on their customer ratings.",
    tags: ["SQL", "Interview", "Delivery", "ROW_NUMBER", "Ranking"],
    description: "Rank delivery partners according to their ratings. Return the delivery partner ID, partner name, rating, total deliveries, and rank.",
    explanation: "Use the delivery_partners table and rank partners by rating. If ratings are equal, rank the partner with more completed deliveries higher.",
    scenario: "Operations wants to identify its highest-performing delivery partners.",
    useCases: [
      "Partner evaluation",
      "Logistics reporting",
      "Performance dashboards",
      "SQL interviews"
    ],
    hint: "Use ROW_NUMBER() ordered by rating DESC and total_deliveries DESC.",
    starterQuery: `SELECT
  delivery_partner_id,
  partner_name,
  rating,
  total_deliveries,
  ROW_NUMBER() OVER(
  ORDER BY rating DESC,total_deliveries DESC
  ) AS partner_rank
  FROM delivery_partners;`,
    expectedColumns: [
      "delivery_partner_id",
      "partner_name",
      "rating",
      "total_deliveries",
      "partner_rank"
    ],
    solutionQuery: `SELECT
  delivery_partner_id,
  partner_name,
  rating,
  total_deliveries,
  ROW_NUMBER() OVER(
  ORDER BY rating DESC,total_deliveries DESC
  ) AS partner_rank
  FROM delivery_partners;`
  },
  {
    id: 97,
    title: "Revenue by Customer Type",
    difficulty: "Hard",
    slug: "sql-revenue-by-customer-type",
    seoTitle: "SQL Hard Interview Question | Revenue by Customer Type",
    metaDescription: "Calculate total revenue generated by each customer type.",
    tags: ["SQL", "Interview", "Customers", "Orders", "Aggregation"],
    description: "Calculate the total orders, total revenue, and average order value for each customer type.",
    explanation: "Join customers and orders, then aggregate revenue metrics for every customer type.",
    scenario: "The marketing team wants to compare the spending habits of different customer segments.",
    useCases: [
      "Customer segmentation",
      "Revenue analysis",
      "Business intelligence",
      "SQL interviews"
    ],
    hint: "Group by customer_type and use COUNT(), SUM(), and AVG().",
    starterQuery: `SELECT
  c.customer_type,
  COUNT(o.order_id) AS total_orders,
  ROUND(SUM(o.total_amount),2) AS total_revenue,
  ROUND(AVG(o.total_amount),2) AS average_order_value
  FROM customers c
  JOIN orders o
  ON c.customer_id=o.customer_id
  GROUP BY c.customer_type
  ORDER BY total_revenue DESC;`,
    expectedColumns: [
      "customer_type",
      "total_orders",
      "total_revenue",
      "average_order_value"
    ],
    solutionQuery: `SELECT
  c.customer_type,
  COUNT(o.order_id) AS total_orders,
  ROUND(SUM(o.total_amount),2) AS total_revenue,
  ROUND(AVG(o.total_amount),2) AS average_order_value
  FROM customers c
  JOIN orders o
  ON c.customer_id=o.customer_id
  GROUP BY c.customer_type
  ORDER BY total_revenue DESC;`
  },
  {
    id: 98,
    title: "Top Selling Brand by Revenue",
    difficulty: "Hard",
    slug: "sql-top-selling-brand-by-revenue",
    seoTitle: "SQL Hard Interview Question | Top Selling Brand by Revenue",
    metaDescription: "Calculate brand revenue and rank brands using SQL.",
    tags: ["SQL", "Interview", "Products", "Revenue", "ROW_NUMBER"],
    description: "Calculate the total revenue generated by each product brand and rank the brands from highest to lowest revenue.",
    explanation: "Join products with order_items, calculate brand revenue, then rank the brands using ROW_NUMBER().",
    scenario: "Product managers want to identify the highest-performing brands.",
    useCases: [
      "Sales reporting",
      "Brand performance",
      "Revenue analysis",
      "SQL interviews"
    ],
    hint: "Multiply quantity by unit_price before summing revenue.",
    starterQuery: `WITH BrandRevenue AS (
  SELECT
  p.brand,
  ROUND(SUM(oi.quantity*oi.unit_price),2) AS total_revenue
  FROM products p
  JOIN order_items oi
  ON p.product_id=oi.product_id
  GROUP BY p.brand
  )
  SELECT
  brand,
  total_revenue,
  ROW_NUMBER() OVER(
  ORDER BY total_revenue DESC
  ) AS brand_rank
  FROM BrandRevenue;`,
    expectedColumns: [
      "brand",
      "total_revenue",
      "brand_rank"
    ],
    solutionQuery: `WITH BrandRevenue AS (
  SELECT
  p.brand,
  ROUND(SUM(oi.quantity*oi.unit_price),2) AS total_revenue
  FROM products p
  JOIN order_items oi
  ON p.product_id=oi.product_id
  GROUP BY p.brand
  )
  SELECT
  brand,
  total_revenue,
  ROW_NUMBER() OVER(
  ORDER BY total_revenue DESC
  ) AS brand_rank
  FROM BrandRevenue;`
  },
  {
    id: 99,
    title: "Monthly Orders and Revenue Trend",
    difficulty: "Hard",
    slug: "sql-monthly-orders-and-revenue-trend",
    seoTitle: "SQL Hard Interview Question | Monthly Orders and Revenue Trend",
    metaDescription: "Analyze monthly order volume and revenue trends using SQL window functions.",
    tags: ["SQL", "Interview", "Orders", "Revenue", "Window Functions", "LAG"],
    description: "Calculate the total orders and total revenue for each month. Also display the revenue change compared to the previous month.",
    explanation: "Aggregate order data by month, then use the LAG() window function to compare each month's revenue with the previous month.",
    scenario: "The business team wants to monitor monthly sales performance and identify revenue growth or decline.",
    useCases: [
      "Sales reporting",
      "Trend analysis",
      "Executive dashboards",
      "SQL interviews"
    ],
    hint: "Use strftime('%Y-%m', order_date) and LAG().",
    starterQuery: `WITH MonthlyRevenue AS (
  SELECT
  strftime('%Y-%m',order_date) AS order_month,
  COUNT(order_id) AS total_orders,
  ROUND(SUM(total_amount),2) AS total_revenue
  FROM orders
  GROUP BY strftime('%Y-%m',order_date)
  )
  SELECT
  order_month,
  total_orders,
  total_revenue,
  LAG(total_revenue) OVER(
  ORDER BY order_month
  ) AS previous_month_revenue,
  ROUND(
  total_revenue-LAG(total_revenue) OVER(
  ORDER BY order_month
  ),2
  ) AS revenue_difference
  FROM MonthlyRevenue;`,
    expectedColumns: [
      "order_month",
      "total_orders",
      "total_revenue",
      "previous_month_revenue",
      "revenue_difference"
    ],
    solutionQuery: `WITH MonthlyRevenue AS (
  SELECT
      strftime('%Y-%m',order_date) AS order_month,
      COUNT(order_id) AS total_orders,
      ROUND(SUM(total_amount),2) AS total_revenue
  FROM orders
  GROUP BY strftime('%Y-%m',order_date)
  )
  SELECT
      order_month,
      total_orders,
      total_revenue,
      LAG(total_revenue) OVER(
          ORDER BY order_month
      ) AS previous_month_revenue,
      ROUND(
          total_revenue-LAG(total_revenue) OVER(
              ORDER BY order_month
          ),2
      ) AS revenue_difference
  FROM MonthlyRevenue;`
  },
  {
    id: 100,
    title: "Customer Lifetime Value Ranking",
    difficulty: "Hard",
    slug: "sql-customer-lifetime-value-ranking",
    seoTitle: "SQL Hard Interview Question | Customer Lifetime Value Ranking",
    metaDescription: "Rank customers by their lifetime revenue using SQL aggregation and window functions.",
    tags: ["SQL", "Interview", "Customers", "Revenue", "ROW_NUMBER"],
    description: "Calculate the lifetime revenue generated by each customer and rank customers from highest to lowest revenue.",
    explanation: "Join customers and orders, aggregate revenue for each customer, then rank them using ROW_NUMBER().",
    scenario: "The marketing team wants to identify high-value customers for loyalty programs.",
    useCases: [
      "Customer analytics",
      "Revenue reporting",
      "Loyalty programs",
      "SQL interviews"
    ],
    hint: "Use SUM(total_amount) grouped by customer, then apply ROW_NUMBER().",
    starterQuery: `WITH CustomerRevenue AS (
  SELECT
  c.customer_id,
  c.customer_name,
  ROUND(SUM(o.total_amount),2) AS lifetime_revenue
  FROM customers c
  JOIN orders o
  ON c.customer_id=o.customer_id
  GROUP BY
  c.customer_id,
  c.customer_name
  )
  SELECT
  customer_id,
  customer_name,
  lifetime_revenue,
  ROW_NUMBER() OVER(
  ORDER BY lifetime_revenue DESC
  ) AS customer_rank
  FROM CustomerRevenue;`,
    expectedColumns: [
      "customer_id",
      "customer_name",
      "lifetime_revenue",
      "customer_rank"
    ],
    solutionQuery: `WITH CustomerRevenue AS (
  SELECT
      c.customer_id,
      c.customer_name,
      ROUND(SUM(o.total_amount),2) AS lifetime_revenue
  FROM customers c
  JOIN orders o
  ON c.customer_id=o.customer_id
  GROUP BY
      c.customer_id,
      c.customer_name
  )
  SELECT
      customer_id,
      customer_name,
      lifetime_revenue,
      ROW_NUMBER() OVER(
          ORDER BY lifetime_revenue DESC
      ) AS customer_rank
  FROM CustomerRevenue;`
  },
  ];