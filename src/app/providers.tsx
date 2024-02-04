'use client'

import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from "next-themes"
import { config, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css'
import Header from '../components/Header';
import MainBackground from '@/components/MainBackground';

// import { Web3OnboardProvider, init } from '@web3-onboard/react'
// import injectedModule from '@web3-onboard/injected-wallets'
// import { Chain } from '@web3-onboard/common';
// import { BlockchainInfo } from '@/configs/rubic/blockchain-info';
// import metamaskSDK from '@web3-onboard/metamask'


config.autoAddCss = false; 
library.add(fas)

export function Providers({children}: { children: React.ReactNode }) {

  // let chains:Chain[] = []
  // for (const key in BlockchainInfo) {
  //   chains.push({id: `0x${BlockchainInfo[key].id.toString(16)}`})
  // }
  // const wallets = [
  //   injectedModule(), 
  //   metamaskSDK({options: {
  //     dappMetadata: { // required to connect metamask app on mobile browser
  //       name: 'Pathr',
  //       url: 'https://app.pathr.io/' // can not use `${location.protocol}//${location.host}`
  //     }
  //   }})
  // ]
  // const web3Onboard = init({wallets,chains})
  
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        {/* <Web3OnboardProvider web3Onboard={web3Onboard}> */}
          <div className='relative pb-5 h-screen overflow-auto' style={{zIndex: 1}}>
            <Header />
            {children}
          </div>
        {/* </Web3OnboardProvider> */}
        <MainBackground />
      </NextThemesProvider>
    </NextUIProvider>
  )
}