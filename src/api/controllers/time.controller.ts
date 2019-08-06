// Libs
import { RequestHandler, response, Handler } from "express";
import { ServiceModule } from "simplyserveme";

import { controller, controllerError, Controller } from "./controller";
import { ICreateTimeJSON } from "../../shared/dto/create-time.dto";
import { TimeEntity } from "../entities/time.entity";
import { LogModule } from "../modules/log.module";
import { IUpdateTimeJSON } from "../../shared/dto/update-time.dto";
import { Between } from "typeorm";
import { ITimeJSON } from "../../shared/dto/time.dto";
import moment, { Moment } from "moment";
import { IStopTimeJSON } from "../../shared/dto/stop-time.dto";

const LOG = new LogModule("controller.time");

export class TimeController extends ServiceModule {
  public index(): RequestHandler {
    return controller((handler) => {
      const query = handler.query<{ date?: string, year?: string, month?: string, week?: string, all?: string }>();
      TimeEntity.find({
        where: {
          // Only get provided date
          ...(query.date !== undefined ? {
            from: Between(
              moment(query.date, "YYYY-MM-DD", true).format("YYYY-MM-DD 00:00:00"),
              moment(query.date, "YYYY-MM-DD", true).format("YYYY-MM-DD 23:59:59"))
          } : undefined),
          ...(query.year !== undefined && query.month !== undefined ? {
            from: Between(
              moment(`${query.year}-${query.month}`, "YYYY-MM", true).format("YYYY-MM-01 00:00:00"),
              moment(`${query.year}-${query.month}`, "YYYY-MM", true).endOf("month").format("YYYY-MM-DD 23:59:59"))
          } : undefined),
          ...(query.year !== undefined && query.week !== undefined ? {
            from: Between(
              moment(`${query.year}-${query.week}`, "YYYY w", true).startOf("week").format("YYYY-MM-DD 00:00:00"),
              moment(`${query.year}-${query.week}`, "YYYY w", true).endOf("week").format("YYYY-MM-DD 23:59:59"))
          } : undefined),
          ...(query.year !== undefined && query.month === undefined && query.week === undefined ? {
            from: Between(
              moment(query.year, "YYYY", true).format("YYYY-01-01 00:00:00"),
              moment(query.year, "YYYY", true).format("YYYY-12-31 23:59:59"))
          } : undefined),
          // If query "all" is not provided only fetch entities belonging to current user
          ...(query.all === undefined ? { user: handler.request.user } : undefined),
        },
        relations: ["project", "project.customer"],
        order: { from: "DESC" }
      }).then((times: TimeEntity[]) => {
        handler.response<ITimeJSON[]>().json(times.map((time: TimeEntity) => {
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
                  }
                } : undefined),
              }
            } : undefined),
            from: moment(time.from).format("YYYY-MM-DD HH:mm:ss"),
            ...(time.to !== null ? { to: moment(time.to).format("YYYY-MM-DD HH:mm:ss") } : undefined),
            comment: time.comment,
          };
        }));
      }).catch((error: any) => controllerError(LOG, handler.response(), "Error getting times", error));
    });
  }

  public show(): RequestHandler {
    return controller((handler) => {
      TimeEntity.findOne({
        where: { id: parseInt(handler.params<{ id: string }>().id, 10) },
        relations: ["project", "project.customer"],
      }).then((time: TimeEntity | undefined) => {
        if (time !== undefined) {
          handler.response<ITimeJSON>().json({
            id: time.id,
            ...(time.project !== undefined ? {
              project: {
                id: time.project.id,
                name: time.project.name,
                ...(time.project.customer !== undefined ? {
                  customer: {
                    id: time.project.customer.id,
                    name: time.project.customer.name,
                  }
                } : undefined),
              }
            } : undefined),
            from: moment(time.from).format("YYYY-MM-DD HH:mm:ss"),
            ...(time.to !== null ? { to: moment(time.to).format("YYYY-MM-DD HH:mm:ss") } : undefined),
            comment: time.comment,
          });
        } else {
          handler.response().sendStatus(404);
          LOG.warning({ title: `No time entity with id "${parseInt(handler.params<{ id: string }>().id, 10)}" could be found` });
        }
      })
    })
  }

  public create(): RequestHandler {
    return controller((handler) => {
      const body = handler.body<ICreateTimeJSON>();

      const create = () => {
        // Create new timer
        TimeEntity.create({
          from: moment(body.from).toDate(),
          ...(body.to !== undefined ? { to: this.setToDate(moment(body.from), moment(body.to)).toDate() } : undefined),
          comment: body.comment,
          user: handler.request.user,
          projectId: body.projectId
        }).save().then(() => handler.response().sendStatus(200))
          .catch((error: any) => controllerError(LOG, handler.response(), "Time could not be saved", error));
      };

      // No "to" date define will stop any other ongoing timer
      if (body.to === undefined) {
        // Find any user time entity without "to" date
        TimeEntity.find({ where: { userId: handler.request.user.id, to: null } }).then((times: TimeEntity[]) => {
          if (times.length > 0) {
            // Set "to" date to "now" (stopping all ongoing timers)
            TimeEntity.update(times.map((time: TimeEntity) => time.id), { to: new Date() }).then(() => {
              create();
            });
          } else { create(); }
        });
      } else {
        create();
      }
    });
  }

  public update(): RequestHandler {
    return controller((handler) => {
      const body = handler.body<IUpdateTimeJSON>();
      TimeEntity.update(parseInt(handler.params<{ id: string }>().id, 10), {
        from: moment(body.from).toDate(),
        ...(body.to !== undefined ? { to: this.setToDate(moment(body.from), moment(body.to)).toDate() } : undefined),
        comment: body.comment,
        projectId: body.projectId
      }).then(() => handler.response().sendStatus(200))
        .catch((error: any) => controllerError(LOG, handler.response(), "Error saving time", error));
    });
  }

  public delete(): RequestHandler {
    return controller((handler) => {
      TimeEntity.delete(parseInt(handler.params<{ id: string }>().id, 10))
        .then(() => handler.sendStatus(200))
        .catch((error: any) => controllerError(LOG, handler.response(), "Error deleting time", error));
    });
  }

  public stop(handler: Controller) {
    const params: { id: string } = handler.params<{ id: string }>();
    const body = handler.body<IStopTimeJSON>();
    TimeEntity.update({ id: parseInt(params.id, 10), to: null }, { to: body.to })
      .then(() => handler.sendStatus(200))
      .catch((error: any) => {
        LOG.error({ title: "Unable to stop timer", data: { error } });
        handler.sendStatus(500);
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

const timeController: TimeController = TimeController.getInstance<TimeController>();
export default timeController;