<template>
  <div v-if="loading">
    <h1>Loading...</h1>
  </div>
  <router-view v-else></router-view>
</template>
<script lang = "ts">
// Libs
import { Vue, Component } from "vue-property-decorator";
import { State, Action, Getter } from "vuex-class";

import { broadcast } from "../utils/broadcast";
import { subscribeActionCallback, IErrorPayload } from "../store/error.store";

@Component
export default class IndexComponent extends Vue {
  @Action("error/subscribe") errorSubscribe!: subscribeActionCallback;
  @Action("api/getBaseUrl") getBaseUrl!: () => Promise<void>;
  @Action("auth/setAxiosHeaders") setAxiosHeaders!: () => void;
  @Action("auth/setAxiosInterceptors") setAxiosInterceptors!: () => void;

  public loading: boolean = false;

  public created() {
    this.setAxiosHeaders();
    this.setAxiosInterceptors();

    this.loading = true;
    this.getBaseUrl()
      .then(() => {
        this.loading = false;
      })
      .catch(() => (this.loading = false));
  }
  public mounted() {
    this.errorSubscribe((payload: IErrorPayload) => {
      console.log("SOMETHING WENT WRONG", payload);
    });
    broadcast.subscribe("logout").then(() => {
      this.$router.push({ name: "login" });
    });
  }
}
</script>