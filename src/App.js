import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import SQLPage from "./SQLPage";
import SQLBasicsPage from "./data/SQLBasicsPage";
import SQLIntermediatePage from "./data/SQLIntermediate";
import SQLAdvancedPage from "./data/SQLAdvanced";
import SQLInterviewPage from "./data/SQLInterview";
import SQLScenariosPage from "./data/SQLScenarios";
import SQLProblemPage from "./data/SQLProblemPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sql" element={<SQLPage />} />
        <Route path="/sql/basics" element={<SQLBasicsPage />} />
        <Route path="/sql/intermediate" element={<SQLIntermediatePage />} />
        <Route path="/sql/advanced" element={<SQLAdvancedPage />} />
        <Route path="/sql/interview" element={<SQLInterviewPage />}/>
        <Route path="/sql/scenarios" element={<SQLScenariosPage />}/>
        <Route path="/sql/problem/:id" element={<SQLProblemPage />} />
      </Routes>
    </BrowserRouter>
  );
}