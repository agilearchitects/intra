<template>
  <form v-on:submit.prevent="submit">
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
    <div class="d-flex justify-content-between align-items-center">
      <input-component
        class="flex-fill"
        name="name"
        v-model="form.start"
        label="Startdatum"
        :disabled="saving"
      ></input-component>
      <input-component
        class="flex-fill ml-4"
        name="name"
        v-model="form.end"
        label="Slutdatum"
        :disabled="saving"
      ></input-component>
    </div>
    <div class="d-flex mb-5 justify-content-between align-items-top">
      <div class="card flex-fill mx-0">
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
                <tr :key="`task_${index}`">
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
                      button-size="xs"
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
                <template v-for="(user, subIndex) in task.users">
                  <tr :key="`task_${index}_user_${subIndex}`">
                    <td></td>
                    <td colspan="2" class="p-0">
                      <input-component class="m-0" :value="user.email" :disabled="true"></input-component>
                    </td>
                    <td class="p-0">
                      <input-component placeholder="kr/h" class="m-0" v-model="user.rate"></input-component>
                    </td>
                    <td class="pl-0 pt-0 pb-3 align-bottom text-center">
                      <button-component
                        button-style="danger"
                        button-size="xs"
                        v-tooltip="'Ta bort'"
                        v-on:click="removeUser(task, subIndex)"
                      >
                        <i class="fas fa-times"></i>
                      </button-component>
                    </td>
                  </tr>
                </template>
                <tr :key="`task_${index}_user`">
                  <td></td>
                  <td colspan="3" class="p-0">
                    <ul class="list-group m-0">
                      <li
                        v-for="(user, index) in task.userList"
                        :key="`user_option_${index}`"
                        class="list-group-item"
                        v-on:click="addUser(task, user)"
                      >{{ user.email }}</li>
                    </ul>
                  </td>
                </tr>
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
    <button-component type="submit">
      <template v-if="projectId !== undefined">Spara</template>
      <template v-else>Skapa</template>
    </button-component>
  </form>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Moment, default as moment, Duration } from "moment";

// DTO's
import { CreateProjectDTO } from "../../../shared/dto/create-project.dto";
import { UpdateProjectDTO } from "../../../shared/dto/update-project.dto";
import { CustomerDTO } from "../../../shared/dto/customer.dto";
import { UserDTO } from "../../../shared/dto/user.dto";

// Services
import { CustomerService } from "../services/customer.service";
import { ProjectService } from "../services/project.service";
import { UserService } from "../services/user.service";

// Components
import InputComponent from "./layout/input.component.vue";
import SelectComponent, { IOption } from "./layout/select.component.vue";
import ButtonComponent from "./layout/button.component.vue";
import TagComponent from "./layout/tag.component.vue";

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
import { ProjectUserDTO } from "../../../shared/dto/project-user.dto";
import { TaskDTO } from "../../../shared/dto/task.dto";
import { TaskUserDTO } from "../../../shared/dto/task-user.dto";
import { ProjectDTO } from "../../../shared/dto/project.dto";
import { UpdateTaskDTO } from "../../../shared/dto/update-task.dto";

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
  userId: number;
  email: string;
  rate: string;
}

interface IFormTask {
  id?: number;
  name: string;
  rate: string;
  priceBudget: string;
  hoursBudget: string;
  users: IFormUser[];
  userList: UserViewModel[];
}

interface IForm {
  customer: string;
  name: string;
  rate: string;
  priceBudget: string;
  hoursBudget: string;
  start: string;
  end: string;
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
export default class ProjectFormComponent extends Vue {
  public customerService: CustomerService = customerServiceInstance;
  public projectService: ProjectService = projectServiceInstance;
  public userService: UserService = userServiceInstance;
  public authService: AuthService = authServiceInstance;

  @Prop(Number) projectId?: number;

