import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://www.repractiq.com";

const PUBLIC_DIR = path.join(__dirname, "../public");

const TODAY = new Date().toISOString().split("T")[0];

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

const { data: blogs, error } = await supabase
    .from("blogs")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

if (error) {
    console.error(error);
    process.exit(1);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${blogs.map(blog => `
<url>
    <loc>${BASE_URL}/blog/${blog.slug}</loc>
    <lastmod>${blog.updated_at.split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
</url>`).join("")}

</urlset>`;

fs.writeFileSync(
    path.join(PUBLIC_DIR, "blog-sitemap.xml"),
    xml
);

console.log(`✓ blog-sitemap.xml (${blogs.length} URLs)`);