import { ethers } from "ethers";

/**
 * Fetches the allowance of an ERC20 token for a specific spender.
 * 
 * @param tokenAddress The address of the ERC20 token contract.
 * @param ownerAddress The address of the token owner.
 * @param spenderAddress The address of the spender.
 * @param rpcUrl The RPC URL to interact with the blockchain.
 * @returns The allowance amount as a BigNumber.
 */
export async function getERC20Allowance(
  {tokenAddress, ownerAddress, spenderAddress, rpcUrl}:
  {tokenAddress: string,
  ownerAddress: string,
  spenderAddress: string,
  rpcUrl: string}
): Promise<ethers.BigNumber> {
  // Create a provider instance using the RPC URL
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

  // ERC20 Token ABI with only the `allowance` function
  const erc20ABI = [
    "function allowance(address owner, address spender) external view returns (uint256)"
  ];

  // Create a contract instance
  const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, provider);

  // Call the `allowance` function
  const allowance = await tokenContract.allowance(ownerAddress, spenderAddress);

  return allowance;
}