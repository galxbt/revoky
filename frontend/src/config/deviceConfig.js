// frontend/src/config/deviceConfig.js

// Mobile/Tablet/Desktop Layout Components Styling

export const MOBILE_CONFIG = {
  topControls: {
    gap: 12,
  },
  
  darkMode: {
    gap: 4,
    padding: "8px 10px",
    fontSize: 14,
    iconSize: 22,
  },

  chainTrigger: {
    gap: 4,
    padding: "8px 10px",
    fontSize: 14,
    iconSize: 22,
    menuWidth: 180,
    menuPadding: 8,
    itemGap: 10,
    itemPadding: "10px 12px",
  },
  
  scanInput: {
    inputPadding: "16px 48px 16px 16px",
    inputFontSize: 16,
    clipboardIconSize: 22,
    headerFontSize: 12,
    connectedBadgeFontSize: 10,
    secondaryTextFontSize: 11,
    deleteIconSize: 16,
  },
  
  scanWallet: {
    marginTop: 12,
    padding: 14,
    fontSize: 16,
    iconSize: 15,
  },
  
  scanStatus: {
    fontSize: 11,
    marginTop: 5,
  },
 
  walletOverview: {
    padding: 8,
    gap: 6,
  },
  
  walletHeader: {
    dotSize: 8,
    leftGap: 8,
    leftMargin: 0,
    labelGap: 6,
    copyFontSize: 12,
    buttonPadding: 6,
    buttonRadius: 8,
    iconSize: 20,
    tooltipFontSize: 11,
    rightOffset: 0,
  },

  accountMeta: {
    gap: 6,
    labelFontSize: 12,
    valueFontSize: 12,
    riskFontSize: 15,
    showToggle: true,
  },

  quickLinks: {
    collapsible: true,
    fontSize: 13,
    gap: 6,
  },
  
  disconnectModal: {
    modalPadding: 20,
    buttonPadding: 10,
    buttonGap: 10,
  },  
  
  summaryCard: {
    marginTop: 10,
    padding: 12,
    gridGap: 6,
    labelFontSize: 14,
    valueFontSize: 16,
    valueMarginTop: 3,
  },
  
  connectNotice: {
    marginTop: 10,
    fontSize: 15,
  },
  
  sortFilter: {
    padding: 16,
    gap: 14,
    titleFontSize: 15,
    segmentPadding: 4,
    buttonPadding: 8,
    buttonFontSize: 12,
    metricRowGap: 10,
    metricMarginTop: 0,
    directionPadding: "9px 0",
    directionFontSize: 12,
    directionMinWidth: 60,
    directionGap: 6,
    shortAllowance: true,
  },
  
  searchFilter: {
    searchMarginTop: 10,
    searchMarginBottom: 0,
    inputPadding: "12px 42px 12px 14px",
    inputFontSize: 14,
    iconSize: 18,
    iconRight: 14,
    emptyMarginTop: 10,
    emptyPadding: 18,
  },
  
  batchRevoke: {
  marginTop: 16,
  gap: 10,
  selectWidth: 36,
  selectRadius: 10,
  selectIconSize: 18,
  revokePadding: 8,
  revokeRadius: 14,
  revokeGap: 10,
  revokeFontSize: 15,
  spinnerSize: 18,
  txStatusMarginBottom: -10,
  txStatusScreen: "mobile",
  },
  
  emptyState: {
    marginTop: 20,
    padding: 20,
    borderRadius: 14,
    messageFontSize: 14,
    illustrationSize: 150,
  },
  
  infiniteScrollLoader: {
    triggerHeight: 40,
  },
  
  fetchErrorState: {
    warningFontSize: 42,
    headerFontSize: 20,
    paragraphFontSize: 14,
  },
  
  inLineWarning: {
    warningFontSize: 18,
    textFontsize: 14,
  },
};

