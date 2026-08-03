// backend/services/providers/blockscout.js

import { ethers } from "ethers";

import { getChainId } from "../../utils/provider.js";

import {
  APPROVAL_TOPIC0,
  APPROVAL_FOR_ALL_TOPIC0,
} from "../../config/contracts.js";

// -------------------------------------
// CONFIG
// -------------------------------------

const BLOCKSCOUT_BASE =
  "https://api.blockscout.com/v2/api";

const BLOCKSCOUT_API_KEY =
  process.env.BLOCKSCOUT_API_KEY;

if (!BLOCKSCOUT_API_KEY) {
  throw new Error(
    "Missing BLOCKSCOUT_API_KEY"
  );
}

// -------------------------------------
// HELPERS
// -------------------------------------

function ownerTopic(address) {
  return ethers.zeroPadValue(
    ethers.getAddress(address),
    32
  );
}

async function fetchLogs({
  chainKey,
  topic0,
  topic1,
  fromBlock = 0,
  toBlock = "latest",
}) {
  const chainId = getChainId(chainKey);

  const logs = [];

  let currentFromBlock = fromBlock;

  while (true) {
    const url = new URL(
      BLOCKSCOUT_BASE
    );

    url.searchParams.set(
      "module",
      "logs"
    );

    url.searchParams.set(
      "action",
      "getLogs"
    );

    url.searchParams.set(
      "chainid",
      String(chainId)
    );

    url.searchParams.set(
      "apikey",
      BLOCKSCOUT_API_KEY
    );

    url.searchParams.set(
      "fromBlock",
      String(currentFromBlock)
    );

    url.searchParams.set(
      "toBlock",
      String(toBlock)
    );

    if (topic0) {
      url.searchParams.set(
        "topic0",
        topic0
      );
    }

    if (topic1) {
      url.searchParams.set(
        "topic1",
        topic1
      );

      url.searchParams.set(
        "topic0_1_opr",
        "and"
      );
    }

    const response = await fetch(
      url.toString()
    );

    if (!response.ok) {
      throw new Error(
        `Blockscout request failed (${response.status})`
      );
    }

    const json = await response.json();

    if (json.status !== "1") {
      const message = (
        json.message || ""
      ).toLowerCase();
      
      if (
        message.includes("no records") ||
        message.includes("no logs")
      ) {
        break;
      }      

      throw new Error(
        `Blockscout error: ${
          json.message ||
          "Unknown error"
        }`
      );
    }

    const batch = json.result || [];

    logs.push(...batch);

    if (batch.length < 1000) {
      break;
    }

    const lastBlock = parseInt(
      batch[
        batch.length - 1
      ].blockNumber,
      16
    );

    currentFromBlock =
      lastBlock + 1;
  }

  return logs;
}

async function fetchApprovalLogs({
  chainKey,
  owner,
  fromBlock = 0,
}) {
  return fetchLogs({
    chainKey,
    topic0: APPROVAL_TOPIC0,
    topic1: ownerTopic(owner),
    fromBlock,
  });
}

async function fetchApprovalForAllLogs({
  chainKey,
  owner,
  fromBlock = 0,
}) {
  return fetchLogs({
    chainKey,
    topic0: APPROVAL_FOR_ALL_TOPIC0,
    topic1: ownerTopic(owner),
    fromBlock,
  });
}

// -------------------------------------
// PROVIDER
// -------------------------------------

export default {
  name: "blockscout",
  stage: "logs",

  // Maximum chains to scan concurrently.
  concurrency: 2,

  // Chains currently supported by this provider.
  supportedChains: [
    "ethereum",
    "base",
    "polygon",
    "arbitrum",
    "optimism",
  ],

  async scan({
    chainKey,
    owner,
    fromBlock = 0,
  }) {
    const [
      approvalLogs,
      approvalForAllLogs,
    ] = await Promise.all([
      fetchApprovalLogs({
        chainKey,
        owner,
        fromBlock,
      }),

      fetchApprovalForAllLogs({
        chainKey,
        owner,
        fromBlock,
      }),
    ]);

    return {
      approvalLogs,
      approvalForAllLogs,
    };
  },
};