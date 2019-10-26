<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
      <h1>Project</h1>
      <button-component :route="{ name: 'time.project.create' }">Skapa project</button-component>
    </div>
    <div class="card mb-5" v-for="project in projects" :key="`project_${project.id}`">
      <div class="card-header">{{ project.name }}</div>
      <div class="card-body">
        <h5 class="card-title">Special title treatment</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { ProjectService } from "../services/project.service";
import { projectService as projectServiceInstance } from "../bootstrap";
import { ProjectDTO } from "../../../shared/dto/project.dto";
import { TaskDTO } from "../../../shared/dto/task.dto";
import { UserDTO } from "../../../shared/dto/user.dto";
import ButtonComponent from "./layout/button.component.vue";

class ProjectViewModel {
  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly customer?: CustomerViewModel,
    public readonly tasks?: TaskViewModel[],
    public readonly users?: UserViewModel[]
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
    public readonly name: string
  ) {}
}

class UserViewModel {
  public constructor(
    public readonly id: number,
    public readonly email: string
  ) {}
}

@Component({ components: { ButtonComponent } })
export default class ProjectComponent extends Vue {
  private readonly projectService: ProjectService = projectServiceInstance;

  public projects: ProjectViewModel[] = [];

  public mounted() {
    this.getProjects();
  }

  public async getProjects() {
    this.projects = (await this.projectService.index()).map(
      (project: ProjectDTO) =>
        new ProjectViewModel(
          project.id,
          project.name,
          project.customer !== undefined
            ? new CustomerViewModel(project.customer.id, project.customer.name)
            : undefined,
          project.tasks !== undefined
            ? project.tasks.map(
                (task: TaskDTO) => new TaskViewModel(task.id, task.name)
              )
            : undefined,
          project.users !== undefined
            ? project.users.map(
                (user: UserDTO) => new UserViewModel(user.id, user.email)
              )
            : undefined
        )
    );
  }
}
</script>
<style lang="scss" scoped>
</style>