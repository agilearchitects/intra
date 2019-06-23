// Libs
import { RequestHandler } from "express";
import { ServiceModule } from "simplyserveme";

import { controller } from "./controller";
import { CustomerEntity } from "../entities/customer.entity";
import { ICustomerJSON } from "../../shared/dto/customer.dto";
import { ProjectEntity } from "../entities/project.entity";

export class CustomerController extends ServiceModule {
  public index(): RequestHandler {
    return controller((handler) => {
      CustomerEntity.find({ relations: ["projects"] }).then((customers: CustomerEntity[]) => {
        handler.response<ICustomerJSON[]>().json(customers.map((customer: CustomerEntity) => ({
          id: customer.id,
          name: customer.name,
          ...(customer.projects.length > 0 ? {
            projects: customer.projects.map((project: ProjectEntity) => ({
              id: project.id,
              name: project.name
            }))
          } : undefined),
        })));
      });
    });
  }
}

const customerController: CustomerController = CustomerController.getInstance<CustomerController>();
export default customerController;