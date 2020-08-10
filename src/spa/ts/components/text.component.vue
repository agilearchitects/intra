<template>
  <div>
    <div v-if="loading">LOADING!!!</div>
    <template v-else-if="text">
      <tiny-mce
        v-if="editMode && isAdmin"
        :disabled="saving"
        :inline="true"
        v-model="text.content"
        :init="tinyMCEInitWith"
      ></tiny-mce>
      <div
        v-else
        v-html="text.content"
      ></div>
    </template>
  </div>
</template>
<script lang="ts">
import Editor from "@tinymce/tinymce-vue";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { TextDTO, ITextDTO } from "../../../shared/dto/text.dto";
import { ITinyMCESettings, init as tinyMCEInit } from "../utils/tinymce";
import { AuthService } from "../services/auth.service";
import { bootstrap } from "../bootstrap";
import { TextService } from "../services/text.service";
import { MessageService } from "../services/message.service";

@Component({
  components: { tinyMce: Editor },
})
export default class TextComponent extends Vue {
  @Prop(String) name!: string;
  @Watch("name") onNameChange() {
    this.getText();
  }

  public get isAdmin(): boolean {
    return bootstrap.authService.isAdmin;
  }
  public get editMode(): boolean {
    return bootstrap.authService.editMode;
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
        },
      });
    });
  }

  public temp = "<span>{{ 1 +2 }}</span>";

  public getText() {
    this.loading = true;
    bootstrap.textService.show(this.textName).then((text: TextDTO) => {
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
    bootstrap.textService
      .update(TextDTO.parse(this.text))
      .then(() => {
        bootstrap.messageService.showModal(
          "success",
          this.$t("text.update.success.header").toString(),
          this.$t("text.update.success.message").toString(),
          () => (this.saving = false)
        );
      })
      .catch((error: any) => {
        bootstrap.messageService.showModal(
          "success",
          this.$t("text.update.error.header").toString(),
          this.$t("text.update.error.message").toString(),
          () => (this.saving = false)
        );
      });
  }
}
</script>