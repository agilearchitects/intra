<template>
  <div class="mdo-form-group">
    <label
      class="mdo-form-group__label mdo-form-group__label--active mdo-form-group__label--gray"
    >{{ label }}</label>
    <i class="mdo-form-group__caret fas fa-caret-down"></i>
    <select class="mdo-form-group__control" v-on:input="onSelect" ref="select">
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.text }}</option>
    </select>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
@Component
export default class SelectComponent extends Vue {
  @Prop(String) label!: string;
  @Prop(String) value!: string;
  @Prop() options!: ({ value: any; text: string })[];
  @Watch("value") onValueChange(value: string, oldValue: string) {
    (this.$refs.select as any).value = value;
  }

  public get isActive(): boolean {
    return this.value !== "";
  }

  mounted() {
    (this.$refs.select as any).value = this.value;
  }

  onSelect() {
    this.$emit("input", (this.$refs.select as any).value);
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
    &--gray {
      color: color("gray");
    }
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
}
select.mdo-form-group__control {
  -webkit-appearance: none;
  border-radius: 0px;
}
</style>