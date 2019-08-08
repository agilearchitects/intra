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
import { Action } from "vuex-class";

import { TimeDTO } from "../../../shared/dto/time.dto";

import { timeIndexAction } from "../store/time.store";

import NavComponent from "./layout/nav.component.vue";

@Component({
  components: { NavComponent }
})
export default class TimeResultComponent extends Vue {
  @Action("time/index") timeIndexAction!: timeIndexAction;

  public times: TimeDTO[] = [];
  public mounted() {
    this.getTimes();
  }
  public getTimes() {
    this.timeIndexAction({ year: "2019", week: "32" }).then(
      (times: TimeDTO[]) => {
        this.times = times;
      }
    );
  }
}
</script>
<style lang="scss" scoped>
</style>