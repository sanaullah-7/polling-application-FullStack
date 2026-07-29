export default function Logo({ size = "md", showText = true, className = "" }) {
  const sizes = {
    sm: { box: "h-9 w-9", icon: 18, text: "text-base" },
    md: { box: "h-10 w-10", icon: 20, text: "text-lg" },
    lg: { box: "h-12 w-12", icon: 24, text: "text-xl" },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`${s.box} logo-glow grid place-items-center rounded-xl bg-[var(--accent)]`}
      >
        <svg width={s.icon} height={s.icon} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="12" width="4" height="9" rx="1.5" fill="white" />
          <rect x="10" y="8" width="4" height="13" rx="1.5" fill="white" />
          <rect x="17" y="4" width="4" height="17" rx="1.5" fill="white" />
        </svg>
      </div>
      {showText ? (
        <span className={`${s.text} font-bold tracking-tight`}>Pollify</span>
      ) : null}
    </div>
  );
}
