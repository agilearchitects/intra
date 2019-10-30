<template>
  <div class="mdo-form-group" :class="{ 'mdo-form-group--warning': warning }">
    <label
      class="mdo-form-group__label"
      v-bind:class="{ 'mdo-form-group__label--active': isActive, 'mdo-form-group__label--not-empty': !empty || placeholder !== '', 'mdo-form-group__label--gray': disabled }"
      v-on:click="focusInput"
    >
      {{ label }}
      <span v-if="required" style="color: #aa0000">*</span>
    </label>
    <textarea
      v-if="type === inputType.TEXTAREA"
      class="mdo-form-group__control"
      :id="id"
      :name="name"
      :placeholder="placeholder"
      ref="input"
      v-on:input="onInput"
      v-on:focus="active = true"
      v-on:blur="active = false; $emit('blur', $event)"
      rows="1"
      :disabled="disabled"
    />
    <input
      v-else
      class="mdo-form-group__control"
      :id="id"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      ref="input"
      v-on:input="onInput"
      v-on:focus="active = true"
      v-on:blur="active = false; $emit('blur', $event)"
      v-on:keyup="$emit('keyup', $event)"
      v-on:keydown="$emit('keydown', $event)"
      v-on:keypress="$emit('keypress', $event)"
      :disabled="disabled"
    />
    <small v-if="hasHelp" class="mdo-form-group__help">{{ helpText }}</small>
    <small v-if="warning" class="mdo-form-group__warning">{{ warningText }}</small>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
export enum inputType {
  TEXT = "text",
  TEXTAREA = "textarea"
}
@Component
export default class InputComponent extends Vue {
  @Prop(String) label!: string;
  @Prop({ default: "", Type: String }) value!: string;
  @Prop(String) id!: string;
  @Prop({ type: Boolean, default: false }) disabled!: boolean;
  @Prop({ type: Boolean, default: false }) required!: boolean;
  @Prop({ default: inputType.TEXT }) type!: inputType;
  @Prop({ default: "" }) name!: string;
  @Prop({ type: String, default: "" }) placeholder!: string;
  @Prop({ type: Boolean, default: false }) warning!: boolean;
  @Prop({ type: String, default: "" }) warningText!: string;
  @Prop({ type: String, default: "" }) helpText!: string;

  @Watch("value") onValueChange(value: string) {
    (this.$refs.input as any).value = value;
  }

  public inputType: typeof inputType = inputType;
  public active: boolean = false;
  public get isActive(): boolean {
    return this.active;
  }

  public get empty(): boolean {
    return this.value === "" || this.value === null || this.value === undefined;
  }

  public get hasHelp(): boolean {
    return this.helpText !== "";
  }

  public mounted() {
    // Listner for focus event on component to set focus on input
    this.$on("focus", () => this.focusInput());
    (this.$refs.input as any).value = this.value;
  }

  public onInput() {
    this.$emit("input", (this.$refs.input as any).value);
    if (this.type === inputType.TEXTAREA) {
      const textarea = this.$refs.input as HTMLTextAreaElement;
      const computedStyle = window.getComputedStyle(textarea);
      textarea.style.height = "inherit";
      textarea.style.height = `${textarea.scrollHeight -
        parseInt(computedStyle.getPropertyValue("padding-top"), 10) -
        parseInt(computedStyle.getPropertyValue("padding-bottom"), 10)}px`;
    }
  }

  public focusInput() {
    (this.$refs.input as any).focus();
  }
}
</script>
<style lang="scss" scoped>
@import "~bootstrap/scss/_functions";
@import "../../../scss/variables";
@import "~bootstrap/scss/_variables";

.mdo-form-group {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
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
    &--not-empty {
      transform: translateY(-14px) scale(0.8);
      transform-origin: 0 0;
    }
    &--gray {
      color: color("gray");
    }
  }
  &--warning &__label {
    color: theme-color("warning");
  }

  &__caret {
    position: absolute;
    right: 0px;
    bottom: 13px;
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
  &--warning &__control {
    border-bottom: 1px solid theme-color("warning");
    box-shadow: 0 1px 0 0 theme-color("warning");
  }
  &__help,
  &__warning {
    line-height: 1.75rem;
  }
  /*&__help {
  }*/
  &__warning {
    color: theme-color("warning");
  }
}
select.mdo-form-group__control {
  -webkit-appearance: none;
  border-radius: 0px;
}
</style>