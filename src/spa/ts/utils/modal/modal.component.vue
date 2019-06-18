<template>
  <div
    class="mdo-modal"
    :class="`mdo-modal--${size}`"
    :style="{ 'display': state === 'visible' ? 'inherit' : 'none' }"
    v-on:click="clickOutside"
    @keydown.esc="clickEsc"
    ref="modalWindow"
  >
    <div class="mdo-modal__backdrop"></div>
    <div class="mdo-modal__content d-flex align-items-center">
      <div class="mdo-modal__container" v-on:click.stop>
        <component
          :is="component"
          :data="data"
          v-on:close="$emit('close', $event)"
          v-on:hide="$emit('hide', $event)"
        ></component>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Promise = require("bluebird");
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { modalSize } from "./modal.util";

@Component
export default class ModalComponent extends Vue {
  @Prop() component: typeof Vue;
  @Prop() data: any;
  @Prop({ type: String, default: "md" }) size: modalSize;
  @Prop({ type: Boolean, default: true }) cancelOnEsc: boolean;
  @Prop({ type: Boolean, default: true }) cancelOnOutsideClick: boolean;

  public state: "visible" | "hidden" = "hidden";

  public beforeMount() {
    // Add component to body elmenent
    document.body.appendChild(this.$el);

    // Register event listner for esc key click
    window.addEventListener("keydown", this.escEventListner);
  }

  private escEventListner: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
    if (e.keyCode === 27) {
      this.clickEsc();
    }
  };

  public destroyed() {
    // Remove event listener for esc key click
    window.removeEventListener("keydown", this.escEventListner);

    // Remove element
    document.body.removeChild(this.$el);
  }

  public clickOutside() {
    this.$emit("hide");
  }
  public clickEsc() {
    this.$emit("hide");
  }

  public open(): void {
    this.state = "visible";
    (this.$refs.modalWindow as HTMLElement).style.top = `${window.scrollY}px`;
    this.bodyOverFlow(true);
  }

  public close(): void {
    this.state = "hidden";
    this.bodyOverFlow(false);
    this.$destroy();
  }

  public hide(): void {
    this.state = "hidden";
    this.bodyOverFlow(false);
    this.$destroy();
  }

  private bodyOverFlow(hide: boolean) {
    const body = document.querySelector("body");
    if (body !== null) {
      body.style.overflow = hide ? "hidden" : "";
    }
  }
}
</script>