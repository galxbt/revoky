// backend/services/walletRisk.js

export function buildWalletRisk(
  approvals = []
) {
  if (!approvals.length) {
    return {
      score: 0,
      level: "Low",
      label: "No Risk",
      action: "No active approvals",
      severity: "info",
      details: "No active approvals",
    };
  }

  let weightedScore = 0;
  let totalWeight = 0;
  let maxRiskScore = 0;
  let high = 0;
  let medium = 0;

  // Critical Approvals
  const criticalApprovals = [];

  for (const a of approvals) {
    const riskScore = Number(a.riskScore || 0);

    // Value Weight
    const weight = Math.max(1, Math.log10((a.valueAtRisk || 0) + 1) + 1);

    weightedScore += riskScore * weight;

    totalWeight += weight;

    maxRiskScore = Math.max(maxRiskScore, riskScore);

    if (a.risk === "High") {
      high++;
    }

    if (a.risk === "Medium") {
      medium++;
    }

    // Critical Logic
    const isCritical = a.addressType === "EOA" || a.isUnlimited || riskScore > 7;

    if (isCritical) {
      criticalApprovals.push(a);
    }
  }

  // Average Risk
  const avgScore = totalWeight ? weightedScore / totalWeight : 0;

  // Distribution Boost
  const highRatio = high / approvals.length;

  const mediumRatio = medium / approvals.length;

  const distributionBoost = Math.pow(highRatio, 1.2) * 0.2 + Math.pow(mediumRatio, 1) * 0.1;

  // Critical Risk
  let criticalAvgScore = 0;

  if (criticalApprovals.length > 0) {
    let criticalWeighted = 0;
    let criticalWeightSum = 0;

    for (const a of criticalApprovals) {
      const riskScore = Number(a.riskScore || 0);

      const weight = Math.max(1, Math.log10((a.valueAtRisk || 0) + 1) + 1);

      criticalWeighted += riskScore * weight;

      criticalWeightSum += weight;
    }

    criticalAvgScore = criticalWeightSum ? criticalWeighted / criticalWeightSum : 0;
  }

  // Core Score
  const normalizedAvg = avgScore / 15;
  
  const normalizedCritical = criticalAvgScore / 15;
  
  const normalizedMax = maxRiskScore / 15;
    
  const coreScore = normalizedAvg * 0.5 + normalizedCritical * 0.25 + normalizedMax * 0.25;

  // Final Score
  let finalScore = (coreScore + distributionBoost) * 100;

  finalScore = Math.min(Math.round(finalScore), 100);

  // Level Mapping
  let level = "Minimal";
  let color = "#22c55e";
  let label = "Minimal Risk";
  let action = "No immediate action — review approvals occasionally";
  let severity = "info";

  if (finalScore >= 85) {
    level = "Severe";
    color = "#dc2626";
    label = "Severe Risk";
    action = "Revoke high-risk approvals immediately";
    severity = "danger";
  }

  else if (finalScore >= 70) {
    level = "High";
    color = "#ef4444";
    label = "High Risk";
    action = "Review and revoke risky approvals now";
    severity = "warning";
  }

  else if (finalScore >= 50) {
    level = "Elevated";
    color = "#f97316";
    label = "Elevated Risk";
    action = "Reduce exposure by removing unnecessary approvals";
    severity = "warning";
  }

  else if (finalScore >= 30) {
    level = "Moderate";
    color = "#f59e0b";
    label = "Moderate Risk";
    action = "Monitor activity and clean up unused approvals";
    severity = "caution";
  }

  // Details
  const parts = [];

  if (high) {
    parts.push(`${high} high-risk`);
  }

  if (medium) {
    parts.push(`${medium} medium-risk`);
  }

  const criticalCount = criticalApprovals.length;

  if (criticalCount) {
    parts.push(
      `${criticalCount} critical approval${
        criticalCount > 1 ? "s" : ""
      }`
    );
  }

  return {
    score: finalScore,
    color,
    level,
    label,
    action,
    severity,
    details: parts.join(" + ") || "Minimal risk",
  };
}