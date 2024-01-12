'use client'

import {Button} from '@nextui-org/button';
import { useState } from 'react';

export default function Page() {
  const [themeMode, setThemeMode] = useState<'dark'|'light'>('dark')
  function handleThemeToggle() {
    if (themeMode==='dark') {
      setThemeMode('light')
      return
    }
    setThemeMode('dark')
  }
  return (
    <main 
      // className={`${themeMode} text-foreground bg-background h-screen`}
    >
      text
      <Button color="primary" onClick={handleThemeToggle}>Toggle Light/Dark</Button>
    </main>
  )
}