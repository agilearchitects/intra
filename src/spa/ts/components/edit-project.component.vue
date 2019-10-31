<template>
  <div class="container">
    <project-form-component :project-id="projectId" v-on:submit="save"></project-form-component>
  </div>
</template>
<script lang="ts">
// Libs
import { Vue, Component } from "vue-property-decorator";

// Services
import { ProjectService } from "../services/project.service";

// Components
import ProjectFormComponent from "./project-form.component.vue";

// Bootstrap
import { projectService as projectServiceInstance } from "../bootstrap";
import { ProjectDTO } from "../../../shared/dto/project.dto";

@Component({
  components: { ProjectFormComponent }
})
export default class EditProjectComponent extends Vue {
  public projectService: ProjectService = projectServiceInstance;

  public loading: boolean = false;
  public saving: boolean = false;

  public get projectId(): number {
    try {
      return parseInt(this.$route.params.id, 10);
    } catch (error) {
      throw error;
    }
  }

  public async save(project: ProjectDTO) {
    console.log(project);
    this.saving = true;
    try {
      await this.projectService.update(project);
    } catch {
      alert("Something went wrong. Please try again");
    }
    this.saving = false;
  }
}
</script>
<style lang="scss" scoped>
</style