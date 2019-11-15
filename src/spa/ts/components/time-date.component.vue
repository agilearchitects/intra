<template>
  <div>
    <div class="d-flex align-items-start">
      <button-component v-on:click="$emit('previous')">
        <i class="fas fa-chevron-left"></i>
      </button-component>
      <div
        class="time-report__date-placeholder cursor-pointer"
        :style="labelStyle"
        v-on:click="$emit('today')"
      >
        <slot></slot>
      </div>
      <button-component v-on:click="$emit('next')">
        <i class="fas fa-chevron-right"></i>
      </button-component>
    </div>
  </div>
</template>
<script lang="ts">
// Libs
import { Vue, Component, Prop } from "vue-property-decorator";

// Components
import ButtonComponent from "./layout/button.component.vue";

@Component({
  components: { ButtonComponent }
})
export default class TimeDateomponent extends Vue {
  @Prop({ default: "", type: String }) labelStyle!: string;
}
</script>
<style lang="scss" scoped>
.time-report {
  &__date-placeholder {
    padding: 0% 1rem;
    border-width: 1px 0px;
    border-style: solid;
    border-color: #000;
    align-self: stretch;
    display: flex;
    text-align: center;
    align-items: center;
    justify-items: center;
    justify-content: space-around;
  }
}
</style>