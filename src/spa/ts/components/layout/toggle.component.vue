<template>
  <div class="d-flex">
    <div class="mdo-toggle">
      <input
        type="checkbox"
        :id="id"
        ref="checkbox"
        class="mdo-toggle__checkbox"
        :disabled="disabled"
      >
      <i class="b switch"></i>
      <i class="b track"></i>
    </div>
    <label :for="id" class="ml-2">
      <slot></slot>
    </label>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
@Component
export default class ToggleComponent extends Vue {
  @Prop({ default: false }) value: boolean;
  @Prop({ default: "" }) label: string;
  @Prop({ default: false }) disabled: boolean;
  @Prop(String) id: string;

  @Watch("value")
  onValueChange() {
    (this.$refs.checkbox as HTMLInputElement).checked = this.value;
  }

  public mounted() {
    // Setting values
    (this.$refs.checkbox as HTMLInputElement).checked = this.value;

    // Attach handle for change
    (this.$refs.checkbox as HTMLInputElement).addEventListener(
      "change",
      this.handleChange
    );
  }

  public handleChange(): void {
    this.$emit("input", (this.$refs.checkbox as HTMLInputElement).checked);
  }
}
</script>