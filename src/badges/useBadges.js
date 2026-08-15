import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../supabase";
import { 
  calculateEarnedBadges, 
  buildStatsFromSubmissions, 
  getNewlyEarnedBadges,
  calculatePythonBadges, 
  getNewlyUnlockedPythonBadges 
} from "./badgeCalculator";

import { 
  getEarnedBadgeObjects, 
  getClosestBadges, 
  getCertificateBadges, 
  getTopBadge, 
  getTopNBadges, 
  getBadgesForProfile 
} from "./badgeUtils";

import { SECTION_BADGES, PYTHON_BADGES } from "./badgeDefinitions";

// ── MAIN HOOK: useBadges ─────────────────────────────────────────────────────
export function useBadges({ userId: externalUserId = null, category = "sql", autoSave = true } = {}) {
  const [loading, setLoading]             = useState(true);
  const [earnedIds, setEarnedIds]         = useState([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);
  const [stats, setStats]                 = useState({});
  const [badgesWithStatus, setBadgesWithStatus] = useState([]);

  const prevEarnedIdsRef = useRef([]);
  const isPython = category === "python_basics";

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

      // 2. Fetch submissions, streaks, profile data, and user_badges table in parallel
      const [
        { data: submissions },
        { data: streakRow },
        { data: profile },
        { data: userBadgesData }
      ] = await Promise.all([
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
        supabase
          .from("user_badges")
          .select("badge_id, earned_at")
          .eq("user_id", userId)
      ]);

      const currentStreak = streakRow?.current_streak || 0;
      const longestStreak = streakRow?.longest_streak || 0;

      // 3. Stored badge IDs
      const storedBadgeIds = Array.isArray(profile?.earned_badges) ? profile.earned_badges : [];
      prevEarnedIdsRef.current = storedBadgeIds;

      // 4. Calculate earned badges based on Category (Python vs SQL)
      let builtStats = {};
      let currentEarned = [];

      if (isPython) {
        builtStats = buildStatsFromSubmissions(submissions || [], currentStreak, longestStreak);
        currentEarned = calculatePythonBadges(builtStats);
      } else {
        builtStats = buildStatsFromSubmissions(submissions || [], currentStreak, longestStreak);
        currentEarned = calculateEarnedBadges(builtStats);
      }

      // 5. Build category-specific status array (for UI badge grids)
      const allDefinitions = isPython ? PYTHON_BADGES : SECTION_BADGES;
      const earnedSet = new Set(userBadgesData ? userBadgesData.map(b => b.badge_id) : currentEarned);

      const computedBadgesWithStatus = allDefinitions.map(badge => ({
        ...badge,
        earned: earnedSet.has(badge.id),
        earnedAt: userBadgesData?.find(b => b.badge_id === badge.id)?.earned_at || null,
      }));

      // 6. Detect newly unlocked badges
      const justUnlocked = isPython 
        ? getNewlyUnlockedPythonBadges(storedBadgeIds, currentEarned)
        : getNewlyEarnedBadges(storedBadgeIds, currentEarned);
      const justUnlockedObjects = getEarnedBadgeObjects(justUnlocked);

      // 7. Save updated badges to profile if autoSave is active
      if (autoSave && (justUnlocked.length > 0 || !profile?.earned_badges)) {
        const { error: updateErr } = await supabase
          .from("profiles")
          .update({ earned_badges: currentEarned })
          .eq("id", userId);

        if (updateErr) {
          console.error("Failed to save earned_badges to profiles table:", updateErr);
        }
      }

      // 8. Update State
      setStats(builtStats);
      setEarnedIds(currentEarned);
      setBadgesWithStatus(computedBadgesWithStatus);
      if (justUnlockedObjects.length > 0) {
        setNewlyUnlocked(justUnlockedObjects);
      }

    } catch (err) {
      console.error("useBadges error:", err);
    } finally {
      setLoading(false);
    }
  },[externalUserId, autoSave, isPython]);

  useEffect(() => {
    fetchAndCalculate();
  }, [fetchAndCalculate]);

  const earnedBadges      = getEarnedBadgeObjects(earnedIds);
  const closestBadges     = getClosestBadges(stats, earnedIds);
  const topBadge          = getTopBadge(earnedIds);
  const topTwoBadges      = getTopNBadges(earnedIds, 2);
  const profileBadges     = getBadgesForProfile(earnedIds);
  const certificateBadges = getCertificateBadges(earnedIds);

  return {
    loading,
    badges: badgesWithStatus,
    earnedIds,
    earnedBadges,
    newlyUnlocked,
    stats,
    closestBadges,
    topBadge,
    topTwoBadges,
    profileBadges,
    certificateBadges,
    refresh: fetchAndCalculate,
    clearNewlyUnlocked: () => setNewlyUnlocked([]),
  };
}

