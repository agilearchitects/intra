// Libs
import { LogModule } from "@agilearchitects/logmodule";
import { handlerMethod, HandlerModule, parse } from "@agilearchitects/server";

// DTO's
import { CreateProjectDTO } from "../../shared/dto/create-project.dto";
import { UpdateProjectDTO } from "../../shared/dto/update-project.dto";
import { UserPayloadDTO } from "../../shared/dto/user-payload.dto";

// Services
import { ProjectService } from "../services/project.service";

// Base controller
import { UserService } from "@agilearchitects/authenticaton";
import { UserEntity } from "../entities/user.entity";
import { Controller } from "./controller";

export class ProjectController extends Controller {
  public constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    log: LogModule,
  ) { super(log); }

  public index(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        const user = handler.request.getContainerValue<UserPayloadDTO>("user");
        if (user === undefined) { throw new Error("User not found"); }
        if (user.hasClaim("admin")) {
          handler.sendJSON(await this.projectService.getAll());
        } else {
          handler.sendJSON(await this.projectService.getForUser(user.id, false));
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
        const user = handler.request.getContainerValue<UserPayloadDTO>("user");
        if (user === undefined) { throw new Error("User not found"); }
        handler.sendJSON(await this.projectService.get(parseInt(handler.request.params.id, 10), user.id, user.hasClaim("admin")));
      } catch (error) {
        this.logError(handler, "Error getting project", error);
        throw error;
      }
    };
  }
  @parse(CreateProjectDTO.parseFromRequest, "json")
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

  @parse(UpdateProjectDTO.parseFromRequest, "json")
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
        const user = handler.request.getContainerValue<UserPayloadDTO>("user");
        if (user === undefined) { throw new Error("User not found"); }
        await this.projectService.delete(parseInt(handler.request.params.id, 10), user.id, user.hasClaim("admin"));
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error deleting project", error);
        throw error;
      }
    };
  }
}
