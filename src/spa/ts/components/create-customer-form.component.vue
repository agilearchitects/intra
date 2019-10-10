<template>
  <modal-form-component
    header="Skapa Kund"
    v-on:cancel="$emit('hide')"
    v-on:submit="save"
    :loading="saving"
  >
    <input-component name="name" v-model="name" label="Namn" :disabled="saving"></input-component>
  </modal-form-component>
</template>
<script lang="ts">
// Libs
import { Vue, Component } from "vue-property-decorator";

// Services
import { CustomerService } from "../services/customer.service";

// DTO's
import { CreateCustomerDTO } from "../../../shared/dto/create-customer.dto";

// Components
import ModalFormComponent from "./modal-form.component.vue";
import InputComponent from "./layout/input.component.vue";

// Bootstrap
import { customerService as customerServiceInstance } from "../bootstrap";

@Component({
  components: { ModalFormComponent, InputComponent }
})
export default class CreateCustomerFormComponent extends Vue {
  public customerService: CustomerService = customerServiceInstance;
  public name: string = "";

  public saving: boolean = false;

  public save() {
    this.saving = true;
    this.customerService
      .create(CreateCustomerDTO.parse({ name: this.name }))
      .then(() => {
        this.saving = false;
        this.$emit("close");
      })
      .catch(() => {
        alert("Something went wrong. Please try again");
      });
  }
}
</script>
<style lang="scss" scoped>
</style>