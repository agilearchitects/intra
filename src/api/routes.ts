// Libs
import { Router } from "express";
import fileUpload from "express-fileupload";
import "./modules/router.module";
// Controllers
import authController from "./controllers/auth.controller";
import resourceController from "./controllers/resource.controller";
import textController from "./controllers/text.controller";

// Middlewares
import { middlewares } from "./middlewares";

const router: Router = Router();

router.group("/auth", [], (router: Router) => {
  router.post("/login", middlewares.guest(), authController.login());
  router.post("/create", middlewares.token(), authController.create());
});

router.group("/text", [], (router: Router) => {
  router.get("", middlewares.auth(), textController.index());
  router.get("/:name", textController.show());
  router.put("/:id", middlewares.auth(), textController.update());
});

router.group("/resource", [], (router: Router) => {
  router.post("/upload",
    middlewares.auth(),
    fileUpload({ limits: { fileSize: 20 * 1024 * 1204 } }),
    resourceController.upload());
  router.get("/:id", resourceController.show());
});

export { router };
