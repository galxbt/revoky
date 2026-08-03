// frontend/src/components/layout/InfiniteScrollLoader.jsx

export default function InfiniteScrollLoader({
  visibleCount,
  totalCount,
  loadMoreRef,
  config,
}) {
  const hasMore = visibleCount < totalCount;

  if (!hasMore) {
    return null;
  }

  return (
    <>
      {/* INFINITE SCROLL TRIGGER */}
      <div
        ref={loadMoreRef}
        style={{ height: config.triggerHeight }}
      />

      {/* LOADING MORE */}
      {totalCount > 0 && (
        <div
          style={{
            textAlign: "center",
            padding: 16,
            marginBottom: 20,
            fontWeight: 600,
            opacity: 0.7,
          }}
        >
          ⏳ Loading more approvals...
        </div>
      )}
    </>
  );
}