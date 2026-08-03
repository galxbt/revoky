// frontend/src/components/Header.js

import revokyIcon from "@/assets/revoky-icon.svg";

export default function Header({
  screen,
  isDark,
  loading,
  goToLanding,
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 56,
        zIndex: 1000,
        willChange: "transform",
        background: isDark 
          ? "#0f172a" 
          : "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(243,244,246,0.9))",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: isDark 
          ? "1px solid rgba(255,255,255,0.06)" 
          : "1px solid rgba(0,0,0,0.05)",
        boxShadow: isDark 
          ? "0 6px 30px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.04) inset" 
          : "0 6px 20px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.6) inset",
      }}
    >
      <div
        className="app-container"
        style={{
          height: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        {/* LEFT — LOGO */}
        <div
          onClick={goToLanding}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
            cursor: loading ? "default" : "pointer",
            pointerEvents: loading ? "none" : "auto",
          }}
        >
          <img
            src={revokyIcon}
            alt="Revoky logo"
            style={{
              width: screen.isDesktop ? 34 : screen.isTablet ? 28 : 24,
              height: screen.isDesktop ? 34 : screen.isTablet ? 28 : 24,
              flexShrink: 0,
              transform: screen.isDesktop ? "translateY(-1px)"
                : screen.isTablet ? "translateY(-1px)" : "translateY(-0.5px)",
            }}
          />

          <span
            style={{
              fontWeight: 700,
              fontSize: screen.isDesktop ? 32 : screen.isTablet ? 26 : 23,
              letterSpacing: "0.02em",
              color: isDark  ? "#f8fafc" : "#991b1b",
              textShadow: isDark 
                ? "0 1px 2px rgba(0,0,0,0.6), 0 0 6px rgba(255,77,77,0.35), 0 0 12px rgba(255,77,77,0.18)" 
                : "0 1px 2px rgba(0,0,0,0.15)",
            }}
          >
            Revoky
          </span>
        </div>

        {/* RIGHT — TAGLINE */}
        <div
          style={{
            fontFamily: "Outfit, sans-serif",
            letterSpacing: -0.3,
            fontSize: screen.isDesktop ? 18 : screen.isTablet ? 14 : 12,
            opacity: 0.75,
            display: "flex",
            flexDirection: "column",
            maxWidth: 200,
          }}
        >
         Secure Your Assets
        </div>

      </div>
    </div>
  );
}