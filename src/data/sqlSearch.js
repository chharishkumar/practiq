import { SQL_PROBLEMS } from "./sqlProblems";
import { SQL_INTERMEDIATE_PROBLEMS } from "./sqlIntermediateProblems";
import { SQL_ADVANCED_PROBLEMS } from "./sqlAdvancedProblems";
import { SQL_INTERVIEW_PROBLEMS } from "./sqlInterviewProblems";
import { SQL_SCENARIOS_PROBLEMS } from "./sqlScenariosProblems";

export const SQL_CATEGORY_CONFIG = {
  basics: { label: "Basics", route: "/sql/basics", problems: SQL_PROBLEMS },
  intermediate: { label: "Intermediate", route: "/sql/intermediate", problems: SQL_INTERMEDIATE_PROBLEMS },
  advanced: { label: "Advanced", route: "/sql/advanced", problems: SQL_ADVANCED_PROBLEMS },
  interview: { label: "Interview", route: "/sql/interview", problems: SQL_INTERVIEW_PROBLEMS },
  scenarios: { label: "Scenarios", route: "/sql/scenarios", problems: SQL_SCENARIOS_PROBLEMS },
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
    problem.starterQuery,
    ...(problem.useCases || []),
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
