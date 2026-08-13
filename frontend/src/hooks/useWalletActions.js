// frontend/src/hooks/useWalletActions.js  

import { useEffect, useRef } from "react";
import { ethers } from "ethers";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitProvider,
  useAppKitNetworkCore,
  useDisconnect,
  useWalletInfo,
} from "@reown/appkit/react";
import { StorageUtil } from "@reown/appkit-controllers";
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
    setWalletChainId,  
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
  
  const appKitProcessedRef = useRef(null);  
  const appKitProcessingRef = useRef(false);  
  const appKitWasConnectedRef = useRef(false);
  
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { walletInfo } = useWalletInfo();
  
  const {
    address: appKitAddress,
    isConnected: appKitConnected,
    status: appKitStatus,
  } = useAppKitAccount({
    namespace: "eip155",
  });
  
  const { walletProvider } = useAppKitProvider("eip155");
  
  const { chainId: appKitChainId } = useAppKitNetworkCore();
  
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
    if (!walletProvider) {  
      showToast(  
        "No wallet provider available.",  
        "error"  
      );  
    
      return false;  
    }  
    
    const chain = CHAINS[chainKey];  
    
    try {  
      await walletProvider.request({  
        method: "wallet_switchEthereumChain",  
        params: [  
          {  
            chainId: chain.chainIdHex,  
          },  
        ],  
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
  // PROCESS CONNECTED WALLET  
  // -------------------------------------  
    
  async function processConnectedWallet() {  
    if (selectedChain === "all") {  
      setError(  
        "Please select a specific chain to connect wallet."  
      );  
      
      return false;  
    }  
      
    if (!walletProvider) {  
      return false;  
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
        walletProvider  
      );  
    
      const signer = await provider.getSigner();  
    
      const address = await signer.getAddress();  
    
      const normalized = ethers.getAddress(address);  
    
      if (wasSessionCancelled("connect")) {  
        return;  
      }  
    
      clearTimeoutSession("connect");  
    
      const network = await provider.getNetwork();  
    
      const currentChainId = Number(  
        network.chainId  
      );  
        
      setWalletChainId(currentChainId);        
    
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
            return false;  
          }  
  
          setWalletChainId(  
            Number(CHAINS[selectedChain].chainId)  
          );            
    
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
    
      sessionStorage.removeItem(  
        "revoky-wallet-disconnected"  
      );  
    
      await fetchApprovalsForAddress(  
        normalized,  
        selectedChain  
      );  
  
      return true;  
    
    } catch (err) {  
      clearTimeoutSession("connect");  
    
      setConnecting(false);  
      setConnectSwitching(false);  
    
      setError(  
        err?.shortMessage ||  
        err?.message ||  
        "Wallet connection failed."  
      );  
  
      return false;  
    
    } finally {  
      setConnecting(false);  
    }  
  }  
  
  // -------------------------------------  
  // APPKIT CONNECTION LIFECYCLE  
  // -------------------------------------  
  
  const latestProcessConnectedWalletRef =  
    useRef(processConnectedWallet);  
  
  latestProcessConnectedWalletRef.current =  
    processConnectedWallet;  
  
  useEffect(() => {  
    const wasDisconnected =  
      sessionStorage.getItem(  
        "revoky-wallet-disconnected"  
      ) === "true";  
    
    if (  
      !appKitConnected ||  
      !appKitAddress ||  
      !walletProvider  
    ) {  
      if (  
        appKitWasConnectedRef.current &&  
        appKitStatus === "disconnected"  
      ) {  
        setConnectedAddress(null);  
        setWalletActive(false);  
        setWalletChainId(null);  
    
        appKitProcessedRef.current = null;  
        appKitProcessingRef.current = false;  
    
        setConnecting(false);  
        setConnectSwitching(false);  
      }  
    
      return;  
    }  
    
    // AppKit says connected, but Revoky explicitly  
    // disconnected the wallet. Do not re-process it.  
    if (wasDisconnected) {  
      return;  
    }  
    
    appKitWasConnectedRef.current = true;  
    
    if (selectedChain === "all") {  
      return;  
    }  
    
    const connectionKey =  
      `${appKitAddress}:${selectedChain}`;  
    
    if (  
      appKitProcessedRef.current === connectionKey ||  
      appKitProcessingRef.current  
    ) {  
      return;  
    }  
    
    appKitProcessingRef.current = true;  
    
    latestProcessConnectedWalletRef.current()  
      .then((success) => {  
        if (success) {  
          appKitProcessedRef.current =  
            connectionKey;  
        }  
      })  
      .finally(() => {  
        appKitProcessingRef.current = false;  
      });  
    
  }, [  
    appKitAddress,  
    appKitConnected,  
    appKitStatus,  
    walletProvider,  
    appKitChainId,  
    selectedChain,  
  ]);  
  
  // -------------------------------------  
  // DISCONNECT WALLET  
  // -------------------------------------  
    
  async function disconnectWallet() {
    setError(null);
  
    try {
      try {
        await disconnect({
          namespace: "eip155",
        });
      } catch (err) {
        console.warn(
          "AppKit disconnect failed:",
          err
        );
      }
  
      // Explicitly mark the injected connector as
      // disconnected in AppKit's own storage.
      if (walletInfo?.type === "INJECTED") {
        StorageUtil.addDisconnectedConnectorId(
          "injected",
          "eip155"
        );
  
        StorageUtil.deleteConnectedConnectorId(
          "eip155"
        );
      }
  
      sessionStorage.setItem(
        "revoky-wallet-disconnected",
        "true"
      );
  
      setConnectedAddress(null);
      setWalletActive(false);
      setWalletChainId(null);
  
    } catch (err) {
      setError(
        err?.shortMessage ||
        err?.message ||
        "Wallet disconnection failed."
      );
    }
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
    
    try {  
      setError(null);  
    
      sessionStorage.removeItem(  
        "revoky-wallet-disconnected"  
      );  
    
      await open({  
        view: "Connect",  
        namespace: "eip155",  
      });  
    
    } catch (err) {  
      setError(  
        err?.shortMessage ||  
        err?.message ||  
        "Unable to open wallet connection."  
      );  
    }  
  }  
  
  return {  
    connectWallet,  
    disconnectWallet,  
    processConnectedWallet,  
    handleNetworkSwitch,  
    handleRetrySwitch,  
    startTimeoutSession,  
    clearTimeoutSession,  
    wasSessionCancelled,  
  };  
}  