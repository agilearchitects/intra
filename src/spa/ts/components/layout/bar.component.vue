<template>
  <div class="bar">
    <div class="bar__budget-container">
      <div
        class="bar__budget"
        v-for="(item, index) in items"
        :key="`budget_${index}`"
        :style="`width: ${percentage(item.budgetUnits)}%;`"
      >
        <i
          v-tooltip="`${item.name !== undefined ? `${item.name} ` : ''}${item.budgetUnits}${suffix || ''}`"
          class="bar__budget__caret fas fa-caret-down"
          :style="`color: ${item.color};`"
        ></i>
      </div>
    </div>
    <div class="bar__item-container">
      <div
        class="bar__item"
        :style="`width: ${percentage(item.units)}%; background-color: ${item.color};`"
        v-for="(item, index) in items"
        :key="`item_${index}`"
        v-tooltip="`${item.name !== undefined ? `${item.name} ` : ''}${item.units}${suffix || ''} / ${item.budgetUnits}${suffix || ''}`"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
export interface IBarItem {
  name?: string;
  units: number;
  budgetUnits: number;
  color: string;
}
@Component
export default class BarComponent extends Vue {
  @Prop(Number) size!: number;
  @Prop({ type: String, default: undefined }) suffix?: string;
  @Prop() items!: IBarItem[];

  public percentage(unit: number): number {
    return Math.round((unit / this.size) * 100 * 100) / 100;
  }
}
</script>
<style lang="scss" scoped>
.bar {
  height: 20px;
  position: relative;
  &__budget-container {
    width: 100%;
    display: flex;
    position: absolute;
  }
  &__budget {
    position: relative;
    &__caret {
      top: -12px;
      right: -5px;
      position: absolute;
    }
  }
  &__item-container {
    width: 100%;
    border: 1px solid #aaa;
    border-radius: 50px;
    display: flex;
    overflow: hidden;
  }
  &__item {
    height: 20px;
  }
}
</style>