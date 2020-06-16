<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
      <button-component
        :route="{ name: 'time.project' }"
        buttonStyle="primary"
        buttonType="outlined"
      >
        <i class="fas fa-arrow-left"></i>
        Tillbaka
      </button-component>
      <h1>Redigera projekt</h1>
    </div>
    <div>
      <project-form-component
        :project-id="projectId"
        v-on:submit="save"
      ></project-form-component>
    </div>
  </div>
</template>
<script lang="ts">
// Libs
import { Vue, Component } from "vue-property-decorator";

// Services
import { ProjectService } from "../services/project.service";
import { MessageService } from "../services/message.service";

// Components
import ProjectFormComponent from "./project-form.component.vue";
import ButtonComponent from "./layout/button.component.vue";

// Bootstrap
import {
  projectService as projectServiceInstance,
  messageService as messageServiceInstance
} from "../bootstrap";
import { ProjectDTO } from "../../../shared/dto/project.dto";

@Component({
  components: { ProjectFormComponent, ButtonComponent }
})
export default class EditProjectComponent extends Vue {
  public projectService: ProjectService = projectServiceInstance;
  public messageService: MessageService = messageServiceInstance;

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
    this.saving = true;
    try {
      await this.projectService.update(project);
      this.saving = false;
      this.$router.push({ name: "time.project" });
    } catch {
      this.messageService.showModal(
        "error",
        this.$t("project.update.error.header").toString(),
        this.$t("project.update.error.message").toString(),
        () => (this.saving = false)
      );
    }
  }
}
</script>
<style lang="scss" scoped>
</style