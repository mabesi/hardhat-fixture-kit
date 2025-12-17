# Hardhat Fixture Kit

![npm version](https://img.shields.io/npm/v/hardhat-fixture-kit)
![License](https://img.shields.io/npm/l/hardhat-fixture-kit)

A developer-friendly toolkit for setting up state and seeding tokens/NFTs in Hardhat mainnet forks.
Optimized for **Security**, **Modernity (Ethers v6)**, and **Developer Experience**.

## Features

- 🐋 **ERC-20 Seeding**: Instantly transfer tokens from known whales.
- ⚡ **Auto-Wrap Optimization**: Smartly detects WETH/WMATIC requests and wraps native currency instead of finding a whale.
- 🎨 **NFT Seeding**: Steal any ERC-721 NFT by just knowing its address and ID.
- 🔐 **Auto-Approve**: Optionally approve a target contract to spend tokens immediately.
- 🛡️ **Type-Safe**: Built with strict TypeScript.

## Installation

```bash
npm install --save-dev hardhat-fixture-kit ethers hardhat
# or
yarn add -D hardhat-fixture-kit ethers hardhat
```

> **Note**: This library requires `ethers` v6.x and `hardhat` ^2.19.0.

## Quick Start

### ERC-20 Seeding

In your Hardhat test file:

```typescript
import { seedFixture } from "hardhat-fixture-kit";
import { ethers } from "hardhat";

describe("My DeFi Protocol", function () {
  it("Should swap tokens", async function () {
    const [user] = await ethers.getSigners();
    const wrapperAddress = "0xMyProtocolWrapper...";

    // Setup: Seed user with USDC and WETH
    await seedFixture({
      approveTarget: wrapperAddress, // Optional: Auto-approve wrapper to spend these tokens
      users: [
        {
          account: user.address,
          tokens: [
            { symbol: "USDC", amount: "10000" }, // Uses internal generic whales
            { symbol: "WETH", amount: "50" },    // Auto-wraps ETH -> WETH
            { address: "0xCustomToken...", amount: "100", whale: "0xHolder..." } // Custom token
          ]
        }
      ]
    });
    
    // Now user has 10k USDC and 50 WETH, and has approved wrapperAddress!
  });
});
```

### NFT Seeding (Steal NFT)

```typescript
import { stealNFT } from "hardhat-fixture-kit";

await stealNFT({
  nftAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D", // BAYC
  tokenId: 8817,
  to: user.address
});
```

## Ethers v6 Compatibility

This library is built native for Ethers v6. It uses modern Provider and Signer patterns. 
If you are migrating from v5, ensure you are using `hardhat-ethers` ^3.0.0.

## License

MIT
