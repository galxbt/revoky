// frontend/src/context/hooks/useConfig.js

import { useApp } from "./useApp";

export function useConfig() {
  const { config } = useApp();
  return config;
}