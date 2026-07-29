import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (avatar) data.append("image", avatar);
      const res = await register(data);
      toast.success("OTP sent to your email");
      navigate("/verify-otp", { state: { email: res.email } });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card rounded-3xl p-6 md:p-8">
      <h1 className="text-2xl font-bold">Create account</h1>
      <p className="mt-1 text-sm text-muted">Password must be at least 8 characters</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <Input
          label="Full name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Username"
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <Input
          label="Password"
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Avatar (optional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            className="block w-full text-sm"
          />
        </label>
        <Button className="w-full" loading={loading} type="submit">
          Continue
        </Button>
      </form>
      <p className="mt-4 text-sm text-muted">
        Already registered?{" "}
        <Link to="/login" className="text-indigo-500">
          Sign in
        </Link>
      </p>
    </div>
  );
}
