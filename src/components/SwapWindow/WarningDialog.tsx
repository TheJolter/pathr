import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWarning } from '@fortawesome/free-solid-svg-icons'
import { useStore } from "@/stores/hooks";

export default observer(function WarningDialog() {
  const displayStore = useStore('displayStore')
  return (
<Modal isOpen={!!displayStore.warningDialogParams} closeButton={<></>}>
  <ModalContent>
    <ModalHeader></ModalHeader>
    <ModalBody className="pb-6">
      <FontAwesomeIcon icon={faWarning} className="text-red-400 text-6xl" />
      <div className="font-semibold text-center">{displayStore.warningDialogParams?.title}</div>
      <div className="text-center">
        {displayStore.warningDialogParams?.content}
      </div>
      <Button radius="full"
        onClick={()=>displayStore.setWarningDialogParams(null)}
      >Close</Button>
    </ModalBody>
  </ModalContent>
</Modal>
  )
})