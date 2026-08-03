// frontend/src/context/hooks/useWallet.js

import { useApp } from "./useApp";

export function useWallet() {
  const { wallet } = useApp();
  return wallet;
}