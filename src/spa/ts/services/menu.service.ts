// Libs
import { TranslateResult } from "vue-i18n";
import { Location } from "vue-router";

// Locale
import { i18n } from "../locale";

// Modules
import { wiki, wikiToRoute } from "../../resources/wiki";

// Services
import { AuthService } from "./auth.service";

// Bootstrap
import { authService as authServiceInstance } from "../bootstrap";

export interface ITree { route: Location; title: TranslateResult; children?: ITree[]; }
export interface IMenuItem { route?: Location; title?: TranslateResult; children?: IMenuItem[]; divider?: boolean; }

export class MenuService {
  public constructor(
    private readonly authService: AuthService,
  ) { }

  public get tree(): ITree[] {
    return [
      { route: { name: "start" }, title: i18n.t("menu.start") },
      { route: { name: "wiki" }, title: i18n.t("menu.wiki"), children: wikiToRoute(wiki, "wiki") },
      {
        route: { name: "time" }, title: i18n.t("menu.time.time"), children: [
          { route: { name: "time.report" }, title: i18n.t("menu.time.report") },
          { route: { name: "time.result" }, title: i18n.t("menu.time.result") },
          { route: { name: "time.project" }, title: i18n.t("menu.time.project") },
        ],
      },
      { route: { name: "crm" }, title: i18n.t("menu.crm") },
    ];
  }
  public get leftMenu(): IMenuItem[] {
    return [
      { route: { name: "start" }, title: i18n.t("menu.start") },
      { route: { name: "wiki" }, title: i18n.t("menu.wiki"), children: wikiToRoute(wiki, "wiki") },
    ];
  }
  public get rightMenu(): IMenuItem[] {
    return [
      ...this.authService.isAuth ? [
        {
          route: { name: "time" }, title: i18n.t("menu.time.time"), children: [
            { route: { name: "time.report" }, title: i18n.t("menu.time.report") },
            { route: { name: "time.result" }, title: i18n.t("menu.time.result") },
          ],
        },
        { route: { name: "cv" }, title: i18n.t("menu.cv") },
        { route: { name: "crm" }, title: i18n.t("menu.crm") },
        { divider: true },
        { route: { name: "logout" }, title: i18n.t("menu.logout") },
      ] : [
          { route: { name: "login" }, title: i18n.t("menu.login") },
        ],
    ];
  }
  public get menus(): IMenuItem[][] {
    return [this.leftMenu, this.rightMenu];
  }
}
