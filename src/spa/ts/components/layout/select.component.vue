<template>
  <div class="mdo-form-group">
    <label class="mdo-form-group__label mdo-form-group__label--active mdo-form-group__label--gray">
      <slot name="label">{{ label }}</slot>
      HiddenValue: {{ hiddenValue }}
    </label>
    <i class="mdo-form-group__caret fas fa-caret-down"></i>
    <label
      class="mdo-form-group__select-placeholder"
      v-if="hasPlaceholder && hiddenValue === '' && !isOptionsEmpty"
    >
      <slot name="placeholder">{{ placeholder }}</slot>
    </label>
    <label class="mdo-form-group__select-placeholder" v-if="isOptionsEmpty">
      <slot name="empty">{{ emptyLabel }}</slot>
    </label>
    <select class="mdo-form-group__control" v-on:input="onInput" ref="select">
      <option value hidden default v-if="hasPlaceholder"></option>
      <template v-for="(option, index) in options">
        <optgroup
          v-if="option.children !== undefined"
          :key="`option_${index}`"
          :label="option.text"
        >
          <option
            v-for="(option, index) in option.children"
            :disabled="option.disabled !== undefined && option.disabled === true"
            :key="`option_child_${index}`"
            :value="option.value"
          >{{ option.text }}</option>
        </optgroup>
        <option
          v-else
          :disabled="option.disabled !== undefined && option.disabled === true"
          :key="`option_${index}`"
          :value="option.value"
        >{{ option.text }}</option>
      </template>
    </select>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
export interface IOption {
  value: string;
  text: string;
  disabled?: boolean;
  children?: IOption[];
}
@Component
export default class SelectComponent extends Vue {
  @Prop(String) label!: string;
  @Prop(String) placeholder?: string;
  @Prop({ default: "", type: String }) emptyLabel?: string;
  @Prop({ default: "", type: String }) value!: string;
  @Prop() options!: IOption[];
  @Watch("value") onValueChange(value: any, oldValue: any) {
    console.log("VALUE UPDATE", value);
    (this.$refs.select as any).value = value;
    this.hiddenValue = value;
  }
  @Watch("options") onOptionsChange(options: IOption[], oldOptions: IOption[]) {
    if (
      options.find((option: IOption) => option.value === this.value) ===
      undefined
    ) {
      this.$emit("input", "");
    }
  }

  public hiddenValue: string = "";

  public get hasPlaceholder() {
    return !!this.$slots.placeholder || this.placeholder !== undefined;
  }
  public get isOptionsEmpty() {
    return this.options.length === 0;
  }

  public get isActive(): boolean {
    return this.value !== "";
  }

  mounted() {
    this.hiddenValue = this.value;
    (this.$refs.select as any).value = this.value;
  }

  onInput() {
    this.hiddenValue = (this.$refs.select as any).value;
    this.$emit("input", (this.$refs.select as any).value);
  }
}
</script>
<style lang="scss" scoped>
@import "~bootstrap/scss/_functions";
@import "../../../scss/variables";
@import "~bootstrap/scss/_variables";
.mdo-form-group {
  &__label {
    position: absolute;
    font-size: 1rem;
    cursor: text;
    transition: transform 0.2s ease-out, color 0.2s ease-out,
      -webkit-transform 0.2s ease-out;
    transform-origin: 0% 100%;
    text-align: initial;
    transform: translateY(12px);
    color: color("gray");
    &--active {
      color: theme-color("primary");
      transform: translateY(-14px) scale(0.8);
      transform-origin: 0 0;
    }
    &--gray {
      color: color("gray");
    }
  }
  &__caret {
    position: absolute;
    right: 0px;
    bottom: 13px;
  }
  &__select-placeholder {
    min-height: 3rem;
    width: 100%;
    color: color("gray");
    line-height: 3rem;
    position: absolute;
    pointer-events: none;
  }
  #{selector-unify(&, textarea)}__control {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    min-height: 2rem;
    resize: none;
  }
  &__control {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid color("gray");
    border-radius: 0;
    outline: none;
    min-height: 3rem;
    width: 100%;
    font-size: 16px;
    margin: 0px;
    padding: 0px;
    box-shadow: none;
    box-sizing: content-box;
    transition: box-shadow 0.3s, border 0.3s, -webkit-box-shadow 0.3s;
    &:focus {
      border-bottom: 1px solid theme-color("primary");
      box-shadow: 0 1px 0 0 theme-color("primary");
    }
    &:disabled {
      color: gray;
    }
  }
}
select.mdo-form-group__control {
  -webkit-appearance: none;
  border-radius: 0px;
}
</style>