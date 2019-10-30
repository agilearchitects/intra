<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
      <button-component
        :route="{ name: 'time.project' }"
        buttonStyle="primary"
        buttonType="outlined"
      >
        <i class="fas fa-arrow-left"></i>
        Tillbaka
      </button-component>
      <h1>Skapa projekt</h1>
    </div>

    <form v-on:submit.prevent="save">
      <div class="d-flex justify-content-between align-items-center">
        <select-component
          class="w-100 mr-4"
          name="customer"
          v-model="form.customer"
          :options="customerOptions"
          :label="$t('customer.customer')"
          :placeholder="$t('customer.select')"
        ></select-component>
        <button-component v-on:click="openCreateCustomerModal" v-tooltip="'Ny kund'">
          <i class="fas fa-plus"></i>
        </button-component>
        <input-component
          class="w-100 ml-4"
          name="name"
          v-model="form.name"
          label="Namn"
          :disabled="saving"
        ></input-component>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <input-component
          class="flex-fill"
          name="name"
          v-model="form.rate"
          label="Timpris"
          :disabled="saving"
        ></input-component>
        <!--<button-component v-tooltip="'Beräkna'" v-on:click="calculateBudget('rate')">
          <i class="fas fa-calculator"></i>
        </button-component>-->
        <input-component
          class="flex-fill ml-4"
          name="name"
          v-model="form.priceBudget"
          label="Budget (kr)"
          :disabled="saving"
        ></input-component>
        <!--<button-component v-tooltip="'Beräkna'" v-on:click="calculateBudget('priceBudget')">
          <i class="fas fa-calculator"></i>
        </button-component>-->
        <input-component
          class="flex-fill ml-4"
          name="name"
          v-model="form.hoursBudget"
          label="Budget (h)"
          :disabled="saving"
        ></input-component>
        <!--<button-component v-tooltip="'Beräkna'" v-on:click="calculateBudget('hoursBudget')">
          <i class="fas fa-calculator"></i>
        </button-component>-->
      </div>
      <div class="d-flex mb-5 justify-content-between align-items-top">
        <div class="card w-50 mr-3">
          <div class="card-header">Användare</div>
          <div class="card-body px-0 pt-0">
            <table class="table table-sm table-borderless">
              <thead>
                <tr>
                  <th class="pr-0">Användare</th>
                  <th class="px-0">Timpris</th>
                  <th class="pl-0 align-bottom text-center">
                    <i v-tooltip="'Ta bort'" class="fas fa-times"></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in form.users" :key="`task_${index}`">
                  <td class="py-0 pr-0">
                    <input-component placeholder="Aktivitet" class="m-0" v-model="user.email"></input-component>
                  </td>
                  <td class="p-0">
                    <input-component placeholder="kr/h" class="m-0" v-model="user.rate"></input-component>
                  </td>
                  <td class="pl-0 pt-0 pb-3 align-bottom text-center">
                    <button-component
                      button-style="danger"
                      button-size="small"
                      v-tooltip="'Ta bort'"
                      v-on:click="removeUser(index)"
                    >
                      <i class="fas fa-times"></i>
                    </button-component>
                  </td>
                </tr>
                <tr v-if="form.users.length === 0">
                  <td colspan="5" class="p-2 text-center">
                    <i class="text-muted">Inga användare tillagda</i>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="d-flex justify-content-between align-items-center px-3">
              <select-component
                :options="userOptions"
                v-model="form.newUser"
                placeholder="Välj användare"
                v-on:input="addUser"
                label="Användare"
                class="flex-fill"
              ></select-component>
            </div>
          </div>
        </div>
        <div class="card w-50 ml-3">
          <div class="card-header">Aktiviter</div>
          <div class="card-body px-0 pt-0">
            <table class="table table-sm table-borderless">
              <thead>
                <tr>
                  <th class="pr-0">Aktivitet</th>
                  <th class="px-0">Timpris</th>
                  <th class="px-0">Budget (kr)</th>
                  <th class="px-0">Budget (h)</th>
                  <th class="pl-0 align-bottom text-center">
                    <i v-tooltip="'Ta bort'" class="fas fa-times"></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(task, index) in form.tasks">
                  <tr :key="`task_${index}_task`">
                    <td class="py-0 pr-0">
                      <input-component placeholder="Aktivitet" class="m-0" v-model="task.name"></input-component>
                    </td>
                    <td class="p-0">
                      <input-component placeholder="kr/h" class="m-0" v-model="task.rate"></input-component>
                    </td>
                    <td class="p-0">
                      <input-component placeholder="kronor" class="m-0" v-model="task.priceBudget"></input-component>
                    </td>
                    <td class="p-0">
                      <input-component placeholder="Timmar" class="m-0" v-model="task.hoursBudget"></input-component>
                    </td>
                    <td class="pl-0 pt-0 pb-3 align-bottom text-center">
                      <button-component
                        button-style="danger"
                        button-size="small"
                        v-tooltip="'Ta bort'"
                        v-on:click="removeTask(index)"
                      >
                        <i class="fas fa-times"></i>
                      </button-component>
                    </td>
                  </tr>
                  <tr :key="`task_${index}_users`" class="pt-2">
                    <th class="px-0"></th>
                    <th colspan="2" class="px-0">Användare</th>
                    <th class="px-0">Timpris</th>
                  </tr>
                  <template v-for="user in task.users">
                    <tr :key="`task_${index}_user_${user.id}`">
                      <td></td>
                      <td colspan="2" class="p-0">
                        <input-component class="m-0" :value="user.email" :disabled="true"></input-component>
                      </td>
                      <td class="p-0">
                        <input-component placeholder="kr/h" class="m-0" v-model="user.rate"></input-component>
                      </td>
                    </tr>
                  </template>
                </template>
                <tr v-if="form.tasks.length === 0">
                  <td colspan="5" class="p-2 text-center">
                    <i class="text-muted">Inga aktiviteter tillagda</i>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="d-flex justify-content-between align-items-center px-3">
              <input-component
                label="Aktivitet"
                class="flex-fill"
                v-model="form.newTask"
                v-on:keypress.enter.prevent="addTask"
              ></input-component>
              <button-component
                type="button"
                class="ml-3"
                v-on:click="addTask"
                :disabled="form.newTask === ''"
              >
                <i class="fas fa-plus"></i>
              </button-component>
            </div>
          </div>
        </div>
      </div>
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
  userService as userServiceInstance,
  authService as authServiceInstance
} from "../bootstrap";
import {
  ModalInstance,
  modalSize,
  modalEventType
} from "../utils/modal/modal.util";
import CreateCustomerFormComponent from "./create-customer-form.component.vue";
import { AuthService } from "../services/auth.service";
import { CreateTaskUserDTO } from "../../../shared/dto/create-task-user.dto";
import { CreateTaskDTO } from "../../../shared/dto/create-task.dto";
import { CreateProjectUserDTO } from "../../../shared/dto/create-project-user.dto";

