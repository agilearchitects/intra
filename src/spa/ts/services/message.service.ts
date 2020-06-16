// Utils
import { modalEventType, ModalInstance, modalSize } from "../utils/modal/modal.util";

// Components
import MessageComponent, {
  IMessagePayload,
  messageType
} from "../components/message.component.vue";

export class MessageService {
  public showModal(type: messageType, header: string, message: string, onClose?: () => void) {
    const modal = ModalInstance.create<IMessagePayload>(
      MessageComponent,
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