'use client'

import { useTheme } from "next-themes"
import { useEffect, useState, CSSProperties } from "react"

export default function MainBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [bgStyle, setBgStyle] = useState<CSSProperties>()
  useEffect(() => {
    setMounted(true)
  }, [])
  useEffect(()=>{
    if (theme==='dark') {
      setBgStyle({background: 'linear-gradient(226deg, #32CA62 0%, #E5F740 100%)', opacity: 0.08})
      return
    }
    setBgStyle({background: 'linear-gradient(226deg, #E5F740 0%, #32CA62 100%)', opacity: 0.15})
  }, [theme])
  if(!mounted) return null
  return <div className="w-screen h-screen absolute top-0 z-0"
    style={bgStyle}
  ></div>
}