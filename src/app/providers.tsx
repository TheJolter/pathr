'use client'

import {NextUIProvider} from '@nextui-org/react'
import {ThemeProvider as NextThemesProvider} from "next-themes"
import { config, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css'
import Header from '../components/Header';
import MainBackground from '@/components/MainBackground';

config.autoAddCss = false; 
library.add(fas)

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <div className='z-10 relative pb-5 h-screen overflow-auto'>
          <Header />
          {children}
        </div>
        <MainBackground />
      </NextThemesProvider>
    </NextUIProvider>
  )
}