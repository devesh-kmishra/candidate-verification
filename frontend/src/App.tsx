import { Routes, Route } from "react-router-dom";
import Popup from "./components/Popup";
import InterviewPage from "./components/InterviewPage";
import Verification from "./components/Verification";
import VerificationDashboard from "./components/VerificationDashboard";
import CandidateVerificationView from "./components/CandidateVerificationView";

const App = () => {
  return (
    <div className="h-screen overflow-hidden bg-white text-slate-900 font-(--font-inter)">
      <Routes>
        <Route path="/" element={<Popup />} />
        <Route path="/interview" element={<InterviewPage />} />

        {/* VERIFICATION LAYOUT */}
        <Route path="/verification" element={<Verification />}>
          <Route index element={<VerificationDashboard />} />
          <Route
            path="candidate-verification/:candidateId"
            element={<CandidateVerificationView />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
