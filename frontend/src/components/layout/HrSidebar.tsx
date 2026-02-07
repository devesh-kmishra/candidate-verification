import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  MessageSquare,
  UserPlus,
  ShieldCheck,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Database,
  Upload,
  Search,
  User,
  Link,
  LogOut,
  ClipboardList,
  Users2,
  Workflow,
  UserCheck,
  UserMinus,
  RefreshCcw,
  Shield,
  MapPin,
  CalendarCheck,
  IndianRupee,
  BarChart3,
  FileText,
  Download,
  Phone,
  Settings,
  DollarSign,
  BadgeAlert,
} from "lucide-react";

const Sidebar = () => {
  const [openRecruitment, setOpenRecruitment] = useState(true);
  const [openATS, setOpenATS] = useState(true);

  /* ---------------- SECTION ---------------- */
  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="mt-6">
      <p className="mb-2 px-6 text-[11px] font-semibold uppercase tracking-wider text-white/40">
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );

  /* ---------------- ITEM ---------------- */
  const Item = ({
    icon,
    label,
    to,
  }: {
    icon?: React.ReactNode;
    label: string;
    to: string;
  }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-md px-6 py-2.5 cursor-pointer transition
      ${
        isActive
          ? "bg-orange-500/15 text-white"
          : "text-white/70 hover:bg-white/5"
      }`
      }
    >
     {({ isActive }) => (
      <>
        {icon && (
          <span
            className={`flex h-5 w-5 items-center justify-center transition
            ${
              isActive
                ? "text-orange-400"
                : "text-white/50 group-hover:text-white/80"
            }`}
          >
            {icon}
          </span>
        )}
        <span className="text-sm">{label}</span>
      </>
    )}
    </NavLink>
  );

  /* ---------------- DROPDOWN ---------------- */
  const Dropdown = ({
    label,
    open,
    onToggle,
    children,
  }: {
    label: string;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-md px-6 py-2.5 text-sm text-white/70 transition hover:bg-white/5"
      >
        <span>{label}</span>
        {open ? (
          <ChevronDown className="h-4 w-4 opacity-70" />
        ) : (
          <ChevronRight className="h-4 w-4 opacity-70" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {/* visual grouping */}
            <div className="ml-6 mt-1 border-l border-white/10 pl-4 space-y-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  /* ---------------- DROPDOWN ITEM ---------------- */
 const DropdownItem = ({
  icon,
  label,
  to,
}: {
  icon?: React.ReactNode;
  label: string;
  to: string;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `group flex items-center gap-3 rounded-md px-1 py-2 text-sm cursor-pointer transition
      ${
        isActive
          ? "bg-orange-500/10 text-white"
          : "text-white/60 hover:bg-white/5"
      }`
    }
  >
    {({ isActive }) => (
      <>
        {icon && (
          <span
            className={`flex h-5 w-5 items-center justify-center transition
            ${
              isActive
                ? "text-orange-400"
                : "text-white/40 group-hover:text-white/80"
            }`}
          >
            {icon}
          </span>
        )}
        <span>{label}</span>
      </>
    )}
  </NavLink>
);


  return (
    <aside className="flex h-screen w-64 flex-col bg-linear-to-b from-[#0B0F1A] to-[#070B14] text-white">
      {/* LOGO */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="relative flex items-center gap-3 border-b border-white/10 px-6 py-5"
      >
        {/* Soft divider glow */}
        <div className="absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-orange-500/40 to-transparent" />

        {/* Logo icon */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 260,
            damping: 18,
          }}
          className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-orange-400 to-orange-600 text-sm font-bold text-white shadow-[0_0_12px_rgba(249,115,22,0.35)]"
        >
          V
        </motion.div>

        {/* Brand text */}
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.3,
            ease: "easeOut",
          }}
          className="flex flex-col leading-none"
        >
          <span className="text-sm font-semibold tracking-wide text-orange-400">
            VOLK <span className="text-white">AI</span> HR
          </span>
          <span className="text-[10px] tracking-wide text-white/40">
            Talent Platform
          </span>
        </motion.div>
      </motion.div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto pb-6">
        <Section title="Main">
          <Item
            icon={<LayoutGrid className="width-20px height-18px" />}
            label="Dashboard"
            to="/dashboard"
          />
        </Section>

        <Section title="People">
          <Item icon={<Users />} label="Employees" to="/employees" />
          <Item icon={<MessageSquare />} label="Interviews" to="/interviews" />
          <Item icon={<UserPlus />} label="Onboarding" to="/onboarding" />
        </Section>

        <Section title="Recruitment">
          <Dropdown
            label="Recruitment"
            open={openRecruitment}
            onToggle={() => setOpenRecruitment(!openRecruitment)}
          >
            <DropdownItem icon={<LayoutGrid />} label="Bulk Hiring Dashboard" to="/bulk-hiring-dashboard" />
            <DropdownItem icon={<ClipboardList />} label="Hiring Drives" to="/hiring-drives" />
            <DropdownItem icon={<Users2 />} label="Candidate Pool" to="/candidate-pool" />
            <DropdownItem icon={<Workflow />} label="Client Workflows" to="/client-workflows" />
            <DropdownItem icon={<UserCheck />} label="Joining Tracker" to="/joining-tracker" />
            <DropdownItem icon={<UserMinus />} label="Dropout Management" to="/dropout-management" />
            <DropdownItem icon={<RefreshCcw />} label="Backfill Queue" to="/backfill-queue" />
            <DropdownItem icon={<Shield />} label="Compliance Rules" to="/compliance-rules"/>
            <DropdownItem icon={<MapPin />} label="Deployed Workforce" to="/deployed-workforce" />
            <DropdownItem icon={<CalendarCheck />} label="Attendance Upload" to="/attendance-upload" />
            <DropdownItem icon={<IndianRupee />} label="Payroll Readiness" to="/payroll-readiness" />
            <DropdownItem icon={<BarChart3 />} label="Recruiter Performance" to="/recruiter-performance" />
            <DropdownItem icon={<FileText />} label="Daily MIS" to="/daily-mis" />
            <DropdownItem icon={<Download />} label="Report Export" to="/report-export" />
          </Dropdown>
        </Section>

        <Section title="ATS">
          <Dropdown
            label="ATS"
            open={openATS}
            onToggle={() => setOpenATS(!openATS)}
          >
            <DropdownItem icon={<Database />} label="Candidate Database" to="/verification/candidate-database" />
            <DropdownItem icon={<Upload />} label="Bulk Data Upload" to="/bulk-data-upload" />
            <DropdownItem icon={<Search />} label="Parsing Import Status" to="/parsing-import-status" />
            <DropdownItem icon={<Search />} label="Candidate Search" to="/candidate-search" />
            <DropdownItem icon={<User />} label="Candidate Profile" to="/verification/candidate-profile" />
            <DropdownItem icon={<Link />} label="Job Candidates Sync" to="/job-candidates-sync" />
          </Dropdown>
        </Section>

        <Section title="Verification">
          <Item icon={<ShieldCheck />} label="Verification Dashboard" to="/verification" />
          {/* <Item icon={<UserCheck />} label="Candidate Verification View" to="/verification/candidate-verification" /> */}
        </Section>

        <Section title="Jobs">
          <Item icon={<Briefcase />} label="Jobs" to="/jobs"/>
        </Section>

        <Section title="Communication">
          <Item icon={<MessageSquare />} label="Whatsapp Agent" to="/whatsapp-agent"/>
          <Item icon={<Phone />} label="Calling agent" to="/calling-agent" />
        </Section>

        <Section title="Accounts & billing">
          <Item icon={<DollarSign />} label="Plans" to="/plans"/>
          <Item icon={<Settings />} label="Settings" to="/settings" />
          <Item icon={<BadgeAlert />} label="Career" to="/career" />
        </Section>
      </nav>

      {/* LOGOUT */}
      <div className="px-6 pb-6">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition">
          <LogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
