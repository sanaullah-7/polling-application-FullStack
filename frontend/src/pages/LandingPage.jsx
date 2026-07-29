import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import Button from "../components/ui/Button";

const features = [
  "JWT-secured accounts with OTP verification",
  "Rich poll types: yes/no, choice, image, rating, open text",
  "Live results, comments, bookmarks, and notifications",
  "Beautiful profiles with follow feeds",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <div className="text-xl font-bold">Pollify</div>
        <div className="flex gap-2">
          <Link to="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link to="/register">
            <Button>Get started</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 inline-flex rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-500"
          >
            Premium polling for modern teams
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-bold leading-tight md:text-5xl"
          >
            Ask better questions. Get clearer answers.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-xl text-lg text-muted"
          >
            Pollify connects directly to your MERN backend — votes, comments,
            profiles, and notifications in a polished SaaS experience.
          </motion.p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <Button className="px-6">
                Create free account <FiArrowRight />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">I already have an account</Button>
            </Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card rounded-3xl p-6"
        >
          <ul className="space-y-4">
            {features.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <FiCheckCircle className="mt-0.5 shrink-0 text-indigo-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>
    </div>
  );
}
