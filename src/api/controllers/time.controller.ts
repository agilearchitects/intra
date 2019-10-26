// Libs
import { RequestHandler } from "express";
import moment, { Moment } from "moment";
import { Between } from "typeorm";

// DTO's
import { ICreateTimeDTO } from "../../shared/dto/create-time.dto";
import { IStopTimeDTO } from "../../shared/dto/stop-time.dto";
import { ITimeDTO, TimeDTO } from "../../shared/dto/time.dto";
import { IUpdateTimeDTO } from "../../shared/dto/update-time.dto";

// Entites
import { TimeEntity } from "../entities/time.entity";

// Modules
import { controller, ControllerHandler } from "../modules/controller-handler.module";

// Base controller
import { CustomerDTO, ICustomerDTO } from "../../shared/dto/customer.dto";
import { ProjectDTO } from "../../shared/dto/project.dto";
import { ITagDTO, TagDTO } from "../../shared/dto/tag.dto";
import { TaskDTO } from "../../shared/dto/task.dto";
import { ITimeQueryDTO } from "../../shared/dto/time-query.dto";
import { CustomerEntity } from "../entities/customer.entity";
import { ProjectEntity } from "../entities/project.entity";
import { TagEntity } from "../entities/tag.entity";
import { TaskEntity } from "../entities/task.entity";
import { Controller } from "./controller";

export class TimeController extends Controller {
  public index(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const query = handler.query<ITimeQueryDTO>();
        if (query.groupBy === "customer") {
          let queryBuild = CustomerEntity.createQueryBuilder("customer")
            .innerJoinAndSelect("customer.projects", "project", "project.customerId = customer.id")
            .innerJoinAndSelect("project.tasks", "task", "task.projectId = project.id")
            .innerJoinAndSelect("task.times", "time", "time.taskId = task.id")
            .leftJoinAndSelect("time.tags", "tags");
          if (query.year !== undefined && query.month !== undefined) {
            queryBuild = queryBuild.where("time.from BETWEEN :from AND :to", {
              from: moment(`${query.year}-${query.month}`, "YYYY-M", true).format("YYYY-MM-01 00:00:00"),
              to: moment(`${query.year}-${query.month}`, "YYYY-M", true).endOf("month").format("YYYY-MM-DD 23:59:59"),
            });
          } else if (query.year !== undefined && query.week !== undefined) {
            queryBuild = queryBuild.where("time.from BETWEEN :from AND :to", {
              from: moment(`${query.year} ${query.week}`, "YYYY W", true).startOf("isoWeek").format("YYYY-MM-DD 00:00:00"),
              to: moment(`${query.year} ${query.week}`, "YYYY W", true).endOf("isoWeek").format("YYYY-MM-DD 23:59:59"),
            });
          } else if (query.year !== undefined && query.month === undefined && query.week === undefined) {
            queryBuild = queryBuild.where("time.from BETWEEN :from AND :to", {
              from: moment(query.year, "YYYY", true).format("YYYY-01-01 00:00:00"),
              to: moment(query.year, "YYYY", true).format("YYYY-12-31 23:59:59"),
            });
          } else if (query.all) {
            queryBuild = queryBuild.where("time.userId = :id", { id: handler.request.user.id });
          }
          const customers: CustomerEntity[] = await queryBuild.getMany();

          handler.response<ICustomerDTO[]>().json(customers.map((customer: CustomerEntity) => (CustomerDTO.parse({
            id: customer.id,
            name: customer.name,
            projects: customer.projects.map((project: ProjectEntity) => ProjectDTO.parse({
              id: project.id,
              name: project.name,
              tasks: project.tasks.map((task: TaskEntity) => TaskDTO.parse({
                id: task.id,
                name: task.name,
                times: task.times.map((time: TimeEntity) => TimeDTO.parse({
                  id: time.id,
                  from: moment(time.from).format("YYYY-MM-DD HH:mm:ss"),
                  ...(time.to !== null ? { to: moment(time.to).format("YYYY-MM-DD HH:mm:ss") } : undefined),
                  tags: time.tags.map((tag: TagEntity) => TagDTO.parse({ id: tag.id, name: tag.name }).serialize()),
                  comment: time.comment,
                }).serialize()),

              }).serialize()),
            }).serialize()),
          }).serialize())));
        } else {
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
            relations: ["task", "task.project", "task.project.customer", "tags"],
            order: { from: "DESC", to: "ASC" },
          });
          return handler.response<ITimeDTO[]>().json(times.map((time: TimeEntity) => TimeDTO.parse({
            id: time.id,
            task: TaskDTO.parse({
              id: time.task.id,
              name: time.task.name,
              project: ProjectDTO.parse({
                id: time.task.project.id,
                name: time.task.project.name,
                customer: CustomerDTO.parse({
                  id: time.task.project.customer.id,
                  name: time.task.project.customer.name,
                }).serialize(),
              }).serialize(),
            }).serialize(),
            from: moment(time.from).format("YYYY-MM-DD HH:mm:ss"),
            ...(time.to !== null ? { to: moment(time.to).format("YYYY-MM-DD HH:mm:ss") } : undefined),
            tags: time.tags.map((tag: TagEntity) => TagDTO.parse({ id: tag.id, name: tag.name }).serialize()),
            comment: time.comment,
          }).serialize()));
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
        const time: TimeEntity = await TimeEntity.findOneOrFail({
          where: { id: parseInt(handler.params<{ id: string }>().id, 10) },
          relations: ["task", "task.project", "task.project.customer", "tags"],
        });
        handler.response<ITimeDTO>().json(TimeDTO.parse({
          id: time.id,
          task: TaskDTO.parse({
            id: time.task.id,
            name: time.task.name,
            project: ProjectDTO.parse({
              id: time.task.project.id,
              name: time.task.project.name,
              customer: CustomerDTO.parse({
                id: time.task.project.customer.id,
                name: time.task.project.customer.name,
              }).serialize(),
            }).serialize(),
          }).serialize(),
          from: moment(time.from).format("YYYY-MM-DD HH:mm:ss"),
          ...(time.to !== null ? { to: moment(time.to).format("YYYY-MM-DD HH:mm:ss") } : undefined),
          ...(time.tags !== null ? { tags: time.tags.map((tag: TagEntity) => TagDTO.parse({ id: tag.id, name: tag.name }).serialize()) } : undefined),
          comment: time.comment,
        }).serialize());
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
          const currentTimers = await TimeEntity.find({
            where: {
              user: { id: handler.request.user.id },
              to: null,
              from: Between(
                moment(body.from).format("YYYY-MM-DD 00:00:00"),
                moment(body.from).format("YYYY-MM-DD 23:59:59"),
              ),
            },
          });

