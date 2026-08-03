// frontend/src/components/approvals/RevokeButton.jsx

import React from "react";

const RevokeButton = React.memo(
  function RevokeButton({
    disabled,
    loading,
    onClick,
    size = 36,
  }) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled && !loading) onClick();
        }}
        style={{
          width: size,
          height: size,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: disabled || loading ? "not-allowed" : "pointer",
          background: "rgba(239,68,68,0.12)",
        }}
      >
        {loading ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke="#ef4444"
            strokeWidth="2"
            fill="none"
            style={{ animation: "spin 1s linear infinite" }}
          >
            <circle cx="12" cy="12" r="9" opacity="0.3" />
            <path d="M21 12a9 9 0 0 1-9 9" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          >
            <path d="M10 14a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 13" />
            <path d="M14 10a5 5 0 0 1 0 7L12.5 18.5a5 5 0 0 1-7-7L7 11" />
            <line x1="8" y1="16" x2="16" y2="8" />
          </svg>
        )}
      </div>
    );
  }
);

export default RevokeButton;