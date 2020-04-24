// Libs
import { LogModule } from "@agilearchitects/logmodule";
import { parse } from "@agilearchitects/server";

// DTO's
import { CreateTimeDTO } from "../../shared/dto/create-time.dto";
import { StopTimeDTO } from "../../shared/dto/stop-time.dto";
import { TimeQueryDTO } from "../../shared/dto/time-query.dto";
import { UpdateTimeDTO } from "../../shared/dto/update-time.dto";

// Modules
import { handlerMethod, HandlerModule } from "../modules/handler.module";

// Services
import { TimeService } from "../services/time.service";

// Base controller
import { Controller } from "./controller";

export class TimeController extends Controller {
  public constructor(
    private readonly timeService: TimeService,
    log: LogModule,
  ) { super(log); }
  public index(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        const query = TimeQueryDTO.parse(handler.request.query);
        if (handler.request.user === undefined) { throw new Error("User was not defined"); }
        handler.sendJSON(await this.timeService.getAll(query.date, query.month, query.year, query.week, handler.request.user.id));
      } catch (error) {
        this.logError(handler, "Error getting times");
        throw error;
      }
    };
  }

  public show(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        handler.sendJSON(await this.timeService.get(parseInt(handler.request.params.id, 10)));
      } catch (error) {
        this.logError(handler, "Error getting time", error);
        throw error;
      }
    };
  }

  @parse(CreateTimeDTO.parseFromRequest, "body")
  public create(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        await this.timeService.create(handler.request.body);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error creating time", error);
        throw error;
      }
    };
  }

  @parse(UpdateTimeDTO.parseFromRequest, "body")
  public update(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        await this.timeService.update(handler.request.body);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error updating time", error);
        throw error;
      }
    };
  }

  public delete(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        await this.timeService.delete(parseInt(handler.request.params.id, 10));
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error deleting time", error);
        throw error;
      }
    };
  }

  @parse(StopTimeDTO.parseFromRequest, "body")
  public stop(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        await this.timeService.stop(handler.request.body);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Unable to stop time", error);
        throw error;
      }
    };
  }
}
