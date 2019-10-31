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
import { TaskEntity } from "../entities/task.entity";
import { Controller } from "./controller";

export class CustomerController extends Controller {
  public index(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const customers: CustomerEntity[] = await CustomerEntity.find({
          relations: [
            "projects",
            "projects.tasks"],
        });
        handler.response<ICustomerDTO[]>().json(customers.map((customer: CustomerEntity) => CustomerDTO.parse({
          id: customer.id,
          name: customer.name,
          ...(customer.projects.length > 0 ? {
            projects: customer.projects.map((project: ProjectEntity) => ProjectDTO.parse({
              id: project.id,
              name: project.name,
              ...(project.rate !== null ? { rate: project.rate } : undefined),
              ...(project.priceBudget !== null ? { priceBudget: project.priceBudget } : undefined),
              ...(project.hoursBudget !== null ? { hoursBudget: project.hoursBudget } : undefined),
              tasks: project.tasks.map((task: TaskEntity) => TaskDTO.parse({
                id: task.id,
                name: task.name,
                ...(task.rate !== null ? { rate: task.rate } : undefined),
                ...(task.priceBudget !== null ? { priceBudget: task.priceBudget } : undefined),
                ...(task.hoursBudget !== null ? { hoursBudget: task.hoursBudget } : undefined),
              }).serialize()),
            }).serialize()),
          } : undefined),
        }).serialize()));
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
        const customer: CustomerEntity = await CustomerEntity.create(handler.body<ICreateCustomerDTO>()).save();
        handler.response<ICustomerDTO>().json(CustomerDTO.parse({
          id: customer.id,
          name: customer.name,
        }).serialize());
      } catch (error) {
        this.logError(handler.response(), "Error creating customer", error);
        handler.response().sendStatus(500);
        throw error;
      }
    });
  }
}

const customerController: CustomerController = new CustomerController();
export default customerController;
