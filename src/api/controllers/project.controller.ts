// Libs
import { RequestHandler } from "express";
import { ServiceModule } from "simplyserveme";

import { controller } from "./controller";

export class ProjectController extends ServiceModule {
  public index(): RequestHandler {
    return controller((handler) => {
      handler.response<{ foo: string }>().json({ foo: "bar" });
    });
  }
}

const projectController: ProjectController = ProjectController.getInstance<ProjectController>();
export default projectController;