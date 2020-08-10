<template>
  <container-component>
    <div class="d-flex justify-content-center">
      <div class="col-lg-5">
        <div class="card">
          <h5 class="card-header">{{ $t("reset_password.reset_password") }}</h5>
          <div class="card-body">
            <p
              v-if="success"
              class="text-success text-justify mb-0"
            >{{ $t('reset_password.success', { email: form.email }) }}</p>
            <form
              v-else
              v-on:submit.prevent="submit(form.password)"
            >
              <div class="form-group mb-3">
                <input-component
                  v-model="form.password"
                  type="password"
                  id="resetPasswordPassword"
                  :label="$t('reset_password.password')"
                  :disabled="loading"
                />
              </div>
              <div class="form-group mb-3">
                <input-component
                  v-model="form.repeatPassword"
                  type="password"
                  id="resetPasswordRepeatPassword"
                  :label="$t('reset_password.repeat_password')"
                  :disabled="loading"
                />
              </div>
              <div class="d-flex align-items-center mt-2">
                <div>
                  <layout-button-component
                    :loading="loading"
                    :disabled="!isValid || loading"
                    type="submit"
                  >{{ $t('reset_password.submit') }}</layout-button-component>
                </div>
                <p
                  v-if="error"
                  class="text-danger m-0 ml-2"
                >{{ $t('reset_password.error') }}</p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </container-component>
</template>
<script lang="ts">
// Libs
import { Component, Vue } from "vue-property-decorator";

// Components
import ContainerComponent from "./container.component.vue";
import LayoutButtonComponent from "./layout/button.component.vue";
import InputComponent from "./layout/input.component.vue";

// Bootstrap
import { bootstrap } from "../bootstrap";

export type resetPasswordForm = {
  password: string;
  repeatPassword: string;
};

@Component({
  components: { ContainerComponent, LayoutButtonComponent, InputComponent },
})
export default class ResetPasswordComponent extends Vue {
  private get token(): string | undefined {
    const token = this.$route.query.token;
    if (typeof token === "string") {
      return token;
    }
  }

  public form: resetPasswordForm = {
    password: "",
    repeatPassword: "",
  };

  public get isValid(): boolean {
    return (
      this.form.password !== "" &&
      this.form.repeatPassword !== "" &&
      this.form.password === this.form.repeatPassword
    );
  }

  // Holder for loading
  public loading: boolean = false;

  // Holder error
  public error: boolean = false;

  // Holder success
  public success: boolean = false;

  public async created() {
    if (
      this.token === undefined ||
      (await bootstrap.authService.validateResetToken({ token: this.token }))
        .valid === false
    ) {
      this.$router.push({ name: "error", params: { code: "404" } });
    }
  }

  public async submit(password: string) {
    try {
      await bootstrap.authService.resetPassword({
        token: this.token !== undefined ? this.token : "",
        password,
      });
      this.success = true;
    } catch (error) {
      this.loading = false;
      this.error = true;
    }
  }
}
</script>
<style lang="scss" scoped></style>