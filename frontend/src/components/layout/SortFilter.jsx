// frontend/src/components/layout/SortFilter.jsx

const FILTER_OPTIONS = [
  "all",
  "token",
  "nft",
];

const METRIC_OPTIONS = [
  "value",
  "allowance",
  "age",
  "risk",
];

export default function SortFilter({
  approvals,
  isDark,
  sortOption,
  setSortOption,
  sortMetric,
  setSortMetric,
  sortDirection,
  setSortDirection,
  tokenCount,
  nftCount,
  config,
}) {
  const {
    maxWidth,
    padding,
    gap,
    titleFontSize,
    segmentPadding,
    buttonPadding,
    buttonFontSize,
    metricRowGap,
    metricMarginTop,
    directionPadding,
    directionFontSize,
    directionMinWidth,
    directionGap,
    shortAllowance,
  } = config;

  if (approvals.length === 0) {
    return null;
  }

  function getMetricLabel(metric) {
    return metric === "value"
      ? "Value"
      : metric === "allowance"
      ? shortAllowance
        ? "Allow."
        : "Allowance"
      : metric === "age"
      ? "Age"
      : "Risk";
  }

  return (
    <div
      style={{
        padding,
        borderRadius: 18,
        background: isDark ? "#1e293b" : "#f3f4f6",
        display: "flex",
        flexDirection: "column",
        gap,
        maxWidth,
        marginLeft: maxWidth ? "auto" : undefined,
        marginRight: maxWidth ? "auto" : undefined,
      }}
    >
      {/* TITLE */}
      <div
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: titleFontSize,
          letterSpacing: 0.5,
          opacity: 0.9,
          color: isDark ? "#e5e5e5" : "#4c4c4c",
        }}
      >
        Order By:
      </div>

      {/* FILTER SEGMENT */}
      <div
        style={{
          display: "flex",
          background: isDark ? "#334155" : "#e5e7eb",
          borderRadius: 12,
          padding: segmentPadding,
        }}
      >
        {FILTER_OPTIONS.map(type => {
          const active = sortOption === type;

          return (
            <button
              key={type}
              onClick={() => setSortOption(type)}
              style={{
                flex: 1,
                padding: buttonPadding,
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: buttonFontSize,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                transition: "all 0.2s ease",
                background: active ? isDark ? "#0f172a" : "#ffffff" : "transparent",
                color: active ? isDark ? "#f8fafc" : "#111827" : "#64748b",
                boxShadow: active ? "0 2px 6px rgba(0,0,0,0.15)" : "none",
              }}
            >
              {type === "all" ? "All" : type === "token" ? (
                <>
                  Tokens{" "} {tokenCount > 0 && `(${tokenCount})`}
                </>
              ) : (
                <>
                  NFTs{" "} {nftCount > 0 && `(${nftCount})`}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* SORT METRIC + DIRECTION */}
      <div
        style={{
          display: "flex",
          gap: metricRowGap,
          alignItems: "center",
          marginTop: metricMarginTop,
        }}
      >
        {/* Metric Segment */}
        <div
          style={{
            flex: 1,
            display: "flex",
            background: isDark ? "#334155" : "#e5e7eb",
            borderRadius: 12,
            padding: segmentPadding,
          }}
        >
          {METRIC_OPTIONS.map(metric => {
            const active = sortMetric === metric;

            return (
              <button
                key={metric}
                onClick={() => setSortMetric(metric)}
                style={{
                  flex: 1,
                  padding: buttonPadding,
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: buttonFontSize,
                  transition: "all 0.2s ease",
                  background: active ? isDark ? "#0f172a" : "#ffffff" : "transparent",
                  color: active ? isDark ? "#f8fafc" : "#111827" : "#64748b",
                  boxShadow: active ? "0 2px 6px rgba(0,0,0,0.15)" : "none",
                }}
              >
                {getMetricLabel(metric)}
              </button>
            );
          })}
        </div>

        {/* Direction Toggle */}
        <button
          onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
          style={{
            padding: directionPadding,
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: directionFontSize,
            minWidth: directionMinWidth,
            transition: "all 0.25s ease",
            background: "#3b82f6",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: directionGap,
          }}
        >
          {sortDirection === "asc" ? "↑ Asc" : "↓ Desc"}
        </button>
      </div>
    </div>
  );
}