// frontend/src/components/layout/TxModal.jsx

import { safeMap } from "@/utils/list";

export default function TxModal({
  txModal,
  setTxModal,
  isDark,
}) {
  if (!txModal) {
    return null;
  }

  return (
    <div
      onClick={() => setTxModal(null)}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 400,
          maxHeight: "70vh",
          overflowY: "auto",
          borderRadius: 16,
          padding: 16,
          background: isDark ? "#1e293b" : "#ffffff",
        }}
      >
        <h3
          style={{ marginBottom: 12 }}
        >
          Transactions
        </h3>

        {safeMap(
          txModal.txUrls,
          (url, key, i) => (
            <div
              key={key}
              onClick={() => window.open(url, "_blank")}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                marginBottom: 8,
                cursor: "pointer",
                background: isDark ? "#334155" : "#f3f4f6",
                fontSize: 13,
                color: "#3b82f6",
                textDecoration: "underline",
              }}
            >
              View transaction {i + 1}
            </div>
          ),
        )}
      </div>
    </div>
  );
}