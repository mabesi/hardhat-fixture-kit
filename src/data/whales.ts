export type WhaleDict = {
    [chainId: number]: {
        [symbol: string]: string; // Token Symbol -> Whale Address
    };
};

export const WHALES: WhaleDict = {
    1: { // Eth Mainnet
        "USDC": "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503", // Binance-Peg Tokens / Large Holder
        "USDT": "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503",
        "DAI": "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503",
        "WBTC": "0x8EB8a3b98659Cce290402893d0123f7560E89904", // Arbitrum One Gateway
        "WETH": "0x8EB8a3b98659Cce290402893d0123f7560E89904", // Arbitrum One Gateway (Often holds WETH too)
        "LINK": "0xF977814e90dA44bFA03b6295A0616a897441aceC", // Binance 14
    },
    42161: { // Arbitrum
        "USDC": "0x1111111254FB6c44bAC0beD2854e76F90643097d", // 1inch
        "WETH": "0x489ee077994B6658eAfA855C308275EAd8097C4A",
    },
    10: { // Optimism
        "USDC": "0x9c4ec768c28520b50860fea7a021c480ef36e347", // Synthetix
    },
    137: { // Polygon
        "USDC": "0x1a13f4ca1d028320a707d99520abfefca3998b7f", // Aave AMM
        "WETH": "0x06012c8cf97bead5deae237070f9587f8e7a266d", // KittyCore (Just a large holder, or typical exchange)
    }
};

export const TOKENS: { [chainId: number]: { [symbol: string]: string } } = {
    1: {
        "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "USDT": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        "DAI": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        "WETH": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        "WBTC": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
    },
    // Add other chains as needed
};
