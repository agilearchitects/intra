<template>
  <container-component>
    <div class="d-flex justify-content-center">
      <div class="col-lg-5">
        <div class="card">
          <h5 class="card-header">{{ $t("password_reset.password_reset") }}</h5>
          <div class="card-body">
            <template v-if="success">
              <div v-if="debug">
                To: {{ debugResponse.to }} <br />
                From: {{ debugResponse.from }} <br />
                subject: {{ debugResponse.subject }} <br />
                content:
                <p
                  style="overflow-wrap: anywhere"
                  v-html="debugResponse.content"
                ></p>
              </div>
              <p
                v-else
                class="text-success text-justify mb-0"
              >{{ $t('password_reset.success', { email: form.email }) }}</p>
            </template>
            <form
              v-else
              v-on:submit.prevent="submit(form.email, form.token)"
            >
              <div class="form-group mb-3">
                <input-component
                  v-model="form.email"
                  id="passwordResetEmail"
                  :label="$t('password_reset.email')"
                  :disabled="loading"
                />
              </div>
              <div class="d-fex">
                <template v-if="!debug">
                  <recaptcha-component
                    ref="recaptcha-component"
                    v-on:verify="token => form.token = token"
                  ></recaptcha-component>
                </template>
                <template v-else>
                  <p class="text-warning"><i>Debug is on. Recaptcha is turned off<i></p>
                </template>
              </div>
              <div class="d-flex align-items-center mt-2">
                <div>
                  <layout-button-component
                    :loading="loading"
                    :disabled="!isValid || loading"
                    type="submit"
                  >{{ $t('password_reset.submit') }}</layout-button-component>
                </div>
                <p
                  v-if="error"
                  class="text-danger m-0 ml-2"
                >{{ $t('password_reset.error') }}</p>
              </div>
            </form>
          </div>
        </div>
      </div>
  </container-component>
</template>
<script lang="ts">
// Libs
import { Component, Vue } from "vue-property-decorator";

// DTO's
import { IDebugEmailDataDTO } from "../../../shared/dto/debug-email-data.dto";

// Components
import ContainerComponent from "./container.component.vue";
import RecaptchaComponent from "./recaptcha.component.vue";
import LayoutButtonComponent from "./layout/button.component.vue";
import InputComponent from "./layout/input.component.vue";

// Bootstrap
import { bootstrap } from "../bootstrap";

export type passwordResetForm = {
  email: string;
  token: string;
};

@Component({
  components: {
    RecaptchaComponent,
    ContainerComponent,
    LayoutButtonComponent,
    InputComponent,
  },
})
export default class PasswordResetComponent extends Vue {
  // Debug
  public debug: boolean = process.env.DEBUG === "true";

  // Holder for loading
  public loading: boolean = false;

  public form: passwordResetForm = {
    email: process.env.ENV === "local" ? "test@test.test" : "",
    token: process.env.ENV === "local" ? "test" : "",
  };

  public get isValid(): boolean {
    return this.form.email !== "" && this.form.token !== "";
  }

  // Holder error
  public error: boolean = false;

  // Holder success
  public success: boolean = false;

  // Debug response
  public debugResponse?: IDebugEmailDataDTO;

  public async submit(email: string, token: string) {
    this.loading = true;
    try {
      const response: void | IDebugEmailDataDTO = await bootstrap.authService.passwordReset(
        { email },
        token
      );

      if (this.debug === true && response !== undefined) {
        this.debugResponse = response;
      }

      this.success = true;
    } catch {
      this.loading = false;
      this.error = true;

      // Reset form
      this.reset();
    }
  }

  public reset() {
    this.form.email = "";
    this.form.token = "";
    (this.$refs["recaptcha-component"] as RecaptchaComponent).reset();
  }
}
</script>
<style lang="scss" scoped></style>