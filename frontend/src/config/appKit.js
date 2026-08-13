// frontend/src/config/appKit.js

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";

import {
  mainnet,
  base,
  arbitrum,
  optimism,
  polygon,
} from "@reown/appkit/networks";

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "VITE_REOWN_PROJECT_ID is not defined."
  );
}

const networks = [
  mainnet,
  base,
  arbitrum,
  optimism,
  polygon,
];

const metadata = {
  name: "Revoky",
  description: "Wallet Risk Intelligence Layer for Web3",
  url: window.location.origin,
  icons: [],
};

export const appKit = createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false,
  },
});