export default function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  ...props
}) {
  const variants = {
    primary:
      "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25",
    secondary:
      "glass text-[var(--text)] hover:bg-white/10 dark:hover:bg-white/5",
    danger: "bg-rose-600 hover:bg-rose-500 text-white",
    ghost: "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-black/5 dark:hover:bg-white/5",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
