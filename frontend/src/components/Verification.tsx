import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Verification = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#070B14] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Verification;
