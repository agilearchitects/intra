// Libs
import { RequestHandler } from "express";
import moment, { Moment } from "moment";

// DTO's
import { ICreateTimeDTO } from "../../shared/dto/create-time.dto";
import { IStopTimeDTO } from "../../shared/dto/stop-time.dto";
import { ITimeDTO } from "../../shared/dto/time.dto";
import { IUpdateTimeDTO } from "../../shared/dto/update-time.dto";
import { ITimeQueryDTO } from "../../shared/dto/time-query.dto";

// Services
import { customerService, timeService } from "../bootstrap";

// Base controller
import { Controller } from "./controller";
import { controller, ControllerHandler } from "../modules/controller-handler.module";

export class TimeController extends Controller {
  public index(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const query = handler.query<ITimeQueryDTO>();
        if (query.groupBy === "customer") {
          handler.response<any>().json(await customerService.getWithUserProjects(handler.request.user.id, query.date, query.month, query.year, query.week));
        } else {
          handler.response<ITimeDTO[]>().json(await timeService.getAll(query.date, query.month, query.year, query.week, handler.request.user.id));
        }
      } catch (error) {
        this.logError(handler.response(), "Error getting times");
        throw error;
      }
    });
  }

  public show(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const params: { id: string } = handler.params<{ id: string }>();
        handler.response<ITimeDTO>().json(await timeService.get(parseInt(params.id, 10)));
      } catch (error) {
        this.logError(handler.response(), "Error getting time", error);
        throw error;
      }
    });
  }

  public create(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const body = handler.body<ICreateTimeDTO>();
        await timeService.create(body);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Error creating time", error);
        throw error;
      }
    });
  }

  public update(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const body = handler.body<IUpdateTimeDTO>();
        await timeService.update(body);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Error updating time", error);
        throw error;
      }
    });
  }

  public delete(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const params: { id: string } = handler.params<{ id: string }>();
        await timeService.delete(parseInt(params.id, 10));
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Error deleting time", error);
        throw error;
      }
    });
  }

  public stop(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const body = handler.body<IStopTimeDTO>();
        await timeService.stop(body);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Unable to stop time", error);
        throw error;
      }
    });
  }
}

const timeController: TimeController = new TimeController();
export default timeController;
