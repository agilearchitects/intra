<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div>
        <button-component style="font-size: 3rem; padding: 1rem;" v-on:click="openModal">
          <i class="fas fa-plus"></i>
        </button-component>
      </div>
      <div>
        <div class="d-flex align-items-start">
          <button-component v-on:click="previousDay">
            <i class="fas fa-chevron-left"></i>
          </button-component>
          <div
            class="time-report__date-placeholder cursor-pointer"
            v-on:click="setToday"
          >{{ dateFormat }}</div>
          <button-component v-on:click="nextDay">
            <i class="fas fa-chevron-right"></i>
          </button-component>
        </div>
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
        <template v-if="!time.isActive">
          <br />
          <i class="text-muted">{{ time.timeFormatted }}</i>
        </template>
      </div>
      <p class="flex-fill px-2">
        <i>{{ time.comment }}</i>
      </p>
      <div class="pl-2">
        <p class="text-right nowrap">{{ time.hours }}h {{ time.minutes }}m</p>
        <div class="d-flex justify-content-end">
          <button-component class="mr-2" v-if="time.isActive" v-on:click="stop(time.id)">Stop</button-component>
          <button-component class="px-2" v-on:click="openModal(time.id)">
            <i class="fas fa-edit"></i>
          </button-component>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Moment, default as moment, Duration } from "moment";

import {
  ModalInstance,
  modalEventType,
  modalSize
} from "../utils/modal/modal.util";

class TimeViewModel {
  public constructor(
    public id: number,
    public project: { id: number; name: string },
    public customer: { id: number; name: string },
    public from: Moment,
    public to: Moment | undefined,
    public comment: string
  ) {
    this.setDuration();
    if (this.isActive) {
      setInterval(() => {
        this.setDuration();
      }, 1000);
    }
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
    return `${this.fromFormatted} ${this.toFormatted}`;
  }

  public setDuration() {
    this.duration = moment.duration(
      (this.to !== undefined ? this.to : moment()).diff(this.from)
    );
    this._hours = Math.floor(this.duration.asHours());
    this._minutes = Math.floor(this.duration.asMinutes() % 60);
  }
}

import ButtonComponent from "./layout/button.component.vue";
import TimeReportFormComponent from "./time-report-form.component.vue";
import { Action } from "vuex-class";
import { timeIndexAction, timeStopAction } from "../store/time.store";
import { TimeDTO } from "../../../shared/dto/time.dto";
import { StopTimeDTO } from "../../../shared/dto/stop-time.dto";

@Component({
  components: { ButtonComponent }
})
export default class TimeReportComponent extends Vue {
  @Action("time/index") timeIndexAction!: timeIndexAction;
  @Action("time/stop") timeStopAction!: timeStopAction;

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

  public getReports() {
    this.timeIndexAction({ date: this.date }).then((times: TimeDTO[]) => {
      this.times = times
        .map(
          (time: TimeDTO) =>
            new TimeViewModel(
              time.id,
              time.project !== undefined
                ? { id: time.project.id, name: time.project.name }
                : { id: 0, name: "" },
              time.project !== undefined && time.project.customer !== undefined
                ? {
                    id: time.project.customer.id,
                    name: time.project.customer.name
                  }
                : { id: 0, name: "" },
              moment(time.from),
              time.to !== undefined ? moment(time.to) : undefined,
              time.comment
            )
        )
        .sort((a: TimeViewModel, b: TimeViewModel) =>
          a.to !== undefined && a.from.toDate() > a.from.toDate() ? -1 : 1
        );
    });
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

  public stop(timeId: number) {
    this.timeStopAction(
      StopTimeDTO.parse({
        id: timeId,
        to: moment().format("YYYY-MM-DD HH:mm:ss")
      })
    )
      .then(() => this.getReports())
      .catch(() => alert("Something went wrong. Try again"));
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