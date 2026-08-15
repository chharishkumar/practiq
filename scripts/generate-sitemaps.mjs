import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { SQL_PROBLEMS } from "../src/data/sqlProblems.js";
import { SQL_INTERMEDIATE_PROBLEMS } from "../src/data/sqlIntermediateProblems.js";
import { SQL_ADVANCED_PROBLEMS } from "../src/data/sqlAdvancedProblems.js";
import { SQL_INTERVIEW_PROBLEMS } from "../src/data/sqlInterviewProblems.js";
import { SQL_SCENARIOS_PROBLEMS } from "../src/data/sqlScenariosProblems.js";
import { SQL_COMPANY_PROBLEMS } from "../src/data/sqlCompanyProblems.js";

import { PYTHON_PROBLEMS } from "../src/python/data/pythonProblems.js";
import { PYTHON_INTERMEDIATE_PROBLEMS } from "../src/python/data/pythonIntermediateProblems.js";
import { PYTHON_ADVANCED_PROBLEMS } from "../src/python/data/pythonAdvancedProblems.js";
import { PYTHON_INTERVIEW_PROBLEMS } from "../src/python/data/pythonInterviewProblems.js";
import { PYTHON_SCENARIOS_PROBLEMS } from "../src/python/data/pythonScenariosProblems.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://www.repractiq.com";
const TODAY = new Date().toISOString().split("T")[0];
const PUBLIC_DIR = path.join(__dirname, "../public");

function slugifyCompany(name) {
  return String(name || "").toLowerCase().replace(/\s+/g, "-");
}

// Updated URL generator for SQL and Python
function getProblemUrl(category, problem) {
  if (category.name === "sql-company") {
    return `${BASE_URL}/sql/company/${slugifyCompany(problem.company)}/${problem.id}-${problem.slug}`;
  }
  return `${BASE_URL}${category.landing}/${problem.id}-${problem.slug}`;
}

// Added Python categories alongside SQL categories
const categories = [
  // --- SQL CATEGORIES ---
  {
    name: "sql-basics",
    filename: "sql-basics-sitemap.xml",
    landing: "/sql/basics",
    problems: SQL_PROBLEMS,
  },
  {
    name: "sql-intermediate",
    filename: "sql-intermediate-sitemap.xml",
    landing: "/sql/intermediate",
    problems: SQL_INTERMEDIATE_PROBLEMS,
  },
  {
    name: "sql-advanced",
    filename: "sql-advanced-sitemap.xml",
    landing: "/sql/advanced",
    problems: SQL_ADVANCED_PROBLEMS,
  },
  {
    name: "sql-interview",
    filename: "sql-interview-sitemap.xml",
    landing: "/sql/interview",
    problems: SQL_INTERVIEW_PROBLEMS,
  },
  {
    name: "sql-scenarios",
    filename: "sql-scenarios-sitemap.xml",
    landing: "/sql/scenarios",
    problems: SQL_SCENARIOS_PROBLEMS,
  },
  {
    name: "sql-company",
    filename: "sql-company-sitemap.xml",
    landing: "/sql/company",
    problems: SQL_COMPANY_PROBLEMS,
  },

  // --- PYTHON CATEGORIES ---
  {
    name: "python-basics",
    filename: "python-basics-sitemap.xml",
    landing: "/python/basics",
    problems: PYTHON_PROBLEMS,
  },
  {
    name: "python-intermediate",
    filename: "python-intermediate-sitemap.xml",
    landing: "/python/intermediate",
    problems: PYTHON_INTERMEDIATE_PROBLEMS,
  },
  {
    name: "python-advanced",
    filename: "python-advanced-sitemap.xml",
    landing: "/python/advanced",
    problems: PYTHON_ADVANCED_PROBLEMS,
  },
  {
    name: "python-interview",
    filename: "python-interview-sitemap.xml",
    landing: "/python/interview",
    problems: PYTHON_INTERVIEW_PROBLEMS,
  },
  {
    name: "python-scenarios",
    filename: "python-scenarios-sitemap.xml",
    landing: "/python/scenarios",
    problems: PYTHON_SCENARIOS_PROBLEMS,
  },
];

