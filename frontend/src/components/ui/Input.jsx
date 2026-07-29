export default function Input({ label, error, icon: Icon, className = "", ...props }) {
  return (
    <label className="block space-y-1.5">
      {label ? (
        <span className="text-sm font-medium text-[var(--text)]">{label}</span>
      ) : null}
      <div className="relative">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        ) : null}
        <input
          className={`input-field ${Icon ? "pl-10" : ""} ${className}`}
          {...props}
        />
      </div>
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
      <textarea className={`input-field min-h-28 ${className}`} {...props} />
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
      <select className={`input-field ${className}`} {...props}>
        {children}
      </select>
    </label>
  );
}
