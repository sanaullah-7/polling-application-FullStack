import { useCallback, useEffect, useState } from "react";
import { getNotifications } from "../services/notificationService";

export function useNotifications(pollInterval = 60000) {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await getNotifications();
      setItems(data.items || []);
      setUnread(data.unread ?? 0);
    } catch {
      /* silent when offline */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, pollInterval);
    return () => clearInterval(id);
  }, [fetchNotifications, pollInterval]);

  return { items, unread, loading, refresh: fetchNotifications };
}
