<template>
  <div class="d-flex">
    <div class="mdo-toggle">
      <input
        type="checkbox"
        :id="id"
        ref="checkbox"
        class="mdo-toggle__checkbox"
        :disabled="disabled"
      />
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
  @Prop({ default: false }) value!: boolean;
  @Prop({ default: "" }) label!: string;
  @Prop({ default: false }) disabled!: boolean;
  @Prop(String) id!: string;

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
<style lang="scss" scoped>
@import "~bootstrap/scss/_functions";
@import "../../../scss/variables";
@import "~bootstrap/scss/_variables";

.mdo-toggle {
  position: relative;
  width: 40px;
  height: 20px;
  border-radius: 100px;
  background-color: #ddd;
  overflow: hidden;
  box-shadow: inset 0 0 2px 1px rgba(0, 0, 0, 0.05);

  .i {
    display: block;
  }
  &__checkbox {
    position: absolute;
    display: block;
    cursor: pointer;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 6;
  }

  &__checkbox:checked ~ .track {
    box-shadow: inset 0 0 0 20px theme-color("primary");
  }

  &__checkbox:checked ~ .switch {
    right: 2px;
    left: 22px;
    transition: 0.15s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    transition-property: left, right;
    transition-delay: 0.05s, 0s;
  }

  .switch {
    position: absolute;
    left: 2px;
    top: 2px;
    bottom: 2px;
    right: 22px;
    background-color: #fff;
    border-radius: 36px;
    z-index: 1;
    transition: 0.15s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    transition-property: left, right;
    transition-delay: 0s, 0.05s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .track {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    transition: 0.15s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.05);
    border-radius: 40px;
  }
}
</style>