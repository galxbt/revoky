// frontend/src/hooks/useAppEffects.js

import { useEffect } from "react";

export function useAppEffects({
  state,
  setters,
}) {
  const {
    isConnected,
  } = state;
  
  const {
    setSelected,
  } = setters;
  
  // -------------------------------------
  // CLEAR SELECTED APPROVALS ON DISCONNECT 
  // -------------------------------------
  
  useEffect(() => {
    if (!isConnected) {
      setSelected({});
    }
  }, [isConnected, setSelected]);
}