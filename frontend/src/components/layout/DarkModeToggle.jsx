// frontend/src/components/layout/DarkModeToggle.jsx

export default function DarkModeToggle({
  isDark,
  setDarkMode,
  config,
}) {
  const {
    gap,
    padding,
    fontSize,
    iconSize,
  } = config;

  return (
    <button
      onClick={() => setDarkMode(prev => !prev)}
      style={{
        display: "flex",
        alignItems: "center",
        gap,
        padding,
        fontSize,
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
        color: "inherit",
        fontWeight: 600,
      }}
    >
      <svg
        className={`theme-icon ${isDark ? "sun" : "moon"}`}
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        style={{ color: isDark ? "#f59e0b" : "#8298BD" }}
      >
        <circle
          className="sun-core"
          cx="12"
          cy="12"
          r="5"
        />

        <g className="sun-rays">
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>

        <mask id="moonMask">
          <rect
            width="24"
            height="24"
            fill="white"
          />
          <circle
            className="moon-cut"
            cx="17"
            cy="8"
            r="5"
            fill="black"
          />
        </mask>

        <circle
          className="moon-shape"
          cx="12"
          cy="12"
          r="7"
          mask="url(#moonMask)"
        />
      </svg>
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}