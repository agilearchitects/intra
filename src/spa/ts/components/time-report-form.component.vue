<template>
  <div v-if="loading"></div>
  <modal-form-component
    v-else
    :header="!edit ? $t('time.form.header.add') : $t('time.form.header.edit')"
    v-on:cancel="$emit('hide')"
    v-on:submit="save"
    :loading="saving"
  >
    <div class="d-flex align-items-end">
      <select-component
        class="flex-fill"
        name="project"
        v-model="time.projectId"
        v-on:input="selectProjectChange"
        :options="projectOptions"
        :label="$t('time.project')"
      ></select-component>
    </div>
    <div class="d-flex">
      <select-component
        class="flex-fill"
        name="task"
        v-model="time.taskId"
        :options="taskOptions"
        :label="$t('time.task')"
      ></select-component>
    </div>
    <div class="d-flex">
      <input-component
        class="mr-4"
        name="from"
        :value="time.fromFormatted"
        ref="time-from"
        v-on:blur="updateFromOrTo('from')"
        :label="$t('time.from')"
        placeholder="HH:mm"
      ></input-component>
      <input-component
        class="ml-4"
        name="to"
        :value="time.toFormatted"
        ref="time-to"
        v-on:blur="updateFromOrTo('to')"
        :label="$t('time.to')"
        placeholder="HH:mm"
      ></input-component>
      <input-component
        v-model="time.rate"
        label="pris/h"
        :disabled="!shoudSetRate"
      ></input-component>
      <checkbox-component
        id="set_rate"
        v-model="shoudSetRate"
        label="Avvikande timpris"
      ></checkbox-component>
    </div>
    <div class="d-flex">
      <tag-component
        class="flex-fill"
        :options="tagOptions"
        :allowAdd="true"
        v-model="time.tags"
        :label="$t('time.tag')"
      ></tag-component>
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
      <button-component
        button-style="danger"
        v-on:click="remove"
      >Ta bort</button-component>
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
  timeService as timeServiceInstance,
  tagService as tagServiceInstance
} from "../bootstrap";

// Components
import ModalFormComponent from "./modal-form.component.vue";
import InputComponent from "./layout/input.component.vue";
import SelectComponent, { IOption } from "./layout/select.component.vue";
import ButtonComponent from "./layout/button.component.vue";
import TagComponent from "./layout/tag.component.vue";
import CheckboxComponent from "./layout/checkbox.component.vue";

// Services
import { TimeService } from "../services/time.service";
import { CustomerService } from "../services/customer.service";
import { AuthService } from "../services/auth.service";
import { TagService } from "../services/tag.service";

// DTO's
import { UserDTO } from "../../../shared/dto/user.dto";
import { TimeDTO } from "../../../shared/dto/time.dto";
import { CreateTimeDTO } from "../../../shared/dto/create-time.dto";
import { CustomerDTO } from "../../../shared/dto/customer.dto";
import { IUserDTO } from "../../../shared/dto/user.dto";
import { ProjectDTO } from "../../../shared/dto/project.dto";
import { UpdateTimeDTO } from "../../../shared/dto/update-time.dto";
import { TagDTO } from "../../../shared/dto/tag.dto";
import { TaskDTO } from "../../../shared/dto/task.dto";

export class TimeReportFormViewModel {
  public constructor(
    public id: number | undefined,
    public projectId: string,
    public taskId: string,
    public from: Moment,
    public to: Moment | undefined,
    public rate: string,
    public tags: Array<string | number>,
    public comment: string
  ) {}

  public get fromFormatted(): string {
    return moment(this.from).format("HH:mm");
  }
  public get toFormatted(): string {
    return this.to !== undefined ? moment(this.to).format("HH:mm") : "";
  }

  public get rateValue(): number | undefined {
    return !isNaN(parseFloat(this.rate)) ? parseFloat(this.rate) : undefined;
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
  public constructor(
    public id: number,
    public name: string,
    public tasks: TaskViewModel[]
  ) {}
}

export class TaskViewModel {
  public constructor(public id: number, public name: string) {}
}

export class TagViewModel {
  public constructor(public id: number, public name: string) {}
}

@Component({
  components: {
    ModalFormComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent,
    TagComponent,
    CheckboxComponent
  }
})
export default class TimeReportFormComponent extends Vue {
  private readonly timeService: TimeService = timeServiceInstance;
  private readonly customerService: CustomerService = customerServiceInstance;
  private readonly authService: AuthService = authServiceInstance;
  private readonly tagService: TagService = tagServiceInstance;
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

  public get projectOptions(): IOption[] {
    const tempData: IOption[] = [];
    this.customers.forEach((customer: CustomerViewModel) => {
      tempData.push({
        value: "",
        text: customer.name,
        children: customer.projects.map((project: ProjectViewModel) => ({
          value: project.id.toString(),
          text: project.name
        }))
      });
    });

    return tempData;
  }

  public get taskOptions(): Array<{
    value: string;
    text: string;
  }> {
    let selectedProject: ProjectViewModel | undefined = undefined;
    for (const customer of this.customers) {
      for (const project of customer.projects) {
        if (project.id === parseInt(this.time.projectId, 10)) {
          selectedProject = project;
        }
      }
    }

    if (selectedProject !== undefined) {
      return selectedProject.tasks.map((task: TaskViewModel) => ({
        value: task.id.toString(),
        text: task.name
      }));
    }

    return [];
  }

