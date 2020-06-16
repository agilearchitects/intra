<template>
  <div v-if="loading">
    <h1>Loading...</h1>
  </div>
  <router-view v-else></router-view>
</template>
<script lang = "ts">
// Libs
import { Vue, Component } from "vue-property-decorator";
import { AxiosResponse } from "axios";

// Bootstrap
import {
  broadcastService as broadcastServiceInstance,
  apiService as apiServiceInstance,
  authService as authServiceInstance,
  errorService as errorServiceInstance
} from "../bootstrap";

// Services
import { BroadcastService } from "../services/broadcast.service";
import { ErrorService, IErrorPayload } from "../services/error.service";
import { APIService } from "../../../shared/services/api.service";
import { AuthService } from "../services/auth.service";
import VueI18n from "vue-i18n";

@Component
export default class IndexComponent extends Vue {
  private readonly apiService: APIService = apiServiceInstance;
  private readonly broadcastService: BroadcastService = broadcastServiceInstance;
  private readonly errorService: ErrorService = errorServiceInstance;
  private readonly authService: AuthService = authServiceInstance;

  public loading: boolean = false;

  public async created() {
    this.loading = true;
    try {
      this.setHeaders();
      await this.setBaseUrl();
      this.setApiInterceptor();
    } catch (error) {
      this.errorService.submit({ message: "Init error", error });
    }
    this.loading = false;
  }
  public mounted(): void {
    this.errorService.subscribe((payload: IErrorPayload) => {
      console.log("SOMETHING WENT WRONG", payload);
    });

    this.broadcastService.subscribe("logout").then(() => {
      this.$router.push({ name: "login" });
    });
  }

  public async setBaseUrl(): Promise<void> {
    const apiBaseUrl = process.env.API_BASE_URL;
    if (apiBaseUrl === undefined || apiBaseUrl === "") {
      const response = await this.apiService.head(`/api_base_url`);
      if (response.headers.api_base_url) {
        this.apiService.setBaseUrl(response.headers.api_base_url);
      } else {
        this.errorService.submit({
          message: "API base URL was missing from header"
        });
      }
    } else {
      this.apiService.setBaseUrl(apiBaseUrl);
    }
  }

  public setHeaders() {
    if (this.authService.token !== undefined) {
      // Setting token to header
      this.apiService.setDefaultHeaders({
        Authorization: `Bearer ${this.authService.token}`
      });
    }
  }

  public setApiInterceptor(): void {
    this.apiService.setInterceptors(
      (response: AxiosResponse) => response,
      (error: any) => {
        if (error.response !== undefined && error.response.status === 401) {
          this.authService.logout();
        }
        return Promise.reject(error);
      }
    );
  }
}
</script>