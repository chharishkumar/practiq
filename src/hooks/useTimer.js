import { useState, useEffect, useRef, useCallback } from "react";

const TIME_LIMITS = {
  Easy:   10 * 60,  // 600 seconds
  Medium: 15 * 60,  // 900 seconds
  Hard:   25 * 60,  // 1500 seconds
};

export default function useTimer(difficulty, resetKey) {
  const totalTime = TIME_LIMITS[difficulty] || TIME_LIMITS.Easy;

  const [timeLeft, setTimeLeft]   = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  const intervalRef   = useRef(null);
  const timeLeftRef   = useRef(totalTime); // ← always in sync, no async delay

  // ── Format MM:SS ────────────────────────────────────────────────────────────
  const formatTime = useCallback((seconds) => {
    const s = Math.max(0, Math.floor(seconds));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }, []);

  // ── Reset whenever difficulty or resetKey changes ────────────────────────────
  useEffect(() => {
    clearInterval(intervalRef.current);
    const newTotal = TIME_LIMITS[difficulty] || TIME_LIMITS.Easy;

    // Reset ref synchronously first
    timeLeftRef.current = newTotal;

    // Reset state
    setTimeLeft(newTotal);
    setIsExpired(false);
    setIsStopped(false);
    setIsRunning(false);

    // Small delay so React flushes false before setting true
    const t = setTimeout(() => setIsRunning(true), 50);
    return () => {
      clearTimeout(t);
      clearInterval(intervalRef.current);
    };
  }, [difficulty, resetKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Countdown tick ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev <= 1 ? 0 : prev - 1;
        timeLeftRef.current = next; // ← update ref synchronously inside tick
        if (next === 0) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setIsExpired(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // ── Stop timer on correct solve ─────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsStopped(true);
  }, []);

  // ── Manual reset from TimesUpModal ─────────────────────────────────────────
  const resetTimer = useCallback((newDifficulty) => {
    clearInterval(intervalRef.current);
    const newTotal = TIME_LIMITS[newDifficulty || difficulty] || TIME_LIMITS.Easy;
    timeLeftRef.current = newTotal;
    setTimeLeft(newTotal);
    setIsExpired(false);
    setIsStopped(false);
    setIsRunning(false);
    setTimeout(() => setIsRunning(true), 50);
  }, [difficulty]);

  // ── Exact time used — reads from ref, always synchronous ───────────────────
  const getExactTimeUsed = useCallback(() => {
    const total = TIME_LIMITS[difficulty] || TIME_LIMITS.Easy;
    return total - timeLeftRef.current;
  }, [difficulty]);

  // ── Performance rating — accepts capturedTimeUsed for accuracy ─────────────
  const getPerformanceRating = useCallback((capturedTimeUsed) => {
    const total = TIME_LIMITS[difficulty] || TIME_LIMITS.Easy;
    const used  = capturedTimeUsed ?? (total - timeLeftRef.current);
    const pct   = (used / total) * 100;

    if (isExpired) return {
      label:    "Too Slow",
      sublabel: "Overtime — keep practicing",
      icon:     "🔴",
      color:    "#dc2626",
      bg:       "#fef2f2",
      border:   "#fca5a5",
    };
    if (pct < 50) return {
      label:    "Exceptional",
      sublabel: `Solved in ${formatTime(used)} — under 50% of time`,
      icon:     "⚡",
      color:    "#0284c7",
      bg:       "#eff6ff",
      border:   "#bfdbfe",
    };
    if (pct < 75) return {
      label:    "Strong",
      sublabel: `Solved in ${formatTime(used)} — good pace`,
      icon:     "✅",
      color:    "#16a34a",
      bg:       "#f0fdf4",
      border:   "#bbf7d0",
    };
    return {
      label:    "Needs Practice",
      sublabel: `Solved in ${formatTime(used)} — aim for faster`,
      icon:     "⚠️",
      color:    "#d97706",
      bg:       "#fffbeb",
      border:   "#fde68a",
    };
  }, [difficulty, isExpired, formatTime]);

  // ── Derived display values ──────────────────────────────────────────────────
  const total       = TIME_LIMITS[difficulty] || TIME_LIMITS.Easy;
  const timeUsed    = total - timeLeft;
  const percentLeft = (timeLeft / total) * 100;

  const timerColor = (() => {
    if (isExpired || isStopped) return "#94a3b8";
    if (timeLeft <= 60)         return "#dc2626";  // red — under 1 min
    if (timeLeft <= 120)        return "#f59e0b";  // amber — under 2 min
    if (timeLeft <= 300)        return "#d97706";  // orange — under 5 min
    return "#16a34a";                               // green — plenty of time
  })();

  const formattedTimeLeft = formatTime(timeLeft);

  return {
    timeLeft,
    formattedTimeLeft,
    isRunning,
    isExpired,
    isStopped,
    percentLeft,
    timerColor,
    timeUsed,
    totalTime:        total,
    stopTimer,
    resetTimer,
    getExactTimeUsed,
    getPerformanceRating,
    formatTime,
  };
}