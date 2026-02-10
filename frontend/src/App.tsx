import { Routes, Route } from "react-router-dom";
import Popup from "./components/common/Popup";
import Verification from "./components/verification/VerificationStatus";
import CandidateVerificationView from "./pages/hr/CandidateVerificationPage";
import HomePage from "./pages/home/HomePage";
import InterviewPage from "./pages/hr/InterviewPage";
import VerificationDashboard from "./pages/hr/HrDashboardPage";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUser from "./pages/admin/AdminUser";
import CandidateDatabase from "./pages/candidate/CandidateDatabase";
import VerificationSettings from "./pages/admin/VerificationSettings";

const App = () => {
  return (
    <div className="h-screen overflow-hidden bg-white text-slate-900 font-(--font-inter)">
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* ADMIN LAYOUT */}

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="verification-settings" element={<VerificationSettings />} />
          <Route path="users" element={<AdminUser />} />
          <Route path="candidates" element={<CandidateProfile />} />
        </Route>

        <Route path="/popup" element={<Popup />} />
        <Route path="/interview" element={<InterviewPage />} />

        {/* VERIFICATION LAYOUT */}
        
        <Route path="/verification" element={<Verification />}>
          <Route index element={<VerificationDashboard />} />
          <Route
            path="candidate-verification/:candidateId"
            element={<CandidateVerificationView />}
          />
          <Route path="candidate-profile/" element={<CandidateProfile />} />
          <Route path="candidate-database" element={<CandidateDatabase />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
