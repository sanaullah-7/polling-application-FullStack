import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="card max-w-md rounded-3xl p-8 text-center">
        <p className="text-6xl font-bold text-indigo-500">404</p>
        <h1 className="mt-2 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-muted">
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/">
            <Button variant="secondary">Home</Button>
          </Link>
          <Link to="/app/home">
            <Button>Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
