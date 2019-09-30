// Libs
import { Router } from "express";
import fileUpload from "express-fileupload";
import "./modules/router.module";

// Controllers
import authController from "./controllers/auth.controller";
import customerController from "./controllers/customer.controller";
import projectController from "./controllers/project.controller";
import resourceController from "./controllers/resource.controller";
import textController from "./controllers/text.controller";
import timeController from "./controllers/time.controller";

// Middlewares
import { controller } from "./controllers/controller";
import { middlewares } from "./middlewares";

const router: Router = Router();

router.group("/auth", [], (router: Router) => {
  router.post("/login", middlewares.guest(), authController.login());
  router.post("/create", middlewares.token(), authController.create());
});

router.group("", [middlewares.auth()], (router: Router) => {
  router.group("/customer", [], (router: Router) => {
    router.get("", customerController.index());
    router.post("", customerController.create());
  });
  router.group("/project", [], (router: Router) => {
    router.post("", projectController.create());
  });

  router.group("/time", [], (router: Router) => {
    router.get("", timeController.index());
    router.get("/:id", timeController.show());
    router.post("", timeController.create());
    router.put("/:id", timeController.update());
    router.delete("/:id", timeController.delete());
    router.put("/stop/:id", controller(timeController.stop));
  });
  router.group("/text", [], (router: Router) => {
    router.get("", textController.index());
    router.get("/:name", textController.show());
    router.put("/:id", textController.update());
  });
  router.group("/resource", [], (router: Router) => {
    router.post("/upload",
      fileUpload({ limits: { fileSize: 20 * 1024 * 1204 } }),
      resourceController.upload());
    router.get("/:id", resourceController.show());
  });
});

export { router };
