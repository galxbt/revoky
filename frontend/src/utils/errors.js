// frontend/src/utils/errors.js

export function isUserRejection(err) {
  const msg = (
    err?.message ||
    err?.error?.message ||
    err?.shortMessage ||
    ""
  ).toLowerCase();

  return (
    err?.code === 4001 ||
    err?.code === "ACTION_REJECTED" ||
    err?.info?.error?.code === 4001 ||
    msg.includes("rejected") ||
    msg.includes("denied")
  );
}