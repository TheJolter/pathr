import { EvmChain, chains } from "@/config/chains";
import { ethers } from "ethers";
import { bn } from "utils";

export default function allowanceCheckAndApprove({
  evmChainID,
  amount
}: {
  evmChainID: string,
  amount: string
}): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      reject(new Error('No ethereum provider'));
      return;
    }

    const provider = new ethers.BrowserProvider(ethereum);
    let signer: ethers.JsonRpcSigner;

    try {
      signer = await provider.getSigner();
    } catch (error) {
      reject(error);
      return;
    }

    const chain = chains.find(chain => chain.chainID === evmChainID) as EvmChain;
    if (!chain) {
      reject(new Error('Chain not found'));
      return;
    }

    const contract = new ethers.Contract(
      chain.usdcAddress,
      [
        'function approve(address spender, uint256 amount) public',
        'function allowance(address owner, address spender) view returns(uint256)',
        'function decimals() view returns(uint8)'
      ],
      signer
    );

    try {
      const allowanceAmountBN = await contract.allowance(await signer.getAddress(), chain.tokenMessenger);
      const decimalsBN = await contract.decimals();
      const currentAllowance = bn(allowanceAmountBN.toString()).div(bn(10).pow(bn(decimalsBN.toString())));

      if (currentAllowance.lt(bn(amount))) {
        const amountToApprove = ethers.parseUnits(amount, Number(decimalsBN)).toString();
        
        // Use a loop instead of setTimeout to handle recheck
        while (true) {
          const tx = await contract.approve(chain.tokenMessenger, amountToApprove);
          await tx.wait();

          // wait for 10 seconds before checking
          await new Promise(resolve => setTimeout(resolve, 10_000));

          const newAllowanceBN = await contract.allowance(await signer.getAddress(), chain.tokenMessenger);
          const newAllowance = bn(newAllowanceBN.toString()).div(bn(10).pow(bn(decimalsBN.toString())));

          if (newAllowance.gte(bn(amount))) {
            resolve();
            break;
          }

        }
      } else {
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
}
