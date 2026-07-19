export const SQL_PROBLEMS = [
  {
    id: 1,
    title: "Display All Customers",
    difficulty: "Easy",
    slug: "sql-display-all-customers",
    seoTitle: "SQL Basics | Display All Customers",
    metaDescription: "Learn how to retrieve all records from a table using the SELECT statement.",
    tags: ["SQL", "Basics", "SELECT"],
    description: "Retrieve all columns from the customers table.",
    explanation: "The SELECT * statement returns every column and every row from a table.",
    scenario: "You have joined an e-commerce company and want to view all customer records.",
    useCases: [
      "Learning SQL",
      "Viewing table data",
      "Database exploration"
    ],
    hint: "Use SELECT *.",
    starterQuery: `SELECT * FROM customers;`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT * FROM customers;`
  },
  {
    id: 2,
    title: "Display Customer Names",
    difficulty: "Easy",
    slug: "sql-display-customer-names",
    seoTitle: "SQL Basics | Select Specific Columns",
    metaDescription: "Learn how to retrieve specific columns from a table.",
    tags: ["SQL", "Basics", "SELECT"],
    description: "Retrieve only the customer_id and customer_name columns from the customers table.",
    explanation: "Instead of selecting all columns, specify only the columns you need.",
    scenario: "The support team only needs customer IDs and names.",
    useCases: [
      "Column selection",
      "Reporting",
      "Learning SQL"
    ],
    hint: "Specify column names after SELECT.",
    starterQuery: `SELECT customer_id, customer_name
  FROM customers;`,
    expectedColumns: [
      "customer_id",
      "customer_name"
    ],
    solutionQuery: `SELECT
  customer_id,
  customer_name
  FROM customers;`
  },
  {
    id: 3,
    title: "Find All Delivered Orders",
    difficulty: "Easy",
    slug: "sql-find-delivered-orders",
    seoTitle: "SQL Basics | WHERE Clause",
    metaDescription: "Learn how to filter rows using the WHERE clause.",
    tags: ["SQL", "Basics", "WHERE"],
    description: "Retrieve all orders where the order status is 'delivered'.",
    explanation: "The WHERE clause filters rows based on a condition.",
    scenario: "Operations wants to view only delivered orders.",
    useCases: [
      "Filtering data",
      "Order tracking",
      "Learning SQL"
    ],
    hint: "Use WHERE order_status='Delivered'.",
    starterQuery: `SELECT *
  FROM orders
  WHERE order_status='delivered';`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM orders
  WHERE order_status='delivered';`
  },
  {
    id: 4,
    title: "Sort Products by Price",
    difficulty: "Easy",
    slug: "sql-sort-products-by-price",
    seoTitle: "SQL Basics | ORDER BY",
    metaDescription: "Learn how to sort query results using ORDER BY.",
    tags: ["SQL", "Basics", "ORDER BY"],
    description: "Display all products sorted by price from highest to lowest.",
    explanation: "ORDER BY sorts query results in ascending or descending order.",
    scenario: "The merchandising team wants to see the most expensive products first.",
    useCases: [
      "Sorting data",
      "Product analysis",
      "Learning SQL"
    ],
    hint: "Use ORDER BY price DESC.",
    starterQuery: `SELECT *
  FROM products
  ORDER BY price DESC;`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM products
  ORDER BY price DESC;`
  },
  {
    id: 5,
    title: "Show First 10 Customers",
    difficulty: "Easy",
    slug: "sql-show-first-10-customers",
    seoTitle: "SQL Basics | LIMIT Clause",
    metaDescription: "Learn how to limit the number of rows returned by a SQL query.",
    tags: ["SQL", "Basics", "LIMIT"],
    description: "Retrieve the first 10 customers from the customers table.",
    explanation: "LIMIT restricts the number of rows returned by a query.",
    scenario: "You only want to preview a small sample of customer records.",
    useCases: [
      "Previewing data",
      "Testing queries",
      "Learning SQL"
    ],
    hint: "Use LIMIT 10.",
    starterQuery: `SELECT *
  FROM customers
  LIMIT 10;`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM customers
  LIMIT 10;`
  },
  {
    id: 6,
    title: "Find Customers From India",
    difficulty: "Easy",
    slug: "sql-find-customers-from-india",
    seoTitle: "SQL Basics | Filter Rows Using WHERE",
    metaDescription: "Learn how to filter rows using the WHERE clause.",
    tags: ["SQL", "Basics", "WHERE"],
    description: "Retrieve all customers who are from India.",
    explanation: "Use the WHERE clause to filter rows based on the country column.",
    scenario: "The marketing team wants to target customers from India.",
    useCases: [
      "Filtering data",
      "Marketing",
      "Learning SQL"
    ],
    hint: "Filter rows where country equals 'India'.",
    starterQuery: `SELECT *
  FROM customers
  WHERE country='India';`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM customers
  WHERE country='India';`
  },
  {
    id: 7,
    title: "Find Premium Customers",
    difficulty: "Easy",
    slug: "sql-find-premium-customers",
    seoTitle: "SQL Basics | Filter by Customer Type",
    metaDescription: "Retrieve customers based on a specific customer type.",
    tags: ["SQL", "Basics", "WHERE"],
    description: "Display all customers whose customer_type is 'Premium'.",
    explanation: "The WHERE clause can be used to filter text values.",
    scenario: "The loyalty team wants to view all premium customers.",
    useCases: [
      "Customer segmentation",
      "Marketing",
      "Learning SQL"
    ],
    hint: "Filter using customer_type.",
    starterQuery: `SELECT *
  FROM customers
  WHERE customer_type='Premium';`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM customers
  WHERE customer_type='Premium';`
  },
  {
    id: 8,
    title: "Find Products Costing More Than ₹1000",
    difficulty: "Easy",
    slug: "sql-products-price-greater-than-1000",
    seoTitle: "SQL Basics | Greater Than Operator",
    metaDescription: "Learn how to use comparison operators in SQL.",
    tags: ["SQL", "Basics", "WHERE", "Comparison"],
    description: "Retrieve all products whose price is greater than 1000.",
    explanation: "Comparison operators like >, <, >= and <= help filter numeric values.",
    scenario: "The sales team wants to identify premium products.",
    useCases: [
      "Product filtering",
      "Pricing analysis",
      "Learning SQL"
    ],
    hint: "Use WHERE price > 1000.",
    starterQuery: `SELECT *
  FROM products
  WHERE price > 1000;`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM products
  WHERE price > 1000;`
  },
  {
    id: 9,
    title: "Display Orders Newest First",
    difficulty: "Easy",
    slug: "sql-display-orders-newest-first",
    seoTitle: "SQL Basics | ORDER BY DESC",
    metaDescription: "Learn how to sort rows in descending order using ORDER BY.",
    tags: ["SQL", "Basics", "ORDER BY"],
    description: "Retrieve all orders sorted by order_date from newest to oldest.",
    explanation: "ORDER BY with DESC sorts values from highest to lowest.",
    scenario: "Operations wants to see the latest orders first.",
    useCases: [
      "Order tracking",
      "Reporting",
      "Learning SQL"
    ],
    hint: "Sort using ORDER BY order_date DESC.",
    starterQuery: `SELECT *
  FROM orders
  ORDER BY order_date DESC;`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM orders
  ORDER BY order_date DESC;`
  },
  {
    id: 10,
    title: "Show Top 5 Most Expensive Products",
    difficulty: "Easy",
    slug: "sql-top-5-most-expensive-products",
    seoTitle: "SQL Basics | ORDER BY and LIMIT",
    metaDescription: "Learn how to combine ORDER BY and LIMIT to retrieve top records.",
    tags: ["SQL", "Basics", "ORDER BY", "LIMIT"],
    description: "Retrieve the five most expensive products.",
    explanation: "Combine ORDER BY with LIMIT to return the top N rows.",
    scenario: "The merchandising team wants to review its highest-priced products.",
    useCases: [
      "Top N queries",
      "Product analysis",
      "Learning SQL"
    ],
    hint: "Sort by price descending and use LIMIT 5.",
    starterQuery: `SELECT *
  FROM products
  ORDER BY price DESC
  LIMIT 5;`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM products
  ORDER BY price DESC
  LIMIT 5;`
  },
  {
    id: 11,
    title: "Find Unique Customer Countries",
    difficulty: "Easy",
    slug: "sql-find-unique-customer-countries",
    seoTitle: "SQL Basics | DISTINCT Keyword",
    metaDescription: "Learn how to remove duplicate values using DISTINCT.",
    tags: ["SQL", "Basics", "DISTINCT"],
    description: "Retrieve the list of unique countries where customers are located.",
    explanation: "DISTINCT removes duplicate values from the result set.",
    scenario: "The marketing team wants to know which countries have customers.",
    useCases: [
      "Removing duplicates",
      "Reporting",
      "Learning SQL"
    ],
    hint: "Use DISTINCT before the column name.",
    starterQuery: `SELECT DISTINCT country
  FROM customers;`,
    expectedColumns: [
      "country"
    ],
    solutionQuery: `SELECT DISTINCT
  country
  FROM customers;`
  },
  {
    id: 12,
    title: "Find Customers Whose Name Starts With 'A'",
    difficulty: "Easy",
    slug: "sql-customers-name-starts-with-a",
    seoTitle: "SQL Basics | LIKE Operator",
    metaDescription: "Learn how to search text using the LIKE operator.",
    tags: ["SQL", "Basics", "LIKE"],
    description: "Retrieve all customers whose names start with the letter 'A'.",
    explanation: "The LIKE operator searches for patterns. 'A%' means the text starts with A.",
    scenario: "The support team wants to locate customers whose names begin with A.",
    useCases: [
      "Pattern matching",
      "Searching",
      "Learning SQL"
    ],
    hint: "Use LIKE 'A%'.",
    starterQuery: `SELECT *
  FROM customers
  WHERE customer_name LIKE 'A%';`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM customers
  WHERE customer_name LIKE 'A%';`
  },
  {
    id: 13,
    title: "Find Customers From India or USA",
    difficulty: "Easy",
    slug: "sql-customers-from-india-or-usa",
    seoTitle: "SQL Basics | IN Operator",
    metaDescription: "Learn how to filter multiple values using the IN operator.",
    tags: ["SQL", "Basics", "IN"],
    description: "Retrieve customers who are from either India or the USA.",
    explanation: "The IN operator is a cleaner alternative to multiple OR conditions.",
    scenario: "The sales team is running campaigns in India and the USA.",
    useCases: [
      "Multiple filtering",
      "Reporting",
      "Learning SQL"
    ],
    hint: "Use WHERE country IN (...).",
    starterQuery: `SELECT *
  FROM customers
  WHERE country IN ('India','USA');`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM customers
  WHERE country IN ('India','USA');`
  },
  {
    id: 14,
    title: "Find Products Priced Between ₹100 and ₹500",
    difficulty: "Easy",
    slug: "sql-products-price-between-100-and-500",
    seoTitle: "SQL Basics | BETWEEN Operator",
    metaDescription: "Learn how to filter values within a range using BETWEEN.",
    tags: ["SQL", "Basics", "BETWEEN"],
    description: "Retrieve all products whose price is between 100 and 500.",
    explanation: "BETWEEN filters values within an inclusive range.",
    scenario: "The merchandising team wants to review mid-range products.",
    useCases: [
      "Range filtering",
      "Pricing analysis",
      "Learning SQL"
    ],
    hint: "Use BETWEEN 100 AND 500.",
    starterQuery: `SELECT *
  FROM products
  WHERE price BETWEEN 100 AND 500;`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM products
  WHERE price BETWEEN 100 AND 500;`
  },
  {
    id: 15,
    title: "Find Customers Without an Email Address",
    difficulty: "Easy",
    slug: "sql-customers-without-email",
    seoTitle: "SQL Basics | IS NULL",
    metaDescription: "Learn how to identify NULL values using IS NULL.",
    tags: ["SQL", "Basics", "NULL"],
    description: "Retrieve all customers whose email address is missing.",
    explanation: "NULL represents missing data. Use IS NULL instead of = NULL.",
    scenario: "The CRM team wants to identify customers missing email addresses.",
    useCases: [
      "Data quality",
      "Customer management",
      "Learning SQL"
    ],
    hint: "Use IS NULL.",
    starterQuery: `SELECT *
  FROM customers
  WHERE email IS NULL;`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM customers
  WHERE email IS NULL;`
  },
  {
    id: 16,
    title: "Find Customers With an Email Address",
    difficulty: "Easy",
    slug: "sql-customers-with-email",
    seoTitle: "SQL Basics | IS NOT NULL",
    metaDescription: "Learn how to filter rows that contain non-NULL values.",
    tags: ["SQL", "Basics", "IS NOT NULL"],
    description: "Retrieve all customers who have an email address.",
    explanation: "IS NOT NULL returns rows where a column contains a value.",
    scenario: "The marketing team wants to email all customers.",
    useCases: [
      "Data quality",
      "Email campaigns",
      "Learning SQL"
    ],
    hint: "Use IS NOT NULL.",
    starterQuery: `SELECT *
  FROM customers
  WHERE email IS NOT NULL;`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM customers
  WHERE email IS NOT NULL;`
  },
  {
    id: 17,
    title: "Find Premium Customers From India",
    difficulty: "Easy",
    slug: "sql-premium-customers-from-india",
    seoTitle: "SQL Basics | AND Operator",
    metaDescription: "Learn how to combine multiple conditions using the AND operator.",
    tags: ["SQL", "Basics", "AND"],
    description: "Retrieve customers who are Premium customers and belong to India.",
    explanation: "The AND operator returns rows only when both conditions are true.",
    scenario: "The marketing team is running a campaign for premium customers in India.",
    useCases: [
      "Multiple conditions",
      "Customer filtering",
      "Learning SQL"
    ],
    hint: "Combine two WHERE conditions using AND.",
    starterQuery: `SELECT *
  FROM customers
  WHERE country='India'
  AND customer_type='Premium';`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM customers
  WHERE country='India'
  AND customer_type='Premium';`
  },
  {
    id: 18,
    title: "Find Customers From India or Premium Members",
    difficulty: "Easy",
    slug: "sql-india-or-premium-customers",
    seoTitle: "SQL Basics | OR Operator",
    metaDescription: "Learn how to use the OR operator to match multiple conditions.",
    tags: ["SQL", "Basics", "OR"],
    description: "Retrieve customers who are either from India or are Premium customers.",
    explanation: "The OR operator returns rows when at least one condition is true.",
    scenario: "The business team wants to include both Premium members and Indian customers in a campaign.",
    useCases: [
      "Customer segmentation",
      "Filtering",
      "Learning SQL"
    ],
    hint: "Use OR between both conditions.",
    starterQuery: `SELECT *
  FROM customers
  WHERE country='India'
  OR customer_type='Premium';`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM customers
  WHERE country='India'
  OR customer_type='Premium';`
  },
  {
    id: 19,
    title: "Find Products Not in the Electronics Category",
    difficulty: "Easy",
    slug: "sql-products-not-electronics",
    seoTitle: "SQL Basics | NOT Operator",
    metaDescription: "Learn how to exclude rows using the NOT operator.",
    tags: ["SQL", "Basics", "NOT"],
    description: "Retrieve all products that do not belong to the Electronics category.",
    explanation: "The NOT operator reverses a condition and excludes matching rows.",
    scenario: "The merchandising team wants to review products outside the Electronics category.",
    useCases: [
      "Filtering",
      "Inventory management",
      "Learning SQL"
    ],
    hint: "Use NOT before the condition.",
    starterQuery: `SELECT *
  FROM products
  WHERE NOT category='Electronics';`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM products
  WHERE NOT category='Electronics';`
  },
  {
    id: 20,
    title: "Sort Customers by Country and Name",
    difficulty: "Easy",
    slug: "sql-sort-customers-by-country-and-name",
    seoTitle: "SQL Basics | ORDER BY Multiple Columns",
    metaDescription: "Learn how to sort data using multiple columns.",
    tags: ["SQL", "Basics", "ORDER BY"],
    description: "Retrieve all customers sorted by country in ascending order and then by customer name in ascending order.",
    explanation: "ORDER BY can sort data using multiple columns. If the first column has duplicate values, SQL uses the next column to determine the order.",
    scenario: "The customer support team wants an alphabetically sorted customer list within each country.",
    useCases: [
      "Reporting",
      "Sorting",
      "Learning SQL"
    ],
    hint: "Separate multiple columns using commas in ORDER BY.",
    starterQuery: `SELECT *
  FROM customers
  ORDER BY country ASC,
  customer_name ASC;`,
    expectedColumns: [
      "*"
    ],
    solutionQuery: `SELECT *
  FROM customers
  ORDER BY country ASC,
  customer_name ASC;`
  },
  {
    id: 21,
    title: "Create customer display labels",
    difficulty: "Easy",
    slug: "sql-string-concatenation-pipe-operator",
    seoTitle: "SQL String Concatenation: Formatting Custom Field Labels",
    metaDescription: "Combine multiple discrete string columns using native pipe (||) operators. Build formatted UI keys inside clean database layers.",
    tags: ["String Operators", "Concatenation", "UI Modeling"],
    description: "Create a display column combining customer_id and customer_name.",
    explanation: "String concatenation combines multiple fields into one formatted output.",
    scenario: "Internal admin tools often display combined labels for dropdowns.",
    useCases: [
      "UI labels",
      "Formatted exports",
      "Readable identifiers"
    ],
    hint: "Use || to combine customer_id, ': ', and customer_name.",
    starterQuery: "SELECT customer_id || ': ' || customer_name AS display FROM customers;",
    expectedColumns: ["display"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT customer_id || ': ' || customer_name AS display FROM customers;"
  },
  {
    id: 22,
    title: "Calculate customer lifetime spend",
    difficulty: "Easy",
    slug: "sql-clv-customer-lifetime-spend-ranking",
    seoTitle: "Customer Value Analytics: Calculating LTV Using SQL Logic",
    metaDescription: "Combine multi-row SUM metrics with strict GROUP BY and ORDER BY structures to calculate absolute historical financial footprints.",
    tags: ["LTV Analytics", "Financial Sorting", "Aggregation Platforms"],
    description: "Calculate total spending per customer and sort highest first.",
    explanation: "SUM() with GROUP BY calculates totals for each customer.",
    scenario: "Business teams want to identify high-value customers.",
    useCases: [
      "Customer lifetime value analysis",
      "VIP customer identification",
      "Revenue ranking"
    ],
    hint: "Use SUM(total_amount) AS total_spent, GROUP BY customer_id, and ORDER BY total_spent DESC.",
    starterQuery: "SELECT customer_id, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id ORDER BY total_spent DESC;",
    expectedColumns: ["customer_id", "total_spent"],
    expectedRowCount: 4,
    validateBy: "exact",
    solutionQuery: "SELECT customer_id, SUM(total_amount) AS total_spent FROM orders GROUP BY customer_id ORDER BY total_spent DESC;"
  },
  {
    id: 23,
    title: "Filter orders by amount range",
    difficulty: "Easy",
    slug: "sql-between-operator-inclusive-range",
    seoTitle: "SQL BETWEEN Clause Guide: Filtering Bounded Numeric Arrays",
    metaDescription: "Simplify numeric filter logic using the clean BETWEEN command construct. Evaluate continuous variables without complex multi-operator code blocks.",
    tags: ["BETWEEN Clause", "Range Constraints", "Data Slicing"],
    description: "Return the order_id of orders with total_amount between 150 and 300.",
    explanation: "BETWEEN filters values inclusively within a range.",
    scenario: "Analytics teams want to study mid-range customer purchases.",
    useCases: [
      "Price segmentation",
      "Revenue analysis",
      "Customer spending analysis"
    ],
    hint: "Use WHERE total_amount BETWEEN 150 AND 300. Return only order_id.",
    starterQuery: "SELECT order_id FROM orders WHERE total_amount BETWEEN 150 AND 300;",
    expectedColumns: ["order_id"],
    expectedRowCount: 3,
    validateBy: "row_ids",
    solutionQuery: "SELECT order_id FROM orders WHERE total_amount BETWEEN 150 AND 300;"
  },
  {
    id: 24,
    title: "Exclude specific customers",
    difficulty: "Easy",
    slug: "sql-not-in-exclusion-filtering",
    seoTitle: "Excluding Subsets in SQL: Master the NOT IN Operator Pattern",
    metaDescription: "Strip target records or developer test anomalies from analysis workflows instantly using robust negative set evaluation keywords.",
    tags: ["NOT IN Operator", "Data Cleaning", "Logical Exclusion"],
    description: "Return the customer_id of all customers except customer_id 1 and 2.",
    explanation: "NOT IN excludes matching values from results.",
    scenario: "Internal test accounts should be excluded from analysis.",
    useCases: [
      "Removing test accounts",
      "Blacklist filtering",
      "Data cleanup"
    ],
    hint: "Use WHERE customer_id NOT IN (1, 2). Return only customer_id.",
    starterQuery: "SELECT customer_id FROM customers WHERE customer_id NOT IN (1, 2);",
    expectedColumns: ["customer_id"],
    expectedRowCount: 3,
    validateBy: "row_ids",
    solutionQuery: "SELECT customer_id FROM customers WHERE customer_id NOT IN (1, 2);"
  },
  {
    id: 25,
    title: "Find earliest customer registration",
    difficulty: "Easy",
    slug: "sql-min-date-chronological-baseline",
    seoTitle: "Tracking Historical Baselines: Chronological SQL MIN() Guide",
    metaDescription: "Learn how to parse timestamp types with aggregate functions to retrieve the absolute oldest transactional entry record inside databases.",
    tags: ["MIN Operator", "Timestamp Sorting", "Cohort Baselines"],
    description: "Return the earliest created_date from the customers table.",
    explanation: "MIN() on a date column returns the earliest date.",
    scenario: "The company wants to know when the first customer registered.",
    useCases: [
      "Historical analysis",
      "Customer growth tracking",
      "Cohort analysis"
    ],
    hint: "Use MIN(created_date).",
    starterQuery: "SELECT MIN(created_date) AS first_customer_date FROM customers;",
    expectedColumns: ["first_customer_date"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT MIN(created_date) AS first_customer_date FROM customers;"
  },
  {
    id: 26,
    title: "Calculate Total Revenue",
    difficulty: "Medium",
    slug: "sql-calculate-total-revenue",
    seoTitle: "SQL Basics | SUM Function",
    metaDescription: "Learn how to calculate the total revenue using the SUM function.",
    tags: ["SQL", "Basics", "SUM"],
    description: "Calculate the total revenue generated from all orders.",
    explanation: "SUM() adds together all the values in a numeric column.",
    scenario: "The finance team wants to know the total revenue generated by the business.",
    useCases: [
      "Revenue reporting",
      "Finance dashboards",
      "Learning SQL"
    ],
    hint: "Use SUM(total_amount).",
    starterQuery: `SELECT ROUND(SUM(total_amount),2) AS total_revenue
  FROM orders;`,
    expectedColumns: [
      "total_revenue"
    ],
    solutionQuery: `SELECT ROUND(SUM(total_amount),2) AS total_revenue
  FROM orders;`
  },
  {
    id: 27,
    title: "Count Orders by Status",
    difficulty: "Medium",
    slug: "sql-count-orders-by-status",
    seoTitle: "SQL Basics | GROUP BY",
    metaDescription: "Learn how to group records using GROUP BY.",
    tags: ["SQL", "Basics", "GROUP BY", "COUNT"],
    description: "Count how many orders exist for each order status.",
    explanation: "GROUP BY creates one row for each unique value and COUNT() counts the rows in each group.",
    scenario: "Operations wants to understand the distribution of order statuses.",
    useCases: [
      "Business reporting",
      "Order analysis",
      "Learning SQL"
    ],
    hint: "Group by order_status.",
    starterQuery: `SELECT
  order_status,
  COUNT(*) AS total_orders
  FROM orders
  GROUP BY order_status;`,
    expectedColumns: [
      "order_status",
      "total_orders"
    ],
    solutionQuery: `SELECT
  order_status,
  COUNT(*) AS total_orders
  FROM orders
  GROUP BY order_status;`
  },
  {
    id: 28,
    title: "Count Customers by Country",
    difficulty: "Medium",
    slug: "sql-count-customers-by-country",
    seoTitle: "SQL Basics | GROUP BY Country",
    metaDescription: "Learn how to group customer records by country.",
    tags: ["SQL", "Basics", "GROUP BY", "COUNT"],
    description: "Find the total number of customers in each country.",
    explanation: "GROUP BY combines customers from the same country into one group.",
    scenario: "The marketing team wants to know how customers are distributed across countries.",
    useCases: [
      "Customer analytics",
      "Regional reporting",
      "Learning SQL"
    ],
    hint: "Group by country.",
    starterQuery: `SELECT
  country,
  COUNT(*) AS total_customers
  FROM customers
  GROUP BY country;`,
    expectedColumns: [
      "country",
      "total_customers"
    ],
    solutionQuery: `SELECT
  country,
  COUNT(*) AS total_customers
  FROM customers
  GROUP BY country;`
  },
  {
    id: 29,
    title: "Count Products by Category",
    difficulty: "Medium",
    slug: "sql-count-products-by-category",
    seoTitle: "SQL Basics | GROUP BY Category",
    metaDescription: "Learn how to group products by category using SQL.",
    tags: ["SQL", "Basics", "GROUP BY", "COUNT"],
    description: "Find the total number of products available in each category.",
    explanation: "GROUP BY creates one row for every product category.",
    scenario: "The inventory team wants to know how many products belong to each category.",
    useCases: [
      "Inventory reporting",
      "Product analysis",
      "Learning SQL"
    ],
    hint: "Group by category.",
    starterQuery: `SELECT
  category,
  COUNT(*) AS total_products
  FROM products
  GROUP BY category;`,
    expectedColumns: [
      "category",
      "total_products"
    ],
    solutionQuery: `SELECT
  category,
  COUNT(*) AS total_products
  FROM products
  GROUP BY category;`
  },
  {
    id: 30,
    title: "Average Product Price by Category",
    difficulty: "Medium",
    slug: "sql-average-product-price-by-category",
    seoTitle: "SQL Basics | GROUP BY with AVG",
    metaDescription: "Learn how to calculate average values for each group using SQL.",
    tags: ["SQL", "Basics", "GROUP BY", "AVG"],
    description: "Calculate the average product price for each category.",
    explanation: "Combine AVG() with GROUP BY to calculate the average value for each category.",
    scenario: "The merchandising team wants to compare average prices across categories.",
    useCases: [
      "Pricing analysis",
      "Business reporting",
      "Learning SQL"
    ],
    hint: "Use AVG(price) and GROUP BY category.",
    starterQuery: `SELECT
  category,
  ROUND(AVG(price),2) AS average_price
  FROM products
  GROUP BY category;`,
    expectedColumns: [
      "category",
      "average_price"
    ],
    solutionQuery: `SELECT
  category,
  ROUND(AVG(price),2) AS average_price
  FROM products
  GROUP BY category;`
  },
  {
    id: 31,
    title: "Select product names and prices",
    difficulty: "Medium",
    slug: "sql-product-column-projection-pricing",
    seoTitle: "Catalog Matrix Design: Selecting Named Product Pricing Columns",
    metaDescription: "Examine isolated pricing dimensions across active retail catalogs by projecting precise alphanumeric column nodes.",
    tags: ["Catalog Audits", "Projection Statements", "Slicing Syntax"],
    description: "Return only the product_name and price columns from the products table.",
    explanation: "Selecting only required columns improves readability and query efficiency.",
    scenario: "Sales teams need a simple product pricing sheet.",
    useCases: [
      "Price lists",
      "Catalog exports",
      "Basic reporting"
    ],
    hint: "Select product_name and price from products.",
    starterQuery: "SELECT product_name, price FROM products;",
    expectedColumns: ["product_name", "price"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT product_name, price FROM products;"
  },
  {
    id: 32,
    title: "Filter products by category",
    difficulty: "Medium",
    slug: "sql-where-string-filtering-category",
    seoTitle: "Inventory Taxonomy Audits: SQL Category String Segments",
    metaDescription: "Filter global relational tables based on targeted text categorization arrays using strict exact value evaluation patterns.",
    tags: ["Taxonomy Audits", "WHERE Constraints", "Catalog Scopes"],
    description: "Return product_id, product_name, category, and price for products in the \"Electronics\" category.",
    explanation: "WHERE filters rows matching a specific condition.",
    scenario: "The merchandising team wants to review all electronics products.",
    useCases: [
      "Category analysis",
      "Inventory filtering",
      "Department reports"
    ],
    hint: "Use WHERE category = \"Electronics\".",
    starterQuery: "SELECT product_id, product_name, category, price FROM products WHERE category = \"Electronics\";",
    expectedColumns: ["product_id", "product_name", "category", "price"],
    expectedRowCount: 2,
    validateBy: "exact",
    solutionQuery: "SELECT product_id, product_name, category, price FROM products WHERE category = 'Electronics';"
  },
  {
    id: 33,
    title: "Find expensive products",
    difficulty: "Medium",
    slug: "sql-numeric-comparison-operators-pricing",
    seoTitle: "Premium Inventory Audits: SQL Mathematical Comparisons",
    metaDescription: "Isolate luxury products from database systems using greater-than-or-equal-to (>=) mathematical filter strategies.",
    tags: ["Numeric Operators", "Threshold Scans", "E-Commerce Reporting"],
    description: "Return product_id, product_name, category, and price for products priced at 100 or more.",
    explanation: "Comparison operators help filter numeric ranges.",
    scenario: "Marketing teams are identifying premium products for a luxury campaign.",
    useCases: [
      "Premium product analysis",
      "Pricing audits",
      "Revenue segmentation"
    ],
    hint: "Use WHERE price >= 100.",
    starterQuery: "SELECT product_id, product_name, category, price FROM products WHERE price >= 100;",
    expectedColumns: ["product_id", "product_name", "category", "price"],
    expectedRowCount: 2,
    validateBy: "exact",
    solutionQuery: "SELECT product_id, product_name, category, price FROM products WHERE price >= 100;"
  },
  {
    id: 34,
    title: "Sort products by price",
    difficulty: "Medium",
    slug: "sql-order-by-ascending-sorting-default",
    seoTitle: "Storefront UI Optimization: SQL ORDER BY Ascending Guide",
    metaDescription: "Learn how to build clear storefront price sort mechanisms from low to high using SQL default explicit ordering models.",
    tags: ["Sorting Logic", "Ascending Operator", "UI Integration"],
    description: "Return all product columns sorted from lowest price to highest price.",
    explanation: "ORDER BY sorts query results. ASC is the default order.",
    scenario: "Customers use a 'Price Low to High' sorting option on the storefront.",
    useCases: [
      "Price comparisons",
      "Customer browsing",
      "Product sorting"
    ],
    hint: "Use ORDER BY price ASC.",
    starterQuery: "SELECT * FROM products ORDER BY price ASC;",
    expectedColumns: ["product_id", "product_name", "category", "price"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT * FROM products ORDER BY price ASC;"
  },
  {
    id: 35,
    title: "Find products by keyword",
    difficulty: "Medium",
    slug: "sql-like-wildcard-substring-searches",
    seoTitle: "Internal Catalog Engine Logic: SQL Substring Search Syntax",
    metaDescription: "Implement inline e-commerce search algorithms using robust double-sided string wildcard parsing matrices.",
    tags: ["Substring Searches", "Catalog Engines", "Text Processing"],
    description: "Return product_id, product_name, category, and price for products whose product_name contains \"Pro\".",
    explanation: "LIKE with % performs pattern matching searches.",
    scenario: "Customers frequently search for premium 'Pro' product variants.",
    useCases: [
      "Search functionality",
      "Keyword filtering",
      "Catalog discovery"
    ],
    hint: "Use LIKE \"%Pro%\".",
    starterQuery: "SELECT product_id, product_name, category, price FROM products WHERE product_name LIKE \"%Pro%\";",
    expectedColumns: ["product_id", "product_name", "category", "price"],
    expectedRowCount: 2,
    validateBy: "exact",
    solutionQuery: "SELECT product_id, product_name, category, price FROM products WHERE product_name LIKE '%Pro%';"
  },
  {
    id: 36,
    title: "Count total products",
    difficulty: "Medium",
    slug: "sql-count-global-catalog-records",
    seoTitle: "Inventory Operations KPI Modeling: SQL Master COUNT Guides",
    metaDescription: "Verify system dataset framework volumes seamlessly using continuous full database row scanning commands.",
    tags: ["Record Monitoring", "Aggregate Operators", "Operations KPIs"],
    description: "Return the total number of products as total_products.",
    explanation: "COUNT(*) counts all rows in a table.",
    scenario: "Operations teams track total active catalog size weekly.",
    useCases: [
      "Inventory reporting",
      "Catalog monitoring",
      "Dashboard KPIs"
    ],
    hint: "Use COUNT(*) AS total_products.",
    starterQuery: "SELECT COUNT(*) AS total_products FROM products;",
    expectedColumns: ["total_products"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT COUNT(*) AS total_products FROM products;"
  },
  {
    id: 37,
    title: "Find unique product categories",
    difficulty: "Medium",
    slug: "sql-distinct-category-extraction",
    seoTitle: "Navigation Menu Modeling: Extracting Distinct SQL Frameworks",
    metaDescription: "Generate navigation hierarchies for web architectures by evaluating structural unique column vectors.",
    tags: ["Menu Architecture", "Data Profiling", "Uniqueness Auditing"],
    description: "Return a unique list of categories from the products table.",
    explanation: "DISTINCT removes duplicate values.",
    scenario: "Frontend teams need categories for navigation menus.",
    useCases: [
      "Menu generation",
      "Category reporting",
      "Data profiling"
    ],
    hint: "Use SELECT DISTINCT category.",
    starterQuery: "SELECT DISTINCT category FROM products;",
    expectedColumns: ["category"],
    expectedRowCount: 3,
    validateBy: "exact",
    solutionQuery: "SELECT DISTINCT category FROM products;"
  },
  {
    id: 38,
    title: "Filter products from multiple categories",
    difficulty: "Medium",
    slug: "sql-where-or-disjunction-multi-category",
    seoTitle: "Cross Department Merchandising: SQL Multi Condition Or Loops",
    metaDescription: "Extract targeted inventory dimensions across disparate internal sectors with optimized row expansion query logic.",
    tags: ["Cross Merchandising", "Logical Statements", "Database Filters"],
    description: "Return product_id, product_name, category, and price for products in either the \"Electronics\" or \"Accessories\" category.",
    explanation: "OR expands filtering to multiple matching conditions.",
    scenario: "Merchandising teams want products from two related departments.",
    useCases: [
      "Multi-category filtering",
      "Department analysis",
      "Product segmentation"
    ],
    hint: "Use category = \"Electronics\" OR category = \"Accessories\".",
    starterQuery: "SELECT product_id, product_name, category, price FROM products WHERE category = \"Electronics\" OR category = \"Accessories\";",
    expectedColumns: ["product_id", "product_name", "category", "price"],
    expectedRowCount: 3,
    validateBy: "exact",
    solutionQuery: "SELECT product_id, product_name, category, price FROM products WHERE category = 'Electronics' OR category = 'Accessories';"
  },
  {
    id: 39,
    title: "Find products by ID range",
    difficulty: "Medium",
    slug: "sql-between-operator-product-id-range",
    seoTitle: "SQL Range Queries: Filtering Primary Key IDs via BETWEEN",
    metaDescription: "Learn how to capture precise, inclusive sequential numerical chunks inside structural databases using standard SQL BETWEEN logic.",
    tags: ["Range Queries", "BETWEEN Clause", "ID Filtering"],
    description: "Return product_id, product_name, category, and price for products with product_id between 2 and 4.",
    explanation: "BETWEEN filters values inclusively within a range.",
    scenario: "Engineers are auditing a range of product IDs after a migration.",
    useCases: [
      "Batch processing",
      "ID filtering",
      "Audit reviews"
    ],
    hint: "Use BETWEEN 2 AND 4.",
    starterQuery: "SELECT product_id, product_name, category, price FROM products WHERE product_id BETWEEN 2 AND 4;",
    expectedColumns: ["product_id", "product_name", "category", "price"],
    expectedRowCount: 3,
    validateBy: "exact",
    solutionQuery: "SELECT product_id, product_name, category, price FROM products WHERE product_id BETWEEN 2 AND 4;"
  },
  {
    id: 40,
    title: "Find highest and lowest product prices",
    difficulty: "Medium",
    slug: "sql-min-max-product-pricing-bounds",
    seoTitle: "Catalog Boundary Auditing: SQL MIN and MAX Pricing Functions",
    metaDescription: "Master pricing floor and ceiling evaluation techniques over continuous e-commerce catalog variables using fast SQL min/max aggregate syntax.",
    tags: ["Aggregate Functions", "Pricing Boundaries", "Data Profiling"],
    description: "Return the minimum and maximum product prices.",
    explanation: "MIN() and MAX() identify pricing boundaries.",
    scenario: "Executives want to understand the pricing range of the catalog.",
    useCases: [
      "Pricing analysis",
      "Catalog summaries",
      "Revenue planning"
    ],
    hint: "Use MIN(price) AS min_price and MAX(price) AS max_price.",
    starterQuery: "SELECT MIN(price) AS min_price, MAX(price) AS max_price FROM products;",
    expectedColumns: ["min_price", "max_price"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT MIN(price) AS min_price, MAX(price) AS max_price FROM products;"
  },      
  {
    id: 41,
    title: "Find customer by exact name",
    difficulty: "Medium",
    slug: "sql-exact-string-matching-where-equals",
    seoTitle: "Database Record Lookup: SQL Exact Text Matching Guide",
    metaDescription: "Examine single quote exact literal matching patterns over text string vectors inside database components using the standard equals operator.",
    tags: ["Text Matching", "WHERE Clause", "Account Discovery"],
    description: "Return the customer_id of the customer named \"David Brown\".",
    explanation: "Exact text matching uses the equals operator.",
    scenario: "Support teams are searching for a specific customer account.",
    useCases: [
      "Customer lookup",
      "Support workflows",
      "Account verification"
    ],
    hint: "Use WHERE customer_name = \"David Brown\". Return only customer_id.",
    starterQuery: "SELECT customer_id FROM customers WHERE customer_name = \"David Brown\";",
    expectedColumns: ["customer_id"],
    expectedRowCount: 1,
    validateBy: "row_ids",
    solutionQuery: "SELECT customer_id FROM customers WHERE customer_name = 'David Brown';"
  },
  {
    id: 42,
    title: "View customer orders and totals",
    difficulty: "Medium",
    slug: "sql-order-by-sorting-customer-ids",
    seoTitle: "Relational Result Set Sorting: SQL ORDER BY Key Patterns",
    metaDescription: "Organize output lines by sorting columns. Learn how to arrange multiple foreign keys systematically across your analytics matrix layouts.",
    tags: ["ORDER BY Clause", "Data Organization", "Spend Analytics"],
    description: "Return customer_id and total_amount from orders sorted by customer_id.",
    explanation: "ORDER BY organizes results for easier analysis.",
    scenario: "Finance analysts are reviewing customer spending patterns.",
    useCases: [
      "Revenue review",
      "Order analysis",
      "Customer spend checks"
    ],
    hint: "Use ORDER BY customer_id.",
    starterQuery: "SELECT customer_id, total_amount FROM orders ORDER BY customer_id;",
    expectedColumns: ["customer_id", "total_amount"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT customer_id, total_amount FROM orders ORDER BY customer_id;"
  },
  {
    id: 43,
    title: "Find low-value orders",
    difficulty: "Medium",
    slug: "sql-less-than-operator-numeric-threshold",
    seoTitle: "Segmenting Datasets: Using SQL Less Than Operator",
    metaDescription: "Filter elements falling below specific economic boundaries instantly. Use mathematical operators inside conditional blocks.",
    tags: ["Numeric Filters", "Transactional Analysis", "Segmentation"],
    description: "Return the order_id of orders where total_amount is less than 200.",
    explanation: "The < operator filters values below a threshold.",
    scenario: "Finance teams analyze small-value transactions separately.",
    useCases: [
      "Small order analysis",
      "Transaction segmentation",
      "Pricing studies"
    ],
    hint: "Use WHERE total_amount < 200. Return only order_id.",
    starterQuery: "SELECT order_id FROM orders WHERE total_amount < 200;",
    expectedColumns: ["order_id"],
    expectedRowCount: 2,
    validateBy: "row_ids",
    solutionQuery: "SELECT order_id FROM orders WHERE total_amount < 200;"
  },
  {
    id: 44,
    title: "Calculate total catalog value",
    difficulty: "Medium",
    slug: "sql-sum-total-catalog-valuation",
    seoTitle: "Inventory Financial Metric Audits: SQL SUM Function Formulas",
    metaDescription: "Calculate immediate mathematical evaluations across all dataset components using standard database column accumulation layers.",
    tags: ["SUM Operator", "Financial Modeling", "Inventory Audits"],
    description: "Return the total sum of all product prices as catalog_value.",
    explanation: "SUM() calculates totals across rows.",
    scenario: "Business teams estimate total catalog revenue potential.",
    useCases: [
      "Catalog valuation",
      "Financial planning",
      "Inventory analysis"
    ],
    hint: "Use SUM(price) AS catalog_value.",
    starterQuery: "SELECT SUM(price) AS catalog_value FROM products;",
    expectedColumns: ["catalog_value"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT SUM(price) AS catalog_value FROM products;"
  },
  {
    id: 45,
    title: "Find average price by category",
    difficulty: "Medium",
    slug: "sql-avg-conditional-category-benchmarks",
    seoTitle: "E-Commerce Market Intelligence: SQL AVG with Filter Syntax",
    metaDescription: "Isolate specific arithmetic means within structural tables by combining standard AVG operations with exact value text evaluations.",
    tags: ["AVG Operator", "Category Analytics", "Market Benchmarks"],
    description: "Calculate the average price for products in the \"Electronics\" category.",
    explanation: "AVG() combined with WHERE calculates segmented averages.",
    scenario: "Product teams want to benchmark average electronics pricing.",
    useCases: [
      "Category analysis",
      "Pricing benchmarks",
      "Market research"
    ],
    hint: "Use AVG(price) with WHERE category = \"Electronics\".",
    starterQuery: "SELECT AVG(price) AS avg_electronics_price FROM products WHERE category = \"Electronics\";",
    expectedColumns: ["avg_electronics_price"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT AVG(price) AS avg_electronics_price FROM products WHERE category = 'Electronics';"
  },
  {
    id: 46,
    title: "Find Customers With a Gmail Account",
    difficulty: "Medium",
    slug: "sql-find-customers-with-gmail-account",
    seoTitle: "SQL Basics | Find Customers Using Gmail",
    metaDescription: "Learn how to use the LIKE operator to filter email addresses ending with @gmail.com.",
    tags: ["SQL", "Basics", "LIKE", "WHERE"],
    description: "Return the customer_id, customer_name, and email for customers whose email address ends with '@gmail.com'.",
    explanation: "The LIKE operator can be used with '%' as a wildcard. '%@gmail.com' matches all email addresses ending with '@gmail.com'.",
    scenario: "The marketing team wants to send a promotional email only to Gmail users.",
    useCases: [
      "Email campaigns",
      "Customer segmentation",
      "Learning SQL"
    ],
    hint: "Use WHERE email LIKE '%@gmail.com'.",
    starterQuery: "SELECT customer_id, customer_name, email FROM customers WHERE email LIKE '%@gmail.com';",
    expectedColumns: [
      "customer_id",
      "customer_name",
      "email"
    ],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT customer_id, customer_name, email FROM customers WHERE email LIKE '%@gmail.com';"
  },
  {
    id: 47,
    title: "Count orders by date",
    difficulty: "Medium",
    slug: "sql-count-daily-order-volume",
    seoTitle: "Time-Series Performance Diagnostics: SQL COUNT Over Dates",
    metaDescription: "Monitor operational volumes on explicit fiscal points by running global aggregate structures over narrow timestamp constraints.",
    tags: ["COUNT Operator", "Date Constraints", "Operational Volumes"],
    description: "Count how many orders were placed on \"2024-01-10\".",
    explanation: "COUNT(*) combined with WHERE calculates daily order volume.",
    scenario: "Marketing teams measure campaign-day performance.",
    useCases: [
      "Daily order tracking",
      "Campaign analysis",
      "Operational monitoring"
    ],
    hint: "Use COUNT(*) with a filter on order_date = \"2024-01-10\".",
    starterQuery: "SELECT COUNT(*) AS order_count FROM orders WHERE order_date = \"2024-01-10\";",
    expectedColumns: ["order_count"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT COUNT(*) AS order_count FROM orders WHERE order_date = '2024-01-10';"
  },
  {
    id: 48,
    title: "Sort customer names alphabetically",
    difficulty: "Medium",
    slug: "sql-order-by-alphabetical-text-sorting",
    seoTitle: "Directory Modeling Architecture: SQL Alphabetical Sorting Guide",
    metaDescription: "Arrange text string variables cleanly from A to Z using natural database lexical order frameworks.",
    tags: ["ORDER BY ASC", "Lexical Sorting", "Directory Frameworks"],
    description: "Return customer_name sorted alphabetically from A to Z.",
    explanation: "ORDER BY sorts text values alphabetically.",
    scenario: "Customer service teams need an alphabetical customer directory.",
    useCases: [
      "Directory views",
      "CRM exports",
      "Customer organization"
    ],
    hint: "Use ORDER BY customer_name ASC.",
    starterQuery: "SELECT customer_name FROM customers ORDER BY customer_name ASC;",
    expectedColumns: ["customer_name"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT customer_name FROM customers ORDER BY customer_name ASC;"
  },
  {
    id: 49,
    title: "Find orders by specific IDs",
    difficulty: "Medium",
    slug: "sql-in-operator-primary-key-lookup",
    seoTitle: "Targeted Row Extraction: Mastering SQL Primary Key IN Filters",
    metaDescription: "Extract specific relational entities without nested OR chains. Learn how to map lookup records inside array lists.",
    tags: ["IN Operator", "Primary Keys", "Targeted Audits"],
    description: "Return order_id, customer_id, order_date, and total_amount for orders with order_id 1, 3, or 5.",
    explanation: "IN filters rows matching multiple specific values.",
    scenario: "Finance teams are reviewing flagged transactions.",
    useCases: [
      "Audit checks",
      "Manual reviews",
      "Transaction lookups"
    ],
    hint: "Use WHERE order_id IN (1, 3, 5).",
    starterQuery: "SELECT order_id, customer_id, order_date, total_amount FROM orders WHERE order_id IN (1, 3, 5);",
    expectedColumns: ["order_id", "customer_id", "order_date", "total_amount"],
    expectedRowCount: 3,
    validateBy: "exact",
    solutionQuery: "SELECT order_id, customer_id, order_date, total_amount FROM orders WHERE order_id IN (1, 3, 5);"
  },
  {
    id: 50,
    title: "Calculate projected tax per product",
    difficulty: "Medium",
    slug: "sql-dynamic-arithmetic-calculated-columns",
    seoTitle: "Financial Engineering Basics: Generating Calculated SQL Columns",
    metaDescription: "Generate inline mathematical attributes across variable fields natively without restructuring baseline database designs.",
    tags: ["Calculated Fields", "Arithmetic Operators", "Tax Modeling"],
    description: "Return product_name, price, and a calculated 5% tax column.",
    explanation: "Calculated columns can be created directly in SELECT statements.",
    scenario: "Finance teams are estimating sales tax impact on products.",
    useCases: [
      "Tax calculations",
      "Financial forecasting",
      "Dynamic reporting"
    ],
    hint: "Use price * 0.05 AS tax.",
    starterQuery: "SELECT product_name, price, price * 0.05 AS tax FROM products;",
    expectedColumns: ["product_name", "price", "tax"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT product_name, price, price * 0.05 AS tax FROM products;"
  },        
  {
    id: 51,
    title: "Find customer email domains",
    difficulty: "Medium",
    slug: "sql-substr-instr-email-domain-extraction",
    seoTitle: "Advanced String Parsing: SQL SUBSTR and INSTR Guide",
    metaDescription: "Isolate string subsections by locating exact index characters natively. Extract email domains from database tables easily.",
    tags: ["String Processing", "SUBSTR Function", "INSTR Finder"],
    description: "Return customer_name and the email domain from the email column.",
    explanation: "String functions can extract parts of text values like email domains.",
    scenario: "Marketing teams want to analyze which email providers customers use most.",
    useCases: [
      "Domain analysis",
      "Customer segmentation",
      "Email provider reporting"
    ],
    hint: "Use SUBSTR and INSTR functions",
    starterQuery: "SELECT customer_name, SUBSTR(email, INSTR(email, '@') + 1) AS domain FROM customers;",
    expectedColumns: ["customer_name", "domain"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT customer_name, SUBSTR(email, INSTR(email, '@') + 1) AS domain FROM customers;"
  },
  {
    id: 52,
    title: "Find Orders Using Cash on Delivery",
    difficulty: "Medium",
    slug: "sql-orders-using-cash-on-delivery",
    seoTitle: "SQL Basics | IN Operator",
    metaDescription: "Learn how to filter multiple values using the IN operator.",
    tags: ["SQL", "Basics", "IN"],
    description: "Return the payment_id, order_id, payment_method, and amount for payments made using either 'cod' or 'cash on delivery'.",
    explanation: "The IN operator is used to match one of several possible values without writing multiple OR conditions.",
    scenario: "The finance team wants to review all cash-on-delivery payments.",
    useCases: [
      "Payment reporting",
      "Order analysis",
      "Learning SQL"
    ],
    hint: "Use WHERE payment_method IN (...).",
    starterQuery: "SELECT payment_id, order_id, payment_method, amount FROM payments WHERE payment_method IN ('cod','cash on delivery');",
    expectedColumns: [
      "payment_id",
      "order_id",
      "payment_method",
      "amount"
    ],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT payment_id, order_id, payment_method, amount FROM payments WHERE payment_method IN ('cod','cash on delivery');"
  },
  {
    id: 53,
    title: "Find Customers Whose Name Starts With 'A'",
    difficulty: "Medium",
    slug: "sql-customers-name-starts-with-a",
    seoTitle: "SQL Basics | LIKE Operator",
    metaDescription: "Learn how to search text using the LIKE operator.",
    tags: ["SQL", "Basics", "LIKE"],
    description: "Return the customer_id, customer_name, and email for customers whose name starts with the letter 'A'.",
    explanation: "The LIKE operator supports pattern matching. 'A%' returns all values that begin with the letter A.",
    scenario: "The support team wants to quickly locate customers whose names start with A.",
    useCases: [
      "Customer search",
      "Pattern matching",
      "Learning SQL"
    ],
    hint: "Use LIKE 'A%'.",
    starterQuery: "SELECT customer_id, customer_name, email FROM customers WHERE customer_name LIKE 'A%';",
    expectedColumns: [
      "customer_id",
      "customer_name",
      "email"
    ],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT customer_id, customer_name, email FROM customers WHERE customer_name LIKE 'A%';"
  },
  {
    id: 54,
    title: "Sort products by category and price",
    difficulty: "Medium",
    slug: "sql-multi-column-order-by-asc-desc",
    seoTitle: "Complex Report Organization: SQL Multi-Column Sorting Rules",
    metaDescription: "Nest logical sorting components systematically. Order classifications in ascending order while ranking inner financial metrics descending.",
    tags: ["ORDER BY Syntax", "Nested Sorting", "Catalog Controls"],
    description: "Return all product columns sorted by category ascending and price descending.",
    explanation: "ORDER BY supports sorting using multiple columns.",
    scenario: "Catalog managers want grouped categories with premium items shown first.",
    useCases: [
      "Catalog organization",
      "Advanced sorting",
      "Product displays"
    ],
    hint: "Use ORDER BY category ASC, price DESC.",
    starterQuery: "SELECT * FROM products ORDER BY category ASC, price DESC;",
    expectedColumns: ["product_id", "product_name", "category", "price"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT * FROM products ORDER BY category ASC, price DESC;"
  },
  {
    id: 55,
    title: "Find Orders Placed This Year",
    difficulty: "Medium",
    slug: "sql-find-orders-this-year",
    seoTitle: "SQL Basics | Filter by Year",
    metaDescription: "Learn how to filter dates using the strftime() function in SQLite.",
    tags: ["SQL", "Basics", "Date Functions", "WHERE"],
    description: "Return the order_id and order_date for all orders placed in 2024.",
    explanation: "The strftime() function extracts parts of a date. It is commonly used in SQLite to filter by year.",
    scenario: "The finance team wants to review all orders placed during 2024.",
    useCases: [
      "Date filtering",
      "Sales reporting",
      "Learning SQL"
    ],
    hint: "Use strftime('%Y', order_date).",
    starterQuery: "SELECT order_id, order_date FROM orders WHERE strftime('%Y', order_date) = '2024';",
    expectedColumns: [
      "order_id",
      "order_date"
    ],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT order_id, order_date FROM orders WHERE strftime('%Y', order_date) = '2024';"
  },
  {
    id: 56,
    title: "Find the Product With the Longest Name",
    difficulty: "Medium",
    slug: "sql-find-product-with-longest-name",
    seoTitle: "SQL Basics | LENGTH Function",
    metaDescription: "Learn how to use the LENGTH function to measure text.",
    tags: ["SQL", "Basics", "LENGTH", "ORDER BY"],
    description: "Return the product_id, product_name, and the number of characters in the product name.",
    explanation: "LENGTH() returns the number of characters in a string. Combine it with ORDER BY and LIMIT to find the longest value.",
    scenario: "The UI team wants to identify products with very long names.",
    useCases: [
      "Data profiling",
      "UI testing",
      "Learning SQL"
    ],
    hint: "Use LENGTH(product_name) and ORDER BY DESC.",
    starterQuery: "SELECT product_id, product_name, LENGTH(product_name) AS name_length FROM products ORDER BY name_length DESC LIMIT 1;",
    expectedColumns: [
      "product_id",
      "product_name",
      "name_length"
    ],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT product_id, product_name, LENGTH(product_name) AS name_length FROM products ORDER BY name_length DESC LIMIT 1;"
  },
  {
    id: 57,
    title: "Calculate Revenue by Customer",
    difficulty: "Medium",
    slug: "sql-calculate-revenue-by-customer",
    seoTitle: "SQL Basics | SUM with GROUP BY",
    metaDescription: "Learn how to calculate revenue for each customer using SUM and GROUP BY.",
    tags: ["SQL", "Basics", "SUM", "GROUP BY"],
    description: "Calculate the total revenue generated by each customer.",
    explanation: "SUM() calculates the total value, while GROUP BY creates one result for each customer.",
    scenario: "The sales team wants to know how much revenue each customer has generated.",
    useCases: [
      "Revenue reporting",
      "Customer analytics",
      "Learning SQL"
    ],
    hint: "Group by customer_id.",
    starterQuery: "SELECT customer_id, ROUND(SUM(total_amount),2) AS total_revenue FROM orders GROUP BY customer_id;",
    expectedColumns: [
      "customer_id",
      "total_revenue"
    ],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT customer_id, ROUND(SUM(total_amount),2) AS total_revenue FROM orders GROUP BY customer_id;"
  },
  {
    id: 58,
    title: "Find Products Costing More Than the Average Price",
    difficulty: "Medium",
    slug: "sql-products-above-average-price",
    seoTitle: "SQL Basics | Subquery with AVG",
    metaDescription: "Learn how to compare values against the average using a subquery.",
    tags: ["SQL", "Basics", "AVG", "Subquery"],
    description: "Return the product_id, product_name, and price for products priced above the average product price.",
    explanation: "A subquery can calculate the average price first, then the outer query filters products above that value.",
    scenario: "The merchandising team wants to identify premium-priced products.",
    useCases: [
      "Price analysis",
      "Business reporting",
      "Learning SQL"
    ],
    hint: "Compare price against AVG(price) in a subquery.",
    starterQuery: "SELECT product_id, product_name, price FROM products WHERE price > (SELECT AVG(price) FROM products);",
    expectedColumns: [
      "product_id",
      "product_name",
      "price"
    ],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT product_id, product_name, price FROM products WHERE price > (SELECT AVG(price) FROM products);"
  },
  {
    id: 59,
    title: "Find customers starting with Alice",
    difficulty: "Medium",
    slug: "sql-like-operator-prefix-wildcard-matching",
    seoTitle: "Identity Lookup Controls: SQL Prefix Wildcard Search Logic",
    metaDescription: "Execute rapid string classification lookups over name fields using clean single-sided string wildcards.",
    tags: ["LIKE Search", "Prefix Matching", "Identity Controls"],
    description: "Return the customer_id of customers whose name starts with \"Alice\".",
    explanation: "LIKE with a trailing wildcard performs prefix matching.",
    scenario: "Customer support is searching for customers named Alice.",
    useCases: [
      "Prefix searching",
      "Customer lookup",
      "CRM filtering"
    ],
    hint: "Use LIKE \"Alice%\". Return only customer_id.",
    starterQuery: "SELECT customer_id FROM customers WHERE customer_name LIKE \"Alice%\";",
    expectedColumns: ["customer_id"],
    expectedRowCount: 1,
    validateBy: "row_ids",
    solutionQuery: "SELECT customer_id FROM customers WHERE customer_name LIKE 'Alice%';"
  },
  {
    id: 60,
    title: "Calculate tax-inclusive prices",
    difficulty: "Medium",
    slug: "sql-dynamic-multiplication-tax-estimation",
    seoTitle: "Checkout Systems Logic: Generating Real-Time Dynamic SQL Multipliers",
    metaDescription: "Compute real-time transactional pricing states inside output queries by deploying inline mathematical factor operations.",
    tags: ["Dynamic Metrics", "Arithmetic Formulas", "Checkout Logistics"],
    description: "Return product_name, price, and price including 15% tax.",
    explanation: "Calculated columns can apply taxes or discounts dynamically.",
    scenario: "Checkout pages need to display tax-inclusive pricing.",
    useCases: [
      "Tax calculations",
      "Price estimation",
      "Checkout systems"
    ],
    hint: "Use price * 1.15",
    starterQuery: "SELECT product_name, price, price * 1.15 AS total_cost FROM products;",
    expectedColumns: ["product_name", "price", "total_cost"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT product_name, price, price * 1.15 AS total_cost FROM products;"
  },
  {
    id: 61,
    title: "Find orders above average value",
    difficulty: "Medium+",
    slug: "sql-greater-than-operator-above-average-orders",
    seoTitle: "Identifying Outliers: Using SQL Greater Than Operator for Order Tracking",
    metaDescription: "Isolate transactions that pass a benchmark floor. Learn how to construct basic conditional logic over relational numeric vectors.",
    tags: ["Numeric Filters", "WHERE Clause", "Outlier Analysis"],
    description: "Return the order_id of orders where total_amount is greater than 262.",
    explanation: "Threshold filtering helps identify high-value transactions.",
    scenario: "Finance teams review above-average orders for analysis.",
    useCases: [
      "Revenue analysis",
      "High-value transactions",
      "Performance reviews"
    ],
    hint: "Use WHERE total_amount > 262. Return only order_id.",
    starterQuery: "SELECT order_id FROM orders WHERE total_amount > 262;",
    expectedColumns: ["order_id"],
    expectedRowCount: 2,
    validateBy: "row_ids",
    solutionQuery: "SELECT order_id FROM orders WHERE total_amount > 262;"
  },
  {
    id: 62,
    title: "Find customers without email.com",
    difficulty: "Medium+",
    slug: "sql-not-like-operator-domain-exclusion",
    seoTitle: "Database Record Segmentation: Mastering SQL NOT LIKE String Exclusions",
    metaDescription: "Exclude primary communication vectors or specific domains cleanly by utilizing standard negative text pattern search structures.",
    tags: ["Negative Matching", "String Operators", "Data Segmentation"],
    description: "Return customer_id, customer_name, email, and created_date for customers whose email does not end with \"@email.com\".",
    explanation: "NOT LIKE excludes matching text patterns.",
    scenario: "Marketing wants customers using alternative email providers.",
    useCases: [
      "Domain filtering",
      "Email analysis",
      "Customer segmentation"
    ],
    hint: "Use NOT LIKE \"%@email.com\".",
    starterQuery: "SELECT customer_id, customer_name, email, created_date FROM customers WHERE email NOT LIKE \"%@email.com\";",
    expectedColumns: ["customer_id", "customer_name", "email", "created_date"],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT customer_id, customer_name, email, created_date FROM customers WHERE email NOT LIKE '%@email.com';"
  },
  {
    id: 63,
    title: "Count unique product categories",
    difficulty: "Medium+",
    slug: "sql-count-distinct-unique-categories",
    seoTitle: "Catalog Diversity Diagnostics: SQL COUNT DISTINCT Aggregations",
    metaDescription: "Calculate exact unique categorical instances within single relational arrays while ignoring duplicate item instances.",
    tags: ["Aggregate Functions", "DISTINCT Keyword", "Catalog Diversity"],
    description: "Return the number of unique categories in products.",
    explanation: "COUNT(DISTINCT column) counts unique values only.",
    scenario: "Leadership wants to know catalog diversity.",
    useCases: [
      "Catalog overview",
      "Category analysis",
      "Business metrics"
    ],
    hint: "Use COUNT(DISTINCT category).",
    starterQuery: "SELECT COUNT(DISTINCT category) AS unique_categories FROM products;",
    expectedColumns: ["unique_categories"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT COUNT(DISTINCT category) AS unique_categories FROM products;"
  },
  {
    id: 64,
    title: "Find orders from 2024",
    difficulty: "Medium+",
    slug: "sql-like-date-prefix-year-filtering",
    seoTitle: "Time-Series Query Methods: Filtering ISO Dates Using SQL LIKE",
    metaDescription: "Extract chronological ranges efficiently from ISO standard fields using prefix wildcards inside text evaluation filters.",
    tags: ["Date Filtering", "Wildcard Operators", "Annual Reporting"],
    description: "Return the order_id of all orders placed in 2024.",
    explanation: "LIKE can filter dates by year when stored in ISO format.",
    scenario: "Finance teams are building yearly revenue reports.",
    useCases: [
      "Yearly reporting",
      "YTD analysis",
      "Historical reporting"
    ],
    hint: "Use WHERE order_date LIKE \"2024%\". Return only order_id.",
    starterQuery: "SELECT order_id FROM orders WHERE order_date LIKE \"2024%\";",
    expectedColumns: ["order_id"],
    expectedRowCount: 5,
    validateBy: "row_ids",
    solutionQuery: "SELECT order_id FROM orders WHERE order_date LIKE '2024%';"
  },
  {
    id: 65,
    title: "Calculate customer total spend",
    difficulty: "Medium+",
    slug: "sql-sum-single-customer-spend",
    seoTitle: "Customer Account Analytics: Running Selective SQL SUM Metrics",
    metaDescription: "Amass a complete transactional summation across single user identities by combining aggregation with focused key qualifiers.",
    tags: ["SUM Function", "Account Analytics", "Financial Aggregations"],
    description: "Calculate total spending for customer_id 1.",
    explanation: "SUM() aggregates all matching rows into one total.",
    scenario: "Customer support needs lifetime spending for a customer.",
    useCases: [
      "Customer billing",
      "Lifetime value",
      "Account support"
    ],
    hint: "Use SUM(total_amount).",
    starterQuery: "SELECT SUM(total_amount) AS customer_total_spend FROM orders WHERE customer_id = 1;",
    expectedColumns: ["customer_total_spend"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT SUM(total_amount) AS customer_total_spend FROM orders WHERE customer_id = 1;"
  },
  {
    id: 66,
    title: "Show the Next 5 Customers",
    difficulty: "Medium+",
    slug: "sql-limit-offset-next-five-customers",
    seoTitle: "SQL Basics | LIMIT and OFFSET",
    metaDescription: "Learn how to use LIMIT and OFFSET together to paginate query results.",
    tags: ["SQL", "Basics", "LIMIT", "OFFSET"],
    description: "Display five customers after skipping the first five customers.",
    explanation: "OFFSET skips a specified number of rows before LIMIT returns the requested number of rows.",
    scenario: "Your application loads customers page by page.",
    useCases: [
      "Pagination",
      "Data browsing",
      "Learning SQL"
    ],
    hint: "Use LIMIT 5 OFFSET 5.",
    starterQuery: "SELECT customer_id, customer_name, email FROM customers LIMIT 5 OFFSET 5;",
    expectedColumns: [
      "customer_id",
      "customer_name",
      "email"
    ],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT customer_id, customer_name, email FROM customers LIMIT 5 OFFSET 5;"
  },
  {
    id: 67,
    title: "Find the Average Price of Each Category",
    difficulty: "Medium+",
    slug: "sql-average-price-each-category",
    seoTitle: "SQL Basics | GROUP BY and AVG",
    metaDescription: "Calculate the average product price for each category using GROUP BY.",
    tags: ["SQL", "Basics", "GROUP BY", "AVG"],
    description: "Return each category along with its average product price.",
    explanation: "GROUP BY divides rows into groups and AVG() calculates the average value for each group.",
    scenario: "The merchandising team wants to compare pricing across categories.",
    useCases: [
      "Category reporting",
      "Pricing analysis",
      "Learning SQL"
    ],
    hint: "Group by category.",
    starterQuery: "SELECT category, ROUND(AVG(price),2) AS average_price FROM products GROUP BY category;",
    expectedColumns: [
      "category",
      "average_price"
    ],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT category, ROUND(AVG(price),2) AS average_price FROM products GROUP BY category;"
  },
  {
    id: 68,
    title: "Find Customers With Yahoo Email Addresses",
    difficulty: "Medium+",
    slug: "sql-customers-with-yahoo-email",
    seoTitle: "SQL Basics | LIKE Wildcard Search",
    metaDescription: "Use the LIKE operator to search for email addresses ending with @yahoo.com.",
    tags: ["SQL", "Basics", "LIKE"],
    description: "Return the customer ID, customer name, and email for customers using Yahoo email addresses.",
    explanation: "LIKE supports wildcard matching using the % symbol.",
    scenario: "The marketing team wants to segment Yahoo users.",
    useCases: [
      "Customer segmentation",
      "Email campaigns",
      "Learning SQL"
    ],
    hint: "Use LIKE '%@yahoo.com'.",
    starterQuery: "SELECT customer_id, customer_name, email FROM customers WHERE email LIKE '%@yahoo.com';",
    expectedColumns: [
      "customer_id",
      "customer_name",
      "email"
    ],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT customer_id, customer_name, email FROM customers WHERE email LIKE '%@yahoo.com';"
  },
  {
    id: 69,
    title: "Calculate Total Cost for Five Products",
    difficulty: "Medium+",
    slug: "sql-calculate-total-cost-five-products",
    seoTitle: "SQL Basics | Arithmetic Expressions",
    metaDescription: "Learn how to perform arithmetic calculations in SQL queries.",
    tags: ["SQL", "Basics", "Arithmetic"],
    description: "Return the product name along with the total cost of buying five units.",
    explanation: "SQL allows arithmetic expressions directly inside the SELECT statement.",
    scenario: "The sales team wants to prepare quotations for customers purchasing five units.",
    useCases: [
      "Sales quotations",
      "Price calculations",
      "Learning SQL"
    ],
    hint: "Multiply price by 5.",
    starterQuery: "SELECT product_name, price * 5 AS total_cost FROM products;",
    expectedColumns: [
      "product_name",
      "total_cost"
    ],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT product_name, price * 5 AS total_cost FROM products;"
  },
  {
    id: 70,
    title: "Find Orders With Total Amount Greater Than 1000",
    difficulty: "Medium+",
    slug: "sql-orders-total-amount-greater-than-1000",
    seoTitle: "SQL Basics | Numeric Filtering",
    metaDescription: "Filter orders based on their total amount using comparison operators.",
    tags: ["SQL", "Basics", "WHERE", "Comparison"],
    description: "Return the order ID, customer ID, order date, and total amount for orders where the total amount is greater than 1000.",
    explanation: "Comparison operators allow filtering numeric values based on a condition.",
    scenario: "The finance team wants to review high-value orders.",
    useCases: [
      "Revenue analysis",
      "Order reporting",
      "Learning SQL"
    ],
    hint: "Use WHERE total_amount > 1000.",
    starterQuery: "SELECT order_id, customer_id, order_date, total_amount FROM orders WHERE total_amount > 1000;",
    expectedColumns: [
      "order_id",
      "customer_id",
      "order_date",
      "total_amount"
    ],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT order_id, customer_id, order_date, total_amount FROM orders WHERE total_amount > 1000;"
  },
  {
    id: 71,
    title: "Find customers with 'John' in email",
    difficulty: "Medium+",
    slug: "sql-like-wildcard-anywhere-substring-match",
    seoTitle: "Account Recovery Operations: Utilizing SQL Mid-String Wildcards",
    metaDescription: "Search text variables efficiently by tracking specific internal substrings using dual percentage wildcard parameters.",
    tags: ["LIKE Searches", "Pattern Matching", "Identity Audits"],
    description: "Return the customer_id of customers whose email contains the text \"john\".",
    explanation: "LIKE with wildcards (%) helps search for partial matches inside text values.",
    scenario: "Support teams are helping a customer who only remembers part of their email address.",
    useCases: [
      "Account recovery",
      "Customer search",
      "Pattern matching"
    ],
    hint: "Use LIKE \"%john%\". Return only customer_id.",
    starterQuery: "SELECT customer_id FROM customers WHERE email LIKE \"%john%\";",
    expectedColumns: ["customer_id"],
    expectedRowCount: 1,
    validateBy: "row_ids",
    solutionQuery: "SELECT customer_id FROM customers WHERE email LIKE '%john%';"
  },    
  {
    id: 72,
    title: "Calculate total revenue for 2024",
    difficulty: "Medium+",
    slug: "sql-sum-annual-revenue-wildcard-dates",
    seoTitle: "Fiscal Close Tracking: Combining SQL SUM with Year Wildcards",
    metaDescription: "Aggregate cumulative transaction volumes for complete yearly boundaries by matching string prefixes on date types.",
    tags: ["SUM Function", "Date Restraints", "Revenue Close"],
    description: "Calculate the total revenue from all orders placed in 2024.",
    explanation: "SUM() combined with WHERE helps calculate totals for a specific period.",
    scenario: "Finance teams are preparing yearly revenue reports.",
    useCases: [
      "Revenue tracking",
      "Yearly reporting",
      "Business KPIs"
    ],
    hint: "Use SUM(total_amount) with WHERE order_date LIKE \"2024%\".",
    starterQuery: "SELECT SUM(total_amount) AS total_2024_revenue FROM orders WHERE order_date LIKE \"2024%\";",
    expectedColumns: ["total_2024_revenue"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT SUM(total_amount) AS total_2024_revenue FROM orders WHERE order_date LIKE '2024%';"
  },
  {
    id: 73,
    title: "Sort products by category descending",
    difficulty: "Medium+",
    slug: "sql-order-by-descending-alphabetical-sorting",
    seoTitle: "Reverse Index Organization: SQL ORDER BY DESC Lexical Logic",
    metaDescription: "Reorder output sequences from Z to A by appending descending indicators onto textual classification columns.",
    tags: ["ORDER BY Clause", "Reverse Sorting", "Catalog Indexing"],
    description: "Return all product columns sorted by category from Z to A.",
    explanation: "DESC sorts text values in reverse alphabetical order.",
    scenario: "Catalog managers want to review product categories in reverse order.",
    useCases: [
      "Catalog organization",
      "Sorting",
      "Inventory review"
    ],
    hint: "Use ORDER BY category DESC.",
    starterQuery: "SELECT * FROM products ORDER BY category DESC;",
    expectedColumns: ["product_id", "product_name", "category", "price"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT * FROM products ORDER BY category DESC;"
  },
  {
    id: 74,
    title: "Find Products in the Electronics Category",
    difficulty: "Medium+",
    slug: "sql-find-products-in-electronics-category",
    seoTitle: "SQL Basics | Filter Products by Category",
    metaDescription: "Learn how to filter rows using the WHERE clause with text values.",
    tags: ["SQL", "Basics", "WHERE"],
    description: "Return the product ID, product name, category, and price for all products in the 'Electronics' category.",
    explanation: "The WHERE clause filters rows that match a specific text value.",
    scenario: "The inventory team wants to review all electronic products currently available.",
    useCases: [
      "Inventory management",
      "Category reporting",
      "Learning SQL"
    ],
    hint: "Use WHERE category = 'Electronics'.",
    starterQuery: "SELECT product_id, product_name, category, price FROM products WHERE category = 'Electronics';",
    expectedColumns: [
      "product_id",
      "product_name",
      "category",
      "price"
    ],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT product_id, product_name, category, price FROM products WHERE category = 'Electronics';"
  },
  {
    id: 75,
    title: "Calculate average order value",
    difficulty: "Medium+",
    slug: "sql-avg-global-average-order-value",
    seoTitle: "E-Commerce Operational KPIs: Using SQL AVG for AOV Calculations",
    metaDescription: "Determine fundamental purchase behaviors instantly by finding the true arithmetic center across global sales records.",
    tags: ["AVG Operator", "Metric Baselines", "AOV Tracking"],
    description: "Find the average total_amount from all orders.",
    explanation: "AVG() calculates the mean value of numeric columns.",
    scenario: "Business teams monitor Average Order Value (AOV).",
    useCases: [
      "AOV tracking",
      "Revenue analysis",
      "Business metrics"
    ],
    hint: "Use AVG(total_amount).",
    starterQuery: "SELECT AVG(total_amount) AS avg_order_value FROM orders;",
    expectedColumns: ["avg_order_value"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT AVG(total_amount) AS avg_order_value FROM orders;"
  },
  {
    id: 76,
    title: "Find top 2 expensive products",
    difficulty: "Hard",
    slug: "sql-order-by-desc-limit-ranking-bounds",
    seoTitle: "High-Tier Merchandising: SQL Sorting and Limit Row Restraints",
    metaDescription: "Extract the highest-ranking records securely by combining descending parameters with strict structural array size constraints.",
    tags: ["ORDER BY Clause", "LIMIT Restriction", "Premium Analysis"],
    description: "Return all columns for the 2 most expensive products.",
    explanation: "ORDER BY DESC combined with LIMIT returns top-valued rows.",
    scenario: "The homepage should highlight premium products.",
    useCases: [
      "Premium product analysis",
      "Top-N reporting",
      "Catalog merchandising"
    ],
    hint: "Use ORDER BY price DESC LIMIT 2.",
    starterQuery: "SELECT * FROM products ORDER BY price DESC LIMIT 2;",
    expectedColumns: ["product_id", "product_name", "category", "price"],
    expectedRowCount: 2,
    validateBy: "exact",
    solutionQuery: "SELECT * FROM products ORDER BY price DESC LIMIT 2;"
  },
  {
    id: 77,
    title: "Find Customers From India or USA",
    difficulty: "Hard",
    slug: "sql-customers-from-india-or-usa",
    seoTitle: "SQL Basics | IN Operator with Text Values",
    metaDescription: "Learn how to filter multiple text values using the IN operator.",
    tags: ["SQL", "Basics", "IN"],
    description: "Return the customer ID, customer name, and country for customers who are from either India or the USA.",
    explanation: "The IN operator matches rows where a column equals any value in a list.",
    scenario: "The marketing team is launching a campaign targeting customers in India and the USA.",
    useCases: [
      "Customer segmentation",
      "Regional reporting",
      "Learning SQL"
    ],
    hint: "Use WHERE country IN ('India', 'USA').",
    starterQuery: "SELECT customer_id, customer_name, country FROM customers WHERE country IN ('India', 'USA');",
    expectedColumns: [
      "customer_id",
      "customer_name",
      "country"
    ],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT customer_id, customer_name, country FROM customers WHERE country IN ('India', 'USA');"
  },
  {
    id: 78,
    title: "Find Mid-Value Orders",
    difficulty: "Hard",
    slug: "sql-find-mid-value-orders",
    seoTitle: "SQL Basics | BETWEEN Operator",
    metaDescription: "Learn how to filter rows within a range using the BETWEEN operator.",
    tags: ["SQL", "Basics", "BETWEEN", "WHERE"],
    description: "Return the order ID, customer ID, and total amount for orders whose total amount is between 100 and 200.",
    explanation: "The BETWEEN operator filters values within a specified range, including both the lower and upper limits.",
    scenario: "The finance team wants to analyze medium-value customer orders.",
    useCases: [
      "Revenue analysis",
      "Order filtering",
      "Learning SQL"
    ],
    hint: "Use WHERE total_amount BETWEEN 100 AND 200.",
    starterQuery: "SELECT order_id, customer_id, total_amount FROM orders WHERE total_amount BETWEEN 100 AND 200;",
    expectedColumns: [
      "order_id",
      "customer_id",
      "total_amount"
    ],
    expectedRowCount: 16,
    validateBy: "exact",
    solutionQuery: "SELECT order_id, customer_id, total_amount FROM orders WHERE total_amount BETWEEN 100 AND 200;"
  },
  {
    id: 79,
    title: "Rename aggregate column",
    difficulty: "Hard",
    slug: "sql-as-alias-column-renaming",
    seoTitle: "Schema Output Standardization: Implementing SQL AS Column Aliases",
    metaDescription: "Create developer-friendly semantic naming keys over calculations using explicit projection remapping methods.",
    tags: ["AS Alias", "Column Remapping", "API Structuring"],
    description: "Count total orders and rename the result as total_transaction_count.",
    explanation: "AS creates readable aliases for output columns.",
    scenario: "Dashboard APIs require specific field names.",
    useCases: [
      "API preparation",
      "Dashboard reporting",
      "Readable outputs"
    ],
    hint: "Use COUNT(*) AS total_transaction_count.",
    starterQuery: "SELECT COUNT(*) AS total_transaction_count FROM orders;",
    expectedColumns: ["total_transaction_count"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT COUNT(*) AS total_transaction_count FROM orders;"
  },
  {
    id: 80,
    title: "Find customers with long names",
    difficulty: "Hard",
    slug: "sql-length-function-conditional-text-filtering",
    seoTitle: "Database Content Profiling: Filtering via SQL LENGTH Thresholds",
    metaDescription: "Isolate character vector boundaries inside user tables by checking dynamic length indicators inside conditional blocks.",
    tags: ["LENGTH Method", "Text Profiling", "Boundary Testing"],
    description: "Return the customer_id of customers whose customer_name length is greater than 12.",
    explanation: "LENGTH() measures text size for filtering.",
    scenario: "Design teams are testing name display limits.",
    useCases: [
      "UI validation",
      "Data profiling",
      "Character limit testing"
    ],
    hint: "Use LENGTH(customer_name) > 12. Return only customer_id.",
    starterQuery: "SELECT customer_id FROM customers WHERE LENGTH(customer_name) > 12;",
    expectedColumns: ["customer_id"],
    expectedRowCount: 4,
    validateBy: "row_ids",
    solutionQuery: "SELECT customer_id FROM customers WHERE LENGTH(customer_name) > 12;"
  },
  {
    id: 81,
    title: "Exclude a product category",
    difficulty: "Hard",
    slug: "sql-not-equal-operator-category-exclusion",
    seoTitle: "Negative Value Filtering: Mastering the SQL Not Equal (<>) Operator",
    metaDescription: "Learn how to filter out specific categorical metrics from your result sets using standard SQL exclusion operators.",
    tags: ["Exclusion Filters", "WHERE Clause", "Catalog Segmentation"],
    description: "Return the product_id of products that are not in the \"Electronics\" category.",
    explanation: "The <> operator excludes rows matching a specific value.",
    scenario: "Marketing teams want all non-electronics products for a separate campaign.",
    useCases: [
      "Category exclusion",
      "Inventory filtering",
      "Catalog segmentation"
    ],
    hint: "Use WHERE category <> \"Electronics\". Return only product_id.",
    starterQuery: "SELECT product_id FROM products WHERE category <> \"Electronics\";",
    expectedColumns: ["product_id"],
    expectedRowCount: 3,
    validateBy: "row_ids",
    solutionQuery: "SELECT product_id FROM products WHERE category <> 'Electronics';"
  },
  {
    id: 82,
    title: "Calculate remaining customer budget",
    difficulty: "Hard",
    slug: "sql-subtraction-arithmetic-calculated-fields",
    seoTitle: "Dynamic Ledger Calculations: Using Subtraction in SQL SELECT Statements",
    metaDescription: "Generate live customer balances directly inside your dataset projections by performing basic mathematical evaluations over variable parameters.",
    tags: ["Calculated Fields", "Arithmetic Operators", "Budget Modeling"],
    description: "Assume a customer has a budget of 1000 and calculate the remaining balance after buying each product.",
    explanation: "SQL supports arithmetic calculations directly inside SELECT statements.",
    scenario: "Sales teams want to show customers how much budget remains after purchases.",
    useCases: [
      "Budget calculations",
      "Pricing comparisons",
      "Customer planning"
    ],
    hint: "Use 1000 - price AS remaining_budget.",
    starterQuery: "SELECT product_name, 1000 - price AS remaining_budget FROM products;",
    expectedColumns: ["product_name", "remaining_budget"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT product_name, 1000 - price AS remaining_budget FROM products;"
  },
  {
    id: 83,
    title: "Display Product Name Length",
    difficulty: "Hard",
    slug: "sql-display-product-name-length",
    seoTitle: "SQL Basics | LENGTH Function",
    metaDescription: "Learn how to use the LENGTH function to calculate the number of characters in a string.",
    tags: ["SQL", "Basics", "LENGTH"],
    description: "Return the product ID, product name, and the number of characters in each product name.",
    explanation: "The LENGTH() function returns the number of characters in a string.",
    scenario: "The UI team wants to understand the length of product names before designing the product listing page.",
    useCases: [
      "Data profiling",
      "UI optimization",
      "Learning SQL"
    ],
    hint: "Use LENGTH(product_name).",
    starterQuery: "SELECT product_id, product_name, LENGTH(product_name) AS name_length FROM products;",
    expectedColumns: [
      "product_id",
      "product_name",
      "name_length"
    ],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT product_id, product_name, LENGTH(product_name) AS name_length FROM products;"
  },
  {
    id: 84,
    title: "Count orders for one customer",
    difficulty: "Hard",
    slug: "sql-count-rows-targeted-where-filter",
    seoTitle: "Account Frequency Metrics: SQL COUNT Combined with Singular ID Filters",
    metaDescription: "Calculate row frequencies for explicit primary identifiers by executing rapid aggregate functions on conditional criteria.",
    tags: ["COUNT Function", "Targeted Tracking", "Account Metrics"],
    description: "Count how many orders customer_id 3 has placed.",
    explanation: "COUNT(*) combined with WHERE counts filtered rows.",
    scenario: "Customer success teams track purchase frequency.",
    useCases: [
      "Customer activity analysis",
      "Order tracking",
      "Loyalty metrics"
    ],
    hint: "Use COUNT(*) WHERE customer_id = 3.",
    starterQuery: "SELECT COUNT(*) AS order_count FROM orders WHERE customer_id = 3;",
    expectedColumns: ["order_count"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT COUNT(*) AS order_count FROM orders WHERE customer_id = 3;"
  },
  {
    id: 85,
    title: "Find orders with whole-number totals",
    difficulty: "Hard",
    slug: "sql-modulo-operator-whole-number-filtering",
    seoTitle: "Data Type Precision Controls: Using SQL Modulo (%) for Rounding Audits",
    metaDescription: "Identify clean, rounded numerical records easily without complex data parsing by applying baseline math modulo rules.",
    tags: ["Modulo Operator", "Data Precision", "Accounting Audits"],
    description: "Return the order_id of orders where total_amount has no decimal values.",
    explanation: "Modulo operations can identify whole numbers.",
    scenario: "Finance teams audit rounded order totals.",
    useCases: [
      "Accounting reviews",
      "Data analysis",
      "Rounding audits"
    ],
    hint: "Use total_amount % 1 = 0. Return only order_id.",
    starterQuery: "SELECT order_id FROM orders WHERE total_amount % 1 = 0;",
    expectedColumns: ["order_id"],
    expectedRowCount: 5,
    validateBy: "row_ids",
    solutionQuery: "SELECT order_id FROM orders WHERE total_amount % 1 = 0;"
  },
  {
    id: 86,
    title: "Select static values",
    difficulty: "Hard",
    slug: "sql-select-static-literals-without-table",
    seoTitle: "Dynamic Report Metadata: Projecting Static Labels and Dates in SQL",
    metaDescription: "Generate inline literal string rows and date indicators directly without querying structural table architectures.",
    tags: ["Static Literals", "Metadata Generation", "Report Labels"],
    description: "Return a static label \"Today\" and the date \"2024-04-16\".",
    explanation: "SQL can return literal values without querying tables.",
    scenario: "Reports often include static labels and report dates.",
    useCases: [
      "Report headers",
      "Static outputs",
      "Data labels"
    ],
    hint: "Use SELECT \"Today\" AS label and \"2024-04-16\" AS report_date.",
    starterQuery: "SELECT \"Today\" AS label, \"2024-04-16\" AS report_date;",
    expectedColumns: ["label", "report_date"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT 'Today' AS label, '2024-04-16' AS report_date;"
  },
  {
    id: 87,
    title: "Find names ending with y",
    difficulty: "Hard",
    slug: "sql-like-operator-suffix-character-matching",
    seoTitle: "Text Search Optimization: Using SQL LIKE Suffix Wildcards",
    metaDescription: "Locate matching text vectors by isolating variable ending structures using single-sided percentage string wildcards.",
    tags: ["LIKE Search", "Pattern Matching", "CRM Lookup"],
    description: "Return customer_id, customer_name, email, and created_date for customers whose names end with the letter \"y\".",
    explanation: "LIKE \"%y\" matches values ending in y.",
    scenario: "Support teams search using partial remembered names.",
    useCases: [
      "Pattern matching",
      "Customer search",
      "CRM lookup"
    ],
    hint: "Use LIKE \"%y\".",
    starterQuery: "SELECT customer_id, customer_name, email, created_date FROM customers WHERE customer_name LIKE \"%y\";",
    expectedColumns: ["customer_id", "customer_name", "email", "created_date"],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT customer_id, customer_name, email, created_date FROM customers WHERE customer_name LIKE '%y';"
  },
  {
    id: 88,
    title: "Find latest order date",
    difficulty: "Hard",
    slug: "sql-max-function-chronological-dates",
    seoTitle: "System Activity Audits: Using SQL MAX over Date Coordinates",
    metaDescription: "Find the newest time metrics inside chronological fields using high-performance relational database aggregation utilities.",
    tags: ["MAX Operator", "Chronological Metrics", "System Freshness"],
    description: "Return the most recent order_date from orders.",
    explanation: "MAX() on dates returns the latest value.",
    scenario: "Operations teams monitor the latest order activity.",
    useCases: [
      "System monitoring",
      "Activity tracking",
      "Business freshness checks"
    ],
    hint: "Use MAX(order_date).",
    starterQuery: "SELECT MAX(order_date) AS latest_order_date FROM orders;",
    expectedColumns: ["latest_order_date"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT MAX(order_date) AS latest_order_date FROM orders;"
  },
  {
    id: 89,
    title: "Convert prices to cents",
    difficulty: "Hard",
    slug: "sql-price-unit-conversion-multiplication",
    seoTitle: "Payment Gateway Architecture: Converting Float Metrics into Integer Cents",
    metaDescription: "Re-index floating point valuations into flat integer arrays cleanly inside query parameters using inline multiplication strategies.",
    tags: ["Calculated Columns", "Unit Conversions", "Payment Integration"],
    description: "Return product_name and price converted to cents.",
    explanation: "Multiplication can transform values into different units.",
    scenario: "Payment gateways require amounts in cents.",
    useCases: [
      "Payment processing",
      "Data conversion",
      "Financial exports"
    ],
    hint: "Use price * 100 AS price_in_cents.",
    starterQuery: "SELECT product_name, price * 100 AS price_in_cents FROM products;",
    expectedColumns: ["product_name", "price_in_cents"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT product_name, price * 100 AS price_in_cents FROM products;"
  },
  {
    id: 90,
    title: "Find Electronics Products",
    difficulty: "Hard",
    slug: "sql-find-electronics-products-like",
    seoTitle: "SQL Basics | LIKE Operator with Categories",
    metaDescription: "Learn how to use the LIKE operator to filter text values in SQL.",
    tags: ["SQL", "Basics", "LIKE"],
    description: "Return the product ID, product name, and category for products whose category contains the word 'Electronics'.",
    explanation: "The LIKE operator searches for text patterns using wildcard characters (%).",
    scenario: "The inventory team wants to list all products that belong to the Electronics category.",
    useCases: [
      "Category filtering",
      "Inventory reporting",
      "Learning SQL"
    ],
    hint: "Use WHERE category LIKE '%Electronics%'.",
    starterQuery: "SELECT product_id, product_name, category FROM products WHERE category LIKE '%Electronics%';",
    expectedColumns: [
      "product_id",
      "product_name",
      "category"
    ],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT product_id, product_name, category FROM products WHERE category LIKE '%Electronics%';"
  },      
  {
    id: 91,
    title: "Find extremely large or small orders",
    difficulty: "Hard",
    slug: "sql-or-operator-compound-outlier-filtering",
    seoTitle: "Fraud Profiling Basics: Combining Multi-Threshold Bounds via SQL OR",
    metaDescription: "Evaluate separated numerical risk states simultaneously across transaction models using structured query conditional connectors.",
    tags: ["OR Disjunction", "Outlier Analysis", "Risk Profiling"],
    description: "Return the order_id of orders where total_amount is above 300 or below 50.",
    explanation: "OR combines multiple filtering conditions.",
    scenario: "Audit teams investigate unusual order amounts.",
    useCases: [
      "Fraud detection",
      "Outlier analysis",
      "Transaction monitoring"
    ],
    hint: "Use total_amount > 300 OR total_amount < 50. Return only order_id.",
    starterQuery: "SELECT order_id FROM orders WHERE total_amount > 300 OR total_amount < 50;",
    expectedColumns: ["order_id"],
    expectedRowCount: 1,
    validateBy: "row_ids",
    solutionQuery: "SELECT order_id FROM orders WHERE total_amount > 300 OR total_amount < 50;"
  },
  {
    id: 92,
    title: "Sort orders by date and amount",
    difficulty: "Hard",
    slug: "sql-order-by-chronological-and-financial-metrics",
    seoTitle: "Logistics Dashboard Design: Sorting Multi-Type SQL Vectors",
    metaDescription: "Arrange output fields sequentially across separate data types, organizing dates forward while ranking transactional costs backward.",
    tags: ["ORDER BY Clause", "Multi-Type Sorting", "Logistics Optimization"],
    description: "Return all order columns sorted by order_date ascending and total_amount descending.",
    explanation: "ORDER BY supports multiple criteria sorting.",
    scenario: "Logistics managers optimize daily shipments by high value.",
    useCases: [
      "Advanced sorting",
      "Shipment optimization",
      "Financial reviews"
    ],
    hint: "Use ORDER BY order_date ASC, total_amount DESC.",
    starterQuery: "SELECT * FROM orders ORDER BY order_date ASC, total_amount DESC;",
    expectedColumns: ["order_id", "customer_id", "order_date", "total_amount"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT * FROM orders ORDER BY order_date ASC, total_amount DESC;"
  },
  {
    id: 93,
    title: "Calculate dynamic inventory discounts",
    difficulty: "Hard",
    slug: "sql-fractional-multiplication-markdown-pricing",
    seoTitle: "E-Commerce Promotional Systems: Dynamic Fractional Pricing in SQL",
    metaDescription: "Project structural warehouse catalog markdown strategies easily by implementing inline mathematical decimal multipliers.",
    tags: ["Calculated Fields", "Decimal Math", "Markdown Systems"],
    description: "Return product_name, price, and a clearance_price with a 25% markdown.",
    explanation: "Subtracting computed fractions updates numeric values dynamically.",
    scenario: "E-commerce apps require batch updates for warehouse clearance pricing.",
    useCases: [
      "Clearance pricing",
      "Promotion planning",
      "Dynamic updates"
    ],
    hint: "Use price * 0.75 AS clearance_price.",
    starterQuery: "SELECT product_name, price, price * 0.75 AS clearance_price FROM products;",
    expectedColumns: ["product_name", "price", "clearance_price"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT product_name, price, price * 0.75 AS clearance_price FROM products;"
  },
  {
    id: 94,
    title: "Find customers registered after specific time",
    difficulty: "Hard",
    slug: "sql-date-comparison-greater-than-equals",
    seoTitle: "Cohort Acquisition Metrics: Comparing Date Constants in SQL",
    metaDescription: "Track marketing user milestones cleanly by evaluating timestamp constraints using logical comparison operators.",
    tags: ["Date Comparison", "Cohort Milestones", "Acquisition Tracking"],
    description: "Return the customer_id of customers registered on or after \"2023-06-01\".",
    explanation: "Comparison operators help filter records based on dates.",
    scenario: "Growth teams review customers acquired after a major campaign launch.",
    useCases: [
      "Cohort analysis",
      "Targeted registration reviews",
      "Sign-up tracking"
    ],
    hint: "Use WHERE created_date >= \"2023-06-01\". Return only customer_id.",
    starterQuery: "SELECT customer_id FROM customers WHERE created_date >= \"2023-06-01\";",
    expectedColumns: ["customer_id"],
    expectedRowCount: 3,
    validateBy: "row_ids",
    solutionQuery: "SELECT customer_id FROM customers WHERE created_date >= '2023-06-01';"
  },
  {
    id: 95,
    title: "Find Delivered Orders",
    difficulty: "Hard",
    slug: "sql-find-shipped-orders",
    seoTitle: "SQL Basics | IN Operator with Multiple Values",
    metaDescription: "Learn how to filter multiple values using the SQL IN operator.",
    tags: ["SQL", "Basics", "IN", "WHERE"],
    description: "Return the order ID, customer ID, and order status for orders that are either 'delivered'.",
    explanation: "The IN operator checks whether a value matches any value in a list, making queries shorter and easier to read than multiple OR conditions.",
    scenario: "The operations team wants to review orders that have already been shipped or successfully delivered.",
    useCases: [
      "Order tracking",
      "Operations reporting",
      "Learning SQL"
    ],
    hint: "Use WHERE order_status IN ('delivered').",
    starterQuery: "SELECT order_id, customer_id, order_status FROM orders WHERE order_status IN ('delivered');",
    expectedColumns: [
      "order_id",
      "customer_id",
      "order_status"
    ],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT order_id, customer_id, order_status FROM orders WHERE order_status IN ('delivered');"
  },
  {
    id: 96,
    title: "Find products with short category strings",
    difficulty: "Hard",
    slug: "sql-length-function-less-than-bound",
    seoTitle: "Database Integrity Mapping: Evaluating String Length Filters",
    metaDescription: "Audit presentation formatting metrics or metadata bounds directly by deploying explicit string length comparison filters.",
    tags: ["LENGTH Method", "Formatting Audits", "Data Mapping"],
    description: "Return product_id, product_name, category, and price where category length is less than 6 characters.",
    explanation: "LENGTH() measures text length for filtering.",
    scenario: "Database managers test UI formatting and text wrapping.",
    useCases: [
      "UI testing",
      "Formatting validations",
      "Tag tracking"
    ],
    hint: "Use LENGTH(category) < 6.",
    starterQuery: "SELECT product_id, product_name, category, price FROM products WHERE LENGTH(category) < 6;",
    expectedColumns: ["product_id", "product_name", "category", "price"],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT product_id, product_name, category, price FROM products WHERE LENGTH(category) < 6;"
  },
  {
    id: 97,
    title: "Calculate cumulative orders sum",
    difficulty: "Hard",
    slug: "sql-sum-global-processed-revenue",
    seoTitle: "Executive Reporting Systems: Calculating Global SUM Revenue Cards",
    metaDescription: "Consolidate absolute transaction data tracks into a single unified financial indicator using standard column accumulation layers.",
    tags: ["SUM Aggregations", "Financial Indicators", "Dashboard Metrics"],
    description: "Return the total value of all orders in a single row.",
    explanation: "SUM() aggregates multiple rows into one result.",
    scenario: "Finance dashboards display overall processed revenue.",
    useCases: [
      "KPI cards",
      "Gross volume estimation",
      "Executive tracking"
    ],
    hint: "Use SUM(total_amount).",
    starterQuery: "SELECT SUM(total_amount) AS total_processed FROM orders;",
    expectedColumns: ["total_processed"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT SUM(total_amount) AS total_processed FROM orders;"
  },
  {
    id: 98,
    title: "Find Customers With .com Email Addresses",
    difficulty: "Hard",
    slug: "sql-find-customers-with-com-email",
    seoTitle: "SQL Basics | LIKE with Email Domains",
    metaDescription: "Learn how to use the LIKE operator to filter email addresses ending with .com.",
    tags: ["SQL", "Basics", "LIKE"],
    description: "Return the customer ID, customer name, and email for customers whose email address ends with '.com'.",
    explanation: "The LIKE operator with '% .com' matches all email addresses ending with '.com'.",
    scenario: "The marketing team wants to target customers using .com email addresses.",
    useCases: [
      "Email filtering",
      "Customer segmentation",
      "Learning SQL"
    ],
    hint: "Use WHERE email LIKE '%.com'.",
    starterQuery: "SELECT customer_id, customer_name, email FROM customers WHERE email LIKE '%.com';",
    expectedColumns: [
      "customer_id",
      "customer_name",
      "email"
    ],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT customer_id, customer_name, email FROM customers WHERE email LIKE '%.com';"
  },
  {
    id: 99,
    title: "Verify valid customer references",
    difficulty: "Hard",
    slug: "sql-greater-than-operator-foreign-key-validation",
    seoTitle: "Relational Architecture Maintenance: Validating Positive Integer Keys",
    metaDescription: "Enforce standard data relationship checks over table connectors by filtering out unassigned or negative identity indexes.",
    tags: ["Numeric Filters", "Relational Integrity", "Key Validations"],
    description: "Return the order_id of orders where customer_id is greater than 0.",
    explanation: "Greater-than filters help validate positive identifier values.",
    scenario: "Data quality checks verify valid customer relationships.",
    useCases: [
      "Integrity checks",
      "Normalization audits",
      "Data maintenance"
    ],
    hint: "Use WHERE customer_id > 0. Return only order_id.",
    starterQuery: "SELECT order_id FROM orders WHERE customer_id > 0;",
    expectedColumns: ["order_id"],
    expectedRowCount: 5,
    validateBy: "row_ids",
    solutionQuery: "SELECT order_id FROM orders WHERE customer_id > 0;"
  },
  {
    id: 100,
    title: "Find average pricing for selected products",
    difficulty: "Hard",
    slug: "sql-avg-combined-with-in-list-filtering",
    seoTitle: "Product Bundle Diagnostics: Running SQL AVG Rules over Target Lists",
    metaDescription: "Isolate structural value metrics across narrow structural array definitions by combining list selection logic with aggregate math tools.",
    tags: ["AVG Operator", "IN List Arrays", "Bundle Evaluation"],
    description: "Calculate the average price for products with product_id 1, 3, and 5.",
    explanation: "AVG() combined with IN calculates averages for a specific subset of products.",
    scenario: "Product managers compare pricing across selected catalog items.",
    useCases: [
      "Bundle evaluation",
      "Target item metrics",
      "Pricing reviews"
    ],
    hint: "Use AVG(price) with WHERE product_id IN (1, 3, 5).",
    starterQuery: "SELECT AVG(price) AS subset_avg FROM products WHERE product_id IN (1, 3, 5);",
    expectedColumns: ["subset_avg"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT AVG(price) AS subset_avg FROM products WHERE product_id IN (1, 3, 5);"
  }
  ];