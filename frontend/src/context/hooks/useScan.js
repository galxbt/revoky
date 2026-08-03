// frontend/src/context/hooks/useScan.js

import { useApp } from "./useApp";

export function useScan() {
  const { scan } = useApp();
  return scan;
}