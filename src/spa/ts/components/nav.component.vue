<template>
  <ul :class="`${baseClass}nav`">
    <li
      v-for="(menuItem, index) of menu"
      :key="`menu_item_${index}`"
      :class="{
        [`${baseClass}nav__nav-item`]: true,
        [`${baseClass}nav__nav-item--divider`]: menuItem.divider,
      }"
    >
      <router-link
        :class="[
        `${baseClass}nav__nav-item__nav-link`
        ]"
        :activeClass="`${baseClass}nav__nav-item__nav-link--active`"
        v-if="!menuItem.divider"
        :to="menuItem.route"
      >{{ menuItem.title }}</router-link>
    </li>
  </ul>
</template>
<script lang="ts">
// Libs
import { Component, Vue, Prop } from "vue-property-decorator";
import { menuType } from "../services/menu.service";

@Component
export default class NavComponent extends Vue {
  @Prop({ default: "" })
  public baseClass!: string;
  @Prop({ default: [] })
  public menu!: menuType[];
}
</script>