<template>
  <div class="">
    <div class="d-flex justify-content-between align-items-center">
      <button-component
        :route="{ name: 'time.project' }"
        buttonStyle="primary"
        buttonType="outlined"
      >
        <i class="fas fa-arrow-left"></i>
        Tillbaka
      </button-component>
      <h1>Skapa projekt</h1>
    </div>
    <div>
      <project-form-component v-on:submit="save"></project-form-component>
    </div>
  </div>
</template>
<script lang="ts">
// Libs
import { Vue, Component } from "vue-property-decorator";

// DTO's
import { CreateProjectDTO } from "../../../shared/dto/create-project.dto";
import { CreateTaskUserDTO } from "../../../shared/dto/create-task-user.dto";
import { CreateTaskDTO } from "../../../shared/dto/create-task.dto";

// Services
import { ProjectService } from "../services/project.service";
import { AuthService } from "../services/auth.service";
import { MessageService } from "../services/message.service";

// Components
import ButtonComponent from "./layout/button.component.vue";
// import DatePickerComponent from "./layout/date-picker.component.vue";
import ProjectFormComponent from "./project-form.component.vue";

// Bootstrap
import { bootstrap } from "../bootstrap";
@Component({
  components: {
    ButtonComponent,
    ProjectFormComponent,
    // DatePickerComponent
  },
})
export default class CreateProjectComponent extends Vue {
  public loading: boolean = false;
  public saving: boolean = false;

  public async save(createProject: CreateProjectDTO) {
    this.saving = true;
    try {
      await bootstrap.projectService.create(createProject);
      this.saving = false;
      this.$router.push({ name: "time.project" });
    } catch {
      bootstrap.messageService.showModal(
        "error",
        this.$t("project.create.error.header").toString(),
        this.$t("project.create.error.message").toString(),
        () => (this.saving = false)
      );
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../scss/variables.scss";
@import "~bootstrap/scss/bootstrap-grid";
</style>