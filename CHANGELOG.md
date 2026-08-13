# Changelog

All notable changes to this project will be documented in this file.

The format is inspired by Keep a Changelog.
This project follows Semantic Versioning (SemVer).

---

## [1.1.0] - 2026-08-13

### Added

- Reown AppKit wallet integration
- Support for AppKit's multi-wallet connection interface
- Browser wallet discovery through AppKit
- Wallet provider abstraction through AppKit
- AppKit network and connection state handling
- AppKit wallet information and connection lifecycle management

### Changed

- Migrated wallet infrastructure from direct injected-wallet handling to Reown AppKit
- Centralized wallet connection, disconnection, provider, and network operations in `useWalletActions`
- Improved separation of concerns between the application layer and wallet infrastructure
- Updated frontend environment configuration for Reown AppKit
- Updated frontend dependencies to include Reown AppKit and the Ethers adapter
- Improved Browser Wallet disconnection handling through AppKit's storage layer

### Fixed

- Improved wallet connection state synchronization
- Improved handling of previously connected Browser Wallets after disconnection and page reload

### Infrastructure

- Integrated Reown AppKit as the wallet connection infrastructure
- Added Reown AppKit Project ID configuration
- Maintained Vercel frontend and Render backend deployment architecture

---

## [1.0.0] - 2026-08-05

### Added

- Multi-chain token approval scanning
- ENS resolution
- Wallet connection
- Batch revoke support
- Risk scoring
- Responsive mobile and desktop UI
- Dark mode
- Session persistence

### Changed

- Improved scan performance
- Optimized caching
- Refined UI and UX
- Production-ready deployment workflow

### Fixed

- Numerous stability improvements
- Various bug fixes and UI refinements

### Infrastructure

- Frontend deployed on Vercel
- Backend deployed on Render