class CustomerViewModel {
  public constructor(
    public readonly id: number,
    public readonly name: string
  ) {}
}
class UserViewModel {
  public constructor(
    public readonly id: number,
    public readonly email: string
  ) {}
}

interface IFormUser {
  id: number;
  email: string;
  rate: string;
}

interface IFormTask {
  name: string;
  rate: string;
  priceBudget: string;
  hoursBudget: string;
  users: IFormUser[];
}

interface IForm {
  customer: string;
  name: string;
  rate: string;
  priceBudget: string;
  hoursBudget: string;
  newUser: string;
  users: IFormUser[];
  newTask: string;
  tasks: IFormTask[];
}

@Component({
  components: {
    InputComponent,
    SelectComponent,
    TagComponent,
    ButtonComponent
  }
})
export default class CreateProjectComponent extends Vue {
  public customerService: CustomerService = customerServiceInstance;
  public projectService: ProjectService = projectServiceInstance;
  public userService: UserService = userServiceInstance;
  public authService: AuthService = authServiceInstance;

  public form: IForm = {
    customer: "",
    name: "",
    rate: "",
    priceBudget: "",
    hoursBudget: "",
    newUser: "",
    users: [
      {
        id: this.authService.user!.id,
        email: this.authService.user!.email,
        rate: ""
      }
    ],
    newTask: "",
    tasks: []
  };
  public autoCalculatePrice: boolean = true;

  public customers: CustomerViewModel[] = [];
  public users: UserViewModel[] = [];

  public loading: boolean = false;
  public saving: boolean = false;

  public get customerOptions(): IOption[] {
    return this.customers.map((customer: CustomerViewModel) => ({
      value: customer.id.toString(),
      text: customer.name
    }));
  }

