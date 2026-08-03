// frontend/src/utils/formatters.js

import { ethers } from "ethers";
import { truncateText } from "./helpers";

// -------------------------------------
// BALANCE FORMATTER
// -------------------------------------

export function formatBalance(a) {
  if (!Number.isFinite(a.balance)) {
    return "—";
  }

  // NFT
  if (a.assetType === "nft") {
    return Math.trunc(a.balance).toString();
  }

  // >= 1
  if (a.balance >= 1) {
    return a.balance.toFixed(2).replace(/\.?0+$/, "");
  }

  // < 1
  return a.balance.toFixed(4).replace(/\.?0+$/, "");
}

// -------------------------------------
// VALUE FORMATTER
// -------------------------------------

export function formatValue(value) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  let display;

  // Tiny
  if (value > 0 && value < 0.0001) {
    display = "< 0.0001";
  }

  // < 1
  else if (value < 1) {
    display = value.toFixed(4);
  }

  // 1 → 999
  else if (value < 1000) {
    display = value.toFixed(2);
  }

  // Large
  else {
    display = value.toLocaleString(
      undefined,
      { maximumFractionDigits: 2 }
    );
  }

  // Remove trailing zeros
  if (display.includes(".")) {
    display = display.replace(/\.?0+$/, "");
  }

  return `$${display}`;
}

// -------------------------------------
// NFT ALLOWANCE FORMATTER
// -------------------------------------

export function formatNftAllowance(a) {
  if (a.approvalScope === "collection") {
    return "All NFTs";
  }

  if (a.tokenId) {
    return `#${a.tokenId}`;
  }

  return "Single NFT";
}

// -------------------------------------
// TOKEN ALLOWANCE FORMATTER
// -------------------------------------

export function formatAllowance(a) {
  try {
    if (!a.rawAllowance || a.rawAllowance === "0") { 
      return "0"; 
    }

    const decimals = Number(a.decimals || 18);

    const formatted = Number(ethers.formatUnits(a.rawAllowance, decimals));

    // Tiny values
    if (formatted > 0 && formatted < 0.0001) {
      return `< 0.0001 ${a.symbol}`;
    }

    // Huge values
    if (formatted > 999_999_999_999) {
      return `> 999.99B ${a.symbol}`;
    }

    // Billions
    if (formatted >= 1_000_000_000) {
      return `${(formatted / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "")}B ${a.symbol}`;
    }

    // Millions
    if (formatted >= 1_000_000) {
      return `${(formatted / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M ${a.symbol}`;
    }

    // Normal values
    let display;

    // < 1
    if (formatted < 1) {
      display = formatted.toFixed(4);
    }

    // 1 → 999
    else if (formatted < 1000) {
      display = formatted.toFixed(2);
    }

    // Large normal values
    else {
      display = formatted.toLocaleString(
        undefined,
        { maximumFractionDigits: 2 }
      );
    }

    // Remove trailing zeros
    if (display.includes(".")) {
      display = display.replace(/\.?0+$/, "");
    }

    return `${display} ${a.symbol}`;

  } catch {
    return "0";
  }
}

// -------------------------------------
// // DISPLAY ALLOWANCE FORMATTER
// -------------------------------------

export function formatDisplayAllowance(value) {
  const [num, sym] = (value || "").split(" ");

  return sym
    ? `${num} ${truncateText(sym, 6)}`
    : value;
}