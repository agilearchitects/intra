// Libs
import { parse } from "@agilearchitects/server";

// DTO's
import { CreateTimeDTO } from "../../shared/dto/create-time.dto";
import { StopTimeDTO } from "../../shared/dto/stop-time.dto";
import { TimeQueryDTO } from "../../shared/dto/time-query.dto";
import { UpdateTimeDTO } from "../../shared/dto/update-time.dto";

// Modules
import { handlerMethod, HandlerModule } from "../modules/handler.module";

// Services
import { timeService } from "../bootstrap";

// Base controller
import { Controller } from "./controller";

export class TimeController extends Controller {
  public index(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        const query = TimeQueryDTO.parse(handler.query);
        if (handler.request.user === undefined) { throw new Error("User was not defined"); }
        handler.sendJSON(await timeService.getAll(query.date, query.month, query.year, query.week, handler.request.user.id));
      } catch (error) {
        this.logError(handler, "Error getting times");
        throw error;
      }
    };
  }

  public show(): handlerMethod {
    return async (handler: HandlerModule<any, { id: string }>) => {
      try {
        handler.sendJSON(await timeService.get(parseInt(handler.params.id, 10)));
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
        await timeService.create(handler.parsedBody);
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
        await timeService.update(handler.parsedBody);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error updating time", error);
        throw error;
      }
    };
  }

  public delete(): handlerMethod {
    return async (handler: HandlerModule<any, { id: string }>) => {
      try {
        await timeService.delete(parseInt(handler.params.id, 10));
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error deleting time", error);
        throw error;
      }
    };
  }

  @parse(StopTimeDTO.parseFromRequest, "body")
  public stop(): handlerMethod {
    return async (handler: HandlerModule<StopTimeDTO>) => {
      try {
        await timeService.stop(handler.parsedBody);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Unable to stop time", error);
        throw error;
      }
    };
  }
}

const timeController: TimeController = new TimeController();
export default timeController;
