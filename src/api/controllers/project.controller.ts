// Modules
import { handlerMethod, HandlerModule } from "../modules/handler.module";

// DTO's
import { CreateProjectDTO, ICreateProjectDTO } from "../../shared/dto/create-project.dto";
import { IUpdateProjectDTO, UpdateProjectDTO } from "../../shared/dto/update-project.dto";

// Bootstrap
import { projectService } from "../bootstrap";

// Base controller
import { parse } from "@agilearchitects/server";
import { UserEntity } from "../../shared/entities/user.entity";
import { Controller } from "./controller";

export class ProjectController extends Controller {
  public index(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        if (handler.request.user === undefined) { throw new Error("User not found"); }
        // TODO - Better solution
        const isAdmin: boolean = handler.request.user.hasClaim("admin");
        if (handler.request.user.hasClaim("admin")) {
          handler.sendJSON(await projectService.getAll());
        } else {
          handler.sendJSON(await projectService.getForUser(handler.request.user.id, isAdmin));
        }
      } catch (error) {
        this.logError(handler, "Error getting projects", error.toString());
        throw error;
      }
    };
  }
  public show(): handlerMethod {
    return async (handler: HandlerModule<any, { id: string }>) => {
      try {
        if (handler.request.user === undefined) { throw new Error("User not found"); }
        // TODO - Better solution
        const isAdmin: boolean = (await UserEntity.findOneOrFail(handler.request.user.id)).isAdmin;
        handler.sendJSON(await projectService.get(parseInt(handler.params.id, 10), handler.request.user.id, isAdmin));
      } catch (error) {
        this.logError(handler, "Error getting project", error);
        throw error;
      }
    };
  }
  @parse(CreateProjectDTO.parseFromRequest, "body")
  public create(): handlerMethod {
    return async (handler: HandlerModule<ICreateProjectDTO>) => {

      try {
        await projectService.create(handler.parsedBody);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error creating project", error);
        throw error;
      }
    };
  }

  @parse(UpdateProjectDTO.parseFromRequest, "body")
  public update(): handlerMethod {
    return async (handler: HandlerModule<IUpdateProjectDTO>) => {
      try {
        await projectService.update(handler.parsedBody);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error updating project", error);
        throw error;
      }
    };
  }

  public delete(): handlerMethod {
    return async (handler: HandlerModule<any, { id: string }>) => {
      try {
        if (handler.request.user === undefined) { throw new Error("User not found"); }
        // TODO - Better solution
        const isAdmin: boolean = (await UserEntity.findOneOrFail(handler.request.user.id)).isAdmin;
        await projectService.delete(parseInt(handler.params.id, 10), handler.request.user.id, isAdmin);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error deleting project", error);
        throw error;
      }
    };
  }
}

const projectController: ProjectController = new ProjectController();
export default projectController;
