import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PollCard from "../components/polls/PollCard";
import PollCardSkeleton from "../components/polls/PollCardSkeleton";
import EmptyState from "../components/ui/EmptyState";
import { Select } from "../components/ui/Input";
import Button from "../components/ui/Button";
import { POLL_CATEGORIES } from "../utils/helpers";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import {
  getBookmarks,
  getMyPolls,
  getVotedPolls,
  listPolls,
} from "../services/pollService";

const tabs = [
  { key: "all", label: "All polls", fetcher: () => listPolls() },
  { key: "mine", label: "My polls", fetcher: () => getMyPolls() },
  { key: "voted", label: "Voted", fetcher: () => getVotedPolls() },
  { key: "bookmarks", label: "Bookmarks", fetcher: () => getBookmarks() },
];

export default function AllPollsPage({ defaultTab = "all" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  const load = async () => {
    setLoading(true);
    try {
      if (activeTab === "all") {
        const params = {};
        if (type !== "all") params.type = type;
        if (category) params.category = category;
        const { data } = await listPolls(params);
        setPolls(data || []);
      } else {
        const tab = tabs.find((t) => t.key === activeTab);
        const { data } = await tab.fetcher();
        setPolls(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [activeTab, type, category]);

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return polls;
    const q = debouncedSearch.toLowerCase();
    return polls.filter(
      (p) =>
        p.question?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q),
    );
  }, [polls, debouncedSearch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Polls</h1>
          <p className="text-muted">Search and filter polls from your API.</p>
        </div>
        <Link to="/app/polls/create">
          <Button>Create poll</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              activeTab === tab.key
                ? "bg-indigo-500 text-white"
                : "glass text-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "all" ? (
        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search question or category..."
            className="rounded-xl border border-[var(--border)] bg-white/60 px-4 py-2.5 text-sm md:col-span-1 dark:bg-slate-900/50"
          />
          <Select value={type} onChange={(e) => setType(e.target.value)} label="Type">
            <option value="all">All types</option>
            <option value="yesno">Yes / No</option>
            <option value="single">Multiple choice</option>
            <option value="image">Image</option>
            <option value="rating">Rating</option>
            <option value="open">Open text</option>
          </Select>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <option value="">All categories</option>
            {POLL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <PollCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No polls found"
          description="Try another filter or create the first poll in this view."
          action={
            <Link to="/app/polls/create">
              <Button>Create poll</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((poll) => (
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
      )}
    </div>
  );
}
