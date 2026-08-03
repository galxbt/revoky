// frontend/src/components/layout/ConnectNotice.jsx

export default function ConnectNotice({
  approvals,
  selectedChain,
  isConnectedView,
  config,
}) {
  const {
    marginTop,
    fontSize,
  } = config;

  if (approvals.length === 0) {
    return null;
  }

  let message = "";

  if (selectedChain === "all") {
    message = "Select a chain to revoke approvals";
  } else if (!isConnectedView) {
    message = "Connect wallet to revoke approvals";
  }

  if (!message) {
    return null;
  }

  return (
    <div
      style={{
        marginTop,
        textAlign: "center",
        fontSize,
        opacity: 0.8,
        color: "#808080",
      }}
    >
      {message}
    </div>
  );
}