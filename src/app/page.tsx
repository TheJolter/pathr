'use client'

import SwapWindowCCTP from "@/components/SwapWindowCCTP/SwapWindowCCTP"
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react"
import JOLTBridge from "@/components/JOLTBridge/JOLTBridge"
import USDC from "@/components/USDC/page"
import { EVM_BLOCKCHAIN_NAME } from "pathr-sdk"

export default observer(function Page() {
  const [mounted, setMounted] = useState(false)
  const dialogStore =  useStore('dialogStore')
  const displayStore = useStore('displayStore')
  const pathrStore = useStore('pathrStore')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(()=>{
    if (displayStore.selectedMenu!=='bridge') {
      displayStore.setJoltifyChainSelected(null)
    }
  }, [displayStore.selectedMenu])

  if(!mounted) return null

  const showJOLTBridge = (
    displayStore.selectedMenu==='jolt'
    || (
      (
        (displayStore.joltifyChainSelected==='source' && pathrStore.toChainName===EVM_BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN)
        || (displayStore.joltifyChainSelected==='target' && pathrStore.fromChainName===EVM_BLOCKCHAIN_NAME.BINANCE_SMART_CHAIN)
      )
      && displayStore.selectedMenu==='bridge'
    )
  )

  return (
    <main>

      {!showJOLTBridge&&displayStore.selectedMenu!=='usdc'&&
        <SwapWindowCCTP className="mt-9 w-full" />
      }

      {showJOLTBridge&&
        <JOLTBridge />
      }


      {displayStore.selectedMenu==='usdc' && 
        <div className="mt-32">
          <USDC />
        </div>
      }

      <Modal isOpen={!!dialogStore.dialog} onOpenChange={()=>{
        if (dialogStore.dialog?.forbidClose) return
        dialogStore.hideDialog()
      }}>
        <ModalContent>
          {dialogStore.dialog?.title&&<ModalHeader className="flex flex-col gap-1">
            {dialogStore.dialog.title}
          </ModalHeader>}
          <ModalBody>
            {dialogStore.dialog?.content}
          </ModalBody>
        </ModalContent>
      </Modal>
    </main>
  )
})