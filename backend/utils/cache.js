// backend/utils/cache.js

import { CACHE_CONFIG } from "../config/cache.js";

const { DISABLE } = CACHE_CONFIG;

// -------------------------------------
// CACHE STATS
// -------------------------------------

export const CACHE_STATS = {};

function getStats(name) {
  if (!CACHE_STATS[name]) {
    CACHE_STATS[name] = {
      hits: 0,
      misses: 0,
    };
  }

  return CACHE_STATS[name];
}

export function resetCacheStats() {
  for (const stats of Object.values(CACHE_STATS)) {
    stats.hits = 0;
    stats.misses = 0;
  }
}

// -------------------------------------
// LRU CACHE
// -------------------------------------

export class LRUCache {
  constructor(limit = 5000) {
    this.limit = limit;
    this.map = new Map();
  }

  get(key) {
    const item = this.map.get(key);

    if (!item) {
      return null;
    }

    this.map.delete(key);
    this.map.set(key, item);

    return item;
  }

  set(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    }

    this.map.set(key, value);

    if (this.map.size > this.limit) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }

  delete(key) {
    this.map.delete(key);
  }

  clear() {
    this.map.clear();
  }

  get size() {
    return this.map.size;
  }
}

// -------------------------------------
// GENERIC GET
// -------------------------------------

export function getCache(
  name,
  cache,
  key,
  ttl = null
) {
  if (DISABLE) {
    return null;
  }

  const stats = getStats(name);

  const cached = cache.get(key);

  if (!cached) {
    stats.misses++;
    return null;
  }

  // TTL-based cache
  if (
    ttl !== null &&
    Date.now() - cached.timestamp > ttl
  ) {
    cache.delete(key);
    stats.misses++;
    return null;
  }

  stats.hits++;

  return ttl !== null
    ? cached.data
    : cached.data;
}

// -------------------------------------
// GENERIC SET
// -------------------------------------

export function setCache(
  cache,
  key,
  data
) {
  if (DISABLE) {
    return;
  }

  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}