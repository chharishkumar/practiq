import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { SQL_PROBLEMS } from "../src/data/sqlProblems.js";
import { SQL_INTERMEDIATE_PROBLEMS } from "../src/data/sqlIntermediateProblems.js";
import { SQL_ADVANCED_PROBLEMS } from "../src/data/sqlAdvancedProblems.js";
import { SQL_INTERVIEW_PROBLEMS } from "../src/data/sqlInterviewProblems.js";
import { SQL_SCENARIOS_PROBLEMS } from "../src/data/sqlScenariosProblems.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://www.repractiq.com";

const TODAY = new Date().toISOString().split("T")[0];

const PUBLIC_DIR = path.join(__dirname, "../public");

const categories = [
  {
    name: "basics",
    filename: "sql-basics-sitemap.xml",
    landing: "/sql/basics",
    problems: SQL_PROBLEMS,
  },
  {
    name: "intermediate",
    filename: "sql-intermediate-sitemap.xml",
    landing: "/sql/intermediate",
    problems: SQL_INTERMEDIATE_PROBLEMS,
  },
  {
    name: "advanced",
    filename: "sql-advanced-sitemap.xml",
    landing: "/sql/advanced",
    problems: SQL_ADVANCED_PROBLEMS,
  },
  {
    name: "interview",
    filename: "sql-interview-sitemap.xml",
    landing: "/sql/interview",
    problems: SQL_INTERVIEW_PROBLEMS,
  },
  {
    name: "scenarios",
    filename: "sql-scenarios-sitemap.xml",
    landing: "/sql/scenarios",
    problems: SQL_SCENARIOS_PROBLEMS,
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
pages.push(createUrl(`${BASE_URL}/pricing`, "0.7", "monthly"));
pages.push(createUrl(`${BASE_URL}/blog`, "0.7", "weekly"));
pages.push(createUrl(`${BASE_URL}/contact`, "0.5", "monthly"));

categories.forEach((c) => {
  pages.push(createUrl(`${BASE_URL}${c.landing}`, "0.9", "weekly"));
});

writeSitemap("pages-sitemap.xml", pages);

//
// Question sitemaps
//

categories.forEach((category) => {
  const urls = category.problems.map((problem) =>
    createUrl(
      `${BASE_URL}${category.landing}/${problem.id}-${problem.slug}`,
      "0.8",
      "monthly"
    )
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