<template>
  <router-link v-if="route" :to="route">
    <div style="position: relative; width: 100%;">
      <div v-if="loading" style="position: absolute; top: 0px; left: 0px; width: 100%;">
        <slot name="loader">Loading...</slot>
      </div>
    </div>
    <span v-bind:style="{ visibility: loading ? 'hidden' : 'visible' }">
      <slot></slot>
    </span>
  </router-link>
  <button v-else v-on:click="click" :type="type" :disabled="disabled">
    <div style="position: relative; width: 100%;">
      <div v-if="loading" style="position: absolute; top: 0px; left: 0px; width: 100%;">
        <slot name="loader"></slot>
      </div>
    </div>
    <span v-bind:style="{ visibility: loading ? 'hidden' : 'visible' }">
      <slot></slot>
    </span>
  </button>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { Route } from "vue-router";

@Component
export default class ButtonComponent extends Vue {
  @Prop({ type: Boolean, default: false }) loading: boolean;
  @Prop({ type: Boolean, default: false }) disabled: boolean;
  @Prop({ default: undefined }) route: Route;
  @Prop({ type: String, default: "button" }) type: string;

  public click() {
    this.$emit("click");
  }
}
</script>