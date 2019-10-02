// Libs
import { RequestHandler } from "express";

// DTO's
import { ICreateProjectJSON } from "../../shared/dto/create-project.dto";

// Entities
import { CustomerEntity } from "../entities/customer.entity";
import { ProjectEntity } from "../entities/project.entity";

// Modules
import { controller, ControllerHandler } from "../modules/controller-handler.module";

// Base controller
import { Controller } from "./controller";

export class ProjectController extends Controller {
  public index(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        handler.response<{ foo: string }>().json({ foo: "bar" });
      } catch (error) {
        throw error;
      }
    });
  }
  public create(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const body = handler.body<ICreateProjectJSON>();
        const customer = await CustomerEntity.findOneOrFail(body.customerId);
        await ProjectEntity.create({ name: body.name, customer }).save();
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Error creating project", error);
        throw error;
      }
    });
  }
}

const projectController: ProjectController = new ProjectController();
export default projectController;
