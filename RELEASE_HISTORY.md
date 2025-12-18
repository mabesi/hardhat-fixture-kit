# 📦 Release History

All notable changes to **hardhat-fixture-kit** will be documented here.

---

## [v0.0.2-alpha] - 2025-12-18

> 📝 **Documentation Improvements**

### 🔧 Improvements

- 📚 **Package Documentation** - Added JSDoc comments to main entry point for better IDE support
- 🗂️ **Organized Exports** - Grouped exports by category (main functions vs utilities) for clarity

### 📦 Package Info

| Metric | Value |
|--------|-------|
| 📦 Compressed | 6.0 KB |
| 📂 Unpacked | 24.3 KB |

---

## [v0.0.1-alpha] - 2025-12-18

> 🎉 **Initial Alpha Release**

### ✨ Features

- 🐋 **ERC-20 Token Seeding** - Impersonate whale accounts to transfer tokens instantly
- ⚡ **Auto-Wrap Optimization** - Smart detection of WETH/WMATIC/WBNB/WAVAX with automatic native wrapping
- 🎨 **ERC-721 NFT Seeding** - Transfer any NFT by impersonating the current owner
- 🔐 **Auto-Approve** - Optional automatic approval for target contracts
- 📚 **Built-in Whale Dictionary** - Pre-configured addresses for major tokens on Ethereum
- 🛡️ **Type-Safe** - Full TypeScript support with strict mode
- 🔥 **Ethers v6 Native** - Built specifically for Ethers.js v6.x

### 📊 Package Info

| Metric | Value |
|--------|-------|
| 📦 Compressed | 6.0 KB |
| 📂 Unpacked | 24.3 KB |
| 🔗 Peer Deps | `ethers ^6.0.0`, `hardhat ^2.19.0` |
| 🟢 Node | >= 18.0.0 |
| 📄 License | MIT |

### ⚠️ Known Limitations

- 🔄 Alpha release - API may change in future versions
- 🌐 Whale dictionary limited to Ethereum mainnet
- 🎯 Custom tokens require manual whale specification

### 📚 Documentation

- [Installation & Usage](./README.md)
- [ERC-20 Seeding Guide](./docs/erc20.md)
- [NFT Seeding Guide](./docs/erc721.md)
- [Architecture](./docs/architecture.md)

---

*Format based on [Keep a Changelog](https://keepachangelog.com/)*