function createUrl(loc, priority, changefreq) {
  return `
<url>
    <loc>${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
</url>`;
}

function writeSitemap(filename, urls) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${urls.join("\n")}

</urlset>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, filename), xml);
}

//
// Pages sitemap
//

const pages = [];

pages.push(createUrl(`${BASE_URL}/`, "1.0", "daily"));
pages.push(createUrl(`${BASE_URL}/sql`, "0.9", "weekly"));
pages.push(createUrl(`${BASE_URL}/python`, "0.9", "weekly")); // Added main Python landing page
pages.push(createUrl(`${BASE_URL}/pricing`, "0.7", "monthly"));
pages.push(createUrl(`${BASE_URL}/blog`, "0.7", "weekly"));
pages.push(createUrl(`${BASE_URL}/contact`, "0.5", "monthly"));

// Adds landing pages for both SQL and Python categories
categories.forEach((c) => {
  pages.push(createUrl(`${BASE_URL}${c.landing}`, "0.9", "weekly"));
});

writeSitemap("pages-sitemap.xml", pages);

//
// Question sitemaps
//

categories.forEach((category) => {
  const urls = (category.problems || []).map((problem) =>
    createUrl(getProblemUrl(category, problem), "0.8", "monthly")
  );

  writeSitemap(category.filename, urls);

  console.log(
    `✓ ${category.filename} (${urls.length} URLs)`
  );
});

//
// Sitemap index
//

const index = `<?xml version="1.0" encoding="UTF-8"?>

<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<sitemap>
<loc>${BASE_URL}/pages-sitemap.xml</loc>
<lastmod>${TODAY}</lastmod>
</sitemap>

<sitemap>
<loc>${BASE_URL}/blog-sitemap.xml</loc>
<lastmod>${TODAY}</lastmod>
</sitemap>

${categories
  .map(
    (c) => `
<sitemap>
<loc>${BASE_URL}/${c.filename}</loc>
<lastmod>${TODAY}</lastmod>
</sitemap>`
  )
  .join("\n")}

</sitemapindex>`;

fs.writeFileSync(
  path.join(PUBLIC_DIR, "sitemap.xml"),
  index
);

console.log("==================================");
console.log("✓ Sitemap index generated");
console.log("==================================");

// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// import { SQL_PROBLEMS } from "../src/data/sqlProblems.js";
// import { SQL_INTERMEDIATE_PROBLEMS } from "../src/data/sqlIntermediateProblems.js";
// import { SQL_ADVANCED_PROBLEMS } from "../src/data/sqlAdvancedProblems.js";
// import { SQL_INTERVIEW_PROBLEMS } from "../src/data/sqlInterviewProblems.js";
// import { SQL_SCENARIOS_PROBLEMS } from "../src/data/sqlScenariosProblems.js";
// import { SQL_COMPANY_PROBLEMS } from "../src/data/sqlCompanyProblems.js";
// import { PYTHON_PROBLEMS } from "../src/python/data/pythonProblems.js";
// import { PYTHON_INTERMEDIATE_PROBLEMS } from "../src/python/data/pythonIntermediateProblems.js";
// import { PYTHON_ADVANCED_PROBLEMS } from "../src/python/data/pythonAdvancedProblems.js";
// import { PYTHON_INTERVIEW_PROBLEMS } from "../src/python/data/pythonInterviewProblems.js";
// import { PYTHON_SCENARIOS_PROBLEMS } from "../src/python/data/pythonScenariosProblems.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const BASE_URL = "https://www.repractiq.com";

// const TODAY = new Date().toISOString().split("T")[0];

// const PUBLIC_DIR = path.join(__dirname, "../public");

// function slugifyCompany(name) {
//   return String(name || "").toLowerCase().replace(/\s+/g, "-");
// }

