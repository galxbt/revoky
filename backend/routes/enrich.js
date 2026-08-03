// backend/routes/enrich.js

import express from "express";
import { ethers } from "ethers";

import { ERC20_READ_ABI } from "../config/contracts.js";
import { getChain, getProvider } from "../utils/provider.js";
import { loadProtocolLabels } from "../utils/protocolLabels.js";
import { logCacheStats } from "../debug/cacheReport.js";

import { getAssetStandards } from "../services/assetStandard.js";
import { resolveIdentity } from "../services/identity.js";
import { buildRiskAnalysis } from "../services/riskEngine.js";
import { buildWalletRisk } from "../services/walletRisk.js";
import { analyzeAddresses } from "../services/analyze.js";

import {
  fetchTokenPrices,
  fetchTokenMetadataBatch,
  fetchTokenBalances,
  fetchNFTCollectionBatch,
  fetchNFTBalances,
} from "../services/blockchain.js";

const router = express.Router();

// -------------------------------------
// AGE HELPER
// -------------------------------------

function getAge(timestamp) {
  if (!Number.isFinite(timestamp)) {
    return {
      daysOld: 0,
      ageDisplay: "—",
    };
  }

  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 0) {
    return {
      daysOld: 0,
      ageDisplay: "—",
    };
  }

  const daysOld = Math.floor(seconds / 86400);

  return {
    daysOld,
    ageDisplay:
      seconds < 60
        ? `${seconds}s`
        : seconds < 3600
          ? `${Math.floor(seconds / 60)}m`
          : seconds < 86400
            ? `${Math.floor(seconds / 3600)}h`
            : `${daysOld}d`,
  };
}

// -------------------------------------
// TOKEN FILTER
// -------------------------------------

function isValidToken(item) {
  if (!item) {
    return false;
  }

  if (!item.assetAddress || !item.spender) {
    return false;
  }

  // Always keep known protocols
  if (item.isKnownProtocol) {
    return true;
  }

  // Always keep risky approvals
  if (item.isUnlimited || item.riskScore >= 7) {
    return true;
  }

  const symbol = item.symbol?.trim();
  const name = item.name?.trim();

  const hasMetadata =
    symbol &&
    symbol !== "UNK" &&
    name &&
    name !== "Unknown";

  const hasBalance = item.balance > 0;

  const hasPrice = item.price > 0;

  const hasValue = item.valueUSD > 0.01;

  // Keep anything with at least one useful signal
  return (
    hasMetadata ||
    hasBalance ||
    hasPrice ||
    hasValue
  );
}

// -------------------------------------
// NFT FILTER
// -------------------------------------

function isValidNFT(item) {
  if (!item) {
    return false;
  }

  if (!item.assetAddress || !item.spender) {
    return false;
  }

  if (
    item.approvalScope !== "single" &&
    item.approvalScope !== "collection"
  ) {
    return false;
  }

  // Never hide collection approvals
  if (item.approvalScope === "collection") {
    return true;
  }

  // Never hide known protocols
  if (item.isKnownProtocol) {
    return true;
  }

  // Never hide risky approvals
  if (item.riskScore >= 7) {
    return true;
  }

  const hasMetadata =
    item.name &&
    item.name !== "Unknown";

  const ownsNFT = item.balance > 0;

  const hasValue =
    item.nftExposureUSD > 0 ||
    item.valueUSD > 0;

  return (
    hasMetadata ||
    ownsNFT ||
    hasValue
  );
}

