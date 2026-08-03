// frontend/src/utils/session.js

// -------------------------------------
// RETRIEVE APP SESSION
// -------------------------------------

export function getSession() {
  return JSON.parse(
    sessionStorage.getItem(
      "revoky-session"
    ) || "{}"
  );
}

// -------------------------------------
// GENERATE SESSION KEY
// -------------------------------------

export function getSessionKey(
  chain,
  address,
) {
  if (!chain || !address) {
    return null;
  }

  return (
    `${chain}-${address.toLowerCase()}`
  );
}

// -------------------------------------
// RETRIEVE SCAN SESSION
// -------------------------------------

export function getSessionScan(
  session,
  chain,
  address,
) {
  const key = getSessionKey(
    chain,
    address,
  );

  if (!key) {
    return null;
  }

  return (
    session?.scans?.[key] || null
  );
}

// -------------------------------------
// RETRIEVE ACTIVE SESSION 
// -------------------------------------

export function getActiveSession(session) { 
  const key = session?.activeSessionKey;

  if (!key) {
    return null;
  }

  return (
    session?.scans?.[key] || null
  );
}

// -------------------------------------
// SAVE SCAN SESSION 
// -------------------------------------

export function saveSessionScan({
  chainKey,
  scanAddress,
  scannedAddress,
  lastScannedInput,
}) {
  const session = getSession();

  const sessionKey = getSessionKey(
    chainKey,
    scannedAddress,
  );

  if (!sessionKey) {
    return;
  }

  session.scans = {
    ...(session.scans || {}),
    [sessionKey]: {
      scanAddress,
      scannedAddress,
      lastScannedInput,
    },
  };

  sessionStorage.setItem(
    "revoky-session",
    JSON.stringify(session),
  );
}

// -------------------------------------
// SET ACTIVE SESSION 
// -------------------------------------

export function setActiveSession({
  chainKey,
  scannedAddress,
}) {
  const session = getSession();

  const sessionKey = getSessionKey(
    chainKey,
    scannedAddress,
  );

  if (!sessionKey) {
    return;
  }

  session.activeSessionKey = sessionKey;

  sessionStorage.setItem(
    "revoky-session",
    JSON.stringify(session),
  );
}