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
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="glass sticky top-0 z-30 border-b border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div className="page-enter">
          <span className="pill mb-5 inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium">
            🗳️ The modern polling platform
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Ask better questions.
            <span className="mt-2 block text-[var(--accent)]">Get clearer answers.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            Create stunning polls, share with anyone, and watch results roll in — all from one beautiful dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register">
              <Button className="px-7 py-3 text-base">
                Get started free <FiArrowRight />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="px-7 py-3 text-base">
                Sign in
              </Button>
            </Link>
          </div>
        </div>

        <div className="page-enter">
          <PollIllustration className="mx-auto w-full max-w-md drop-shadow-2xl" />
          <div className="card mt-8 p-6">
            <div className="space-y-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 rounded-xl border border-[var(--border)] p-4 transition hover:border-[var(--accent)]/30 hover:bg-[var(--accent-soft)]"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--accent-soft)]">
                    <Icon className="text-[var(--accent)]" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} Pollify · Built for Saylani Bootcamp
      </footer>
    </div>
  );
}