// function getProblemUrl(category, problem) {
//   if (category.name === "company") {
//     return `${BASE_URL}/sql/company/${slugifyCompany(problem.company)}/${problem.id}-${problem.slug}`;
//   }
//   return `${BASE_URL}${category.landing}/${problem.id}-${problem.slug}`;
// }

// const categories = [
//   {
//     name: "basics",
//     filename: "sql-basics-sitemap.xml",
//     landing: "/sql/basics",
//     problems: SQL_PROBLEMS,
//   },
//   {
//     name: "intermediate",
//     filename: "sql-intermediate-sitemap.xml",
//     landing: "/sql/intermediate",
//     problems: SQL_INTERMEDIATE_PROBLEMS,
//   },
//   {
//     name: "advanced",
//     filename: "sql-advanced-sitemap.xml",
//     landing: "/sql/advanced",
//     problems: SQL_ADVANCED_PROBLEMS,
//   },
//   {
//     name: "interview",
//     filename: "sql-interview-sitemap.xml",
//     landing: "/sql/interview",
//     problems: SQL_INTERVIEW_PROBLEMS,
//   },
//   {
//     name: "scenarios",
//     filename: "sql-scenarios-sitemap.xml",
//     landing: "/sql/scenarios",
//     problems: SQL_SCENARIOS_PROBLEMS,
//   },
//   {
//     name: "company",
//     filename: "sql-company-sitemap.xml",
//     landing: "/sql/company",
//     problems: SQL_COMPANY_PROBLEMS,
//   },
// ];

// function createUrl(loc, priority, changefreq) {
//   return `
// <url>
//     <loc>${loc}</loc>
//     <lastmod>${TODAY}</lastmod>
//     <changefreq>${changefreq}</changefreq>
//     <priority>${priority}</priority>
// </url>`;
// }

// function writeSitemap(filename, urls) {
//   const xml = `<?xml version="1.0" encoding="UTF-8"?>

// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

// ${urls.join("\n")}

// </urlset>`;

//   fs.writeFileSync(path.join(PUBLIC_DIR, filename), xml);
// }

// //
// // Pages sitemap
// //

// const pages = [];

// pages.push(createUrl(`${BASE_URL}/`, "1.0", "daily"));
// pages.push(createUrl(`${BASE_URL}/sql`, "0.9", "weekly"));
// pages.push(createUrl(`${BASE_URL}/pricing`, "0.7", "monthly"));
// pages.push(createUrl(`${BASE_URL}/blog`, "0.7", "weekly"));
// pages.push(createUrl(`${BASE_URL}/contact`, "0.5", "monthly"));

// categories.forEach((c) => {
//   pages.push(createUrl(`${BASE_URL}${c.landing}`, "0.9", "weekly"));
// });

// writeSitemap("pages-sitemap.xml", pages);

// //
// // Question sitemaps
// //

// categories.forEach((category) => {
//   const urls = category.problems.map((problem) =>
//     createUrl(getProblemUrl(category, problem), "0.8", "monthly")
//   );

//   writeSitemap(category.filename, urls);

//   console.log(
//     `✓ ${category.filename} (${urls.length} URLs)`
//   );
// });

// //
// // Sitemap index
// //

// const index = `<?xml version="1.0" encoding="UTF-8"?>

// <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

// <sitemap>
// <loc>${BASE_URL}/blog-sitemap.xml</loc>
// <lastmod>${TODAY}</lastmod>
// </sitemap>

// ${categories
//   .map(
//     (c) => `
// <sitemap>
// <loc>${BASE_URL}/${c.filename}</loc>
// <lastmod>${TODAY}</lastmod>
// </sitemap>`
//   )
//   .join("\n")}

// </sitemapindex>`;

// fs.writeFileSync(
//   path.join(PUBLIC_DIR, "sitemap.xml"),
//   index
// );

// console.log("==================================");
// console.log("✓ Sitemap index generated");
// console.log("==================================");
