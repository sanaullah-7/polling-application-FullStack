import { motion } from "framer-motion";

export default function PageHeader({ emoji, title, subtitle, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        {emoji ? (
          <span className="mb-2 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-fuchsia-500/15 text-2xl">
            {emoji}
          </span>
        ) : null}
        <h1 className="page-title tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-muted">{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </motion.div>
  );
}
