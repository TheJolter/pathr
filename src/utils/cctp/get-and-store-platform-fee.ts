import { CHAINS } from '@/configs/cctp/configs';
import ApiDataStore, { PlatformFee } from '@/stores/ApiDataStore';
import { ethers } from 'ethers';

// ABI information
const abi = [
  {
    "inputs": [],
    "name": "fee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Function to read the fee
export async function getAndStorePlatformFees({apiDataStore}:{
  apiDataStore: ApiDataStore
}): Promise<PlatformFee[]> {
  // const chain = CHAINS.find(c => c.chainId === chainID);
  let platformFees: PlatformFee[] = []
  for (const chain of CHAINS) {
    if (!chain.receiverContract) {
      apiDataStore.addPlatformFee(chain.chainId, '0')
      platformFees.push({chainID: chain.chainId, feeUSDC: '0'})
      continue
    }
    // Create a provider
    const provider = new ethers.providers.JsonRpcProvider(chain?.rpc);

    // Create a contract instance
    const contract = new ethers.Contract(chain.receiverContract, abi, provider);

    // Call the fee function
    // const fee = await contract.fee();
    contract.fee().then((fee: any) => {
      const feeUSDC = ethers.utils.formatUnits(fee, 6);
      apiDataStore.addPlatformFee(chain.chainId, feeUSDC)
      console.log({chainID: chain.chainId, feeUSDC})
      platformFees.push({chainID: chain.chainId, feeUSDC})
    })
    
  }

  return platformFees
}