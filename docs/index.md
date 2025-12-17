# 📚 Hardhat Fixture Kit Code Documentation

Welcome to the official documentation for `hardhat-fixture-kit`.

This library is designed to make **Mainnet Forking** tests in Hardhat simple, clean, and robust. It solves common headaches related to setting up test state, acquiring tokens, and handling impersonation.

## Table of Contents

### 🚀 [Introduction & Concepts](./introduction.md)
Understand the "Setup Hell" problem and how we solve it. Learn definitions of Seeding and Impersonation.

### 🪙 [ERC-20 Seeding Guide](./erc20.md)
Detailed guide on using `seedFixture` for fungible tokens.
- Using built-in Whales.
- **Auto-Wrap** (Magic WETH).
- **Auto-Approve** functionality.
- Custom token support.

### 🖼️ [NFT Seeding Guide](./erc721.md)
How to use `stealNFT` to grab any ERC-721 token for your tests.

### ⚙️ [Architecture & Internals](./architecture.md)
Under-the-hood details.
- Ethers v6 implementation.
- Safety mechanisms (Auto-Funding Whales).
- Hardhat integration.
