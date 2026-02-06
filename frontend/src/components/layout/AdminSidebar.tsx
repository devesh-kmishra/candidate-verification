import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-4 py-2 transition ${
    isActive ? "bg-orange-500 text-white" : "text-white/70 hover:bg-white/5"
  }`;

const AdminSidebar = () => {
  return (
    <aside className="w-64 border-r border-white/10">
      <nav className="space-y-1 p-4">
        <NavLink to="/admin" end className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          Users
        </NavLink>

        <NavLink to="/admin/candidates" className={linkClass}>
          Candidates
        </NavLink>

        <NavLink to="/admin/settings" className={linkClass}>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
