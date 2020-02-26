<template>
  <router-view>
    <template v-slot:header="props">
      <div class="d-flex justify-content-between">
        <nav-component>
          <router-link :to="{ name: 'time.result.week' }" active-class="active">Vecka</router-link>
          <router-link :to="{ name: 'time.result.month' }" active-class="active">Månad</router-link>
        </nav-component>
        <div>
          <time-date-component
            v-on:next="props.next"
            v-on:previous="props.previous"
            v-on:today="props.today"
            :labelStyle="props.labelStyle"
          >{{ props.date }}</time-date-component>
        </div>
      </div>
    </template>
  </router-view>
</template>
<script lang="ts">
// Libs
import { Vue, Component } from "vue-property-decorator";

// Components
import NavComponent from "./layout/nav.component.vue";
import TimeDateComponent from "./time-date.component.vue";

@Component({
  components: { NavComponent, TimeDateComponent }
})
export default class TimeResultComponent extends Vue {
  public mounted() {
    // Push to week route if no sub-route is set
    if (this.$route.name === "time.result") {
      this.$router.push({ name: "time.result.week" });
    }
  }
}
</script>
<style lang="scss" scoped>
</style>