import { ethers, Signer, Contract, BaseContract, ContractRunner } from "ethers";
import { impersonateAccount, stopImpersonatingAccount } from "./utils/impersonate";
import { WHALES, TOKENS } from "./data/whales";

export interface TokenRequest {
    symbol?: string;
    address?: string;
    amount: string;
    whale?: string; // Optional custom whale
}

export interface UserRequest {
    account: string;
    tokens: TokenRequest[];
}

export interface SeedFixtureOptions {
    approveTarget?: string;
    users: UserRequest[];
    provider?: ethers.BrowserProvider | ethers.JsonRpcProvider | any; // Accept various provider types
}

const WETH_ABI = [
    "function deposit() payable",
    "function withdraw(uint256 wad)",
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function transfer(address to, uint256 amount) returns (bool)"
];

const ERC20_ABI = [
    "function transfer(address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
];

export async function seedFixture(options: SeedFixtureOptions) {
    // Use provided provider or try to get default from hardhat peer dependency or global
    // In a hardhat env, 'ethers.provider' is usually available globally via hardhat-ethers,
    // but we prefer injection or peer-dependency usage.

    // We expect the user to pass the provider, or we rely on the peer-dep ethers (if configured in hardhat runtime).
    // Assuming 'ethers' object passed via import is hooked to Hardhat if we are in Hardhat context, 
    // but for safety let's use the one imported from 'ethers' combined with Hardhat global if present,
    // OR rely on the `provider` option.

    const provider = options.provider || (global as any).ethers?.provider;
    if (!provider) {
        throw new Error("No provider found. Please pass 'provider' in options or ensure hardhat-ethers is loaded.");
    }

    const chainId = Number((await provider.getNetwork()).chainId);

    for (const user of options.users) {
        for (const tokenReq of user.tokens) {
            let tokenAddress = tokenReq.address;

            // Resolve symbol to address if not provided
            if (!tokenAddress && tokenReq.symbol) {
                tokenAddress = TOKENS[chainId]?.[tokenReq.symbol];
                if (!tokenAddress && chainId === 1) {
                    // Fallback for some common ones if missing in map
                    if (tokenReq.symbol === "WETH") tokenAddress = TOKENS[1]["WETH"];
                }
            }

            if (!tokenAddress) {
                console.warn(`Could not find address for token ${tokenReq.symbol}. Skipping.`);
                continue;
            }

            const isWeth = await isWrappedNative(tokenAddress, provider);
            // Simplified WETH check: if symbol is WETH or WMATIC or request says so.
            // Better: check against known WETH addresses or try to see if it has 'deposit'.

            const tokenContract = new Contract(tokenAddress, ERC20_ABI, provider);

            let decimals = 18;
            try {
                decimals = Number(await tokenContract.decimals());
            } catch (e) {
                // Did not support decimals, assume 18
            }

            // Parse amount
            const amountWithDecimals = ethers.parseUnits(tokenReq.amount, decimals);

            // Auto-Wrap (Native Token -> Wrapped)
            // If it's WETH, we can just mint it by sending ETH to it.
            // We check if it looks like WETH (has deposit).
            // Or simply checks if the symbol is WETH/WMATIC

            // Let's rely on symbol/known map for optimization, or just try to deposit.
            let autoWrapped = false;

            // Check if we can "mint" via deposit (Auto-Wrap)
            // This is a heuristic. If symbol is WETH, we do this.
            let symbol = tokenReq.symbol;
            if (!symbol) {
                try { symbol = await tokenContract.symbol(); } catch { }
            }

            if (symbol && ["WETH", "WMATIC", "WBNB", "WAVAX"].includes(symbol.toUpperCase())) {
                // Perform Auto-Wrap
                const userSigner = await provider.getSigner(user.account);

                // We need to ensure the user has enough ETH to wrap.
                // But wait, the goal is to seed the user. So we should send ETH to the user frist?
                // Or we can impersonate a whale with ETH, send ETH to user, then user wraps?
                // OR, even better: Impersonate a rich account (whale), send ETH to WETH contract on behalf of user?
                // No, deposit() mints to msg.sender.
                // So:
                // 1. Send ETH from whale to User.
                // 2. User calls WETH.deposit{value: amount}()

                // OR:
                // 1. We (the script) impersonate a random rich whale.
                // 2. Whale calls WETH.deposit{value: amount}() -> Whale gets WETH.
                // 3. Whale transfers WETH to User.
                // This is generic and safer than relying on user having ETH.

                // BUT, the spec says: "se o usuário pedir WETH... pegar ETH nativo e depositar no contrato WETH".
                // "sem precisar roubar de uma baleia".
                // This implies converting ETH to WETH. 
                // Strategy: Get a signer with ETH (e.g. the default Hardhat accounts usually have 10k ETH). 
                // Use the first account to deposit ETH -> WETH, then transfer WETH to user.

                const [admin] = await provider.listAccounts(); // One of the hardhat accounts
                if (admin) {
                    const wethAdmin = new Contract(tokenAddress, WETH_ABI, admin);
                    // Ensure admin has enough ETH (usually yes).
                    await (await wethAdmin.deposit({ value: amountWithDecimals })).wait();
                    await (await wethAdmin.transfer(user.account, amountWithDecimals)).wait();
                    autoWrapped = true;
                }
            }

            if (!autoWrapped) {
                // Regular ERC-20 Seeding (Steal from Whale)

                let whaleAddress = tokenReq.whale;
                if (!whaleAddress) {
                    whaleAddress = WHALES[chainId]?.[symbol || ""] || WHALES[1]?.[symbol || ""]; // Fallback to mainnet dict if on fork
                    // If we are on a fork, chainId might be the fork ID (e.g. 1 if mainnet fork, or 31337 if hardhat default).
                    // If 31337, we might be forking mainnet. We should check if we have config for whales.
                    // For now assume standard dict looking up by symbol is best effort.
                }

                if (!whaleAddress) {
                    throw new Error(`No whale found for token ${symbol} (${tokenAddress}). Please provide a whale address.`);
                }

                const whaleSigner = await impersonateAccount(whaleAddress, provider);
                const tokenWhale = new Contract(tokenAddress, ERC20_ABI, whaleSigner);

                // Check balance
                const balance = await tokenWhale.balanceOf(whaleAddress);
                if (balance < amountWithDecimals) {
                    console.warn(`Whale ${whaleAddress} has insufficient ${symbol} balance. Has ${ethers.formatUnits(balance, decimals)}, needed ${tokenReq.amount}.`);
                    // Try to continue anyway, maybe it will work if partially filled? No, transfer reverts.
                    // Better to fail fast.
                    throw new Error(`Whale ${whaleAddress} has insufficient balance to seed ${tokenReq.amount} ${symbol}`);
                }

                await (await tokenWhale.transfer(user.account, amountWithDecimals)).wait();

                await stopImpersonatingAccount(whaleAddress);
            }

            // Auto-Approve
            if (options.approveTarget) {
                const userSigner = await impersonateAccount(user.account, provider); // Impersonate user to approve
                const tokenUser = new Contract(tokenAddress, ERC20_ABI, userSigner);
                await (await tokenUser.approve(options.approveTarget, amountWithDecimals)).wait();
                await stopImpersonatingAccount(user.account);
            }
        }
    }
}

async function isWrappedNative(address: string, provider: any): Promise<boolean> {
    // Basic heuristic: check if code exists and maybe symbol
    // For now we rely on the symbol check in the main loop for simplicity as requested by "intelligent enough"
    return false;
}
