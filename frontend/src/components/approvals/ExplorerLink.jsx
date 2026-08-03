// frontend/src/components/approvals/ExplorerLink.jsx

import React from "react";
import { getExplorerUrl } from "@/utils/helpers";

const ExplorerLink = React.memo(
  function ExplorerLink({
    type,
    value,
    chain,
    selectedChain,
    CHAIN_EXPLORERS,
    children,
    style,
  }) {
    const url = getExplorerUrl({
      type,
      value,
      chain,
      selectedChain,
      CHAIN_EXPLORERS,
    });

    if (!url) {
      return <span>{children}</span>;
    }

    return (
      <span
        onClick={() =>
          window.open(url, "_blank")
        }
        style={{
          cursor: "pointer",
          fontWeight: 500,
          ...style,
        }}
      >
        {children}
      </span>
    );
  }
);

export default ExplorerLink;