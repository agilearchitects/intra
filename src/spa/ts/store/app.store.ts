import Vue from "vue";
import Vuex, { Dispatch } from "vuex";
import createPersistedState from "vuex-persistedstate";

import { apiStore } from "./api.store";
import { authStore } from "./auth.store";
import { errorStore } from "./error.store";
import { menuStore } from "./menu.store";
import { tinyMCEStore } from "./tinymce.store";

const MODULES = {
  api: apiStore,
  auth: authStore,
  error: errorStore,
  menu: menuStore,
  tinyMCE: tinyMCEStore,
};

export interface IAppState { } // tslint:disable-line:no-empty-interface

Vue.use(Vuex);

export const appStore = new Vuex.Store<IAppState>({
  modules: { ...MODULES },
  plugins: [createPersistedState({ key: "temp" })],
  state: {},
});
