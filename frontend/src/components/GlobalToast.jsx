// frontend/src/components/GlobalToast.jsx

import React from "react";
import { useUI } from "@/context/hooks";

export default function GlobalToast() {
  const { toast, setToast } = useUI();

  if (!toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backdropFilter: "blur(4px)",
        background: "rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 9999,
        animation: "fadeInOverlay 0.2s ease",
      }}
    >
      <div
        style={{
          minWidth: 280,
          maxWidth: "90%",
          padding: "16px 20px",
          borderRadius: 18,
          background: toast.type === "error" ? "#334155" 
            : toast.type === "success" ? "#22c55e" : "#3b82f6",
          color: "#ffffff",
          fontWeight: 600,
          boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          animation: "toastPop 0.25s ease",
        }}
      >
        <span>{toast.message}</span>

        <button
          onClick={() => setToast(null)}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            borderRadius: 8,
            padding: 6,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" stroke="#fff" strokeWidth="2" />
            <line x1="6" y1="6" x2="18" y2="18" stroke="#fff" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </div>
  );
}