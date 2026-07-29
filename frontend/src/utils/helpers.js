export const POLL_CATEGORIES = [
  "General",
  "Technology",
  "Sports",
  "Entertainment",
  "Politics",
  "Education",
  "Health",
  "Other",
];

export const POLL_TYPE_LABELS = {
  yesno: "Yes / No",
  single: "Multiple choice",
  image: "Image poll",
  rating: "Rating",
  open: "Open text",
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const formatRelative = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

export const getInitials = (name = "") =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
};
