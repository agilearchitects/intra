// Libs
import { AuthService, UserService } from "@agilearchitects/authenticaton";
import { EnvService } from "@agilearchitects/env";
import { HashtiService } from "@agilearchitects/hashti";
import { LogModule } from "@agilearchitects/logmodule";
import { HandlerModule, RouterModule } from "@agilearchitects/server";

// Modules
import { PackageJsonReaderModule } from "./modules/package-json-reader.module";

// Services
import { CustomerService } from "./services/customer.service";
import { ProjectService } from "./services/project.service";
import { TimeService } from "./services/time.service";

// Controllers
import { AuthController } from "./controllers/auth.controller";
import { CustomerController } from "./controllers/customer.controller";
import { ProjectController } from "./controllers/project.controller";
import { ResourceController } from "./controllers/resource.controller";
import { TagController } from "./controllers/tag.controller";
import { TextController } from "./controllers/text.controller";
import { TimeController } from "./controllers/time.controller";
import { UserController } from "./controllers/user.controller";

// Middlewares
import { Middlewares } from "./middlewares";

export const routes = (
  authService: AuthService,
  userService: UserService,
  hashtiService: HashtiService,
  customerService: CustomerService,
  projectService: ProjectService,
  timeService: TimeService,
  envService: EnvService,
  log: LogModule,

): RouterModule => {
  const authController = new AuthController(authService, userService, hashtiService, log);
  const customerController = new CustomerController(customerService, log);
  const projectController = new ProjectController(projectService, log);
  const resourceController = new ResourceController(undefined, log);
  const tagController = new TagController(log);
  const textController = new TextController(log);
  const timeController = new TimeController(timeService, log);
  const userController = new UserController(log);
  const middlewares = new Middlewares(log, authService, userService, envService);

  const router: RouterModule = new RouterModule();

  router.get("version", {}, (handler: HandlerModule) => {
    try {
      handler.sendJSON({ "version": new PackageJsonReaderModule().get().version });
    } catch (error) {
      handler.sendStatus(500);
    }
  });

  router.group("auth", { name: "auth" }, [], (router: RouterModule) => {
    router.post("login", { name: "login" }, authController.login());
    router.post("create", {}, middlewares.token(), authController.create());
    return router;
  });

  router.group("", {}, [middlewares.auth()], (router: RouterModule) => {
    router.group("/customer", { name: "customer" }, [], (router: RouterModule) => {
      router.get("", { name: "index" }, customerController.index());
      router.post("", { name: "create" }, customerController.create());
      return router;
    });
    router.group("/project", { name: "project" }, [], (router: RouterModule) => {
      router.get("", { name: "index" }, projectController.index());
      router.get(":id", { name: "show" }, projectController.show());
      router.post("", { name: "create" }, projectController.create());
      router.put(":id", { name: "update" }, projectController.update());
      router.delete(":id", { name: "delete" }, projectController.delete());
      return router;
    });

    router.group("/time", { name: "time" }, [], (router: RouterModule) => {
      router.get("", { name: "index" }, timeController.index());
      router.get(":id", { name: "show" }, timeController.show());
      router.post("", { name: "create" }, timeController.create());
      router.put(":id", { name: "update" }, timeController.update());
      router.delete(":id", { name: "delete" }, timeController.delete());
      router.put("stop/:id", { name: "stop" }, timeController.stop());
      return router;
    });

    router.get("/tag", { name: "tag" }, tagController.index());
    router.group("text", { name: "text" }, [], (router: RouterModule) => {
      router.get("", { name: "index" }, textController.index());
      router.get(":name", { name: "show" }, textController.show());
      router.put(":id", { name: "update" }, textController.update());
      return router;
    });

    router.get("/user", { name: "index" }, userController.index());
    router.group("/resource", { name: "resource" }, [], (router: RouterModule) => {
      // router.post("/upload",
      // fileUpload({ limits: { fileSize: 20 * 1024 * 1204 } }),
      // resourceController.upload());
      router.get(":id", { name: "show" }, resourceController.show());
      return router;
    });

    return router;
  });

  return router;
}


