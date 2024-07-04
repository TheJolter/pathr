import { ethers } from "ethers";

declare let window: any;

/**
 * Calls the `swapExactInputSingle` function of a smart contract using a signer derived from window.ethereum.
 * 
 * @param contractAddress The address of the smart contract.
 * @param amountIn The amount of input tokens to swap.
 * @param inToken The address of the input token.
 * @param outToken The address of the output token.
 * @param targetChain The target chain ID for the swap.
 * @param receiver The address of the receiver of the output tokens.
 * @param receiverContract The address of the receiver contract.
 * @returns The transaction response.
 */
export async function swapExactInputSingle(
  {contractAddress, amountIn, inToken, outToken, targetChain, receiver, receiverContract, poolFee, destPoolFee}:
  {contractAddress: string,
  amountIn: ethers.BigNumber,
  inToken: string,
  outToken: string,
  targetChain: ethers.BigNumber,
  receiver: string,
  receiverContract: string,
  poolFee: ethers.BigNumber,
  destPoolFee: ethers.BigNumber
}
): Promise<ethers.providers.TransactionReceipt> {
  // Ensure window.ethereum is available
  if (!window.ethereum) {
    throw new Error("Ethereum wallet is not available");
  }

  // Create a provider and signer from window.ethereum
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  // ABI for the `swapExactInputSingle` function
  const abi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amountIn",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_inToken",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_outToken",
          "type": "address"
        },
        {
          "internalType": "uint24",
          "name": "_poolFee",
          "type": "uint24"
        },
        {
          "internalType": "uint24",
          "name": "_destPoolFee",
          "type": "uint24"
        },
        {
          "internalType": "uint32",
          "name": "_targetChain",
          "type": "uint32"
        },
        {
          "internalType": "address",
          "name": "_receiver",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_receiverContract",
          "type": "address"
        }
      ],
      "name": "swapExactInputSingle",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  // Create a contract instance with the signer
  const contract = new ethers.Contract(contractAddress, abi, signer);

  // Call the `swapExactInputSingle` function
  const transactionResponse = await contract.swapExactInputSingle(
    amountIn, inToken, outToken, 
    poolFee,
    destPoolFee,
    targetChain, 
    receiver, 
    receiverContract
  );

  // return transactionResponse as ethers.ContractTransaction
  // Wait for the transaction to be mined and return the transaction receipt
  const receipt = await transactionResponse.wait() as ethers.providers.TransactionReceipt
  return receipt
}