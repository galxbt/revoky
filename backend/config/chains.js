// backend/config/chains.js

const ALCHEMY_KEY = process.env.ALCHEMY_API_KEY;

export const CHAINS = {
  ethereum: {
    chainId: 1,
    rpc: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    nft: `https://eth-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_KEY}`,
    
    native: {
      network: "eth-mainnet",
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      priceKey: "ethereum",
    },
  },

  base: {
    chainId: 8453,
    rpc: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    nft: `https://base-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_KEY}`,
    
    native: {
      network: "base-mainnet",
      address: "0x4200000000000000000000000000000000000006",
      priceKey: "ethereum",
    },
  },

  arbitrum: {
    chainId: 42161,
    rpc: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    nft: `https://arb-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_KEY}`,
    
    native: {
      network: "arb-mainnet",
      address: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
      priceKey: "ethereum",
    },
  },

  optimism: {
    chainId: 10,
    rpc: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    nft: `https://opt-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_KEY}`,
 
    native: {
      network: "opt-mainnet",
      address: "0x4200000000000000000000000000000000000006",
      priceKey: "ethereum",
    },
  },

  polygon: {
    chainId: 137,
    rpc: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    nft: `https://polygon-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_KEY}`,
    
    native: {
      network: "polygon-mainnet",
      address: "0x0000000000000000000000000000000000001010",
      priceKey: "polygon",
    },
  },
};