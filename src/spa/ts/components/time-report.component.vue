<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div>
        <button-component style="font-size: 3rem; padding: 1rem;" v-on:click="open">
          <i class="fas fa-plus"></i>
        </button-component>
      </div>
      <div class="d-flex align-items-start" style="height: 100%">
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
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Moment, default as moment } from "moment";

import {
  ModalInstance,
  modalEventType,
  modalSize
} from "../utils/modal/modal.util";

import ButtonComponent from "./layout/button.component.vue";
import TimeReportFormComponent from "./time-report-form.component.vue";

@Component({
  components: { ButtonComponent }
})
export default class TimeReportComponent extends Vue {
  public date: Moment = moment(new Date());
  public dateFormat: string = this.date.format("YYYY-MM-DD");

  public nextDay() {
    this.date.add(1, "days");
    this.dateFormat = this.date.format("YYYY-MM-DD");
  }
  public previousDay() {
    this.date.subtract(1, "days");
    this.dateFormat = this.date.format("YYYY-MM-DD");
  }
  public setToday() {
    this.date = moment(new Date());
    this.dateFormat = this.date.format("YYYY-MM-DD");
  }

  public open(): void {
    const modal = ModalInstance.create<any, any>(
      TimeReportFormComponent,
      {
          
      }
    ).options({ size: modalSize.LG });
    modal.open();
    modal.on([modalEventType.HIDDEN, modalEventType.CLOSED], () => {});
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