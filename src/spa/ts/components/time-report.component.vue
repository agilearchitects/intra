<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div>
        <button-component
          style="font-size: 3rem; padding: 1rem;"
          v-on:click="openModal"
        >
          <i class="fas fa-plus"></i>
        </button-component>
      </div>
      <div>
        <time-date-component
          v-on:next="nextDay"
          v-on:previous="previousDay"
          v-on:today="setToday"
        >{{ dateFormat }}</time-date-component>
        <div class="mt-2 text-right">
          <strong>Totalt: {{ totalTime }}</strong>
        </div>
      </div>
    </div>
    <div
      class="d-flex py-3 mb-3"
      style="border-bottom: 1px solid gray;"
      v-for="(time, index) in times"
      :key="`time_${index}`"
    >
      <div class="pr-2 nowrap">
        <strong>{{ time.project.name }}</strong>
        <br />
        <span>{{ time.customer.name }}</span>
        <br />
        <i class="text-muted">{{ time.timeFormatted }}</i>
      </div>
      <div class="flex-fill px-2">
        <div class="d-block">
          <strong>Task:</strong>
          <i>{{ time.task.name }}</i>
        </div>
        <div
          class="d-flex align-items-center"
          v-if="time.tags.length > 0"
        >
          <strong>Tags:</strong>
          <pill-component
            class="mx-1"
            v-for="tag in time.tags"
            :key="`time_${time.id}_tag_${tag.id}`"
          >{{ tag.name }}</pill-component>
        </div>
        <div>
          <strong>Kommentar:</strong>
          <i>{{ time.comment }}</i>
        </div>
      </div>
      <div class="pl-2">
        <p class="text-right nowrap">{{ time.hours }}h {{ time.minutes }}m</p>
        <div class="d-flex justify-content-end">
          <button-component
            class="mr-2"
            v-if="time.isActive"
            v-on:click="stop(time.id)"
          >Stop</button-component>
          <button-component
            class="px-2"
            v-on:click="openModal(time.id)"
          >
            <i class="fas fa-edit"></i>
          </button-component>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// Libs
import { Vue, Component, Watch } from "vue-property-decorator";
import { Moment, default as moment, Duration } from "moment";

// Services
import { TimeService } from "../services/time.service";
import { MessageService } from "../services/message.service";

// DTO's
import { TimeDTO } from "../../../shared/dto/time.dto";
import { StopTimeDTO } from "../../../shared/dto/stop-time.dto";
import { TimeQueryDTO } from "../../../shared/dto/time-query.dto";
import { TagDTO } from "../../../shared/dto/tag.dto";

// Components
import ButtonComponent from "./layout/button.component.vue";
import TimeReportFormComponent from "./time-report-form.component.vue";
import TimeDateComponent from "./time-date.component.vue";
import PillComponent from "./layout/pill.component.vue";

// Bootstrap
import {
  timeService as timeServiceInstance,
  messageService as messageServiceInstance
} from "../bootstrap";

import {
  ModalInstance,
  modalEventType,
  modalSize
} from "../utils/modal/modal.util";

class TaskViewModel {
  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly project: ProjectViewModel
  ) {}
}

class ProjectViewModel {
  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly customer: CustomerViewModel
  ) {}
}

class CustomerViewModel {
  public constructor(
    public readonly id: number,
    public readonly name: string
  ) {}
}

interface ITagViewModel {
  id: number;
  name: string;
}

export class TimeViewModel {
  public constructor(
    public readonly id: number,
    public readonly task: TaskViewModel,
    public readonly from: Moment,
    public readonly to: Moment | undefined,
    public readonly tags: ITagViewModel[],
    public readonly comment: string
  ) {
    this.setDuration();
    if (this.isActive) {
      setInterval(() => {
        this.setDuration();
      }, 1000);
    }
  }

  public get project() {
    return this.task.project;
  }

  public get customer() {
    return this.task.project.customer;
  }

  public duration: Duration = moment.duration(
    (this.to !== undefined ? this.to : moment()).diff(this.from)
  );

  private _hours: number = 0;
  public get hours(): number {
    return this._hours;
  }

  private _minutes: number = 0;
  public get minutes(): number {
    return this._minutes;
  }

  public get isActive() {
    return this.to === undefined;
  }

