// frontend/src/utils/list.js

export function safeMap(list, render, getKey) {
  if (!Array.isArray(list)) return null;

  return list.map((item, index) => {
    const key =
      getKey?.(item, index) ??
      item?.id ??
      item?.key ??
      `${index}-${JSON.stringify(item).slice(0, 20)}`;

    if (import.meta.env.DEV && (key === undefined || key === null)) {
      console.warn("⚠️ Missing key for item:", item);
    }

    return render(item, key, index);
  });
}