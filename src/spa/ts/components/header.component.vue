<template>
  <div>
    <div class="container text-center my-4 d-none d-lg-block">
      <router-link :to="{ name: 'start' }" class="navbar-brand p-0">
        <img src="../../resources/img/logo.png" style="height: 40px;">
      </router-link>
    </div>
    <nav class="navbar navbar-expand-lg" ref="navbar">
      <div class="container-custom">
        <button class="navbar-toggler" type="button" v-on:click="toggleEvent">
          <i class="fas fa-bars"></i>
        </button>
        <a class="navbar-brand d-lg-none" href="#">{{ $t('title') }}</a>
        <div class="collapse navbar-collapse no-transition" ref="navbarContent">
          <template v-for="(menu, index) in menus">
            <ul class="navbar-nav" :class="{ 'mr-auto': index === 0 }" :key="`menu_${index}`">
              <li
                class="nav-item"
                :class="{ 'dropdown': menuItem.menu, 'show': menuItem.menu && matches(menuItem.route), 'nav-divider': menuItem.divider !== undefined }"
                v-for="(menuItem, subIndex) in menu"
                :key="`menuItem_${index}_${subIndex}`"
              >
                <template v-if="menuItem.divider === undefined">
                  <template v-if="menuItem.menu">
                    <a
                      class="nav-link dropdown-toggle d-lg-none"
                      :class="{ 'router-link-active': matches(menuItem.route) }"
                      href="#"
                      role="button"
                      data-toggle="dropdown"
                    >{{ menuItem.title }}</a>
                    <div
                      class="dropdown-menu d-lg-none"
                      :class="{ 'show': matches(menuItem.route)}"
                      aria-labelledby="navbarDropdown"
                    >
                      <template v-for="(menuItem, subSubIndex) in menuItem.menu">
                        <div
                          v-if="menuItem.divider"
                          class="dropdown-divider"
                          :key="`subMenuItem_${index}_${subIndex}_${subSubIndex}`"
                        ></div>
                        <span
                          v-else
                          v-on:click="triggerNavbarToggler"
                          :key="`subMenuItem_${index}_${subIndex}_${subSubIndex}`"
                        >
                          <router-link
                            class="dropdown-item pl-3"
                            :to="menuItem.route"
                          >{{ menuItem.title }}</router-link>
                        </span>
                        <template v-if="menuItem.menu">
                          <template v-for="(subMenuItem, subSubSubIndex) in menuItem.menu">
                            <div
                              v-if="subMenuItem.divider"
                              class="dropdown-divider"
                              :key="`subSubMenuItem_${index}_${subIndex}_${subSubIndex}_${subSubSubIndex}`"
                            ></div>
                            <span
                              v-else
                              v-on:click="triggerNavbarToggler"
                              :key="`subSubMenuItem_${index}_${subIndex}_${subSubIndex}_${subSubSubIndex}`"
                            >
                              <router-link
                                class="dropdown-item pl-4"
                                :class="{ 'dropdown-last': subSubSubIndex === menuItem.menu.length - 1 }"
                                :to="subMenuItem.route"
                              >{{ subMenuItem.title }}</router-link>
                            </span>
                          </template>
                        </template>
                      </template>
                    </div>
                  </template>
                  <span v-on:click="triggerNavbarToggler">
                    <router-link
                      class="nav-link"
                      :class="{ 'd-none d-lg-block': menuItem.menu }"
                      :to="menuItem.route"
                    >
                      {{ menuItem.title }}
                      <span class="sr-only">(current)</span>
                    </router-link>
                  </span>
                </template>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </nav>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, Action, Getter } from "vuex-class";
import { IMenuItem } from "../store/menu.store";
import { RouteRecord, Route } from "vue-router";
import { setTimeout } from "timers";

interface IMenuItemWithShow extends IMenuItem {
  show: boolean;
}

@Component
export default class HeaderComponent extends Vue {
  @Getter("menus") menus!: IMenuItem[][];
  public dev: boolean = false;

  public get navBar(): HTMLElement {
    return this.$refs.navbar as HTMLElement;
  }

  public mounted() {
    let offset = this.navBar.offsetTop;
    window.onresize = () => {
      offset = this.navBar.offsetTop;
    };
    window.onscroll = () => {
      if (window.pageYOffset > offset) {
        this.navBar.classList.add("nav-fixed-top");
        if (
          this.navBar.parentElement !== null &&
          this.navBar.parentElement.nextElementSibling !== null
        ) {
          (this.navBar.parentElement
            .nextElementSibling as HTMLElement).style.paddingTop = `${
            this.navBar.offsetHeight
          }px`;
        }
      } else {
        this.navBar.classList.remove("nav-fixed-top");
        if (
          this.navBar.parentElement !== null &&
          this.navBar.parentElement.nextElementSibling !== null
        ) {
          (this.navBar.parentElement
            .nextElementSibling as HTMLElement).style.paddingTop = "";
        }
      }
    };
  }

  public matches(route: Route) {
    return (
      this.$route.matched.findIndex(
        (routeRecord: RouteRecord) => route.name === routeRecord.name
      ) !== -1
    );
  }

  public triggerNavbarToggler() {
    (this.$refs.navbarContent as Element).classList.toggle("show");
    //$(".navbar-toggler").trigger("click");
  }

  public toggleEvent() {
    this.triggerNavbarToggler();
    /*setTimeout(() => {
      if ((this.$refs.navbarContent as Element).classList.contains("show")) {
        document.body.classList.add("overflow-hidden-md");
      } else {
        document.body.classList.remove("overflow-hidden-md");
      }
    }, 10);*/
  }
}
</script>
<style lang="scss" scoped>
@import "~bootstrap/scss/_functions";
@import "~bootstrap/scss/_mixins";
@import "../../scss/variables";
@import "~bootstrap/scss/_variables";
@import "~bootstrap/scss/_grid";

.container-custom {
  @extend .container;
  @include media-breakpoint-down(md) {
    margin-right: 0px;
    margin-left: 0px;
    min-width: 100%;
  }
}
.navbar {
  .navbar-collapse.show {
    @include media-breakpoint-down(md) {
      overflow-y: scroll;
      height: 100vh;
    }
  }
  padding: 0px;
  .navbar-brand {
    color: #eee;
  }
  .nav-link {
    padding: 0.6rem 1rem !important;
    color: #fff;
    text-transform: uppercase;

    &:hover,
    &.router-link-active {
      background-color: darken(theme-color("primary"), 10%);
    }
  }
  .nav-divider {
    border-color: #fff;
    border-style: solid;
    border-width: 0px 1px 0px 0px;
  }

  .dropdown-menu {
    margin: 0px;
    padding: 0px;
    border: 0px;
    border-radius: 0px;
  }
  .dropdown-item {
    padding: 0.6rem 1rem;
    text-transform: uppercase;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;

    &.router-link-active {
      font-weight: bold;
    }
  }
  .dropdown-last {
    border-bottom: 1px solid #ddd;
  }

  background-color: theme-color("primary");

  &.nav-fixed-top {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1030;
  }
}
</style>