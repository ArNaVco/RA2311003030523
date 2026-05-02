const TYPE_COLORS = {
  Placement: { bg: "#e8f4fd", border: "#378add", text: "#185fa5", dot: "#378add" },
  Result:    { bg: "#eaf3de", border: "#639922", text: "#3b6d11", dot: "#639922" },
  Event:     { bg: "#faeeda", border: "#ba7517", text: "#854f0b", dot: "#ef9f27" },
};

function timeAgo(timestamp) {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationCard({ notification, isNew, showScore }) {
  const colors = TYPE_COLORS[notification.Type] || TYPE_COLORS.Event;

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "14px 16px",
        borderRadius: "10px",
        border: `0.5px solid ${isNew ? colors.border : "#e0e0e0"}`,
        backgroundColor: isNew ? colors.bg : "#fafafa",
        transition: "all 0.2s ease",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {isNew && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "10px",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: colors.dot,
          }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: "20px",
              backgroundColor: colors.bg,
              color: colors.text,
              border: `1px solid ${colors.border}`,
              letterSpacing: "0.3px",
              textTransform: "uppercase",
            }}
          >
            {notification.Type}
          </span>
          {showScore && (
            <span style={{ fontSize: "11px", color: "#888", fontStyle: "italic" }}>
              score: {notification._priorityScore?.toFixed(1)}
            </span>
          )}
        </div>
        <p
          style={{
            margin: "0 0 4px",
            fontSize: "14px",
            color: "#1a1a1a",
            fontWeight: isNew ? 500 : 400,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {notification.Message}
        </p>
        <span style={{ fontSize: "12px", color: "#888" }}>
          {timeAgo(notification.Timestamp)}
        </span>
      </div>
    </div>
  );
}
