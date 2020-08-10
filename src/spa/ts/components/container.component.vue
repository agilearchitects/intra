<template>
  <div class="container">
    <div
      v-if="hasSidebarSlot"
      class="container__sidebar"
    >
      <slot name="sidebar"></slot>
    </div>
    <div class="container__content">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
// Libs
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ContainerComponent extends Vue {
  public get hasSidebarSlot(): boolean {
    return this.$slots["sidebar"] !== undefined;
  }
}
</script>
<style lang="scss" scoped>
@import "../../scss/variables.scss";
@import "~bootstrap/scss/bootstrap-grid";

.container {
  margin-top: 20px;
  display: flex;
  &__sidebar {
    margin-right: 20px;
    width: 250px;
  }
  &__content {
    flex-grow: 1;
  }
}
</style>