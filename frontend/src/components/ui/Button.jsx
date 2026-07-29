export default function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  ...props
}) {
  const variants = {
    primary:
      "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-md shadow-indigo-500/20 active:scale-[0.98]",
    secondary:
      "border border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:bg-[var(--accent-soft)] active:scale-[0.98]",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-md active:scale-[0.98]",
    ghost: "text-muted hover:text-[var(--text)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Please wait...
        </>
      ) : (
        children
      )}
    </button>
  );
}
