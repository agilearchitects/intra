// Libs
import moment from "moment";

// Services
import { AuthService } from "../services/auth.service";
import { BroadcastService } from "../services/broadcast.service";
import { ErrorService } from "../services/error.service";
import { MenuService } from "../services/menu.service";
import { MessageService } from "../services/message.service";
import { ProjectService } from "../services/project.service";
import { StorageService } from "../services/storage.service";
import { TagService } from "../services/tag.service";
import { TextService } from "../services/text.service";
import { TimeService } from "../services/time.service";
import { UserService } from "../services/user.service";

// Components
import MessageComponent from "../components/message.component.vue";

// Factories
import { apiServiceFactory } from "../../../shared/factories/api-service.factory";

// Middleware
import { DateService } from "../../../shared/services/date.service";
import { Middlewares } from "../middlewares";
import { CustomerService } from "../services/customer.service";
import { ModalInstance } from "../utils/modal/modal.util";

/* Main factory for SPA app. Modify this to return services (singletons)
for your app. Make sure to call this method only once to avoid multiple
instances of the same service */
export const SpaFactory = (): {
  authService: AuthService,
  menuService: MenuService,
  middleware: Middlewares,
  textService: TextService,
  messageService: MessageService,
  customerService: CustomerService,
  projectService: ProjectService,
  userService: UserService,
  tagService: TagService,
  timeService: TimeService,
} => {
  const broadcastService = new BroadcastService();
  const apiService = apiServiceFactory();
  const authService = new AuthService(
    apiService,
    new ErrorService(broadcastService),
    new StorageService(
      process.env.APP !== undefined ? process.env.APP : undefined,
      broadcastService,
    ),
  );
  const errorService = new ErrorService(new BroadcastService());

  return {
    authService,
    menuService: new MenuService(authService),
    middleware: new Middlewares(authService),
    textService: new TextService(apiService),
    messageService: new MessageService(ModalInstance, MessageComponent),
    customerService: new CustomerService(apiService, errorService),
    projectService: new ProjectService(apiService),
    userService: new UserService(apiService),
    tagService: new TagService(apiService, errorService),
    timeService: new TimeService(apiService, new DateService(moment)),
  }
}