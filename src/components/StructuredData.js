import { useEffect } from "react";
import { getCompanyProblemPath } from "../data/sqlSearch";

function getProblemUrl(problem, category, baseUrl) {
  if (category === "company" && problem.company) {
    return `${baseUrl}${getCompanyProblemPath(problem)}`;
  }
  return `${baseUrl}/sql/${category.toLowerCase()}/${problem.id}-${problem.slug}`;
}

function getCategoryUrl(category, baseUrl) {
  if (category === "company") return `${baseUrl}/sql/company`;
  return `${baseUrl}/sql/${category.toLowerCase()}`;
}

export default function StructuredData({
  problem,
  category,
  baseUrl = "https://repractiq.com"
}) {
  useEffect(() => {
    if (!problem) return;

    const existing = document.getElementById("repractiq-schema");
    if (existing) existing.remove();

    const problemUrl = getProblemUrl(problem, category, baseUrl);
    const categoryUrl = getCategoryUrl(category, baseUrl);
    const categoryLabel = category === "company" ? "Top Company SQL Questions" : category;

    const schema = {
      "@context": "https://schema.org",
      "@graph": [

        // Website
        {
          "@type": "WebSite",
          "@id": `${baseUrl}/#website`,
          "url": baseUrl,
          "name": "Repractiq",
          "description":
            "Practice SQL interview questions online with real-world datasets.",
          "publisher": {
            "@id": `${baseUrl}/#organization`
          }
        },

        // Organization
        {
          "@type": "Organization",
          "@id": `${baseUrl}/#organization`,
          "name": "Repractiq",
          "url": baseUrl,
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo192.png`
          }
        },

        // Breadcrumbs
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "SQL",
              "item": `${baseUrl}/sql`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": categoryLabel,
              "item": categoryUrl
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": problem.title,
              "item": problemUrl
            }
          ]
        },

        // Learning Resource
        {
          "@type": "LearningResource",

          "@id": problemUrl,

          "url": problemUrl,

          "name": problem.seoTitle,

          "headline": problem.title,

          "description": problem.metaDescription,

          "keywords": problem.tags.join(", "),

          "learningResourceType":
            "SQL Practice Problem",

          "educationalLevel":
            problem.difficulty,

          "teaches": [
            "SQL",
            ...problem.tags
          ],

          "inLanguage": "en",

          "isPartOf": {
            "@type": "Course",
            "name": categoryLabel
          },

          "publisher": {
            "@id": `${baseUrl}/#organization`
          }
        },

        // Tech Article
        {
          "@type": "TechArticle",

          "headline": problem.seoTitle,

          "description": problem.metaDescription,

          "keywords": problem.tags.join(", "),

          "author": {
            "@id": `${baseUrl}/#organization`
          },

          "publisher": {
            "@id": `${baseUrl}/#organization`
          },

          "mainEntityOfPage": problemUrl
        }
      ]
    };

    const script = document.createElement("script");

    script.type = "application/ld+json";

    script.id = "repractiq-schema";

    script.text = JSON.stringify(schema);

    document.head.appendChild(script);

    return () => script.remove();

  }, [problem, category, baseUrl]);

  return null;
}