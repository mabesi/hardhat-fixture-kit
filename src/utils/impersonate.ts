import { HardhatEthersProvider } from "@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider";
import { Signer } from "ethers";
import { network } from "hardhat";

export async function impersonateAccount(address: string, provider: any): Promise<Signer> {
    // Use Hardhat's helper if available (requires hardhat-ethers)
    if (network.provider && typeof network.provider.request === "function") {
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [address],
        });
    }

    // Get signer using ethers
    const signer = await provider.getSigner(address);

    // Fund the whale with some ETH to pay for gas if needed
    // We send from the default signer (usually index 0 which has 10000 ETH in testnets)
    const [funder] = await provider.listAccounts();
    if (funder) {
        const whaleBalance = await provider.getBalance(address);
        if (whaleBalance < BigInt("1000000000000000000")) { // 1 ETH
            await provider.sendTransaction({
                to: address,
                value: BigInt("1000000000000000000"), // 1 ETH
                from: typeof funder === 'string' ? funder : funder.address
            })
        }
    }

    return signer;
}

export async function stopImpersonatingAccount(address: string): Promise<void> {
    if (network.provider && typeof network.provider.request === "function") {
        await network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [address],
        });
    }
}
