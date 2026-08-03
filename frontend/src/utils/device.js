// frontend/src/utils/device.js

export const isLowEnd = (() => {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency || 0;
  return cores > 0 && cores <= 4;
})();