import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
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
        toast.error("Verify your email first");
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
    <div className="card rounded-3xl p-6 md:p-8">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <p className="mt-1 text-sm text-muted">Access your Pollify dashboard</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Password"
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button className="w-full" loading={loading} type="submit">
          Sign in
        </Button>
      </form>
      <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm">
        <Link to="/forgot-password" className="text-indigo-500">
          Forgot password?
        </Link>
        <Link to="/register" className="text-muted">
          Create account
        </Link>
      </div>
    </div>
  );
}
