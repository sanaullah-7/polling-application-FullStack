export default function PollIllustration({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="poll-bg" x1="40" y1="20" x2="360" y2="300" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" stopOpacity="0.15" />
          <stop offset="1" stopColor="#ec4899" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="poll-bar" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="360" height="280" rx="28" fill="url(#poll-bg)" />
      <rect x="48" y="52" width="304" height="200" rx="20" fill="white" fillOpacity="0.9" />
      <circle cx="88" cy="92" r="22" fill="#c7d2fe" />
      <rect x="120" y="78" width="120" height="10" rx="5" fill="#e2e8f0" />
      <rect x="120" y="98" width="80" height="8" rx="4" fill="#f1f5f9" />
      <rect x="64" y="130" width="272" height="12" rx="6" fill="#f1f5f9" />
      <rect x="64" y="154" width="220" height="12" rx="6" fill="url(#poll-bar)" fillOpacity="0.85" />
      <rect x="64" y="178" width="272" height="12" rx="6" fill="#f1f5f9" />
      <rect x="64" y="202" width="180" height="12" rx="6" fill="url(#poll-bar)" fillOpacity="0.55" />
      <rect x="64" y="226" width="272" height="12" rx="6" fill="#f1f5f9" />
      <rect x="64" y="250" width="140" height="12" rx="6" fill="url(#poll-bar)" fillOpacity="0.35" />
      <circle cx="320" cy="88" r="28" fill="#fef3c7" stroke="#f59e0b" strokeWidth="3" />
      <path d="M312 88l6 6 12-12" stroke="#b45309" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="340" cy="240" r="36" fill="#6366f1" fillOpacity="0.12" />
      <text x="340" y="248" textAnchor="middle" fontSize="28">🗳️</text>
    </svg>
  );
}
