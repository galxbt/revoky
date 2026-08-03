// frontend/src/utils/tokenLogos.js

import { ethers } from "ethers";

const CHAIN_MAP = {
  ethereum: "ethereum",
  polygon: "polygon",
  arbitrum: "arbitrum",
  optimism: "optimism",
  base: "base",
};

export function getTrustWalletLogo(chain, address) {
  const chainName = CHAIN_MAP[chain];
  if (!chainName) return null;
  try {
    const checksum = ethers.getAddress(address);
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainName}/assets/${checksum}/logo.png`;
  } catch {
    return null;
  }
}