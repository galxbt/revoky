// frontend/src/components/approvals/AssetLogo.jsx

import React from "react";

const AssetLogo = React.memo(
  function AssetLogo({
    logo,
    symbol,
    size = 24,
    fontSize,
  }) {
    const fallbackFontSize = fontSize ?? Math.max(10, Math.floor(size * 0.5));

    return (
      <div
        style={{
          width: size,
          height: size,
          minWidth: size,
          borderRadius: "50%",
          background: "#9ca3af",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {logo ? (
          <img
            src={logo}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";

              const fallback = e.currentTarget.nextSibling;

              if (fallback) {
                fallback.style.display = "block";
              }
            }}
          />
        ) : null}

        <span
          style={{
            display: logo ? "none" : "block",
            fontSize: fallbackFontSize,
            fontWeight: "bold",
            color: "#555",
          }}
        >
          {symbol?.slice(0, 1) || "?"}
        </span>
      </div>
    );
  }
);

export default AssetLogo;