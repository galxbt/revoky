// frontend/src/components/layout/WalletOverview.jsx

export default function WalletOverview({
  isDark,
  config,
  children,
}) {
  const {
    padding,
    gap,
  } = config;
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding,
        gap,
        borderRadius: 14,       
        background: isDark ? "#1e293b" : "#f3f4f6",
      }}
    >
      {children}
    </div>
  );
}