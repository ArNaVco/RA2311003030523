import { useEffect, useState, useRef } from "react";
import NotificationCard from "../components/NotificationCard";
import { useNotifications } from "../hooks/useNotifications";
import Log from "../utils/logger";

const TYPES = ["", "Placement", "Result", "Event"];
const LIMITS = [10, 20, 50];

export default function AllNotifications({ viewedIds, markViewed }) {
  const { notifications, loading, error, fetchNotifications } = useNotifications();
  const [filterType, setFilterType] = useState("");
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const mountedRef = useRef(false);

  useEffect(() => {
    Log("frontend", "info", "AllNotifications", `Page mounted — loading all notifications with limit=${limit}`);
    fetchNotifications({ page, limit, notification_type: filterType });
    mountedRef.current = true;
  }, [page, limit, filterType, fetchNotifications]);

  useEffect(() => {
    if (notifications.length > 0) {
      markViewed(notifications.map((n) => n.ID));
    }
  }, [notifications, markViewed]);

  const handleFilter = (type) => {
    Log("frontend", "info", "AllNotifications", `Filter changed to type="${type || "all"}"`);
    setFilterType(type);
    setPage(1);
  };

  return (
    <div>
      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => handleFilter(t)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid",
                borderColor: filterType === t ? "#378add" : "#ddd",
                backgroundColor: filterType === t ? "#e6f1fb" : "#fff",
                color: filterType === t ? "#185fa5" : "#555",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: filterType === t ? 600 : 400,
                transition: "all 0.15s",
              }}
            >
              {t || "All"}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
          <label style={{ fontSize: "13px", color: "#666" }}>Per page:</label>
          <select
            value={limit}
            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            style={{ padding: "5px 8px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px" }}
          >
            {LIMITS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Notification list */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>⏳</div>
          Loading notifications...
        </div>
      )}

      {error && (
        <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "#fff3f3", border: "1px solid #f09595", color: "#a32d2d", fontSize: "14px" }}>
          ⚠️ {error} — <button onClick={() => fetchNotifications({ page, limit, notification_type: filterType })} style={{ background: "none", border: "none", color: "#378add", cursor: "pointer", textDecoration: "underline" }}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#aaa" }}>
              No notifications found.
            </div>
          ) : (
            notifications.map((n) => (
              <NotificationCard
                key={n.ID}
                notification={n}
                isNew={!viewedIds.has(n.ID)}
                showScore={false}
              />
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && notifications.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ padding: "6px 16px", borderRadius: "6px", border: "1px solid #ddd", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1, fontSize: "13px" }}
          >
            ← Prev
          </button>
          <span style={{ padding: "6px 12px", fontSize: "13px", color: "#555" }}>Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={notifications.length < limit}
            style={{ padding: "6px 16px", borderRadius: "6px", border: "1px solid #ddd", cursor: notifications.length < limit ? "not-allowed" : "pointer", opacity: notifications.length < limit ? 0.4 : 1, fontSize: "13px" }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}