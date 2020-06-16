<template>
  <modal-form-component
    :header="$t('customer.create.header')"
    v-on:cancel="$emit('hide')"
    v-on:submit="save"
    :loading="saving"
    :is-valid="!empty"
  >
    <input-component
      name="name"
      v-model="name"
      :label="$t('customer.name')"
      :required="true"
      :disabled="saving"
    ></input-component>
  </modal-form-component>
</template>
<script lang="ts">
// Libs
import { Vue, Component } from "vue-property-decorator";
import VueI18n from "vue-i18n";

// Services
import { CustomerService } from "../services/customer.service";
import { MessageService } from "../services/message.service";

// DTO's
import { CreateCustomerDTO } from "../../../shared/dto/create-customer.dto";
import { CustomerDTO } from "../../../shared/dto/customer.dto";

// Components
import ModalFormComponent from "./modal-form.component.vue";
import InputComponent from "./layout/input.component.vue";
import MessageComponent, { IMessagePayload } from "./message.component.vue";

// Bootstrap
import {
  customerService as customerServiceInstance,
  messageService as messageServiceInstance
} from "../bootstrap";

@Component({
  components: { ModalFormComponent, InputComponent }
})
export default class CreateCustomerFormComponent extends Vue {
  public customerService: CustomerService = customerServiceInstance;
  public messageService: MessageService = messageServiceInstance;
  public name: string = "";

  public saving: boolean = false;
  public get empty(): boolean {
    return this.name === "";
  }

  public async save() {
    this.saving = true;
    try {
      throw new Error("APA");
      const customer: CustomerDTO = await this.customerService.create(
        CreateCustomerDTO.parse({ name: this.name })
      );
      this.saving = false;
      this.$emit("close", { result: customer });
    } catch {
      this.messageService.showModal(
        "error",
        this.$t("customer.create.error.header").toString(),
        this.$t("customer.create.error.message").toString(),
        () => {
          this.saving = false;
        }
      );
    }
  }
}
</script>
<style lang="scss" scoped>
</style>