router.post("/", async (req, res) => {
  const started = performance.now();
  
  try {
    const protocols = loadProtocolLabels();

    const {
      address,
      chain,
      approvals = [],
    } = req.body;

    // -------------------------------------
    // FILTER
    // -------------------------------------

    const filtered = approvals.filter((a) => {
      const isNFT = a.assetType === "nft";

      if (!isNFT) {
        return true;
      }
      
      const zero = "0x0000000000000000000000000000000000000000";

      if (!a.spender || a.spender.toLowerCase() === zero) {

        return false;
      }

      return (
        a.approvalScope === "single" ||
        a.approvalScope === "collection"
      );
    });

    // -------------------------------------
    // GROUP BY CHAIN
    // -------------------------------------

    const approvalsByChain = {};

    for (const a of filtered) {
      const chainKey = a.chain || chain;

      if (!approvalsByChain[chainKey]) {
        approvalsByChain[chainKey] = [];
      }

      approvalsByChain[chainKey].push(a);
    }

    if ( Object.keys(approvalsByChain).length === 0 && chain !== "all") {
      approvalsByChain[chain] = [];
    }

    const results = [];
    const analysisMap = {};

    const identity = chain === "all"
      ? {
          ownerLabel: null,
          ensName: null,
          source: "all-chains",
        }
      : await resolveIdentity({
          address,
          chainKey: chain,
        });

    // -------------------------------------
    // PROCESS EACH CHAIN
    // -------------------------------------

    for (const [chainKey, list] of Object.entries(approvalsByChain)) {
      let provider;
      
      try {
        provider = getProvider(chainKey);
      } catch {
        continue;
      }

      // -------------------------------------
      // SPLIT TOKEN / NFTSTATE
      // -------------------------------------
 
      const erc20TokensSet = new Set();
      const nftContractsSet = new Set();
      const spendersSet = new Set();

      for (const a of list) {
        const isNFT = a.assetType === "nft";

        if (!isNFT && a.assetAddress) {
          erc20TokensSet.add(a.assetAddress.toLowerCase());
        }

        if (isNFT && a.assetAddress) {
          nftContractsSet.add(a.assetAddress.toLowerCase());
        }

        if (a.spender) {
          spendersSet.add(a.spender.toLowerCase());
        }
      }

      const erc20Tokens = [...erc20TokensSet].slice(0, 300);
      const nftContracts = [...nftContractsSet];
      const spenders = [...spendersSet];

      // -------------------------------------
      // FETCH DATA
      // -------------------------------------
    
      const [
        assetStandards,
        balances,
        prices,
        nftCollections,
        nftBalances,
        metadata,
        ] = await Promise.all([
          getAssetStandards(
            chainKey, 
            nftContracts
          ),
          fetchTokenBalances(
            address, 
            chainKey, 
            erc20Tokens
          ),
          fetchTokenPrices(
            chainKey,
            erc20Tokens
          ),
          fetchNFTCollectionBatch(
            chainKey,
            nftContracts
          ),
          fetchNFTBalances(
            address, 
            chainKey, 
            nftContracts
          ),
          fetchTokenMetadataBatch(
            provider,
            ERC20_READ_ABI,
            chainKey,
            erc20Tokens
          ),
        ]);
      
      const nftMap = {};

      if (nftCollections && typeof nftCollections === "object") {
        for (const[addr, c] of Object.entries(nftCollections)) {
          if (!addr || !c) {
            continue;
          }

          nftMap[addr.toLowerCase()] = {
            name: c.name,
            logo: c.logo || c.image || null,
            floorPrice: Number(c.floorPrice || 0),
          };
        }
      }

      // -------------------------------------
      // SPENDER ADDRESS ANALYSIS
      // -------------------------------------

      const spenderAnalysisMap =
        await analyzeAddresses({
          addresses: spenders,
          chainKey,
          provider,
        });

      // -------------------------------------
      // WALLET ADDRESS ANALYSIS
      // -------------------------------------

      const addressAnalysis =
        (
          await analyzeAddresses({
            addresses: [address],
            chainKey,
            provider,
          })
        )[address.toLowerCase()];
  
      analysisMap[chainKey] = {
        address,
        identity,
        addressAnalysis,
        spenderAnalysisMap,
      };

      // -------------------------------------
      // BUILD RESULTS
      // -------------------------------------
 
      const chain = getChain(chainKey);
 
      for (const a of list) {
        const token = a.assetAddress?.toLowerCase();

        const nftMeta = nftMap[token];

        let timestamp = null;

        if (a.blockTime) {
          if (typeof a.blockTime === "number") {
            timestamp = a.blockTime * 1000;
          } else if (/^\d+$/.test(a.blockTime)) {
            timestamp = Number(a.blockTime) * 1000;
          } else {
            timestamp = Date.parse(a.blockTime);
          }
        }

        const {
          daysOld,
          ageDisplay
        } = getAge(timestamp);

        const meta = metadata[token] || {
          symbol: "UNK",
          name: "Unknown",
          decimals: 18,
        };

        const decimals = Number(meta.decimals || 18);

        const isNFT = a.assetType === "nft";

        const assetStandard = isNFT
          ? assetStandards[token] || "Unknown"
          : "ERC-20";        

        let balance = 0;

        if (isNFT) {
          if (a.approvalScope === "single" && a.tokenId != null) {
            const normalizedTokenId = String(BigInt(a.tokenId));

            const owned = nftBalances[`${token}:${normalizedTokenId}`];

            balance = owned ? 1 : 0;
          }

          else {
            let owned = nftBalances[token?.toLowerCase()] || nftBalances[token];

            if (!owned) {
              owned = Object.keys(nftBalances || {}).some((key) =>
                key.toLowerCase().startsWith(`${token.toLowerCase()}:`)
              )
                ? 1 : 0;
            }

            balance = owned || 0;
          }

        } else {
          const balanceRaw = balances[token?.toLowerCase()] || balances[token] || "0";

          balance = Number(ethers.formatUnits( balanceRaw, decimals));
        }

        const allowance = isNFT
          ? balance
          : Number(ethers.formatUnits(a.rawAllowance || "0", decimals ));

        const effective = isNFT
          ? balance
          : Math.min(balance, allowance);

        let price = prices[token?.toLowerCase()] || prices[token] || 0;

        if (!price && [ "usdt", "usdc", "dai"].includes(meta.symbol?.toLowerCase())) {
          price = 1;
        }

        const nftFloor = Number(nftMeta?.floorPrice || 0);
        
        const nativePrice = prices[chain.native.priceKey] || 0;
        
        const nftExposureUSD = nftFloor * nativePrice;
  
        const nftUSD = nftExposureUSD * balance;

        const tokenExposureUSD = allowance * price;

        const tokenUSD = effective * price;

        const valueUSD = isNFT ? nftUSD : tokenUSD;

        const spender = a.spender?.toLowerCase();

        const analysis = spenderAnalysisMap[spender];

        const addressType = analysis?.addressType || "Unknown";

        const protocolLabel = protocols[spender] || null;

        const isKnownProtocol = !!protocolLabel;

        const isUnlimited = a.approvalScope === "collection"
          ? true : isNFT
          ? false : BigInt(a.rawAllowance || "0") === ethers.MaxUint256;

        const valueAtRisk = valueUSD;

        const {
          risk,
          score,
          reasons,
          explanation,
        } = buildRiskAnalysis({
          valueAtRisk,
          isUnlimited,
          addressType,
          isKnownProtocol,
          isProxy: analysis?.isProxy,
          proxyType: analysis?.proxyType,
          isClone: analysis?.isClone,
          cloneType: analysis?.cloneType,
          isAA: analysis?.isAA,
          isSmartWallet: analysis?.isSmartWallet,
          isDelegated: analysis?.isDelegated,
          daysOld,
          assetType: isNFT ? "nft" : "token",
        });

        const finalItem = {
          id: [
            chainKey,
            token,
            a.spender,
            a.approvalScope,
            a.tokenId || "All NFTs",
          ].join("-"),

          chain: chainKey,
          assetAddress: token,
          spender,

          ownerLabel: protocolLabel || null,
          isKnownProtocol,

          rawAllowance: a.rawAllowance,
          approvalScope: a.approvalScope || "fungible",
          approved: a.approved || null,
          txHash: a.txHash || null,
          blockNumber: a.blockNumber || null,
          blockTime: a.blockTime || null,
          tokenId: a.tokenId ?? null,
          
          assetLogo: isNFT ? nftMeta?.logo || null : null,
          symbol: isNFT ? nftMeta?.name || meta.symbol : meta.symbol,
          name: isNFT ? nftMeta?.name || meta.name : meta.name,

          decimals,
          balance,
          allowance,
          valueUSD,
          nftExposureUSD,
          tokenExposureUSD,
          price,

          daysOld,
          ageDisplay,

          isUnlimited,

          addressType,
          
          isProxy: analysis?.isProxy || false,
          proxyType: analysis?.proxyType || null,
          proxyConfidence: analysis?.proxyConfidence || "None",
          implementationAddress: analysis?.implementationAddress || null,
          adminAddress: analysis?.adminAddress || null,
          beaconAddress: analysis?.beaconAddress || null,
          isClone: analysis?.isClone || false,
          cloneType: analysis?.cloneType || null,
          cloneImplementation: analysis?.cloneImplementation || null,
          isAA: analysis?.isAA || false,
          isDelegated: analysis?.isDelegated || false,
          isSmartWallet: analysis?.isSmartWallet || false,

          assetType: isNFT ? "nft" : "token",
          assetStandard,

          risk,
          riskScore: score,
          reasons,
          riskExplanation: explanation,
        };

        const valid =
          finalItem.assetType === "nft"
            ? isValidNFT(finalItem)
            : isValidToken(finalItem);
        
        if (!valid) {
          continue;
        }
        
        results.push(finalItem);           
      }
    }
    
    const walletRisk = buildWalletRisk(results);

    // -------------------------------------
    // ENRICH FINAL
    // -------------------------------------
 
    const tokenCount = results.filter((x) => x.assetType === "token").length;
    
    const nftCount = results.filter((x) => x.assetType === "nft").length;
    
    console.log(
      [
        "🧹 ENRICH FINAL:",
        `received=${approvals.length}`,
        `final=${results.length}`,
        `filteredOut=${approvals.length - results.length}`,
        `tokens=${tokenCount}`,
        `nfts=${nftCount}`,
      ].join(" ")
    );

    // -------------------------------------
    // CACHE STATE
    // -------------------------------------
 
    logCacheStats();

    // -------------------------------------
    // RESPONSE
    // -------------------------------------
  
    res.json({
      approvals: results,
      analysis: analysisMap,
      walletRisk,
    });

  } catch (err) {
    console.error("❌ Enrich failed:", err);
    res.status(500).json({error: "Enrich failed"});
  } finally {
    const seconds =
      (performance.now() - started) /
      1000;
    
    console.log(
      `[ENRICH COMPLETE] (${seconds.toFixed(2)}s)`
    );
  }
});

export default router;