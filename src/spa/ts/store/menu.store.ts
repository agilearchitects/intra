import { Location } from "vue-router";
import { ActionTree, GetterTree, Module, MutationTree } from "vuex";

import { TranslateResult } from "vue-i18n";
import { i18n } from "../locale";
import { IAppState } from "./app.store";
import { wikiToRoute, wiki } from "../utils/wiki";

export interface ITree { route: Location; title: TranslateResult; children?: ITree[]; }
export interface IMenuItem { route?: Location; title?: TranslateResult; children?: IMenuItem[]; divider?: boolean; }

export interface IMenuState { } // tslint:disable-line:no-empty-interface



export const menuStore: Module<IMenuState, IAppState> = {
  getters: {
    tree: (state, getters): ITree[] => [
      { route: { name: "start" }, title: i18n.t("menu.start") },
      { route: { name: "wiki" }, title: i18n.t("menu.wiki"), children: wikiToRoute(wiki, "wiki") },
      {
        route: { name: "time" }, title: i18n.t("menu.time.time"), children: [
          { route: { name: "time.report" }, title: i18n.t("menu.time.report") },
          { route: { name: "time.result" }, title: i18n.t("menu.time.result") },
        ]
      },
      { route: { name: "crm" }, title: i18n.t("menu.crm") },
    ],
    leftMenu: (state, getters): IMenuItem[] => [
      { route: { name: "start" }, title: i18n.t("menu.start") },
      { route: { name: "wiki" }, title: i18n.t("menu.wiki"), children: wikiToRoute(wiki, "wiki") },
    ],
    rightMenu: (state, getters): IMenuItem[] => [
      ...getters["auth/isAuth"] ? [
        {
          route: { name: "time" }, title: i18n.t("menu.time.time"), children: [
            { route: { name: "time.report" }, title: i18n.t("menu.time.report") },
            { route: { name: "time.result" }, title: i18n.t("menu.time.result") },
          ]
        },
        { route: { name: "crm" }, title: i18n.t("menu.crm") },
        { divider: true },
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
