<template>
  <div class="container-fluid p-0 d-flex flex-column" style="min-height: 100%;">
    <header-component></header-component>
    <div class="container">
      <div class="d-flex align-items-start pt-4 flex-grow-1">
        <sidebar-component></sidebar-component>
        <router-view></router-view>
      </div>
    </div>
    <footer-component></footer-component>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

// Components
import HeaderComponent from "./header.component.vue";
import FooterComponent from "./footer.component.vue";
import SidebarComponent from "./sidebar.component.vue";

@Component({
  components: { HeaderComponent, FooterComponent, SidebarComponent }
})
export default class PageComponent extends Vue {}
</script>