// frontend/src/components/Footer.js

import revokyIcon from "@/assets/revoky-icon.svg";

export default function Footer({
  screen,
  isDark,
  loading,
  goToLanding,
}) {
  const currentYear = new Date().getFullYear();

  return (
    <div
      style={{
        marginTop: "auto",
        width: "100%",
        borderTop: isDark 
          ? "1px solid rgba(255,255,255,0.08)" 
          : "1px solid rgba(0,0,0,0.08)",
        paddingTop: 18,
        paddingBottom: 10,
      }}
    >
      <div
        className="app-container"
        style={{
          textAlign: "center",
          fontSize: screen.isDesktop ? 20 : screen.isTablet ? 16 : 14,
          opacity: 0.8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 5,
        }}
      >
        {/* YEAR + LOGO + TITLE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span>© {currentYear} –</span>

          <div
            onClick={goToLanding}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              cursor: loading ? "default" : "pointer",
              pointerEvents: loading ? "none" : "auto",
            }}
          >
            <img
              src={revokyIcon}
              alt=""
              style={{
                width: screen.isDesktop ? 23 : screen.isTablet ? 19 : 17,
                height: screen.isDesktop ? 23 : screen.isTablet ? 19 : 17,
                transform: screen.isDesktop  ? "translateY(-1px)" 
                  : screen.isTablet ? "translateY(-1px)" : "translateY(-0.5px)",
              }}
            />

            <span
              style={{
                fontWeight: 700,
                fontSize: screen.isDesktop ? 22 : screen.isTablet ? 18 : 16,
                letterSpacing: 0.4,
                color: isDark ? "#f8fafc" : "#991b1b",
                textShadow: isDark 
                  ? "0 0 20px rgba(255,77,77,0.35)" 
                  : "0 0 8px rgba(178,0,0,0.15)",
              }}
            >
              Revoky
            </span>
          </div>
        </div>

        {/* BUILDER */}
        <div
          style={{
            marginTop: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div 
            style={{ 
              fontSize: screen.isDesktop ? 16 : screen.isTablet ? 14 : 12,
              opacity: 0.6,
            }}
          >
            Built by
          </div>

          <a
            href="https://github.com/TheBoredDev01"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              transition: "transform 0.25s ease",
              textDecoration: "none",
              color: isDark ? "#f8fafc" : "#111827",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <div
              style={{
                padding: "6px 14px",
                borderRadius: 12,
                background: isDark 
                  ? "rgba(255,255,255,0.04)" 
                  : "linear-gradient(180deg, #ffffff, #f8fafc)", 
                border: isDark 
                  ? "1px solid rgba(255,255,255,0.06)" 
                  : "1px solid rgba(0,0,0,0.08)",
                boxShadow: isDark 
                  ? "0 6px 18px rgba(139,92,246,0.18)" 
                  : "0 6px 16px rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              TheBoredDev
            </div>
          </a>
        </div>

      </div>
    </div>
  );
}