  public async selectProjectChange(value: string): Promise<void> {
    await this.$nextTick();
    this.time.taskId =
      this.taskOptions.length > 0 ? this.taskOptions[0].value : "0";
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
    "",
    [],
    ""
  );

  public customers: CustomerViewModel[] = [];
  public tags: TagViewModel[] = [];
  public get tagOptions(): Array<{ value: number; text: string }> {
    return this.tags.map((tag: TagViewModel) => ({
      value: tag.id,
      text: tag.name
    }));
  }
  public shoudSetRate: boolean = false;

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
      await this.getTags();
      await this.getCustomers();
      if (this.timeId !== undefined) {
        await this.getTime(this.timeId);
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
      time.task !== undefined && time.task.project !== undefined
        ? time.task.project.id.toString()
        : "",
      time.task !== undefined ? time.task.id.toString() : "",
      moment(time.from),
      time.to !== undefined ? moment(time.to) : undefined,
      time.rate !== undefined ? time.rate.toString() : "",
      time.tags !== undefined ? time.tags.map((tag: TagDTO) => tag.id) : [],
      time.comment || ""
    );

    if (this.time.rate !== "") {
      this.shoudSetRate = true;
    }
  }

  // Get all customers to be able to populate dropdown list
  public async getCustomers(): Promise<void> {
    const customers = await this.customerService.index();

    this.customers = customers.map(
      (customer: CustomerDTO) =>
        new CustomerViewModel(
          customer.id,
          customer.name,
          customer.projects !== undefined
            ? customer.projects.map(
                (project: ProjectDTO) =>
                  new ProjectViewModel(
                    project.id,
                    project.name,
                    project.tasks !== undefined
                      ? project.tasks.map(
                          (task: TaskDTO) =>
                            new TaskViewModel(task.id, task.name)
                        )
                      : []
                  )
              )
            : []
        )
    );

    // Set selected project and customer i dropdown menus
    this.time.projectId =
      this.customers.length > 0 && this.customers[0].projects.length > 0
        ? this.customers[0].projects[0].id.toString()
        : "0";
    this.time.taskId =
      this.customers.length > 0 &&
      this.customers[0].projects.length > 0 &&
      this.customers[0].projects[0].tasks.length > 0
        ? this.customers[0].projects[0].tasks[0].id.toString()
        : "0";

    return;
  }

  public async getTags(): Promise<void> {
    const tags: TagDTO[] = await this.tagService.index();
    this.tags = tags.map((tag: TagDTO) => ({
      id: tag.id,
      name: tag.name
    }));
  }

  public updateFromOrTo(type: "from" | "to") {
    if (type !== "from" && type !== "to") {
      throw new Error(`Type was wrong value. Expected "from" or "to"`);
    }
    let elementValue = ((this.$refs[`time-${type}`] as Vue).$el.querySelector(
      "input"
    ) as HTMLInputElement).value;
    console.log(elementValue);
    let value = moment(
      `${this.date.format("YYYY-MM-DD")} ${moment(elementValue, "HH:mm").format(
        "HH:mm"
      )}`,
      "YYYY-MM-DD HH:mm"
    );
    if (value.isValid()) {
      if (type === "from") {
        this.time.from = moment(
          `${this.date.format("YYYY-MM-DD")} ${value.format("HH:mm")}`,
          "YYYY-MM-DD HH:mm"
        );
      } else {
        if (elementValue !== "") {
          this.time.to = moment(
            `${this.date.format("YYYY-MM-DD")} ${value.format("HH:mm")}`,
            "YYYY-MM-DD HH:mm"
          );
        } else {
          this.time.to = undefined;
        }
      }
    }
  }

  public async save(): Promise<void> {
    // Update time input before initiating save
    this.updateFromOrTo("from");
    this.updateFromOrTo("to");

    if (this.time === null || this.time.projectId === undefined) {
      return;
    }
    try {
      this.saving = true;
      if (!this.edit) {
        await this.timeService.create(
          CreateTimeDTO.parse({
            taskId: parseInt(this.time.taskId, 10),
            from: this.time.from.format("YYYY-MM-DD HH:mm:ss").toString(),
            ...(this.time.to !== undefined
              ? { to: this.time.to.format("YYYY-MM-DD HH:mm:ss").toString() }
              : undefined),
            ...(this.shoudSetRate === true && this.time.rateValue !== undefined
              ? { rate: this.time.rateValue }
              : undefined),
            comment: this.time.comment,
            tags: this.time.tags,
            userId: this.authService.user!.id
          })
        );
      } else {
        await this.timeService.update(
          UpdateTimeDTO.parse({
            id: this.time.id as number,
            taskId: parseInt(this.time.taskId, 10),
            from: this.time.from.format("YYYY-MM-DD HH:mm:ss").toString(),
            ...(this.time.to !== undefined
              ? { to: this.time.to.format("YYYY-MM-DD HH:mm:ss").toString() }
              : undefined),
            ...(this.shoudSetRate === true && this.time.rateValue !== undefined
              ? { rate: this.time.rateValue }
              : undefined),
            comment: this.time.comment,
            tags: this.time.tags,
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