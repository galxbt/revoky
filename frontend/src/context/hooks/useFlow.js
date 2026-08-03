// frontend/src/context/hooks/useFlow.js

import { useApp } from "./useApp";

export function useFlow() {
  const { flow } = useApp();
  return flow;
}