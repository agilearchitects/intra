<template>
  <container-component>
    <template v-slot:sidebar>
      <sidebar-component :menu="menu">
      </sidebar-component>
    </template>
    <template v-slot:default>
      <router-view></router-view>
    </template>
  </container-component>
</template>
<script lang="ts">
// Libs
import { Component, Vue } from "vue-property-decorator";

// components
import ContainerComponent from "./container.component.vue";
import SidebarComponent from "./sidebar.component.vue";

// bootstrap
import { bootstrap } from "../bootstrap";
import { menuType } from "../services/menu.service";
import { ISubscription } from "../services/broadcast.service";

@Component({
  components: {
    ContainerComponent,
    SidebarComponent,
  },
})
export default class TimeComponent extends Vue {
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