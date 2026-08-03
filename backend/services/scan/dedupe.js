// backend/services/scan/dedupe.js

import { ethers } from "ethers";

// -------------------------------------
// HELPERS
// -------------------------------------

function realTopicCount(log) {
  return log.topics.filter(
    (topic) =>
      topic !== null &&
      topic !== undefined
  ).length;
}

// -------------------------------------
// ERC20
// -------------------------------------

export function dedupeErc20Logs({
  chainKey,
  owner,
  logs,
}) {
  const latest = new Map();

  for (const log of logs) {
    if (realTopicCount(log) !== 3) {
      continue;
    }

    const assetAddress =
      ethers.getAddress(log.address);

    const spender =
      ethers.getAddress(
        "0x" +
          log.topics[2].slice(26)
      );

    const blockNumber = parseInt(
      log.blockNumber,
      16
    );

    const key =
      `${assetAddress}:${spender}`;

    const existing =
      latest.get(key);

    if (
      !existing ||
      blockNumber >
        existing.blockNumber
    ) {
      latest.set(key, {
        chainKey,

        owner,

        assetAddress,

        spender,

        txHash:
          log.transactionHash,

        blockNumber,

        blockTime:
          log.timeStamp
            ? Number(log.timeStamp)
            : null,
      });
    }
  }

  return [...latest.values()];
}

// -------------------------------------
// ERC721
// -------------------------------------

export function dedupeErc721Logs({
  chainKey,
  owner,
  logs,
}) {
  const latest = new Map();

  for (const log of logs) {
    if (realTopicCount(log) !== 4) {
      continue;
    }

    const assetAddress =
      ethers.getAddress(log.address);

    const spender =
      ethers.getAddress(
        "0x" +
          log.topics[2].slice(26)
      );

    const tokenId = BigInt(
      log.topics[3]
    ).toString();

    const blockNumber = parseInt(
      log.blockNumber,
      16
    );

    const key =
      `${assetAddress}:${tokenId}`;

    const existing =
      latest.get(key);

    if (
      !existing ||
      blockNumber >
        existing.blockNumber
    ) {
      latest.set(key, {
        chainKey,

        owner,

        assetAddress,

        tokenId,

        spender,

        txHash:
          log.transactionHash,

        blockNumber,

        blockTime:
          log.timeStamp
            ? Number(log.timeStamp)
            : null,
      });
    }
  }

  return [...latest.values()];
}

// -------------------------------------
// APPROVAL FOR ALL
// -------------------------------------

export function dedupeApprovalForAllLogs({
  chainKey,
  owner,
  logs,
}) {
  const latest = new Map();

  for (const log of logs) {
    const assetAddress =
      ethers.getAddress(log.address);

    const operator =
      ethers.getAddress(
        "0x" +
          log.topics[2].slice(26)
      );

    const blockNumber = parseInt(
      log.blockNumber,
      16
    );

    const key =
      `${assetAddress}:${operator}`;

    const existing =
      latest.get(key);

    if (
      !existing ||
      blockNumber >
        existing.blockNumber
    ) {
      latest.set(key, {
        chainKey,

        owner,

        assetAddress,

        spender: operator,

        txHash:
          log.transactionHash,

        blockNumber,

        blockTime:
          log.timeStamp
            ? Number(log.timeStamp)
            : null,
      });
    }
  }

  return [...latest.values()];
}