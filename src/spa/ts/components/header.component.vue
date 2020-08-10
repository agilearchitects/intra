<template>
  <div class="header">
    <router-link
      :to="{ name: 'start'}"
      class="header__logo"
    >
      <img
        src="../../resources/img/logo.png"
        alt="Logo"
      />
    </router-link>
    <nav class="header__navbar">
      <div class="header__navbar__container">
        <nav-component
          :menu="leftMenu"
          base-class="header__"
        ></nav-component>
        <nav-component
          :menu="rightMenu"
          base-class="header__"
          class="header__nav--right"
        ></nav-component>
      </div>
    </nav>
  </div>
</template>
<script lang="ts">
// Libs
import { Component, Vue } from "vue-property-decorator";

// Services
import { menuType } from "../services/menu.service";

// Bootstrap
import { bootstrap } from "../bootstrap";

// Components
import NavComponent from "./nav.component.vue";
import { ISubscription } from "../services/broadcast.service";

@Component({ components: { NavComponent } })
export default class HeaderComponent extends Vue {
  public leftMenu: menuType[] = bootstrap.menuService.getLeftMenu();
  public rightMenu: menuType[] = bootstrap.menuService.getRightMenu();

  private menuChangeSubscription?: ISubscription;

  public mounted() {
    this.menuChangeSubscription = bootstrap.menuService.onMenuChange(() => {
      this.leftMenu = bootstrap.menuService.getLeftMenu();
      this.rightMenu = bootstrap.menuService.getRightMenu();
    });
  }

  public destroyed() {
    if (this.menuChangeSubscription !== undefined) {
      this.menuChangeSubscription.unsubscribe();
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../scss/variables.scss";
@import "~bootstrap/scss/bootstrap-grid";
.header {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  &__logo {
    margin: 10px 0px 20px;
    height: 80px;
    align-self: center;
    img {
      height: 100%;
    }
  }
  &__navbar {
    flex-basis: 100%;
    background-color: theme-color("primary");
    &__container {
      @extend .container;
      display: flex;
    }
  }
  ::v-deep &__nav {
    margin: 0px;
    padding: 0px;
    display: flex;
    list-style-type: none;
    &--right {
      margin-left: auto;
    }
    &__nav-item {
      text-transform: uppercase;
      &--divider {
        border-left: 2px solid color-yiq(theme-color("primary"));
      }
      &__nav-link {
        padding: 0px 20px;
        line-height: 40px;
        display: block;
        color: color-yiq(theme-color("primary"));
        &:hover {
          text-decoration: none;
          color: darken(color-yiq(theme-color("primary")), 10%);
        }
        &--active {
          background-color: darken(theme-color("primary"), 10%);
        }
      }
    }
  }
}
</style>