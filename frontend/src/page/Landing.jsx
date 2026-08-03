// frontend/src/page/Landing.jsx

import { useState } from "react";
import { useAppContext } from "@/context/hooks";
import { SkeletonCard } from "@/components";

import { 
  DESKTOP_CONFIG,
  TABLET_CONFIG,
  MOBILE_CONFIG,
} from "@/config/deviceConfig";

import {
  TopControls,
  DarkModeToggle,
  ChainTrigger,
  ScanInput,
  ScanButton,
  ErrorMessage,
} from "@/components/layout";

const FAQ_ITEMS = [
  {
    q: "What exactly does Revoky analyze?",
    a: "Revoky analyzes your wallet approvals using multiple signals including allowance size, value at risk, approval age, contract type, protocol recognition, and smart account behavior. It then assigns a risk level and explains why each approval is risky.",
  },
  {
    q: "What makes Revoky different from other revoke tools?",
    a: "Most tools only list approvals. Revoky goes further — it ranks approvals intelligently, calculates real value exposure, detects smart accounts (ERC-4337, proxies, multisigs), and explains risk in plain language.",
  },
  {
    q: "What is 'Value at Risk'?",
    a: "Value at Risk represents the estimated USD value that could be transferred if a spender uses its full allowance. It helps you understand real financial exposure, not just token quantities.",
  },
  {
    q: "Why are unlimited approvals dangerous?",
    a: "Unlimited approvals allow a contract or wallet to spend your assets at any time without asking again. If that contract is compromised or malicious, your funds can be drained instantly.",
  },
  {
    q: "What is a Smart Account?",
    a: "A smart account is a wallet powered by smart contract logic instead of just a private key. This includes multisigs, account abstraction wallets (ERC-4337), and delegated execution accounts.",
  },
  {
    q: "Does revoking approvals affect my assets?",
    a: "No. Revoking only removes permission to spend your assets. Your tokens and NFTs remain safely in your wallet.",
  },
  {
    q: "Why do I need to pay gas to revoke?",
    a: "Revoking is an on-chain transaction. The gas fee goes to the network validators, not Revoky.",
  },
  {
    q: "Is it safe to connect my wallet?",
    a: "Yes. Revoky only reads blockchain data and sends transactions that you explicitly approve. It never has access to your private keys.",
  },
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);
  
  const {
    ui,
    wallet,
    scan,
    recent,
    controls,
    utils,
    config,
  } = useAppContext();
  
  const {
    screen,
    isDark,
    setDarkMode,
    loading,
    isRefreshing,
    error,
  } = ui;
  
  const {
    connectedAddress,
    connectWallet,
    connecting,
    connectSwitching,
  } = wallet;
  
  const {
    scanAddress,
    setScanAddress,
    handleScan,
    handleChainChange,
  } = scan;
  
  const {
    filteredRecentWallets,
    showRecent,
    setShowRecent,
    removeRecentWallet,
    clearRecentWallets,
  } = recent;
  
  const {
    dropdownRef,
    showChainDropdown,
    setShowChainDropdown,
  } = controls;
  
  const {
    truncateAddress,
  } = utils;
  
  const {
    selectedChain,
    CHAINS,
  } = config;

  const isSkeletonLoading =
    loading &&
    !isRefreshing;
 
  const btnIconSize = screen.isDesktop ? 18 
    : screen.isTablet ? 16 : 14;
  
  const paragraphStyle = {
    fontSize: screen.isDesktop ? 16 : 14,
    lineHeight: 1.7,
    opacity: 0.85,
  }; 
  
  const deviceConfig = screen.isDesktop
    ? DESKTOP_CONFIG
    : screen.isTablet 
    ? TABLET_CONFIG
    : MOBILE_CONFIG;

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
      {/* TOP CONTROLS */}
      <TopControls config={deviceConfig.topControls}>
        <DarkModeToggle
          isDark={isDark}
          setDarkMode={setDarkMode}
          config={deviceConfig.darkMode}
        />
        <ChainTrigger
          dropdownRef={dropdownRef}
          showChainDropdown={showChainDropdown}
          setShowChainDropdown={setShowChainDropdown}
          selectedChain={selectedChain}
          CHAINS={CHAINS}
          isDark={isDark}
          handleChainChange={handleChainChange}
          config={deviceConfig.chainTrigger}
        />
      </TopControls>

      {/* HERO SECTION */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 15,
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: screen.isDesktop ? 26 
              : screen.isTablet ? 22 : 18,
            fontWeight: 700,
            letterSpacing: 0.4,
            lineHeight: 1.25,
            opacity: 0.8,
            marginBottom: 8,
            color: isDark ? "#f8fafc" : "#111827",
          }}
        >
          Scan Asset Approvals 
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: screen.isDesktop ? 18 
              : screen.isTablet ? 16 : 13,
            lineHeight: 1.6,
            opacity: 0.8,
            maxWidth: 420,
            margin: "0 auto",
            color: isDark ? "#cbd5f5" : "#4b5563",
          }}
        >
          <span>Protect your wallet by reviewing and revoking risky
          </span> <br />
          <span> token and nft permissions across multiple chains.
          </span>
        </div>
      </div>

			{/* SCAN INPUT */}
      <ScanInput
        isDark={isDark}
        scanAddress={scanAddress}
        setScanAddress={setScanAddress}
        showRecent={showRecent}
        setShowRecent={setShowRecent}
        filteredRecentWallets={filteredRecentWallets}
        clearRecentWallets={clearRecentWallets}
        removeRecentWallet={removeRecentWallet}
        handleScan={handleScan}
        truncateAddress={truncateAddress}
        config={deviceConfig.scanInput}
      />
  
      {/* SCAN WALLET */}
      <ScanButton
        isDark={isDark}
        scanAddress={scanAddress}
        loading={loading}
        handleScan={handleScan}
        config={deviceConfig.scanWallet}
      />

      {/* ERROR MESSAGE */}
      <ErrorMessage
        error={error}
        isDark={isDark}
      />

      {/* DIVIDER */}
      {!connectedAddress && (
        <hr 
          style={{ 
            margin: screen.isDesktop ? "20px 0"
              : screen.isTablet ? "15px 0" : "10px 0",
          }} 
        />
      )}

      {/* CONNECT WALLET */}
      {!connectedAddress && (
        <>
          <button
            onClick={connectWallet}
            disabled={connecting || selectedChain === "all" || connectSwitching} 
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              background: selectedChain === "all" ? "#9ca3af"
                : connectSwitching ? "#2563eb" : "#3b82f6",
              color: "#ffffff",
              border: "none",
              cursor: selectedChain === "all" || connectSwitching
                ? "not-allowed" : "pointer",
              opacity: connectSwitching ? 0.8 : 1,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {connectSwitching ? (
                <svg
                  width={btnIconSize}
                  height={btnIconSize}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    animation: "spin 1s linear infinite",
                    transformOrigin: "center",
                    display: "block",
                  }}
                >
                  <circle cx="12" cy="12" r="9" opacity="0.3" />
                  <path d="M21 12a9 9 0 0 1-9 9" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={btnIconSize}
                  height={btnIconSize}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 7h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                  <path d="M16 11h2a2 2 0 1 1 0 4h-2z" />
                </svg>
              )}

              <span>
                {connectSwitching ? "Switching..." : connecting ? "Connecting..." : "Connect Wallet"}
              </span>
            </div>               
          </button>

          {/* Network Switch Message */}
          {connectSwitching && (
            <div
              style={{
                marginTop: 10,
                background: isDark ? "#1e293b" : "#f3f4f6",
                color: isDark ? "#facc15" : "#b45309",
                padding: "12px 14px",
                borderRadius: 12,
                textAlign: "center",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Please confirm network switch in wallet...
            </div>
          )}
        </>
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
 
      {/* WHY REVOKY + FAQ */}
      <div
        style={{
          marginTop: screen.isMobile ? 30 : 50,
          display: screen.isMobile ? "block" : "grid",
          gridTemplateColumns: screen.isMobile ? "1fr" : "1fr 1fr",
          gap: 24,
          alignItems: "stretch",
          gridAutoRows: "1fr",
          width: "100%",
        }}
      >
        {/* WHY REVOKY */}
        <div
          style={{
            padding: "10px 18px",
            marginBottom: 14,
            borderRadius: 18,
            background: isDark ? "#1b2535" : "#f8fafc",
            height: "100%", 
            display: "flex",
            flexDirection: "column"        
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: 16,
              fontSize: 18,
              letterSpacing: 1,
              color: "#ff4c4c",
            }}
          >
            WHY REVOKY
          </h2>

          <p style={paragraphStyle}>
            Revoky is not just an approval checker — it is a real-time risk intelligence engine for your wallet.
          </p>

          <p style={paragraphStyle}>
            It analyzes every approval using multiple on-chain signals including: smart contract detection, account abstraction behavior, approval age, unlimited allowances, and actual value at risk — giving you a true picture of your exposure.
          </p>

          <p style={paragraphStyle}>
            Instead of showing raw data, Revoky explains *why* something is risky, ranks approvals intelligently, and highlights what matters most first.
          </p>

          <p style={paragraphStyle}>
            With multi-chain scanning, protocol recognition, ENS resolution, and seamless batch revocation — everything is built for speed, clarity, and control.
          </p>

          <p style={paragraphStyle}>
            No guesswork. No blind approvals. Just clear, actionable security.
          </p>
        </div>

        {/* FAQ SECTION */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",          
            padding: "10px 18px",
            borderRadius: 18,
            background: isDark ? "#1b2535" : "#f8fafc",
            height: "100%",                
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: 18,
              letterSpacing: 1,
              color: "#ff4c4c",
            }}
          >
            FAQ
          </h2>

          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={index}
                style={{
                  marginBottom: 16,
                  borderRadius: 12,
                  overflow: "hidden",
                  background: isDark ? "#16202e" : "#ffffff",
                }}
              >
                {/* Question */}
                <div
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  style={{
                    display: "flex",            
                    padding: "14px 16px",
                    cursor: "pointer",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: 600,
                    fontSize: screen.isDesktop ? 16 : 14,
                  }}
                >
                  {item.q}
                  <span
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    ▼
                  </span>
                </div>

                {/* Answer */}
                <div
                  style={{
                    maxHeight: isOpen ? "500px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.35s ease",
                  }}
                >
                  <div
                    style={{
                      padding: isOpen ? "0 16px 14px 16px" : "0 16px",
                      fontSize: screen.isDesktop ? 15 : 13,
                      opacity: 0.85,
                      lineHeight: 1.6,
                    }}
                  >
                    {item.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}