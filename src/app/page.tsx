'use client'

import SwapWindowCCTP from "@/components/SwapWindowCCTP/SwapWindowCCTP"
import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/hooks"
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react"
import JOLTBridge from "@/components/JOLTBridge/JOLTBridge"

export default observer(function Page() {
  const [mounted, setMounted] = useState(false)
  const dialogStore =  useStore('dialogStore')
  const displayStore = useStore('displayStore')
  useEffect(() => {
    setMounted(true)
  }, [])
  if(!mounted) return null
  return (
    <main>
      {['swap', 'bridge'].includes(displayStore.selectedMenu)&&
        <SwapWindowCCTP className="mt-9 w-full" />
      }
      {displayStore.selectedMenu==='jolt'&&<JOLTBridge />}
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