// backend/utils/logger.js

import sizeof from "object-sizeof";
import { CACHE_STATS } from "./cache.js";

const MB = 1024 * 1024;

export const DEBUG = {
  tokenBalance: false,
  nftBalance: false,
  tokenPrice: false,
  tokenMetadata: false,
  nftCollection: false,
  addressAnalysis: false,
  contractName: false,
  assetStandard: false,
  ensResolve: false,
  ensLookup: false,

  cache: false,
};

// -------------------------------------
// GENERIC LOGGER
// -------------------------------------

export function debug(key, ...args) {
  if (DEBUG[key]) {
    console.log(...args);
  }
}

// -------------------------------------
// CACHE LOGGER
// -------------------------------------

export function debugCache(name, cacheInfo) {
  if (!DEBUG.cache) {
    return;
  }

  const { type, cache } = cacheInfo;

  console.log({
    cache: name,
    type,
    entries: cache.size,
    memoryMB: Number(
      (sizeof(cache.map ?? cache) / MB).toFixed(3)
    ),
  });
}

// -------------------------------------
// CACHE STATS
// -------------------------------------

export function getCacheStats(caches) {
  let totalEntries = 0;
  let totalMemory = 0;

  let totalHits = 0;
  let totalMisses = 0;

  const items = [];

  for (const [name, cacheInfo] of Object.entries(caches)) {
    const {
      type,
      description,
      cache,
    } = cacheInfo;

    const map = cache?.map ?? cache;

    const entries = cache.size;
    const memoryMB = sizeof(map) / MB;

    totalEntries += entries;
    totalMemory += memoryMB;

    const capacity =
      cache?.limit ?? null;

    const stats =
      CACHE_STATS[name] ?? {
        hits: 0,
        misses: 0,
      };

    const lookups =
      stats.hits + stats.misses;

    const hitRate =
      lookups === 0
        ? 0
        : Number(
            (
              (stats.hits / lookups) *
              100
            ).toFixed(2)
          );

    totalHits += stats.hits;
    totalMisses += stats.misses;

    items.push({
      name,
      type,
      description,
      entries,
      memoryMB: Number(
        memoryMB.toFixed(3)
      ),
      capacity,
      utilization:
        capacity !== null
          ? Number(
              (
                (entries / capacity) *
                100
              ).toFixed(2)
            )
          : null,

      hits: stats.hits,
      misses: stats.misses,
      hitRate,
    });
  }

  const mem = process.memoryUsage();

  const processMemory = {
    rssMB: Number(
      (mem.rss / MB).toFixed(2)
    ),
    heapUsedMB: Number(
      (mem.heapUsed / MB).toFixed(2)
    ),
    heapTotalMB: Number(
      (mem.heapTotal / MB).toFixed(2)
    ),
    externalMB: Number(
      (mem.external / MB).toFixed(2)
    ),
    arrayBuffersMB: Number(
      (mem.arrayBuffers / MB).toFixed(2)
    ),
  };

  const cacheHeapPercent =
    mem.heapUsed === 0
      ? 0
      : Number(
          (
            (totalMemory /
              (mem.heapUsed / MB)) *
            100
          ).toFixed(2)
        );

  const totalLookups =
    totalHits + totalMisses;

  const overallHitRate =
    totalLookups === 0
      ? 0
      : Number(
          (
            (totalHits /
              totalLookups) *
            100
          ).toFixed(2)
        );

  return {
    process: processMemory,

    cache: {
      summary: {
        entries: totalEntries,
        memoryMB: Number(
          totalMemory.toFixed(3)
        ),
        heapPercent:
          cacheHeapPercent,

        hits: totalHits,
        misses: totalMisses,
        hitRate: overallHitRate,
      },

      items,
    },
  };
}

// -------------------------------------
// ALL CACHE LOGGER
// -------------------------------------

export function debugCaches(caches) {
  if (!DEBUG.cache) {
    return;
  }

  const stats =
    getCacheStats(caches);

  // Cache Inventory
  console.table(
    stats.cache.items.map(
      ({
        name,
        type,
        entries,
        memoryMB,
      }) => ({
        Cache: name,
        Type: type,
        Entries: entries,
        "Memory (MB)": memoryMB,
      })
    )
  );

  console.log("");

  // Cache Summary
  console.log("Cache Summary");

  console.table([
    {
      Entries:
        stats.cache.summary.entries,
      "Memory (MB)":
        stats.cache.summary.memoryMB,
      "Heap Usage":
        `${stats.cache.summary.heapPercent}%`,
      Hits:
        stats.cache.summary.hits,
      Misses:
        stats.cache.summary.misses,
      "Hit Rate":
        `${stats.cache.summary.hitRate}%`,
    },
  ]);

  console.log("");

  // Process Memory
  console.log("Process Memory");

  console.table([
    {
      RSS:
        `${stats.process.rssMB} MB`,
      "Heap Used":
        `${stats.process.heapUsedMB} MB`,
      "Heap Total":
        `${stats.process.heapTotalMB} MB`,
      External:
        `${stats.process.externalMB} MB`,
      "Array Buffers":
        `${stats.process.arrayBuffersMB} MB`,
    },
  ]);

  console.log("");

  // Cache Efficiency
  console.log("Cache Efficiency");
  
  console.table(
    stats.cache.items
      .filter(
        (item) =>
          !["Scan", "Providers", "InFlight"].includes(item.name)
      )
      .map((item) => ({
        Cache: item.name,
        Description:
          item.description,
        Usage:
          `${item.entries}/${item.capacity}`,
        Utilization:
          `${item.utilization}%`,
        Hits: item.hits,
        Misses: item.misses,
        "Hit Rate":
          `${item.hitRate}%`,
      }))
  );
}