  public get userOptions(): IOption[] {
    return this.users
      .filter(
        (user: UserViewModel) =>
          this.form.users.findIndex(
            (formUser: IFormUser) => formUser.id === user.id
          ) === -1
      )
      .map((user: UserViewModel) => ({
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

  public async load(): Promise<void> {
    this.loading = true;
    try {
      await this.getCustomers();
      await this.getUsers();
    } finally {
      this.loading = false;
    }
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

  public calculateBudget(target: "rate" | "priceBudget" | "hoursBudget"): void {
    const rate = parseInt(this.form.rate !== "" ? this.form.rate : "0");
    const priceBudget = parseInt(
      this.form.priceBudget !== "" ? this.form.priceBudget : "0"
    );
    const hoursBudget = parseInt(
      this.form.hoursBudget !== "" ? this.form.hoursBudget : "0"
    );
    if (target === "rate" && hoursBudget !== 0) {
      this.form.rate = this.roundBy(priceBudget / hoursBudget, 2).toString();
    } else if (target === "priceBudget") {
      this.form.priceBudget = this.roundBy(rate * hoursBudget, 2).toString();
    } else if (target === "hoursBudget" && rate !== 0) {
      this.form.hoursBudget = this.roundBy(priceBudget / rate, 2).toString();
    }
  }

  private roundBy(value: number, decimals: number = 0): number {
    const pow = Math.pow(10, decimals);
    return Math.round(value * pow) / pow;
  }

  public async save() {
    console.log("saving");
    this.saving = true;
    try {
      await this.projectService.create(
        CreateProjectDTO.parse({
          name: this.form.name,
          customerId: parseInt(this.form.customer, 10),
          users: this.form.users.map((user: IFormUser) =>
            CreateProjectUserDTO.parse({
              userId: user.id,
              rate: parseInt(user.rate, 10)
            }).serialize()
          ),
          tasks: this.form.tasks.map((task: IFormTask) =>
            CreateTaskDTO.parse({
              name: task.name,
              rate: parseInt(task.rate, 10),
              priceBudget: parseInt(task.priceBudget, 10),
              hoursBudget: parseInt(task.hoursBudget, 10),
              users: task.users.map((user: IFormUser) =>
                CreateTaskUserDTO.parse({
                  userId: user.id,
                  rate: parseInt(user.rate, 10)
                }).serialize()
              )
            }).serialize()
          )
        })
      );
    } catch {
      alert("Something went wrong. Please try again");
    }
    this.saving = false;
  }

  public addUser() {
    const user = this.users.find(
      (user: UserViewModel) => user.id === parseInt(this.form.newUser, 10)
    );
    if (user !== undefined) {
      this.form.users.push({
        id: user.id,
        email: user.email,
        rate: ""
      });
      for (const task of this.form.tasks) {
        task.users = [
          ...task.users,
          { id: user.id, email: user.email, rate: "" }
        ];
      }
    }
  }

  public removeUser(index: number) {
    const user = this.form.users[index];
    this.form.users = [
      ...this.form.users.slice(0, index),
      ...this.form.users.slice(index + 1)
    ];
    for (const task of this.form.tasks) {
      const userIndex = task.users.findIndex(
        (taskUser: IFormUser) => taskUser.id === user.id
      );
      if (userIndex !== -1) {
        task.users = [
          ...task.users.slice(0, userIndex),
          ...task.users.slice(userIndex + 1)
        ];
      }
    }
  }

  public addTask() {
    if (this.form.newTask === "") {
      return;
    }
    this.form.tasks.push({
      name: this.form.newTask,
      rate: "",
      priceBudget: "",
      hoursBudget: "",
      users: this.form.users.map((user: IFormUser) => ({
        id: user.id,
        email: user.email,
        rate: user.rate
      }))
    });
    this.form.newTask = "";
  }

  public removeTask(index: number) {
    this.form.tasks = [
      ...this.form.tasks.slice(0, index),
      ...this.form.tasks.slice(index + 1)
    ];
  }

  public openCreateCustomerModal(timeId?: number) {
    const modal = ModalInstance.create<CustomerDTO, CustomerDTO>(
      CreateCustomerFormComponent
    ).options({ size: modalSize.SM });
    modal.open();
    modal.on(
      [modalEventType.HIDDEN, modalEventType.CLOSED],
      async (_, payload?: { data?: CustomerDTO; result?: CustomerDTO }) => {
        await this.load();
        if (payload !== undefined && payload.result !== undefined) {
          this.form.customer = payload.result.id.toString();
        }
      }
    );
  }
}
</script>
<style lang="scss" scoped>
</style>