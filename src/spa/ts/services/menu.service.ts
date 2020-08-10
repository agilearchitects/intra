// Libs
import { TranslateResult } from "vue-i18n";
import { Location } from "vue-router";

// Services
import { AuthService } from "./auth.service";

// Locale
import { i18n } from "../locale";

// Menu
import { ClaimPayloadDTO } from "../../../shared/dto/claim-payload.dto";
import { UserPayloadDTO } from "../../../shared/dto/user-payload.dto";
import menu from "../../resources/menu.json";
import { BroadcastService, ISubscription } from "./broadcast.service";

export type position = "left" | "right";

interface IJsonDivider {
  divider: true;
  claims?: string[];
}
interface IJsonRootDivider extends IJsonDivider {
  position: position;
}

interface IJsonMenu {
  route: string | Location;
  name: string;
  claims?: string[];
  children?: jsonMenuType[];
}
interface IJsonRootMenu extends IJsonMenu {
  position?: position;
}

export interface IDivider {
  divider: true;
}
export interface IMenu {
  route: Location;
  title: TranslateResult;
  children?: menuType[];
}

export interface ITree {
  route: Location;
  title: TranslateResult;
  children?: ITree[];
}

type jsonRootMenuType = IJsonRootMenu | IJsonRootDivider;
type jsonMenuType = IJsonMenu | IJsonDivider;
export type menuType = IMenu | IDivider;

export class MenuService {
  private readonly broadcastService = new BroadcastService();

  public constructor(
    private readonly authService: AuthService,
  ) {
    // Set up listners for login and logout to emit when menu is changing
    this.authService.onLogin(() => this.broadcastService.emit("menu_change"));
    this.authService.onLogout(() => this.broadcastService.emit("menu_change"));
  }

  public getJsonMenu(): jsonRootMenuType[] {
    const user: UserPayloadDTO = this.authService.user !== undefined ?
      this.authService.user :
      // Will use dummy user with guest claim if not logged in
      UserPayloadDTO.parse({
        id: 0,
        email: "",
        claims: [ClaimPayloadDTO.parse({ id: 0, name: "guest" })],
      });
    return this.claimFilterMenu(menu as any, user) as jsonRootMenuType[];
  }

  // Property for menu tree
  public getTree(): ITree[] {
    return this.mapToTree(this.getJsonMenu());
  }

  // Property for left side menu
  public getLeftMenu(): menuType[] {
    return this.mapRootMenu(this.getJsonMenu(), "left");
  }

  // Property for right side menu
  public getRightMenu(): menuType[] {
    return this.mapRootMenu(this.getJsonMenu(), "right");
  }

  public getMenu(): menuType[] {
    return this.mapRootMenu(this.getJsonMenu());
  }

  private claimFilterMenu(menu: (jsonRootMenuType | jsonMenuType)[], user: UserPayloadDTO): (jsonRootMenuType | jsonMenuType)[] {
    return menu.filter((item: jsonRootMenuType | jsonMenuType) => item.claims === undefined || (item.claims !== undefined && user.hasClaim(item.claims, "all")))
      .map((item: jsonRootMenuType | jsonMenuType) => "children" in item && item.children !== undefined ? { ...item, children: this.claimFilterMenu(item.children, user) } : item);
  }

  public onMenuChange(callback: () => void): ISubscription {
    return this.broadcastService.subscribe("menu_change", callback);
  }

  private mapRootMenu(menu: jsonRootMenuType[], position?: position): menuType[] {
    return this.mapToMenu(menu.filter((menu: jsonRootMenuType) =>
      // No position is provided (will return all menu items)
      position === undefined ||
      // Position for menu is set and match provided position
      (menu.position !== undefined && menu.position === position) ||
      // Provided position is set to left and menu position is not defined (default to left)
      (position === "left" && menu.position === undefined)
    ));
  }

  private mapToMenu(menu: jsonMenuType[]): menuType[] {
    return menu.map((item: jsonMenuType) => ({
      ...("divider" in item ? {
        divider: item.divider,
      } : {
          route: typeof item.route === "string" ? { name: item.route } : item.route,
          title: i18n.t(item.name),
          ...(item.children !== undefined ? { children: this.mapToMenu(item.children) } : undefined)
        })
    }))
  }

  private mapToTree(menu: (jsonRootMenuType | jsonMenuType)[]): ITree[] {
    return (menu.filter((item: jsonRootMenuType | jsonMenuType) => ("divider" in item) === false) as (IJsonRootMenu | IJsonMenu)[])
      .map((item: IJsonRootMenu | IJsonMenu) => ({
        route: typeof item.route === "string" ? { name: item.route } : item.route,
        title: i18n.t(item.name),
        ...(item.children !== undefined ? { children: this.mapToTree(item.children) } : undefined),
      }));
  }
}
