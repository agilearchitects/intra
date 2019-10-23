<template>
  <div class="container">
    <slot
      name="header"
      v-bind:next="next"
      v-bind:previous="previous"
      v-bind:today="today"
      v-bind:date="dateFormat"
      v-bind:labelStyle="'width: 150px;'"
    ></slot>
    <div>
      <h1 v-if="customers.length === 0">
        <i>Inga tidrapporter :(</i>
      </h1>
      <div v-for="customer in customers" :key="`customer_${customer.id}`">
        <h1>Kund: {{ customer.name }} - {{ customer.hours }}h</h1>
        <div v-for="project in customer.projects" :key="`project_${project.id}`">
          <h2>{{ project.name }} - {{ project.hours }}h</h2>
          <ul>
            <li v-for="tag in project.tags" :key="`tag_${tag.id}`">{{ tag.name }} - {{ tag.hours }}h</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// Libs
import { Vue, Component, Watch } from "vue-property-decorator";
import { Moment, default as moment, Duration } from "moment";
import "moment/locale/sv";
// Services
import { TimeService } from "../services/time.service";

// DTO's
import { TagDTO } from "../../../shared/dto/tag.dto";
import { TimeQueryDTO } from "../../../shared/dto/time-query.dto";
import { TimeDTO } from "../../../shared/dto/time.dto";

// Bootstrap
import { timeService as timeServiceInstance } from "../bootstrap";

// Components
import {
  CustomerViewModel,
  ProjectViewModel,
  TagViewModel,
  TimeViewModel
} from "./time-result.component.vue";
import { CustomerDTO } from "../../../shared/dto/customer.dto";
import { ProjectDTO } from "../../../shared/dto/project.dto";

@Component
export default class TimeResultMonthComponent extends Vue {
  private readonly timeService: TimeService = timeServiceInstance;

  @Watch("date") onDateChange() {
    this.getReports();
  }

  public get date(): Date {
    if (
      typeof this.$route.query.year === "string" &&
      typeof this.$route.query.month === "string"
    ) {
      const momentDate = moment(
        `${this.$route.query.year}-${this.$route.query.month}`,
        "YYYY-M",
        true
      );
      if (momentDate.isValid()) {
        return momentDate.toDate();
      }
    }
    return new Date();
  }

  public set date(value: Date) {
    this.$router.push({
      query: {
        year: moment(value).format("YYYY"),
        month: moment(value).format("M")
      }
    });
  }

  public get dateFormat(): string {
    const date = moment(this.date).locale("sv");
    const year = date.format("YYYY");
    const month = date.format("MMMM");
    return `${this.ucFirst(month)} ${year}`;
  }

  private ucFirst(value: string) {
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
  }

  public customers: CustomerViewModel[] = [];

  public mounted() {
    this.getReports();
  }

  public next() {
    this.date = moment(this.date)
      .add(1, "month")
      .toDate();
  }
  public previous() {
    this.date = moment(this.date)
      .subtract(1, "month")
      .toDate();
  }
  public today() {
    this.date = new Date();
  }

  public async getReports() {
    this.customers = ((await this.timeService.index(
      TimeQueryDTO.parse({
        year: moment(this.date).format("YYYY"),
        month: moment(this.date).format("M"),
        groupBy: "customer"
      })
    )) as CustomerDTO[]).map(
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
                    project.times !== undefined
                      ? project.times.map(
                          (time: TimeDTO) =>
                            new TimeViewModel(
                              time.id,
                              moment(time.from),
                              time.to !== undefined
                                ? moment(time.to)
                                : undefined,
                              time.tags !== undefined
                                ? time.tags.map(
                                    (tag: TagDTO) =>
                                      new TagViewModel(tag.id, tag.name)
                                  )
                                : [],
                              time.comment
                            )
                        )
                      : []
                  )
              )
            : []
        )
    );
  }
}
</script>
<style lang="scss" scoped>
</style>