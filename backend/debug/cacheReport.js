// backend/debug/cacheReport.js

import {
  debugCaches,
  getCacheStats as buildCacheStats,
} from "../utils/logger.js";

import { CACHES } from "../services/caches.js";

// -------------------------------------
// HELPERS
// -------------------------------------

export function getCaches() {
  return CACHES;
}

export function getCacheStats() {
  return buildCacheStats(CACHES);
}

export function logCacheStats() {
  debugCaches(CACHES);
}