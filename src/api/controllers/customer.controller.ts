// Libs
import { RequestHandler } from "express";

// DTO's
import { ICreateCustomerDTO } from "../../shared/dto/create-customer.dto";
import { CustomerDTO, ICustomerDTO } from "../../shared/dto/customer.dto";

// Entities
import { CustomerEntity } from "../entities/customer.entity";
import { ProjectEntity } from "../entities/project.entity";

// Modules
import { controller, ControllerHandler } from "../modules/controller-handler.module";

// Base controller
import { ProjectDTO } from "../../shared/dto/project.dto";
import { TaskDTO } from "../../shared/dto/task.dto";
import { customerService } from "../bootstrap";
import { TaskEntity } from "../entities/task.entity";
import { Controller } from "./controller";

export class CustomerController extends Controller {
  public index(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const query: { all?: string } = handler.query<{ all?: string }>();
        if (query.all !== undefined) {
          handler.response<ICustomerDTO[]>().json(await customerService.getEvery());
        } else {
          handler.response<ICustomerDTO[]>().json(await customerService.getWithUserProjects(handler.request.user.id));
        }
      } catch (error) {
        this.logError(handler.response(), "Error getting customers", error);
        handler.response().sendStatus(500);
        throw error;
      }
    });
  }
  public create(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const customer = handler.body<ICreateCustomerDTO>();
        await customerService.create(customer);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Error creating customer", error);
        handler.response().sendStatus(500);
        throw error;
      }
    });
  }

  public update(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const customer = handler.body<ICustomerDTO>();
        await customerService.update(customer);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Error updating customer", error);
        handler.response().sendStatus(500);
        throw error;
      }
    });
  }
}

const customerController: CustomerController = new CustomerController();
export default customerController;
