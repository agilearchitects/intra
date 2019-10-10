<template>
  <div v-if="loading"></div>
  <modal-form-component
    v-else
    :header="!edit ? $t('time.form.header.add') : $t('time.form.header.edit')"
    v-on:cancel="$emit('hide')"
    v-on:submit="save"
    :loading="saving"
  >
    <div class="d-flex">
      <select-component
        class="flex-fill"
        name="customer"
        v-on:input="selectCustomerChange"
        v-model="time.customerId"
        :options="customerOptions"
        :label="$t('time.customer')"
      ></select-component>
    </div>
    <div class="d-flex">
      <select-component
        class="flex-fill"
        name="project"
        v-model="time.projectId"
        :options="projectOptions"
        :label="$t('time.project')"
      ></select-component>
    </div>
    <div class="d-flex">
      <input-component
        class="mr-4"
        name="from"
        :value="time.fromFormatted"
        v-on:blur="updateFromOrTo($event, 'from')"
        :label="$t('time.from')"
        placeholder="HH:mm"
      ></input-component>
      <input-component
        class="ml-4"
        name="to"
        :value="time.toFormatted"
        v-on:blur="updateFromOrTo($event, 'to')"
        :label="$t('time.to')"
        placeholder="HH:mm"
      ></input-component>
    </div>
    <div class="d-flex">
      <input-component
        type="textarea"
        name="comment"
        class="flex-fill"
        v-model="time.comment"
        :label="$t('time.comment')"
      ></input-component>
    </div>
    <div class="d-flex justify-content-end">
      <button-component button-style="danger" v-on:click="remove">Ta bort</button-component>
    </div>
  </modal-form-component>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Moment, default as moment } from "moment";

// Bootstrap
import {
  authService as authServiceInstance,
  customerService as customerServiceInstance,
  timeService as timeServiceInstance
} from "../bootstrap";

// Components
import ModalFormComponent from "./modal-form.component.vue";
import InputComponent from "./layout/input.component.vue";
import SelectComponent from "./layout/select.component.vue";
import ButtonComponent from "./layout/button.component.vue";

// Services
import { TimeService } from "../services/time.service";
import { CustomerService } from "../services/customer.service";
import { AuthService } from "../services/auth.service";

// DTO's
import { UserDTO } from "../../../shared/dto/user.dto";
import { TimeDTO } from "../../../shared/dto/time.dto";
import { CreateTimeDTO } from "../../../shared/dto/create-time.dto";
import { CustomerDTO } from "../../../shared/dto/customer.dto";
import { IUserDTO } from "../../../shared/dto/user.dto";
import { ProjectDTO } from "../../../shared/dto/project.dto";
import { UpdateTimeDTO } from "../../../shared/dto/update-time.dto";

export class TimeReportFormViewModel {
  public constructor(
    public id: number | undefined,
    public projectId: string,
    public customerId: string,
    public from: Moment,
    public to: Moment | undefined,
    public comment: string
  ) {}

  public get fromFormatted(): string {
    return moment(this.from).format("HH:mm");
  }
  public get toFormatted(): string {
    return this.to !== undefined ? moment(this.to).format("HH:mm") : "";
  }
}

export class CustomerViewModel {
  public constructor(
    public id: number,
    public name: string,
    public projects: ProjectViewModel[]
  ) {}
}

export class ProjectViewModel {
  public constructor(public id: number, public name: string) {}
}

@Component({
  components: {
    ModalFormComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent
  }
})
export default class TimeReportFormComponent extends Vue {
  private readonly timeService: TimeService = timeServiceInstance;
  private readonly customerService: CustomerService = customerServiceInstance;
  private readonly authService: AuthService = authServiceInstance;
  @Prop({ default: {} }) data!: { timeId?: number; date: Moment };

  private get timeId(): number | undefined {
    return this.data.timeId;
  }
  private get date(): Moment {
    return this.data.date;
  }

  public get edit(): boolean {
    return this.timeId !== undefined;
  }

  public get customerOptions(): Array<{ value: string; text: string }> {
    return this.customers.map((customer: CustomerViewModel) => ({
      value: customer.id.toString(),
      text: customer.name
    }));
  }

  public get projectOptions(): Array<{ value: string; text: string }> {
    const selectedCustomer = this.customers.find(
      (customer: CustomerViewModel) =>
        customer.id === parseInt(this.time.customerId, 10)
    );
    if (selectedCustomer !== undefined) {
      return selectedCustomer.projects.map((project: ProjectViewModel) => ({
        value: project.id.toString(),
        text: project.name
      }));
    }

    return [];
  }

