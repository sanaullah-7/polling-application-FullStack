import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiShare2 } from "react-icons/fi";
import VotePanel from "../components/polls/VotePanel";
import CommentSection from "../components/polls/CommentSection";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { AvatarLink } from "../components/ui/Avatar";
import PageLoader from "../components/ui/PageLoader";
import {
  closePoll,
  deletePoll,
  getPoll,
  toggleBookmark,
} from "../services/pollService";
import { useAuth } from "../context/AuthContext";
import { copyToClipboard, formatRelative, POLL_TYPE_LABELS } from "../utils/helpers";

export default function PollDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getPoll(id);
      setPoll(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PageLoader />;
  if (!poll) return <p className="text-muted">Poll not found.</p>;

  const isOwner =
    String(poll.creator?._id || poll.creator) === String(user?._id);

  const share = async () => {
    const url = `${window.location.origin}/app/polls/${poll._id}`;
    await copyToClipboard(url);
    toast.success("Link copied");
  };

  const toggleClose = async () => {
    setActionLoading(true);
    try {
      const { data } = await closePoll(id);
      setPoll((p) => ({ ...p, closed: data.closed }));
      toast.success(data.closed ? "Poll closed" : "Poll reopened");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const remove = async () => {
    setActionLoading(true);
    try {
      await deletePoll(id);
      toast.success("Poll deleted");
      navigate("/app/polls/mine");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
      setConfirmDelete(false);
    }
  };

  const bookmark = async () => {
    try {
      const { data } = await toggleBookmark(id);
      setPoll((p) => ({ ...p, isBookmarked: data.bookmarked }));
      toast.success(data.bookmarked ? "Bookmarked" : "Bookmark removed");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <article className="card rounded-2xl p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <AvatarLink user={poll.creator} />
              <div>
                <p className="font-semibold">{poll.creator?.name}</p>
                <p className="text-xs text-muted">
                  @{poll.creator?.username} · {formatRelative(poll.createdAt)}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-500">
              {poll.category}
            </span>
          </div>

          <h1 className="text-2xl font-bold">{poll.question}</h1>
          <p className="mt-2 text-sm text-muted">
            {POLL_TYPE_LABELS[poll.type]} · {poll.totalVotes} votes ·{" "}
            {poll.views} views
          </p>

          <div className="mt-6 space-y-3">
            {(poll.results || []).map((result, idx) => (
              <div key={idx}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{result.text || result.label || `Option ${idx + 1}`}</span>
                  <span className="text-muted">
                    {result.count ?? 0} · {result.percent ?? 0}%
                  </span>
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

          <div className="mt-6 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={share}>
              <FiShare2 /> Share
            </Button>
            <Button variant="secondary" onClick={bookmark}>
              {poll.isBookmarked ? "Saved" : "Save poll"}
            </Button>
            {isOwner ? (
              <>
                <Link to={`/app/polls/${id}/edit`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
                <Button
                  variant="secondary"
                  loading={actionLoading}
                  onClick={toggleClose}
                >
                  {poll.closed ? "Reopen poll" : "Close poll"}
                </Button>
                <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                  Delete
                </Button>
              </>
            ) : null}
          </div>
        </article>

        <CommentSection pollId={id} />
      </div>

      <aside className="card h-fit rounded-2xl p-5">
        <h2 className="mb-4 text-lg font-semibold">Cast your vote</h2>
        <VotePanel poll={poll} onVoted={load} />
      </aside>

      <Modal open={confirmDelete} title="Delete poll?" onClose={() => setConfirmDelete(false)}>
        <p className="text-sm text-muted">
          This will permanently delete the poll and its comments.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" loading={actionLoading} onClick={remove}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
