<template>
  <div
    class="mdo-modal"
    :class="`mdo-modal--${size}`"
    :style="{ ...(state !== 'visible' ? { display: 'none' } : undefined) }"
    v-on:click="clickOutside"
    @keydown.esc="clickEsc"
    ref="modalWindow"
  >
    <div class="mdo-modal__content d-flex align-items-center">
      <div
        class="mdo-modal__container"
        v-on:click.stop
      >
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
  @Prop() component!: typeof Vue;
  @Prop() data: any;
  @Prop({ type: String, default: "md" }) size!: modalSize;
  @Prop({ type: Boolean, default: true }) cancelOnEsc!: boolean;
  @Prop({ type: Boolean, default: true }) cancelOnOutsideClick!: boolean;

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
<style lang="scss" scoped>
.mdo-modal {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  overflow-y: auto;
  position: absolute;
  display: flex;
  align-items: center;
  top: 0px;
  left: 0px;
  z-index: 1;
  &__backdrop {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1001;
  }
  &__content {
    position: absolute;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    z-index: 1002;
  }
  &--xs &__container {
    width: 300px;
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
    margin: 10px auto;
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