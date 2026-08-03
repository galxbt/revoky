// frontend/src/utils/resetSession.js

export function resetToFreshSession({
  setters,
  refs,
}) {
  const {
    setApprovals,
    setBackendData,
    setSelected,
    setAccountInfo,
    setScanAddress,
    setScannedAddress,
    setLastScannedInput,
    setHasScanned,
    setScanFailed,
    setIsValidScan,
    setSelectedChain,
    setLoading,
    setIsEnriched,
    setLastUpdated,
    setIsRefreshing,
    setError,
  } = setters;

  const {
    scanCacheRef,
    lastManualScanRef,
  } = refs;

  sessionStorage.removeItem("revoky-session");

  sessionStorage.removeItem("revoky-cache");

  sessionStorage.removeItem("revoky-last-manual-scan");

  scanCacheRef.current = {};
  lastManualScanRef.current = {};

  setApprovals([]);
  setBackendData({});
  setSelected({});
  setAccountInfo(null);

  setScanAddress("");
  setScannedAddress(null);
  setLastScannedInput("");

  setHasScanned(false);
  setScanFailed(false);
  setIsValidScan(false);

  setSelectedChain("ethereum");

  setLoading(false);
  setIsEnriched(false);
  setLastUpdated(null);
  setIsRefreshing(false);
  setError(null);

  window.history.replaceState(
    {},
    "",
    "/"
  );
}