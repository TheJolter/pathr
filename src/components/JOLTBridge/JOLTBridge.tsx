'use client'

import { useTheme } from "next-themes"
import { CSSProperties, useEffect, useState } from "react"
import ToggleButton from "../SwapWindowCCTP/ToggleButton"
import MainButton from "../MainButton"
import ChainTokenIcon from "./ChainTokenIcon"
import { Chip, Link } from "@nextui-org/react"
import ChainTokenCard from "./ChainTokenCard"
import { useConnectWallet } from "@web3-onboard/react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import getAndSotreBalance from "@/utils/get-and-store-balance"
import bn from "@/utils/bn"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { SigningStargateClient } from "@cosmjs/stargate"
import { Decimal } from "../../../node_modules/@cosmjs/math"
import { bigNumberCeil, bigNumberFloor } from "@/utils/bigNumberCeilFloor"
import { ethers } from "ethers"
import { getERC20BalanceAndDecimals } from "@/utils/getERC20BalanceAndDecimals"
import evmSwitchChain from "@/utils/evmSwitchChain"
import { getERC20Allowance } from "@/utils/erc20Allowance"
import { approveERC20 } from "@/utils/erc20Approve"
import watchJoltifyTokenChange from "./watch-joltify-token-receive"

export type JOLTChain = 'bsc' | 'joltify'

export const JOLT_CHAIN_IMGS = {
  bsc: 'https://app.rubic.exchange/assets/images/icons/coins/bnb.svg',
  joltify: 'https://joltify.io/wp-content/uploads/2023/09/joltify-02.png',
}

const JOLT_TOKEN = '0x7db21353a0c4659b6a9a0519066aa8d52639dfa5'

