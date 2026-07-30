import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiLock, FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Logo from "../components/ui/Logo";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate(location.state?.from || "/app/home", { replace: true });
    } catch (err) {
      if (err.raw?.response?.data?.needsVerification) {
        toast.error("Please verify your email first");
        navigate("/verify-otp", {
          state: { email: err.raw.response.data.email || form.email },
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
        <h1 className="text-xl font-bold sm:text-2xl">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Sign in to your Pollify account</p>

        <form onSubmit={submit} className="mt-7 space-y-5">
          <Input
            label="Email address"
            type="email"
            icon={FiMail}
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            icon={FiLock}
            required
            minLength={8}
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button className="w-full py-3" loading={loading} type="submit">
            Sign in
          </Button>
        </form>

        <div className="mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <Link to="/forgot-password" className="font-medium text-[var(--accent)] hover:underline">
            Forgot password?
          </Link>
          <Link to="/register" className="text-muted hover:text-[var(--accent)]">
            Create account →
          </Link>
        </div>
      </div>
    </>
  );
}
