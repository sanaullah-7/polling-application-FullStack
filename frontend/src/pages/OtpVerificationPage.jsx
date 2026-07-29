import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { resendOtp } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function OtpVerificationPage() {
  const { completeVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

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
    try {
      await resendOtp(email);
      toast.success("OTP resent");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="card rounded-3xl p-6 md:p-8">
      <h1 className="text-2xl font-bold">Verify your email</h1>
      <p className="mt-1 text-sm text-muted">Enter the OTP sent to your inbox</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="OTP"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <Button className="w-full" loading={loading} type="submit">
          Verify & continue
        </Button>
      </form>
      <button
        type="button"
        onClick={resend}
        className="mt-4 text-sm text-indigo-500 hover:underline"
      >
        Resend OTP
      </button>
      <p className="mt-4 text-sm text-muted">
        <Link to="/login">Back to sign in</Link>
      </p>
    </div>
  );
}
