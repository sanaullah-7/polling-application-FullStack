export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block space-y-1.5">
      {label ? (
        <span className="text-sm font-medium text-[var(--text)]">{label}</span>
      ) : null}
      <input
        className={`w-full rounded-xl border border-[var(--border)] bg-white/70 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-900/60 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-rose-500">{error}</span> : null}
    </label>
  );
}

export function TextArea({ label, error, className = "", ...props }) {
  return (
    <label className="block space-y-1.5">
      {label ? (
        <span className="text-sm font-medium text-[var(--text)]">{label}</span>
      ) : null}
      <textarea
        className={`min-h-28 w-full rounded-xl border border-[var(--border)] bg-white/70 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-900/60 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-rose-500">{error}</span> : null}
    </label>
  );
}

export function Select({ label, children, className = "", ...props }) {
  return (
    <label className="block space-y-1.5">
      {label ? (
        <span className="text-sm font-medium text-[var(--text)]">{label}</span>
      ) : null}
      <select
        className={`w-full rounded-xl border border-[var(--border)] bg-white/70 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-900/60 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
