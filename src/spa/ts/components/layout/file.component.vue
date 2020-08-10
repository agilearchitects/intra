<template>
  <div
    class="d-flex"
    v-on:click="click"
  >
    <div class="d-flex align-items-end">
      <input
        class="d-none"
        type="file"
        ref="file"
        v-on:input="fileChange"
        :accept="accept"
        :multiple="multiple"
      />
      <layout-button-component class="mb-4">Välj</layout-button-component>
    </div>
    <div class="form-group flex-fill ml-3">
      <label class="form-group__label form-group__label--active form-group__label--gray">{{ label }}</label>
      <input
        class="form-group__control"
        type="text"
        ref="input"
        :value="inputValue"
        :disabled="true"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import LayoutButtonComponent from "../layout/button.component.vue";
export interface IFileInput {
  name: string;
  blob: Blob;
}
@Component({
  components: { LayoutButtonComponent },
})
export default class FileComponent extends Vue {
  @Prop({ type: String, default: "" }) label!: string;
  @Prop({ type: Array, default: undefined }) value?: IFileInput[];
  @Prop({ type: String, default: "*" }) accept!: string;
  @Prop({ type: Boolean, default: false }) multiple!: boolean;

  public files: string[] = [];
  public touched: boolean = false;
  public get inputValue(): string {
    return this.value !== undefined && !this.touched
      ? this.value.map((file: IFileInput) => file.name).join(", ")
      : this.files.join(", ");
  }

  public getFileList(): FileList {
    if ((this.$refs.file as any) === undefined) {
      return new FileList();
    }
    return (this.$refs.file as any).files;
  }

  public fileChange(value: any, value2: any) {
    this.touched = true;
    this.files = [];
    const fileList = this.getFileList();

    for (let a = 0; a < fileList.length; a++) {
      this.files.push(fileList[a].name);
    }

    this.$emit("change", fileList);
  }

  click() {
    (this.$refs.file as any).click();
  }
}
</script>