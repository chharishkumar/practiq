import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import SignupPage from "./SignupPage"; // Import the new page
import SQLPage from "./SQLPage";
import LoginPage from "./LoginPage";
import ProfilePage from "./ProfilePage";
import HomePage from "./HomePage";
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
        {/* Marketing & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/home" element={<HomePage />} />
        
        {/* Dashboard & Practice Areas */}
        <Route path="/sql" element={<SQLPage />} />
        <Route path="/sql/basics" element={<SQLBasicsPage />} />
        <Route path="/sql/intermediate" element={<SQLIntermediatePage />} />
        <Route path="/sql/advanced" element={<SQLAdvancedPage />} />
        <Route path="/sql/interview" element={<SQLInterviewPage />}/>
        <Route path="/sql/scenarios" element={<SQLScenariosPage />}/>
        <Route path="/sql/problem/:id" element={<SQLProblemPage />} />
        
        {/* Placeholder for future Login page to prevent 404s */}
        <Route path="/login" element={<SignupPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}