<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
      <h1>Project</h1>
      <button-component :route="{ name: 'time.project.create' }" v-if="isAdmin">Skapa project</button-component>
    </div>
    <div class="card mb-5" v-for="project in projects" :key="`project_${project.id}`">
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
          <a href v-on:click.prevent="deleteProject(project.id)">
            <i v-tooltip="'Ta bort'" class="fas fa-times"></i>
          </a>
        </div>
      </div>
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
import { AuthService } from "../services/auth.service";
import {
  projectService as projectServiceInstance,
  authService as authServiceInstance
} from "../bootstrap";
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
  public authService: AuthService = authServiceInstance;

  public get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

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
  public async deleteProject(projectId: number) {
    if (confirm("Är du säker?")) {
      await this.projectService.delete(projectId);
      await this.getProjects();
    }
  }
}
</script>
<style lang="scss" scoped>
</style>