<template>
  <div class="custom-control custom-checkbox">
    <input
      type="checkbox"
      class="custom-control-input"
      :id="id"
      ref="checkbox"
      :disabled="disabled"
    />
    <label class="custom-control-label" :for="id">
      <template v-if="label != ''">{{ label }}</template>
      <slot v-else name="label"></slot>
    </label>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
@Component
export default class CheckboxComponent extends Vue {
  @Prop({ default: false }) value!: boolean;
  @Prop({ default: "" }) label!: string;
  @Prop({ default: false }) indeterminate!: boolean;
  @Prop({ default: false }) disabled!: boolean;
  @Prop(String) id!: string;
  @Watch("value")
  onValueChange() {
    $(`#${this.id}`).prop("checked", this.value);
  }
  @Watch("indeterminate")
  onIndeterminateChange() {
    $(`#${this.id}`).prop("indeterminate", this.indeterminate);
  }

  public mounted() {
    // Setting values
    $(`#${this.id}`).prop("checked", this.value);
    $(`#${this.id}`).prop("indeterminate", this.indeterminate);

    // Attach handle for change
    $(`#${this.id}`).change(this.handleChange);
  }
  public handleChange(): void {
    this.$emit("input", (this.$refs.checkbox as HTMLInputElement).checked);
  }
}
</script>