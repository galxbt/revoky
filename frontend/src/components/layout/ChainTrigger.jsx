// frontend/src/components/layout/ChainTrigger.jsx

import { safeMap } from "@/utils/list";

export default function ChainTrigger({
  dropdownRef,
  showChainDropdown,
  setShowChainDropdown,
  selectedChain,
  CHAINS,
  isDark,
  handleChainChange,
  config,
}) {
  const {
    gap,
    padding,
    fontSize,
    iconSize,
    menuWidth,
    menuPadding,
    itemGap,
    itemPadding,
  } = config;

  const chainKeys = Object.keys(CHAINS);

  return (
    <div
      ref={dropdownRef}
      style={{ position: "relative" }}
    >
      <button
        onClick={() => setShowChainDropdown(prev => !prev)}
        style={{
          display: "flex",
          alignItems: "center",
          gap,
          padding,
          fontSize,
          borderRadius: 14,
          border: "none",
          background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
          color: isDark ? "#f8fafc" : "#111827",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        <img
          src={CHAINS[selectedChain].icon}
          alt={CHAINS[selectedChain].name}
          style={{
            width: iconSize,
            height: iconSize,
            borderRadius: "50%",
          }}
        />

        {CHAINS[selectedChain].name}

        <span style={{ marginLeft: 4 }}>
          ▾
        </span>
      </button>

      {showChainDropdown && (
        <div
          style={{
            position: "absolute",
            top: 45,
            right: 0,
            width: menuWidth,
            borderRadius: 16,
            background: isDark ? "#1e293b" : "#ffffff",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            padding: menuPadding,
            zIndex: 1000,
          }}
        >
          {safeMap(
            chainKeys,
            (key) => {
              const active = selectedChain === key;

              return (
                <div
                  key={key}
                  onClick={() => handleChainChange(key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: itemGap,
                    padding: itemPadding,
                    borderRadius: 12,
                    cursor: "pointer",
                    background: active ? isDark ? "#334155" : "#f3f4f6" : "transparent",
                  }}
                >
                  <img
                    src={CHAINS[key].icon}
                    alt={CHAINS[key].name}
                    style={{
                      width: iconSize,
                      height: iconSize,
                      borderRadius: "50%",
                    }}
                  />

                  <span
                    style={{ fontWeight: active ? 600 : 500 }}
                  >
                    {CHAINS[key].name}
                  </span>
                </div>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}