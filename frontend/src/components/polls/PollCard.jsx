import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiBookmark,
  FiMessageCircle,
  FiShare2,
  FiUsers,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { AvatarLink } from "../ui/Avatar";
import { formatRelative, POLL_TYPE_LABELS, copyToClipboard } from "../../utils/helpers";
import { toggleBookmark } from "../../services/pollService";

const typeEmoji = {
  yesno: "✅",
  single: "📋",
  image: "🖼️",
  rating: "⭐",
  open: "💭",
};

export default function PollCard({ poll, onBookmarkChange, compact = false }) {
  const share = async () => {
    const url = `${window.location.origin}/app/polls/${poll._id}`;
    await copyToClipboard(url);
    toast.success("Link copied! 🔗");
  };

  const bookmark = async (e) => {
    e.preventDefault();
    try {
      const { data } = await toggleBookmark(poll._id);
      onBookmarkChange?.(poll._id, data.bookmarked);
      toast.success(data.bookmarked ? "Saved 🔖" : "Removed");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`card card-hover group min-w-0 ${compact ? "rounded-xl p-3" : "rounded-xl p-4"}`}
    >
      <div className={`flex items-start justify-between gap-2 ${compact ? "mb-2" : "mb-4"}`}>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <AvatarLink user={poll.creator} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{poll.creator?.name}</p>
            <p className="truncate text-xs text-muted">
              @{poll.creator?.username} · {formatRelative(poll.createdAt)}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--accent)] sm:px-2.5 sm:text-xs">
          {poll.category}
        </span>
      </div>

      <Link to={`/app/polls/${poll._id}`} className="block space-y-2">
        <h3 className={`font-semibold leading-snug transition group-hover:text-[var(--accent)] ${compact ? "line-clamp-2 text-sm" : "text-lg"}`}>
          {poll.question}
        </h3>
        {!compact ? (
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted">
            <span>{typeEmoji[poll.type] || "🗳️"}</span>
            {POLL_TYPE_LABELS[poll.type] || poll.type}
            {poll.closed ? " · 🔒 Closed" : " · 🟢 Live"}
          </p>
        ) : null}

        <div className="space-y-1.5">
          {(poll.results || []).slice(0, compact ? 2 : 3).map((result, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs text-muted">
                <span>{result.text || result.label || `Option ${idx + 1}`}</span>
                <span className="font-medium text-indigo-500">{result.percent ?? 0}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.percent ?? 0}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full bg-[var(--accent)]"
                />
              </div>
            </div>
          ))}
        </div>
      </Link>

      <div className={`flex flex-wrap items-center gap-2 border-t border-[var(--border)] text-sm text-muted ${compact ? "mt-2 pt-2" : "mt-4 pt-4"}`}>
        <span className="inline-flex items-center gap-1 rounded-lg bg-black/5 px-2 py-1 dark:bg-white/5">
          <FiUsers /> {poll.totalVotes || 0}
        </span>
        <span className="inline-flex items-center gap-1 rounded-lg bg-black/5 px-2 py-1 dark:bg-white/5">
          <FiMessageCircle /> {poll.commentCount || 0}
        </span>
        <button
          type="button"
          onClick={bookmark}
          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 transition hover:bg-indigo-500/10 ${
            poll.isBookmarked ? "text-indigo-500" : ""
          }`}
        >
          <FiBookmark className={poll.isBookmarked ? "fill-current" : ""} />{" "}
          {poll.saveCount || 0}
        </button>
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 transition hover:bg-indigo-500/10 hover:text-indigo-500"
        >
          <FiShare2 /> Share
        </button>
      </div>
    </motion.article>
  );
}
