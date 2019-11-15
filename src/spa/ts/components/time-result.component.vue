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
import { Vue, Component } from "vue-property-decorator";
import { Moment, default as moment, Duration } from "moment";

import { TimeDTO, ITimeDTO } from "../../../shared/dto/time.dto";

import NavComponent from "./layout/nav.component.vue";
import { TimeService } from "../services/time.service";
import { timeService as timeServiceInstance } from "../bootstrap";
import { TimeQueryDTO } from "../../../shared/dto/time-query.dto";
import TimeDateComponent from "./time-date.component.vue";

export class CustomerViewModel {
  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly projects: ProjectViewModel[]
  ) {}

  public get hours(): number {
    const hours = this.projects.reduce(
      (previousValue: number, currentValue: ProjectViewModel) =>
        previousValue + currentValue.hours,
      0
    );
    return Math.round(hours * 100) / 100;
  }
}

export class ProjectViewModel {
  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly times: TimeViewModel[]
  ) {}

  public get hours(): number {
    const hours = this.times.reduce(
      (previousValue: number, currentValue: TimeViewModel) => {
        const duration = moment.duration(
          (currentValue.to !== undefined ? currentValue.to : moment()).diff(
            currentValue.from
          )
        );
        return previousValue + Math.round(duration.asHours() * 100) / 100;
      },
      0
    );
    return Math.round(hours * 100) / 100;
  }
  public get tags(): Array<{ id: number; name: string; hours: number }> {
    const tags: Array<{ id: number; name: string; hours: number }> = [];
    for (const time of this.times) {
      for (const tag of time.tags) {
        if (
          tags.findIndex((tempTag: TagViewModel) => tempTag.id === tag.id) ===
          -1
        ) {
          tags.push({
            id: tag.id,
            name: tag.name,
            hours: (() => {
              const hours = this.times.reduce(
                (previousValue: number, currentValue: TimeViewModel) => {
                  if (
                    currentValue.tags.findIndex(
                      (tempTag: TagViewModel) => tempTag.id === tag.id
                    ) !== -1
                  ) {
                    const duration = moment.duration(
                      (currentValue.to !== undefined
                        ? currentValue.to
                        : moment()
                      ).diff(currentValue.from)
                    );
                    return (
                      previousValue + Math.round(duration.asHours() * 100) / 100
                    );
                  }
                  return previousValue;
                },
                0
              );
              return Math.round(hours * 100) / 100;
            })()
          });
        }
      }
    }

    return tags;
  }
}

export class TimeViewModel {
  public constructor(
    public readonly id: number,
    public readonly from: Moment,
    public readonly to: Moment | undefined,
    public readonly tags: TagViewModel[],
    public readonly comment: string
  ) {}
}

export class TagViewModel {
  public constructor(
    public readonly id: number,
    public readonly name: string
  ) {}
}

@Component({
  components: { NavComponent, TimeDateComponent }
})
export default class TimeResultComponent extends Vue {
  private readonly timeService: TimeService = timeServiceInstance;

  public times: ITimeDTO[] = [];
  public mounted() {
    if (this.$route.name === "time.result") {
      this.$router.push({ name: "time.result.week" });
    }
  }
}
</script>
<style lang="scss" scoped>
</style>