  public get fromFormatted(): string {
    return moment(this.from, "YYYY-MM-DD HH:mm:ss", true).format("HH:mm");
  }
  public get toFormatted(): string {
    const momentDate = moment(this.to, "YYYY-MM-DD HH:mm:ss", true);
    if (momentDate.isValid()) {
      return momentDate.format("HH:mm");
    } else {
      return "-";
    }
  }
  public get timeFormatted(): string {
    if (this.to === undefined) {
      return `${this.fromFormatted} -`;
    }
    return `${this.fromFormatted} - ${this.toFormatted}`;
  }

  public setDuration() {
    this.duration = moment.duration(
      (this.to !== undefined ? this.to : moment()).diff(this.from)
    );
    this._hours = Math.floor(this.duration.asHours());
    this._minutes = Math.floor(this.duration.asMinutes() % 60);
  }
}

@Component({
  components: { ButtonComponent, TimeDateComponent, PillComponent }
})
export default class TimeReportComponent extends Vue {
  private readonly timeService: TimeService = timeServiceInstance;
  private readonly messageService: MessageService = messageServiceInstance;

  @Watch("date") onDateChange() {
    this.getReports();
  }

  public get date(): Date {
    if (typeof this.$route.query.date === "string") {
      const momentDate = moment(this.$route.query.date, "YYYY-MM-DD", true);
      if (momentDate.isValid()) {
        return momentDate.toDate();
      }
    }
    return new Date();
  }

  public set date(value: Date) {
    this.$router.push({ query: { date: moment(value).format("YYYY-MM-DD") } });
  }

  public get dateFormat(): string {
    return moment(this.date).format("YYYY-MM-DD");
  }

  public get totalTime(): string {
    let totalDuration: number = 0;
    this.times.forEach((time: TimeViewModel) => {
      totalDuration += time.duration.asMinutes();
    });

    return `${Math.floor(totalDuration / 60)}h ${Math.round(
      totalDuration % 60
    )}m`;
  }

  public times: TimeViewModel[] = [];

  public created() {
    if (typeof this.$route.query.date !== "string") {
      this.date = new Date();
    }
  }
  public mounted() {
    this.getReports();
  }

  public nextDay() {
    this.date = moment(this.date)
      .add(1, "days")
      .toDate();
  }
  public previousDay() {
    this.date = moment(this.date)
      .subtract(1, "days")
      .toDate();
  }
  public setToday() {
    this.date = new Date();
  }

  public async getReports() {
    this.times = ((await this.timeService.index(
      TimeQueryDTO.parse({
        date: moment(this.date).format("YYYY-MM-DD")
      })
    )) as TimeDTO[])
      .map(
        (time: TimeDTO) =>
          new TimeViewModel(
            time.id,
            {
              id: time.task!.id,
              name: time.task!.name,
              project: {
                id: time.task!.project!.id,
                name: time.task!.project!.name,
                customer: {
                  id: time.task!.project!.customer!.id,
                  name: time.task!.project!.customer!.name
                }
              }
            },
            moment(time.from),
            time.to !== undefined ? moment(time.to) : undefined,
            time.tags !== undefined
              ? time.tags.map((tag: TagDTO) => ({ id: tag.id, name: tag.name }))
              : [],
            time.comment
          )
      )
      .sort((a: TimeViewModel, b: TimeViewModel) =>
        a.to !== undefined && a.from.toDate() > a.from.toDate() ? -1 : 1
      );
  }

  private openModal(timeId?: number) {
    const modal = ModalInstance.create<any, any>(TimeReportFormComponent, {
      date: moment(this.date),
      ...(timeId !== undefined ? { timeId } : undefined)
    }).options({ size: modalSize.LG });
    modal.open();
    modal.on([modalEventType.HIDDEN, modalEventType.CLOSED], () => {
      this.getReports();
    });
  }

  public async stop(timeId: number) {
    try {
      await this.timeService.stop(
        StopTimeDTO.parse({
          id: timeId,
          to: moment().format("YYYY-MM-DD HH:mm:ss")
        })
      );
      this.getReports();
    } catch (error) {
      this.messageService.showModal(
        "error",
        this.$t("time.stop.error.header").toString(),
        this.$t("time.stop.error.message").toString()
      );
    }
  }
}
</script>
<style lang="scss" scoped>
.time-report {
  &__date-placeholder {
    padding: 0% 1rem;
    border-width: 1px 0px;
    border-style: solid;
    border-color: #000;
    align-self: stretch;
    display: flex;
    align-items: center;
  }
}
</style>