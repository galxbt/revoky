// backend/services/riskEngine.js

export function calculateRisk(a) {
  let score = 0;
  const reasons = [];

  // Flags
  const isNFT = a.assetType === "nft";
  const isEOA = a.addressType === "EOA";
  const isContract = a.addressType === "Contract";
  const value = Number(a.valueAtRisk || 0);
  const isKnownProtocol = !!a.isKnownProtocol;
  const isProxy = !!a.isProxy;
  const proxyType = a.proxyType || null;
  const isClone = !!a.isClone;
  const cloneType = a.cloneType || null;
  const isAA = !!a.isAA;
  const isSmartWallet = !!a.isSmartWallet;
  const isDelegated = !!a.isDelegated;

  // Unlimited 
  if (a.isUnlimited) {
    score += 5;
    reasons.push({
      type: "approval",
      impact: 5,
      message: isNFT 
        ? "Full collection NFT access"
        : "Unlimited token spending",
    });
  }

  // Value Exposure
  if (value > 10000) {
    score += 5;
    reasons.push({
      type: "value",
      impact: 5,
      message: "Extremely high value exposure",
    });
  } else if (value > 2500) {
    score += 4;
    reasons.push({
      type: "value",
      impact: 4,
      message: "Very high value exposure",
    });
  } else if (value > 1000) {
    score += 3;
    reasons.push({
      type: "value",
      impact: 3,
      message: "High value exposure",
    });
  } else if (value > 250) {
    score += 2;
    reasons.push({
      type: "value",
      impact: 2,
      message: "Moderate value exposure",
    });
  } else if (value > 50) {
    score += 1;
    reasons.push({
      type: "value",
      impact: 1,
      message: "Low value exposure",
    });
  }

  // Age Factor 
  if (a.daysOld > 365) {
    score += 3;
    reasons.push({
      type: "age",
      impact: 3,
      message: "Very old approval",
    });
  } else if (a.daysOld > 180) {
    score += 2;
    reasons.push({
      type: "age",
      impact: 2,
      message: "Old approval",
    });
  } else if (a.daysOld > 30) {
    score += 1;
    reasons.push({
      type: "age",
      impact: 1,
      message: "Stale approval",
    });
  }

  // EOA
  if (isEOA) {
    score += 5;
    reasons.push({
      type: "eoa",
      impact: 5,
      message: "Approval granted to wallet address",
    });
  }

  // Delegated
  if (isDelegated) {
    score += 3;
    reasons.push({
      type: "delegated",
      impact: 3,
      message: "Delegated execution wallet",
    });
  }

  // Upgradeable Proxy
  if (isProxy) {
    score += 3;
    reasons.push({
      type: "proxy",
      impact: 3,
      message: proxyType
        ? `Upgradeable proxy (${proxyType})`
        : "Upgradeable proxy contract",
    });
  }

  // Minimal Proxy
  if (isClone) {
    score += 2;
    reasons.push({
      type: "clone",
      impact: 2,
      message: cloneType
        ? `Minimal proxy (${cloneType})`
        : "Minimal proxy contract",
    });
  }

  // Account Abstraction
  if (isAA) {
    score += 1;
    reasons.push({
      type: "aa",
      impact: 1,
      message: "Smart account execution",
    });
  }

  // Smart Wallet
  if (isSmartWallet && !isAA && !isDelegated) {
    score += 1;
    reasons.push({
      type: "smart-wallet",
      impact: 1,
      message: "Advanced smart wallet",
    });
  }

  // Standard Contract
  if (isContract && !isKnownProtocol && !isProxy && !isClone && !isSmartWallet) {
    score += 3;
    reasons.push({
      type: "contract",
      impact: 3,
      message: "Unknown contract",
    });
  }

  // Known Protocol 
  if (isKnownProtocol) {
    reasons.push({
      type: "known",
      category: "trust",
      impact: 0,
      message: "Known protocol",
    });
  }

  // Final Score
  score = Math.max(
    Math.min(score, 15),
    0
  );

  // Level
  let level = "Low";

  if (score >= 10) {
    level = "High";
  } else if (score >= 5) {
    level = "Medium";
  }

  return {
    level,
    score,
    reasons,
  };
}

export function getRiskExplanation(
  level,
  reasons = []
) {
  if (!reasons.length) {
    return ["Minimal risk detected"];
  }

  const negatives = reasons.filter((r) => r.impact > 0);

  const positives = reasons.filter((r) => r.category === "trust");

  // Highest risk first
  negatives.sort((a, b) => b.impact - a.impact);

  const lines = [];

  // Risks
  if (negatives.length) {
    negatives.slice(0, 4).forEach((r) => {
        lines.push(`⚠️ ${r.message}`);
    });
  }

  // Trust
  if (positives.length) {
    positives.forEach((r) => {
      lines.push(`🛡️ ${r.message}`);
    });
  }

  return lines;
}

export function buildRiskAnalysis(a) {
  const {
    level,
    score,
    reasons,
  } = calculateRisk(a);

  const explanation = getRiskExplanation(
    level,
    reasons
  );

  return {
    risk: level,
    score,
    reasons,
    explanation,
  };
}