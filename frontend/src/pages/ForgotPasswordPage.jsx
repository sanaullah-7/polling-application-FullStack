import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Logo from "../components/ui/Logo";
import { forgotPassword } from "../services/authService";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("Reset code sent to your email");
      navigate("/reset-password", { state: { email } });
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
        <h1 className="text-2xl font-bold">Forgot password?</h1>
        <p className="mt-1 text-sm text-muted">We&apos;ll send a reset code to your email</p>
        <form onSubmit={submit} className="mt-7 space-y-5">
          <Input
            label="Email address"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button className="w-full py-3" loading={loading} type="submit">
            Send reset code
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
