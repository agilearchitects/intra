<template>
  <nav>
    <slot></slot>
  </nav>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component
export default class NavComponent extends Vue {}
</script>
<style lang="scss" scoped>
@import "../../../scss/variables";
@import "~bootstrap/scss/_functions";
@import "~bootstrap/scss/_variables";

nav {
  display: inline-flex;

  a,
  span {
    line-height: 36px;
    padding: 0px 16px;
    transition: 0.3s;
    text-transform: uppercase;
    cursor: pointer;
    position: relative;
    background-color: #fff;
    border: 0px solid #aaa;
    &.active {
      color: theme-color-level("primary", -10);
      background-color: theme-color("primary");
    }
    &:hover {
      text-decoration: none;
    }
    &:after {
      content: "";
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
        0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
      position: absolute;
      top: 0px;
      left: 0px;
      bottom: 0px;
      right: 0px;
      z-index: -1;
    }
    &:hover:after {
      box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14),
        0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);
    }
    &:not(:first-child):not(:last-child) {
      border-radius: 0px;
      border-right-width: 1px;
    }
    &:first-child {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      border-right-width: 1px;
    }
    &:last-child {
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
    }
  }
}
</style>