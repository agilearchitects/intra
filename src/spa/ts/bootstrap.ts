// Libs
import moment from "moment";

// Services
import { APIService } from "../../shared/services/api.service";
import { DateService } from "../../shared/services/date.service";
import { AuthService } from "./services/auth.service";
import { BroadcastService } from "./services/broadcast.service";
import { CustomerService } from "./services/customer.service";
import { ErrorService } from "./services/error.service";
import { MenuService } from "./services/menu.service";
import { ProjectService } from "./services/project.service";
import { StorageService } from "./services/storage.service";
import { TagService } from "./services/tag.service";
import { TextService } from "./services/text.service";
import { TimeService } from "./services/time.service";
import { UserService } from "./services/user.service";

export const dateService = new DateService(moment);
export const apiService = new APIService();
export const broadcastService = new BroadcastService();
export const storageService = new StorageService(undefined, broadcastService);
export const projectService = new ProjectService(apiService);
export const textService = new TextService(apiService);
export const timeService = new TimeService(apiService, dateService);
export const errorService = new ErrorService(broadcastService);
export const customerService = new CustomerService(apiService, errorService);
export const tagService = new TagService(apiService, errorService);
export const authService = new AuthService(apiService, errorService, storageService);
export const menuService = new MenuService(authService);
export const userService = new UserService(apiService);

(window as any).authService = authService;
(window as any).storageService = storageService;
