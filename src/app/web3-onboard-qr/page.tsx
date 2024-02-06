'use client'

import { Button } from '@nextui-org/react';
import metamaskSDK from '@web3-onboard/metamask';
import { init, useConnectWallet } from '@web3-onboard/react';
import { ethers } from 'ethers';

interface RPCError {
  code: number;
  message: string;
}

const chains = [
  {
    id: '0x1',
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: `https://rpc.ankr.com/eth`,
  },
  {
    id: '0x38',
    token: 'BNB',
    label: 'Binance Smart Chain',
    rpcUrl: `https://bsc-dataseed.binance.org`,
  },
];

// initialize the module with options
const metamaskSDKWallet = metamaskSDK({options: {
  extensionOnly: false,
  logging: {
    developerMode: true,
  },
  dappMetadata: {
    name: 'Demo Web3Onboard'
  }
}})

init({
  // ... other Onboard options
  wallets: [
    metamaskSDKWallet
    //... other wallets
  ],
  chains
});

function App() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  const switchChain = async (hexChainId: string) => {
    try {
      const result = await wallet?.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }], // chainId must be in hexadecimal numbers
      });
      console.log(`result: `, result)
    } catch (err: unknown) {
      const error = err as RPCError;
      console.log(typeof error)
      console.log(error);
      if (error.code === -32603 || error.code === 4902) {
        const confirmation = document.getElementById('confirmation');
        confirmation!.style.display = 'block';
      }
    }
  }

  const handleTestSign = async () => {
    console.log(`TODO: test sign`)
    if(!wallet) {
      console.error(`ethersProvider is undefined`)
      return
    }

    try {
      const result = await wallet.provider.request({method: 'personal_sign', params: ['hello world', wallet.accounts?.[0].address]})
      console.log(`result: `, result)
    } catch (error) {
      console.error(`error: `, error)
    }
  }

  const handleSendTransaction = async () => {
    if (!wallet?.provider) return
    const ethersProvider = new ethers.providers.Web3Provider(wallet.provider)
    const signer = ethersProvider.getSigner()
    const txn = await signer.sendTransaction({
      to: wallet.accounts[0].address,
      value: 1
    })
    const receipt = txn.wait()
    console.log('receipt', receipt)
  }

  return (
    <>
    <div>
      accounts: {JSON.stringify(wallet?.accounts)}
    </div>
    <div>
      chains: {JSON.stringify(wallet?.chains)}(If chain changed on wallet app, this will also be changed)
    </div>
     <Button
        disabled={connecting}
        onClick={() => (wallet ? disconnect(wallet) : connect())}
      >
        {connecting ? 'connecting' : wallet ? 'disconnect' : 'connect'}
      </Button>

      <Button title='Add Polygon' id={'addPolygonButton'} onClick={() => switchChain('0x1')}>Switch to 0x1</Button>

      <Button  title='test sign' onClick={handleTestSign}>Test Sign</Button>

      <Button
        onClick={handleSendTransaction}
      >
        sendTransaction
      </Button>
    </>
  )
}

export default App