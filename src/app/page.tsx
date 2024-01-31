'use client'

import SwapWindow from "@/components/SwapWindow/SwapWindow"
import { useEffect, useState } from "react"

export default function Page() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if(!mounted) return null
  return (
    <main>
      <SwapWindow className="mt-9 w-full" />
    </main>
  )
}