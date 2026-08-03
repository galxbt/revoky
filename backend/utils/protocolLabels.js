// backend/utils/protocolLabels.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const datasetPath = path.join(__dirname, "../config/protocolDataset.json");
const dataset = JSON.parse(fs.readFileSync(datasetPath, "utf8"));

let protocolMap = null;

export function loadProtocolLabels() {
  if (protocolMap) {
    return protocolMap;
  }

  protocolMap = {};

  for (const entry of dataset) {
    protocolMap[entry.address.toLowerCase()] = entry.name;
  }

  return protocolMap;
}