import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { votePoll, removeVote } from "../../services/pollService";

export default function VotePanel({ poll, onVoted }) {
  const [loading, setLoading] = useState(false);
  const [openText, setOpenText] = useState("");

  const disabled = poll.closed || poll.myVote !== null;

  const submitVote = async (value) => {
    setLoading(true);
    try {
      await votePoll(poll._id, value);
      toast.success("Vote recorded");
      onVoted?.();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const undoVote = async () => {
    setLoading(true);
    try {
      await removeVote(poll._id);
      toast.success("Vote removed");
      onVoted?.();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const options = useMemo(() => {
    if (poll.type === "rating") {
      return [1, 2, 3, 4, 5].map((star) => ({
        label: `${star} star${star > 1 ? "s" : ""}`,
        value: star,
      }));
    }
    return (poll.options || []).map((opt, index) => ({
      label: opt.text || `Option ${index + 1}`,
      image: opt.image,
      value: index,
    }));
  }, [poll]);

  if (poll.type === "open") {
    return (
      <div className="space-y-3">
        <textarea
          className="w-full rounded-xl border border-[var(--border)] bg-white/60 p-3 text-sm dark:bg-slate-900/50"
          placeholder="Type your answer..."
          value={openText}
          disabled={disabled || loading}
          onChange={(e) => setOpenText(e.target.value)}
        />
        <Button
          loading={loading}
          disabled={disabled || !openText.trim()}
          onClick={() => submitVote(openText.trim())}
        >
          Submit answer
        </Button>
        {poll.myVote !== null ? (
          <Button variant="ghost" loading={loading} onClick={undoVote}>
            Remove my answer
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled || loading}
          onClick={() => submitVote(opt.value)}
          className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
            poll.myVote === opt.value
              ? "border-indigo-500 bg-indigo-500/10"
              : "border-[var(--border)] hover:border-indigo-400/60 hover:bg-indigo-500/5"
          }`}
        >
          {opt.image ? (
            <img
              src={opt.image}
              alt={opt.label}
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : null}
          <span className="font-medium">{opt.label}</span>
        </button>
      ))}
      {poll.myVote !== null ? (
        <Button variant="secondary" loading={loading} onClick={undoVote}>
          Change / remove vote
        </Button>
      ) : null}
      {poll.closed ? (
        <p className="text-sm text-amber-500">This poll is closed.</p>
      ) : null}
    </div>
  );
}
