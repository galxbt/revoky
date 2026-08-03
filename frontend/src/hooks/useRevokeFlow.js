// frontend/src/hooks/useRevokeFlow.js

import { useCallback } from "react";
import { ethers } from "ethers";
import { CHAINS } from "../config/chains";
import { getApprovalKey } from "../utils/helpers";
import { isUserRejection } from "@/utils/errors";

// Shared transaction states
export const TX_STATES = {
  IDLE: "idle",
  INITIATING: "initiating",
  SWITCHING: "switching",
  SIGNING: "signing",
  SUBMITTED: "submitted",
  SUCCESS: "success",
};

// Special key for batch
const BATCH_KEY = "__batch__";

export function useRevokeFlow({
  state,
  setters,
  refs,
  helpers,
  config,
  walletActions,
}) {
  const {
    approvals,
    selected,
    selectedChain,
    connectedAddress,
    scannedAddress,
    scanAddress,
  } = state;

  const {
    setApprovals,
    setSelected,
    setStatusMap,
    setError,
  } = setters;

  const {
  scanCacheRef,
  lastManualScanRef,
  } = refs;

  const { 
    truncateAddress, 
    showToast,
  } = helpers;
  
  const {
    CHAIN_EXPLORERS,
  } = config;
  
  const {
    handleNetworkSwitch,
    handleRetrySwitch,
    startTimeoutSession,
    clearTimeoutSession,
    wasSessionCancelled,
  } = walletActions;

  // -------------------------------------
  // STATE HELPERS
  // -------------------------------------
  
  const setTxState = useCallback((key, status, extra = {}) => {
    setStatusMap(prev => {
      if (prev[key] && status === TX_STATES.INITIATING) return prev;

      const prevState = prev[key] || {};

      const computedExtra = typeof extra === "function" ? extra(prevState) : extra;

      return {
        ...prev,
        [key]: {
          ...prevState,
          status,
          ...computedExtra,
        },
      };
    });
  }, [setStatusMap]);

  const clearTxState = useCallback((key) => {
    setStatusMap(prev => {
      if (!prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }, [setStatusMap]);

  // -------------------------------------
  // CORE
  // -------------------------------------
 
  const batchRevoke = useCallback(async (
    customTargets = null,
    isSilent = false,
    hooks = {}
  ) => {
    let successfulTxHashes = [];
    let successfulApprovals = [];

    if (!window.ethereum) {
      setError("Wallet not detected.");
      return;
    }

    if (!connectedAddress || connectedAddress.toLowerCase() !== scannedAddress?.toLowerCase()) {
      showToast(
        `Connect ${truncateAddress(scannedAddress || scanAddress)} to revoke approvals.`,
        "error"
      );
      return;
    }

    const targets = customTargets
      ? customTargets
      : approvals.filter(a => selected[getApprovalKey(a)]);

    if (!targets.length) return;

    try {
      let provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      const currentWalletChainId = Number(network.chainId);
      const expectedChainId = Number(CHAINS[selectedChain].chainId);

      hooks?.onStart?.(targets.length);

      // Network Switch  
      if (currentWalletChainId !== expectedChainId) {
        if (handleRetrySwitch(selectedChain)) {
          hooks?.onError?.();
          return { success: false };
        }

        const switchKey = `switch-${selectedChain}-${Date.now()}`;

        let switched;

        try {
          hooks?.onSwitching?.();

          switched = await Promise.race([
            handleNetworkSwitch(selectedChain),

            new Promise((resolve) => {
              startTimeoutSession(switchKey, 30000, () => {
                resolve("timeout");
              });
            }),
          ]);

        } catch {
          clearTimeoutSession(switchKey);
          hooks?.onError?.();
          return { success: false };
  
        } finally {
          clearTimeoutSession(switchKey);
        }
  
        if (switched === "timeout") {
          showToast("Network switch timed out.", "error");
          hooks?.onError?.();
          return { success: false };
        }

        if (!switched) {
          hooks?.onError?.();
          return { success: false };
        }

        provider = new ethers.BrowserProvider(window.ethereum);
      }
  
      const signer = await provider.getSigner();

      // Main Loop
      for (let i = 0; i < targets.length; i++) {
        const a = targets[i];
        const current = i + 1;
        const total = targets.length;
  
        const sessionKey = `revoke-${a.assetAddress}-${a.spender}-${a.tokenId || "0"}`;
  
        try {
          let tx;
  
          // Signing
          hooks?.onSignature?.(current, total);
  
          startTimeoutSession(sessionKey, 30000, () => {
            hooks?.onTimeout?.();
            showToast("Transaction confirmation timed out.", "error");
          });

          // Dispatcher
          switch (a.approvalScope) {
            case "fungible": {
              const token = new ethers.Contract(
                a.assetAddress,
                ["function approve(address spender, uint256 amount)"],
                signer
              );
          
              tx = await token.approve(a.spender, 0);
              break;
            }
          
            case "single": {
              const nft = new ethers.Contract(
                a.assetAddress,
                ["function approve(address to, uint256 tokenId)"],
                signer
              );
          
              tx = await nft.approve(ethers.ZeroAddress, a.tokenId);
              break;
            }
          
            case "collection": {
              const nft = new ethers.Contract(
                a.assetAddress,
                ["function setApprovalForAll(address operator, bool approved)"],
                signer
              );
          
              tx = await nft.setApprovalForAll(a.spender, false);
              break;
            }
          
            default:
              throw new Error(
                `Unsupported approval scope: ${a.approvalScope}`
              );
          }          

          if (wasSessionCancelled(sessionKey)) return;

          clearTimeoutSession(sessionKey);

          // Submitted
          hooks?.onRevoke?.(tx.hash, current, total);

          const receipt = await tx.wait();

          if (wasSessionCancelled(sessionKey)) return;

          successfulTxHashes.push(receipt.hash);
  
          successfulApprovals.push(a);          

        } catch (err) {
          console.error("REVOKE ERROR:", err);

          if (sessionKey) {
            clearTimeoutSession(sessionKey);
          }

          hooks?.onError?.();

          showToast(
            isUserRejection(err)
              ? "Transaction cancelled. Revoke stopped."
              : "Transaction failed. Revoke stopped.",
            "error"
          );

          break;
        }
      }

      // Success 
      const hasSuccess = successfulTxHashes.length > 0;

      if (hasSuccess) {
        hooks?.onSuccess?.(successfulTxHashes);

        const revokedKeys = successfulApprovals.map(a => getApprovalKey(a));

        // Remove approvals
        if (isSilent) {
          setTimeout(() => {
            setApprovals(prev =>
              prev.filter(a => !revokedKeys.includes(getApprovalKey(a)))
            );
          }, 7000);
        } else {
          setApprovals(prev =>
            prev.filter(a => !revokedKeys.includes(getApprovalKey(a)))
          );
        }

        // Invalidate cache after revoke
        const addressLower = scanAddress.toLowerCase();

        const perChainKeys = selectedChain === "all"
          ? Object.keys(CHAINS).filter(k => k !== "all")
          : [selectedChain];

        perChainKeys.forEach(chainKey => {
          const cacheKey = `${chainKey}-${addressLower}`;

          // Remove frontend cache
          delete scanCacheRef.current[cacheKey];

          // Reset manual throttle
          delete lastManualScanRef.current[cacheKey];
        });

        // Persist updated cache
        sessionStorage.setItem(
          "revoky-cache",
          JSON.stringify(scanCacheRef.current)
        );

        // Force fresh refetch
        setSelected({});
      }

      return {
        success: hasSuccess,
        txHashes: successfulTxHashes,
      };

    } catch (err) {
      setError(err.message || "Revoke failed.");
    }
  }, [
    approvals,
    selected,
    connectedAddress,
    scannedAddress,
    scanAddress,
    selectedChain,
    handleNetworkSwitch,
    handleRetrySwitch,
    startTimeoutSession,
    clearTimeoutSession,
    wasSessionCancelled,
    truncateAddress,
    showToast,
    setApprovals,
    setSelected,
    setError,
    scanCacheRef,
  ]);
  
  // -------------------------------------
  // SINGLE REVOKE 
  // -------------------------------------
  
  const handleSingleRevoke = useCallback(async (a, key) => {
    setTxState(key, TX_STATES.INITIATING);

    setSelected(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

    try {
      const result = await batchRevoke([a], true, {
        onSwitching: () => setTxState(key, TX_STATES.SWITCHING), 

        onSignature: () => setTxState(key, TX_STATES.SIGNING),        

        onRevoke: (txHash) => {
          const explorer = CHAIN_EXPLORERS[selectedChain];

          setTxState(key, TX_STATES.SUBMITTED, {
            txUrl: `${explorer}/tx/${txHash}`,
          });
        },
 
        onTimeout: () => {
          setTxState(key, TX_STATES.IDLE);
          setTimeout(() => clearTxState(key), 1200);
        }        
      });

      if (!result?.success) {
        clearTxState(key);
        return;
      }

      setTxState(key, TX_STATES.SUCCESS);

      setTimeout(() => clearTxState(key), 7000);

    } catch {
      clearTxState(key);
    }
  }, [
    batchRevoke,
    selectedChain,
    CHAIN_EXPLORERS,
    setSelected,
    setTxState,
    clearTxState,
  ]);

  // -------------------------------------
  // BATCH REVOKE 
  // -------------------------------------
 
  const handleBatchRevoke = useCallback(async (targets) => {
    if (!targets?.length) return;

    setTxState(BATCH_KEY, TX_STATES.INITIATING, {
      progress: { current: 0, total: targets.length },
      txUrls: [],
    });

    try {
      const result = await batchRevoke(targets, false, {
        onSwitching: () => {
          setTxState(BATCH_KEY, TX_STATES.SWITCHING);
        },       

        onSignature: (current, total) => {
          setTxState(BATCH_KEY, TX_STATES.SIGNING, {
            progress: { current, total },
          });
        },

        onRevoke: (txHash, current, total) => {
          const explorer = CHAIN_EXPLORERS[selectedChain];

          setTxState(BATCH_KEY, TX_STATES.SUBMITTED, (prev) => {
            const url = txHash ? `${explorer}/tx/${txHash}` : null;

            return {
              txUrl: url,
              txUrls: url
                ? [...(prev.txUrls || []), url]
                : prev.txUrls,
              progress: { current, total },
            };
          });
        },

        onTimeout: () => clearTxState(BATCH_KEY),
      });

      if (!result?.success) {
        clearTxState(BATCH_KEY);
        return;
      }

      setTxState(BATCH_KEY, TX_STATES.SUCCESS);

      setTimeout(() => clearTxState(BATCH_KEY), 7000);

    } catch {
      clearTxState(BATCH_KEY);
    }

  }, [
    batchRevoke,
    selectedChain,
    CHAIN_EXPLORERS,
    setTxState,
    clearTxState,
  ]);

  return {
    handleSingleRevoke,
    handleBatchRevoke,
    TX_STATES,
    BATCH_KEY,
  };
}