// backend/services/identity.js

import { lookupENS } from "./ens.js";

export async function resolveIdentity({
  address,
  chainKey,
  protocolLabel = null,
}) {
  // Protocol label priority 
  if (protocolLabel) {
    return {
      ownerLabel: protocolLabel,
      ensName: null,
      source: "protocol",
    };
  }

  // ENS lookup
  const ensName = await lookupENS(
    address,
    chainKey
  );

  return {
    ownerLabel: ensName,
    ensName,
    source: ensName ? "ens" : "address",
  };
}