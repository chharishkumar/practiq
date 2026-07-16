import { useState, useEffect, useRef, useCallback } from "react";

export function usePyodide() {
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!window.loadPyodide) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
            script.async = true;
            script.crossOrigin = "anonymous";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        let attempts = 0;
        while (!window.loadPyodide && attempts < 20) {
          await new Promise(r => setTimeout(r, 200));
          attempts++;
        }

        const pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
        });
        pyodideRef.current = pyodide;
        setPyodideReady(true);
      } catch (err) {
        console.error("Pyodide failed:", err);
      }
    };
    load();
  }, []);

  const runCode = useCallback(async (code, problem) => {
    if (!pyodideRef.current) {
      return { status: "error", output: "", error: "Python not loaded yet", testResults: [] };
    }
    const pyodide = pyodideRef.current;

    const cleanCode = code.trim();

    try {
      await pyodide.runPythonAsync(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);

      if (problem.type === "output") {
        try {
          await pyodide.runPythonAsync(cleanCode);
        } catch (err) {
          const stderr = await pyodide.runPythonAsync("sys.stderr.getvalue()");
          await pyodide.runPythonAsync("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");
          return { status: "error", output: "", error: err.message || stderr, testResults: [] };
        }

        const stdout = await pyodide.runPythonAsync("sys.stdout.getvalue()");
        await pyodide.runPythonAsync("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");

        const got = stdout.trim();
        const expected = String(problem.expectedOutput).trim();
        const passed = got === expected;

        return {
          status: passed ? "correct" : "wrong",
          output: stdout,
          error: "",
          testResults: [{ input: "—", expected, got, passed }],
        };

      } else {
        const testResults = [];

        for (const tc of problem.testCases) {
          try {
            await pyodide.runPythonAsync(`
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
`);
            const testCode = `${cleanCode}\n\n_result = str(${tc.call})`;
            await pyodide.runPythonAsync(testCode);
            const result = await pyodide.runPythonAsync("_result");
            const got = result.trim();
            const expected = String(tc.expected).trim();
            const passed = got === expected;
            testResults.push({ input: tc.input, expected, got, passed });
          } catch (err) {
            testResults.push({
              input: tc.input,
              expected: String(tc.expected),
              got: err.message?.split("\n").pop() || "Error",
              passed: false,
              error: true,
            });
          }
        }

        await pyodide.runPythonAsync("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__");

        const allPassed = testResults.every(r => r.passed);
        const somePassed = testResults.some(r => r.passed);
        const status = allPassed ? "correct" : somePassed ? "almost" : "wrong";

        return { status, output: "", error: "", testResults };
      }

    } catch (err) {
      try { await pyodide.runPythonAsync("sys.stdout = sys.__stdout__; sys.stderr = sys.__stderr__"); } catch (_) {}
      return { status: "error", output: "", error: err.message, testResults: [] };
    }
  }, []);

  return { pyodideReady, runCode };
}