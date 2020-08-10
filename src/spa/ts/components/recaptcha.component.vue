<template>
  <vue-recaptcha
    ref="recaptcha"
    v-on:verify="recaptchaVerify"
    :sitekey="clientId"
  ></vue-recaptcha>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import VueRecaptcha from "vue-recaptcha";
import { loadScript } from "../modules/load-file.module";

@Component({ components: { VueRecaptcha } })
export default class RecaptchaComponent extends Vue {
  @Prop({ default: process.env.GOOGLE_RECAPTCHA_CLIENTID })
  public clientId!: string;

  public mounted() {
    loadScript(
      "https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit"
    );
  }

  public recaptchaVerify(token: string) {
    this.$emit("verify", token);
  }

  public reset() {
    (this.$refs.recaptcha as VueRecaptcha).reset();
  }
}
</script>
<style lang="scss" scoped>
</style>