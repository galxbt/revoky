// frontend/src/components/layout/ScanStatus.jsx

export default function ScanStatus({
  isDark,
  isRefreshing,
  cacheHitFeedback,
  lastUpdated,
  now,
  config,
}) {
  const {
    fontSize,
    marginTop,
  } = config;

  const text = isRefreshing
    ? "Refreshing..."
    : cacheHitFeedback
    ? "Already up to date"
    : lastUpdated
    ? `Updated ${Math.max(0, Math.floor((now - lastUpdated) / 60000))}m ago`
    : "";

  return (
    <div
      style={{
        marginTop,
        fontSize,
        fontWeight: 600,
        opacity: 0.7,
        color: isRefreshing ? "#3b82f6" 
          : isDark ? "#94a3b8" : "#64748b",
        transition: "all 0.2s ease",
      }}
    >
      {text}
    </div>
  );
}