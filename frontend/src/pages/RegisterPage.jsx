import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Logo from "../components/ui/Logo";
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
      toast.success(res.message || "Check your email for the code");
      navigate("/verify-otp", { state: { email: res.email } });
    } catch (err) {
      const data = err.raw?.response?.data;
      if (data?.needsVerification) {
        toast.success(data.message || "Check your email for the code");
        navigate("/verify-otp", {
          state: { email: data.email || form.email },
        });
        return;
      }
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-8 text-center lg:hidden">
        <Logo />
      </div>

      <div className="card auth-card rounded-2xl p-5 sm:p-8">
        <h1 className="text-xl font-bold sm:text-2xl">Create your account</h1>
        <p className="mt-1 text-sm text-muted">Start polling in under a minute</p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <Input
            label="Full name"
            required
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Email address"
            type="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Username"
            required
            placeholder="johndoe"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            required
            minLength={8}
            placeholder="Minimum 8 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Profile photo (optional)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              className="input-field cursor-pointer file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--accent-soft)] file:px-3 file:py-1 file:text-sm file:font-medium file:text-[var(--accent)]"
            />
          </label>
          <Button className="w-full py-3" loading={loading} type="submit">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-[var(--accent)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
