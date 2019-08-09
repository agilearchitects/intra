import Vue from "vue";
import Vuex, { Dispatch } from "vuex";
import createPersistedState from "vuex-persistedstate";

import { apiStore } from "./api.store";
import { authStore } from "./auth.store";
import { errorStore } from "./error.store";
import { menuStore } from "./menu.store";
import { projectStore } from "./project.store";
import { textStore } from "./text.store";
import { timeStore } from "./time.store";
import { tinyMCEStore } from "./tinymce.store";
import Axios, { AxiosResponse } from "axios";
import { customerStore } from "./customer.store";

const MODULES = {
  api: apiStore,
  auth: authStore,
  customer: customerStore,
  error: errorStore,
  menu: menuStore,
  project: projectStore,
  text: textStore,
  time: timeStore,
  tinyMCE: tinyMCEStore,
};

export interface IAppState { } // tslint:disable-line:no-empty-interface

Vue.use(Vuex);

export const appStore = new Vuex.Store<IAppState>({
  modules: { ...MODULES },
  plugins: [createPersistedState({ key: "temp" })],
  state: {},
});

export const apiIndex = <T>(url: string, dispatch: Dispatch, name?: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    Axios.get<T[]>(url).then((response: AxiosResponse<T[]>) => resolve(response.data)).catch((error: any) => {
      dispatch("error/submit", { message: `Index ${name || ""} request failed`, error }, { root: true });
      reject();
    });
  });
}

export const apiShow = <T>(url: string, dispatch: Dispatch, name?: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    Axios.get<T>(url).then((response: AxiosResponse<T>) => resolve(response.data)).catch((error: any) => {
      dispatch("error/submit", { message: `Show ${name || ""} request failed`, error }, { root: true });
      reject();
    });
  });
}

export const apiCreate = (url: string, payload: any, dispatch: Dispatch, name?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    Axios.post(url, payload).then(() => resolve()).catch((error: any) => {
      dispatch("error/submit", { message: `Create ${name || ""} request failed`, error }, { root: true });
      reject();
    });
  });
}

export const apiUpdate = (url: string, payload: any, dispatch: Dispatch, name?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    Axios.put(url, payload).then(() => resolve()).catch((error: any) => {
      dispatch("error/submit", { message: `Update ${name || ""} request failed`, error }, { root: true });
      reject();
    });
  });
}

export const apiDelete = (url: string, dispatch: Dispatch, name?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    Axios.delete(url).then(() => resolve()).catch((error: any) => {
      dispatch("error/submit", { message: `Delete ${name || ""} request failed`, error }, { root: true });
      reject();
    });
  });
}

export const apiPost = (url: string, payload: any, dispatch: Dispatch): Promise<void> => {
  return new Promise((resolve, reject) => {
    Axios.post(url, payload).then(() => resolve()).catch((error: any) => {
      dispatch("error/submit", { message: "request failed", error }, { root: true });
      reject(error);
    });
  });
}
