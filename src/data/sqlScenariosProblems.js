import { SQL_PROBLEMS } from "./sqlProblems";

// Intermediate problems dataset.
// For now we reuse the existing SQL_PROBLEMS structure (which already includes
// starterQuery, expectedColumns, expectedRowCount, etc.) to ensure the
// SQLIntermediate page renders and can validate queries.
export const SQL_SCENARIOS_PROBLEMS = SQL_PROBLEMS.slice(0, 5);