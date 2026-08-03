// backend/routes/approvals.js

import express from "express";
import { ethers } from "ethers";
import { scanApprovals } from "../services/scan/scan.js";

const router = express.Router();

// -------------------------------------
// GET /approvals
// -------------------------------------

router.get("/", async (req, res) => {
  const started = performance.now();
  
  try {
    const {
      address,
      chain,
    } = req.query;

    if (!address) {
      return res.status(400).json({
        error: "Missing address",
      });
    }

    if (!chain) {
      return res.status(400).json({
        error: "Missing chain",
      });
    }

    if (
      !ethers.isAddress(address)
    ) {
      return res.status(400).json({
        error:
          "Invalid wallet address",
      });
    }

    const approvals =
      await scanApprovals({
        chainKey: chain,
        owner: ethers.getAddress(
          address
        ),
      });

    res.json({
      success: true,
      chain,
      address: ethers.getAddress(address),
      count: approvals.length,
      approvals,
    });
  } catch (error) {
    console.error(
      "[Approvals]",
      error
    );

    res.status(500).json({
      success: false,
      error:
        error.message ||
        "Failed to scan approvals",
    });
  } finally {
    const seconds =
      (performance.now() - started) /
      1000;

    console.log(
      `[APPROVALS COMPLETE] (${seconds.toFixed(2)}s)`
    );
  }
});

export default router;