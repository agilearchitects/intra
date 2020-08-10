<template>
  <div class="sidebar">
    <nav-component
      :menu="menu"
      base-class="sidebar__"
    ></nav-component>
  </div>
</template>
<script lang="ts">
// Libs
import { Component, Vue, Prop } from "vue-property-decorator";

// Services
import { menuType } from "../services/menu.service";

// Components
import NavComponent from "./nav.component.vue";

@Component({ components: { NavComponent } })
export default class SidebarComponent extends Vue {
  @Prop({ default: [] })
  public menu!: menuType[];
}
</script>
<style lang="scss" scoped>
@import "../../scss/variables.scss";
@import "~bootstrap/scss/_functions";
@import "~bootstrap/scss/_variables";

.sidebar {
  ::v-deep &__nav {
    margin: 0px;
    padding: 0px;
    list-style-type: none;
    padding-top: 10px;
    background-color: darken(theme-color("primary"), 10%);
    &__nav-item {
      &--divider {
        border-bottom: 1px solid darken($gray-200, 40%);
      }
      &__nav-link {
        width: 100%;
        line-height: 60px;
        padding: 0px 20px;
        border-width: 0px 1px 1px;
        background-color: #f0f0f0;
        border-color: #ddd;
        border-style: solid;
        color: #000;
        display: block;
        &:hover {
          text-decoration: none;
        }
        &--active {
          background-color: #d7d7d7;
        }
      }
    }
  }
}
</style>