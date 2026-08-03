// frontend/src/components/approvals/AssetTypeBadge.jsx

import React from "react";

const AssetTypeBadge = React.memo(
  function AssetTypeBadge({
    assetType,
    isDark,
    onClick,
    variant = "badge",
    style,
  }) {
    const isNft = assetType === "nft";

    const color = isNft ? "#a855f7" : "#3b82f6";

    return (
      <span
        onClick={onClick}
        style={{
          cursor: "pointer",
          color,

          ...(variant === "badge" && {
            fontSize: 10,
            padding: "2px 6px",
            borderRadius: 6,
            background: isNft
              ? isDark ? "rgba(168, 85, 247, 0.15)" : "#f3e8ff"
              : isDark ? "rgba(59, 130, 246, 0.15)" : "#e0f2fe",
          }),

          ...(variant === "text" && {
            fontSize: 14,
          }),

          ...style,
        }}
      >
        {isNft ? "NFT" : "Token"}
      </span>
    );
  }
);

export default AssetTypeBadge;