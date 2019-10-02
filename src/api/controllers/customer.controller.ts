// Libs
import { RequestHandler } from "express";

// DTO's
import { ICreateCustomerJSON } from "../../shared/dto/create-customer.dto";
import { ICustomerJSON } from "../../shared/dto/customer.dto";

// Entities
import { CustomerEntity } from "../entities/customer.entity";
import { ProjectEntity } from "../entities/project.entity";

// Modules
import { controller, ControllerHandler } from "../modules/controller-handler.module";

// Base controller
import { Controller } from "./controller";

export class CustomerController extends Controller {
  public index(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const customers: CustomerEntity[] = await CustomerEntity.find({ relations: ["projects"] });
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
      } catch (error) {
        this.logError(handler.response(), "Error getting customers", error);
        throw error;
      }
    });
  }
  public create(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        await CustomerEntity.create(handler.body<ICreateCustomerJSON>()).save();
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Error creating customer", error);
        throw error;
      }
    });
  }
}

const customerController: CustomerController = new CustomerController();
export default customerController;
