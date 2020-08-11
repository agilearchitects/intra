<template>
  <div>
    <div class="mdo-modal__header">
      <h5 style="text-align: center">{{ header }}</h5>
    </div>
    <div class="mdo-modal__body">
      <p style="text-align: center">{{ message }}</p>

    </div>
    <div class="mdo-modal__footer">
      <layout-button-component
        button-type="contained"
        :button-style="buttonStyle"
        v-on:click="$emit('close')"
        style="flex-grow: 1"
      >OK</layout-button-component>

    </div>
</template>
<script lang="ts">
// Libs
import { Vue, Component, Prop } from "vue-property-decorator";

// Components
import LayoutButtonComponent, {
  ButtonStyle,
} from "./layout/button.component.vue";

export type messageType = "success" | "error";
export interface IMessagePayload {
  type: messageType;
  header?: string;
  message?: string;
}

@Component({ components: { LayoutButtonComponent } })
export default class MessageComponent extends Vue {
  @Prop({ default: null })
  public data!: IMessagePayload | null;

  public get buttonStyle(): ButtonStyle {
    switch (this.type) {
      case "success":
        return ButtonStyle.INFO;
      case "error":
        return ButtonStyle.DANGER;
    }
  }

  public get type(): messageType {
    if (this.data !== null && this.data.type !== undefined) {
      return this.data.type;
    }
    return "success";
  }

  public get header(): string {
    if (this.data !== null && this.data.header !== undefined) {
      return this.data.header;
    }
    return "Warning";
  }
  public get message(): string {
    if (this.data !== null && this.data.message !== undefined) {
      return this.data.message;
    }
    return "Something went wrong";
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
    border-bottom: 1px solid gray("500");
  }
  &__footer {
    border-top: 1px solid gray("500");
    padding-bottom: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>