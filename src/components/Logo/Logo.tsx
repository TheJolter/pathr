'use client'
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import logoLight from './logo@2x-light.png'
import logoDark from './logo@2x-dark.png'
import { StaticImageData } from "next/image"
import Link from "next/link"

export default function Logo() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [logo, setLogo] = useState<StaticImageData>()
  useEffect(() => {
    setMounted(true)
  }, [])
  useEffect(()=>{
    setLogo(theme==='dark'?logoDark:logoLight)
  }, [theme])
  if(!mounted) return null
  return (
    <Link href='/'>
      <img height='36px' width='116px' src={logo?.src} alt="pathr" />
    </Link>
  )
}