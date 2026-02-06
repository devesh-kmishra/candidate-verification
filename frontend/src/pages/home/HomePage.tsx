import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, Shield } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#070B14] via-[#0B1020] to-[#060A14] px-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Welcome to{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                VOLK <span className="font-bold text-white">AI</span> HR
              </span>

              {/* subtle underline glow */}
              <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-orange-500/40 blur-sm" />
            </span>
          </h1>
          <p className="mt-3 text-sm text-white/60">
            Choose your workspace to continue
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* HR Dashboard */}
          <motion.button
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/verification")}
            className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#0E1322] to-[#090D18] p-8 text-left shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition"
          >
            {/* glow */}
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400 shadow-inner">
                <Users className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  HR Dashboard
                </h2>
                <p className="mt-1 text-sm text-white/55">
                  Manage employees, hiring, onboarding & verification
                </p>
              </div>
            </div>

            <div className="mt-6 text-sm font-medium text-orange-400 group-hover:underline cursor-pointer">
              Enter HR Workspace →
            </div>
          </motion.button>

          {/* Admin Dashboard */}
          <motion.button
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/admin")}
            className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#0E1322] to-[#090D18] p-8 text-left shadow-[0_20px_60px_rgba(0,0,0,0.45)] transition"
          >
            {/* glow */}
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 shadow-inner">
                <Shield className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Admin Dashboard
                </h2>
                <p className="mt-1 text-sm text-white/55">
                  System settings, roles, permissions & analytics
                </p>
              </div>
            </div>

            <div className="mt-6 text-sm font-medium text-blue-400 group-hover:underline cursor-pointer">
              Enter Admin Workspace →
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