  public selectCustomerChange(value: string): void {
    this.time.projectId = this.projectOptions.length
      ? this.projectOptions[0].value
      : "0";
  }

  public time: TimeReportFormViewModel = new TimeReportFormViewModel(
    undefined,
    "",
    "",
    moment(
      `${this.date.format("YYYY-MM-DD")} ${moment(new Date()).format("HH:mm")}`,
      "YYYY-MM-DD HH:mm",
      true
    ),
    undefined,
    ""
  );

  public customers: CustomerViewModel[] = [];

  public loading: boolean = false;
  public saving: boolean = false;

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
      if (this.timeId !== undefined) {
        this.getTime(this.timeId);
      }
    } finally {
      this.loading = false;
    }
  }

  // Get time report
  public async getTime(id: number): Promise<void> {
    const time: TimeDTO = await this.timeService.show(id);
    this.time = new TimeReportFormViewModel(
      time.id,
      time.project !== undefined ? time.project.id.toString() : "",
      time.project !== undefined && time.project.customer !== undefined
        ? time.project.customer.id.toString()
        : "undefined",
      moment(time.from),
      time.to !== undefined ? moment(time.to) : undefined,
      time.comment || ""
    );
  }

  // Get all customers to be able to populate dropdown list
  public async getCustomers(): Promise<void> {
    const customers = await this.customerService.index();

    this.customers = customers.map((customer: CustomerDTO) => ({
      id: customer.id,
      name: customer.name,
      projects:
        customer.projects !== undefined
          ? customer.projects.map((project: ProjectDTO) => ({
              id: project.id,
              name: project.name
            }))
          : []
    }));

    // Set selected customer and project i dropdown menus
    this.time.customerId =
      this.customers.length > 0 ? this.customers[0].id.toString() : "0";
    this.time.projectId =
      this.customers.length > 0 && this.customers[0].projects.length > 0
        ? this.customers[0].projects[0].id.toString()
        : "0";

    return;
  }

  public updateFromOrTo($event: Event, type: "from" | "to") {
    if ($event.srcElement !== null) {
      const value = moment(
        ($event.srcElement as HTMLInputElement).value,
        "HH:mm"
      );
      if (value.isValid()) {
        if (type === "from") {
          this.time.from = moment(
            `${this.date.format("YYYY-MM-DD")} ${value.format("HH:mm")}`,
            "YYYY-MM-DD HH:mm"
          );
        } else {
          this.time.to = moment(
            `${this.date.format("YYYY-MM-DD")} ${value.format("HH:mm")}`,
            "YYYY-MM-DD HH:mm"
          );
        }
      }

      if (type === "to" && this.time.to === undefined) {
        ($event.srcElement as HTMLInputElement).value = "";
      } else {
        ($event.srcElement as HTMLInputElement).value = moment(
          type === "from" ? this.time.from : this.time.to
        ).format("HH:mm");
      }
    }
  }

  public async save(): Promise<void> {
    if (this.time === null || this.time.projectId === undefined) {
      return;
    }
    try {
      this.saving = true;
      if (!this.edit) {
        await this.timeService.create(
          CreateTimeDTO.parse({
            projectId: parseInt(this.time.projectId, 10),
            from: this.time.from.format("YYYY-MM-DD HH:mm:ss").toString(),
            ...(this.time.to !== undefined
              ? { to: this.time.to.format("YYYY-MM-DD HH:mm:ss").toString() }
              : undefined),
            comment: this.time.comment,
            userId: this.authService.user!.id
          })
        );
      } else {
        await this.timeService.update(
          UpdateTimeDTO.parse({
            id: this.time.id as number,
            projectId: parseInt(this.time.projectId, 10),
            from: this.time.from.format("YYYY-MM-DD HH:mm:ss").toString(),
            ...(this.time.to !== undefined
              ? { to: this.time.to.format("YYYY-MM-DD HH:mm:ss").toString() }
              : undefined),
            comment: this.time.comment,
            userId: this.authService.user!.id
          })
        );
      }
      this.saving = false;
      this.$emit("close");
    } catch (error) {
      alert("Something went wrong. Please try again");
    }
  }

  public async remove() {
    if (this.time.id !== undefined && confirm("Är du säker?")) {
      this.saving = true;
      try {
        await this.timeService.delete(this.time.id);
        this.saving = false;
        this.$emit("close");
      } catch (error) {
        alert("Something went wrong. Please try again");
      }
    }
  }
}
</script>