// backend/server.js

import "dotenv/config";

import express from "express";
import cors from "cors";

import approvalsRoute from "./routes/approvals.js";
import enrichRoute from "./routes/enrich.js";
import resolveRoute from "./routes/resolve.js";
import debugRoute from "./routes/debug.js";

// -------------------------------------
// CONFIG
// -------------------------------------

const PORT = process.env.PORT || 3000;

const app = express();

// -------------------------------------
// MIDDLEWARE
// -------------------------------------

app.use(cors());

app.use(
  express.json({
    limit: "5mb",
  })
);

// -------------------------------------
// HEALTH CHECK
// -------------------------------------

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Revoky Backend",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------
// ROUTES
// -------------------------------------

app.use(
  "/approvals",
  approvalsRoute
);

app.use(
  "/enrich",
  enrichRoute
);

app.use(
  "/resolve",
  resolveRoute
);

app.use(
  "/debug",
  debugRoute
);

// -------------------------------------
// START SERVER
// -------------------------------------

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});