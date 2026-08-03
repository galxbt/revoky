import { ethers } from "ethers";

import {
  MULTICALL3_ADDRESS,
  MULTICALL3_ABI,
} from "../config/contracts.js";

// -------------------------------------
// MULTICALL
// -------------------------------------

export async function executeMulticall(
  provider,
  calls,
) {
  const multicall = new ethers.Contract(
    MULTICALL3_ADDRESS,
    MULTICALL3_ABI,
    provider
  );

  const chunkSize = 150;

  let results = [];

  for (let i = 0; i < calls.length; i += chunkSize) {
    const chunk = calls.slice(i, i + chunkSize);

    const formatted = chunk.map((call) => ({
      target: call.target,
      allowFailure: true,
      callData: call.callData,
    }));

    const res = await multicall.aggregate3(formatted);

    results = results.concat(res);
  }

  return results;
}

// -------------------------------------
// SAFE DECODE
// -------------------------------------

export function safeDecode(
  iface,
  fn,
  result
) {
  try {
    if (!result?.success || result.returnData === "0x") {
      return null;
    }

    return iface.decodeFunctionResult(
      fn,
      result.returnData
    )[0];

  } catch {
    return null;
  }
}