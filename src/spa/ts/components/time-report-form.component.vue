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
        v-model="selectedCustomer"
        :options="customerSelect"
        :label="$t('time.customer')"
      ></select-component>
    </div>
    <div class="d-flex">
      <select-component
        class="flex-fill"
        name="project"
        v-model="selectedProject"
        :options="projectSelect"
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
  </modal-form-component>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";
import { Moment, default as moment } from "moment";

// Components
import ModalFormComponent from "./modal-form.component.vue";
import InputComponent from "./layout/input.component.vue";
import SelectComponent from "./layout/select.component.vue";

// Store
import {
  timeCreateAction,
  timeUpdateAction,
  timeShowAction,
  timeDeleteAction
} from "../store/time.store";
import { customerIndexAction } from "../store/customer.store";

// DTO's
import { UserDTO } from "../../../shared/dto/user.dto";
import { TimeDTO } from "../../../shared/dto/time.dto";
import { CreateTimeDTO } from "../../../shared/dto/create-time.dto";
import { CustomerDTO } from "../../../shared/dto/customer.dto";
import { IUSer } from "../store/auth.store";
import { ProjectDTO } from "../../../shared/dto/project.dto";
import { UpdateTimeDTO } from "../../../shared/dto/update-time.dto";

class TimeReportFormViewModel {
  public constructor(
    public id: number | undefined,
    public projectId: number | undefined,
    public customerId: number | undefined,
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

class CustomerViewModel {
  public constructor(
    public id: number,
    public name: string,
    public projects: ProjectViewModel[]
  ) {}
}

class ProjectViewModel {
  public constructor(public id: number, public name: string) {}
}

@Component({
  components: { ModalFormComponent, InputComponent, SelectComponent }
})
export default class TimeReportFormComponent extends Vue {
  @Prop({ default: {} }) data!: { timeId?: number; date?: Moment };
  @Action("time/show") timeShowAction!: timeShowAction;
  @Action("time/create") timeCreateAction!: timeCreateAction;
  @Action("time/update") timeUpdateAction!: timeUpdateAction;
  @Action("time/delete") timeDeleteAction!: timeDeleteAction;
  @Action("customer/index") customerIndexAction!: customerIndexAction;
  @Getter("auth/user") user!: IUSer;
  @Watch("selectedProject") onSelectedProjectChange(value: string) {
    this.time.projectId = parseInt(value, 10);
  }

  private get timeId(): number | undefined {
    return this.data.timeId;
  }
  private get date(): Moment {
    return !this.edit && this.data.date !== undefined
      ? this.data.date
      : this.time.from;
  }

  public get edit(): boolean {
    return this.timeId !== undefined;
  }

  public get customerSelect(): Array<{ value: string; text: string }> {
    return this.customers.map((customer: CustomerViewModel) => ({
      value: customer.id.toString(),
      text: customer.name
    }));
  }

  public get projectSelect(): Array<{ value: string; text: string }> {
    if (this.selectedCustomer !== null) {
      const selectedCustomer = this.customers.find(
        (customer: CustomerViewModel) =>
          customer.id === parseInt(this.selectedCustomer, 10)
      );
      if (selectedCustomer !== undefined) {
        return selectedCustomer.projects.map((project: ProjectViewModel) => ({
          value: project.id.toString(),
          text: project.name
        }));
      }
    }

    return [];
  }

  public time: TimeReportFormViewModel = new TimeReportFormViewModel(
    undefined,
    undefined,
    undefined,
    moment(new Date()),
    undefined,
    ""
  );

  public customers: CustomerViewModel[] = [];
  public selectedCustomer: string = "0";
  public selectedProject: string = "0";

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
    Promise.all([
      this.getCustomers(),
      ...(this.timeId !== undefined ? [this.getTime(this.timeId)] : [])
    ]).finally(() => {
      this.loading = false;
    });
  }

  public getTime(id: number): Promise<void> {
    return new Promise((resolve, reject) =>
      this.timeShowAction(id)
        .then((time: TimeDTO) => {
          this.time = new TimeReportFormViewModel(
            time.id,
            time.project !== undefined ? time.project.id : undefined,
            time.project !== undefined && time.project.customer !== undefined
              ? time.project.customer.id
              : undefined,
            moment(time.from),
            time.to !== undefined ? moment(time.to) : undefined,
            time.comment
          );
          this.selectedCustomer =
            this.time.customerId !== undefined
              ? this.time.customerId.toString()
              : "0";
          this.selectedProject =
            this.time.projectId !== undefined
              ? this.time.projectId.toString()
              : "0";
          resolve();
        })
        .catch((error: any) => reject(error))
    );
  }

  public getCustomers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.customerIndexAction()
        .then((customers: CustomerDTO[]) => {
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
          this.selectedCustomer =
            this.customers.length > 0 ? this.customers[0].id.toString() : "0";
          this.selectedProject =
            this.customers.length > 0 && this.customers[0].projects.length > 0
              ? this.customers[0].projects[0].id.toString()
              : "0";
          resolve();
        })
        .catch((error: any) => reject(error));
    });
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

  public save() {
    console.log("SAVE", this.time);
    if (this.time === null || this.time.projectId === undefined) {
      return;
    }

    this.saving = true;
    if (!this.edit) {
      this.timeCreateAction(
        CreateTimeDTO.parse({
          projectId: this.time.projectId,
          from: this.time.from.format("YYYY-MM-DD HH:mm:ss").toString(),
          ...(this.time.to !== undefined
            ? { to: this.time.to.format("YYYY-MM-DD HH:mm:ss").toString() }
            : undefined),
          comment: this.time.comment,
          userId: this.user.id
        })
      )
        .then(() => {
          this.saving = false;
          this.$emit("close");
        })
        .catch(() => {
          alert("Something went wrong. Please try again");
        });
    } else {
      this.timeUpdateAction(
        UpdateTimeDTO.parse({
          id: this.time.id as number,
          projectId: this.time.projectId,
          from: this.time.from.format("YYYY-MM-DD HH:mm:ss").toString(),
          ...(this.time.to !== undefined
            ? { to: this.time.to.format("YYYY-MM-DD HH:mm:ss").toString() }
            : undefined),
          comment: this.time.comment,
          userId: this.user.id
        })
      );
    }
  }
}
</script>