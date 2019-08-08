<template>
  <div class="mdo-btn-group">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component
export default class InputGroupComponent extends Vue {}
</script>
<style lang="scss" scoped>
.mdo-btn-group {
  display: inline-flex;
  .mdo-btn {
    border: 0px solid #aaa;
  }
  .mdo-btn:not(:first-child).mdo-btn:not(:last-child) {
    border-radius: 0px;
    border-right-width: 1px;
  }
  .mdo-btn:first-child {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    border-right-width: 1px;
  }
  .mdo-btn:last-child {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
}
</style>