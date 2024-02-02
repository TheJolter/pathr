import EvmWalletStore from "@/stores/EvmWalletStore"

export default function getEthereum(params: {
  evmWalletStore: EvmWalletStore
}) {
  const {evmWalletStore} = params
  // return (window as any).ethereum

  const provider = evmWalletStore.web3OnboardWallets[0]?.provider
  return provider
}