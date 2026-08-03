// frontend/src/config/chains.js

import ethIcon from "../assets/chains/ethereum.png";
import baseIcon from "../assets/chains/base.png";
import arbIcon from "../assets/chains/arbitrum.png";
import opIcon from "../assets/chains/optimism.png";
import polygonIcon from "../assets/chains/polygon.png";
import allIcon from "../assets/chains/all.png";

export const CHAINS = {
  all: {
    name: "All Chains",
    icon: allIcon,
  },

  ethereum: {
    name: "Ethereum",
    chainIdHex: "0x1",
    chainId: 1,
    symbol: "ETH",
    icon: ethIcon,
  },

  base: {
    name: "Base",
    chainIdHex: "0x2105",
    chainId: 8453,
    symbol: "ETH",
    icon: baseIcon,
  },

  arbitrum: {
    name: "Arbitrum",
    chainIdHex: "0xa4b1",
    chainId: 42161,
    symbol: "ETH",
    icon: arbIcon,
  },

  optimism: {
    name: "Optimism",
    chainIdHex: "0xa",
    chainId: 10,
    symbol: "ETH",
    icon: opIcon,
  },

  polygon: {
    name: "Polygon",
    chainIdHex: "0x89",
    chainId: 137,
    symbol: "MATIC",
    icon: polygonIcon,
  },
};