// ── READ-ONLY STORED BADGES HOOK ─────────────────────────────────────────────
export function useStoredBadges(userId) {
  const [loading, setLoading]     = useState(true);
  const [earnedIds, setEarnedIds] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchStored = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from("profiles")
          .select("earned_badges")
          .eq("id", userId)
          .maybeSingle();

        setEarnedIds(Array.isArray(data?.earned_badges) ? data.earned_badges : []);
      } catch (err) {
        console.error("useStoredBadges error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStored();
  }, [userId]);

  return {
    loading,
    earnedIds,
    topTwoBadges: getTopNBadges(earnedIds, 2),
    topBadge:     getTopBadge(earnedIds),
  };
}

// ── ASYNC BADGE CHECK & SAVE UTILITY ────────────────────────────────────────
export async function checkAndSaveBadges(userId) {
  if (!userId) return [];

  try {
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

    const storedBadgeIds = Array.isArray(profile?.earned_badges) ? profile.earned_badges : [];
    const currentStreak  = streakRow?.current_streak  || 0;
    const longestStreak  = streakRow?.longest_streak  || 0;

    const builtStats    = buildStatsFromSubmissions(submissions || [], currentStreak, longestStreak);
    const currentEarned = calculateEarnedBadges(builtStats);
    const justUnlocked  = getNewlyEarnedBadges(storedBadgeIds, currentEarned);

    // Save back to profiles table
    if (justUnlocked.length > 0 || !profile?.earned_badges) {
      const { error: updateErr } = await supabase
        .from("profiles")
        .update({ earned_badges: currentEarned })
        .eq("id", userId);

      if (updateErr) {
        console.error("Error saving earned_badges in checkAndSaveBadges:", updateErr);
      }
    }

    return getEarnedBadgeObjects(justUnlocked);

  } catch (err) {
    console.error("checkAndSaveBadges error:", err);
    return [];
  }
}
// import { useState, useEffect, useCallback, useRef } from "react";
// import { supabase } from "../supabase";
// import { calculateEarnedBadges, buildStatsFromSubmissions, getNewlyEarnedBadges } from "./badgeCalculator";
// import { getEarnedBadgeObjects, getClosestBadges, getCertificateBadges, getTopBadge, getTopNBadges, getBadgesForProfile } from "./badgeUtils";

// /**
//  * useBadges — custom hook for the entire badge system.
//  *
//  * Usage:
//  *   const badges = useBadges();
//  *   const badges = useBadges({ userId: "abc" });         // for viewing another user's profile
//  *   const badges = useBadges({ autoSave: false });       // read-only, no Supabase writes
//  *
//  * Returns:
//  *   {
//  *     loading          {boolean}
//  *     earnedIds        {string[]}       — array of earned badge IDs
//  *     earnedBadges     {object[]}       — full badge objects for earned badges
//  *     newlyUnlocked    {object[]}       — badges unlocked THIS session (triggers modal)
//  *     stats            {object}         — raw stats used for calculation
//  *     closestBadges    {object[]}       — top 3 nearest-to-unlock badges
//  *     topBadge         {object|null}    — single highest-tier badge
//  *     topTwoBadges     {object[]}       — top 2 badges for leaderboard
//  *     profileBadges    {object}         — all badges grouped for profile page
//  *     certificateBadges{object[]}       — earned badges with certificates
//  *     refresh          {function}       — manually re-fetch and recalculate
//  *     clearNewlyUnlocked {function}     — call after showing the unlock modal
//  *   }
//  */
// export function useBadges({ userId: externalUserId = null, autoSave = true } = {}) {
//   const [loading, setLoading]             = useState(true);
//   const [earnedIds, setEarnedIds]         = useState([]);
//   const [newlyUnlocked, setNewlyUnlocked] = useState([]);
//   const [stats, setStats]                 = useState({});

//   // Keep a ref of previously stored badge IDs so we can diff after refresh
//   const prevEarnedIdsRef = useRef([]);

//   // ── Core fetch + calculate ─────────────────────────────────────────────────
//   const fetchAndCalculate = useCallback(async () => {
//     setLoading(true);

//     try {
//       // 1. Resolve user ID
//       let userId = externalUserId;
//       if (!userId) {
//         const { data: sessionData } = await supabase.auth.getSession();
//         userId = sessionData?.session?.user?.id;
//       }
//       if (!userId) {
//         setLoading(false);
//         return;
//       }

//       // 2. Fetch all submissions for this user
//       const { data: submissions } = await supabase
//         .from("submissions")
//         .select("problem_id, category, status, created_at, updated_at")
//         .eq("user_id", userId);

//       // 3. Fetch streak data
//       const { data: streakRow } = await supabase
//         .from("user_streaks")
//         .select("current_streak, longest_streak")
//         .eq("user_id", userId)
//         .maybeSingle();

//       const currentStreak  = streakRow?.current_streak  || 0;
//       const longestStreak  = streakRow?.longest_streak  || 0;

//       // 4. Fetch previously stored badge IDs from profiles
//       const { data: profile } = await supabase
//         .from("profiles")
//         .select("earned_badges")
//         .eq("id", userId)
//         .maybeSingle();

//       const storedBadgeIds = profile?.earned_badges || [];
//       prevEarnedIdsRef.current = storedBadgeIds;

