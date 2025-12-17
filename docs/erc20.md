# ERC-20 Seeding Guide

The core function of this library is `seedFixture`. It is arguably the only tool you need to setup your users.

## Basic Usage

```typescript
import { seedFixture } from "hardhat-fixture-kit";

await seedFixture({
  users: [
    {
      account: "0xReceiverAddress...",
      tokens: [
        { symbol: "USDC", amount: "5000" },
        { symbol: "DAI", amount: "2000" }
      ]
    }
  ]
});
```

The library uses an internal dictionary of **Whales** to find sources for these tokens. It currently supports common tokens on:
- Ethereum Mainnet
- Arbitrum One
- Optimism
- Polygon

## Auto-Wrap (Smart Native Wrapping) ⚡

A common inefficiency in forking tests is finding a "WETH Whale".
Technically, **any account with ETH is a potential WETH whale**, because they can just deposit ETH into the WETH contract.

`hardhat-fixture-kit` recognizes requests for Wrapped Native tokens (`WETH`, `WMATIC`, `WBNB`, `WAVAX`) and optimizes the process:

1. It skips the whale lookup.
2. It detects the network's wrapped token address.
3. It takes a rich account (one of the Hardhat default accounts).
4. It calls `deposit()` on the Wrapped Token contract.
5. It transfers the wrapped tokens to your user.

This is **faster** and **more reliable** than impersonating a random WETH holder who might have moved their funds.

## Auto-Approve 🔓

If you are testing a DeFi protocol (e.g., a Vault or Router), your first step is almost always `token.approve(vault, amount)`. We built this into the seeder.

```typescript
await seedFixture({
  approveTarget: "0xMyVaultAddress...", // <--- The contract you are testing
  users: [
    {
      account: "0xUser...", 
      tokens: [{ symbol: "USDC", amount: "100" }]
    }
  ]
});
```

After this runs, `0xUser` has 100 USDC **AND** has already approved `0xMyVaultAddress` to spend 100 USDC.

## Custom Custom Whales

If you need a token that is not in our internal dictionary (e.g., a smaller protocol governance token), you can explicitly provide a whale address.

```typescript
await seedFixture({
  users: [
    {
      account: user.address,
      tokens: [
        { 
          address: "0xNicheTokenAddress...", 
          amount: "500", 
          whale: "0xSomeLargeHolderAddress..." // <--- Distinct functionality
        }
      ]
    }
  ]
});
```
