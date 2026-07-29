import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
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

  const verify = async () => {
    await verifyResetOtp({ email: form.email, otp: form.otp });
    toast.success("OTP verified");
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verify();
      await resetPassword(form);
      toast.success("Password reset successful");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card rounded-3xl p-6 md:p-8">
      <h1 className="text-2xl font-bold">Reset password</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="OTP"
          required
          value={form.otp}
          onChange={(e) => setForm({ ...form, otp: e.target.value })}
        />
        <Input
          label="New password"
          type="password"
          required
          minLength={8}
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />
        <Button className="w-full" loading={loading} type="submit">
          Update password
        </Button>
      </form>
      <Link to="/login" className="mt-4 inline-block text-sm text-indigo-500">
        Back to sign in
      </Link>
    </div>
  );
}
