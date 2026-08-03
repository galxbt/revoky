// frontend/src/components/approvals/ChainLabel.jsx

import React from "react";
import { getRiskColor } from "@/utils/helpers";

const RiskBadge = React.memo(
  function RiskBadge({
    risk,
    onClick,
    style,
  }) {
    return (
      <span
        onClick={onClick}
        style={{
          color: getRiskColor(risk),
          fontWeight: 700,
          cursor: "pointer",
          ...style,
        }}
      >
        {risk || "—"}
      </span>
    );
  }
);

export default RiskBadge;