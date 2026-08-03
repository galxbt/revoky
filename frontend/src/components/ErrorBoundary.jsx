// frontend/src/components/ErrorBoundary.jsx

import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("App crashed:", error, info);
    } else {
      // Optional: hook into external logging later (e.g. Sentry)
      // sendErrorToServer(error, info);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 12,
            textAlign: "center",
            padding: "20px"
          }}
        >
          <h2>Something went wrong ⚠️</h2>
          <p style={{ opacity: 0.7 }}>
            Revoky ran into an unexpected error.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "#2563eb",
              color: "#fff",
              fontWeight: 500
            }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}