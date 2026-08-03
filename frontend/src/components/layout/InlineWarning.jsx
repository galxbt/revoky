// frontend/src/components/layout/InlineWarning.jsx

export default function InlineWarning({
  isDark,
  children,
  config,
}) {
 const {
   warningFontSize,
   textFontsize,
 } = config;

  return (
    <div
      style={{
        marginTop: 12,
        marginBottom: 16,
        padding: "12px 14px",
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: isDark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.08)",
        border: `1px solid ${isDark ? "rgba(245,158,11,0.35)" : "rgba(245,158,11,0.25)"}`,
        color: isDark ? "#fbbf24" : "#92400e",
      }}
    >
      <span
        style={{
          fontSize: warningFontSize,
          flexShrink: 0,
        }}
      >
        ⚠️
      </span>

      <span
        style={{
          fontSize: textFontsize,
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        {children}
      </span>
    </div>
  );
}