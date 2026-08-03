// frontend/src/context/AppContextProvider.js

import { AppContext } from "./AppContext";

export function AppProvider({
  value,
  children,
}) {
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}