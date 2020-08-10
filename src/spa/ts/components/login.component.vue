<template>
  <container-component>
    <div class="d-flex justify-content-center">
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
                  :disabled="loading"
                />
              </div>
              <div class="form-group">
                <input-component
                  v-model="form.password"
                  :warning="loginError"
                  id="loginPassword"
                  type="password"
                  :label="$t('login.password')"
                  :disabled="loading"
                />
              </div>
              <div class="d-flex justify-content-center mb-3">
                <layout-button-component
                  class="pl-0"
                  :buttonType="loading ? buttonType.CONTAINED : buttonType.OUTLINED"
                  v-on:click="loginWithGoogle"
                  :loading="loadingGoogle"
                  :disabled="loading"
                >
                  <div class="d-flex align-items-center">
                    <img
                      style="height: 28px; margin-top: 4px; margin-left: 4px;"
                      src="../../resources/img/200px-Google__G__Logo.svg.webp.png"
                    />
                    <p class="mt-0 mb-0 ml-3">{{ $t("login.google") }}</p>
                  </div>
                </layout-button-component>
              </div>
              <div class="d-flex">
                <div>
                  <layout-button-component
                    :loading="loadingLogin"
                    :disabled="!isValid || loading"
                    type="submit"
                  >{{ $t('login.submit') }}</layout-button-component>
                </div>
                <div class="form-group custom-control custom-checkbox ml-3 pt-2">
                  <checkbox-component
                    id="loginRemember"
                    v-model="form.remember"
                    :label="$t('login.remember_me')"
                    :disabled="loading"
                  ></checkbox-component>
                </div>
              </div>
              <div class="flex">
                <router-link :to="{ name: 'auth.password_reset' }">{{ $t("login.forgot_password_link") }}</router-link>
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
import { Vue, Component } from "vue-property-decorator";
import { Route } from "vue-router";

// Components
import LayoutButtonComponent, {
  ButtonType,
} from "./layout/button.component.vue";
import InputComponent from "./layout/input.component.vue";
import CheckboxComponent from "./layout/checkbox.component.vue";
import ContainerComponent from "./container.component.vue";

// Bootstrap
import { bootstrap } from "../bootstrap";

export type loginForm = {
  email: string;
  password: string;
  remember: boolean;
};

@Component({
  components: {
    LayoutButtonComponent,
    InputComponent,
    CheckboxComponent,
    ContainerComponent,
  },
})
export default class LoginComponent extends Vue {
  // Calculated if any loading is present
  public get loading(): boolean {
    return this.loadingLogin === true || this.loadingGoogle === true;
  }

  /* code param returned from google login (after redirected from
  successfull login) */
  public get codeParam(): string | undefined {
    const code = this.$route.query.code;
    return typeof code === "string" ? code : undefined;
  }

  // Button props
  public buttonType: typeof ButtonType = ButtonType;
  public loadingLogin: boolean = false;
  public loadingGoogle: boolean = false;

  // Login form
  public form: loginForm = {
    email: process.env.ENV === "local" ? "test@test.test" : "",
    password: process.env.ENV === "local" ? "test" : "",
    remember: false,
  };

  public get isValid(): boolean {
    return this.form.email !== "" && this.form.password !== "";
  }

  // Holder for login error
  public loginError: boolean = false;

  public async created() {
    if (this.codeParam !== undefined) {
      // Initiate login with google if code param is present
      this.loginWithGoogleCode(this.codeParam);
    }
  }

  /**
   * Submit method for login form
   */
  public async submit(email: string, password: string) {
    // Set login loading to true
    this.loadingLogin = true;
    try {
      // call login from authService
      await bootstrap.authService.login(email, password);
      // Logged successful. Redirect
      this.redirectAfterLogin();
    } catch (error) {
      /* Something went wrong set login error to true and
      "turn off" login loading */
      this.loginError = true;
      this.loadingLogin = false;
    }
  }

  /**
   * Login method for google
   */
  public async loginWithGoogle() {
    // Set loading google to true
    this.loadingGoogle = true;
    try {
      // Get google login url from auth service and redirect to it
      window.location.href = await bootstrap.authService.getGoogleLoginUrl();
    } catch {
      // If failed loading google is set to false
      this.loadingGoogle = false;
    }
  }

  /**
   * Login with google code from redirect after oauth
   */
  public async loginWithGoogleCode(code: string) {
    // Sets loading to true
    this.loadingGoogle = true;
    try {
      // Try to login with provided code using authService
      await bootstrap.authService.loginWithGoogleCode(code);
      // Login successful. redirect
      this.redirectAfterLogin();
    } catch {
      /* Something went wrong. Set login error to true and
      "turn off" google loading */
      this.loginError = true;
      this.loadingGoogle = false;
    }
  }

  private redirectAfterLogin() {
    this.$router.push({ name: "start" });
  }
}
</script>
<style lang="scss" scoped></style>