// frontend/src/hooks/useActiveWalletDisplay.js

export function useActiveWalletDisplay({
  state,
  helpers,
}) {
  const {
    connectedAddress,
    scannedAddress,
    displayName,
  } = state;
  
  const {
    truncateAddress,
  } = helpers;

  const hasConnected = !!connectedAddress;

  const hasScanned = !!scannedAddress;

  const activeAddress = 
    scannedAddress || 
    connectedAddress;

  const isSame = 
    hasConnected && 
    hasScanned && 
    connectedAddress?.toLowerCase() === scannedAddress?.toLowerCase();

  const isConnectedView = 
    hasConnected && 
    (!hasScanned || isSame);

  const statusLabel = 
    activeAddress ? 
      isConnectedView ? "Connected" : "Disconnected" 
    : null;

  const addressLabel = 
    activeAddress ? 
      (displayName || truncateAddress(activeAddress)) 
    : null;

  return {
    activeAddress,
    statusLabel,
    addressLabel,
    isConnectedView,
    hasAddress: !!activeAddress,
  };
}