import { useEffect, useMemo, useState } from "react";
import NotificationCard from "../components/NotificationCard";
import { useNotifications } from "../hooks/useNotifications";
import { getTopNNotifications, TYPE_WEIGHTS } from "../utils/priorityInbox";
import Log from "../utils/logger";

const TOP_N_OPTIONS = [5, 10, 15, 20];
const TYPES = ["", "Placement", "Result", "Event"];

export default function PriorityInbox({ viewedIds, markViewed }) {
  const { notifications, loading, error, fetchNotifications } = useNotifications();
  const [topN, setTopN] = useState(10);
  const [filterType, setFilterType] = useState("");
  const priorityList = useMemo(() => getTopNNotifications(notifications, topN), [notifications, topN]);

  useEffect(() => {
    Log("frontend", "info", "PriorityInbox", `Priority Inbox loaded — computing top ${topN} notifications`);
    fetchNotifications({ page: 1, limit: 200, notification_type: filterType });
  }, [filterType, fetchNotifications, topN]);

  useEffect(() => {
    if (priorityList.length > 0) {
      Log("frontend", "info", "PriorityInbox", `Computed top ${priorityList.length} priority notifications from ${notifications.length} total`);
      markViewed(priorityList.map((n) => n.ID));
    }
  }, [priorityList, markViewed, notifications.length]);

  const handleTopNChange = (n) => {
    Log("frontend", "info", "PriorityInbox", `User changed top-N to ${n}`);
    setTopN(n);
  };

  return (
    <div>
      {/* Priority scoring legend */}
      <div style={{ padding: "12px 16px", borderRadius: "10px", backgroundColor: "#f8f9fa", border: "1px solid #e9ecef", marginBottom: "20px" }}>
        <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.5px" }}>Priority Scoring</p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {Object.entries(TYPE_WEIGHTS).sort((a, b) => b[1] - a[1]).map(([type, weight]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#444" }}>{type}</span>
              <span style={{ fontSize: "11px", color: "#888" }}>weight ×{weight}</span>
            </div>
          ))}
          <span style={{ fontSize: "11px", color: "#aaa", marginLeft: "auto" }}>+ recency bonus</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <span style={{ fontSize: "13px", color: "#666", marginRight: "8px" }}>Show top:</span>
          {TOP_N_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => handleTopNChange(n)}
              style={{
                padding: "5px 12px",
                borderRadius: "20px",
                border: "1px solid",
                borderColor: topN === n ? "#d4537e" : "#ddd",
                backgroundColor: topN === n ? "#fbeaf0" : "#fff",
                color: topN === n ? "#993556" : "#555",
                fontSize: "13px",
                cursor: "pointer",
                fontWeight: topN === n ? 600 : 400,
                marginRight: "4px",
                transition: "all 0.15s",
              }}
            >
              {n}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              style={{
                padding: "5px 12px",
                borderRadius: "20px",
                border: "1px solid",
                borderColor: filterType === t ? "#378add" : "#ddd",
                backgroundColor: filterType === t ? "#e6f1fb" : "#fff",
                color: filterType === t ? "#185fa5" : "#555",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {t || "All"}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>⏳</div>
          Computing priority inbox...
        </div>
      )}

      {error && (
        <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "#fff3f3", border: "1px solid #f09595", color: "#a32d2d", fontSize: "14px" }}>
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={{ marginBottom: "12px", fontSize: "13px", color: "#888" }}>
            Showing <strong style={{ color: "#333" }}>{priorityList.length}</strong> highest-priority notifications
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {priorityList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#aaa" }}>No notifications to prioritize.</div>
            ) : (
              priorityList.map((n, idx) => (
                <div key={n.ID} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "12px", color: "#bbb", fontWeight: 600, paddingTop: "18px", minWidth: "20px", textAlign: "right" }}>
                    {idx + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <NotificationCard notification={n} isNew={!viewedIds.has(n.ID)} showScore={true} />
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}