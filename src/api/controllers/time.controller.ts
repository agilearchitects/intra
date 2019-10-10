// Libs
import { RequestHandler } from "express";
import moment, { Moment } from "moment";
import { Between } from "typeorm";

// DTO's
import { ICreateTimeDTO } from "../../shared/dto/create-time.dto";
import { IStopTimeDTO } from "../../shared/dto/stop-time.dto";
import { ITimeDTO } from "../../shared/dto/time.dto";
import { IUpdateTimeDTO } from "../../shared/dto/update-time.dto";

// Entites
import { TimeEntity } from "../entities/time.entity";

// Modules
import { controller, ControllerHandler } from "../modules/controller-handler.module";

// Base controller
import { Controller } from "./controller";

export class TimeController extends Controller {
  public index(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const query = handler.query<{ date?: string, year?: string, month?: string, week?: string, all?: string }>();
        let start: string;
        let end: string;
        if (query.year !== undefined && query.week !== undefined) {
          start = moment(`${query.year} ${query.week}`, "YYYY W", true).startOf("isoWeek").format("YYYY-MM-DD 00:00:00");
          end = moment(`${query.year} ${query.week}`, "YYYY W", true).endOf("isoWeek").format("YYYY-MM-DD 23:59:59");
        }

        const times: TimeEntity[] = await TimeEntity.find({
          where: {
            // Only get provided date
            ...(query.date !== undefined ? {
              from: Between(
                moment(query.date, "YYYY-MM-DD", true).format("YYYY-MM-DD 00:00:00"),
                moment(query.date, "YYYY-MM-DD", true).format("YYYY-MM-DD 23:59:59")),
            } : undefined),
            ...(query.year !== undefined && query.month !== undefined ? {
              from: Between(
                moment(`${query.year}-${query.month}`, "YYYY-MM", true).format("YYYY-MM-01 00:00:00"),
                moment(`${query.year}-${query.month}`, "YYYY-MM", true).endOf("month").format("YYYY-MM-DD 23:59:59")),
            } : undefined),
            ...(query.year !== undefined && query.week !== undefined ? {
              from: Between(
                moment(`${query.year} ${query.week}`, "YYYY W", true).startOf("isoWeek").format("YYYY-MM-DD 00:00:00"),
                moment(`${query.year} ${query.week}`, "YYYY W", true).endOf("isoWeek").format("YYYY-MM-DD 23:59:59")),
            } : undefined),
            ...(query.year !== undefined && query.month === undefined && query.week === undefined ? {
              from: Between(
                moment(query.year, "YYYY", true).format("YYYY-01-01 00:00:00"),
                moment(query.year, "YYYY", true).format("YYYY-12-31 23:59:59")),
            } : undefined),
            // If query "all" is not provided only fetch entities belonging to current user
            ...(query.all === undefined ? { user: handler.request.user } : undefined),
          },
          relations: ["project", "project.customer"],
          order: { from: "DESC" },
        });

        handler.response<ITimeDTO[]>().json(times.map((time: TimeEntity) => {
          return {
            id: time.id,
            ...(time.project !== null ? {
              project: {
                id: time.project.id,
                name: time.project.name,
                ...(time.project.customer !== null ? {
                  customer: {
                    id: time.project.customer.id,
                    name: time.project.customer.name,
                  },
                } : undefined),
              },
            } : undefined),
            from: moment(time.from).format("YYYY-MM-DD HH:mm:ss"),
            ...(time.to !== null ? { to: moment(time.to).format("YYYY-MM-DD HH:mm:ss") } : undefined),
            comment: time.comment,
          };
        }));
      } catch (error) {
        this.logError(handler.response(), "Error getting times");
        throw error;
      }
    });
  }

  public show(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const time: TimeEntity = await TimeEntity.findOneOrFail({
          where: { id: parseInt(handler.params<{ id: string }>().id, 10) },
          relations: ["project", "project.customer"],
        });
        handler.response<ITimeDTO>().json({
          id: time.id,
          ...(time.project !== undefined ? {
            project: {
              id: time.project.id,
              name: time.project.name,
              ...(time.project.customer !== undefined ? {
                customer: {
                  id: time.project.customer.id,
                  name: time.project.customer.name,
                },
              } : undefined),
            },
          } : undefined),
          from: moment(time.from).format("YYYY-MM-DD HH:mm:ss"),
          ...(time.to !== null ? { to: moment(time.to).format("YYYY-MM-DD HH:mm:ss") } : undefined),
          comment: time.comment,
        });
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
        // If timer has no end date (ongoing timer)
        if (body.to === undefined) {
          // Stop all ongoing timers
          TimeEntity.update({ user: { id: handler.request.user.id }, to: null }, { to: moment(body.from).toDate() });

          // Create timer
          await TimeEntity.create({
            from: moment(body.from).toDate(),
            ...(body.to !== undefined ? { to: this.setToDate(moment(body.from), moment(body.to)).toDate() } : undefined),
            comment: body.comment,
            user: handler.request.user,
            projectId: body.projectId,
          }).save();

          handler.sendStatus(200);
        }
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
        await TimeEntity.update(parseInt(handler.params<{ id: string }>().id, 10), {
          from: moment(body.from).toDate(),
          ...(body.to !== undefined ? { to: this.setToDate(moment(body.from), moment(body.to)).toDate() } : undefined),
          comment: body.comment,
          projectId: body.projectId,
        });

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
        await TimeEntity.delete(parseInt(handler.params<{ id: string }>().id, 10));
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
        const params: { id: string } = handler.params<{ id: string }>();
        const body = handler.body<IStopTimeDTO>();
        await TimeEntity.update({ id: parseInt(params.id, 10), to: null }, { to: moment(body.to).toDate() });
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Unable to stop time", error);
        throw error;
      }
    });
  }

  private setToDate(from: Moment, to: Moment): Moment {
    const duration = moment.duration(to.diff(from));
    if (duration.asSeconds() < 0) {
      return moment(to).add(1, "days");
    } else {
      return to;
    }
  }
}

const timeController: TimeController = new TimeController();
export default timeController;
