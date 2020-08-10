<template>
  <button-component
    :class="`btn btn--${buttonType} btn--${buttonStyle} btn--${buttonSize}`"
    :loading="loading"
    :disabled="disabled"
    :route="route"
    :type="type"
    v-on="$listeners"
  >
    <template v-slot:loader>
      <i class="fas fa-spinner fa-pulse"></i>
    </template>
    <slot></slot>
  </button-component>
</template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { Route } from "vue-router";
import ButtonComponent from "../button.component.vue";
export enum ButtonType {
  CONTAINED = "contained",
  OUTLINED = "outlined",
  TEXT = "text"
}
export enum ButtonStyle {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  INFO = "info",
  WARNING = "warning",
  DANGER = "danger"
}
export enum ButtonSize {
  XS = "xs",
  SM = "sm",
  MD = "md",
  LG = "lg"
}
@Component({
  components: { ButtonComponent }
})
export default class LayoutButtonComponent extends Vue {
  @Prop({ type: Boolean, default: false })
  public loading!: boolean;
  @Prop({ type: Boolean, default: false })
  public disabled!: boolean;
  @Prop({ default: undefined }) route!: Route;
  @Prop({ type: String, default: "button" })
  public type!: string;
  @Prop({ type: String, default: ButtonType.CONTAINED })
  public buttonType!: ButtonType;
  @Prop({ type: String, default: ButtonStyle.PRIMARY })
  public buttonStyle!: ButtonStyle;
  @Prop({ type: String, default: ButtonSize.MD })
  public buttonSize!: ButtonSize;

  public click() {
    this.$emit("click");
  }
}
</script>
<style lang="scss" scoped>
@import "../../../scss/variables";
@import "~bootstrap/scss/_functions";
@import "~bootstrap/scss/_variables";

.btn {
  display: inline-block;
  &:hover {
    text-decoration: none;
  }
  background-color: transparent;
  border-radius: 2px;
  border: 0px;
  transition: 0.3s;
  text-transform: uppercase;
  cursor: pointer;
  &:not(&--text) {
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    &:hover {
      box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14),
        0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);
    }
  }
  &:disabled {
    pointer-events: none;
    box-shadow: none;
    color: gray("500") !important;
    cursor: default;
  }
  &--xs {
    font-size: 0.7rem;
    line-height: 18px;
    padding: 0px 6px;
  }
  &--sm {
    font-size: 0.8rem;
    line-height: 25px;
    padding: 0px 10px;
  }
  &--md {
    line-height: 36px;
    padding: 0px 16px;
  }
  &--lg {
    font-size: 1.2rem;
    line-height: 36px;
    padding: 0px 19px;
  }
  /*&--text {
    
  }*/
  &--text,
  &--outlined {
    &.btn--secondary {
      color: theme-color("secondary");
    }
  }
  &--contained {
    &:disabled {
      background-color: gray("300") !important;
    }
    &.btn--primary {
      color: theme-color-level("primary", -10);
      background-color: theme-color("primary");
    }
    &.btn--secondary {
      color: theme-color-level("secondary", -10);
      background-color: theme-color("secondary");
    }
    &.btn--warning {
      color: theme-color-level("warning", -10);
      background-color: theme-color("warning");
    }
    &.btn--danger {
      color: theme-color-level("danger", -10);
      background-color: theme-color("danger");
    }
    &.btn--info {
      color: theme-color-level("info", -10);
      background-color: theme-color("info");
    }
  }

  .fas,
  .far,
  .fal,
  .fab {
    line-height: unset;
  }
}
.btn {
  text-transform: uppercase;
  &:hover {
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12),
      0 3px 1px -1px rgba(0, 0, 0, 0.2);
  }
  &.btn-primary:hover {
    background: theme-color-level("primary", -1.5);
    border-color: transparent;
  }
  &.btn-text {
    background: none;
  }
  /*&.btn-outline {
  }*/
}
</style>