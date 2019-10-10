<template>
  <div class="container">
    <nav-component>
      <router-link :to="{ name: 'time.result.week' }" active-class="active">Vecka</router-link>
      <router-link :to="{ name: 'time.result.month' }" active-class="active">Månad</router-link>
    </nav-component>
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import { TimeDTO, ITimeDTO } from "../../../shared/dto/time.dto";

import NavComponent from "./layout/nav.component.vue";
import { TimeService } from "../services/time.service";
import { timeService as timeServiceInstance } from "../bootstrap";
import { TimeQueryDTO } from "../../../shared/dto/time-query.dto";

@Component({
  components: { NavComponent }
})
export default class TimeResultComponent extends Vue {
  private readonly timeService: TimeService = timeServiceInstance;

  public times: ITimeDTO[] = [];
  public mounted() {
    this.getTimes();
  }
  public async getTimes() {
    this.times = (await this.timeService.index(
      TimeQueryDTO.parse({
        year: "2019",
        week: "32"
      })
    )).map((time: TimeDTO) => time.serialize());
  }
}
</script>
<style lang="scss" scoped>
</style>