// frontend/src/components/layout/QuickLinks.jsx

import { getExplorerUrl } from "@/utils/helpers";

export default function QuickLinks({
  isDark,
  activeAddress,
  selectedChain,
  CHAIN_EXPLORERS,
  showQuickLinks,
  config,
}) {
  const {
    collapsible,
    fontSize,
    gap,
  } = config;

  const content = (
    <div
      style={{
        fontSize,
        fontWeight: 600,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap,
        color: isDark ? "#60a5fa" : "#2563eb",
      }}
    >
      <span
        style={{ cursor: "pointer" }}
        onClick={() => {
          window.open(
            getExplorerUrl({
              type: "address",
              value: activeAddress,
              chain: selectedChain,
              selectedChain,
              CHAIN_EXPLORERS,
            }),
            "_blank",
          );
        }}
      >
        {selectedChain === "all" ? "Multi-Explorer" : "Explorer"}
      </span>

      <span
        style={{
          color: isDark ? "#ffffff" : "#000000",
          opacity: 0.5,
        }}
      >
        |
      </span>

      <span
        style={{ cursor: "pointer" }}
        onClick={() => window.open(`https://opensea.io/${activeAddress}`, "_blank")}
      >
        Opensea
      </span>

      <span
        style={{
          color: isDark ? "#ffffff" : "#000000",
          opacity: 0.5,
        }}
      >
        |
      </span>

      <span
        style={{ cursor: "pointer" }}
        onClick={() => window.open(`https://app.zerion.io/${activeAddress}`, "_blank")}
      >
        Zerion
      </span>

      <span
        style={{
          color: isDark ? "#ffffff" : "#000000",
          opacity: 0.5,
        }}
      >
        |
      </span>

      <span
        style={{ cursor: "pointer" }}
        onClick={() => window.open(`https://debank.com/profile/${activeAddress}`, "_blank")}
      >
        Debank
      </span>
    </div>
  );

  if (!collapsible) {
    return content;
  }

  return (
    <div
      style={{
        maxHeight: showQuickLinks ? 60 : 0,
        opacity: showQuickLinks ? 1 : 0,
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
    >
      {content}
    </div>
  );
}