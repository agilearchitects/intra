<template>
  <div>
    <button-component @click="openCreateCustomerModal">Skapa ny kund</button-component>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import {
  ModalInstance,
  modalSize,
  modalEventType
} from "../utils/modal/modal.util";
import CreateCustomerFormComponent from "./create-customer-form.component.vue";
import ButtonComponent from "./layout/button.component.vue";
@Component({
  components: { ButtonComponent }
})
export default class CrmComponent extends Vue {
  public openCreateCustomerModal(timeId?: number) {
    const modal = ModalInstance.create<any, any>(
      CreateCustomerFormComponent,
      {}
    ).options({ size: modalSize.SM });
    modal.open();
    modal.on([modalEventType.HIDDEN, modalEventType.CLOSED], () => {});
  }
}
</script>
<style lang="scss" scoped>
</style>