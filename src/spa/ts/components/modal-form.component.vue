<template>
  <form v-on:submit.stop.prevent="$emit('submit')">
    <div class="mdo-modal__header">
      <slot name="header">
        <h5>{{ header }}</h5>
      </slot>
    </div>
    <div class="mdo-modal__body">
      <slot></slot>
    </div>
    <div class="mdo-modal__footer">
      <slot name="footer">
        <layout-button-component
          button-type="text"
          button-style="secondary"
          v-on:click="$emit('cancel')"
          :disabled="loading"
        >{{ cancelButtonLabel }}</layout-button-component>
        <layout-button-component
          type="submit"
          :loading="loading"
          :disabled="loading"
        >{{ saveButtonLabel }}</layout-button-component>
      </slot>
    </div>
  </form>
</template>
<script lang="ts">
import $ from "jquery";
import bootstrap from "bootstrap";
import { Vue, Component, Prop } from "vue-property-decorator";
import LayoutButtonComponent from "./layout/button.component.vue";
@Component({
  components: { LayoutButtonComponent }
})
export default class ModalFormComponent extends Vue {
  @Prop({ type: String, default: "" }) header!: string;
  @Prop({ type: String, default: "Avbryt" }) cancelButtonLabel!: string;
  @Prop({ type: String, default: "Spara" }) saveButtonLabel!: string;
  @Prop({ type: Boolean, default: false }) loading!: string;
  public mounted() {
    this.$on("show", () => {
      $(this.$refs.modal).modal("show");
    });
    this.$on("hide", () => {
      $(this.$refs.modal).modal("hide");
    });
  }
}
</script>
<style lang="scss" scoped>
.mdo-modal {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1000;
  &__backdrop {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1001;
  }
  &__content {
    position: absolute;
    width: 100%;
    height: 100%;
    padding-right: 15px;
    padding-left: 15px;
    z-index: 1002;
  }
  &--sm &__container {
    width: 400px;
  }
  &--md &__container {
    width: 600px;
  }
  &--lg &__container {
    width: 800px;
  }
  &__container {
    margin-right: auto;
    margin-left: auto;
    background-color: #fff;
    box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14),
      0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  &__header,
  &__body,
  &__footer {
    padding: 10px 15px 0px;
  }
  &__header {
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid gray("500");
  }
  &__body {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  &__footer {
    padding-top: 1.5rem;
    border-top: 1px solid gray("500");
    padding-bottom: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>