  public form: IForm = {
    customer: "",
    name: "",
    rate: "",
    priceBudget: "",
    hoursBudget: "",
    start: moment().format("YYYY-MM-DD"),
    end: "",
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

  public created() {
    this.loading = true;
  }

  public mounted() {
    this.load();
  }

  public async load(): Promise<void> {
    this.loading = true;
    try {
      this.customers = await this.getCustomers();
      this.users = await this.getUsers();
      if (this.projectId) {
        await this.loadProject(this.projectId);
      }
    } finally {
      this.loading = false;
    }
  }

  public async loadProject(projectId: number): Promise<void> {
    const project = await this.projectService.get(projectId);
    this.form = {
      customer:
        project.customer !== undefined ? project.customer.id.toString() : "",
      name: project.name,
      rate: project.rate !== undefined ? project.rate.toString() : "",
      priceBudget:
        project.priceBudget !== undefined ? project.priceBudget.toString() : "",
      hoursBudget:
        project.hoursBudget !== undefined ? project.hoursBudget.toString() : "",
      start:
        project.start !== undefined
          ? moment(project.start).format("YYYY-MM-DD")
          : "",
      end:
        project.end !== undefined
          ? moment(project.end).format("YYYY-MM-DD")
          : "",
      newTask: "",
      tasks:
        project.tasks !== undefined
          ? project.tasks.map((task: TaskDTO) => ({
              id: task.id,
              name: task.name,
              rate: task.rate !== undefined ? task.rate.toString() : "",
              priceBudget:
                task.priceBudget !== undefined
                  ? task.priceBudget.toString()
                  : "",
              hoursBudget:
                task.hoursBudget !== undefined
                  ? task.hoursBudget.toString()
                  : "",
              users:
                task.users !== undefined
                  ? task.users.map((taskUser: TaskUserDTO) => ({
                      userId: taskUser.user.id,
                      email: taskUser.user.email,
                      rate:
                        taskUser.rate !== undefined
                          ? taskUser.rate.toString()
                          : ""
                    }))
                  : [],
              userList: [...this.users]
            }))
          : []
    };
  }
  public async getCustomers(): Promise<CustomerViewModel[]> {
    return (await this.customerService.index(true)).map(
      (customer: CustomerDTO) =>
        new CustomerViewModel(customer.id, customer.name)
    );
  }
  public async getUsers(): Promise<UserViewModel[]> {
    return (await this.userService.index()).map(
      (user: UserDTO) => new UserViewModel(user.id, user.email)
    );
  }

  public calculateBudget(target: "rate" | "priceBudget" | "hoursBudget"): void {
    const rate = parseFloat(this.form.rate !== "" ? this.form.rate : "0");
    const priceBudget = parseFloat(
      this.form.priceBudget !== "" ? this.form.priceBudget : "0"
    );
    const hoursBudget = parseFloat(
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

  public submit() {
    const parsed = {
      name: this.form.name,
      customerId: parseInt(this.form.customer, 10),
      ...(this.form.rate !== ""
        ? { rate: parseFloat(this.form.rate) }
        : undefined),
      ...(this.form.priceBudget !== ""
        ? { priceBudget: parseFloat(this.form.priceBudget) }
        : undefined),
      ...(this.form.hoursBudget !== ""
        ? { hoursBudget: parseFloat(this.form.hoursBudget) }
        : undefined),
      ...(this.form.start !== "" ? { start: this.form.start } : undefined),
      ...(this.form.end !== "" ? { end: this.form.end } : undefined),
      tasks: this.form.tasks.map((task: IFormTask) => {
        const parsed = {
          name: task.name,
          rate: parseFloat(task.rate),
          priceBudget: parseFloat(task.priceBudget),
          hoursBudget: parseFloat(task.hoursBudget),
          users: task.users.map((formUser: IFormUser) => {
            const parsed = {};
            return CreateTaskUserDTO.parse({
              userId: formUser.userId,
              rate: parseInt(formUser.rate, 10)
            }).serialize();
          })
        };

        if (task.id !== undefined) {
          return UpdateTaskDTO.parse({
            id: task.id,
            ...parsed
          }).serialize();
        } else {
          return CreateTaskDTO.parse(parsed).serialize();
        }
      })
    };
    if (this.projectId !== undefined) {
      this.$emit(
        "submit",
        UpdateProjectDTO.parse({
          id: this.projectId,
          ...parsed
        })
      );
    } else {
      this.$emit("submit", CreateProjectDTO.parse(parsed));
    }
  }

  private getFilteredUsers(users: IFormUser[]): UserViewModel[] {
    return this.users.filter(
      (user: UserViewModel) =>
        users.findIndex(
          (formUser: IFormUser) => user.id === formUser.userId
        ) === -1
    );
  }

  public async addUser(task: IFormTask, user: UserViewModel) {
    if (user !== undefined) {
      task.users = [
        ...task.users,
        {
          userId: user.id,
          email: user.email,
          rate: ""
        }
      ];
    }

    task.userList = [...this.getFilteredUsers(task.users)];
  }

  public async removeUser(task: IFormTask, index: number) {
    task.users = [
      ...task.users.slice(0, index),
      ...task.users.slice(index + 1)
    ];

    task.userList = [...this.getFilteredUsers(task.users)];
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
      users: [],
      userList: [...this.users]
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