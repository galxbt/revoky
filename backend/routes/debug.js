// backend/routes/debug.js

import express from "express";

import { getCacheStats } from "../debug/cacheReport.js";

const router = express.Router();

// -------------------------------------
// CACHE REPORT
// -------------------------------------

router.get("/cache", (req, res) => {
  res.json(getCacheStats());
});

export default router;