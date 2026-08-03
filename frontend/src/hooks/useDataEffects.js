// frontend/src/hooks/useDataEffects.js

import { useEffect } from "react";
import { ethers } from "ethers";

export function useDataEffects({
  state,
  setters,
  helpers,
  derived,
}) {
  const {
    backendData,
    selectedChain,
    scannedAddress,
    displayName,
    isEnriched,
    sortOption,
    sortMetric,
    sortDirection,
  } = state;
  
  const {
    setWalletChainId,
    setConnectSwitching,
    setWalletActive,
    setConnectedAddress,
    setDisplayName,
  } = setters;

  const {
    updateUrl,
    truncateAddress,
  } = helpers;

  const {
    activeAddress,
  } = derived;

  // -------------------------------------
  // WALLET CHAIN SYNC
  // -------------------------------------

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }

    const handleChainChanged = (chainIdHex) => {
      try {
        const newChainId = parseInt(chainIdHex, 16);

        setWalletChainId(newChainId);

        sessionStorage.removeItem("revoky-switch-rejected");

        setConnectSwitching(false);

      } catch {
        setWalletChainId(null);
      }
    };

    handleChainChanged(window.ethereum.chainId);

    window.ethereum.on(
      "chainChanged",
      handleChainChanged
    );

    return () => {
      window.ethereum.removeListener(
        "chainChanged",
        handleChainChanged
      );
    };

  }, [
    setWalletChainId,
    setConnectSwitching,
  ]);

  // -------------------------------------
  // WALLET CONNECTION VALIDATION
  // -------------------------------------

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }

    async function verifyConnection() {
      const provider = new ethers.BrowserProvider(window.ethereum);

      const accounts = await provider.send("eth_accounts", []);

      if (!accounts.length) {
        sessionStorage.removeItem("revoky-session");

        setWalletActive(false);
        setConnectedAddress(null);
      }
    }

    verifyConnection();

  }, [
    setWalletActive,
    setConnectedAddress,
  ]);

  // -------------------------------------
  // DISPLAY NAME
  // -------------------------------------
 
  useEffect(() => {
    if (!activeAddress || !isEnriched) {
      return;
    }
  
    const identity = backendData?.[selectedChain]?.identity;
  
    const ensName = identity?.ensName;
  
    if (ensName) {
      setDisplayName(ensName);
    } else {
      setDisplayName(truncateAddress(activeAddress));
    }
  
  }, [
    activeAddress,
    backendData,
    isEnriched,
    displayName,
    setDisplayName,
    truncateAddress,
  ]);

  // -------------------------------------
  // URL SYNC
  // -------------------------------------

  useEffect(() => {
    if (!scannedAddress) {
      return;
    }

    updateUrl(
      scannedAddress,
      selectedChain,
      sortOption,
      sortMetric
    );

  }, [
    scannedAddress,
    selectedChain,
    sortOption,
    sortMetric,
    sortDirection,
    updateUrl,
  ]);
}