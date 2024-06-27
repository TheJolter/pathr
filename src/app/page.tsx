'use client'

import SwapWindowCCTP from "@/components/SwapWindowCCTP/SwapWindowCCTP"
import { useEffect, useState } from "react"

export default function Page() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if(!mounted) return null
  return (
    <main>
      <SwapWindowCCTP className="mt-9 w-full" />
    </main>
  )
}