import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input, { Select, TextArea } from "../components/ui/Input";
import { POLL_CATEGORIES } from "../utils/helpers";
import { getPoll, updatePoll } from "../services/pollService";
import { useAuth } from "../context/AuthContext";

export default function EditPollPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ question: "", category: "General" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getPoll(id);
        if (String(data.creator?._id || data.creator) !== String(user?._id)) {
          toast.error("You can only edit your own polls");
          navigate(`/app/polls/${id}`);
          return;
        }
        setForm({ question: data.question, category: data.category });
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate, user?._id]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePoll(id, form);
      toast.success("Poll updated");
      navigate(`/app/polls/${id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted">Loading poll...</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit poll</h1>
        <Link to={`/app/polls/${id}`} className="text-sm text-indigo-500">
          Cancel
        </Link>
      </div>
      <form onSubmit={submit} className="card space-y-4 rounded-2xl p-6">
        <TextArea
          label="Question"
          required
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
        />
        <Select
          label="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {POLL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Button loading={saving} type="submit">
          Save changes
        </Button>
      </form>
    </div>
  );
}
