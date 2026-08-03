// frontend/src/context/hooks/useUI.js

import { useApp } from "./useApp";

export function useUI() {
  const { ui } = useApp();
  return ui;
}