// Libs
import { RequestHandler, response } from "express";
import { ServiceModule } from "simplyserveme";

import { controller, controllerError } from "./controller";
import { ICreateTimeJSON } from "../../shared/dto/create-time.dto";
import { TimeEntity } from "../entities/time.entity";
import moment = require("moment");
import { LogModule } from "../modules/log.module";
import { IUpdateTimeJSON } from "../../shared/dto/update-time.dto";
import { Between } from "typeorm";
import { ITimeJSON } from "../../shared/dto/time.dto";
import { ProjectDTO } from "../../shared/dto/project.dto";

const LOG = new LogModule("controller.time");

export class TimeController extends ServiceModule {
  public index(): RequestHandler {
    return controller((handler) => {
      TimeEntity.find({
        where: {
          // Only get provided date
          ...(handler.request.query.date === undefined ? {
            date: Between(
              moment(handler.request.query.date, "YYYY-MM-DD", true).toDate(),
              moment(handler.request.query.date, "YYYY-MM-DD", true).add("days", 1).toDate())
          } : undefined),
          // If query "all" is not provided only fetch entities belonging to current user
          ...(handler.request.query.all === undefined ? { user: handler.request.user } : undefined),
        },
        relations: ["project.customer"],
        order: { from: "ASC" }
      }).then((times: TimeEntity[]) => {
        handler.response<ITimeJSON[]>().json(times.map((time: TimeEntity) => ({
          id: time.id,
          project: {
            id: time.project.id,
            name: time.project.name,
            customer: {
              id: time.project.customer.id,
              name: time.project.customer.name,
            },
          },
          from: moment(time.from).format("YYYY-MM-DD HH:mm:ss"),
          ...(time.to !== null ? { to: moment(time.to).format("YYYY-MM-DD HH:mm:ss") } : undefined),
          comment: time.comment,
        })));
      });
    });
  }

  public show(): RequestHandler {
    return controller((handler) => {
      TimeEntity.findOne({
        where: { id: parseInt(handler.params<{ id: string }>().id, 10) },
        relations: ["project.customer"],
      }).then((time: TimeEntity | undefined) => {
        if (time !== undefined) {
          handler.response<ITimeJSON>().json({
            id: time.id,
            project: {
              id: time.project.id,
              name: time.project.name,
              customer: {
                id: time.project.customer.id,
                name: time.project.customer.name,
              },
            },
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

      TimeEntity.create({
        from: moment(body.from).toDate(),
        ...(body.to !== undefined ? { to: moment(body.to) } : undefined),
        comment: body.comment,
        user: handler.request.user,
        projectId: body.projectId
      }).save().then(() => handler.response().sendStatus(200))
        .catch((error: any) => controllerError(LOG, handler.response(), "Time could not be saved", error));
    });
  }
  public update(): RequestHandler {
    return controller((handler) => {
      const body = handler.body<IUpdateTimeJSON>();
      TimeEntity.update(parseInt(handler.params<{ id: string }>().id, 10), {
        from: moment(body.from).toDate(),
        ...(body.to !== undefined ? { to: moment(body.to) } : undefined),
        comment: body.comment,
        projectId: body.projectId
      }).then(() => handler.response().sendStatus(200))
        .catch((error: any) => controllerError(LOG, handler.response(), "Error saving time", error));
    });
  }

  public delete(): RequestHandler {
    return controller((handler) => {
      TimeEntity.delete(parseInt(handler.params<{ id: string }>().id, 10))
        .then(() => handler.response().sendStatus(200))
        .catch((error: any) => controllerError(LOG, handler.response(), "Error deleting time", error));
    });
  }
}

const timeController: TimeController = TimeController.getInstance<TimeController>();
export default timeController;