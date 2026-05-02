import { useState, useCallback } from "react";
import Log from "../utils/logger";

const API_BASE = process.env.REACT_APP_API_BASE || "/evaluation-service/notifications";
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0 });

  const fetchNotifications = useCallback(async ({ page = 1, limit = 20, notification_type = "" } = {}) => {
    setLoading(true);
    setError(null);

    await Log("frontend", "info", "useNotifications", `Fetching notifications — page=${page}, limit=${limit}, type=${notification_type || "all"}`);

    try {
      const params = new URLSearchParams({ page, limit });
      if (notification_type) params.append("notification_type", notification_type);

      const headers = {};
      if (API_TOKEN) {
        headers.Authorization = `Bearer ${API_TOKEN}`;
      }

      const res = await fetch(`${API_BASE}?${params.toString()}`, {
        method: "GET",
        headers: Object.keys(headers).length ? headers : undefined,
        mode: "cors",
      });

      if (!res.ok) {
        const msg = res.status === 401
          ? "Unauthorized (401). Access denied."
          : res.status === 403
          ? "Forbidden (403). Access denied."
          : `API responded with status ${res.status}`;
        await Log("frontend", "error", "useNotifications", msg);
        throw new Error(msg);
      }

      const data = await res.json();
      const fetched = data.notifications ?? [];

      await Log("frontend", "info", "useNotifications", `Successfully fetched ${fetched.length} notifications`);

      setNotifications(fetched);
      setPagination({ page, total: data.total ?? fetched.length });
    } catch (err) {
      await Log("frontend", "error", "useNotifications", `Failed to fetch notifications: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { notifications, loading, error, pagination, fetchNotifications };
}
