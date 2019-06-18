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
import { Action, Getter } from "vuex-class";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { textShowAction, textUpdateAction } from "../store/text.store";
import { TextDTO } from "../../../shared/dto/text.dto";
import { ITinyMCESettings } from "../store/tinymce.store";

@Component({
  components: { tinyMce: Editor }
})
export default class TextComponent extends Vue {
  @Getter("auth/getEditMode") editMode!: boolean;
  @Getter("auth/isAdmin") isAdmin!: boolean;
  @Getter("tinyMCE/init") tinyMCEInit!: (
    buttons?: string,
    setup?: (editor: any) => void
  ) => ITinyMCESettings;
  @Action("text/show") textShowAction!: textShowAction;
  @Action("text/update") textUpdateAction!: textUpdateAction;

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

  public text: TextDTO | null = null;
  public saving: boolean = false;

  public created() {
    this.loading = true;
  }

  public mounted() {
    this.getText();
    this.tinyMCEInitWith = this.tinyMCEInit("saveButton | ", (editor: any) => {
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
    this.textShowAction(this.textName).then((text: TextDTO) => {
      this.loading = false;
      this.text = text;
      if (text.content === "") {
        text.content = "<i>Saknar innehåll</i>";
      }
    });
  }

  public save() {
    if (this.text === null) {
      return;
    }
    this.saving = true;
    this.textUpdateAction(this.text)
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