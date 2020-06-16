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
          :disabled="loading || !isValid"
        >{{ submitButtonLabel }}</layout-button-component>
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
  @Prop({ type: String, default: "Spara" }) submitButtonLabel!: string;
  @Prop({ type: Boolean, default: false }) loading!: string;
  @Prop({ type: Boolean, default: true }) isValid!: boolean;
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