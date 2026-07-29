import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Logo from "../components/ui/Logo";
import { resetPassword, verifyResetOtp } from "../services/authService";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    otp: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyResetOtp({ email: form.email, otp: form.otp });
      await resetPassword(form);
      toast.success("Password updated successfully");
      navigate("/login");
    } catch (err) {
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
      <div className="card auth-card rounded-2xl p-8">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="mt-1 text-sm text-muted">Enter the code from your email</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <Input
            label="Email address"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Reset code"
            required
            placeholder="000000"
            maxLength={6}
            value={form.otp}
            onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, "") })}
          />
          <Input
            label="New password"
            type="password"
            required
            minLength={8}
            placeholder="Minimum 8 characters"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
          <Button className="w-full py-3" loading={loading} type="submit">
            Update password
          </Button>
        </form>
        <Link
          to="/login"
          className="mt-6 block text-center text-sm font-medium text-[var(--accent)] hover:underline"
        >
          ← Back to sign in
        </Link>
      </div>
    </>
  );
}
