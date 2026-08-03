// frontend/src/utils/cache.js

const MAX_CACHE_BYTES = 3_500_000; // ~3.5MB safe zone

// -------------------------------------
// ESTIMATE THE CURRENT CACHE SIZE
// -------------------------------------

function getCacheSize(obj) {
  try {
    return new Blob([JSON.stringify(obj)]).size;
  } catch {
    return 0;
  }
}

// -------------------------------------
// REMOVE THE OLDEST CACHED ENTRY
// -------------------------------------

function evictOldest(ref) {
  const entries = Object.entries(ref.current);

  if (!entries.length) return;

  const oldestKey = entries.sort((a, b) => 
    a[1].timestamp - b[1].timestamp)[0][0];

  delete ref.current[oldestKey];
}

// -------------------------------------
// RETRIEVE A VALID CACHED ENTRY
// -------------------------------------

export function getCache(
  ref, 
  key, 
  DISABLE_CACHE, 
  CACHE_TTL,
) {
  if (DISABLE_CACHE) return null;

  const entry = ref.current[key];
  
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_TTL;

  if (isExpired) {
    delete ref.current[key];
    return null;
  }

  return entry;
}

// -------------------------------------
// STORE DATA IN THE CACHE
// -------------------------------------

export function setCache(
  ref, 
  key, 
  data, 
  DISABLE_CACHE,
) {
  if (DISABLE_CACHE) return;

  // Add/update
  ref.current[key] = {
    data,
    timestamp: Date.now(),
  };

  // Size control 
  while (getCacheSize(ref.current) > MAX_CACHE_BYTES) {
    evictOldest(ref);
  }

  // Save (with recovery)
  try {
    sessionStorage.setItem(
      "revoky-cache",
      JSON.stringify(ref.current)
    );
  } catch (e) {
    console.warn("Cache storage failed, recovering...", e);

    // Emergency cleanup
    let attempts = 0;

    while (attempts < 10) {
      evictOldest(ref);

      try {
        sessionStorage.setItem(
          "revoky-cache",
          JSON.stringify(ref.current)
        );
        break;
      } catch {
        attempts++;
      }
    }
  }
}

// -------------------------------------
// CLEAR ALL CACHED DATA
// -------------------------------------

export function clearCache(ref) {
  ref.current = {};
  sessionStorage.removeItem("revoky-cache");
}