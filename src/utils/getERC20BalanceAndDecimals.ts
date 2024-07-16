import { ethers } from 'ethers';

export async function getERC20BalanceAndDecimals({
  tokenAddress, walletAddress, providerUrl
}:{
  tokenAddress: string,
  walletAddress: string,
  providerUrl: string
}): Promise<{ balance: string; decimals: number }> {

  const provider = new ethers.providers.JsonRpcProvider(providerUrl);

  const erc20Abi = [
    'function balanceOf(address) view returns (uint256)',
    'function decimals() view returns (uint8)',
  ];

  const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);

  try {
    const [balance, decimals] = await Promise.all([
      tokenContract.balanceOf(walletAddress),
      tokenContract.decimals(),
    ]);

    const balanceString = ethers.utils.formatUnits(balance, decimals);

    return {
      balance: balanceString,
      decimals: decimals,
    };
  } catch (error) {
    console.error('Error fetching ERC20 data:', error);
    throw error;
  }
}