<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-lg-5">
        <div class="card">
          <h5 class="card-header">{{ $t("login.login") }}</h5>
          <div class="card-body">
            <form v-on:submit.prevent="submit(form.email, form.password)">
              <div class="form-group">
                <input-component
                  :warning="loginError"
                  v-model="form.email"
                  id="loginEmail"
                  :label="$t('login.email')"
                />
              </div>
              <div class="form-group">
                <input-component
                  v-model="form.password"
                  :warning="loginError"
                  id="loginPassword"
                  type="password"
                  :label="$t('login.password')"
                />
              </div>
              <div class="d-flex">
                <div>
                  <layout-button-component type="submit">{{ $t('login.submit') }}</layout-button-component>
                </div>
                <div class="form-group custom-control custom-checkbox ml-3 pt-2">
                  <checkbox-component
                    id="loginRemember"
                    v-model="form.remember"
                    label="Remember Me"
                  ></checkbox-component>
                </div>
              </div>
              <div class="flex">
                <router-link :to="{ name: 'password_reset' }">{{ $t("login.forgot_password") }}</router-link>
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
import { Route } from "vue-router";

// Services
import { AuthService } from "../services/auth.service";

// Components
import LayoutButtonComponent from "./layout/button.component.vue";
import InputComponent from "./layout/input.component.vue";
import CheckboxComponent from "./layout/checkbox.component.vue";

// Bootstrap
import { authService as authServiceInstance } from "../bootstrap";

export type loginForm = {
  email: string;
  password: string;
  remember: boolean;
};

@Component({
  components: { LayoutButtonComponent, InputComponent, CheckboxComponent }
})
export default class LoginComponent extends Vue {
  private readonly authService: AuthService = authServiceInstance;

  public form: loginForm = {
    email: "test@test.test",
    password: "test",
    remember: false
  };
  public loginError: boolean = false;

  public async submit(email: string, password: string) {
    try {
      await this.authService.login(email, password);
      this.$router.push("/start");
    } catch (error) {
      this.loginError = true;
    }
  }
}
</script>