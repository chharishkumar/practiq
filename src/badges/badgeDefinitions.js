// ─── TIER COLORS ─────────────────────────────────────────────────────────────

export const TIER_STYLES = {
    bronze:   { color: "#CD7F32", bg: "#fdf3e7", border: "#e8c49a", label: "Bronze" },
    silver:   { color: "#9BA8B0", bg: "#f4f6f7", border: "#c8d0d4", label: "Silver" },
    gold:     { color: "#D4A017", bg: "#fffbeb", border: "#fde68a", label: "Gold"   },
    platinum: { color: "#6B7FA3", bg: "#f0f2f8", border: "#c5cce0", label: "Platinum" },
    diamond:  { color: "#22B8CC", bg: "#ecfeff", border: "#a5f3fc", label: "Diamond"  },
    special:  { color: "#7C3AED", bg: "#f5f3ff", border: "#ddd6fe", label: "Special"  },
  };
  
  // ─── SECTION COMPLETION BADGES ───────────────────────────────────────────────
  // Earned by completing X problems in a specific category
  
  export const SECTION_BADGES = [
  
    // SQL Basics
    {
      id:          "basics_bronze",
      title:       "SQL Beginner",
      icon:        "🥉",
      tier:        "bronze",
      category:    "sql_basics",
      threshold:   25,
      description: "Completed 25 SQL Basics problems.",
      shareText:   "I just earned the SQL Beginner badge on Repractiq! 25 SQL Basics down. 🥉",
      certificate: true,
    },
    {
      id:          "basics_silver",
      title:       "SQL Explorer",
      icon:        "🥈",
      tier:        "silver",
      category:    "sql_basics",
      threshold:   50,
      description: "Completed 50 SQL Basics problems.",
      shareText:   "Earned SQL Explorer on Repractiq — halfway through SQL Basics! 🥈",
      certificate: true,
    },
    {
      id:          "basics_gold",
      title:       "SQL Fundamentals Master",
      icon:        "🥇",
      tier:        "gold",
      category:    "sql_basics",
      threshold:   100,
      description: "Completed all 100 SQL Basics problems.",
      shareText:   "I just completed all 100 SQL Basics on Repractiq and earned SQL Fundamentals Master! 🥇",
      certificate: true,
    },
  
    // SQL Intermediate
    {
      id:          "intermediate_bronze",
      title:       "Query Builder",
      icon:        "🥉",
      tier:        "bronze",
      category:    "sql_intermediate",
      threshold:   25,
      description: "Completed 25 SQL Intermediate problems.",
      shareText:   "Earned Query Builder on Repractiq — SQL Intermediate journey started! 🥉",
      certificate: true,
    },
    {
      id:          "intermediate_silver",
      title:       "Data Analyst",
      icon:        "🥈",
      tier:        "silver",
      category:    "sql_intermediate",
      threshold:   50,
      description: "Completed 50 SQL Intermediate problems.",
      shareText:   "Earned Data Analyst badge on Repractiq — 50 Intermediate SQL problems solved! 🥈",
      certificate: true,
    },
    {
      id:          "intermediate_gold",
      title:       "SQL Professional",
      icon:        "🥇",
      tier:        "gold",
      category:    "sql_intermediate",
      threshold:   100,
      description: "Completed all 100 SQL Intermediate problems.",
      shareText:   "Just earned SQL Professional on Repractiq — 100 Intermediate problems done! 🥇",
      certificate: true,
    },
  
    // SQL Advanced
    {
      id:          "advanced_bronze",
      title:       "Window Warrior",
      icon:        "🥉",
      tier:        "bronze",
      category:    "sql_advanced",
      threshold:   25,
      description: "Completed 25 SQL Advanced problems.",
      shareText:   "Earned Window Warrior on Repractiq — tackling advanced SQL! 🥉",
      certificate: true,
    },
    {
      id:          "advanced_silver",
      title:       "Query Optimizer",
      icon:        "🥈",
      tier:        "silver",
      category:    "sql_advanced",
      threshold:   50,
      description: "Completed 50 SQL Advanced problems.",
      shareText:   "Earned Query Optimizer on Repractiq — 50 Advanced SQL problems solved! 🥈",
      certificate: true,
    },
    {
      id:          "advanced_gold",
      title:       "SQL Architect",
      icon:        "🥇",
      tier:        "gold",
      category:    "sql_advanced",
      threshold:   100,
      description: "Completed all 100 SQL Advanced problems.",
      shareText:   "Just earned SQL Architect on Repractiq — all 100 Advanced problems done! 🥇",
      certificate: true,
    },
  
    // SQL Interview
    {
      id:          "interview_bronze",
      title:       "Interview Ready",
      icon:        "🥉",
      tier:        "bronze",
      category:    "sql_interview",
      threshold:   25,
      description: "Completed 25 SQL Interview problems.",
      shareText:   "Earned Interview Ready on Repractiq — SQL interview prep started! 🥉",
      certificate: true,
    },
    {
      id:          "interview_silver",
      title:       "Hiring Manager's Pick",
      icon:        "🥈",
      tier:        "silver",
      category:    "sql_interview",
      threshold:   50,
      description: "Completed 50 SQL Interview problems.",
      shareText:   "Earned Hiring Manager's Pick on Repractiq — 50 interview questions solved! 🥈",
      certificate: true,
    },
    {
      id:          "interview_gold",
      title:       "Interview Cracker",
      icon:        "🥇",
      tier:        "gold",
      category:    "sql_interview",
      threshold:   100,
      description: "Completed all 100 SQL Interview problems.",
      shareText:   "Just earned Interview Cracker on Repractiq — 100 interview questions mastered! 🥇",
      certificate: true,
    },
  
    // SQL Scenarios
    {
      id:          "scenarios_bronze",
      title:       "Business Thinker",
      icon:        "🥉",
      tier:        "bronze",
      category:    "sql_scenario",
      threshold:   25,
      description: "Completed 25 SQL Scenario problems.",
      shareText:   "Earned Business Thinker on Repractiq — solving real-world SQL scenarios! 🥉",
      certificate: true,
    },
    {
      id:          "scenarios_silver",
      title:       "Data Problem Solver",
      icon:        "🥈",
      tier:        "silver",
      category:    "sql_scenario",
      threshold:   50,
      description: "Completed 50 SQL Scenario problems.",
      shareText:   "Earned Data Problem Solver on Repractiq — 50 real-world scenarios done! 🥈",
      certificate: true,
    },
    {
      id:          "scenarios_gold",
      title:       "Production Ready Analyst",
      icon:        "🥇",
      tier:        "gold",
      category:    "sql_scenario",
      threshold:   100,
      description: "Completed all 100 SQL Scenario problems.",
      shareText:   "Just earned Production Ready Analyst on Repractiq — all 100 Scenarios done! 🥇",
      certificate: true,
    },

    // SQL Company
    {
      id:          "company_bronze",
      title:       "Company Prep Starter",
      icon:        "🥉",
      tier:        "bronze",
      category:    "sql_company",
      threshold:   25,
      description: "Completed 25 Top Company SQL problems.",
      shareText:   "Earned Company Prep Starter on Repractiq — FAANG SQL prep started! 🥉",
      certificate: true,
    },
    {
      id:          "company_silver",
      title:       "FAANG Ready",
      icon:        "🥈",
      tier:        "silver",
      category:    "sql_company",
      threshold:   50,
      description: "Completed 50 Top Company SQL problems.",
      shareText:   "Earned FAANG Ready on Repractiq — 50 company interview questions solved! 🥈",
      certificate: true,
    },
    {
      id:          "company_gold",
      title:       "Top Company SQL Master",
      icon:        "🥇",
      tier:        "gold",
      category:    "sql_company",
      threshold:   100,
      description: "Completed 100 Top Company SQL problems.",
      shareText:   "Just earned Top Company SQL Master on Repractiq — 100 company questions mastered! 🥇",
      certificate: true,
    },
  ];
  // Earned by total problems solved across all categories
  
  export const GLOBAL_BADGES = [
    {
      id:          "first_query",
      title:       "First Query",
      icon:        "✨",
      tier:        "bronze",
      threshold:   1,
      description: "Solved your very first problem. Every expert started here.",
      shareText:   "Just solved my first SQL problem on Repractiq! The journey begins. ✨",
    },
    {
      id:          "consistent_learner",
      title:       "Consistent Learner",
      icon:        "📚",
      tier:        "bronze",
      threshold:   10,
      description: "Solved 10 problems total.",
      shareText:   "10 SQL problems solved on Repractiq! Building consistency. 📚",
    },
    {
      id:          "sql_enthusiast",
      title:       "SQL Enthusiast",
      icon:        "⚡",
      tier:        "silver",
      threshold:   50,
      description: "Solved 50 problems total.",
      shareText:   "50 SQL problems solved on Repractiq! Loving the grind. ⚡",
    },
    {
      id:          "sql_addict",
      title:       "SQL Addict",
      icon:        "🔥",
      tier:        "silver",
      threshold:   100,
      description: "Solved 100 problems total.",
      shareText:   "100 SQL problems solved on Repractiq! Officially addicted. 🔥",
    },
    {
      id:          "data_explorer",
      title:       "Data Explorer",
      icon:        "🌍",
      tier:        "gold",
      threshold:   250,
      description: "Solved 250 problems total.",
      shareText:   "250 SQL problems solved on Repractiq! Deep in the data. 🌍",
    },
    {
      id:          "sql_champion",
      title:       "SQL Champion",
      icon:        "🏆",
      tier:        "platinum",
      threshold:   600,
      description: "Solved 600 problems total.",
      shareText:   "600 SQL problems solved on Repractiq! Championship level. 🏆",
    },
    {
      id:          "practiq_elite",
      title:       "Practiq Elite",
      icon:        "💎",
      tier:        "diamond",
      threshold:   800,
      description: "Solved all 800 Repractiq problems.",
      shareText:   "I just completed ALL 800 SQL problems on Repractiq! 💎 Practiq Elite achieved.",
      certificate: true,
    },
  ];
  
  // ─── SPECIAL ACHIEVEMENT BADGES ──────────────────────────────────────────────
  // Earned by specific behaviors (streak, speed, accuracy etc.)
  
  export const SPECIAL_BADGES = [
    {
      id:          "streak_7",
      title:       "7 Day Streak",
      icon:        "🔥",
      tier:        "silver",
      type:        "streak",
      threshold:   7,
      description: "Solved problems 7 days in a row.",
      shareText:   "7-day SQL streak on Repractiq! Consistency is everything. 🔥",
    },
    {
      id:          "streak_30",
      title:       "30 Day Streak",
      icon:        "🔥",
      tier:        "gold",
      type:        "streak",
      threshold:   30,
      description: "Solved problems 30 days in a row.",
      shareText:   "30-day SQL streak on Repractiq! A full month of consistency. 🔥",
      certificate: true,
    },
    {
      id:          "speed_runner",
      title:       "Speed Runner",
      icon:        "⚡",
      tier:        "silver",
      type:        "speed",
      threshold:   10,
      description: "Solved 10 problems in a single day.",
      shareText:   "Speed Runner badge earned on Repractiq — 10 problems in one day! ⚡",
    },
    {
      id:          "accuracy_master",
      title:       "Accuracy Master",
      icon:        "🎯",
      tier:        "gold",
      type:        "accuracy",
      threshold:   90,
      minProblems: 50,
      description: "Maintained 90%+ accuracy across 50+ problems.",
      shareText:   "Accuracy Master on Repractiq — 90%+ correct across 50 problems! 🎯",
    },
    {
      id:          "weekend_warrior",
      title:       "Weekend Warrior",
      icon:        "🚀",
      tier:        "silver",
      type:        "weekend",
      threshold:   25,
      description: "Solved 25 problems in a single weekend.",
      shareText:   "Weekend Warrior on Repractiq — 25 problems in one weekend! 🚀",
    },
    {
      id:          "top_1_percent",
      title:       "Top 1%",
      icon:        "👑",
      tier:        "platinum",
      type:        "leaderboard",
      description: "Ranked in the top 1% of all Repractiq users.",
      shareText:   "I'm in the Top 1% on Repractiq! 👑",
    },
  ];
  
  // ─── GRANDMASTER BADGE ───────────────────────────────────────────────────────
  // Unlocked only when all 5 Gold section badges are earned
  
  export const GRANDMASTER_BADGE = {
    id:          "sql_grandmaster",
    title:       "SQL Grandmaster",
    icon:        "👑",
    tier:        "diamond",
    description: "Completed all 800 Repractiq challenges and demonstrated mastery across SQL fundamentals, analytics, optimization, interviews, company prep, and real-world business scenarios.",
    shareText:   "I just became an SQL Grandmaster on Repractiq — all 800 challenges completed across every category. 👑",
    certificate: true,
    requires:    ["basics_gold", "intermediate_gold", "advanced_gold", "interview_gold", "scenarios_gold", "company_gold"],
  };
  
  // ─── ALL BADGES COMBINED ─────────────────────────────────────────────────────
  
  export const ALL_BADGES = [
    ...SECTION_BADGES,
    ...GLOBAL_BADGES,
    ...SPECIAL_BADGES,
    GRANDMASTER_BADGE,
  ];
  
  // ─── CATEGORY DISPLAY NAMES ──────────────────────────────────────────────────
  
  export const CATEGORY_LABELS = {
    sql_basics:       "SQL Basics",
    sql_intermediate: "SQL Intermediate",
    sql_advanced:     "SQL Advanced",
    sql_interview:    "SQL Interview",
    sql_scenario:     "SQL Scenarios",
    sql_company:      "Top Company Questions",
  };