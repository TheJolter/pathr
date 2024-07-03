import { ethers } from "ethers";

declare let window: any; 

/**
 * Executes an ERC20 approve transaction, allowing a spender to spend up to a certain amount of tokens.
 * 
 * @param tokenAddress The address of the ERC20 token contract.
 * @param spenderAddress The address of the spender.
 * @param amount The amount of tokens to approve.
 * @returns The transaction receipt.
 */
export async function approveERC20(
  {tokenAddress, spenderAddress, amount}:
  {tokenAddress: string,
  spenderAddress: string,
  amount: ethers.BigNumberish}
): Promise<ethers.ContractReceipt> {

  if (!window.ethereum) {
    throw new Error("Ethereum wallet is not available");
  }


  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  // ERC20 Token ABI with only the `approve` function
  const erc20ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)"
  ];

  // Create a contract instance with the signer
  const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);

  // Call the `approve` function
  const transactionResponse = await tokenContract.approve(spenderAddress, amount);


  const receipt = await transactionResponse.wait();

  return receipt;
}