import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PollCard from "../components/polls/PollCard";
import PollCardSkeleton from "../components/polls/PollCardSkeleton";
import Button from "../components/ui/Button";
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
          setPolls(following.slice(0, 6));
        } else {
          const all = await listPolls();
          setPolls((all.data || []).slice(0, 6));
        }
        setTrending(trendRes.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      <section className="card rounded-3xl p-6 md:p-8">
        <p className="text-sm text-muted">Welcome back</p>
        <h1 className="mt-1 text-3xl font-bold">Hey, {user?.name} 👋</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Your dashboard is synced with the backend in real time.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["Created", stats?.created ?? 0],
            ["Voted", stats?.voted ?? 0],
            ["Saved", stats?.bookmarked ?? 0],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-[var(--border)] bg-white/40 p-4 dark:bg-white/5"
            >
              <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
              <p className="mt-1 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/app/polls/create">
            <Button>Create poll</Button>
          </Link>
          <Link to="/app/polls">
            <Button variant="secondary">Browse all polls</Button>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Trending categories</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {trending.map((item) => (
            <div key={item.type} className="card rounded-2xl p-4">
              <p className="text-sm capitalize text-muted">{item.type}</p>
              <p className="text-2xl font-bold">{item.count}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Latest for you</h2>
          <Link to="/app/polls" className="text-sm text-indigo-500">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <PollCardSkeleton key={i} />)
            : polls.map((poll) => (
                <PollCard
                  key={poll._id}
                  poll={poll}
                  onBookmarkChange={(id, bookmarked) =>
                    setPolls((prev) =>
                      prev.map((p) =>
                        p._id === id ? { ...p, isBookmarked: bookmarked } : p,
                      ),
                    )
                  }
                />
              ))}
        </div>
      </section>
    </div>
  );
}
