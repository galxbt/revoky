// frontend/src/hooks/useWalletActions.js

import { ethers } from "ethers";
import { CHAINS } from "../config/chains";

export function useWalletActions({
  state,
  setters,
  refs,
  helpers,
  derived,
}) {
  const {
    selectedChain,
  } = state;

  const {
    setConnectedAddress,
    setWalletActive,
    setConnecting,
    setConnectSwitching,
    setError,
    setScanAddress,
    setLastScannedInput,
  } = setters;

  const {
    timeoutRefs,
    cancelRefs,
  } = refs;

  const {
    showToast,
  } = helpers;

  const {
    fetchApprovalsForAddress,
  } = derived;

  // -------------------------------------
  // TIMEOUT SYSTEM
  // -------------------------------------

  const startTimeoutSession = (
    key,
    duration,
    onTimeout
  ) => {
    clearTimeout(timeoutRefs.current[key]);

    cancelRefs.current[key] = false;

    timeoutRefs.current[key] = setTimeout(() => {
      cancelRefs.current[key] = true;

      onTimeout?.();
    }, duration);
  };

  const clearTimeoutSession = (key) => {
    clearTimeout(timeoutRefs.current[key]);

    cancelRefs.current[key] = false;
  };

  const wasSessionCancelled = (key) => {
    return cancelRefs.current[key];
  };

  // -------------------------------------
  // USER REJECTION
  // -------------------------------------

  const isUserRejected = (err) => {
    return (
      err?.code === 4001 ||
      err?.code === "ACTION_REJECTED" ||
      err?.reason === "rejected" ||
      err?.info?.error?.code === 4001
    );
  };

  // -------------------------------------
  // NETWORK SWITCH
  // -------------------------------------

  async function handleNetworkSwitch(chainKey) {
    if (!window.ethereum) {
      return false;
    }

    const chain = CHAINS[chainKey];

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chain.chainIdHex }],
      });

      sessionStorage.removeItem(
        "revoky-switch-rejected"
      );

      return true;

    } catch (err) {
      if (isUserRejected(err)) {
        showToast(
          "Network switch was cancelled.",
          "info"
        );

        sessionStorage.setItem(
          "revoky-switch-rejected",
          chainKey
        );

        return false;
      }

      showToast(
        "Network switch failed.",
        "error"
      );

      return false;
    }
  }

  function handleRetrySwitch(chainKey) {
    const rejectedChain = sessionStorage.getItem(
      "revoky-switch-rejected"
    );

    if (rejectedChain === chainKey) {
      const chainName = CHAINS[chainKey].name;

      showToast(
        `Refresh page or select ${chainName} in wallet to continue...`,
        "error"
      );

      return true;
    }

    return false;
  }

  // -------------------------------------
  // CONNECT WALLET
  // -------------------------------------

  async function connectWallet() {
    if (selectedChain === "all") {
      setError(
        "Please select a specific chain to connect wallet."
      );
      return;
    }

    if (!window.ethereum) {
      setError("No Web3 wallet detected.");
      return;
    }

    try {
      setError(null);

      setConnecting(true);

      startTimeoutSession(
        "connect",
        30000,
        () => {
          setConnecting(false);
          setConnectSwitching(false);

          showToast(
            "Wallet connection timed out.",
            "error"
          );
        }
      );

      const provider = new ethers.BrowserProvider(
        window.ethereum
      );

      await provider.send(
        "eth_requestAccounts",
        []
      );

      sessionStorage.removeItem(
        "revoky-connect-rejected"
      );

      const signer = await provider.getSigner();

      const address = await signer.getAddress();

      const normalized = ethers.getAddress(address);

      if (wasSessionCancelled("connect")) {
        return;
      }

      clearTimeoutSession("connect");

      const network = await provider.getNetwork();

      const currentChainId = Number(network.chainId);

      const targetChainId = Number(
        CHAINS[selectedChain].chainId
      );

      if (currentChainId !== targetChainId) {
        if (handleRetrySwitch(selectedChain)) {
          setConnecting(false);
          return;
        }

        try {
          setConnectSwitching(true);

          startTimeoutSession(
            "switch",
            30000,
            () => {
              setConnectSwitching(false);
              setConnecting(false);

              showToast(
                "Network switch timed out.",
                "error"
              );
            }
          );

          const switched =
            await handleNetworkSwitch(selectedChain);

          if (wasSessionCancelled("switch")) {
            return;
          }

          clearTimeoutSession("switch");

          if (!switched) {
            setConnectSwitching(false);
            setConnecting(false);
            return;
          }

        } catch {
          showToast(
            "Network switch failed.",
            "error"
          );

          setConnecting(false);

          return;

        } finally {
          setConnectSwitching(false);
        }
      }

      setConnectedAddress(normalized);

      setScanAddress(normalized);

      setLastScannedInput(normalized);

      setWalletActive(true);

      localStorage.removeItem(
        "revoky-wallet-disconnected"
      );

      await fetchApprovalsForAddress(
        normalized,
        selectedChain
      );

    } catch (err) {
      clearTimeoutSession("connect");

      setConnecting(false);
      setConnectSwitching(false);

      if (isUserRejected(err)) {
        sessionStorage.setItem(
          "revoky-connect-rejected",
          "true"
        );

        showToast(
          "Wallet connection was cancelled.",
          "info"
        );

        setError(null);

        return;
      }

      setError(
        err?.shortMessage ||
        err?.message ||
        "Wallet connection failed."
      );

    } finally {
      setConnecting(false);
    }
  }

  return {
    connectWallet,
    handleNetworkSwitch,
    handleRetrySwitch,
    startTimeoutSession,
    clearTimeoutSession,
    wasSessionCancelled,
  };
}