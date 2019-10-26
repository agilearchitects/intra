<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
      <button-component :route="{ name: 'time.project' }">
        <i class="fas fa-arrow-left"></i>
        Tillbaka
      </button-component>
      <h1>Skapa projekt</h1>
    </div>

    <form v-on:submit.prevent="save">
      <div class="d-flex justify-content-between">
        <select-component
          class="w-100 mr-4"
          name="customer"
          v-model="form.customer"
          :options="customerSelect"
          :label="$t('customer.customer')"
          :placeholder="$t('customer.select')"
        ></select-component>
        <input-component
          class="w-100 ml-4"
          name="name"
          v-model="form.name"
          label="Namn"
          :disabled="saving"
        ></input-component>
      </div>
      <tag-component
        class="flex-fill"
        :options="userOptions"
        v-model="form.users"
        :label="$t('user.user')"
        :placeholder="$t('user.select')"
      ></tag-component>
      <tag-component
        class="flex-fill"
        :options="[]"
        v-model="form.tasks"
        :label="$t('task.task')"
        :placeholder="$t('task.select')"
        :allowAdd="true"
      ></tag-component>
      <button-component type="submit">Skapa projekt</button-component>
    </form>
  </div>
</template>
<script lang="ts">
// Libs
import { Vue, Component } from "vue-property-decorator";

// DTO's
import { CreateProjectDTO } from "../../../shared/dto/create-project.dto";
import { CustomerDTO } from "../../../shared/dto/customer.dto";
import { UserDTO } from "../../../shared/dto/user.dto";

// Services
import { CustomerService } from "../services/customer.service";
import { ProjectService } from "../services/project.service";
import { UserService } from "../services/user.service";

// Components
import InputComponent from "./layout/input.component.vue";
import SelectComponent from "./layout/select.component.vue";
import ButtonComponent from "./layout/button.component.vue";
import TagComponent, { IOption } from "./layout/tag.component.vue";

// Bootstrap
import {
  customerService as customerServiceInstance,
  projectService as projectServiceInstance,
  userService as userServiceInstance
} from "../bootstrap";

export class CustomerViewModel {
  public constructor(public id: number, public name: string) {}
}
export class UserViewModel {
  public constructor(public id: number, public email: string) {}
}

export interface IForm {
  name: string;
  customer: string;
  users: string[];
  tasks: string[];
}

@Component({
  components: { InputComponent, SelectComponent, TagComponent, ButtonComponent }
})
export default class CreateProjectComponent extends Vue {
  public customerService: CustomerService = customerServiceInstance;
  public projectService: ProjectService = projectServiceInstance;
  public userService: UserService = userServiceInstance;

  public form: IForm = {
    name: "",
    customer: "",
    users: [],
    tasks: []
  };

  public customers: CustomerViewModel[] = [];
  public users: UserViewModel[] = [];

  public loading: boolean = false;
  public saving: boolean = false;

  public get userOptions(): IOption[] {
    return this.users.map((user: UserViewModel) => ({
      value: user.id.toString(),
      text: user.email
    }));
  }

  public created() {
    this.loading = true;
  }

  public mounted() {
    this.load();
  }

  public async load() {
    this.loading = true;
    try {
      await this.getCustomers();
      await this.getUsers();
    } finally {
      this.loading = false;
    }
  }

  public get customerSelect(): IOption[] {
    return this.customers.map((customer: CustomerViewModel) => ({
      value: customer.id.toString(),
      text: customer.name
    }));
  }

  public async getCustomers(): Promise<void> {
    this.customers = (await this.customerService.index()).map(
      (customer: CustomerDTO) =>
        new CustomerViewModel(customer.id, customer.name)
    );
  }
  public async getUsers(): Promise<void> {
    this.users = (await this.userService.index()).map(
      (user: UserDTO) => new UserViewModel(user.id, user.email)
    );
  }

  public async save() {
    this.saving = true;
    try {
      await this.projectService.create(
        CreateProjectDTO.parse({
          name: this.form.name,
          customerId: parseInt(this.form.customer, 10),
          users: this.form.users.map((user: string) => parseInt(user, 10)),
          tasks: this.form.tasks.map((task: string) => task)
        })
      );
    } catch {
      alert("Something went wrong. Please try again");
    }
    this.saving = false;
  }
}
</script>
<style lang="scss" scoped>
</style>