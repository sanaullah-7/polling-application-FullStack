import { useEffect } from "react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { AvatarLink } from "../components/ui/Avatar";
import { useNotifications } from "../hooks/useNotifications";
import { markNotificationsRead } from "../services/notificationService";
import { formatRelative } from "../utils/helpers";
import { Link } from "react-router-dom";

export default function NotificationsPage() {
  const { items, unread, loading, refresh } = useNotifications(30000);

  useEffect(() => {
    if (unread > 0) {
      markNotificationsRead()
        .then(refresh)
        .catch(() => {});
    }
  }, []);

  const markAll = async () => {
    try {
      await markNotificationsRead();
      await refresh();
      toast.success("Notifications marked as read");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted">{unread} unread</p>
        </div>
        <Button variant="secondary" onClick={markAll}>
          Mark all read
        </Button>
      </div>

      {loading ? (
        <p className="text-muted">Loading notifications...</p>
      ) : items.length === 0 ? (
        <EmptyState
          title="You're all caught up"
          description="Vote and comment activity will appear here."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item._id} className="card rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AvatarLink user={item.actor} size="sm" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{item.actor?.name}</span>{" "}
                    {item.type === "vote" && "voted on your poll"}
                    {item.type === "comment" && "commented on your poll"}
                    {item.type === "follow" && "followed you"}
                    {item.type === "bookmark" && "bookmarked your poll"}
                  </p>
                  {item.poll?.question ? (
                    <Link
                      to={`/app/polls/${item.poll._id}`}
                      className="mt-1 block text-sm text-indigo-500"
                    >
                      {item.poll.question}
                    </Link>
                  ) : null}
                  <p className="mt-1 text-xs text-muted">
                    {formatRelative(item.createdAt)}
                  </p>
                </div>
                {!item.read ? (
                  <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
