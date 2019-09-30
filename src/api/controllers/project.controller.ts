// Libs
import { RequestHandler } from "express";

import { ICreateProjectJSON } from "../../shared/dto/create-project.dto";
import { CustomerEntity } from "../entities/customer.entity";
import { ProjectEntity } from "../entities/project.entity";
import { controller, Controller } from "./controller";

export class ProjectController {
  public index(): RequestHandler {
    return controller((handler) => {
      handler.response<{ foo: string }>().json({ foo: "bar" });
    });
  }
  public create(): RequestHandler {
    return controller((handler: Controller) => {
      const body = handler.body<ICreateProjectJSON>();
      CustomerEntity.findOne(body.customerId).then((customer?: CustomerEntity) => {
        if (customer !== undefined) {
          ProjectEntity.create({ name: body.name, customer })
            .save()
            .then(() => handler.sendStatus(200))
            .catch((error: any) => handler.sendStatus(500));
        } else {
          handler.sendStatus(500);
        }
      }).catch((error: any) => handler.sendStatus(500));
    });
  }
}

const projectController: ProjectController = new ProjectController();
export default projectController;
