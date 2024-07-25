'use client'

import { useTheme } from "next-themes"
import { CSSProperties, useEffect, useState } from "react"
import ToggleButton from "../SwapWindowCCTP/ToggleButton"
import MainButton from "../MainButton"
import ChainTokenIcon from "./ChainTokenIcon"
import { Autocomplete, AutocompleteItem, Avatar, Chip, Link } from "@nextui-org/react"
import { useConnectWallet } from "@web3-onboard/react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import getAndSotreBalance from "@/utils/get-and-store-balance"
import bn from "@/utils/bn"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { SigningStargateClient } from "@cosmjs/stargate"
import { Decimal } from "../../../node_modules/@cosmjs/math"
import { bigNumberFloor } from "@/utils/bigNumberCeilFloor"
import { ethers } from "ethers"
import { getERC20BalanceAndDecimals } from "@/utils/getERC20BalanceAndDecimals"
import evmSwitchChain from "@/utils/evmSwitchChain"
import { getERC20Allowance } from "@/utils/erc20Allowance"
import { approveERC20 } from "@/utils/erc20Approve"
import watchJoltifyTokenChange from "./watch-joltify-token-receive"
import styled from "@emotion/styled";
import BRIDGE_TOKENS from "@/configs/bridge-tokens"
import allTokens from "@/configs/pathr/all-tokens.json"

export type JOLTChain = 'BSC' | 'Joltify'

export const JOLT_CHAIN_IMGS = {
  BSC: 'https://app.rubic.exchange/assets/images/icons/coins/bnb.svg',
  Joltify: 'https://joltify.io/wp-content/uploads/2023/09/joltify-02.png',
}

const JOLT_TOKEN = '0x7db21353a0c4659b6a9a0519066aa8d52639dfa5'

