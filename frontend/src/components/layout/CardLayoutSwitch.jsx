// frontend/src/components/layout/CardLayoutSwitch.jsx

import React from "react";

const CardLayoutSwitch = React.memo(
  function CardLayoutSwitch({
    approvals,
    cardLayout,
    setCardLayout,
    isDark,
  }) {
    if (approvals.length === 0) {
      return null;
    }

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 6,
        }}
      >
        <button
          onClick={() => setCardLayout(prev => prev === "vertical" ? "grid" : "vertical")}
          style={{
            background: isDark ? "#334155" : "#e5e7eb",
            border: "none",
            borderRadius: 10,
            padding: "6px 10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {cardLayout === "vertical" ? (
            <>
              {/* GRID ICON */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="7"
                />
                <rect
                  x="14"
                  y="3"
                  width="7"
                  height="7"
                />
                <rect
                  x="14"
                  y="14"
                  width="7"
                  height="7"
                />
                <rect
                  x="3"
                  y="14"
                  width="7"
                  height="7"
                />
              </svg>
              Grid View
            </>
          ) : (
            <>
              {/* VERTICAL ICON */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line
                  x1="8"
                  y1="6"
                  x2="21"
                  y2="6"
                />
                <line
                  x1="8"
                  y1="12"
                  x2="21"
                  y2="12"
                />
                <line
                  x1="8"
                  y1="18"
                  x2="21"
                  y2="18"
                />
                <circle
                  cx="4"
                  cy="6"
                  r="1"
                />
                <circle
                  cx="4"
                  cy="12"
                  r="1"
                />
                <circle
                  cx="4"
                  cy="18"
                  r="1"
                />
              </svg>
              Vertical View
            </>
          )}
        </button>
      </div>
    );
  }
);

export default CardLayoutSwitch;