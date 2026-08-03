// frontend/src/components/layout/SearchFilter.jsx

export default function SearchFilter({
  approvals,
  filteredWithoutSearch,
  processedApprovals,
  searchQuery,
  setSearchQuery,
  sortOption,
  isDark,
  config,
}) {
  const {
    searchMarginTop,
    searchMarginBottom,
    inputPadding,
    inputFontSize,
    iconSize,
    iconRight,
    emptyMarginTop,
    emptyPadding,
  } = config;

  if (approvals.length === 0) {
    return null;
  }

  const emptyStateStyle = {
    marginTop: emptyMarginTop,
    padding: emptyPadding,
    borderRadius: 14,
    background: isDark ? "#1e293b" : "#f3f4f6",
    textAlign: "center",
    fontWeight: 600,
    opacity: 0.8,
  };

  const animationStyle = {
    marginTop: 14,
    display: "flex",
    justifyContent: "center",
  };

  return (
    <>
      {/* SEARCH */}
      {filteredWithoutSearch.length > 0 && (
        <div
          style={{
            marginTop: searchMarginTop,
            marginBottom: searchMarginBottom,
            position: "relative",
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search asset name or address"
            style={{
              width: "100%",
              padding: inputPadding,
              borderRadius: 14,
              border: isDark ? "1px solid #334155" : "1px solid #d1d5db",
              outline: "none",
              fontSize: inputFontSize,
              background: isDark ? "#1e293b" : "#ffffff",
              color: isDark ? "#f1f5f9" : "#111827",
            }}
          />

          {/* Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke={isDark ? "#94a3b8" : "#6b7280"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              position: "absolute",
              right: iconRight,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <circle
              cx="11"
              cy="11"
              r="8"
            />
            <line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
            />
          </svg>
        </div>
      )}

      {/* TYPE + SEARCH EMPTY HANDLER */}
      {filteredWithoutSearch.length === 0 ? (
        <div
          style={emptyStateStyle}
        >
          No approvals found for {sortOption}

          {/* Animation */}
          <div
            className="search-animation"
            style={animationStyle}
          >
            <svg
              width="70"
              height="70"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M3 5h18l-7 8v5l-4 2v-7L3 5z"
                stroke="#60a5fa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                className="filter-dot"
                cx="8"
                cy="9"
                r="1.2"
                fill="#60a5fa"
              />

              <circle
                className="filter-dot"
                cx="16"
                cy="9"
                r="1.2"
                fill="#60a5fa"
              />

              <circle
                className="filter-dot"
                cx="12"
                cy="12"
                r="1.2"
                fill="#60a5fa"
              />
            </svg>
          </div>
        </div>
      ) : processedApprovals.length === 0 && searchQuery.trim() ? (
        <div
          style={{
            ...emptyStateStyle,
            overflowWrap: "anywhere",
          }}
        >
          No search result for "{searchQuery}"

          {/* Animation */}
          <div
            className="search-animation"
            style={animationStyle}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="#60a5fa"
                strokeWidth="2"
              />

              <line
                x1="16.5"
                y1="16.5"
                x2="21"
                y2="21"
                stroke="#60a5fa"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      ) : null}
    </>
  );
}