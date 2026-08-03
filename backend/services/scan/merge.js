// -------------------------------------
// HELPERS
// -------------------------------------

export function approvalKey(
  approval
) {
  return [
    approval.assetAddress.toLowerCase(),
    approval.spender.toLowerCase(),
    approval.approvalScope,
    approval.tokenId ?? "",
  ].join(":");
}

// -------------------------------------
// MERGE APPROVALS
// -------------------------------------

export function mergeApprovals({
  previousApprovals,
  newApprovals,
  removedKeys = [],
}) {
  const merged = new Map();

  // Existing approvals.
  for (const approval of previousApprovals) {
    merged.set(
      approvalKey(approval),
      approval
    );
  }

  // Remove approvals that were
  // explicitly revoked or replaced.
  for (const key of removedKeys) {
    merged.delete(key);
  }

  // New approvals overwrite existing
  // ones with the same identity.
  for (const approval of newApprovals) {
    merged.set(
      approvalKey(approval),
      approval
    );
  }

  return [...merged.values()];
}