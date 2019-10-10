<template>
  <div class="container">
    <div v-if="loading">LOADING!!!</div>
    <template v-else-if="text">
      <tiny-mce
        v-if="editMode && isAdmin"
        :disabled="saving"
        :inline="true"
        v-model="text.content"
        :init="tinyMCEInitWith"
      ></tiny-mce>
      <div v-else v-html="text.content"></div>
    </template>
  </div>
</template>
<script lang="ts">
import Editor from "@tinymce/tinymce-vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { TextDTO, ITextDTO } from "../../../shared/dto/text.dto";
import { ITinyMCESettings, init as tinyMCEInit } from "../utils/tinymce";
import { AuthService } from "../services/auth.service";
import {
  authService as authServiceInstance,
  textService as textServiceInstance
} from "../bootstrap";
import { TextService } from "../services/text.service";

@Component({
  components: { tinyMce: Editor }
})
export default class TextComponent extends Vue {
  private readonly authService: AuthService = authServiceInstance;
  private readonly textService: TextService = textServiceInstance;
  @Prop(String) name!: string;
  @Watch("name") onNameChange() {
    this.getText();
  }

  public get textName(): string {
    return this.$route.params.name !== undefined
      ? this.$route.params.name
      : this.name;
  }
  public loading: boolean = false;
  public tinyMCEInitWith!: ITinyMCESettings;

  public text: ITextDTO | null = null;
  public saving: boolean = false;

  public created() {
    this.loading = true;
  }

  public mounted() {
    this.getText();
    this.tinyMCEInitWith = tinyMCEInit("saveButton | ", (editor: any) => {
      editor.ui.registry.addButton("SaveButton", {
        text: "Save",
        onAction: () => {
          this.save();
        }
      });
    });
  }

  public temp = "<span>{{ 1 +2 }}</span>";

  public getText() {
    this.loading = true;
    this.textService.show(this.textName).then((text: TextDTO) => {
      this.loading = false;
      this.text = text.serialize();
      if (this.text.content === "") {
        this.text.content = "<i>Saknar innehåll</i>";
      }
    });
  }

  public save() {
    if (this.text === null) {
      return;
    }
    this.saving = true;
    this.textService
      .update(TextDTO.parse(this.text))
      .then(() => {
        alert("Text sparad");
        this.saving = false;
      })
      .catch((error: any) => {
        alert("Something went wrong");
        this.saving = false;
      });
  }
}
</script>