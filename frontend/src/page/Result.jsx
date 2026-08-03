// frontend/src/page/Result.jsx

import { useEffect } from "react";
import { useAppContext } from "@/context/hooks";
import { useApprovalsState } from "@/hooks/useApprovalsState";
import { SkeletonCard } from "@/components";

import { 
  Mobile,
  Tablet,
  Desktop,
} from "./layouts";

export default function Result() {
  const { 
    ui, 
    wallet,
    flow,
  } = useAppContext();

  const { 
    screen, 
    isDark, 
    loading, 
    loadingTarget,
    hasScanned,
    isRefreshing,
    scanFailed,
  } = ui;
  
  const {
    connectSwitching,
  } = wallet; 
  
  const { 
    approvals,
  } = flow; 
  
  const {
    isSkeletonLoading,
    isFetchErrorState,
  } = useApprovalsState({
    approvals,
    loading,
    loadingTarget,
    isRefreshing,
    scanFailed,
  });

  const showWalletSafety =
    !isSkeletonLoading &&
    !isFetchErrorState;

  const headingStyle = {
    fontWeight: 600,
    marginBottom: 8,
    color: isDark ? "#808080" : undefined,
  };

  /* INJECT PULSE ANIMATION ONCE */
  useEffect(() => {
    if (document.getElementById("revoky-pulse-style")) return;

    const style = document.createElement("style");
    style.id = "revoky-pulse-style";

    style.innerHTML = `
      @keyframes revokyPulse {
        0%,100% { opacity:0.55; transform:scale(1); }
        50% { opacity:1; transform:scale(1.12); }
      }
    `;

    document.head.appendChild(style);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        opacity: loading ? 80 : 1,
        pointerEvents: loading || connectSwitching
          ? "none" : "auto",
        transition: "opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* MAIN RESULT */}
      {screen.isDesktop ? (
        <Desktop />
      ) : screen.isTablet ? (
        <Tablet />
      ) : (
        <Mobile />
      )}

      {/* SKELETON CARDS */}
      {isSkeletonLoading && (
        <div>
          {Array.from({
            length: screen.isDesktop ? 10
              : screen.isTablet ? 7 : 5,
          }).map((_, i) => (
            <SkeletonCard
              key={i}
              isDark={isDark}
            />
          ))}
        </div>
      )}

      {/* RESULT EXTRAS */}
      {hasScanned && (
        <div
          style={{
            marginTop: screen.isDesktop ? 30 : 20,
            marginBottom: 20,
            display: "flex",
            flexDirection: "column",
            gap: 30,
            alignItems: "center",
          }}
        >
          {/* WALLET SAFETY SECTION */}
          {showWalletSafety && (
            <div
              style={{
                width: "100%",
                marginTop: screen.isDesktop ? 40 : 0,
                padding: screen.isDesktop ? "40px 50px" : "28px 20px",
                borderRadius: 20,
                background: isDark ? "#1e293b" : "#f3f4f6",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              {/* Title */}
              <div
                style={{
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: screen.isDesktop ? 22 
                    : screen.isTablet ? 20 : 18,
                  marginBottom: 28,
                  color: "#4ca64c",
                }}
              >
                🛡 Wallet Safety Insight
              </div>
  
              {/* Responsive Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: screen.isDesktop ? "1fr 1fr 1fr"
                   : screen.isTablet ? "1fr 1fr" : "1fr",
                  gap: screen.isDesktop ? 40 : 24,
                  fontSize: screen.isDesktop ? 18 
                    : screen.isTablet ? 16 : 14,
                  lineHeight: screen.isDesktop ? 2.2
                    : screen.isTablet ? 2 : 1.6,
                  textAlign: screen.isDesktop ? "left" : "center",
               }}
             >
                {/* Column 1 */}
                <div>
                  <div style={headingStyle}>
                    Your Current Exposure
                  </div>
  
                  {approvals.length === 0 ? (
                    <>
                      No active approvals detected. Your wallet currently has no spending permissions granted to external spenders.
                    </>
                  ) : (
                    <>
                      You have <strong>{approvals.length}</strong> active approval
                      {approvals.length > 1 ? "s" : ""} across connected protocols.These permissions allow contracts or wallets to move assets without additional confirmation.
                    </>
                  )}
                </div>
  
                {/* Column 2 */}
                <div>
                  <div style={headingStyle}>
                    What Revoky Detected
                  </div>
  
                  {approvals.length === 0 ? (
                    <>
                      No risk signals found. Your wallet is currently in a clean state with minimal exposure.
                    </>
                  ) : (
                    <>
                      Revoky analyzes approvals using allowance size, value at risk, approval age, and contract/EOA behavior — highlighting risky permissions such as unlimited approvals and unknown contracts.
                    </>
                  )}
                </div>
  
                {/* Column 3 */}
                <div
                  style={{
                    gridColumn: screen.isTablet ? "1 / span 2" : "auto",
                    textAlign: "center",
                    maxWidth: screen.isTablet ? 420 : "none",
                    margin: "0 auto",
                  }}
                >
                  <div style={headingStyle}>
                    Recommended Action
                  </div>
  
                  {approvals.length === 0 ? (
                    <>
                      No action needed. Continue practicing safe interactions and review approvals periodically.
                    </>
                  ) : (
                    <>
                      Review high-risk and unused approvals, especially those with unlimited access or high value exposure. Revoke anything you no longer trust or use.
                    </>
                  )}
                </div>
              </div>
            </div>
          )}          

          {/* WEB3 NETWORK ILLUSTRATION */}
          {!isFetchErrorState && (
            <div 
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: screen.isDesktop ? 260 
                  : screen.isTablet ? 180 : 120,
                marginTop: screen.isDesktop ? 10 : 0,
              }}
            >
              <svg
                width="200"
                height="120"
                viewBox="0 0 200 120"
                fill="none"
                style={{
                  opacity: 0.8,
                  transform: screen.isDesktop ? "scale(2)"
                    : screen.isTablet ? "scale(1.5)" : "scale(1)",
                  transformOrigin: "center",
                  filter: screen.isDesktop
                    ? "drop-shadow(0 10px 25px rgba(59,130,246,0.25))"
                    : "none",
                }}
              >
                {/* Connection Lines */}
                <g stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.6">
                  <line x1="100" y1="10" x2="40" y2="40" />
                  <line x1="100" y1="10" x2="160" y2="40" />
                  <line x1="40" y1="40" x2="20" y2="80" />
                  <line x1="160" y1="40" x2="180" y2="80" />
                  <line x1="20" y1="80" x2="100" y2="110" />
                  <line x1="180" y1="80" x2="100" y2="110" />
                  <line x1="40" y1="40" x2="100" y2="110" />
                  <line x1="160" y1="40" x2="100" y2="110" />
                </g>
  
                {/* Signal Animation */}
                <g stroke="#3b82f6" strokeWidth="3" strokeLinecap="round">
                  <line x1="100" y1="10" x2="40" y2="40">
                    <animate attributeName="stroke-dashoffset" values="40;0" dur="2s" repeatCount="indefinite"/>
                  </line>
                </g>
  
                {/* Nodes */}
                <g>
                  <circle cx="100" cy="10" r="5" fill="#3b82f6" style={{animation:"revokyPulse 3s infinite"}}/>
                  <circle cx="40" cy="40" r="4" fill="#8b5cf6" style={{animation:"revokyPulse 3s infinite 0.4s"}}/>
                  <circle cx="160" cy="40" r="4" fill="#06b6d4" style={{animation:"revokyPulse 3s infinite 0.6s"}}/>
                  <circle cx="20" cy="80" r="4" fill="#22c55e" style={{animation:"revokyPulse 3s infinite 0.8s"}}/>
                  <circle cx="180" cy="80" r="4" fill="#f59e0b" style={{animation:"revokyPulse 3s infinite 1s"}}/>
                  <circle cx="100" cy="110" r="4" fill="#ef4444" style={{animation:"revokyPulse 3s infinite 1.2s"}}/>

                  {/* middle nodes */}
                  <circle cx="75" cy="60" r="3" fill="#10b981" style={{animation:"revokyPulse 3s infinite 1.4s"}}/>
                  <circle cx="125" cy="60" r="3" fill="#a855f7" style={{animation:"revokyPulse 3s infinite 1.6s"}}/>
                </g>
              </svg>
            </div>
          )}

          {/* REVOKY BRAND MESSAGE */}
          {!isFetchErrorState && (          
            <div
              style={{
                fontSize: screen.isDesktop ? 18
                  : screen.isTablet ? 15 : 13,
                textAlign: "center",
                lineHeight: 1.7,
                opacity: 0.75,
              }}
            >
              Revoky helps protect your wallet by identifying risky asset approvals across multiple chains.
              <br />
              Built to make Web3 safer.
            </div>
           )}           
        </div>
      )}

    </div>
  );
}