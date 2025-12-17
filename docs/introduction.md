# Introduction and Concepts

## The Problem: "Setup Hell" in Mainnet Forks

When testing DeFi protocols or dApps on a **Mainnet Fork**, you often need to set up a specific state before you can even run your test logic. This usually involves:

1.  **Finding Whales**: Searching Etherscan for an account that holds a large amount of the token you need (USDC, DAI, WBTC, etc).
2.  **Impersonating**: Writing boilerplate code to `hardhat_impersonateAccount`.
3.  **Funding the Whale**: Realizing the whale account has no ETH to pay for gas, so you have to send them ETH first.
4.  **Transferring**: Executing a transfer to your test user.
5.  **Dealing with WETH**: Realizing that to get WETH, you don't need a whale; you just need to deposit ETH.
6.  **Approving**: Approving your protocol to spend the user's tokens so you can test `deposit` functions.

This process is repetitive, fragile (whales sell their tokens!), and clutters your test files with setup code.

## The Solution: `hardhat-fixture-kit`

`hardhat-fixture-kit` abstracts all of this into a declarative API. You simply tell it **what** you want, not **how** to get it.

```typescript
// Look how clean this is!
await seedFixture({
  users: [{ account: user.address, tokens: [{ symbol: "USDC", amount: "1000" }] }]
});
```

Behind the scenes, the library:
- Maintains a **live list of reliable whales**.
- Handles **Impersonation** and **Auto-Funding** (sending gas to whales if needed).
- Intelligently **Wraps Native Tokens** (Auto-Wrap) if you ask for WETH/WMATIC.
- Can **Auto-Approve** your target contract.

## Key Definitions

### Mainnet Forking
A testing technique where you simulate the Ethereum mainnet locally starting from a specific block number. This allows you to interact with deployed protocols (Uniswap, Aave, etc.) without mocking them.

### Seeding
The process of initializing a test account with assets (Tokens, NFTs, ETH) required for the test scenario.

### Impersonation
A Hardhat feature (`hardhat_impersonateAccount`) that allows you to sign transactions on behalf of any address, even without their private key, within the local simulation.

### Whale
An account (contract or EOA) that holds a large supply of a specific token. We "steal" tokens from these accounts to seed our tests.
