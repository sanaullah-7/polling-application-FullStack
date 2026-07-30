import { Link } from "react-router-dom";
import { FiArrowRight, FiBarChart2, FiMessageSquare, FiZap } from "react-icons/fi";
import Button from "../components/ui/Button";
import Logo from "../components/ui/Logo";
import PollIllustration from "../components/ui/PollIllustration";

const features = [
  { icon: FiBarChart2, title: "Live results", desc: "Watch votes update in real time" },
  { icon: FiMessageSquare, title: "Comments", desc: "Discuss every poll" },
  { icon: FiZap, title: "Notifications", desc: "Never miss activity" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen min-h-[100dvh]">
      <header className="glass sticky top-0 z-30 border-b border-[var(--border)]">
        <div className="container-page flex items-center justify-between gap-3 py-3 sm:py-4">
          <Link to="/" className="shrink-0">
            <Logo size="sm" />
          </Link>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link to="/login">
              <Button variant="ghost" className="px-3 py-2 text-xs sm:px-5 sm:text-sm">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button className="px-3 py-2 text-xs sm:px-5 sm:text-sm">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="container-page grid items-center gap-8 py-10 sm:gap-12 sm:py-16 lg:grid-cols-2 lg:py-24">
        <div className="page-enter text-center lg:text-left">
          <span className="pill mb-4 inline-flex items-center gap-2 px-3 py-1 text-xs font-medium sm:mb-5 sm:px-4 sm:py-1.5 sm:text-sm">
            🗳️ The modern polling platform
          </span>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Ask better questions.
            <span className="mt-1 block text-[var(--accent)] sm:mt-2">
              Get clearer answers.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted sm:mt-5 sm:text-lg lg:mx-0">
            Create stunning polls, share with anyone, and watch results roll in — all from one beautiful dashboard.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            <Link to="/register" className="w-full sm:w-auto">
              <Button className="w-full px-6 py-3 text-sm sm:w-auto sm:text-base">
                Get started free <FiArrowRight />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full px-6 py-3 text-sm sm:w-auto sm:text-base">
                Sign in
              </Button>
            </Link>
          </div>
        </div>

        <div className="page-enter w-full">
          <PollIllustration className="mx-auto w-full max-w-xs drop-shadow-2xl sm:max-w-md" />
          <div className="card mt-6 p-4 sm:mt-8 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] p-3 transition hover:border-[var(--accent)]/30 hover:bg-[var(--accent-soft)] sm:gap-4 sm:p-4"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--accent-soft)] sm:h-11 sm:w-11">
                    <Icon className="text-[var(--accent)]" size={18} />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-semibold sm:text-base">{title}</p>
                    <p className="text-xs text-muted sm:text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-muted sm:py-8 sm:text-sm">
        © {new Date().getFullYear()} Pollify · Built for Saylani Bootcamp
      </footer>
    </div>
  );
}
