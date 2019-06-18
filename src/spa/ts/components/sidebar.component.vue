<template>
  <div class="mdo-sidebar d-none d-lg-block" v-if="tree.length > 0">
    <ul class="mdo-sidebar__nav">
      <router-link
        tag="li"
        :to="treeItem.route"
        class="mdo-sidebar__nav-item"
        active-class="mdo-sidebar__nav-item--active"
        v-for="(treeItem, index) in tree"
        v-bind:key="`sidebar_menu_${index}`"
      >
        <a class="mdo-sidebar__nav-link">{{ treeItem.title }}</a>
        <i v-if="treeItem.children" class="mdo-sidebar__nav-item__arrow"></i>
        <ul v-if="treeItem.children" class="mdo-sidebar__subnav">
          <router-link
            tag="li"
            :to="treeItem.route"
            active-class="mdo-sidebar__nav-item--active"
            class="mdo-sidebar__nav-item"
            v-for="(treeItem, index) in treeItem.children"
            :key="`sidebar_submenu_${index}`"
          >
            <a class="mdo-sidebar__nav-link">{{ treeItem.title }}</a>
          </router-link>
        </ul>
      </router-link>
    </ul>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { ITree } from "../store/menu.store";
@Component
export default class SidebarComponent extends Vue {
  @Getter("tree") root!: ITree[];
  public get tree(): ITree[] {
    const tree = this.root.find(
      (tree: ITree) =>
        this.$route.name !== undefined &&
        (this.$route.name.match(new RegExp(`^${tree.route.name}\..*$`)) !==
          null ||
          this.$route.name === tree.route.name)
    );

    if (tree !== undefined && tree.children !== undefined) {
      return tree.children;
    } else {
      return [];
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~bootstrap/scss/_functions";
@import "~bootstrap/scss/_mixins";
@import "../../scss/variables";
@import "~bootstrap/scss/_variables";

.mdo-sidebar {
  margin-right: 15px;
  flex: 0 0 250px;
  background-color: darken(theme-color("primary"), 10%);
  &__nav,
  &__subnav {
    padding: 0px;
    list-style-type: none;
  }
  &__nav {
    margin: 0.75rem 0px 0px;
  }
  &__nav > &__nav-item {
    position: relative;
    .mdo-sidebar__nav-link {
      background-color: #f0f0f0;
    }
    &--active > .mdo-sidebar__nav-link {
      font-weight: bold;
    }
    & > .mdo-sidebar__nav-item__arrow {
      position: absolute;
      top: 14px;
      right: 1.5rem;
      font-size: 20px;
      font-style: normal;
      font-family: "Font Awesome 5 Free";
      font-weight: 900;
      &::after {
        content: "\f105";
      }
    }
    &--active > .mdo-sidebar__nav-item__arrow {
      &::after {
        content: "\f107";
      }
    }
    &--active > .mdo-sidebar__subnav {
      display: block;
    }
  }
  &__subnav {
    display: none;
  }
  &__subnav > &__nav-item {
    .mdo-sidebar__nav-link {
      padding-left: 2.5rem;
      background-color: #fff;
    }
    &--active > .mdo-sidebar__nav-link {
      font-weight: bold;
    }
  }
  &__nav-item &__nav-link {
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
  }
  &__nav-link {
    padding: 0.75rem 1.5rem;
    display: block;
    line-height: 2;
    color: #000;
    &:hover {
      color: inherit;
      text-decoration: none;
      background-color: #eee;
    }
  }
}
</style>