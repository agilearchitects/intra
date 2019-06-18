import { Location } from "vue-router";
import { ActionTree, GetterTree, Module, MutationTree } from "vuex";

import { TranslateResult } from "vue-i18n";
import { i18n } from "../locale";
import { IAppState } from "./app.store";

export interface ITree { route: Location; title: TranslateResult; subTree?: ITree[]; }
export interface IMenuItem { route?: Location; title?: TranslateResult; menu?: IMenuItem[]; divider?: boolean; }

export interface IMenuState { } // tslint:disable-line:no-empty-interface

export const menuStore: Module<IMenuState, IAppState> = {
  getters: {
    tree: (state, getters): ITree[] => [
      { route: { name: "start" }, title: i18n.t("menu.start") },
    ],
    leftMenu: (state, getters): IMenuItem[] => [
      { route: { name: "start" }, title: i18n.t("menu.start") },
    ],
    rightMenu: (state, getters): IMenuItem[] => [
      ...getters["auth/isAuth"] ? [
        { route: { name: "logout" }, title: i18n.t("menu.logout") },
      ] : [
          { route: { name: "login" }, title: i18n.t("menu.login") },
        ],
    ],
    menus: (state, getters): IMenuItem[][] => {
      return [getters.leftMenu, getters.rightMenu];
    },
  } as GetterTree<IMenuState, IAppState>,
};
