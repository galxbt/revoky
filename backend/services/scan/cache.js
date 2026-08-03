// backend/services/scan/cache.js

import { SCAN_CACHE } from "../caches.js";

// -------------------------------------
// HELPERS
// -------------------------------------

function cacheKey(
  chainKey,
  owner
) {
  return `${chainKey}:${owner.toLowerCase()}`;
}

// -------------------------------------
// GET
// -------------------------------------

export function getScanCache({
  chainKey,
  owner,
}) {
  return (
    SCAN_CACHE.get(
      cacheKey(
        chainKey,
        owner
      )
    ) || null
  );
}

// -------------------------------------
// SET
// -------------------------------------

export function setScanCache({
  chainKey,
  owner,
  approvals,
  lastScannedBlock,
}) {
  SCAN_CACHE.set(
    cacheKey(
      chainKey,
      owner
    ),
    {
      approvals,

      lastScannedBlock,

      updatedAt: Date.now(),
    }
  );
}

// -------------------------------------
// DELETE
// -------------------------------------

export function deleteScanCache({
  chainKey,
  owner,
}) {
  SCAN_CACHE.delete(
    cacheKey(
      chainKey,
      owner
    )
  );
}

// -------------------------------------
// CLEAR
// -------------------------------------

export function clearScanCache() {
  SCAN_CACHE.clear();
}