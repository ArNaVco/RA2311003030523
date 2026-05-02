export const TYPE_WEIGHTS = {
  Placement: 5,
  Result: 4,
  Event: 3,
};

export function getTopNNotifications(notifications, topN = 10) {
  return [...notifications]
    .map((notification) => {
      const typeWeight = TYPE_WEIGHTS[notification.Type] ?? 1;
      const timestamp = new Date(notification.Timestamp).getTime();
      const ageDays = Number.isFinite(timestamp) ? Math.max(0, (Date.now() - timestamp) / 86400000) : 0;
      const recencyBonus = Math.max(0, 7 - ageDays) * 0.15;
      return {
        ...notification,
        _priorityScore: typeWeight + recencyBonus,
      };
    })
    .sort((a, b) => b._priorityScore - a._priorityScore)
    .slice(0, topN);
}
