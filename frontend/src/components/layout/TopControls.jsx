// frontend/src/components/layout/TopControls.jsx

export default function TopControls({
  config,
  children,
}) {
  const {
    gap,
  } = config;
  
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        gap,
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}