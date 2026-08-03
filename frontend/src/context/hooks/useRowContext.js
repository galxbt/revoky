// frontend/src/context/hooks/useRowContext.js

// Mobile/Tablet/Desktop Shared Row Context 

import {
  useUI,
  useWallet,
  useFlow,
  useControls,
  useUtils,
  useConfig,
} from ".";

export function useRowContext() {
  const { isDark } = useUI();
  const { selected, TX_STATES } = useFlow();
  const { setActiveModal } = useControls();
  const { copiedKey, copyToClipboard, truncateAddress } = useUtils();
  const { selectedChain, CHAIN_EXPLORERS, CHAIN_COLORS, CHAINS } = useConfig();
  const { isConnectedView } = useWallet();

  const isAllChains = selectedChain === "all";

  return {
    isDark,
    selected,
    TX_STATES,
    setActiveModal,
    copiedKey,
    copyToClipboard,
    truncateAddress,
    selectedChain,
    CHAIN_EXPLORERS,
    CHAIN_COLORS,
    CHAINS,
    isConnectedView,
    isAllChains,
  };
}