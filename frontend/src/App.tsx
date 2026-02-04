import { Routes, Route } from "react-router-dom";
import Popup from "./components/common/Popup";
import Verification from "./components/verification/VerificationStatus";
import CandidateVerificationView from "./pages/hr/CandidateVerificationPage";
import HomePage from "./pages/home/HomePage";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import InterviewPage from "./pages/hr/InterviewPage";
import VerificationDashboard from "./pages/hr/HrDashboardPage"


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
