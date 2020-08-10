<template>
  <div
    class="mdo-pill__value"
    :class="{'mdo-pill__value--selected': active === true}"
  >
    <slot></slot>
    <i
      v-if="showRemove"
      class="fas fa-times mdo-pill__times"
      v-on:mousedown.prevent
      v-on:click="$emit('remove')"
    ></i>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component
export default class PillComponent extends Vue {
  @Prop({ type: Boolean, default: false }) active!: boolean;
  @Prop({ type: Boolean, default: false }) showRemove!: boolean;
}
</script>
<style lang="scss" scoped>
@import "../../../scss/variables";
@import "~bootstrap/scss/_functions";
@import "~bootstrap/scss/_variables";

.mdo-pill {
  &__value {
    height: 32px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);
    line-height: 32px;
    padding: 0 12px;
    border-radius: 16px;
    background-color: gray("200");
    align-self: center;
    &--selected {
      background-color: gray("500");
    }
  }
  &__times {
    position: relative;
    top: 1px;
    cursor: pointer;
  }
}
</style>