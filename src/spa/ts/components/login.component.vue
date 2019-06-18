<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-lg-5">
        <div class="card">
          <h5 class="card-header">Login</h5>
          <div class="card-body">
            <form v-on:submit.prevent="submit(form.email, form.password)">
              <div class="form-group">
                <input-component v-model="form.email" id="loginEmail" :label="$t('login.email')"/>
              </div>
              <div class="form-group">
                <input-component
                  v-model="form.password"
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
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Route } from "vue-router";
import { State, Action, Getter } from "vuex-class";
import { loginAction } from "../store/auth.store";
import { LoginDTO } from "../../../shared/dto/login.dto";
import LayoutButtonComponent from "./layout/button.component.vue";
import InputComponent from "./layout/input.component.vue";
import CheckboxComponent from "./layout/checkbox.component.vue";

export interface User {
  emaiL: string;
  id: number;
}

export type loginForm = {
  email: string;
  password: string;
  remember: boolean;
};

@Component({
  components: { LayoutButtonComponent, InputComponent, CheckboxComponent }
})
export default class LoginComponent extends Vue {
  @Action("auth/login") login!: loginAction;
  @Getter("auth/token") token!: string;
  @Getter("auth/user") user!: User;

  public form: loginForm = {
    email: "",
    password: "",
    remember: false
  };

  public submit(email: string, password: string) {
    this.login(LoginDTO.parse({ email, password })).then(() => {
      this.$router.push("/start");
    });
  }
}
</script>