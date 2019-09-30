// Libs
import { RequestHandler } from "express";

import { ICreateCustomerJSON } from "../../shared/dto/create-customer.dto";
import { ICustomerJSON } from "../../shared/dto/customer.dto";
import { CustomerEntity } from "../entities/customer.entity";
import { ProjectEntity } from "../entities/project.entity";
import { controller, Controller } from "./controller";

export class CustomerController {
  public index(): RequestHandler {
    return controller((handler) => {
      CustomerEntity.find({ relations: ["projects"] }).then((customers: CustomerEntity[]) => {
        handler.response<ICustomerJSON[]>().json(customers.map((customer: CustomerEntity) => ({
          id: customer.id,
          name: customer.name,
          ...(customer.projects.length > 0 ? {
            projects: customer.projects.map((project: ProjectEntity) => ({
              id: project.id,
              name: project.name,
            })),
          } : undefined),
        })));
      });
    });
  }
  public create(): RequestHandler {
    return controller((handler: Controller) => {
      CustomerEntity.create(handler.body<ICreateCustomerJSON>())
        .save()
        .then(() => handler.sendStatus(200))
        .catch((error: any) => handler.sendStatus(500));
    });
  }
}

const customerController: CustomerController = new CustomerController();
export default customerController;
