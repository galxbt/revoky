// frontend/src/context/hooks/useAppContext.js

import {
  useUI,
  useWallet,
  useFlow,
  useScan,
  useStats,
  useRecent,
  useControls,
  useUtils,
  useConfig,
} from ".";

export function useAppContext() {
  const ui = useUI();
  const wallet = useWallet();
  const scan = useScan();
  const flow = useFlow();
  const stats = useStats();
  const recent = useRecent();
  const controls = useControls();
  const utils = useUtils();
  const config = useConfig();

  return {
    ui,
    wallet,
    scan,
    flow,
    stats,
    recent,
    controls,
    utils,
    config,
  };
}