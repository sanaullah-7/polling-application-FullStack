import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input, { Select, TextArea } from "../components/ui/Input";
import { POLL_CATEGORIES } from "../utils/helpers";
import { createPoll } from "../services/pollService";

export default function CreatePollPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    question: "",
    type: "yesno",
    category: "General",
    options: ["", ""],
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("question", form.question.trim());
      data.append("type", form.type);
      data.append("category", form.category);
      if (form.type === "single") {
        const opts = form.options.filter((o) => o.trim());
        data.append("options", JSON.stringify(opts));
      }
      if (form.type === "image") {
        images.forEach((file) => data.append("images", file));
      }
      const { data: res } = await createPoll(data);
      toast.success("Poll created");
      navigate(`/app/polls/${res.poll._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="page-title">Create poll</h1>

      <form onSubmit={submit} className="card space-y-4 rounded-2xl p-4 sm:p-6">
        <TextArea
          label="Question"
          required
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
        />
        <Select
          label="Poll type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="yesno">Yes / No</option>
          <option value="single">Multiple choice</option>
          <option value="image">Image options</option>
        </Select>
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

        {form.type === "single" ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Options (min 2)</p>
            {form.options.map((opt, idx) => (
              <Input
                key={idx}
                value={opt}
                placeholder={`Option ${idx + 1}`}
                onChange={(e) => {
                  const options = [...form.options];
                  options[idx] = e.target.value;
                  setForm({ ...form, options });
                }}
              />
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setForm({ ...form, options: [...form.options, ""] })
              }
            >
              Add option
            </Button>
          </div>
        ) : null}

        {form.type === "image" ? (
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">Upload at least 2 images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(Array.from(e.target.files || []))}
            />
          </label>
        ) : null}

        <Button loading={loading} type="submit">
          Publish poll
        </Button>
      </form>
    </div>
  );
}
