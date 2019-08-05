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
import { Vue, Component } from "vue-property-decorator";
import { Action } from "vuex-class";

import { customerCreateAction } from "../store/customer.store";

import ModalFormComponent from "./modal-form.component.vue";
import InputComponent from "./layout/input.component.vue";
import { CreateCustomerDTO } from "../../../shared/dto/create-customer.dto";
@Component({
  components: { ModalFormComponent, InputComponent }
})
export default class CreateCustomerFormComponent extends Vue {
  @Action("customer/create") customerCreateAction!: customerCreateAction;

  public name: string = "";

  public saving: boolean = false;

  public save() {
    this.saving = true;
    this.customerCreateAction(CreateCustomerDTO.parse({ name: this.name }))
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