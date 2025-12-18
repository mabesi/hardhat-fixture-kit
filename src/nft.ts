import { Contract, BrowserProvider, JsonRpcProvider } from "ethers";
import { impersonateAccount, stopImpersonatingAccount } from "./utils/impersonate";

export interface StealNFTRequest {
    nftAddress: string;
    tokenId: number | string; // Support BigInts passed as string
    to: string;
    provider?: BrowserProvider | JsonRpcProvider;
}

const ERC721_ABI = [
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function transferFrom(address from, address to, uint256 tokenId)"
];

export async function stealNFT(options: StealNFTRequest) {
    const globalObj = global as { ethers?: { provider?: BrowserProvider | JsonRpcProvider } };
    const provider = options.provider || globalObj.ethers?.provider;
    if (!provider) {
        throw new Error("No provider found.");
    }

    const nft = new Contract(options.nftAddress, ERC721_ABI, provider);

    let owner;
    try {
        owner = await nft.ownerOf(options.tokenId);
    } catch (e) {
        throw new Error(`Could not find owner of NFT ${options.nftAddress} ID ${options.tokenId}. It might be burned or invalid.`);
    }

    const ownerSigner = await impersonateAccount(owner, provider);
    const nftAsOwner = nft.connect(ownerSigner) as Contract;

    await (await nftAsOwner.transferFrom(owner, options.to, options.tokenId)).wait();

    await stopImpersonatingAccount(owner);
}
