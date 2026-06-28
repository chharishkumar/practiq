import { SECTION_BADGES, GLOBAL_BADGES, SPECIAL_BADGES, GRANDMASTER_BADGE } from "./badgeDefinitions";

/**
 * Main calculator — takes user stats, returns array of earned badge IDs.
 *
 * @param {object} stats
 * @param {number} stats.basicsCount        - correct problems in sql_basics
 * @param {number} stats.intermediateCount  - correct problems in sql_intermediate
 * @param {number} stats.advancedCount      - correct problems in sql_advanced
 * @param {number} stats.interviewCount     - correct problems in sql_interview
 * @param {number} stats.scenariosCount     - correct problems in sql_scenario
 * @param {number} stats.totalCount         - total correct across all categories
 * @param {number} stats.currentStreak      - current daily streak
 * @param {number} stats.longestStreak      - longest streak ever
 * @param {number} stats.accuracy           - accuracy % (0-100)
 * @param {number} stats.totalAttempts      - total problems attempted
 * @param {number} stats.todayCount         - problems solved today
 * @param {number} stats.weekendCount       - problems solved this weekend
 * @returns {string[]} array of earned badge IDs
 */
export function calculateEarnedBadges(stats = {}) {
  const {
    basicsCount       = 0,
    intermediateCount = 0,
    advancedCount     = 0,
    interviewCount    = 0,
    scenariosCount    = 0,
    companyCount      = 0,
    totalCount        = 0,
    // currentStreak     = 0,
    longestStreak     = 0,
    accuracy          = 0,
    totalAttempts     = 0,
    todayCount        = 0,
    weekendCount      = 0,
  } = stats;

  const earned = [];

  // ── Section badges ────────────────────────────────────────────────────────
  const categoryCountMap = {
    sql_basics:       basicsCount,
    sql_intermediate: intermediateCount,
    sql_advanced:     advancedCount,
    sql_interview:    interviewCount,
    sql_scenario:     scenariosCount,
    sql_company:      companyCount,
  };

  for (const badge of SECTION_BADGES) {
    const count = categoryCountMap[badge.category] || 0;
    if (count >= badge.threshold) {
      earned.push(badge.id);
    }
  }

  // ── Global progress badges ────────────────────────────────────────────────
  for (const badge of GLOBAL_BADGES) {
    if (totalCount >= badge.threshold) {
      earned.push(badge.id);
    }
  }

  // ── Special achievement badges ────────────────────────────────────────────
  for (const badge of SPECIAL_BADGES) {
    switch (badge.type) {

      case "streak":
        // Use longestStreak so the badge is never lost if streak resets
        if (longestStreak >= badge.threshold) {
          earned.push(badge.id);
        }
        break;

      case "speed":
        // Speed Runner: solved X problems in one day
        if (todayCount >= badge.threshold) {
          earned.push(badge.id);
        }
        break;

      case "accuracy":
        // Accuracy Master: 90%+ accuracy across 50+ problems
        if (
          totalAttempts >= (badge.minProblems || 0) &&
          accuracy >= badge.threshold
        ) {
          earned.push(badge.id);
        }
        break;

      case "weekend":
        // Weekend Warrior: 25 problems in a weekend
        if (weekendCount >= badge.threshold) {
          earned.push(badge.id);
        }
        break;

      case "leaderboard":
        // Top 1% — awarded externally, skip here
        break;

      default:
        break;
    }
  }

  // ── Grandmaster badge ─────────────────────────────────────────────────────
  const allGoldEarned = GRANDMASTER_BADGE.requires.every((id) =>
    earned.includes(id)
  );
  if (allGoldEarned) {
    earned.push(GRANDMASTER_BADGE.id);
  }

  return earned;
}

/**
 * Compares previous and current earned badge arrays.
 * Returns badge IDs that are newly earned in this session.
 *
 * @param {string[]} prevBadgeIds
 * @param {string[]} currentBadgeIds
 * @returns {string[]} newly earned badge IDs
 */
export function getNewlyEarnedBadges(prevBadgeIds = [], currentBadgeIds = []) {
  const prevSet = new Set(prevBadgeIds);
  return currentBadgeIds.filter((id) => !prevSet.has(id));
}

/**
 * Calculates accuracy percentage from submission counts.
 *
 * @param {number} correctCount
 * @param {number} totalAttempted  - unique problems attempted (not total runs)
 * @returns {number} accuracy 0–100
 */
export function calculateAccuracy(correctCount, totalAttempted) {
  if (!totalAttempted || totalAttempted === 0) return 0;
  return Math.round((correctCount / totalAttempted) * 100);
}

/**
 * Builds the stats object needed by calculateEarnedBadges
 * from raw Supabase submission data.
 *
 * @param {object[]} submissions  - array of submission rows from Supabase
 * @param {number}   currentStreak
 * @param {number}   longestStreak
 * @returns {object} stats ready for calculateEarnedBadges()
 */
export function buildStatsFromSubmissions(submissions = [], currentStreak = 0, longestStreak = 0) {
  const correct = submissions.filter((s) => s.status === "correct");

  // Count unique problems solved per category
  const solvedPerCategory = {};
  const solvedIds = new Set();

  for (const s of correct) {
    const key = `${s.category}::${s.problem_id}`;
    if (!solvedIds.has(key)) {
      solvedIds.add(key);
      solvedPerCategory[s.category] = (solvedPerCategory[s.category] || 0) + 1;
    }
  }

  const totalCount = solvedIds.size;

  // Unique problems attempted (regardless of status)
  const attemptedIds = new Set(submissions.map((s) => `${s.category}::${s.problem_id}`));
  const totalAttempts = attemptedIds.size;

  const accuracy = calculateAccuracy(totalCount, totalAttempts);

  // Today's correct solves
  const todayStr = new Date().toISOString().split("T")[0];
  const todayCount = correct.filter((s) => {
    const d = (s.updated_at || s.created_at || "").slice(0, 10);
    return d === todayStr;
  }).length;

  // Weekend correct solves (Sat + Sun of current week)
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 6=Sat
  const isSat = day === 6;
  const isSun = day === 0;

  let weekendCount = 0;
  if (isSat || isSun) {
    const sat = new Date(now);
    if (isSun) sat.setDate(now.getDate() - 1);
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);

    const satStr = sat.toISOString().split("T")[0];
    const sunStr = sun.toISOString().split("T")[0];

    weekendCount = correct.filter((s) => {
      const d = (s.updated_at || s.created_at || "").slice(0, 10);
      return d === satStr || d === sunStr;
    }).length;
  }

  return {
    basicsCount:       solvedPerCategory["sql_basics"]       || 0,
    intermediateCount: solvedPerCategory["sql_intermediate"] || 0,
    advancedCount:     solvedPerCategory["sql_advanced"]     || 0,
    interviewCount:    solvedPerCategory["sql_interview"]    || 0,
    scenariosCount:    solvedPerCategory["sql_scenario"]     || 0,
    companyCount:      solvedPerCategory["sql_company"]      || 0,
    totalCount,
    totalAttempts,
    accuracy,
    currentStreak,
    longestStreak,
    todayCount,
    weekendCount,
  };
}