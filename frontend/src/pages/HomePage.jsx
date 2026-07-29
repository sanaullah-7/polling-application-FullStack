import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PollCard from "../components/polls/PollCard";
import PollCardSkeleton from "../components/polls/PollCardSkeleton";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../context/AuthContext";
import { getTrending, listPolls } from "../services/pollService";

export default function HomePage() {
  const { user, stats } = useAuth();
  const [polls, setPolls] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [pollRes, trendRes] = await Promise.all([
          listPolls({ feed: "following" }),
          getTrending(),
        ]);
        const following = pollRes.data || [];
        if (following.length) {
          setPolls(following.slice(0, 2));
        } else {
          const all = await listPolls();
          setPolls((all.data || []).slice(0, 2));
        }
        setTrending(trendRes.data || []);
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      {/* Welcome + Stats */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card shrink-0 p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted">Welcome back 👋</p>
            <h1 className="text-2xl font-bold">{user?.name?.split(" ")[0]}</h1>
          </div>
          <Link to="/app/polls/create">
            <Button>+ New poll</Button>
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            ["Created", stats?.created ?? 0, "📝"],
            ["Voted", stats?.voted ?? 0, "✅"],
            ["Saved", stats?.bookmarked ?? 0, "🔖"],
          ].map(([label, value, emoji]) => (
            <div
              key={label}
              className="stat-card rounded-xl border border-[var(--border)] p-3 text-center transition hover:scale-[1.02]"
            >
              <span className="text-xl">{emoji}</span>
              <p className="mt-1 text-2xl font-bold">{value}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
                {label}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Trending pills */}
      {trending.length > 0 ? (
        <section className="shrink-0">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            🔥 Trending
          </h2>
          <div className="flex flex-wrap gap-2">
            {trending.map((item) => (
              <span
                key={item.type}
                className="pill inline-flex items-center gap-1 px-3 py-1 text-xs font-medium capitalize"
              >
                {item.type} · <strong>{item.count}</strong>
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {/* Latest polls — fills remaining space */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="mb-2 flex shrink-0 items-center justify-between">
          <h2 className="font-semibold">🗳️ Latest polls</h2>
          <Link
            to="/app/polls"
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid min-h-0 flex-1 gap-3 overflow-hidden md:grid-cols-2">
          {loading ? (
            <>
              <PollCardSkeleton />
              <PollCardSkeleton />
            </>
          ) : polls.length ? (
            polls.map((poll) => (
              <PollCard
                key={poll._id}
                poll={poll}
                compact
                onBookmarkChange={(id, bookmarked) =>
                  setPolls((prev) =>
                    prev.map((p) =>
                      p._id === id ? { ...p, isBookmarked: bookmarked } : p,
                    ),
                  )
                }
              />
            ))
          ) : (
            <div className="md:col-span-2">
              <EmptyState
                emoji="🗳️"
                title="No polls yet"
                description="Create your first poll to get started."
                action={
                  <Link to="/app/polls/create">
                    <Button>Create poll</Button>
                  </Link>
                }
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
