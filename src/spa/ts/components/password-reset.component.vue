<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-lg-5">
        <div class="card">
          <h5 class="card-header">{{ $t('password_reset.password_reset') }}</h5>
          <div class="card-body">
            <p>{{ $t('password_reset.text') }}</p>
            <form v-on:submit.prevent="submit(form.email)">
              <div class="form-group">
                <input-component
                  :warning="resetError"
                  v-model="form.email"
                  id="loginEmail"
                  ref="loginEmail"
                  :label="$t('login.email')"
                />
              </div>
              <div class="d-flex">
                <layout-button-component
                  type="submit"
                  :disabled="!valid"
                >{{ $t('password_reset.submit') }}</layout-button-component>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
// Libs
import { Vue, Component } from "vue-property-decorator";

// Services
import { AuthService } from "../services/auth.service";

// DTO's
import { PasswordResetDTO } from "../../../shared/dto/password-reset.dto";

// Components
import LayoutButtonComponent from "./layout/button.component.vue";
import InputComponent from "./layout/input.component.vue";

// Bootstrap
import { authService as authServiceInstance } from "../bootstrap";

export interface IPasswordResetForm {
  email: string;
}

@Component({
  components: { LayoutButtonComponent, InputComponent }
})
export default class PasswordResetComponent extends Vue {
  private readonly authService: AuthService = authServiceInstance;

  public get valid(): boolean {
    return this.form.email != "";
  }

  public form: IPasswordResetForm = {
    email: ""
  };
  public resetError: boolean = false;

  public submit(email: string) {
    this.authService
      .passwordReset()
      .then(() => {
        this.resetError = false;
      })
      .catch(() => {
        this.resetError = true;
        // Focus email field
        (this as any).$refs.loginEmail.$emit("focus");
      });
  }
}
</script>
<style lang="scss" scoped>
</style>