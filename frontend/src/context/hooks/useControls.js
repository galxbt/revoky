// frontend/src/context/hooks/useControls.js

import { useApp } from "./useApp";

export function useControls() {
  const { controls } = useApp();
  return controls;
}