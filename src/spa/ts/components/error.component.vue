<template>
  <div class="container">
    <div class="jumbotron">
      <h1 class="display-4">Error {{ errorCode }}</h1>
      <p class="lead">Sidan du söker kunde inte hittas</p>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Route } from "vue-router";

@Component
export default class ErrorComponent extends Vue {
  public get errorCode(): number {
    return parseInt(this.$route.params["code"]);
  }
}
</script>