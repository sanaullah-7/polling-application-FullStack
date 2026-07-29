import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiBell,
  FiHome,
  FiLogOut,
  FiMoon,
  FiPlusCircle,
  FiSun,
  FiUser,
} from "react-icons/fi";
import { MdPoll } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../hooks/useNotifications";
import Avatar from "../components/ui/Avatar";

const navItems = [
  { to: "/app/home", label: "Home", icon: FiHome },
  { to: "/app/polls", label: "All Polls", icon: MdPoll },
  { to: "/app/polls/mine", label: "My Polls", icon: MdPoll },
  { to: "/app/polls/create", label: "Create", icon: FiPlusCircle },
  { to: "/app/notifications", label: "Notifications", icon: FiBell },
  { to: "/app/profile", label: "Profile", icon: FiUser },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { unread } = useNotifications();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="glass sticky top-0 hidden h-screen flex-col border-r border-[var(--border)] p-5 lg:flex">
        <div className="mb-8 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
            <MdPoll />
          </div>
          <div>
            <p className="font-bold">Pollify</p>
            <p className="text-xs text-muted">Decisions, beautifully simple</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-500/15 text-indigo-500"
                    : "text-muted hover:bg-black/5 hover:text-[var(--text)] dark:hover:bg-white/5"
                }`
              }
            >
              <Icon />
              <span>{label}</span>
              {label === "Notifications" && unread > 0 ? (
                <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">
                  {unread}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3 pt-6">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-black/5 dark:hover:bg-white/5"
          >
            {isDark ? <FiSun /> : <FiMoon />}
            {isDark ? "Light mode" : "Dark mode"}
          </button>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3">
            <Avatar user={user} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="truncate text-xs text-muted">@{user?.username}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="rounded-lg p-2 text-muted hover:bg-black/5 hover:text-rose-500"
              aria-label="Logout"
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </aside>

      <div className="min-h-screen">
        <header className="glass sticky top-0 z-20 flex items-center justify-between border-b border-[var(--border)] px-4 py-3 lg:hidden">
          <div className="font-bold">Pollify</div>
          <div className="flex items-center gap-2">
            <NavLink to="/app/notifications" className="relative p-2">
              <FiBell />
              {unread > 0 ? (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />
              ) : null}
            </NavLink>
            <button type="button" onClick={toggleTheme} className="p-2">
              {isDark ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 pb-24 lg:pb-8">
          <Outlet />
        </main>

        <nav className="glass fixed bottom-0 left-0 right-0 z-20 grid grid-cols-5 border-t border-[var(--border)] px-2 py-2 lg:hidden">
          {navItems.slice(0, 5).map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-lg px-1 py-1 text-[10px] ${
                  isActive ? "text-indigo-500" : "text-muted"
                }`
              }
            >
              <Icon size={18} />
              {label.split(" ")[0]}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
