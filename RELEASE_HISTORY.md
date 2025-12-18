# Release History

## v0.0.1-alpha (2025-12-18)

### 🎉 Initial Alpha Release

First public alpha release of **hardhat-fixture-kit** - a developer-friendly toolkit for setting up state and seeding tokens/NFTs in Hardhat mainnet forks.

#### What's New

- **ERC-20 Token Seeding**: Impersonate whale accounts to transfer tokens instantly
- **Auto-Wrap Optimization**: Smart detection of wrapped tokens (WETH, WMATIC, WBNB, WAVAX) with automatic native currency wrapping
- **ERC-721 NFT Seeding**: Transfer any NFT by impersonating the current owner
- **Auto-Approve**: Optional automatic approval for target contracts
- **Built-in Whale Dictionary**: Pre-configured whale addresses for major tokens on Ethereum mainnet
- **Type-Safe**: Full TypeScript support with strict mode
- **Ethers v6 Native**: Built specifically for Ethers.js v6.x

#### Technical Details

- **Package Size**: 6.0 KB (compressed), 24.3 KB (unpacked)
- **Peer Dependencies**: `ethers ^6.0.0`, `hardhat ^2.19.0`
- **Node Version**: >= 18.0.0
- **License**: MIT

#### Known Limitations

- Alpha release - API may change in future versions
- Whale dictionary currently limited to Ethereum mainnet
- Custom tokens require manual whale address specification

---

*For installation and usage instructions, see the [README](./README.md).*
