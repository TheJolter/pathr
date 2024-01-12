"use client";

import { Button } from "@nextui-org/react";
import {useTheme} from "next-themes";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if(!mounted) return null // will delay rend

  function handleSwitch() {
    if (theme==='light') {
      setTheme('dark')
      return
    }
    setTheme('light')
  }

  return (
<Button isIconOnly radius="full" className="w-12 h-12" onClick={handleSwitch}>
  <FontAwesomeIcon icon={theme==='light'?faMoon:faSun} size="lg" />
</Button>
  )
}