//       // 5. Build stats and calculate current earned badges
//       const builtStats    = buildStatsFromSubmissions(submissions || [], currentStreak, longestStreak);
//       const currentEarned = calculateEarnedBadges(builtStats);

//       // 6. Detect newly unlocked badges
//       const justUnlocked = getNewlyEarnedBadges(storedBadgeIds, currentEarned);
//       const justUnlockedObjects = getEarnedBadgeObjects(justUnlocked);

//       // 7. Save back to Supabase if there are new badges and autoSave is on
//       if (autoSave && justUnlocked.length > 0) {
//         await supabase
//           .from("profiles")
//           .update({ earned_badges: currentEarned })
//           .eq("id", userId);
//       }

//       // 8. Update state
//       setStats(builtStats);
//       setEarnedIds(currentEarned);
//       if (justUnlockedObjects.length > 0) {
//         setNewlyUnlocked(justUnlockedObjects);
//       }

//     } catch (err) {
//       console.error("useBadges error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [externalUserId, autoSave]);

//   // ── Run on mount ───────────────────────────────────────────────────────────
//   useEffect(() => {
//     fetchAndCalculate();
//   }, [fetchAndCalculate]);

//   // ── Derived values (computed from earnedIds + stats) ───────────────────────
//   const earnedBadges     = getEarnedBadgeObjects(earnedIds);
//   const closestBadges    = getClosestBadges(stats, earnedIds);
//   const topBadge         = getTopBadge(earnedIds);
//   const topTwoBadges     = getTopNBadges(earnedIds, 2);
//   const profileBadges    = getBadgesForProfile(earnedIds);
//   const certificateBadges = getCertificateBadges(earnedIds);

//   // ── Public API ─────────────────────────────────────────────────────────────
//   return {
//     loading,
//     earnedIds,
//     earnedBadges,
//     newlyUnlocked,
//     stats,
//     closestBadges,
//     topBadge,
//     topTwoBadges,
//     profileBadges,
//     certificateBadges,
//     refresh:            fetchAndCalculate,
//     clearNewlyUnlocked: () => setNewlyUnlocked([]),
//   };
// }

// /**
//  * Lightweight version — only reads stored badge IDs from profiles.
//  * No recalculation. Use for leaderboard rows, other users' profiles.
//  *
//  * @param {string} userId
//  * @returns {{ loading: boolean, earnedIds: string[], topTwoBadges: object[] }}
//  */
// export function useStoredBadges(userId) {
//   const [loading, setLoading]     = useState(true);
//   const [earnedIds, setEarnedIds] = useState([]);

//   useEffect(() => {
//     if (!userId) return;

//     const fetch = async () => {
//       setLoading(true);
//       try {
//         const { data } = await supabase
//           .from("profiles")
//           .select("earned_badges")
//           .eq("id", userId)
//           .maybeSingle();

//         setEarnedIds(data?.earned_badges || []);
//       } catch (err) {
//         console.error("useStoredBadges error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetch();
//   }, [userId]);

//   return {
//     loading,
//     earnedIds,
//     topTwoBadges: getTopNBadges(earnedIds, 2),
//     topBadge:     getTopBadge(earnedIds),
//   };
// }

// /**
//  * Call this after a correct submission to trigger badge recalculation.
//  * Returns any newly unlocked badge objects so you can show a modal.
//  *
//  * Use this inside runQuery() in your SQL practice pages
//  * instead of importing the full useBadges hook.
//  *
//  * @param {string} userId
//  * @returns {Promise<object[]>} newly unlocked badge objects
//  */
// export async function checkAndSaveBadges(userId) {
//   if (!userId) return [];

//   try {
//     // Fetch fresh data
//     const [{ data: submissions }, { data: streakRow }, { data: profile }] =
//       await Promise.all([
//         supabase
//           .from("submissions")
//           .select("problem_id, category, status, created_at, updated_at")
//           .eq("user_id", userId),
//         supabase
//           .from("user_streaks")
//           .select("current_streak, longest_streak")
//           .eq("user_id", userId)
//           .maybeSingle(),
//         supabase
//           .from("profiles")
//           .select("earned_badges")
//           .eq("id", userId)
//           .maybeSingle(),
//       ]);

//     const storedBadgeIds = profile?.earned_badges || [];
//     const currentStreak  = streakRow?.current_streak  || 0;
//     const longestStreak  = streakRow?.longest_streak  || 0;

//     const builtStats    = buildStatsFromSubmissions(submissions || [], currentStreak, longestStreak);
//     const currentEarned = calculateEarnedBadges(builtStats);
//     const justUnlocked  = getNewlyEarnedBadges(storedBadgeIds, currentEarned);

//     // Save if new badges were earned
//     if (justUnlocked.length > 0) {
//       await supabase
//         .from("profiles")
//         .update({ earned_badges: currentEarned })
//         .eq("id", userId);
//     }

//     return getEarnedBadgeObjects(justUnlocked);

//   } catch (err) {
//     console.error("checkAndSaveBadges error:", err);
//     return [];
//   }
// }