export default observer(function JOLTBridge() {
  const { theme } = useTheme()
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  const cosmosWalletStore = useStore('cosmosWalletStore')
  const balanceStore = useStore('balanceStore')
  const dialogStore = useStore('dialogStore')
  const inputStore = useStore('inputStore')
  const pathrStore = useStore('pathrStore')
  const displayStore = useStore('displayStore')

  const [boxBgStyle, setBoxBgStyle] = useState<CSSProperties>()
  const [background, setBackground] = useState('')
  const [address, setAddress] = useState('') // source chain address, bsc or joltify address
  const [sourceChain, setSourceChain] = useState<JOLTChain>(pathrStore.fromChainName as JOLTChain)
  const [targetChain, setTargetChain] = useState<JOLTChain>(pathrStore.toChainName as JOLTChain)
  const [bakanceKey, setBakanceKey] = useState('') // jolt on bsc
  const [balance, setBalance] = useState('0')
  const [balanceJoltify, setBalanceJoltify] = useState('0')
  const [amount, setAmount] = useState('')
  const [sending, setSending] = useState(false)
  const [bridgeTokenImg, setBridgeTokenImg] = useState<string|undefined>(undefined)

  useEffect(()=>{
    setBridgeTokenImg(allTokens.find(item=>item.symbol===inputStore.bridgeToken)?.image)
  }, [inputStore.bridgeToken])

  useEffect(()=>{
    if (pathrStore.fromChainName==='Joltify') {
      displayStore.setJoltifyChainSelected('source')
    } else if (pathrStore.toChainName==='Joltify') {
      displayStore.setJoltifyChainSelected('target')
    } else {
      displayStore.setJoltifyChainSelected(null)
    }
  }, [pathrStore.fromChainName, pathrStore.toChainName])

  useEffect(() => {
    if (!wallet?.accounts?.[0]?.address) return
    getAndSotreBalance({
      balanceStore,
      chainId: 56,
      tokenAddress: JOLT_TOKEN, // 0x000 is native
      account: wallet?.accounts?.[0]?.address,
      getBakanceKey: (bakanceKey: string) => setBakanceKey(bakanceKey)
    })
  }, [wallet?.accounts?.[0]?.address])

  useEffect(() => {
    if (!cosmosWalletStore.address) {
      setBalanceJoltify('0')
    }
    fetch(`https://lcd.joltify.io/cosmos/bank/v1beta1/balances/${cosmosWalletStore.address}/by_denom?denom=ujolt`)
      .then(res => res.json()).then((res) => {
        setBalanceJoltify(bn(res?.balance?.amount).div(1e6).toFixed())
      })
  }, [cosmosWalletStore.address])

  useEffect(() => {
    setBalance(balanceStore.balances[bakanceKey]?.amount?.toFixed() ?? '0')
    if (sourceChain === 'Joltify') {
      setBalance(balanceJoltify)
    }
  }, [
    sourceChain,
    balanceJoltify,
    JSON.stringify(balanceStore.balances[bakanceKey])
  ])

  useEffect(() => {
    setAddress(wallet?.accounts?.[0]?.address ?? '')
    if (targetChain === 'Joltify') {
      setAddress(cosmosWalletStore.address ?? '')
    }
  }, [
    wallet?.accounts?.[0]?.address,
    cosmosWalletStore.address,
    targetChain
  ])

  useEffect(() => {
    if (theme === 'dark') {
      setBoxBgStyle({ background: '#1E2D23' })
      return
    }
    setBoxBgStyle({
      background: '#F6F6F6',
      boxShadow: '0px 2px 10px 0px rgba(0,0,0,0.1)',
    })
  }, [theme])

  useEffect(() => {
    if (theme === 'dark') {
      setBackground('#354439')
      return
    }
    setBackground('#ffffff')
  }, [theme])

  function handleToggle() {
    const _fromChainName = pathrStore.fromChainName
    pathrStore.setFromChainName(pathrStore.toChainName)
    pathrStore.setToChainName(_fromChainName)
    setSourceChain(pathrStore.toChainName as any)
    setTargetChain(_fromChainName as any)
    setAmount('')
  }

  async function handleSubmit() {

    // check if wallet connected
    if (sourceChain === 'BSC' && !wallet?.accounts?.[0]?.address) {
      dialogStore.showDialog({
        title: '⚠️ Warning', content: 'Please connect to Metamask first'
      })
      return
    } else if (sourceChain === 'Joltify') {
      if (!cosmosWalletStore.address) {
        dialogStore.showDialog({
          title: '⚠️ Warning', content: 'Please connect to Keplr first'
        })
        return
      } else if (bn(amount).lt(1.000001)) {
        dialogStore.showDialog({
          title: '⚠️ Warning', content: 'Amount should greater than 1'
        })
        return
      }
    }

    // check input amount greater than balance
    if (bn(amount).gt(balance)) {
      dialogStore.showDialog({
        title: '⚠️ Warning', content: 'Insufficient balance'
      })
      return
    }

    const rpcUrl = 'https://bsc-dataseed2.binance.org'

    // if source chain is joltify, send to bsc
    if (sourceChain === 'Joltify') {
      if (ethers.utils.isAddress(address) === false) {
        dialogStore.showDialog({
          title: '⚠️ Warning', content: 'Invalid receiver address'
        })
        return
      }
      const offlineSigner = (window as any).keplr.getOfflineSignerOnlyAmino('joltify_1729-1')
      setSending(true)
      const client = await SigningStargateClient.connectWithSigner(
        'https://rpc.joltify.io',
        offlineSigner, { gasPrice: { amount: Decimal.zero(0), denom: 'ujolt' } }
      )
      client.sendTokens(
        cosmosWalletStore.address!,
        'jolt1mrzxkcnumwt3xvs9fxdd9v25at8advadz2sqgn',
        [{ amount: bigNumberFloor(bn(amount).times(1e6), 0).toFixed(), denom: 'ujolt' }],
        'auto',
        address
      ).then(async (res) => {
        if (res.code === 0) {
          const { balance: initBalance } = await getERC20BalanceAndDecimals({
            tokenAddress: JOLT_TOKEN,
            walletAddress: address,
            providerUrl: rpcUrl
          })
          let count = 0
          const interval = setInterval(async () => {
            count++
            if (count > 100) {
              setSending(false)
              clearInterval(interval)
              dialogStore.showDialog({
                title: 'Withdraw pending',
                content: 'It might take more time, please check later'
              })
            }
            const { balance } = await getERC20BalanceAndDecimals({
              tokenAddress: JOLT_TOKEN,
              walletAddress: address,
              providerUrl: rpcUrl
            })
            console.log({ initBalance, balance })
            if (bn(balance).gt(initBalance)) {
              setSending(false)
              clearInterval(interval)
              dialogStore.showDialog({
                title: 'Susccess ✅',
                content: <div>
                  Click <Link href={`https://bscscan.com/address/${address}`} target="_blank"><u>here</u></Link> to view details
                </div>
              })
            }
          }, 6000)
          return
        }
        setSending(false)
        dialogStore.showDialog({
          title: 'Failed ❌', content: res.rawLog ?? res.toString()
        })
      }).catch(error => {
        setSending(false)
        dialogStore.showDialog({
          title: 'Failed ⚠️', content: error.message ?? error?.toString()
        })
      })

      return
    }

    // if source chain is bsc, send to joltify
    const provider = wallet?.provider
    const ethereum: any = wallet?.provider
    const evmChainId = ethereum.chainId
    if (evmChainId !== '0x38') {
      evmSwitchChain('0x38', { provider: wallet?.provider }).then(() => {
        handleSubmit()
      })
      return
    }
    const inbondContractAddr = '0x9AbDE6b98fAF40470ed20864E6Bd7b757146C2e9'
    const baseAmount = bigNumberFloor(bn(amount).times(1e18), 0).toFixed()
    setSending(true)
    try {
      const allowance = await getERC20Allowance({
        tokenAddress: JOLT_TOKEN,
        ownerAddress: wallet?.accounts?.[0]?.address!,
        spenderAddress: inbondContractAddr,
        rpcUrl
      })

      if (allowance.lt(baseAmount)) {
        await approveERC20({
          tokenAddress: JOLT_TOKEN,
          spenderAddress: inbondContractAddr,
          amount: baseAmount
        })
        setTimeout(() => {
          handleSubmit()
        }, 5000)
      }
    } catch (error: any) {
      setSending(false)
      dialogStore.showDialog({
        title: 'Approve Faled',
        content: `approve failed: ${error?.message}`
      })
      return
    }

    const _provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = _provider.getSigner();

    const data = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(JSON.stringify({ dest: address, topup_id: '', user_data: '', chain_type: 'JOLTIFY' })))
    const inboundContract = new ethers.Contract(
      inbondContractAddr,
      ['function joltifyTransfer(uint256 amount, bytes calldata memo) public'],
      signer
    )
    inboundContract.joltifyTransfer(
      baseAmount,
      data
    ).then((tx: any) => {
      tx.wait().then((rtp: any) => {
        if (rtp.status === 1) {
          watchJoltifyTokenChange({ denom: 'ujolt', address }).then(() => {
            setSending(false)
            dialogStore.showDialog({
              title: 'Susccess ✅',
              content: <div>
                Click <Link href={`https://explorer.joltify.io/joltify/accounts/${address}`} target="_blank">here</Link> to view details
              </div>
            })
          }).catch((error: any) => {
            setSending(false)
            dialogStore.showDialog({
              title: 'Pending... ⏰',
              content: `It might take more time, please check later`
            })
          })
          return
        }
      }).catch((error: any) => {
        setSending(false)
        dialogStore.showDialog({
          title: 'Failed ❌',
          content: error.message ?? error?.toString()
        })
      })
    }).catch((error: any) => {
      setSending(false)
      dialogStore.showDialog({
        title: 'Failed ⚠️',
        content: error.message ?? error?.toString()
      })
    })
  }

  const CustomAutocomplete = styled(Autocomplete)`
    .bg-default-100 {
      background-color: ${background};
    }
  `;

  return (
    <div className="w-full relative z-10 mt-9">
      <div className={`flex justify-center w-full`}>
        <div
          className={`grid grid-cols-1 gap-5 mx-2 w-full
        ${`md:grid-cols-1`}
      `}
        >
          <div id='container-of-exchange' className={`flex justify-center w-full`}>
            <div
              className={`w-full flex justify-center`}
            >
              <div className="w-full max-w-[392px]">
                <div style={boxBgStyle}
                  className="max-w-[392px] w-full rounded-xl px-6 py-4"
                >
                  <div className="flex items-center">
                    <div className="font-semibold text-2xl grow">Bridge</div>
                  </div>

                  <CustomAutocomplete
                    className="mt-3 border-[#35593F] border-1 rounded-xl"
                    label="Token"
                    placeholder="Search an token"
                    inputValue={inputStore.bridgeToken}
                    defaultItems={BRIDGE_TOKENS}
                    onSelectionChange={(token) => {
                      console.log('token', token)
                      inputStore.setBridgeToken(token as string)
                      pathrStore.resetChainToken()
                    }}
                    startContent={bridgeTokenImg &&
                      <img className="w-5 h-5 rounded-full"
                        src={bridgeTokenImg} />
                    }
                    isClearable={false}
                  >
                    {(token) => <AutocompleteItem key={(token as any).symbol}
                      startContent={
                        <Avatar className="w-5 h-5" src={(token as any).img} />
                      }
                    >{(token as any).symbol}</AutocompleteItem>}
                  </CustomAutocomplete>

                  <div className="grid grid-cols-[1fr_auto_1fr] mt-4">
                    <CustomAutocomplete
                      className="border-[#35593F] border-1 rounded-xl"
                      label="Source Chain"
                      placeholder="select chain"
                      inputValue={pathrStore.fromChainName ?? ''}
                      items={
                        BRIDGE_TOKENS.find(item => item.symbol.toLowerCase() === inputStore.bridgeToken?.toLowerCase())?.chains?.filter(item => item.blockchainName !== pathrStore.toChainName)
                        || []
                      }
                      onSelectionChange={(blockchainName) => {
                        pathrStore.setFromChainName(blockchainName as string)
                        pathrStore.setFromChainTokenAddr(allTokens.find(item => (
                          item.symbol === inputStore.bridgeToken
                          && item.blockchainName === blockchainName
                        ))?.address ?? null)
                      }}
                      isClearable={false}
                    >
                      {(chain) => {
                        return <AutocompleteItem key={(chain as any).blockchainName} className="text text-xs"
                        >{(chain as any).blockchainName}</AutocompleteItem>
                      }}
                    </CustomAutocomplete>

                    <div className="flex items-center px-2 rotate-90">
                      <ToggleButton onClick={() => {
                        if (pathrStore.calculating) return
                        handleToggle()
                      }} />
                    </div>

                    <CustomAutocomplete
                      className="border-[#35593F] border-1 rounded-xl"
                      label="Target Chain"
                      placeholder="select chain"
                      inputValue={pathrStore.toChainName ?? ''}
                      items={
                        BRIDGE_TOKENS.find(item => item.symbol.toLowerCase() === inputStore.bridgeToken?.toLowerCase())?.chains.filter(item => item.blockchainName !== pathrStore.fromChainName)
                        || []
                      }
                      onSelectionChange={(blockchainName) => {
                        pathrStore.setToChainName(blockchainName as string)
                        pathrStore.setToChainTokenAddr(allTokens.find(item => (
                          item.symbol === inputStore.bridgeToken
                          && item.blockchainName === blockchainName
                        ))?.address ?? null)
                      }}
                      isClearable={false}
                    >
                      {(chain) => {
                        return <AutocompleteItem key={(chain as any).blockchainName} className="text text-xs"
                        >{(chain as any).blockchainName}</AutocompleteItem>
                      }}
                    </CustomAutocomplete>
                  </div>

                  <div style={{ background }}
                    className={`h-[100px] rounded-xl border-[#35593F] border-1
                flex flex-col justify-center mt-4 p-4
              `}
                  >
                    <div className="font-semibold mb-2">Receiver</div>
                    <div id="input-card-icon-input-amout" className="flex">
                      {/* <div className="flex items-center mb-1"> */}
                      <input placeholder="Target chain address" value={address} disabled={false}
                        className="bg-transparent focus:outline-none border-none w-full"
                        onChange={(e) => {
                          setAddress(e.target.value)
                        }}
                      />
                      {/* </div> */}
                    </div>
                  </div>

                  <div style={{ background }}
                    className={`h-[100px] rounded-xl border-[#35593F] border-1
                flex flex-col justify-center mt-4 p-4
              `}
                  >
                    <div className="font-semibold mb-2">Amount</div>
                    <div id="input-card-icon-input-amout" className="flex">
                      <div>
                        <ChainTokenIcon
                          tokenImg="https://joltify.io/wp-content/uploads/2023/09/joltify-02.png"
                          chainImg={JOLT_CHAIN_IMGS[sourceChain]}
                        />
                      </div>
                      <div className=" ml-4">
                        <div className="flex items-center mb-1">
                          <input placeholder="0" value={amount} disabled={false}
                            className="text-lg font-semibold mr-3 bg-transparent focus:outline-none border-none w-full"
                            onChange={(e) => {
                              if (! /^\d?(\d+[\.]?\d*)?$/.test(e.target.value)) return
                              setAmount(e.target.value)
                            }}
                          />
                          <Chip size="sm" color="success" className="cursor-pointer"
                            onClick={() => {
                              setAmount(balance)
                            }}
                          >Max</Chip>
                        </div>
                        <div className="items-center justify-between text-xs text-gray-400">
                          {/* <div>$123.45</div> */}
                          {address && <div
                            style={{ color: bn(amount || 0).gt(balance || 0) ? 'red' : undefined }}
                          >
                            Balance: {balance}
                          </div>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {sourceChain === 'Joltify'&&<div className="text text-sm text-gray-500">
                    Fee: 1 JOLT
                  </div>}

                  <MainButton fullWidth className="mt-4" disabled={sending}
                    onClick={handleSubmit}
                  >
                    {sending ? 'Submiting...' : 'Submit'}
                    {sending && <FontAwesomeIcon icon={faSpinner} spin />}
                  </MainButton>

                </div>
                {/* <div>Just for testing, it will be merged into Bridge later</div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})