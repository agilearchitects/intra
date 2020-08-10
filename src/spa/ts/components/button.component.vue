<template>
  <!-- #region Router Link -->
  <router-link
    v-if="route"
    :to="route"
  >
    <div class="btn">
      <div
        v-if="loading"
        class="btn__loading"
      >
        <slot name="loader">...</slot>
      </div>
    </div>
    <span v-bind:style="{ visibility: loading ? 'hidden' : 'visible' }">
      <slot></slot>
    </span>
  </router-link>
  <!-- #endregion -->
  <!-- #region Button -->
  <button
    v-else
    v-on:click="click"
    :type="type"
    :disabled="disabled"
  >
    <div class="btn">
      <div
        v-if="loading"
        class="btn__loading"
      >
        <slot name="loader">...</slot>
      </div>
    </div>
    <span v-bind:style="{ visibility: loading ? 'hidden' : 'visible' }">
      <slot></slot>
    </span>
  </button>
  <!-- #endregion -->
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { Route } from "vue-router";

@Component
export default class ButtonComponent extends Vue {
  // Is the button in loading state or not
  @Prop({ type: Boolean, default: false })
  loading!: boolean;
  // Should the button be disabled or not
  @Prop({ type: Boolean, default: false })
  disabled!: boolean;
  // Button route (will make button a router link)
  @Prop({ default: undefined })
  route!: Route;
  // Type of button (button or submit)
  @Prop({ type: String, default: "button" })
  type!: string;

  public click() {
    this.$emit("click");
  }
}
</script>
<style lang="scss" scoped>
.btn {
  position: relative;
  &__loading {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }
}
</style>