export const TABLET_CONFIG = {
  topControls: {
    gap: 14,
  },
  
  darkMode: {
    gap: 6,
    padding: "10px 12px",
    fontSize: 14,
    iconSize: 24,
  },

  chainTrigger: {
    gap: 6,
    padding: "10px 12px",
    fontSize: 14,
    iconSize: 24,
    menuWidth: 200,
    menuPadding: 10,
    itemGap: 12,
    itemPadding: "12px 14px",
  },
  
  scanInput: {
    inputPadding: "18px 50px 18px 18px",
    inputFontSize: 18,
    clipboardIconSize: 24,
    headerFontSize: 14,
    connectedBadgeFontSize: 12,
    secondaryTextFontSize: 13,
    deleteIconSize: 18,
  },
  
  scanWallet: {
    marginTop: 20,
    padding: 16,
    fontSize: 16,
    iconSize: 18,
  },
  
  scanStatus: {
    fontSize: 13,
    marginTop: 7,
  },
  
  walletOverview: {
    padding: 10,
    gap: 8,
  },
  
  walletHeader: {
    dotSize: 12,
    leftGap: 8,
    leftMargin: 0,
    labelGap: 10,
    copyFontSize: 12,
    buttonPadding: 0,
    buttonRadius: 10,
    iconSize: 22,
    tooltipFontSize: 13,
    rightOffset: 10,
  },

  accountMeta: {
    gap: 10,
    marginLeft: 10,
    labelFontSize: 14,
    valueFontSize: 14,
    riskFontSize: 16,
    showToggle: false,
  },
  
  quickLinks: {
    collapsible: false,
    fontSize: 14,
    gap: 10,
  },  

  disconnectModal: {
    modalPadding: 24,
    buttonPadding: 14,
    buttonGap: 14,
  },
  
  summaryCard: {
    padding: 14,
    gridGap: 10,
    labelFontSize: 16,
    valueFontSize: 18,
    valueMarginTop: 5,
  },
  
  connectNotice: {
    marginTop: 10,
    fontSize: 18,
  },
  
  sortFilter: {
    padding: 20,
    gap: 18,
    titleFontSize: 17,
    segmentPadding: 6,
    buttonPadding: 10,
    buttonFontSize: 14,
    metricRowGap: 12,
    metricMarginTop: 0,
    directionPadding: 12,
    directionFontSize: 12,
    directionMinWidth: 100,
    directionGap: 8,
    shortAllowance: false,
  },
  
  searchFilter: {
    searchMarginTop: 10,
    searchMarginBottom: 10,
    inputPadding: "12px 40px 12px 14px",
    inputFontSize: 14,
    iconSize: 18,
    iconRight: 14,
    emptyMarginTop: 20,
    emptyPadding: 18,
  },
  
  batchRevoke: {
  marginTop: 16,
  gap: 10,
  selectWidth: 52,
  selectRadius: 14,
  selectIconSize: 22,
  revokePadding: 10,
  revokeRadius: 14,
  revokeGap: 12,
  revokeFontSize: 18,
  spinnerSize: 22,
  txStatusMarginBottom: -10,
  txStatusScreen: null,
  },
  
  emptyState: {
    marginTop: 20,
    padding: 20,
    borderRadius: 14,
    messageFontSize: 14,
    illustrationSize: 170,
  },
  
  infiniteScrollLoader: {
    triggerHeight: 100,
  },
  
  fetchErrorState: {
    warningFontSize: 48,
    headerFontSize: 22,
    paragraphFontSize: 16,
  },
  
  inLineWarning: {
    warningFontSize: 20,
    textFontsize: 16,
  },
};

export const DESKTOP_CONFIG = {
  topControls: {
    gap: 20,
  },
 
  darkMode: {
    gap: 8,
    padding: "12px 14px",
    fontSize: 16,
    iconSize: 26,
  },

  chainTrigger: {
    gap: 8,
    padding: "12px 14px",
    fontSize: 16,
    iconSize: 26,
    menuWidth: 220,
    menuPadding: 12,
    itemGap: 14,
    itemPadding: "14px 16px",
  },
  
  scanInput: {
    inputPadding: "20px 52px 20px 20px",
    inputFontSize: 20,
    clipboardIconSize: 26,
    headerFontSize: 16,
    connectedBadgeFontSize: 14,
    secondaryTextFontSize: 15,
    deleteIconSize: 20,
  },
  
  scanWallet: {
    marginTop: 20,
    padding: 18,
    fontSize: 18,
    iconSize: 22,
  },
  
  scanStatus: {
    fontSize: 15,
    marginTop: 10,
  },
 
  walletOverview: {
    padding: 12,
    gap: 10,
  }, 
 
  walletHeader: {
    dotSize: 12,
    leftGap: 12,
    leftMargin: 65,
    labelGap: 10,
    labelFontSize: 22,
    addressFontSize: 22,
    copyFontSize: 16,
    buttonPadding: 12,
    buttonRadius: 10,
    iconSize: 24,
    tooltipFontSize: 15,
    rightOffset: 0,
  }, 

  accountMeta: {
    gap: 12,
    labelFontSize: 18,
    valueFontSize: 18,
    riskFontSize: 20,
    showToggle: false,
  },

  quickLinks: {
    collapsible: false,
    fontSize: 18,
    gap: 14,
  },
  
  disconnectModal: {
    modalPadding: 24,
    buttonPadding: 14,
    buttonGap: 14,
  },
  
  summaryCard: {
    padding: 20,
    gridGap: 10,
    labelFontSize: 20,
    valueFontSize: 22,
    valueMarginTop: 5,
  },
  
  connectNotice: {
    marginTop: 30,
    fontSize: 20,
  },
  
  sortFilter: {
    maxWidth: 900,
    padding: 24,
    gap: 22,
    titleFontSize: 20,
    segmentPadding: 10,
    buttonPadding: 12,
    buttonFontSize: 18,
    metricRowGap: 16,
    metricMarginTop: 0,
    directionPadding: 16,
    directionFontSize: 16,
    directionMinWidth: 120,
    directionGap: 12,
    shortAllowance: false,
  },
  
  searchFilter: {
    searchMarginTop: 10,
    searchMarginBottom: 10,
    inputPadding: "16px 42px 16px 18px",
    inputFontSize: 14,
    iconSize: 18,
    iconRight: 14,
    emptyMarginTop: 20,
    emptyPadding: 18,
  },
  
  batchRevoke: {
  marginTop: 10,
  gap: 10,
  selectWidth: 52,
  selectRadius: 14,
  selectIconSize: 26,
  revokePadding: 10,
  revokeRadius: 14,
  revokeGap: 12,
  revokeFontSize: 20,
  spinnerSize: 26,
  txStatusMarginBottom: -10,
  txStatusScreen: null,
  },
  
  emptyState: {
    marginTop: 20,
    padding: 20,
    borderRadius: 14,
    messageFontSize: 16,
    illustrationSize: 200,
  },
  
  infiniteScrollLoader: {
    triggerHeight: 100,
  },
  
  fetchErrorState: {
    warningFontSize: 52,
    headerFontSize: 24,
    paragraphFontSize: 18,
  },
  
  inLineWarning: {
    warningFontSize: 22,
    textFontsize: 18,
  },
};