export default observer(function JOLTBridge() {
  const { theme } = useTheme()
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  const cosmosWalletStore = useStore('cosmosWalletStore')
  const balanceStore = useStore('balanceStore')
  const dialogStore = useStore('dialogStore')

  const [boxBgStyle, setBoxBgStyle] = useState<CSSProperties>()
  const [background, setBackground] = useState('')
  const [address, setAddress] = useState('') // source chain address, bsc or joltify address
  const [sourceChain, setSourceChain] = useState<JOLTChain>('bsc')
  const [targetChain, setTargetChain] = useState<JOLTChain>('joltify')
  const [bakanceKey, setBakanceKey] = useState('') // jolt on bsc
  const [balance, setBalance] = useState('0')
  const [balanceJoltify, setBalanceJoltify] = useState('0')
  const [amount, setAmount] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(()=>{
    if (!wallet?.accounts?.[0]?.address) return
    getAndSotreBalance({
      balanceStore,
      chainId: 56,
      tokenAddress: JOLT_TOKEN, // 0x000 is native
      account: wallet?.accounts?.[0]?.address,
      getBakanceKey: (bakanceKey: string)=>setBakanceKey(bakanceKey)
    })
  }, [wallet?.accounts?.[0]?.address])

  useEffect(()=>{
    if (!cosmosWalletStore.address) {
      setBalanceJoltify('0')
    }
    fetch(`https://lcd.joltify.io/cosmos/bank/v1beta1/balances/${cosmosWalletStore.address}/by_denom?denom=ujolt`)
    .then(res=>res.json()).then((res)=>{
      setBalanceJoltify(bn(res?.balance?.amount).div(1e6).toFixed())
    })
  }, [cosmosWalletStore.address])

  useEffect(()=>{
    setBalance(balanceStore.balances[bakanceKey]?.amount?.toFixed()??'0')
    if (sourceChain==='joltify') {
      setBalance(balanceJoltify)
    }
  }, [
    sourceChain,
    balanceJoltify,
    JSON.stringify(balanceStore.balances[bakanceKey])
  ])

  useEffect(()=>{
    setAddress(wallet?.accounts?.[0]?.address??'')
    if (targetChain==='joltify') {
      setAddress(cosmosWalletStore.address??'')
    }
  }, [
    wallet?.accounts?.[0]?.address, 
    cosmosWalletStore.address,
    targetChain
  ])

  useEffect(()=>{
    if (theme==='dark') {
      setBoxBgStyle({background: '#1E2D23'})
      return
    }
    setBoxBgStyle({
      background: '#F6F6F6', 
      boxShadow: '0px 2px 10px 0px rgba(0,0,0,0.1)',
    })
  }, [theme])

  useEffect(()=>{
    if (theme==='dark') {
      setBackground('#354439')
      return
    }
    setBackground('#ffffff')
  }, [theme])

  function handleToggle() {
    const _sourceChain = targetChain
    const _targetChain = sourceChain
    setSourceChain(_sourceChain)
    setTargetChain(_targetChain)
    setAmount('')
  }

  async function handleSubmit() {
    
    // check if wallet connected
    if (sourceChain==='bsc' && !wallet?.accounts?.[0]?.address) {
      dialogStore.showDialog({
        title: '⚠️ Warning', content: 'Please connect to Metamask first'
      })
      return
    } else if (sourceChain==='joltify' && !cosmosWalletStore.address) {
      dialogStore.showDialog({
        title: '⚠️ Warning', content: 'Please connect to Keplr first'
      })
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
    if (sourceChain==='joltify') {
      if (ethers.utils.isAddress(address)===false) {
        dialogStore.showDialog({
          title: '⚠️ Warning', content: 'Invalid receiver address'
        })
        return
      }
      const offlineSigner = (window as any).keplr.getOfflineSignerOnlyAmino('joltify_1729-1')
      setSending(true)
      const client = await SigningStargateClient.connectWithSigner(
        'https://rpc.joltify.io', 
        offlineSigner, {gasPrice: {amount: Decimal.zero(0), denom: 'ujolt'}}
      )
      client.sendTokens(
        cosmosWalletStore.address!,
        'jolt1mrzxkcnumwt3xvs9fxdd9v25at8advadz2sqgn',
        [{amount: bigNumberFloor(bn(amount).times(1e6), 0).toFixed(), denom: 'ujolt'}],
        'auto',
        address
      ).then(async (res)=>{
        if (res.code===0) {
          const {balance: initBalance} = await getERC20BalanceAndDecimals({
            tokenAddress: JOLT_TOKEN,
            walletAddress: address,
            providerUrl: rpcUrl
          })
          let count = 0
          const interval = setInterval(async ()=>{
            count++
            if (count>100) {
              setSending(false)
              clearInterval(interval)
              dialogStore.showDialog({
                title: 'Withdraw pending',
                content: 'It might take more time, please check later'
              })
            }
            const {balance} = await getERC20BalanceAndDecimals({
              tokenAddress: JOLT_TOKEN,
              walletAddress: address,
              providerUrl: rpcUrl
            })
            console.log({initBalance, balance})
            if (bn(balance).gt(initBalance)) {
              setSending(false)
              clearInterval(interval)
              dialogStore.showDialog({
                title: 'Susccess ✅',
                content: <>
                  Click <a href={`https://bscscan.com/address/${address}`} target="_blank">here</a> to view details
                </>
              })
            }
          }, 6000)
          return
        }
        setSending(false)
        dialogStore.showDialog({
          title: 'Failed ❌', content: res.rawLog ?? res.toString()
        })
      }).catch(error=>{
        setSending(false)
        dialogStore.showDialog({
          title: 'Failed ⚠️', content: error.message ?? error?.toString()
        })
      })

      return
    }

    // if source chain is bsc, send to joltify
    const provider = wallet?.provider
    const ethereum:any = wallet?.provider
    const evmChainId = ethereum.chainId
    if (evmChainId!=='0x38') {
      evmSwitchChain('0x38', {provider: wallet?.provider}).then(()=>{
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
        setTimeout(()=>{
          handleSubmit()
        }, 5000)
      }
    } catch(error:any) {
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
    ).then((tx:any)=>{
      tx.wait().then((rtp:any)=>{
        if (rtp.status===1) {
          watchJoltifyTokenChange({denom: 'ujolt', address}).then(()=>{
            setSending(false)
            dialogStore.showDialog({
                title: 'Susccess ✅',
                content: <>
                  Click <a href={`https://explorer.joltify.io/account/${address}`} target="_blank">here</a> to view details
                </>
            })
          }).catch((error:any)=>{
            setSending(false)
            dialogStore.showDialog({
              title: 'Pending... ⏰',
              content: `It might take more time, please check later`
            })
          })
          return
        }
      }).catch((error:any)=>{
        setSending(false)
        dialogStore.showDialog({
          title: 'Failed ❌',
          content: error.message ?? error?.toString()
        })
      })
    }).catch((error:any)=>{
      setSending(false)
      dialogStore.showDialog({
        title: 'Failed ⚠️',
        content: error.message ?? error?.toString()
      })
    })
  }

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

            <div className="relative w-full">
              <div className="absolute z-10 text-center w-full top-[88px] pointer-events-none">
                <ToggleButton onClick={()=>{
                  handleToggle()
                }} />
              </div>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <ChainTokenCard direction="from" joltChain={sourceChain} />
                <ChainTokenCard direction="to" joltChain={targetChain} />
              </div>
            </div>

            <div style={{background}} 
              className={`h-[100px] rounded-xl border-[#35593F] border-1
                flex flex-col justify-center mt-4 p-4
              `}
            >
              <div className="font-semibold mb-2">Receiver</div>
              <div id="input-card-icon-input-amout" className="flex">
                  {/* <div className="flex items-center mb-1"> */}
                    <input placeholder="Target chain address" value={address} disabled={false}
                      className="bg-transparent focus:outline-none border-none w-full"
                      onChange={(e)=>{
                        setAddress(e.target.value)
                      }}
                    />
                  {/* </div> */}
              </div>
            </div>
            
            <div style={{background}} 
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
                      onChange={(e)=>{
                        if (! /^\d?(\d+[\.]?\d*)?$/.test(e.target.value) ) return
                        setAmount(e.target.value)
                      }}
                    />
                    <Chip size="sm" color="success" className="cursor-pointer"
                      onClick={()=>{
                        setAmount(balance)
                      }}
                    >Max</Chip>
                  </div>
                  <div className="items-center justify-between text-xs text-gray-400">
                    {/* <div>$123.45</div> */}
                    {address&&<div
                      style={{color: bn(amount||0).gt(balance||0)?'red':undefined}}
                    >
                      Balance: {balance}
                    </div>}
                  </div>
                </div>
              </div>
            </div>

            
            <MainButton fullWidth className="mt-4" disabled={sending}
              onClick={handleSubmit}
            >
              {sending?'Submiting...':'Submit'}
              {sending&&<FontAwesomeIcon icon={faSpinner} spin />}
            </MainButton>
            
          </div>
          <div>Just for testing, it will be merged into Bridge later</div>
        </div>
      </div>
      </div>
    </div>
  </div>
</div>
  )
})