          if (currentTimers.length > 0) {
            // Stop all ongoing timers
            TimeEntity.update(currentTimers.map((time: TimeEntity) => time.id), { to: moment(body.from).toDate() });
          }

          // Create timer
          await TimeEntity.create({
            from: moment(body.from).toDate(),
            ...(body.to !== undefined ? { to: this.setToDate(moment(body.from), moment(body.to)).toDate() } : undefined),
            comment: body.comment,
            user: handler.request.user,
            task: await TaskEntity.findOneOrFail(body.taskId),
            ...(body.tags !== undefined ? {
              tags: await Promise.all(body.tags.map((tag: string | number) => {
                if (typeof tag === "string") {
                  // Create tag if id is not present
                  return TagEntity.create({ name: tag });
                }
                // Return tag with id if present
                return TagEntity.findOneOrFail(tag);
              })),
            } : undefined),
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
        const time = await TimeEntity.findOneOrFail(parseInt(handler.params<{ id: string }>().id, 10));

        if (body.to !== undefined) {
          time.to = this.setToDate(moment(body.from), moment(body.to)).toDate();
        }
        time.comment = body.comment;
        time.task = await TaskEntity.findOneOrFail(body.taskId);
        if (body.tags !== undefined) {
          time.tags = await Promise.all(body.tags.map((tag: string | number) => {
            if (typeof tag === "string") {
              // Create tag if id is not present
              return TagEntity.create({ name: tag });
            }
            // Return tag with id if present
            return TagEntity.findOneOrFail(tag);
          }));
        }
        await time.save();

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
