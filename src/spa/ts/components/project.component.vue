<template>
  <div>
    <div class="d-flex justify-content-between align-items-center">
      <h1>Project</h1>
      <button-component
        :route="{ name: 'time.project.create' }"
        v-if="isAdmin"
      >Skapa project</button-component>
    </div>
    <div
      class="card mb-5"
      v-for="project in projects"
      :key="`project_${project.id}`"
    >
      <div class="card-header d-flex justify-content-between">
        <div>{{ project.name }}</div>
        <div class>
          <router-link
            v-if="isAdmin"
            :to="{ name: 'time.project.edit', params: { id: project.id}}"
            v-tooltip="'Redigera'"
          >
            <i class="fas fa-edit"></i>
          </router-link>
          <a
            v-if="isAdmin"
            href
            v-on:click.prevent="deleteProject(project.id)"
          >
            <i
              v-tooltip="'Ta bort'"
              class="fas fa-times"
            ></i>
          </a>
        </div>
      </div>
      <div class="card-body">
        <bar-component
          :total-units="project.calculatedHoursBudget"
          suffix="h"
          :items="project.hoursBarItems"
        ></bar-component>
        <table class="mt-3 table table-sm table-striped table-hover">
          <thead class="thead-dark">
            <tr>
              <th>Användare</th>
              <th
                v-for="(task, index) in project.tasks"
                :key="`task_${index}`"
                class="text-center"
              >{{ task.name }}</th>
              <th>Totalt</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in project.users"
              :key="`user_${index}`"
            >
              <th>{{ user.email }}</th>
              <td
                v-for="(task, subIndex) in project.tasks"
                :key="`user_${index}_task_${subIndex}`"
                class="text-center"
              >{{ project.hoursPerUserByTask(user.id, task.id) }}h</td>
              <th>{{ project.hoursByUser(user.id) }}h</th>
            </tr>
            <tr class="table-primary">
              <th>Totalt</th>
              <th
                v-for="(task, index) in project.tasks"
                :key="`task_total_${index}`"
                class="text-center"
              >{{ project.hoursByTask(task.id) }}h</th>
              <th>{{ project.hours }}h</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// Libs
import { Vue, Component } from "vue-property-decorator";
import moment, { Moment } from "moment";

// Services
import { ProjectService } from "../services/project.service";
import { AuthService } from "../services/auth.service";

// DTO's
import { ProjectDTO } from "../../../shared/dto/project.dto";
import { TaskDTO } from "../../../shared/dto/task.dto";
import { UserDTO } from "../../../shared/dto/user.dto";
import { TimeDTO } from "../../../shared/dto/time.dto";
import { TaskUserDTO } from "../../../shared/dto/task-user.dto";

// Components
import ButtonComponent from "./layout/button.component.vue";
import BarComponent, { IBarItem } from "./layout/bar.component.vue";

// Bootstrap
import { bootstrap } from "../bootstrap";

