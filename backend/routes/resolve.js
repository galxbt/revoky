// backend/routes/resolve.js

import express from "express";
import { resolveENSName } from "../services/ens.js";

const router = express.Router();

router.get(
  "/",
  async (req, res) => {
    try {
      const { name, chain } = req.query;

      if (!name) {
        return res.status(400).json({ 
          error: "Missing ENS name",
        });
      }

      const chainKey = chain || "ethereum";

      const resolved = await resolveENSName(
        name, chainKey
      );

      if (!resolved) {
        return res.json({
          address: null,
        });
      }

      res.json({
        address: resolved,
      });

    } catch {
      res.status(500).json({
        error: "ENS resolve failed",
      });
    }
  }
);

export default router;