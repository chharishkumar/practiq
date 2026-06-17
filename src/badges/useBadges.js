import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../supabase";
import { calculateEarnedBadges, buildStatsFromSubmissions, getNewlyEarnedBadges } from "./badgeCalculator";
import { getEarnedBadgeObjects, getClosestBadges, getCertificateBadges, getTopBadge, getTopNBadges, getBadgesForProfile } from "./badgeUtils";

/**
 * useBadges — custom hook for the entire badge system.
 *
 * Usage:
 *   const badges = useBadges();
 *   const badges = useBadges({ userId: "abc" });         // for viewing another user's profile
 *   const badges = useBadges({ autoSave: false });       // read-only, no Supabase writes
 *
 * Returns:
 *   {
 *     loading          {boolean}
 *     earnedIds        {string[]}       — array of earned badge IDs
 *     earnedBadges     {object[]}       — full badge objects for earned badges
 *     newlyUnlocked    {object[]}       — badges unlocked THIS session (triggers modal)
 *     stats            {object}         — raw stats used for calculation
 *     closestBadges    {object[]}       — top 3 nearest-to-unlock badges
 *     topBadge         {object|null}    — single highest-tier badge
 *     topTwoBadges     {object[]}       — top 2 badges for leaderboard
 *     profileBadges    {object}         — all badges grouped for profile page
 *     certificateBadges{object[]}       — earned badges with certificates
 *     refresh          {function}       — manually re-fetch and recalculate
 *     clearNewlyUnlocked {function}     — call after showing the unlock modal
 *   }
 */
export function useBadges({ userId: externalUserId = null, autoSave = true } = {}) {
  const [loading, setLoading]             = useState(true);
  const [earnedIds, setEarnedIds]         = useState([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);
  const [stats, setStats]                 = useState({});

  // Keep a ref of previously stored badge IDs so we can diff after refresh
  const prevEarnedIdsRef = useRef([]);

  // ── Core fetch + calculate ─────────────────────────────────────────────────
  const fetchAndCalculate = useCallback(async () => {
    setLoading(true);

    try {
      // 1. Resolve user ID
      let userId = externalUserId;
      if (!userId) {
        const { data: sessionData } = await supabase.auth.getSession();
        userId = sessionData?.session?.user?.id;
      }
      if (!userId) {
        setLoading(false);
        return;
      }

      // 2. Fetch all submissions for this user
      const { data: submissions } = await supabase
        .from("submissions")
        .select("problem_id, category, status, created_at, updated_at")
        .eq("user_id", userId);

      // 3. Fetch streak data
      const { data: streakRow } = await supabase
        .from("user_streaks")
        .select("current_streak, longest_streak")
        .eq("user_id", userId)
        .maybeSingle();

      const currentStreak  = streakRow?.current_streak  || 0;
      const longestStreak  = streakRow?.longest_streak  || 0;

      // 4. Fetch previously stored badge IDs from profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("earned_badges")
        .eq("id", userId)
        .maybeSingle();

      const storedBadgeIds = profile?.earned_badges || [];
      prevEarnedIdsRef.current = storedBadgeIds;

      // 5. Build stats and calculate current earned badges
      const builtStats    = buildStatsFromSubmissions(submissions || [], currentStreak, longestStreak);
      const currentEarned = calculateEarnedBadges(builtStats);

      // 6. Detect newly unlocked badges
      const justUnlocked = getNewlyEarnedBadges(storedBadgeIds, currentEarned);
      const justUnlockedObjects = getEarnedBadgeObjects(justUnlocked);

      // 7. Save back to Supabase if there are new badges and autoSave is on
      if (autoSave && justUnlocked.length > 0) {
        await supabase
          .from("profiles")
          .update({ earned_badges: currentEarned })
          .eq("id", userId);
      }

      // 8. Update state
      setStats(builtStats);
      setEarnedIds(currentEarned);
      if (justUnlockedObjects.length > 0) {
        setNewlyUnlocked(justUnlockedObjects);
      }

    } catch (err) {
      console.error("useBadges error:", err);
    } finally {
      setLoading(false);
    }
  }, [externalUserId, autoSave]);

  // ── Run on mount ───────────────────────────────────────────────────────────
  useEffect(() => {
    fetchAndCalculate();
  }, [fetchAndCalculate]);

  // ── Derived values (computed from earnedIds + stats) ───────────────────────
  const earnedBadges     = getEarnedBadgeObjects(earnedIds);
  const closestBadges    = getClosestBadges(stats, earnedIds);
  const topBadge         = getTopBadge(earnedIds);
  const topTwoBadges     = getTopNBadges(earnedIds, 2);
  const profileBadges    = getBadgesForProfile(earnedIds);
  const certificateBadges = getCertificateBadges(earnedIds);

  // ── Public API ─────────────────────────────────────────────────────────────
  return {
    loading,
    earnedIds,
    earnedBadges,
    newlyUnlocked,
    stats,
    closestBadges,
    topBadge,
    topTwoBadges,
    profileBadges,
    certificateBadges,
    refresh:            fetchAndCalculate,
    clearNewlyUnlocked: () => setNewlyUnlocked([]),
  };
}

/**
 * Lightweight version — only reads stored badge IDs from profiles.
 * No recalculation. Use for leaderboard rows, other users' profiles.
 *
 * @param {string} userId
 * @returns {{ loading: boolean, earnedIds: string[], topTwoBadges: object[] }}
 */
export function useStoredBadges(userId) {
  const [loading, setLoading]     = useState(true);
  const [earnedIds, setEarnedIds] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from("profiles")
          .select("earned_badges")
          .eq("id", userId)
          .maybeSingle();

        setEarnedIds(data?.earned_badges || []);
      } catch (err) {
        console.error("useStoredBadges error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [userId]);

  return {
    loading,
    earnedIds,
    topTwoBadges: getTopNBadges(earnedIds, 2),
    topBadge:     getTopBadge(earnedIds),
  };
}

/**
 * Call this after a correct submission to trigger badge recalculation.
 * Returns any newly unlocked badge objects so you can show a modal.
 *
 * Use this inside runQuery() in your SQL practice pages
 * instead of importing the full useBadges hook.
 *
 * @param {string} userId
 * @returns {Promise<object[]>} newly unlocked badge objects
 */
export async function checkAndSaveBadges(userId) {
  if (!userId) return [];

  try {
    // Fetch fresh data
    const [{ data: submissions }, { data: streakRow }, { data: profile }] =
      await Promise.all([
        supabase
          .from("submissions")
          .select("problem_id, category, status, created_at, updated_at")
          .eq("user_id", userId),
        supabase
          .from("user_streaks")
          .select("current_streak, longest_streak")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("profiles")
          .select("earned_badges")
          .eq("id", userId)
          .maybeSingle(),
      ]);

    const storedBadgeIds = profile?.earned_badges || [];
    const currentStreak  = streakRow?.current_streak  || 0;
    const longestStreak  = streakRow?.longest_streak  || 0;

    const builtStats    = buildStatsFromSubmissions(submissions || [], currentStreak, longestStreak);
    const currentEarned = calculateEarnedBadges(builtStats);
    const justUnlocked  = getNewlyEarnedBadges(storedBadgeIds, currentEarned);

    // Save if new badges were earned
    if (justUnlocked.length > 0) {
      await supabase
        .from("profiles")
        .update({ earned_badges: currentEarned })
        .eq("id", userId);
    }

    return getEarnedBadgeObjects(justUnlocked);

  } catch (err) {
    console.error("checkAndSaveBadges error:", err);
    return [];
  }
}