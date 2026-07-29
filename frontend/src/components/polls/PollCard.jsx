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

export default function PollCard({ poll, onBookmarkChange }) {
  const share = async () => {
    const url = `${window.location.origin}/app/polls/${poll._id}`;
    await copyToClipboard(url);
    toast.success("Poll link copied");
  };

  const bookmark = async (e) => {
    e.preventDefault();
    try {
      const { data } = await toggleBookmark(poll._id);
      onBookmarkChange?.(poll._id, data.bookmarked);
      toast.success(data.bookmarked ? "Saved to bookmarks" : "Removed bookmark");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card group rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <AvatarLink user={poll.creator} />
          <div>
            <p className="text-sm font-semibold">{poll.creator?.name}</p>
            <p className="text-xs text-muted">
              @{poll.creator?.username} · {formatRelative(poll.createdAt)}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-500">
          {poll.category}
        </span>
      </div>

      <Link to={`/app/polls/${poll._id}`} className="block space-y-3">
        <h3 className="text-lg font-semibold leading-snug">{poll.question}</h3>
        <p className="text-xs uppercase tracking-wide text-muted">
          {POLL_TYPE_LABELS[poll.type] || poll.type}
          {poll.closed ? " · Closed" : ""}
        </p>

        <div className="space-y-2">
          {(poll.results || []).slice(0, 3).map((result, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs text-muted">
                <span>{result.text || result.label || `Option ${idx + 1}`}</span>
                <span>{result.percent ?? 0}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                  style={{ width: `${result.percent ?? 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-4 text-sm text-muted">
        <span className="inline-flex items-center gap-1">
          <FiUsers /> {poll.totalVotes || 0}
        </span>
        <span className="inline-flex items-center gap-1">
          <FiMessageCircle /> {poll.commentCount || 0}
        </span>
        <button
          type="button"
          onClick={bookmark}
          className={`inline-flex items-center gap-1 transition hover:text-indigo-500 ${poll.isBookmarked ? "text-indigo-500" : ""}`}
        >
          <FiBookmark /> {poll.saveCount || 0}
        </button>
        <button
          type="button"
          onClick={share}
          className="inline-flex items-center gap-1 transition hover:text-indigo-500"
        >
          <FiShare2 /> Share
        </button>
      </div>
    </motion.article>
  );
}
