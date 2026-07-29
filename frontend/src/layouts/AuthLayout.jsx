import { Link, Outlet } from "react-router-dom";
import { MdPoll } from "react-icons/md";

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600" />
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white">
            <MdPoll size={28} />
            <span className="text-xl font-bold">Pollify</span>
          </Link>
          <h1 className="mt-16 max-w-md text-4xl font-bold leading-tight text-white">
            Create polls your audience actually wants to answer.
          </h1>
          <p className="mt-4 max-w-sm text-white/80">
            Real-time votes, comments, bookmarks, and notifications — all in one
            polished dashboard.
          </p>
        </div>
        <p className="relative z-10 text-sm text-white/70">
          Built for creators, teams, and communities.
        </p>
      </div>
      <div className="grid place-items-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
