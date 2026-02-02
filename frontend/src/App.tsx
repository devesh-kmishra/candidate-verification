import { Routes, Route } from "react-router-dom";
import Popup from "./components/Popup";
import InterviewPage from "./components/InterviewPage";
import Verification from "./components/Verification";
import VerificationDashboard from "./components/VerificationDashboard";
import CandidateVerificationView from "./components/CandidateVerificationView";
import HomePage from "./components/Home";
import AdminDashboard from "./components/dashboard/AdminDashboard";

const App = () => {
  return (
    <div className="h-screen overflow-hidden bg-white text-slate-900 font-(--font-inter)">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/popup" element={<Popup />} />
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
