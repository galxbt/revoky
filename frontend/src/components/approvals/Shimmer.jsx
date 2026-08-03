// frontend/src/components/approvals/Shimmer.jsx

import React from "react";
import { isLowEnd } from "@/utils/device";
import { useUI } from "@/context/hooks";

const Shimmer = React.memo(
  function Shimmer({
    width = "70px",
    height = 12,
    radius = 6,
  }) {
    const { isDark } = useUI();

    return (
      <span
        style={{
          position: "relative",
          display: "inline-block",
          width,
          height,
          borderRadius: radius,
          background: isDark ? "#334155" : "#e5e7eb",
          overflow: "hidden",
          fontVariantNumeric: "tabular-nums",
          animation: isLowEnd ? "none" : "shimmerPulse 1.8s ease-in-out infinite",
          willChange: "opacity",
        }}
      >
        {!isLowEnd && (
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "45%",
              height: "100%",
              background: isDark
                ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)"
                : "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)",
              transform: "translateX(-120%)",
              animation: "shimmerSlide 1.3s linear infinite",
              willChange: "transform",
            }}
          />
        )}
      </span>
    );
  }
);

export default Shimmer;