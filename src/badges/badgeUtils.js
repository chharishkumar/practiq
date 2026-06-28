import {
    ALL_BADGES,
    SECTION_BADGES,
    GLOBAL_BADGES,
    SPECIAL_BADGES,
    GRANDMASTER_BADGE,
    TIER_STYLES,
    CATEGORY_LABELS,
  } from "./badgeDefinitions";
  
  // ─── LOOKUP ───────────────────────────────────────────────────────────────────
  
  /**
   * Get a single badge definition by ID.
   * @param {string} id
   * @returns {object|null}
   */
  export function getBadgeById(id) {
    return ALL_BADGES.find((b) => b.id === id) || null;
  }
  
  /**
   * Get tier style object (color, bg, border, label) for a badge.
   * @param {object|string} badgeOrTier — badge object or tier string
   * @returns {object}
   */
  export function getTierStyle(badgeOrTier) {
    const tier = typeof badgeOrTier === "string" ? badgeOrTier : badgeOrTier?.tier;
    return TIER_STYLES[tier] || TIER_STYLES.bronze;
  }
  
  // ─── PROGRESS ────────────────────────────────────────────────────────────────
  
  /**
   * Returns 0–100 progress % toward a badge threshold.
   * @param {object} badge
   * @param {number} currentCount
   * @returns {number}
   */
  export function getBadgeProgress(badge, currentCount) {
    if (!badge.threshold) return 0;
    return Math.min(100, Math.round((currentCount / badge.threshold) * 100));
  }
  
  /**
   * Returns how many more problems are needed to unlock a badge.
   * @param {object} badge
   * @param {number} currentCount
   * @returns {number}
   */
  export function getRemaining(badge, currentCount) {
    if (!badge.threshold) return 0;
    return Math.max(0, badge.threshold - currentCount);
  }
  
  // ─── NEXT BADGE ──────────────────────────────────────────────────────────────
  
  /**
   * Returns the next unearned section badge for a given category.
   * @param {string}   category     — e.g. "sql_basics"
   * @param {number}   currentCount — problems solved in that category
   * @param {string[]} earnedIds    — already earned badge IDs
   * @returns {object|null}
   */
  export function getNextSectionBadge(category, currentCount, earnedIds = []) {
    const categoryBadges = SECTION_BADGES
      .filter((b) => b.category === category)
      .sort((a, b) => a.threshold - b.threshold);
  
    return (
      categoryBadges.find(
        (b) => !earnedIds.includes(b.id) && currentCount < b.threshold
      ) || null
    );
  }
  
  /**
   * Returns the next unearned global badge.
   * @param {number}   totalCount — total problems solved
   * @param {string[]} earnedIds
   * @returns {object|null}
   */
  export function getNextGlobalBadge(totalCount, earnedIds = []) {
    const sorted = [...GLOBAL_BADGES].sort((a, b) => a.threshold - b.threshold);
    return (
      sorted.find(
        (b) => !earnedIds.includes(b.id) && totalCount < b.threshold
      ) || null
    );
  }
  
  /**
   * Returns the 3 badges the user is closest to unlocking (across all types).
   * Useful for the homepage "Your Progress" widget.
   * @param {object}   stats     — same shape as buildStatsFromSubmissions output
   * @param {string[]} earnedIds
   * @returns {Array<{ badge: object, current: number, remaining: number, progress: number }>}
   */
  export function getClosestBadges(stats, earnedIds = []) {
    const {
      basicsCount       = 0,
      intermediateCount = 0,
      advancedCount     = 0,
      interviewCount    = 0,
      scenariosCount    = 0,
      companyCount      = 0,
      totalCount        = 0,
      currentStreak     = 0,
    } = stats;
  
    const categoryCountMap = {
      sql_basics:       basicsCount,
      sql_intermediate: intermediateCount,
      sql_advanced:     advancedCount,
      sql_interview:    interviewCount,
      sql_scenario:     scenariosCount,
      sql_company:      companyCount,
    };
  
    const candidates = [];
  
    // Section badges
    for (const badge of SECTION_BADGES) {
      if (earnedIds.includes(badge.id)) continue;
      const current   = categoryCountMap[badge.category] || 0;
      const remaining = getRemaining(badge, current);
      const progress  = getBadgeProgress(badge, current);
      candidates.push({ badge, current, remaining, progress });
    }
  
    // Global badges
    for (const badge of GLOBAL_BADGES) {
      if (earnedIds.includes(badge.id)) continue;
      const remaining = getRemaining(badge, totalCount);
      const progress  = getBadgeProgress(badge, totalCount);
      candidates.push({ badge, current: totalCount, remaining, progress });
    }
  
    // Streak badges
    for (const badge of SPECIAL_BADGES.filter((b) => b.type === "streak")) {
      if (earnedIds.includes(badge.id)) continue;
      const remaining = getRemaining(badge, currentStreak);
      const progress  = getBadgeProgress(badge, currentStreak);
      candidates.push({ badge, current: currentStreak, remaining, progress });
    }
  
    // Sort by fewest remaining (closest to unlock first)
    candidates.sort((a, b) => a.remaining - b.remaining);
  
    return candidates.slice(0, 3);
  }
  
  // ─── EARNED BADGE OBJECTS ────────────────────────────────────────────────────
  
  /**
   * Converts an array of earned badge IDs into full badge objects.
   * @param {string[]} earnedIds
   * @returns {object[]}
   */
  export function getEarnedBadgeObjects(earnedIds = []) {
    return earnedIds
      .map((id) => getBadgeById(id))
      .filter(Boolean);
  }
  
  /**
   * Returns all badge objects grouped into sections for the profile page.
   * Each badge includes an `earned` boolean.
   * @param {string[]} earnedIds
   * @returns {object}
   */
  export function getBadgesForProfile(earnedIds = []) {
    const mark = (badges) =>
      badges.map((b) => ({ ...b, earned: earnedIds.includes(b.id) }));
  
    return {
      section:     mark(SECTION_BADGES),
      global:      mark(GLOBAL_BADGES),
      special:     mark(SPECIAL_BADGES),
      grandmaster: { ...GRANDMASTER_BADGE, earned: earnedIds.includes(GRANDMASTER_BADGE.id) },
    };
  }
  
  /**
   * Returns section badges grouped by category, each with earned flag.
   * Useful for rendering per-category badge rows on the profile.
   * @param {string[]} earnedIds
   * @returns {object}  { sql_basics: [...], sql_intermediate: [...], ... }
   */
  export function getSectionBadgesByCategory(earnedIds = []) {
    const result = {};
    for (const badge of SECTION_BADGES) {
      if (!result[badge.category]) result[badge.category] = [];
      result[badge.category].push({ ...badge, earned: earnedIds.includes(badge.id) });
    }
    return result;
  }
  
  // ─── DISPLAY HELPERS ─────────────────────────────────────────────────────────
  
  /**
   * Returns the user's single highest-tier earned badge.
   * Used to show a "top badge" in the nav or leaderboard.
   * @param {string[]} earnedIds
   * @returns {object|null}
   */
  export function getTopBadge(earnedIds = []) {
    const TIER_RANK = { diamond: 5, platinum: 4, gold: 3, silver: 2, bronze: 1 };
    const earned = getEarnedBadgeObjects(earnedIds);
    if (earned.length === 0) return null;
    return earned.reduce((best, b) =>
      (TIER_RANK[b.tier] || 0) > (TIER_RANK[best.tier] || 0) ? b : best
    );
  }
  
  /**
   * Returns top N earned badges sorted by tier (highest first).
   * Used for compact badge rows on leaderboard.
   * @param {string[]} earnedIds
   * @param {number}   n
   * @returns {object[]}
   */
  export function getTopNBadges(earnedIds = [], n = 2) {
    const TIER_RANK = { diamond: 5, platinum: 4, gold: 3, silver: 2, bronze: 1 };
    const earned = getEarnedBadgeObjects(earnedIds);
    earned.sort((a, b) => (TIER_RANK[b.tier] || 0) - (TIER_RANK[a.tier] || 0));
    return earned.slice(0, n);
  }
  
  /**
   * Returns a human-readable label for a category key.
   * @param {string} categoryKey
   * @returns {string}
   */
  export function getCategoryLabel(categoryKey) {
    return CATEGORY_LABELS[categoryKey] || categoryKey;
  }
  
  /**
   * Formats a badge's progress as a readable string.
   * e.g. "34 / 50 · 16 to go"
   * @param {object} badge
   * @param {number} current
   * @returns {string}
   */
  export function formatProgress(badge, current) {
    if (!badge.threshold) return "";
    const remaining = getRemaining(badge, current);
    if (remaining === 0) return "Completed!";
    return `${current} / ${badge.threshold} · ${remaining} to go`;
  }
  
  // ─── CERTIFICATE ELIGIBILITY ─────────────────────────────────────────────────
  
  /**
   * Returns all earned badges that have a downloadable certificate.
   * @param {string[]} earnedIds
   * @returns {object[]}
   */
  export function getCertificateBadges(earnedIds = []) {
    return getEarnedBadgeObjects(earnedIds).filter((b) => b.certificate === true);
  }