<template>
  <div v-if="loading">
    <h1>Loading...</h1>
  </div>
  <div class="container-fluid p-0 d-flex flex-column" style="min-height: 100%;" v-else>
    <header-component></header-component>
    <div class="flex-grow-1">
      <router-view></router-view>
    </div>
    <footer-component></footer-component>
  </div>
</template>
<script lang = "ts" >
// Libs
import { Vue, Component } from "vue-property-decorator";
import { State, Action, Getter } from "vuex-class";

import { broadcast } from "../utils/broadcast";
import { subscribeActionCallback, IErrorPayload } from "../store/error.store";

// Components
import HeaderComponent from "./header.component.vue";
import FooterComponent from "./footer.component.vue";

@Component({
  components: { HeaderComponent, FooterComponent }
})
export default class IndexComponent extends Vue {
  @Action("error/subscribe") errorSubscribe: subscribeActionCallback;
  @Action("api/getBaseUrl") getBaseUrl: () => Promise<void>;
  @Action("auth/setAxiosHeaders") setAxiosHeaders: () => any;
  @Action("auth/setAxiosInterceptors") setAxiosInterceptors: () => any;

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