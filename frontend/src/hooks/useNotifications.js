import { useCallback, useEffect, useState } from "react";
import { getNotifications } from "../services/notificationService";

export function useNotifications(pollInterval = 60000, enabled = true) {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!enabled) return;
    try {
      const { data } = await getNotifications();
      setItems(data.items || []);
      setUnread(data.unread ?? 0);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setItems([]);
      setUnread(0);
      return;
    }
    setLoading(true);
    fetchNotifications();
    const id = setInterval(fetchNotifications, pollInterval);
    return () => clearInterval(id);
  }, [enabled, fetchNotifications, pollInterval]);

  return { items, unread, loading, refresh: fetchNotifications };
}
