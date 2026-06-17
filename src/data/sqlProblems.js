export const SQL_PROBLEMS = [
  {
    id: 1,
    title: "Select all customers",
    difficulty: "Easy",
    description: "Return all columns and all rows from the customers table.",
    explanation: "SELECT * is the most fundamental SQL statement. The asterisk (*) is a wildcard that means 'all columns'. FROM tells SQL which table to pull from.",
    scenario: "Your manager asks: 'Can you pull up the full customers table so I can review it?' This is exactly the query you'd write.",
    useCases: ["Quick data inspection", "Verifying a table's structure and contents", "Starting point before writing complex queries"],
    hint: "Use SELECT * FROM customers",
    starterQuery: "SELECT * FROM customers LIMIT 5;",
    expectedColumns: ["customer_id", "customer_name", "email", "signup_date"],
    expectedRowCount: 5,
    validateBy: "row_count",
    solutionQuery: "SELECT * FROM customers LIMIT 5;"
  },
  {
    id: 2,
    title: "Select specific columns",
    difficulty: "Easy",
    description: "Return only the customer_name and email columns from the customers table.",
    explanation: "Instead of selecting all columns, you can name specific ones separated by commas. This improves performance and keeps results clean.",
    scenario: "The marketing team only needs customer names and emails for an email campaign export.",
    useCases: [
      "Exporting marketing lists",
      "Reducing unnecessary data retrieval",
      "Creating cleaner reports"
    ],
    hint: "Select customer_name and email from customers",
    starterQuery: "SELECT * FROM customers LIMIT 5;",
    expectedColumns: ["customer_name", "email"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT customer_name, email FROM customers LIMIT 5;"
  },
  {
    id: 3,
    title: "Filter customers by created date",
    difficulty: "Easy",
    description: "Return the customer_id of all customers created after \"2023-03-01\".",
    explanation: "WHERE filters rows based on conditions. Date comparisons work naturally in SQL when dates are stored in standard formats.",
    scenario: "Your team wants to analyze customers acquired after a new product launch.",
    useCases: [
      "Customer acquisition analysis",
      "Filtering recent users",
      "Date-based segmentation"
    ],
    hint: "Use WHERE created_date > \"2023-03-01\"",
    starterQuery: "SELECT * FROM customers LIMIT 5;",
    expectedColumns: [
      "customer_id",
      "customer_name",
      "email",
      "created_date"
    ],
    expectedRowCount: 3,
    validateBy: "row_ids",
    solutionQuery: "SELECT customer_id FROM customers WHERE created_date > '2023-03-01';"
  },
  {
    id: 4,
    title: "Sort customers by latest signup",
    difficulty: "Easy",
    description: "Return the customer_id of the 5 most recently created customers.",
    explanation: "ORDER BY sorts results. DESC shows the newest records first.",
    scenario: "Customer success teams prioritize onboarding recently created customers.",
    useCases: [
      "Viewing latest customers",
      "Building activity feeds",
      "Prioritizing outreach"
    ],
    hint: "Use ORDER BY created_date DESC and LIMIT 5",
    starterQuery: "SELECT * FROM customers LIMIT 5;",
    expectedColumns: [
      "customer_id",
      "customer_name",
      "email",
      "created_date"
    ],
    expectedRowCount: 5,
    validateBy: "row_ids",
    solutionQuery: "SELECT customer_id FROM customers ORDER BY created_date DESC LIMIT 5;"
  },
  {
    id: 5,
    title: "Count total customers",
    difficulty: "Easy",
    description: "Return the total number of customers in the customers table as total_customers.",
    explanation: "COUNT(*) counts every row in the table.",
    scenario: "Your weekly KPI dashboard needs the total customer count.",
    useCases: [
      "Executive reporting",
      "Dashboard KPIs",
      "Database monitoring"
    ],
    hint: "Use COUNT(*) and alias it as total_customers",
    starterQuery: "SELECT * FROM customers LIMIT 5;",
    expectedColumns: ["total_customers"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT COUNT(*) AS total_customers FROM customers;"
  },
  {
    id: 6,
    title: "Limit query results",
    difficulty: "Easy",
    description: "Return customer_id, customer_name, and email for only the first 3 customers.",
    explanation: "LIMIT restricts how many rows are returned.",
    scenario: "You want to preview a few records before running a large export.",
    useCases: [
      "Previewing tables",
      "Testing queries",
      "Reducing query output"
    ],
    hint: "Select the required columns and use LIMIT 3",
    starterQuery: "SELECT * FROM customers;",
    expectedColumns: [
      "customer_id",
      "customer_name",
      "email"
    ],
    expectedRowCount: 3,
    validateBy: "row_count",
    solutionQuery: "SELECT customer_id, customer_name, email FROM customers LIMIT 3;"
  },
  {
    id: 7,
    title: "Filter with AND",
    difficulty: "Easy",
    description: "Return the customer_id of verified customers from India.",
    explanation: "AND combines multiple conditions. Both conditions must be true.",
    scenario: "Your compliance team needs all verified customers located in India.",
    useCases: [
      "Customer segmentation",
      "Compliance filtering",
      "Multi-condition searches"
    ],
    hint: "Use WHERE country = \"India\" AND is_verified = true",
    starterQuery: "SELECT * FROM customers LIMIT 5;",
    expectedColumns: [
      "customer_id",
      "customer_name",
      "country",
      "is_verified"
    ],
    expectedRowCount: 2,
    validateBy: "row_ids",
    solutionQuery: "SELECT customer_id FROM customers WHERE country = 'India' AND is_verified = true;"
  },
  {
    id: 8,
    title: "Filter with OR",
    difficulty: "Easy",
    description: "Return the customer_id of customers located in either India or USA.",
    explanation: "OR returns rows where at least one condition is true.",
    scenario: "Regional sales managers want customers from two target countries.",
    useCases: [
      "Regional analysis",
      "Multi-value filtering",
      "Geographic segmentation"
    ],
    hint: "Use country = \"India\" OR country = \"USA\"",
    starterQuery: "SELECT * FROM customers LIMIT 5;",
    expectedColumns: [
      "customer_id",
      "customer_name",
      "country"
    ],
    expectedRowCount: 5,
    validateBy: "row_ids",
    solutionQuery: "SELECT customer_id FROM customers WHERE country = 'India' OR country = 'USA';"
  },
  {
    id: 9,
    title: "Use IN for multiple values",
    difficulty: "Easy",
    description: "Return the order_id of orders whose status is Delivered, Cancelled, or Pending.",
    explanation: "IN is cleaner than multiple OR conditions.",
    scenario: "Operations teams want to monitor key order states in one query.",
    useCases: [
      "Order tracking",
      "Status monitoring",
      "Cleaner filtering syntax"
    ],
    hint: "Use WHERE order_status IN (\"Delivered\", \"Cancelled\", \"Pending\")",
    starterQuery: "SELECT * FROM orders LIMIT 5;",
    expectedColumns: [
      "order_id",
      "customer_id",
      "order_status"
    ],
    expectedRowCount: 5,
    validateBy: "row_ids",
    solutionQuery: "SELECT order_id FROM orders WHERE order_status IN ('Delivered', 'Cancelled', 'Pending');"
  },
  {
    id: 10,
    title: "Use LIKE for pattern matching",
    difficulty: "Easy",
    description: "Return the customer_id of customers whose email ends with \"@gmail.com\".",
    explanation: "LIKE with % allows flexible pattern matching.",
    scenario: "The marketing team wants customers using Gmail accounts for a campaign analysis.",
    useCases: [
      "Email domain analysis",
      "Pattern searches",
      "Customer segmentation"
    ],
    hint: "Use LIKE \"%@gmail.com\"",
    starterQuery: "SELECT * FROM customers LIMIT 5;",
    expectedColumns: [
      "customer_id",
      "customer_name",
      "email"
    ],
    expectedRowCount: 5,
    validateBy: "row_ids",
    solutionQuery: "SELECT customer_id FROM customers WHERE email LIKE '%@gmail.com';"
  },
  {
    id: 11,
    title: "Count orders per customer",
    difficulty: "Easy",
    description: "Count how many orders each customer has placed.",
    explanation: "GROUP BY groups rows with the same customer_id together, while COUNT(*) counts the number of orders in each group.",
    scenario: "The customer success team wants to identify how frequently customers place orders.",
    useCases: [
      "Customer engagement analysis",
      "Order frequency tracking",
      "Repeat customer reporting"
    ],
    hint: "Use COUNT(*) AS order_count and GROUP BY customer_id",
    starterQuery: "SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id;",
    expectedColumns: ["customer_id", "order_count"],
    expectedRowCount: 4,
    validateBy: "exact",
    solutionQuery: "SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id;"
  },
  {
    id: 12,
    title: "Calculate total revenue",
    difficulty: "Easy",
    description: "Calculate the total revenue from all completed orders.",
    explanation: "SUM() adds all numeric values together. Revenue calculations typically use total_amount from the orders table.",
    scenario: "Finance teams use this query to track total business revenue.",
    useCases: [
      "Revenue reporting",
      "Business KPI tracking",
      "Executive dashboards"
    ],
    hint: "Use SUM(total_amount) AS total_revenue",
    starterQuery: "SELECT SUM(total_amount) AS total_revenue FROM orders;",
    expectedColumns: ["total_revenue"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT SUM(total_amount) AS total_revenue FROM orders;"
  },
  {
    id: 13,
    title: "Find average order value",
    difficulty: "Easy",
    description: "Calculate the average order value across all orders.",
    explanation: "AVG() calculates the arithmetic mean of a numeric column.",
    scenario: "E-commerce teams monitor Average Order Value (AOV) as a key performance metric.",
    useCases: [
      "AOV analysis",
      "Pricing optimization",
      "Revenue analysis"
    ],
    hint: "Use AVG(total_amount) AS avg_order_value",
    starterQuery: "SELECT AVG(total_amount) AS avg_order_value FROM orders;",
    expectedColumns: ["avg_order_value"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT AVG(total_amount) AS avg_order_value FROM orders;"
  },
  {
    id: 14,
    title: "Find highest and lowest order value",
    difficulty: "Easy",
    description: "Return the maximum and minimum total_amount from the orders table.",
    explanation: "MAX() returns the largest value and MIN() returns the smallest value.",
    scenario: "Operations teams use this to identify unusually large or small orders.",
    useCases: [
      "Outlier analysis",
      "Revenue range analysis",
      "Data validation"
    ],
    hint: "Use MAX(total_amount) and MIN(total_amount)",
    starterQuery: "SELECT MAX(total_amount) AS max_order_value, MIN(total_amount) AS min_order_value FROM orders;",
    expectedColumns: ["max_order_value", "min_order_value"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT MAX(total_amount) AS max_order_value, MIN(total_amount) AS min_order_value FROM orders;"
  },
  {
    id: 15,
    title: "Find repeat customers",
    difficulty: "Easy",
    description: "Return customer_id and order_count for customers who have placed more than 1 order.",
    explanation: "HAVING filters grouped results after aggregation.",
    scenario: "The retention team wants to identify repeat customers for loyalty campaigns.",
    useCases: [
      "Repeat purchase analysis",
      "Customer retention",
      "Loyalty program targeting"
    ],
    hint: "Use COUNT(*) AS order_count, GROUP BY customer_id, and HAVING COUNT(*) > 1",
    starterQuery: "SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id HAVING COUNT(*) > 1;",
    expectedColumns: ["customer_id", "order_count"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id HAVING COUNT(*) > 1;"
  },
  {
    id: 16,
    title: "Find unique ordering customers",
    difficulty: "Easy",
    description: "Return a unique list of customer_ids from the orders table.",
    explanation: "DISTINCT removes duplicate values from query results.",
    scenario: "You want to know how many unique customers placed at least one order.",
    useCases: [
      "Unique customer analysis",
      "De-duplication",
      "Customer activity reporting"
    ],
    hint: "Use SELECT DISTINCT customer_id",
    starterQuery: "SELECT DISTINCT customer_id FROM orders;",
    expectedColumns: ["customer_id"],
    expectedRowCount: 4,
    validateBy: "exact",
    solutionQuery: "SELECT DISTINCT customer_id FROM orders;"
  },
  {
    id: 17,
    title: "Join customers with orders",
    difficulty: "Easy",
    description: "Show customer_name along with their order_id and total_amount.",
    explanation: "INNER JOIN combines matching records from customers and orders tables.",
    scenario: "Support teams want customer names alongside order details for easier troubleshooting.",
    useCases: [
      "Customer order history",
      "Business reporting",
      "Combining related tables"
    ],
    hint: "Join customers and orders using customer_id and return customer_name, order_id, and total_amount",
    starterQuery: "SELECT c.customer_name, o.order_id, o.total_amount FROM customers c JOIN orders o ON c.customer_id = o.customer_id;",
    expectedColumns: ["customer_name", "order_id", "total_amount"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT c.customer_name, o.order_id, o.total_amount FROM customers c JOIN orders o ON c.customer_id = o.customer_id;"
  },
  {
    id: 18,
    title: "Find customers with no orders",
    difficulty: "Easy",
    description: "Return customer_name and email for customers who have never placed an order.",
    explanation: "LEFT JOIN keeps all customers and returns NULL for unmatched orders.",
    scenario: "Marketing teams want to target inactive customers with promotions.",
    useCases: [
      "Inactive customer analysis",
      "Customer re-engagement",
      "Missing relationship detection"
    ],
    hint: "Use LEFT JOIN and filter WHERE o.order_id IS NULL",
    starterQuery: "SELECT c.customer_name, c.email FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;",
    expectedColumns: ["customer_name", "email"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT c.customer_name, c.email FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL;"
  },
  {
    id: 19,
    title: "Alias columns for reporting",
    difficulty: "Easy",
    description: "Display customer_name as 'Customer Name' and email as 'Email Address'.",
    explanation: "Aliases improve readability in reports and exports.",
    scenario: "Business users want cleaner spreadsheet column names.",
    useCases: [
      "Report formatting",
      "Dashboard readability",
      "Export preparation"
    ],
    hint: "Use AS \"Customer Name\" and AS \"Email Address\"",
    starterQuery: "SELECT customer_name AS \"Customer Name\", email AS \"Email Address\" FROM customers;",
    expectedColumns: ["Customer Name", "Email Address"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT customer_name AS \"Customer Name\", email AS \"Email Address\" FROM customers;"
  },
  {
    id: 20,
    title: "Filter non-null order totals",
    difficulty: "Easy",
    description: "Return the order_id of orders where total_amount is not NULL.",
    explanation: "IS NOT NULL filters out rows with missing values.",
    scenario: "Finance teams only want valid completed orders for reporting.",
    useCases: [
      "Data cleaning",
      "Revenue reporting",
      "Removing incomplete records"
    ],
   hint: "Use WHERE total_amount IS NOT NULL. Return only order_id.",
    starterQuery: "SELECT * FROM orders WHERE total_amount IS NOT NULL;",
    expectedColumns: ["order_id", "customer_id", "order_date", "total_amount"],
    expectedRowCount: 5,
    validateBy: "row_ids",
    solutionQuery: "SELECT order_id FROM orders WHERE total_amount IS NOT NULL;"
  },
  {
    id: 21,
    title: "Create customer display labels",
    difficulty: "Easy",
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
    title: "Find high-value orders",
    difficulty: "Easy",
    description: "Return all columns for orders with total_amount greater than 200, sorted by highest total_amount first.",
    explanation: "WHERE filters rows and ORDER BY sorts the results.",
    scenario: "Risk teams review large orders for fraud detection.",
    useCases: [
    "Fraud monitoring",
    "High-value order analysis",
    "Transaction reviews"
    ],
    hint: "Use WHERE total_amount > 200 ORDER BY total_amount DESC.",
    starterQuery: "SELECT * FROM orders WHERE total_amount > 200 ORDER BY total_amount DESC;",
    expectedColumns: ["order_id", "customer_id", "order_date", "total_amount"],
    expectedRowCount: 3,
    validateBy: "exact",
    solutionQuery: "SELECT * FROM orders WHERE total_amount > 200 ORDER BY total_amount DESC;"
    },
    {
    id: 27,
    title: "Use table aliases",
    difficulty: "Easy",
    description: "Select all columns from orders using table alias 'o'.",
    explanation: "Table aliases make queries shorter and easier to read.",
    scenario: "Complex production queries commonly use aliases for readability.",
    useCases: [
    "Shorter SQL syntax",
    "Complex joins",
    "Readable queries"
    ],
    hint: "Use FROM orders o.",
    starterQuery: "SELECT o.* FROM orders o;",
    expectedColumns: ["order_id", "customer_id", "order_date", "total_amount"],
    expectedRowCount: 5,
    validateBy: "row_count",
    solutionQuery: "SELECT o.* FROM orders o;"
    },
    {
    id: 28,
    title: "Count orders with valid totals",
    difficulty: "Easy",
    description: "Count how many orders have a non-null total_amount.",
    explanation: "COUNT(column_name) ignores NULL values.",
    scenario: "Data engineering teams validate data completeness before reporting.",
    useCases: [
    "Data quality validation",
    "Completeness checks",
    "Audit reporting"
    ],
    hint: "Use COUNT(total_amount) AS valid_orders.",
    starterQuery: "SELECT COUNT(total_amount) AS valid_orders FROM orders;",
    expectedColumns: ["valid_orders"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT COUNT(total_amount) AS valid_orders FROM orders;"
    },
    {
    id: 29,
    title: "Find orders from January 2024",
    difficulty: "Easy",
    description: "Return all columns for orders placed in January 2024.",
    explanation: "LIKE can filter dates using partial matching.",
    scenario: "Monthly finance reports often isolate a single month's transactions.",
    useCases: [
    "Monthly reporting",
    "Period analysis",
    "Revenue tracking"
    ],
    hint: "Use WHERE order_date LIKE \"2024-01%\".",
    starterQuery: "SELECT * FROM orders WHERE order_date LIKE \"2024-01%\".",
    expectedColumns: ["order_id", "customer_id", "order_date", "total_amount"],
    expectedRowCount: 2,
    validateBy: "row_ids",
    solutionQuery: "SELECT * FROM orders WHERE order_date LIKE \"2024-01%\"."
    },
    {
    id: 30,
    title: "Customer total spending report",
    difficulty: "Easy",
    description: "Show each customer's name and their total spending, including customers with no orders.",
    explanation: "LEFT JOIN ensures all customers appear, while COALESCE replaces NULL totals with 0.",
    scenario: "Executives want a complete customer spending report including inactive customers.",
    useCases: [
    "Lifetime value reporting",
    "Customer analytics",
    "Executive dashboards"
    ],
    hint: "Use LEFT JOIN, COALESCE(SUM(total_amount), 0), and GROUP BY customer_id.",
    starterQuery: "SELECT c.customer_name, COALESCE(SUM(o.total_amount), 0) AS total_spent FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.customer_name ORDER BY total_spent DESC;",
    expectedColumns: ["customer_name", "total_spent"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT c.customer_name, COALESCE(SUM(o.total_amount), 0) AS total_spent FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.customer_name ORDER BY total_spent DESC;"
    },    
    {
      id: 31,
      title: "Select product names and prices",
      difficulty: "Easy",
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
      difficulty: "Easy",
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
      solutionQuery: "SELECT product_id, product_name, category, price FROM products WHERE category = \"Electronics\";"
      },
      {
      id: 33,
      title: "Find expensive products",
      difficulty: "Easy",
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
      difficulty: "Easy",
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
      difficulty: "Easy",
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
      solutionQuery: "SELECT product_id, product_name, category, price FROM products WHERE product_name LIKE \"%Pro%\";"
      },
      {
      id: 36,
      title: "Count total products",
      difficulty: "Easy",
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
      difficulty: "Easy",
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
      difficulty: "Easy",
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
      solutionQuery: "SELECT product_id, product_name, category, price FROM products WHERE category = \"Electronics\" OR category = \"Accessories\";"
      },
      {
      id: 39,
      title: "Find products by ID range",
      difficulty: "Easy",
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
      difficulty: "Easy",
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
        difficulty: "Easy",
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
        difficulty: "Easy",
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
        difficulty: "Easy",
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
        difficulty: "Easy",
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
        difficulty: "Easy",
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
        title: "Find customers with missing emails",
        difficulty: "Easy",
        description: "Return customer_id, customer_name, and email for customers where email is NULL.",
        explanation: "IS NULL checks for missing values.",
        scenario: "CRM teams are identifying incomplete customer profiles.",
        useCases: [
        "Data quality checks",
        "Profile completion",
        "Customer audits"
        ],
        hint: "Use WHERE email IS NULL.",
        starterQuery: "SELECT customer_id, customer_name, email FROM customers WHERE email IS NULL;",
        expectedColumns: ["customer_id", "customer_name", "email"],
        expectedRowCount: 0,
        validateBy: "exact",
        solutionQuery: "SELECT customer_id, customer_name, email FROM customers WHERE email IS NULL;"
        },
        {
        id: 47,
        title: "Count orders by date",
        difficulty: "Easy",
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
        difficulty: "Easy",
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
        difficulty: "Easy",
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
        difficulty: "Easy",
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
    difficulty: "Easy",
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
    title: "Find products by exact prices",
    difficulty: "Easy",
    description: "Return product_id, product_name, category, and price for products priced exactly at 29, 99, or 199.",
    explanation: "IN is cleaner than multiple OR conditions for exact matches.",
    scenario: "Finance teams are auditing specific pricing tiers.",
    useCases: [
    "Price audits",
    "Catalog filtering",
    "Pricing analysis"
    ],
    hint: "Use WHERE price IN (29, 99, 199).",
    starterQuery: "SELECT product_id, product_name, category, price FROM products WHERE price IN (29, 99, 199);",
    expectedColumns: ["product_id", "product_name", "category", "price"],
    expectedRowCount: 3,
    validateBy: "exact",
    solutionQuery: "SELECT product_id, product_name, category, price FROM products WHERE price IN (29, 99, 199);"
    },
    
    {
    id: 53,
    title: "Find customers by partial name",
    difficulty: "Easy",
    description: "Return the customer_id of customers whose name contains \"son\".",
    explanation: "LIKE with wildcards searches text patterns anywhere in a string.",
    scenario: "Support teams only remember part of a customer's name.",
    useCases: [
    "Customer search",
    "Partial matching",
    "CRM lookup"
    ],
    hint: "Use LIKE \"%son%\". Return only customer_id.",
    starterQuery: "SELECT customer_id FROM customers WHERE customer_name LIKE \"son\";",
    expectedColumns: ["customer_id"],
    expectedRowCount: 2,
    validateBy: "row_ids",
    solutionQuery: "SELECT customer_id FROM customers WHERE customer_name LIKE \"son\";"
    },
    
    {
    id: 54,
    title: "Sort products by category and price",
    difficulty: "Easy",
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
    title: "Find orders from a specific date",
    difficulty: "Easy",
    description: "Return the order_id of orders placed on \"2024-01-25\".",
    explanation: "Date filtering is commonly used in operational reporting.",
    scenario: "Engineering teams are reviewing orders from a system outage day.",
    useCases: [
    "Daily audits",
    "Issue investigation",
    "Operational analysis"
    ],
    hint: "Use WHERE order_date = \"2024-01-25\". Return only order_id.",
    starterQuery: "SELECT order_id FROM orders WHERE order_date = \"2024-01-25\";",
    expectedColumns: ["order_id"],
    expectedRowCount: 1,
    validateBy: "row_ids",
    solutionQuery: "SELECT order_id FROM orders WHERE order_date = '2024-01-25';"
    },    
  {
    id: 56,
    title: "Find longest product name",
    difficulty: "Easy",
    description: "Return the longest product_name and its character length.",
    explanation: "LENGTH() measures text size and ORDER BY helps rank results.",
    scenario: "UI teams need to identify overly long product names.",
    useCases: [
      "UI testing",
      "Catalog cleanup",
      "Data profiling"
    ],
    hint: "Use LENGTH(product_name) and ORDER BY DESC",
    starterQuery: "SELECT product_name, LENGTH(product_name) AS name_length FROM products ORDER BY name_length DESC LIMIT 1;",
    expectedColumns: ["product_name", "name_length"],
    expectedRowCount: 1,
    validateBy: "exact",
    solutionQuery: "SELECT product_name, LENGTH(product_name) AS name_length FROM products ORDER BY name_length DESC LIMIT 1;"
  },
  {
    id: 57,
    title: "Calculate revenue for selected customers",
    difficulty: "Easy",
    description: "Calculate total revenue for customer_id 1 and 2.",
    explanation: "WHERE filters rows before aggregation occurs.",
    scenario: "Account managers are reviewing revenue from VIP customers.",
    useCases: [
      "Customer revenue analysis",
      "VIP reporting",
      "Revenue segmentation"
    ],
    hint: "Use SUM(total_amount) with GROUP BY",
    starterQuery: "SELECT customer_id, SUM(total_amount) AS total_revenue FROM orders WHERE customer_id IN (1, 2) GROUP BY customer_id;",
    expectedColumns: ["customer_id", "total_revenue"],
    expectedRowCount: 2,
    validateBy: "exact",
    solutionQuery: "SELECT customer_id, SUM(total_amount) AS total_revenue FROM orders WHERE customer_id IN (1, 2) GROUP BY customer_id;"
  },
  {
    id: 58,
    title: "Find products with decimal prices",
    difficulty: "Easy",
    description: "Find products where the price contains decimal values.",
    explanation: "Modulo operations can identify non-whole numbers.",
    scenario: "Finance teams want products with non-rounded pricing.",
    useCases: [
      "Pricing audits",
      "Data consistency",
      "Financial validation"
    ],
    hint: "Use price % 1 <> 0",
    starterQuery: "SELECT * FROM products WHERE price % 1 <> 0;",
    expectedColumns: ["product_id", "product_name", "category", "price"],
    expectedRowCount: 0,
    validateBy: "row_count",
    solutionQuery: "SELECT product_id, product_name, category, price FROM products WHERE price % 1 <> 0;"
  },
  {
    id: 59,
    title: "Find customers starting with Alice",
    difficulty: "Easy",
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
    difficulty: "Easy",
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
    difficulty: "Easy",
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
    difficulty: "Easy",
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
    difficulty: "Easy",
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
    difficulty: "Easy",
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
    difficulty: "Easy",
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
    title: "Skip first customer records",
    difficulty: "Easy",
    description: "Return 2 customers while skipping the first row.",
    explanation: "OFFSET skips rows before returning results.",
    scenario: "Pagination systems load records in batches.",
    useCases: [
    "Pagination",
    "Data sampling",
    "UI navigation"
    ],
    hint: "Use LIMIT 2 OFFSET 1.",
    starterQuery: "SELECT * FROM customers LIMIT 2 OFFSET 1;",
    expectedColumns: ["customer_id", "customer_name", "email", "created_date"],
    expectedRowCount: 2,
    validateBy: "row_count",
    solutionQuery: "SELECT customer_id, customer_name, email, created_date FROM customers LIMIT 2 OFFSET 1;"
    },
    {
    id: 67,
    title: "Find average price by category",
    difficulty: "Easy",
    description: "Calculate average product price for each category.",
    explanation: "GROUP BY creates separate averages per category.",
    scenario: "Pricing teams compare average pricing across departments.",
    useCases: [
    "Category analysis",
    "Pricing strategy",
    "Benchmarking"
    ],
    hint: "Use GROUP BY category.",
    starterQuery: "SELECT category, AVG(price) AS avg_price FROM products GROUP BY category;",
    expectedColumns: ["category", "avg_price"],
    expectedRowCount: 3,
    validateBy: "exact",
    solutionQuery: "SELECT category, AVG(price) AS avg_price FROM products GROUP BY category;"
    },
    {
    id: 68,
    title: "Find customers with empty emails",
    difficulty: "Easy",
    description: "Return customer_id, customer_name, and email for customers where email is an empty string.",
    explanation: "Empty strings are different from NULL values.",
    scenario: "Data quality teams audit incomplete customer records.",
    useCases: [
    "Data cleanup",
    "Validation checks",
    "CRM audits"
    ],
    hint: "Use WHERE email = \"\".",
    starterQuery: "SELECT customer_id, customer_name, email FROM customers WHERE email = \"\";",
    expectedColumns: ["customer_id", "customer_name", "email"],
    expectedRowCount: 0,
    validateBy: "exact",
    solutionQuery: "SELECT customer_id, customer_name, email FROM customers WHERE email = '';"
    },
    {
    id: 69,
    title: "Calculate bulk product pricing",
    difficulty: "Easy",
    description: "Return product_name and the cost of buying 10 units.",
    explanation: "Mathematical operations can create projected pricing.",
    scenario: "Sales teams prepare bulk purchase quotes.",
    useCases: [
    "Bulk pricing",
    "Sales forecasting",
    "Revenue estimation"
    ],
    hint: "Use price * 10.",
    starterQuery: "SELECT product_name, price * 10 AS bulk_price FROM products;",
    expectedColumns: ["product_name", "bulk_price"],
    expectedRowCount: 5,
    validateBy: "exact",
    solutionQuery: "SELECT product_name, price * 10 AS bulk_price FROM products;"
    },
    {
    id: 70,
    title: "Find orders from multiple dates",
    difficulty: "Easy",
    description: "Return order_id, customer_id, order_date, and total_amount for orders placed on \"2024-01-10\" or \"2024-02-15\".",
    explanation: "IN simplifies filtering multiple exact values.",
    scenario: "Marketing teams compare campaign event days.",
    useCases: [
    "Event tracking",
    "Campaign comparison",
    "Date filtering"
    ],
    hint: "Use IN with the two dates.",
    starterQuery: "SELECT order_id, customer_id, order_date, total_amount FROM orders WHERE order_date IN (\"2024-01-10\", \"2024-02-15\");",
    expectedColumns: ["order_id", "customer_id", "order_date", "total_amount"],
    expectedRowCount: 2,
    validateBy: "exact",
    solutionQuery: "SELECT order_id, customer_id, order_date, total_amount FROM orders WHERE order_date IN ('2024-01-10', '2024-02-15');"
    },
    {
    id: 71,
    title: "Find customers with 'John' in email",
    difficulty: "Easy",
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
      difficulty: "Easy",
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
      difficulty: "Easy",
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
      title: "Find uncategorized products",
      difficulty: "Easy",
      description: "Return product_id, product_name, category, and price for products where category is NULL.",
      explanation: "IS NULL helps identify missing data values.",
      scenario: "Operations teams want to fix products missing categories.",
      useCases: [
      "Data cleanup",
      "Catalog auditing",
      "Inventory management"
      ],
      hint: "Use WHERE category IS NULL.",
      starterQuery: "SELECT product_id, product_name, category, price FROM products WHERE category IS NULL;",
      expectedColumns: ["product_id", "product_name", "category", "price"],
      expectedRowCount: 0,
      validateBy: "exact",
      solutionQuery: "SELECT product_id, product_name, category, price FROM products WHERE category IS NULL;"
      },
      {
      id: 75,
      title: "Calculate average order value",
      difficulty: "Easy",
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
      difficulty: "Easy",
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
      title: "Find customers by exact names",
      difficulty: "Easy",
      description: "Return the customer_id of customers named \"Alice Johnson\" or \"Charlie Davis\".",
      explanation: "IN simplifies filtering multiple exact values.",
      scenario: "Marketing teams are preparing a winner announcement.",
      useCases: [
      "Customer lookup",
      "Targeted retrieval",
      "CRM searches"
      ],
      hint: "Use IN (\"Alice Johnson\", \"Charlie Davis\"). Return only customer_id.",
      starterQuery: "SELECT customer_id FROM customers WHERE customer_name IN (\"Alice Johnson\", \"Charlie Davis\");",
      expectedColumns: ["customer_id"],
      expectedRowCount: 2,
      validateBy: "row_ids",
      solutionQuery: "SELECT customer_id FROM customers WHERE customer_name IN ('Alice Johnson', 'Charlie Davis');"
      },
      {
      id: 78,
      title: "Find mid-range orders",
      difficulty: "Easy",
      description: "Return the order_id of orders with total_amount between 50 and 150.",
      explanation: "BETWEEN filters values within a range inclusively.",
      scenario: "Finance teams analyze mid-tier customer purchases.",
      useCases: [
      "Revenue segmentation",
      "Price analysis",
      "Order filtering"
      ],
      hint: "Use BETWEEN 50 AND 150. Return only order_id.",
      starterQuery: "SELECT order_id FROM orders WHERE total_amount BETWEEN 50 AND 150;",
      expectedColumns: ["order_id"],
      expectedRowCount: 1,
      validateBy: "row_ids",
      solutionQuery: "SELECT order_id FROM orders WHERE total_amount BETWEEN 50 AND 150;"
      },
      {
      id: 79,
      title: "Rename aggregate column",
      difficulty: "Easy",
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
      difficulty: "Easy",
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
        difficulty: "Easy",
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
        difficulty: "Easy",
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
        title: "Find products with short names",
        difficulty: "Easy",
        description: "Return the product_id of products where product_name has 10 or fewer characters.",
        explanation: "LENGTH() helps filter text values by size.",
        scenario: "Mobile app designers want products with short display names.",
        useCases: [
        "UI optimization",
        "Catalog cleanup",
        "Data validation"
        ],
        hint: "Use LENGTH(product_name) <= 10. Return only product_id.",
        starterQuery: "SELECT product_id FROM products WHERE LENGTH(product_name) <= 10;",
        expectedColumns: ["product_id"],
        expectedRowCount: 2,
        validateBy: "row_ids",
        solutionQuery: "SELECT product_id FROM products WHERE LENGTH(product_name) <= 10;"
        },
        {
        id: 84,
        title: "Count orders for one customer",
        difficulty: "Easy",
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
        difficulty: "Easy",
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
        difficulty: "Easy",
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
        difficulty: "Easy",
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
        difficulty: "Easy",
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
        difficulty: "Easy",
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
        title: "Find service-related categories",
        difficulty: "Easy",
        description: "Return the product_id of products where category contains \"Service\".",
        explanation: "LIKE searches for partial text matches.",
        scenario: "Inventory teams are auditing service-related offerings.",
        useCases: [
        "Category analysis",
        "Inventory audits",
        "Search filtering"
        ],
        hint: "Use category LIKE \"%Service%\". Return only product_id.",
        starterQuery: "SELECT product_id FROM products WHERE category LIKE \"%Service%\";",
        expectedColumns: ["product_id"],
        expectedRowCount: 2,
        validateBy: "row_ids",
        solutionQuery: "SELECT product_id FROM products WHERE category LIKE '%Service%';"
        },        
        {
          id: 91,
          title: "Find extremely large or small orders",
          difficulty: "Easy",
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
          difficulty: "Easy",
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
          difficulty: "Easy",
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
          difficulty: "Easy",
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
          title: "Combine multiple status codes",
          difficulty: "Easy",
          description: "Return order_id, customer_id, and order_status for orders with status \"Returned\" or \"Refunded\".",
          explanation: "IN handles multiple matching values cleanly.",
          scenario: "Reverse logistics teams review returned and refunded orders.",
          useCases: [
          "Dispute tracing",
          "Return audits",
          "Status segmentation"
          ],
          hint: "Use WHERE order_status IN (\"Returned\", \"Refunded\").",
          starterQuery: "SELECT order_id, customer_id, order_status FROM orders WHERE order_status IN (\"Returned\", \"Refunded\");",
          expectedColumns: ["order_id", "customer_id", "order_status"],
          expectedRowCount: 0,
          validateBy: "exact",
          solutionQuery: "SELECT order_id, customer_id, order_status FROM orders WHERE order_status IN ('Returned', 'Refunded');"
          },
          {
          id: 96,
          title: "Find products with short category strings",
          difficulty: "Easy",
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
          difficulty: "Easy",
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
          title: "Find customers using secure mail accounts",
          difficulty: "Easy",
          description: "Return the customer_id of customers whose email contains \"proton\".",
          explanation: "LIKE searches for matching text patterns anywhere in a string.",
          scenario: "Security teams audit customers using privacy-focused email providers.",
          useCases: [
          "Privacy metrics",
          "Email audits",
          "Pattern extraction"
          ],
          hint: "Use LIKE \"%proton%\". Return only customer_id.",
          starterQuery: "SELECT customer_id FROM customers WHERE email LIKE \"%proton%\";",
          expectedColumns: ["customer_id"],
          expectedRowCount: 0,
          validateBy: "row_ids",
          solutionQuery: "SELECT customer_id FROM customers WHERE email LIKE '%proton%';"
          },
          {
          id: 99,
          title: "Verify valid customer references",
          difficulty: "Easy",
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
          difficulty: "Easy",
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