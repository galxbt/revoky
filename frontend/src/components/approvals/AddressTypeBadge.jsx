// frontend/src/components/approvals/AddressTypeBadge.jsx

import React from "react";

const AddressTypeBadge = React.memo(
  function AddressTypeBadge({
    value,
    onClick,
    children,
    variant = "badge",
  }) {
    return (
      <span
        onClick={onClick}
        style={{
          cursor: "pointer",
          color: "#64748b",

          ...(variant === "badge" && {
            fontSize: 11,
            padding: "3px 8px",
            borderRadius: 20,
            fontWeight: 600,
            background: "#f1f5f9",
          }),

          ...(variant === "text" && {
            fontWeight: 700,
          }),
        }}
      >
        {children ?? value}
      </span>
    );
  }
);

export default AddressTypeBadge;