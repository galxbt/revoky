// frontend/src/components/layout/DisconnectModal.jsx

export default function DisconnectModal({
  isDark,
  isOpen,
  setShowDisconnectModal,
  setConnectedAddress,
  setWalletActive,
  config,
}) {
  const {
    modalPadding,
    buttonPadding,
    buttonGap,
  } = config;

  if (!isOpen) {
    return null;
  }

  function handleDisconnect() {
    setShowDisconnectModal(false);

    sessionStorage.setItem(
      "revoky-wallet-disconnected",
      "true",
    );

    setConnectedAddress(null);
    setWalletActive(false);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          width: 300,
          background: isDark ? "#1e293b" : "#ffffff",
          padding: modalPadding,
          borderRadius: 16,
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: 12 }}>
          Disconnect wallet?
        </h3>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            gap: buttonGap,
          }}
        >
          <button
            onClick={() => setShowDisconnectModal(false)}
            style={{
              flex: 1,
              padding: buttonPadding,
              borderRadius: 10,
              border: "none",
              background: "#e5e7eb",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleDisconnect}
            style={{
              flex: 1,
              padding: buttonPadding,
              borderRadius: 10,
              border: "none",
              background: "#ef4444",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}