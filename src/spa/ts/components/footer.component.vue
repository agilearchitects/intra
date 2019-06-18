<template>
  <div
    class="mdo-footer d-flex justify-content-between justify-content-md-around flex-wrap py-3 pt-md-4 pb-md-5"
  >
    <div class="flex-fill flex-sm-grow-0">
      <h5>{{ $t('title') }}</h5>
      <small>
        {{ $t('contact.address') }}
        <br>
        ${{ $t('contact.zip') }} {{ $t('contact.city') }}
        <br>
      </small>
    </div>
    <div class="d-sm-none d-md-none w-100"></div>

    <div class="flex-fill flex-sm-grow-0 mb-4 mb-sm-0">
      <h5>{{ $t('contact.header') }}</h5>
      <small>
        {{ $t('contact.label.email') }}
        <a
          :href="`mailto:${$t('contact.email')}`"
        >{{ $t('contact.email') }}</a>
        <br>
        {{ $t('contact.label.phone') }}
        <a
          :href="`tel:${stripPhoneFormat($t('contact.phone'))}`"
        >{{ $t('contact.phone') }}</a>
      </small>
    </div>
    <div class="d-md-none w-100"></div>
    <div class="flex-fill flex-md-grow-0">
      <strong>
        <a href="https://www.facebook.com/brfpalett/" target="_blank">
          <i class="fab fa-facebook-square"></i>
          {{ $t('contact.label.on_facebook') }}
        </a>
      </strong>
      <div v-if="isAdmin" class="mt-3">
        <toggle-component id="editMode" :value="editMode" v-on:input="updateEditMode">Edit mode</toggle-component>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { State, Action, Getter, Mutation } from "vuex-class";
import { Vue, Component, Watch } from "vue-property-decorator";
import { MutationMethod } from "vuex";

import ToggleComponent from "./layout/toggle.component.vue";

@Component({
  components: { ToggleComponent }
})
export default class FooterComponent extends Vue {
  @Getter("auth/isAdmin") isAdmin!: boolean;
  @Getter("auth/getEditMode") editMode!: boolean;
  @Mutation("auth/setEditMode") setEditMode!: MutationMethod;

  public updateEditMode(value: boolean) {
    this.setEditMode(value);
  }

  public stripPhoneFormat(phone: string) {
    return phone
      .replace(/[^\d+]/g, "")
      .replace(/^(\+\d{1,3})0/, "$1")
      .replace(/^0/, "+46");
  }
}
</script>
<style lang="scss" scoped>
.mdo-footer {
  margin-top: 2rem;
  padding: 1rem 2rem;
  background-color: #111;
  color: #ddd;
}
</style>