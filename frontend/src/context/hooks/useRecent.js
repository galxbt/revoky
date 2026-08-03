// frontend/src/context/hooks/useRecent.js

import { useApp } from "./useApp";

export function useRecent() {
  const { recent } = useApp();
  return recent;
}