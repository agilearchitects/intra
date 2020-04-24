// Libs
import { LogModule } from "@agilearchitects/logmodule";
import { parse } from "@agilearchitects/server";

// Modules
import { handlerMethod, HandlerModule } from "../modules/handler.module";

// DTO's
import { CreateProjectDTO } from "../../shared/dto/create-project.dto";
import { UpdateProjectDTO } from "../../shared/dto/update-project.dto";

// Services
import { ProjectService } from "../services/project.service";

// Base controller
import { UserEntity } from "../../shared/entities/user.entity";
import { Controller } from "./controller";

export class ProjectController extends Controller {
  public constructor(
    private readonly projectService: ProjectService,
    log: LogModule,
  ) { super(log); }

  public index(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        if (handler.request.user === undefined) { throw new Error("User not found"); }
        // TODO - Better solution
        const isAdmin: boolean = handler.request.user.hasClaim("admin");
        if (handler.request.user.hasClaim("admin")) {
          handler.sendJSON(await this.projectService.getAll());
        } else {
          handler.sendJSON(await this.projectService.getForUser(handler.request.user.id, isAdmin));
        }
      } catch (error) {
        this.logError(handler, "Error getting projects", error.toString());
        throw error;
      }
    };
  }
  public show(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        if (handler.request.user === undefined) { throw new Error("User not found"); }
        // TODO - Better solution
        const isAdmin: boolean = (await UserEntity.findOneOrFail(handler.request.user.id)).isAdmin;
        handler.sendJSON(await this.projectService.get(parseInt(handler.request.params.id, 10), handler.request.user.id, isAdmin));
      } catch (error) {
        this.logError(handler, "Error getting project", error);
        throw error;
      }
    };
  }
  @parse(CreateProjectDTO.parseFromRequest, "body")
  public create(): handlerMethod {
    return async (handler: HandlerModule) => {

      try {
        await this.projectService.create(handler.request.body);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error creating project", error);
        throw error;
      }
    };
  }

  @parse(UpdateProjectDTO.parseFromRequest, "body")
  public update(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        await this.projectService.update(handler.request.body);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error updating project", error);
        throw error;
      }
    };
  }

  public delete(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        if (handler.request.user === undefined) { throw new Error("User not found"); }
        // TODO - Better solution
        const isAdmin: boolean = (await UserEntity.findOneOrFail(handler.request.user.id)).isAdmin;
        await this.projectService.delete(parseInt(handler.request.params.id, 10), handler.request.user.id, isAdmin);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error deleting project", error);
        throw error;
      }
    };
  }
}
