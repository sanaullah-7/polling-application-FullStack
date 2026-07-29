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
import Logo from "../components/ui/Logo";

const navItems = [
  { to: "/app/home", label: "Home", icon: FiHome, emoji: "🏠" },
  { to: "/app/polls", label: "All Polls", icon: MdPoll, emoji: "🗳️" },
  { to: "/app/polls/mine", label: "My Polls", icon: MdPoll, emoji: "📋" },
  { to: "/app/polls/create", label: "Create", icon: FiPlusCircle, emoji: "✨" },
  { to: "/app/notifications", label: "Alerts", icon: FiBell, emoji: "🔔" },
  { to: "/app/profile", label: "Profile", icon: FiUser, emoji: "👤" },
];

export default function DashboardLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { unread } = useNotifications(90000, isAuthenticated);
  const navigate = useNavigate();

  return (
    <div className="dashboard-shell">
      {/* Sidebar — desktop */}
      <aside className="dashboard-sidebar glass hidden lg:flex">
        <div className="mb-8">
          <Logo />
          <p className="mt-1 text-xs text-muted">Decisions, made simple</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, label, icon: Icon, emoji }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              <span className="text-base">{emoji}</span>
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {label === "Alerts" && unread > 0 ? (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3 border-t border-[var(--border)] pt-4">
          <button type="button" onClick={toggleTheme} className="nav-link w-full">
            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            <span>{isDark ? "Light mode" : "Dark mode"}</span>
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--accent-soft)]/50 p-3">
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
              className="rounded-lg p-2 text-muted transition hover:bg-rose-500/10 hover:text-rose-500"
              aria-label="Logout"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="dashboard-main">
        <header className="glass flex shrink-0 items-center justify-between border-b border-[var(--border)] px-4 py-3 lg:hidden">
          <Logo size="sm" />
          <div className="flex items-center gap-1">
            <NavLink to="/app/notifications" className="relative rounded-xl p-2.5">
              <FiBell size={20} />
              {unread > 0 ? (
                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-[var(--card)]" />
              ) : null}
            </NavLink>
            <button type="button" onClick={toggleTheme} className="rounded-xl p-2.5">
              {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>
        </header>

        <main className="dashboard-content page-enter">
          <div className="dashboard-inner">
            <Outlet />
          </div>
        </main>

        <nav className="glass shrink-0 border-t border-[var(--border)] px-2 py-2 lg:hidden">
          <div className="grid grid-cols-5 gap-1">
            {navItems.slice(0, 5).map(({ to, icon: Icon, emoji, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-medium transition ${
                    isActive
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "text-muted"
                  }`
                }
              >
                <span className="text-base leading-none">{emoji}</span>
                <Icon size={16} />
                <span>{label.split(" ")[0]}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
