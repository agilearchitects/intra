<template>
  <div class="mdo-form-group">
    <v-popover>
      <!-- This will be the popover target (for the events and position) -->
      <layout-button-component>
        <slot></slot>
      </layout-button-component>
      <!-- This will be the content of the popover -->
      <chrome-picker slot="popover" :value="value" v-on:input="onInput" />
    </v-popover>
  </div>
</template>
<script lang="ts">
import { Chrome as ChromePicker } from "vue-color";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import LayoutButtonComponent from "../layout/button.component.vue";
export interface IColorPicker {
  hsl: { h: number; s: number; l: number; a: number };
  hex: string;
  hex8: string;
  rgba: { r: number; g: number; b: number; a: number };
  hsv: { h: number; s: number; v: number; a: number };
  oldHue: number;
  source: string;
  a: number;
}

export enum colorPickerFormat {
  HEX = "hex",
  HEX8 = "hex8",
  RGB = "rgb",
  RGBA = "rgba"
}

@Component({
  components: {
    ChromePicker,
    LayoutButtonComponent
  }
})
export default class ColorPickerComponent extends Vue {
  @Prop(String) label!: string;
  @Prop({ default: "#000" }) value!: string;
  @Prop({ default: colorPickerFormat.HEX }) format!: colorPickerFormat;

  public onInput(value: IColorPicker) {
    this.$emit(
      "input",
      ((): string => {
        switch (this.format) {
          case colorPickerFormat.HEX:
            return value.hex;
          case colorPickerFormat.HEX8:
            return value.hex8;
          case colorPickerFormat.RGB:
            return `rgb(${value.rgba.r}, ${value.rgba.g}, ${value.rgba.b})`;
          case colorPickerFormat.RGBA:
            return `rgb(${value.rgba.r}, ${value.rgba.g}, ${value.rgba.b}, ${value.rgba.a})`;
        }
      })()
    );
  }
}
</script>