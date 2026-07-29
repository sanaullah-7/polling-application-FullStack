import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";

export default function ProfilePage() {
  const { user, stats } = useAuth();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="card rounded-3xl p-6 md:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Avatar user={user} size="lg" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-muted">@{user?.username}</p>
            {user?.bio ? <p className="mt-3 text-sm">{user.bio}</p> : null}
          </div>
          <Link to="/app/profile/edit">
            <Button variant="secondary">Edit profile</Button>
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["Polls created", stats?.created ?? 0],
            ["Polls voted", stats?.voted ?? 0],
            ["Bookmarks", stats?.bookmarked ?? 0],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-[var(--border)] p-4"
            >
              <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
              <p className="mt-1 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link
            to={`/app/profile/${user?.username}`}
            className="text-sm text-indigo-500"
          >
            View public profile →
          </Link>
        </div>
      </section>
    </div>
  );
}
