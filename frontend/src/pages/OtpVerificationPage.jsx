import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Logo from "../components/ui/Logo";
import { resendOtp } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function OtpVerificationPage() {
  const { completeVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await completeVerification(email, otp);
      toast.success("Email verified!");
      navigate("/app/home", { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    setResending(true);
    try {
      await resendOtp(email);
      toast.success("New code sent to your email");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <div className="mb-8 text-center lg:hidden">
        <Logo />
      </div>

      <div className="card auth-card rounded-2xl p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-2xl">
          ✉️
        </div>
        <h1 className="text-center text-2xl font-bold">Verify your email</h1>
        <p className="mt-1 text-center text-sm text-muted">
          Enter the 6-digit code sent to your inbox
        </p>

        <form onSubmit={submit} className="mt-7 space-y-5">
          <Input
            label="Email address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Verification code"
            required
            placeholder="000000"
            maxLength={6}
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="text-center text-xl font-bold tracking-[0.5em]"
          />
          <Button className="w-full py-3" loading={loading} type="submit">
            Verify & continue
          </Button>
        </form>

        <button
          type="button"
          disabled={resending}
          onClick={resend}
          className="mt-5 w-full text-sm font-medium text-[var(--accent)] hover:underline disabled:opacity-50"
        >
          {resending ? "Sending..." : "Didn't receive it? Resend code"}
        </button>

        <p className="mt-5 text-center text-sm text-muted">
          <Link to="/login" className="hover:text-[var(--accent)]">
            Back to sign in
          </Link>
        </p>
      </div>
    </>
  );
}
