<template>
  <router-view></router-view>
</template>
<script lang="ts">
// Libs
import { Vue, Component } from "vue-property-decorator";

// bootstrap
import { bootstrap } from "../bootstrap";
import { menuType } from "../services/menu.service";
import { ISubscription } from "../services/broadcast.service";

@Component
export default class WikiComponent extends Vue {
  public menu: menuType[] = [];
  private menuChangeSubscription?: ISubscription;

  public mounted() {
    this.setMenu();
    this.menuChangeSubscription = bootstrap.menuService.onMenuChange(() =>
      this.setMenu()
    );
  }
  public destroyed() {
    if (this.menuChangeSubscription !== undefined) {
      this.menuChangeSubscription.unsubscribe();
    }
  }

  private setMenu() {
    const menu = bootstrap.menuService.getMenu()[3];
    if ("children" in menu && menu.children !== undefined) {
      this.menu = menu.children;
    }
  }
}
</script>
<style lang="scss" scoped>
</style>