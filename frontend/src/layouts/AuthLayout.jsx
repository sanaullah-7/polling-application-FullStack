import { Link, Outlet } from "react-router-dom";
import Logo from "../components/ui/Logo";
import PollIllustration from "../components/ui/PollIllustration";

export default function AuthLayout() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left brand panel — desktop only */}
      <div className="auth-panel relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
        <Link to="/" className="relative z-10 text-white">
          <Logo showText className="[&_span]:text-white [&_div]:bg-white/20 [&_div]:shadow-none" />
        </Link>

        <div className="relative z-10">
          <h1 className="max-w-md text-4xl font-bold leading-tight text-white">
            Create polls. Collect votes. See results instantly.
          </h1>
          <p className="mt-4 max-w-sm text-base text-white/80">
            Join thousands using Pollify to make better decisions together.
          </p>
          <PollIllustration className="mt-10 w-full max-w-xs opacity-95" />
        </div>

        <p className="relative z-10 text-sm text-white/60">
          © {new Date().getFullYear()} Pollify
        </p>

        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Right form panel — centered */}
      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="page-enter w-full max-w-[420px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
