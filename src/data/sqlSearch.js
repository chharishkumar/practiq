import { SQL_PROBLEMS } from "./sqlProblems";
import { SQL_INTERMEDIATE_PROBLEMS } from "./sqlIntermediateProblems";
import { SQL_ADVANCED_PROBLEMS } from "./sqlAdvancedProblems";
import { SQL_INTERVIEW_PROBLEMS } from "./sqlInterviewProblems";
import { SQL_SCENARIOS_PROBLEMS } from "./sqlScenariosProblems";
import { SQL_COMPANY_PROBLEMS } from "./sqlCompanyProblems";

export function slugifyCompany(name) {
  return String(name || "").toLowerCase().replace(/\s+/g, "-");
}

export function getCompanyProblemPath(problem) {
  return `/sql/company/${slugifyCompany(problem.company)}/${problem.id}-${problem.slug}`;
}

export function getCompanyProblemKey(problem) {
  return `${problem.company}::${problem.id}`;
}

const CATEGORY_ROUTE_MAP = {
  sql_basics: "/sql/basics",
  sql_intermediate: "/sql/intermediate",
  sql_advanced: "/sql/advanced",
  sql_interview: "/sql/interview",
  sql_scenario: "/sql/scenarios",
  sql_scenarios: "/sql/scenarios",
  sql_company: "/sql/company",
};

export function getSubmissionProblemPath(category, problemId) {
  if (category === "sql_company") {
    const [company, idStr] = String(problemId).split("::");
    const problem = SQL_COMPANY_PROBLEMS.find(
      (p) => p.company === company && p.id === Number(idStr)
    );
    return problem ? getCompanyProblemPath(problem) : "/sql/company";
  }
  const base = CATEGORY_ROUTE_MAP[category] || "/sql/basics";
  return `${base}/${problemId}`;
}

export function getSubmissionKey(category, problemId) {
  return `${category}::${problemId}`;
}

export const SQL_CATEGORY_CONFIG = {
  basics: { label: "Basics", route: "/sql/basics", problems: SQL_PROBLEMS, dbKey: "sql_basics" },
  intermediate: { label: "Intermediate", route: "/sql/intermediate", problems: SQL_INTERMEDIATE_PROBLEMS, dbKey: "sql_intermediate" },
  advanced: { label: "Advanced", route: "/sql/advanced", problems: SQL_ADVANCED_PROBLEMS, dbKey: "sql_advanced" },
  interview: { label: "Interview", route: "/sql/interview", problems: SQL_INTERVIEW_PROBLEMS, dbKey: "sql_interview" },
  scenarios: { label: "Scenarios", route: "/sql/scenarios", problems: SQL_SCENARIOS_PROBLEMS, dbKey: "sql_scenario" },
  company: { label: "Company", route: "/sql/company", problems: SQL_COMPANY_PROBLEMS, dbKey: "sql_company" },
};

function normalize(text) {
  return String(text || "").toLowerCase();
}

export function matchesProblem(problem, query) {
  const q = normalize(query).trim();
  if (!q) return true;

  const haystack = [
    problem.title,
    problem.description,
    problem.explanation,
    problem.scenario,
    problem.hint,
    problem.difficulty,
    problem.company,
    problem.starterQuery,
    ...(problem.useCases || []),
    ...(problem.tags || []),
  ]
    .map(normalize)
    .join(" ");

  return haystack.includes(q);
}

export function searchSqlProblems(query) {
  const q = normalize(query).trim();
  if (!q) return [];

  const results = [];
  Object.entries(SQL_CATEGORY_CONFIG).forEach(([categoryKey, config]) => {
    config.problems.forEach((problem) => {
      if (matchesProblem(problem, q)) {
        results.push({
          categoryKey,
          categoryLabel: config.label,
          route: config.route,
          problem,
        });
      }
    });
  });

  return results;
}
