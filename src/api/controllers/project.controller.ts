// Libs
import { RequestHandler } from "express";

// DTO's
import { ICreateProjectDTO } from "../../shared/dto/create-project.dto";
import { IProjectDTO } from "../../shared/dto/project.dto";
import { IUpdateProjectDTO } from "../../shared/dto/update-project.dto";

// Modules
import { controller, ControllerHandler } from "../modules/controller-handler.module";

// Bootstrap
import { projectService } from "../bootstrap";

// Base controller
import { Controller } from "./controller";

export class ProjectController extends Controller {
  public index(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        handler.response<IProjectDTO[]>().json(await projectService.getForUser(handler.request.user.id));
      } catch (error) {
        this.logError(handler.response(), "Error getting projects", error);
        handler.response().sendStatus(500);
        throw error;
      }
    });
  }
  public show(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const params: { id: string } = handler.params();
        handler.response<IProjectDTO>().json(await projectService.get(parseInt(params.id, 10), handler.request.user.id));
      } catch (error) {
        this.logError(handler.response(), "Error getting project", error);
        handler.response().sendStatus(500);
        throw error;
      }
    });
  }
  public create(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {

      try {
        const body = handler.body<ICreateProjectDTO>();
        await projectService.create(body);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Error creating project", error);
        handler.response().sendStatus(500);
        throw error;
      }
    });
  }

  public update(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const body = handler.body<IUpdateProjectDTO>();
        await projectService.update(body);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Error creating project", error);
        handler.response().sendStatus(500);
        throw error;
      }
    });
  }

  public delete(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const params: { id: string } = handler.params<{ id: string }>();
        await projectService.delete(parseInt(params.id, 10), handler.request.user.id);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Error creating project", error);
        handler.response().sendStatus(500);
        throw error;
      }
    });
  }
}

const projectController: ProjectController = new ProjectController();
export default projectController;
