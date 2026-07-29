import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { AvatarLink } from "../ui/Avatar";
import { formatRelative } from "../../utils/helpers";
import {
  addComment,
  deleteComment,
  getComments,
} from "../../services/commentService";
import { useAuth } from "../../context/AuthContext";

export default function CommentSection({ pollId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getComments(pollId);
      setComments(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [pollId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await addComment(pollId, { text: text.trim() });
      setComments((prev) => [data, ...prev]);
      setText("");
      toast.success("Comment added");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    try {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c._id !== id));
      toast.success("Comment removed");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="card rounded-2xl p-5">
      <h3 className="mb-4 text-lg font-semibold">Comments</h3>
      <form onSubmit={submit} className="mb-6 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your thoughts..."
          className="flex-1 rounded-xl border border-[var(--border)] bg-white/60 px-4 py-2.5 text-sm dark:bg-slate-900/50"
        />
        <Button type="submit" loading={submitting}>
          Post
        </Button>
      </form>

      {loading ? (
        <p className="text-sm text-muted">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted">No comments yet. Start the conversation.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li
              key={comment._id}
              className="flex gap-3 rounded-xl border border-[var(--border)] p-3"
            >
              <AvatarLink user={comment.user} size="sm" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">{comment.user?.name}</p>
                  <p className="text-xs text-muted">
                    {formatRelative(comment.createdAt)}
                  </p>
                </div>
                <p className="mt-1 text-sm">{comment.text}</p>
                {String(comment.user?._id) === String(user?._id) ? (
                  <button
                    type="button"
                    onClick={() => remove(comment._id)}
                    className="mt-2 text-xs text-rose-500 hover:underline"
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
