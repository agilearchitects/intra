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
  @Prop(String) label: string;
  @Prop(String) value: string;
  @Prop() options: ({ value: any; text: string })[];
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