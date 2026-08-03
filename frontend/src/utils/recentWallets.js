// frontend/src/utils/recentWallets.js

const RECENT_KEY = "revoky-recent-wallets";
const MAX_RECENT = 7;

// -------------------------------------
// RETRIEVE RECENT WALLETS
// -------------------------------------

export function getRecentWallets() {
  try {
    return (JSON.parse(localStorage.getItem(RECENT_KEY)) || []);
  } catch {
    return [];
  }
}

// -------------------------------------
// SAVE A WALLET TO THE RECENT LIST
// -------------------------------------

export function saveRecentWallet({
  input,
  resolved,
  ens = null,
  chain = "ethereum",
  setRecentWallets,
}) {
  try {
    let list = getRecentWallets();

    const normalizedInput = input.trim().toLowerCase();

    const normalizedResolved = resolved.toLowerCase();

    const normalizedEns = ens?.toLowerCase() || null;

    list = list.filter((item) =>
      item.resolved.toLowerCase() !== normalizedResolved
    );

    list.unshift({
      id: `${chain}:${normalizedResolved}`,
      input: normalizedEns || normalizedInput,
      resolved,
      ens: normalizedEns,
      chain,
      timestamp: Date.now(),
    });

    list = list.slice(0, MAX_RECENT);

    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify(list)
    );

    setRecentWallets(list);

  } catch (err) {
    console.error(
      "saveRecentWallet error:",
      err
    );
  }
}

// -------------------------------------
// REMOVE A WALLET FROM THE RECENT LIST
// -------------------------------------

export function removeRecentWallet(resolved, setRecentWallets) {
  setRecentWallets(prev => {
    const updated = prev.filter(item =>
      item.resolved.toLowerCase() !== resolved.toLowerCase()
    );

    localStorage.setItem(
      RECENT_KEY,
      JSON.stringify(updated)
    );

    return updated;
  });
}

// -------------------------------------
// CLEAR ALL RECENT WALLETS
// -------------------------------------

export function clearRecentWallets(setRecentWallets) {
  setRecentWallets([]);
  
  localStorage.removeItem(RECENT_KEY);
}