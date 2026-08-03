// frontend/src/components/approvals/ChainLabel.jsx

import React from "react";

const ChainLabel = React.memo(
  function ChainLabel({
    chain,
    CHAINS,
    CHAIN_COLORS,
    style,
  }) {
    return (
      <span
        style={{
          color: CHAIN_COLORS[chain] || "#999",
          ...style,
        }}
      >
        {CHAINS[chain]?.name}
      </span>
    );
  }
);

export default ChainLabel;