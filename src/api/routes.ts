// Libs
import { handlerMethod, HandlerModule, RouterModule } from "@agilearchitects/server";
import * as fs from "fs";

// Controllers
import authController from "./controllers/auth.controller";
import customerController from "./controllers/customer.controller";
import projectController from "./controllers/project.controller";
import resourceController from "./controllers/resource.controller";
import tagController from "./controllers/tag.controller";
import textController from "./controllers/text.controller";
import timeController from "./controllers/time.controller";
import userController from "./controllers/user.controller";

// Middlewares
import { middlewares } from "./middlewares";

const router: RouterModule = new RouterModule();
router.group("auth", "auth", [], (router: RouterModule) => {
  router.post("login", "login", authController.login());
  router.post("/create", middlewares.token(), authController.create());
  return router;
});

router.group("", "", [middlewares.auth()], (router: RouterModule) => {
  router.group("/customer", "customer", [], (router: RouterModule) => {
    router.get("", "index", customerController.index());
    router.post("", "create", customerController.create());
    return router;
  });
  router.group("/project", "project", [], (router: RouterModule) => {
    router.get("", "index", projectController.index());
    router.get(":id", "show", projectController.show());
    router.post("", "create", projectController.create());
    router.put(":id", "update", projectController.update());
    router.delete(":id", "delete", projectController.delete());
    return router;
  });

  router.group("/time", "time", [], (router: RouterModule) => {
    router.get("", "index", timeController.index());
    router.get(":id", "show", timeController.show());
    router.post("", "create", timeController.create());
    router.put(":id", "update", timeController.update());
    router.delete(":id", "delete", timeController.delete());
    router.put("stop/:id", "stop", timeController.stop());
    return router;
  });

  router.get("/tag", tagController.index());
  router.group("text", "text", [], (router: RouterModule) => {
    router.get("", "index", textController.index());
    router.get(":name", "show", textController.show());
    router.put(":id", "update", textController.update());
    return router;
  });

  router.get("/user", "index", userController.index());
  router.group("/resource", "resource", [], (router: RouterModule) => {
    // router.post("/upload",
    // fileUpload({ limits: { fileSize: 20 * 1024 * 1204 } }),
    // resourceController.upload());
    router.get(":id", "show", resourceController.show());
    return router;
  });

  return router;
});

export { router };
