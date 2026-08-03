// frontend/src/components/layout/ErrorMessage.jsx

export default function ErrorMessage({
  error,
  isDark,
}) {
  if (!error) {
    return null;
  }

  return (
    <p
      style={{
        textAlign: "center",
        color: isDark ? "#facc15" : "#b45309",
        marginTop: 15,
        transition: "opacity 0.4s ease",
      }}
    >
      {error}
    </p>
  );
}