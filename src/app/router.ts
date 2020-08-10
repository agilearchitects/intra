// Libs
import { RouterModule } from "@agilearchitects/server";
import { AuthController } from "./controllers/auth.controller";
import { CustomerController } from "./controllers/customer.controller";
import { MiddlewareController } from "./controllers/middleware.controller";
import { ProjectController } from "./controllers/project.controller";
import { RouterController } from "./controllers/router.controller";
import { TagController } from "./controllers/tag.controller";
import { TextController } from "./controllers/text.controller";
import { TimeController } from "./controllers/time.controller";
import { UserController } from "./controllers/user.controller";
import { VersionController } from "./controllers/version.controller";

export const router = (
  middlewareController: MiddlewareController,
  versionController: VersionController,
  authController: AuthController,
  routerController: RouterController,
  userController: UserController,
  customerController: CustomerController,
  projectController: ProjectController,
  timeController: TimeController,
  tagController: TagController,
  textController: TextController,
): RouterModule => {
  // Create router
  const router: RouterModule = new RouterModule();

  router.get("version", { name: "version" }, versionController.index());

  router.group("auth", { name: "auth" }, [], (router: RouterModule) => {
    router.post("login", {
      name: "login",
      document: {
        inputInterface: {
          name: "ILoginDTO",
          path: "./src/shared/dto/login.dto.ts"
        },
        outputInterface: {
          name: "ILoginPayloadDTO",
          path: "./node_modules/@agilearchitects/authenticaton/lib/dto/login-payload.dto.d.ts"
        }
      }
    }, authController.login());
    // Route for requesting password reset
    router.post("reset-password", {},
      middlewareController.reCaptchaToken(),
      authController.requestPasswordReset()
    );

    // Route for validating password reset token
    router.post("validate-reset-token", {}, authController.validateResetToken());

    // Route for resetting password
    router.post("password-reset", {}, authController.resetPassword());

    router.post("create", {}, middlewareController.token(), authController.create());
    return router;
  });


  router.group("", {}, [middlewareController.auth()], (router: RouterModule) => {
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

    return router;
  });

  router.get("router", { name: "router" }, routerController.index(router));

  return router;
}