# Architecture & Internals

## Design Philosophy

The library is designed to be **thin** but **robust**. It does not introduce complex state management; it simply orchestrates standard JSON-RPC calls and Contract interactions.

## Ethers v6 Integration

We use the modern Ethers v6 API:
- `ethers.Contract` for everything.
- `ethers.parseUnits` instead of `ethers.utils.parseUnits`.
- `ethers.BrowserProvider` / `ethers.JsonRpcProvider` agnostic.

## The Auto-Funding Mechanism 🛡️

A major pain point in manual impersonation is that "Whales" (often Exchange Hot Wallets or DAO Treasuries) might have millions in tokens but **0 ETH** at the specific block you forked (or they moved it all to cold storage).

If you try to make them send a transaction, it reverts with `Insufficient funds for gas`.

`hardhat-fixture-kit` solves this in `src/utils/impersonate.ts`:

```typescript
// Simplified logic
const whaleBalance = await provider.getBalance(whaleAddress);
if (whaleBalance < 1 ETH) {
   // Send 1 ETH from the administrative test account to the whale
   await adminSigner.sendTransaction({
      to: whaleAddress,
      value: parseEther("1.0")
   });
}
```

This ensures the transfer transaction **always succeeds**, regardless of the whale's actual ETH balance.

## Hardhat Integration

The library detects if it is running inside a Hardhat environment by checking for `network.provider`. It prefers using `network.provider.request({ method: "hardhat_impersonateAccount" })` for direct RPC access.

---
[⬅️ Previous: NFT Seeding](./erc721.md)
