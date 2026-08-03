// frontend/src/components/SkeletonCard.jsx

import React from "react";
import { useUI } from "@/context/hooks";

export default function SkeletonCard({
  lines = [60, 40, 50],
  height = [16, 12, 12],
  gap = 10,
  radius = 16,
  padding = 18,
  style = {},
}) {
  const { isDark } = useUI();

  return (
    <div
      style={{
        marginTop: 12,
        padding,
        borderRadius: radius,
        background: isDark ? "#1e293b" : "#f3f4f6",
        overflow: "hidden",
        position: "relative",
        animation: "shimmerPulse 1.8s ease-in-out infinite",
        ...style,
      }}
    >
      {lines.map((w, i) => (
        <div
          key={i}
          style={{
            height: height[i] || 12,
            width: `${w}%`,
            background: isDark ? "#334155" : "#e5e7eb",
            borderRadius: 999,
            marginTop: i === 0 ? 0 : gap,
            position: "relative",
            overflow: "hidden",
          }}
        />
      ))}

      {/* SHIMMER */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "45%",
            height: "100%",
            transform: "translateX(-120%)",
            background: isDark 
              ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" 
              : "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
            animation: "shimmerSlide 1.4s linear infinite",
            willChange: "transform",
          }}
        />
      </div>
    </div>
  );
}