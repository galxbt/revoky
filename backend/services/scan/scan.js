// backend/services/scan/scan.js

import blockscout from "../providers/blockscout.js";
import { getLatestBlock } from "../../utils/provider.js";

import { 
  getScanCache, 
  setScanCache,
} from "./cache.js";


import {
  approvalKey,
  mergeApprovals,
} from "./merge.js";

import {
  dedupeErc20Logs,
  dedupeErc721Logs,
  dedupeApprovalForAllLogs,
} from "./dedupe.js";

import {
  verifyErc20Batch,
  verifyErc721Batch,
  verifyApprovalForAllBatch,
} from "./verify.js";

// -------------------------------------
// PROVIDERS
// -------------------------------------

const PROVIDERS = {
  blockscout,
};

// -------------------------------------
// CONFIG
// -------------------------------------

const DEFAULT_PROVIDER =
  process.env.APPROVAL_PROVIDER ||
  "blockscout";

if (!(DEFAULT_PROVIDER in PROVIDERS)) {
  throw new Error(
    `Unknown approval provider: ${DEFAULT_PROVIDER}`
  );
}

// -------------------------------------
// SCAN SINGLE CHAIN
// -------------------------------------

async function scanSingleChain({
  provider,
  chainKey,
  owner,
}) {
  const scanStarted =
    performance.now();

  try {
    // -----------------------------
    // CACHE
    // -----------------------------
    const cache =
      getScanCache({
        chainKey,
        owner,
      });
    
    const fromBlock =
      cache
        ? cache.lastScannedBlock + 1
        : 0;
    
    // -----------------------------
    // Provider
    // -----------------------------
    const providerStarted =
      performance.now();

    const result =
      await provider.scan({
        chainKey,
        owner,
        fromBlock,
      });

    console.log(
      `[PROVIDER COMPLETE] ${chainKey} (${(
        (performance.now() -
          providerStarted) /
        1000
      ).toFixed(2)}s)`
    );

    const latestBlock =
      await getLatestBlock(
        chainKey
      );
    
    switch (provider.stage) {
      case "logs": {
        // -----------------------------
        // Dedupe
        // -----------------------------
        const dedupeStarted =
          performance.now();

        const erc20Candidates =
          dedupeErc20Logs({
            chainKey,
            owner,
            logs:
              result.approvalLogs,
          });

        const erc721Candidates =
          dedupeErc721Logs({
            chainKey,
            owner,
            logs:
              result.approvalLogs,
          });

        const approvalForAllCandidates =
          dedupeApprovalForAllLogs({
            chainKey,
            owner,
            logs:
              result.approvalForAllLogs,
          });

        console.log(
          `[DEDUPE COMPLETE] ${chainKey} (${(
            (performance.now() -
              dedupeStarted) /
            1000
          ).toFixed(2)}s)`
        );

        // -----------------------------
        // Verify
        // -----------------------------
        const verifyStarted =
          performance.now();

        const [
          erc20Approvals,
          erc721Approvals,
          approvalForAllApprovals,
        ] = await Promise.all([
          verifyErc20Batch(
            erc20Candidates
          ),
        
          verifyErc721Batch(
            erc721Candidates
          ),
        
          verifyApprovalForAllBatch(
            approvalForAllCandidates
          ),
        ]);

        console.log(
          `[VERIFY COMPLETE] ${chainKey} (${(
            (performance.now() -
              verifyStarted) /
            1000
          ).toFixed(2)}s)`
        );

        const approvals = [
          ...erc20Approvals,
          ...erc721Approvals,
          ...approvalForAllApprovals,
        ];

        const previousApprovals =
          cache?.approvals ?? [];

        const verifiedMap =
          new Map(
            approvals.map((approval) => [
              approvalKey(approval),
              approval,
            ])
          );
        
        const candidateKeys = new Set();

        for (const candidate of erc20Candidates) {
          candidateKeys.add(
            approvalKey({
              assetAddress:
                candidate.assetAddress,
              spender:
                candidate.spender,
              approvalScope:
                "fungible",
              tokenId: null,
            })
          );
        }
        
        for (const candidate of erc721Candidates) {
          candidateKeys.add(
            approvalKey({
              assetAddress:
                candidate.assetAddress,
              spender:
                candidate.spender,
              approvalScope:
                "single",
              tokenId:
                candidate.tokenId,
            })
          );
        }
        
        for (const candidate of approvalForAllCandidates) {
          candidateKeys.add(
            approvalKey({
              assetAddress:
                candidate.assetAddress,
              spender:
                candidate.spender,
              approvalScope:
                "collection",
              tokenId: null,
            })
          );
        }

        const removedKeys = [];

        for (const key of candidateKeys) {
          if (!verifiedMap.has(key)) {
            removedKeys.push(key);
          }
        }

        const mergedApprovals =
          mergeApprovals({
            previousApprovals,
            newApprovals: approvals,
            removedKeys,
          });
        
        setScanCache({
          chainKey,
          owner,
          approvals:
            mergedApprovals,
          lastScannedBlock:
            latestBlock,
        });
        
        return mergedApprovals;
      }

      case "events": {
        // Future:
        // Goldsky
        // Envio
        // Subsquid

        throw new Error(
          "Events provider not implemented."
        );
      }

      case "approvals": {
        // Future:
        // GoldRush

        return result.approvals;
      }

      default:
        throw new Error(
          `Unknown provider stage: ${provider.stage}`
        );
    }

  } finally {
    console.log(
      `[SCAN COMPLETE] ${chainKey} (${(
        (performance.now() -
          scanStarted) /
        1000
      ).toFixed(2)}s)`
    );
  }
}

// -------------------------------------
// SCAN APPROVALS
// -------------------------------------

export async function scanApprovals({
  chainKey,
  owner,
}) {
  const provider =
    PROVIDERS[
      DEFAULT_PROVIDER
    ];

  // Scan all supported chains
  if (chainKey === "all") {
    const {
      supportedChains = [],
      concurrency = supportedChains.length,
    } = provider;

    console.log(
      `[SCAN START] All Chains (${supportedChains.length})`
    );

    const approvals = [];

    for (
      let i = 0;
      i < supportedChains.length;
      i += concurrency
    ) {
      const batch =
        supportedChains.slice(
          i,
          i + concurrency
        );

      batch.forEach((chain) =>
        console.log(
          `[SCAN START] ${chain}`
        )
      );

      const settled =
        await Promise.allSettled(
          batch.map((chain) =>
            scanSingleChain({
              provider,
              chainKey: chain,
              owner,
            })
          )
        );

      for (
        let j = 0;
        j < settled.length;
        j++
      ) {
        const result =
          settled[j];
        const chain =
          batch[j];

        if (
          result.status ===
          "fulfilled"
        ) {
          approvals.push(
            ...result.value
          );
        } else {
          console.error(
            `[SCAN FAILED] ${chain}`,
            result.reason.message
          );
        }
      }
    }

    return approvals;
  }

  // Scan a single chain
  console.log(
    `[SCAN START] ${chainKey}`
  );

  return scanSingleChain({
    provider,
    chainKey,
    owner,
  });
}