class ProjectViewModel {
  public static colorMap: string[] = ["#f00", "#0f0", "#00f"];

  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly customer: CustomerViewModel,
    public readonly tasks: TaskViewModel[],
    public readonly rate?: number,
    public readonly priceBudget?: number,
    public readonly hoursBudget?: number
  ) {}

  public get users(): UserViewModel[] {
    return this.tasks.reduce(
      (previousValue: UserViewModel[], currentValue: TaskViewModel) => {
        return [
          ...previousValue,
          ...currentValue.users.filter(
            (taskUser: UserViewModel) =>
              previousValue.findIndex(
                (previousTaskUser: UserViewModel) =>
                  taskUser.id === previousTaskUser.id
              ) === -1
          ),
        ];
      },
      []
    );
  }

  public get hours(): number {
    return (
      Math.round(
        this.tasks.reduce(
          (previousValue: number, currentValue: TaskViewModel) =>
            previousValue + currentValue.hours,
          0
        ) * 100
      ) / 100
    );
  }
  public get tasksBudget(): number | undefined {
    let hoursBudgetSum = 0;
    for (const task of this.tasks) {
      if (task.hoursBudget === undefined) {
        return undefined;
      }
      hoursBudgetSum += task.hoursBudget;
    }

    return hoursBudgetSum;
  }
  /* Project hour budget will either be the sum of all task budgets
  * (if all of them have hours budget). Otherwise it will use
  the project set hour budget (if any)
  */
  public get calculatedHoursBudget(): number | undefined {
    if (this.tasksBudget !== undefined) {
      return this.tasksBudget;
    }

    return this.hoursBudget;
  }

  public get hoursBarItems(): IBarItem[] | undefined {
    if (this.tasksBudget !== undefined) {
      return this.tasks.map((task: TaskViewModel, index: number) => ({
        name: task.name,
        units: task.hours,
        budgetUnits: task.hoursBudget !== undefined ? task.hoursBudget : 0,
        color: ProjectViewModel.colorMap[index],
      }));
    }

    return undefined;
  }

  public hoursByUser(userId: number): number {
    return (
      Math.round(
        this.tasks.reduce(
          (previousValue: number, currentValue: TaskViewModel) => {
            return (
              previousValue + this.hoursPerUserByTask(userId, currentValue.id)
            );
          },
          0
        ) * 100
      ) / 100
    );
  }
  public hoursByTask(taskId: number): number {
    return (
      Math.round(
        this.tasks
          .find((task: TaskViewModel) => task.id === taskId)!
          .times.reduce(
            (previousValue: number, currentValue: TimeViewModel) => {
              return previousValue + currentValue.diff;
            },
            0
          ) * 100
      ) / 100
    );
  }

  public hoursPerUserByTask(userId: number, taskId: number): number {
    return (
      Math.round(
        this.tasks
          .find((task: TaskViewModel) => task.id === taskId)!
          .times.filter(
            (time: TimeViewModel) =>
              time.userId === userId && time.to !== undefined
          )
          .reduce(
            (previousValue: number, currentValue: TimeViewModel) =>
              previousValue + currentValue.diff,
            0
          ) * 100
      ) / 100
    );
  }
}

class UserViewModel {
  public constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly rate?: number
  ) {}
}

class CustomerViewModel {
  public constructor(
    public readonly id: number,
    public readonly name: string
  ) {}
}

class TaskViewModel {
  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly times: TimeViewModel[],
    public readonly users: UserViewModel[],
    public readonly rate?: number,
    public readonly priceBudget?: number,
    public readonly hoursBudget?: number
  ) {}

  public get hours(): number {
    return (
      Math.round(
        this.times.reduce(
          (previousValue: number, currentValue: TimeViewModel) =>
            currentValue.to !== undefined
              ? previousValue + currentValue.diff
              : 0,
          0
        ) * 100
      ) / 100
    );
  }
}

class TimeViewModel {
  public constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly from: Moment,
    public readonly to?: Moment
  ) {}

  public get diff(): number {
    if (this.to !== undefined) {
      return Math.round((this.to.diff(this.from, "minutes") / 60) * 100) / 100;
    }
    return 0;
  }
}

@Component({ components: { ButtonComponent, BarComponent } })
export default class ProjectComponent extends Vue {
  public get isAdmin(): boolean {
    return bootstrap.authService.isAdmin;
  }

  public projects: ProjectViewModel[] = [];

  public mounted() {
    this.getProjects();
  }

  public async getProjects() {
    this.projects = (await bootstrap.projectService.index()).map(
      (project: ProjectDTO) =>
        new ProjectViewModel(
          project.id,
          project.name,
          new CustomerViewModel(project.customer!.id, project.customer!.name),
          project.tasks !== undefined
            ? project.tasks.map(
                (task: TaskDTO) =>
                  new TaskViewModel(
                    task.id,
                    task.name,
                    task.times !== undefined
                      ? task.times.map(
                          (time: TimeDTO) =>
                            new TimeViewModel(
                              time.id,
                              time.user!.id,
                              moment(time.from),
                              time.to !== undefined
                                ? moment(time.to)
                                : undefined
                            )
                        )
                      : [],
                    task.users !== undefined
                      ? task.users.map((user: TaskUserDTO) => ({
                          id: user.user.id,
                          email: user.user.email,
                        }))
                      : [],
                    task.rate,
                    task.priceBudget,
                    task.hoursBudget
                  )
              )
            : [],
          project.rate,
          project.priceBudget,
          project.hoursBudget
        )
    );
  }
  public async deleteProject(projectId: number) {
    if (confirm("Är du säker?")) {
      await bootstrap.projectService.delete(projectId);
      await this.getProjects();
    }
  }
}
</script>
<style lang="scss" scoped>
</style>