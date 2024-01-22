import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import ChainTokenIcon from "./ChainTokenIcon";
import MainButton from "../MainButton";
import { useState } from "react";
import { useStore } from "@/stores/hooks";

export default observer(function SuccessDialog() {
  const displayStore = useStore('displayStore')
  const rubicStore = useStore('rubicStore')
  return (
<Modal isOpen={!!displayStore.successDialogParams} onOpenChange={()=>{}} closeButton={<></>}>
  <ModalContent>
    <ModalHeader></ModalHeader>
    <ModalBody className="pb-6">
      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-6xl" />
      <div className="font-semibold text-center">Swap Submited</div>
      <div className="flex items-center justify-center">
        <ChainTokenIcon tokenAddr={rubicStore.toChainTokenAddr!} chainName={rubicStore.toChainName!} />
        <div className="ml-3">
          <div className="text-2xl font-semibold">8.5023</div>
          <div className="text-gray-400 text-xs">$8.50</div>
        </div>
      </div>
      <MainButton fullWidth className="mt-2"
        onClick={()=>displayStore.setSuccessDialogParams(null)}
      >Done</MainButton>
      <Button radius="full">See details</Button>
    </ModalBody>
  </ModalContent>
</Modal>
  )
})