// frontend/src/utils/renderValue.jsx

import React from "react";
import { Shimmer } from "@/components/approvals";

export function renderValue(value, width = 70) {
  if (value === undefined || value === null || value === "") {
    return (
      <Shimmer
        width={`${width}px`}
        height={12}
      />
    );
  }

  return value;
}