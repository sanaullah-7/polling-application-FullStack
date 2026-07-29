import { useEffect } from "react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import { AvatarLink } from "../components/ui/Avatar";
import { useNotifications } from "../hooks/useNotifications";
import { markNotificationsRead } from "../services/notificationService";
import { formatRelative } from "../utils/helpers";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const { items, unread, loading, refresh } = useNotifications(60000, isAuthenticated);

  useEffect(() => {
    if (unread > 0) {
      markNotificationsRead().then(refresh).catch(() => {});
    }
    // mark read once when page opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAll = async () => {
    try {
      await markNotificationsRead();
      await refresh();
      toast.success("All caught up");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        emoji="🔔"
        title="Notifications"
        action={
          unread > 0 ? (
            <Button variant="secondary" onClick={markAll}>
              Mark read
            </Button>
          ) : null
        }
      />

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          emoji="✨"
          title="All caught up"
          description="Activity from votes and comments will show here."
        />
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item._id} className="card rounded-xl p-3.5">
              <div className="flex items-start gap-3">
                <AvatarLink user={item.actor} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{item.actor?.name}</span>{" "}
                    {item.type === "vote" && "voted on your poll"}
                    {item.type === "comment" && "commented on your poll"}
                    {item.type === "follow" && "followed you"}
                    {item.type === "bookmark" && "saved your poll"}
                  </p>
                  {item.poll?.question ? (
                    <Link
                      to={`/app/polls/${item.poll._id}`}
                      className="mt-0.5 block truncate text-sm text-[var(--accent)]"
                    >
                      {item.poll.question}
                    </Link>
                  ) : null}
                  <p className="mt-1 text-xs text-muted">{formatRelative(item.createdAt)}</p>
                </div>
                {!item.read ? (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
