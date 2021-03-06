<template>
  <div
    class="mdo-form-tags"
    :class="{ 'mdo-form-tags--active': active }"
  >
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
      v-on:keypress="shouldContinue"
    />
    <ul
      v-if="!maxReached"
      class="mdo-form-tags__options"
      :class="{'mdo-form-tags__options--open': active}"
    >
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

export interface IOption {
  value: any;
  text: string;
}
@Component
export default class TagComponent extends Vue {
  @Prop(String) label!: string;
  @Prop({ default: [], type: Array }) value!: any[];
  @Prop({ default: [] }) options!: IOption[];
  @Prop({ type: Boolean, default: false }) allowAdd!: boolean;
  @Prop({ type: Number, default: -1 }) max!: number;
  @Watch("input") onInputChange(value: any, oldValue: any) {
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
      (value: any) =>
        this.options.find((option: IOption) => option.value === value) || {
          value,
          text: value,
        }
    );
  }
  public get filteredOptions(): IOption[] {
    return this.options.filter(
      (option: IOption) =>
        option.text.match(new RegExp(`${this.input}`, "i")) &&
        this.value.indexOf(option.value) == -1
    );
  }
  public get selectedValue(): any | undefined {
    return this.value[this.selectedValueIndex];
  }
  public get selectedOption(): IOption | undefined {
    return this.filteredOptions[this.selectedOptionIndex];
  }

  public get maxReached(): boolean {
    return this.max !== -1 && this.max <= this.value.length;
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

  public addToValues(): boolean {
    if (this.maxReached) {
      return false;
    }
    let returnValue = false;
    if (
      this.selectedOption !== undefined &&
      this.value.indexOf(this.selectedOption.value) === -1
    ) {
      this.$emit("input", [...this.value, this.selectedOption.value]);
      returnValue = true;
    } else if (
      this.input !== "" &&
      this.allowAdd &&
      this.value.indexOf(this.input) === -1
    ) {
      this.$emit("input", [...this.value, this.input]);
      returnValue = true;
    }

    this.input = "";
    this.selectedValueIndex = -1;
    this.selectedOptionIndex = -1;

    return returnValue;
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
        if (this.addToValues()) {
          event.preventDefault();
        }
        break;
      case "Backspace":
        this.removeFromValues();
    }
  }

  public shouldContinue($event: any) {
    if (this.maxReached) {
      $event.preventDefault();
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../scss/variables";
@import "~bootstrap/scss/_functions";
@import "~bootstrap/scss/_variables";

.mdo-form-tags {
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  min-height: 3rem;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  border-bottom: 1px solid color("gray");
  &__label {
    position: absolute;
    font-size: 1rem;
    cursor: text;
    transition: transform 0.2s ease-out, color 0.2s ease-out,
      -webkit-transform 0.2s ease-out;
    transform-origin: 0% 100%;
    text-align: initial;
    transform: translateY(12px);
    color: color("gray");
    &--active {
      color: theme-color("primary");
      transform: translateY(-14px) scale(0.8);
      transform-origin: 0 0;
    }
    &--gray {
      color: color("gray");
    }
  }
  &--active {
    border-bottom: 1px solid theme-color("primary");
    box-shadow: 0 1px 0 0 theme-color("primary");
  }
  &__times {
    position: relative;
    top: 1px;
    cursor: pointer;
  }
  &__input {
    font-size: 16px;
    flex-grow: 2;
    border: 0px;
    width: 10px;
    height: 32px;
    margin-top: 10px;
    box-shadow: none;
    box-sizing: content-box;
    align-self: flex-end;
    &:focus {
      border: 0px;
      outline: none;
    }
  }
  &__value {
    height: 32px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);
    line-height: 32px;
    padding: 0 12px;
    border-radius: 16px;
    background-color: gray("200");
    margin-right: 5px;
    margin-top: 0.5rem;
    align-self: center;
    &--selected {
      background-color: gray("500");
    }
  }
  &__options {
    width: 100%;
    margin: 0px;
    padding: 0px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
    background-color: color("white");
    list-style-type: none;
    position: absolute;
    top: 50px;
    z-index: 10000;
    display: none;
    &--open {
      display: block;
    }
  }
  &__option {
    padding: 0px 15px;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    &--selected,
    &:hover {
      background-color: gray("300");
    }
  }
}
</style>