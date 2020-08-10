<template>
  <div>
    <header-component>
    </header-component>
    <router-view></router-view>
    <footer-component>
    </footer-component>
  </div>
</template>
<script lang="ts">
// Libs
import { Component, Vue } from "vue-property-decorator";

// Components
import FooterComponent from "./footer.component.vue";
import HeaderComponent from "./header.component.vue";

// Bootstrap
import { bootstrap } from "../bootstrap";

@Component({ components: { HeaderComponent, FooterComponent } })
export default class IndexComponent extends Vue {}
</script>
<style lang="scss" scoped>
</style>