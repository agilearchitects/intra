<template>
  <modal-form-component
    header="Skapa Projekt"
    v-on:cancel="$emit('hide')"
    v-on:submit="save"
    :loading="saving"
  >
    <select-component
      class="flex-fill"
      name="customer"
      v-model="selectedCustomer"
      :options="customerSelect"
      :label="$t('time.customer')"
    ></select-component>

    <input-component name="name" v-model="name" label="Namn" :disabled="saving"></input-component>
  </modal-form-component>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action } from "vuex-class";

import { projectCreateAction } from "../store/project.store";

import ModalFormComponent from "./modal-form.component.vue";
import InputComponent from "./layout/input.component.vue";
import SelectComponent from "./layout/select.component.vue";
import { CreateProjectDTO } from "../../../shared/dto/create-project.dto";
import { customerIndexAction } from "../store/customer.store";
import { CustomerDTO } from "../../../shared/dto/customer.dto";

class CustomerViewModel {
  public constructor(public id: number, public name: string) {}
}

@Component({
  components: { ModalFormComponent, InputComponent, SelectComponent }
})
export default class CreateProjectFormComponent extends Vue {
  @Action("project/create") projectCreateAction!: projectCreateAction;
  @Action("customer/index") customerIndexAction!: customerIndexAction;

  public name: string = "";

  public customers: CustomerViewModel[] = [];
  public selectedCustomer: string = "0";

  public loading: boolean = false;
  public saving: boolean = false;

  public created() {
    this.loading = true;
  }

  public mounted() {
    this.load();
  }

  public load() {
    this.loading = true;
    Promise.all([this.getCustomers()]).finally(() => {
      this.loading = false;
    });
  }

  public get customerSelect(): Array<{ value: string; text: string }> {
    return this.customers.map((customer: CustomerViewModel) => ({
      value: customer.id.toString(),
      text: customer.name
    }));
  }

  public getCustomers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.customerIndexAction()
        .then((customers: CustomerDTO[]) => {
          this.customers = customers.map((customer: CustomerDTO) => ({
            id: customer.id,
            name: customer.name
          }));
          this.selectedCustomer =
            this.customers.length > 0 ? this.customers[0].id.toString() : "0";
          resolve();
        })
        .catch((error: any) => reject(error));
    });
  }

  public save() {
    this.saving = true;
    this.projectCreateAction(
      CreateProjectDTO.parse({
        name: this.name,
        customerId: parseInt(this.selectedCustomer, 10)
      })
    )
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