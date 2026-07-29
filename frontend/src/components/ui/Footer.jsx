import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <Logo size="sm" />
        <p className="text-sm text-muted">© {new Date().getFullYear()} Pollify. Vote with confidence.</p>
        <div className="flex gap-4 text-sm">
          <Link to="/login" className="text-muted transition hover:text-indigo-500">
            Sign in
          </Link>
          <Link to="/register" className="text-muted transition hover:text-indigo-500">
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
}
