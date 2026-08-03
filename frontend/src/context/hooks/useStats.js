// frontend/src/context/hooks/useStats.js

import { useApp } from "./useApp";

export function useStats() {
  const { stats } = useApp();
  return stats;
}