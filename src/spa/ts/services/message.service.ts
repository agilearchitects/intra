// Utils
import { modalEventType, ModalInstance, modalSize } from "../utils/modal/modal.util";

// Components
import MessageComponent from "../components/message.component.vue";

export type messageType = "success" | "error";
export interface IMessagePayload {
  type: messageType;
  header?: string;
  message?: string;
}

export class MessageService {
  public constructor(
    private readonly modalInstance: typeof ModalInstance,
    private readonly messageComponent: typeof MessageComponent,
  ) { }

  public showModal(type: messageType, header: string, message: string, onClose?: () => void) {
    const modal = this.modalInstance.create<IMessagePayload>(
      this.messageComponent,
      {
        type,
        header,
        message
      }
    ).options({
      size: modalSize.XS
    });
    modal.open();
    modal.on([modalEventType.HIDDEN, modalEventType.CLOSED], () => onClose !== undefined ? onClose() : undefined);
  }
}