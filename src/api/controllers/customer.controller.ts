
// Libs
import { LogModule } from "@agilearchitects/logmodule";
import { parse } from "@agilearchitects/server";

// DTO's
import { CreateCustomerDTO } from "../../shared/dto/create-customer.dto";
import { CustomerDTO } from "../../shared/dto/customer.dto";

// Services
import { CustomerService } from "../services/customer.service";

// Modules
import { handlerMethod, HandlerModule } from "../modules/handler.module";

// Base controller
import { Controller } from "./controller";

export class CustomerController extends Controller {
  public constructor(
    private readonly customerService: CustomerService,
    log: LogModule,
  ) { super(log); }

  public index(): handlerMethod {
    return async (handler: HandlerModule) => {
      if (handler.request.user === undefined) { throw new Error("User was not provided"); }
      try {
        const query: { all?: string } = handler.request.query;
        if (query.all !== undefined) {
          handler.sendJSON(await this.customerService.getEvery());
        } else {
          handler.sendJSON(await this.customerService.getWithUserProjects(handler.request.user.id));
        }
      } catch (error) {
        this.logError(handler, "Error getting customers", error);
        throw error;
      }
    };
  }

  @parse(CreateCustomerDTO.parseFromRequest, "body")
  public create(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        await this.customerService.create(handler.request.body);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error creating customer", error);
        throw error;
      }
    };
  }

  @parse(CustomerDTO.parseFromRequest, "body")
  public update(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        await this.customerService.update(handler.request.body);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error updating customer", error);
        throw error;
      }
    };
  }
}
