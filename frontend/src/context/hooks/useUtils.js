// frontend/src/context/hooks/useUtils.js

import { useApp } from "./useApp";

export function useUtils() {
  const { utils } = useApp();
  return utils;
}