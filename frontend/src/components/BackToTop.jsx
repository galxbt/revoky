// frontend/src/components/BackToTop.jsx

import React from "react";
import { useUI } from "@/context/hooks";

export default function BackToTop() {
  const { showScrollTop } = useUI();

  if (!showScrollTop) return null;

  return (
    <button
      onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      style={{
        position: "fixed",
        bottom: 40,
        right: 22,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 6,
        zIndex: 9999,
        opacity: 0.9,
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}