import { Link } from "react-router-dom";
import { getInitials } from "../../utils/helpers";

export default function Avatar({ user, size = "md", className = "" }) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-16 w-16 text-lg" };
  const src = user?.avatar;
  const name = user?.name || user?.username || "?";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ring-2 ring-white/20 ${sizes[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`grid place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 font-semibold text-white ${sizes[size]} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}

export function AvatarLink({ user, to, size = "md" }) {
  if (!user) return null;
  const path = to || `/app/profile/${user.username}`;
  return (
    <Link to={path} className="inline-flex shrink-0">
      <Avatar user={user} size={size} />
    </Link>
  );
}
