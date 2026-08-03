// backend/services/scan/verify.js

import { ethers } from "ethers";

import { getProvider } from "../../utils/provider.js";

import {
  executeMulticall,
  safeDecode,
} from "../../utils/multicall.js";

import {
  ERC20_READ_ABI,
  NFT_READ_ABI,
  MAX_UINT256,
  UNLIMITED_THRESHOLD,
} from "../../config/contracts.js";

// -------------------------------------
// INTERFACES
// -------------------------------------

const erc20Interface =
  new ethers.Interface(
    ERC20_READ_ABI
  );

const nftInterface =
  new ethers.Interface(
    NFT_READ_ABI
  );

// -------------------------------------
// HELPERS
// -------------------------------------

function getBatchProvider(
  candidates
) {
  if (!candidates.length) {
    return null;
  }

  return getProvider(
    candidates[0].chainKey
  );
}

function normalizeAddress(
  address
) {
  return address?.toLowerCase();
}

// -------------------------------------
// VERIFY ERC20 APPROVALS
// -------------------------------------

export async function verifyErc20Batch(
  candidates
) {
  if (!candidates.length) {
    return [];
  }

  const provider =
    getBatchProvider(
      candidates
    );

  if (!provider) {
    return [];
  }

  const calls = [];

  for (const candidate of candidates) {
    calls.push({
      target:
        candidate.assetAddress,

      callData:
        erc20Interface.encodeFunctionData(
          "allowance",
          [
            candidate.owner,
            candidate.spender,
          ]
        ),
    });
  }

  let results;

  try {
    results =
      await executeMulticall(
        provider,
        calls
      );

  } catch (error) {
    console.warn(
      `[ERC20 BATCH] ${error.message}`
    );

    return [];
  }

  const approvals = [];

  let i = 0;

  for (const candidate of candidates) {
    const allowance =
      safeDecode(
        erc20Interface,
        "allowance",
        results[i++]
      );

    // Call failed
    if (allowance == null) {
      continue;
    }

    // Approval revoked
    if (allowance === 0n) {
      continue;
    }

    const isUnlimited =
      allowance === MAX_UINT256 ||
      allowance >=
        UNLIMITED_THRESHOLD;

    approvals.push({
      chain:
        candidate.chainKey,

      assetType:
        "token",

      approvalScope:
        "fungible",

      assetAddress:
        candidate.assetAddress,

      spender:
        candidate.spender,

      tokenId:
        null,

      rawAllowance:
        allowance.toString(),

      isUnlimited,

      txHash:
        candidate.txHash,

      blockNumber:
        candidate.blockNumber,

      blockTime:
        candidate.blockTime,
    });
  }

  return approvals;
}

// -------------------------------------
// VERIFY ERC721 APPROVALS
// -------------------------------------

export async function verifyErc721Batch(
  candidates
) {
  if (!candidates.length) {
    return [];
  }

  const provider =
    getBatchProvider(
      candidates
    );

  if (!provider) {
    return [];
  }

  const calls = [];

  for (const candidate of candidates) {
    // getApproved(tokenId)
    calls.push({
      target:
        candidate.assetAddress,

      callData:
        nftInterface.encodeFunctionData(
          "getApproved",
          [candidate.tokenId]
        ),
    });

    // ownerOf(tokenId)
    calls.push({
      target:
        candidate.assetAddress,

      callData:
        nftInterface.encodeFunctionData(
          "ownerOf",
          [candidate.tokenId]
        ),
    });
  }

  let results;

  try {
    results =
      await executeMulticall(
        provider,
        calls
      );
  } catch (error) {
    console.warn(
      `[ERC721 BATCH] ${error.message}`
    );

    return [];
  }

  const approvals = [];

  let i = 0;

  for (const candidate of candidates) {
    const approved =
      safeDecode(
        nftInterface,
        "getApproved",
        results[i++]
      );

    const owner =
      safeDecode(
        nftInterface,
        "ownerOf",
        results[i++]
      );

    // Either call failed
    if (
      approved == null ||
      owner == null
    ) {
      continue;
    }

    // NFT transferred away
    if (
      normalizeAddress(owner) !==
      normalizeAddress(
        candidate.owner
      )
    ) {
      continue;
    }

    // Approval revoked or changed
    if (
      normalizeAddress(
        approved
      ) !==
      normalizeAddress(
        candidate.spender
      )
    ) {
      continue;
    }

    approvals.push({
      chain:
        candidate.chainKey,

      assetType:
        "nft",

      approvalScope:
        "single",

      assetAddress:
        candidate.assetAddress,

      spender:
        candidate.spender,

      tokenId:
        candidate.tokenId,

      rawAllowance:
        null,

      isUnlimited:
        false,

      txHash:
        candidate.txHash,

      blockNumber:
        candidate.blockNumber,

      blockTime:
        candidate.blockTime,
    });
  }

  return approvals;
}

// -------------------------------------
// VERIFY APPROVAL FOR ALL
// -------------------------------------

export async function verifyApprovalForAllBatch(
  candidates
) {
  if (!candidates.length) {
    return [];
  }

  const provider =
    getBatchProvider(
      candidates
    );

  if (!provider) {
    return [];
  }

  const calls = [];

  for (const candidate of candidates) {
    calls.push({
      target:
        candidate.assetAddress,

      callData:
        nftInterface.encodeFunctionData(
          "isApprovedForAll",
          [
            candidate.owner,
            candidate.spender,
          ]
        ),
    });
  }

  let results;

  try {
    results =
      await executeMulticall(
        provider,
        calls
      );
  } catch (error) {
    console.warn(
      `[APPROVAL_FOR_ALL BATCH] ${error.message}`
    );

    return [];
  }

  const approvals = [];

  let i = 0;

  for (const candidate of candidates) {
    const approved =
      safeDecode(
        nftInterface,
        "isApprovedForAll",
        results[i++]
      );

    // Call failed
    if (approved == null) {
      continue;
    }

    // Approval revoked
    if (!approved) {
      continue;
    }

    approvals.push({
      chain:
        candidate.chainKey,

      assetType:
        "nft",

      approvalScope:
        "collection",

      assetAddress:
        candidate.assetAddress,

      spender:
        candidate.spender,

      tokenId:
        null,

      rawAllowance:
        null,

      isUnlimited:
        true,

      txHash:
        candidate.txHash,

      blockNumber:
        candidate.blockNumber,

      blockTime:
        candidate.blockTime,
    });
  }

  return approvals;
}