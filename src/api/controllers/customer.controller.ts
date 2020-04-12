
// Libs
import { parse } from "@agilearchitects/server";

// DTO's
import { CreateCustomerDTO } from "../../shared/dto/create-customer.dto";
import { CustomerDTO } from "../../shared/dto/customer.dto";

// Modules
import { handlerMethod, HandlerModule } from "../modules/handler.module";

// Base controller
import { customerService } from "../bootstrap";
import { Controller } from "./controller";

export class CustomerController extends Controller {
  public index(): handlerMethod {
    return async (handler: HandlerModule) => {
      if (handler.request.user === undefined) { throw new Error("User was not provided"); }
      try {
        const query: { all?: string } = handler.query;
        if (query.all !== undefined) {
          handler.sendJSON(await customerService.getEvery());
        } else {
          handler.sendJSON(await customerService.getWithUserProjects(handler.request.user.id));
        }
      } catch (error) {
        this.logError(handler, "Error getting customers", error);
        throw error;
      }
    };
  }

  @parse(CreateCustomerDTO.parseFromRequest, "body")
  public create(): handlerMethod {
    return async (handler: HandlerModule<CreateCustomerDTO>) => {
      try {
        await customerService.create(handler.parsedBody);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error creating customer", error);
        throw error;
      }
    };
  }

  @parse(CustomerDTO.parseFromRequest, "body")
  public update(): handlerMethod {
    return async (handler: HandlerModule<CustomerDTO>) => {
      try {
        await customerService.update(handler.parsedBody);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error updating customer", error);
        throw error;
      }
    };
  }
}

const customerController: CustomerController = new CustomerController();
export default customerController;
