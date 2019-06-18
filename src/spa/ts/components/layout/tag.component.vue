<template>
  <div class="mdo-form-tags" :class="{ 'mdo-form-tags--active': active }">
    <label
      class="mdo-form-tags__label"
      :class="{ 'mdo-form-tags__label--active': active || input !== '' || value.length > 0}"
      v-on:click="focusInput"
    >{{ label }}</label>

    <template v-for="(option, index) in valueList">
      <div
        class="mdo-form-tags__value"
        :class="{'mdo-form-tags__value--selected': selectedValueIndex === index}"
        :key="option.value"
      >
        {{ option.text }}
        <i
          class="fas fa-times mdo-form-tags__times"
          v-on:mousedown.prevent
          v-on:click="removeValue(index)"
        ></i>
      </div>
    </template>
    <input
      ref="input"
      class="mdo-form-tags__input"
      v-model="input"
      type="text"
      v-on:focus="active = true"
      v-on:blur="blur"
      v-on:keydown="keyDown"
    >
    <ul class="mdo-form-tags__options" :class="{'mdo-form-tags__options--open': active}">
      <li
        v-for="(option, index) in filteredOptions"
        class="mdo-form-tags__option"
        :class="{'mdo-form-tags__option--selected': selectedOptionIndex === index}"
        :key="option.value"
        v-on:mousedown.prevent
        v-on:click="addValue(index)"
      >{{ option.text }}</li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { setTimeout } from "timers";
export interface IOption {
  value: string;
  text: string;
}
@Component
export default class TagComponent extends Vue {
  @Prop(String) label: string;
  @Prop({ default: [] }) value: string[];
  @Prop({ default: [] }) options: IOption[];
  @Prop({ type: Boolean, default: false }) allowAdd: boolean;
  @Watch("input") onInputChange(value: string, oldValue: string) {
    if (value !== oldValue) {
      this.selectedValueIndex = -1;
      this.selectedOptionIndex = value !== "" ? 0 : -1;
    }
  }

  public input: string = "";
  public active: boolean = false;
  public selectedOptionIndex: number = -1;
  public selectedValueIndex: number = -1;

  public get valueList(): IOption[] {
    return this.value.map(
      (value: string) =>
        this.options.find((option: IOption) => option.value === value) || {
          value,
          text: value
        }
    );
  }
  public get filteredOptions(): IOption[] {
    return this.options.filter(
      (option: IOption) =>
        option.text.match(new RegExp(`^${this.input}`, "i")) &&
        this.value.indexOf(option.value) == -1
    );
  }
  public get selectedValue(): string | undefined {
    return this.value[this.selectedValueIndex];
  }
  public get selectedOption(): IOption | undefined {
    return this.filteredOptions[this.selectedOptionIndex];
  }

  public focusInput() {
    (this.$refs.input as any).focus();
  }
  public blur() {
    this.active = false;
    this.selectedOptionIndex = -1;
    this.addToValues();
  }

  public selectNextOption(): void {
    if (this.selectedOptionIndex + 1 < this.filteredOptions.length) {
      this.selectedOptionIndex++;
    } else {
      this.selectedOptionIndex = 0;
    }
  }
  public selectPreviousOption(): void {
    if (this.selectedOptionIndex - 1 >= 0) {
      this.selectedOptionIndex--;
    } else {
      this.selectedOptionIndex = this.filteredOptions.length - 1;
    }
  }

  public selectNextValue() {
    if (this.selectedValueIndex === -1) {
      return;
    }
    if (this.selectedValueIndex + 1 < this.valueList.length) {
      this.selectedValueIndex++;
    } else {
      this.selectedValueIndex = -1;
    }
  }
  public selectPreviousValue() {
    if (this.selectedValueIndex === -1) {
      this.selectedValueIndex = this.valueList.length - 1;
    } else if (this.selectedValueIndex - 1 >= 0) {
      this.selectedValueIndex--;
    }
  }

  public addToValues() {
    if (
      this.selectedOption !== undefined &&
      this.value.indexOf(this.selectedOption.value) === -1
    ) {
      this.$emit("input", [...this.value, this.selectedOption.value]);
    } else if (
      this.input !== "" &&
      this.allowAdd &&
      this.value.indexOf(this.input) === -1
    ) {
      this.$emit("input", [...this.value, this.input]);
    } else {
      return;
    }

    this.input = "";
    this.selectedValueIndex = -1;
    this.selectedOptionIndex = -1;
  }
  public removeFromValues() {
    if (this.input !== "") {
      return;
    }
    if (this.selectedValue !== undefined) {
      const temp = [...this.value];
      temp.splice(this.selectedValueIndex, 1);
      this.$emit("input", temp);
      this.selectedValueIndex = -1;
    } else {
      this.selectedValueIndex = this.value.length - 1;
    }
  }
  public removeValue(index: number) {
    const temp = [...this.value];
    temp.splice(index, 1);
    this.$emit("input", temp);
  }
  public addValue(index: number) {
    this.$emit("input", [...this.value, this.filteredOptions[index].value]);
    //(this.$refs.input as any).focus();
    //this.active = true;
  }

  public keyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case "ArrowUp":
        this.selectPreviousOption();
        break;
      case "ArrowDown":
        this.selectNextOption();
        break;
      case "ArrowLeft":
        this.selectPreviousValue();
        break;
      case "ArrowRight":
        this.selectNextValue();
        break;
      case "Enter":
        this.addToValues();
        break;
      case "Backspace":
        this.removeFromValues();
    }
  }
}
</script>