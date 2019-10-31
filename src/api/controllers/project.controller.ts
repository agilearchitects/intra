// Libs
import { RequestHandler } from "express";
import moment, { Moment } from "moment";

// DTO's
import { ICreateProjectDTO } from "../../shared/dto/create-project.dto";
import { IProjectDTO, ProjectDTO } from "../../shared/dto/project.dto";

// Entities
import { CustomerEntity } from "../entities/customer.entity";
import { ProjectEntity } from "../entities/project.entity";

// Modules
import { controller, ControllerHandler } from "../modules/controller-handler.module";

// Base controller
import { Dictionary } from "express-serve-static-core";
import { ICreateProjectUserDTO } from "../../shared/dto/create-project-user.dto";
import { ICreateTaskUserDTO } from "../../shared/dto/create-task-user.dto";
import { ICreateTaskDTO } from "../../shared/dto/create-task.dto";
import { CustomerDTO } from "../../shared/dto/customer.dto";
import { ProjectUserDTO } from "../../shared/dto/project-user.dto";
import { TaskUserDTO } from "../../shared/dto/task-user.dto";
import { TaskDTO } from "../../shared/dto/task.dto";
import { TimeDTO } from "../../shared/dto/time.dto";
import { IUpdateProjectDTO } from "../../shared/dto/update-project.dto";
import { UserDTO } from "../../shared/dto/user.dto";
import { ProjectUserEntity } from "../entities/project-user.entity";
import { TaskUserEntity } from "../entities/task-user.entity";
import { TaskEntity } from "../entities/task.entity";
import { TimeEntity } from "../entities/time.entity";
import { UserEntity } from "../entities/user.entity";
import { Controller } from "./controller";

export class ProjectController extends Controller {
  public index(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        handler.response<IProjectDTO[]>().json((await ProjectEntity.find({
          relations: [
            "customer",
            "projectUsers",
            "projectUsers.user",
            "tasks",
            "tasks.times",
            "tasks.times.user",
            "tasks.taskUsers",
            "tasks.taskUsers.user",
          ],
        })).map((project: ProjectEntity) => this.parseProjectEntity(project)));
      } catch (error) {
        this.logError(handler.response(), "Error getting projects", error);
        handler.response().sendStatus(500);
        throw error;
      }
    });
  }
  public show(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const params: { id: string } = handler.params();
        handler.response<IProjectDTO>().json(this.parseProjectEntity(await ProjectEntity.findOneOrFail(parseInt(params.id, 10), {
          relations: [
            "customer",
            "projectUsers",
            "projectUsers.user",
            "tasks",
            "tasks.times",
            "tasks.times.user",
            "tasks.taskUsers",
            "tasks.taskUsers.user",
          ],
        })));
      } catch (error) {
        this.logError(handler.response(), "Error getting project", error);
        handler.response().sendStatus(500);
        throw error;
      }
    });
  }
  public create(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const body = handler.body<ICreateProjectDTO>();
        const customer: CustomerEntity = await CustomerEntity.findOneOrFail(body.customerId);
        await ProjectEntity.create({
          name: body.name,
          customer,
          ...(body.rate !== undefined ? { rate: body.rate } : undefined),
          ...(body.priceBudget !== undefined ? { priceBudget: body.priceBudget } : undefined),
          ...(body.hoursBudget !== undefined ? { hoursBudget: body.hoursBudget } : undefined),
          ...(body.start !== undefined ? { start: body.start } : undefined),
          ...(body.end !== undefined ? { end: body.end } : undefined),
          ...(body.users !== undefined ? {
            projectUsers: body.users.map((projectUser: ICreateProjectUserDTO) => ProjectUserEntity.create({
              rate: projectUser.rate,
              user: UserEntity.create({ id: projectUser.userId }),
            })),
          } : undefined),
          ...(body.tasks !== undefined ? {
            tasks: body.tasks.map((task: ICreateTaskDTO) => TaskEntity.create({
              name: task.name,
              ...(task.rate !== undefined ? { rate: task.rate } : undefined),
              ...(task.priceBudget !== undefined ? { priceBudget: task.priceBudget } : undefined),
              ...(task.hoursBudget !== undefined ? { hoursBudget: task.hoursBudget } : undefined),
              ...(task.users !== undefined ? {
                taskUsers: task.users.map((taskUser: ICreateTaskUserDTO) => TaskUserEntity.create({
                  user: UserEntity.create({ id: taskUser.userId }),
                  rate: taskUser.rate,
                })),
              } : undefined),
            })),
          } : undefined),
        }).save();
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Error creating project", error);
        handler.response().sendStatus(500);
        throw error;
      }
    });
  }

  public update(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const body = handler.body<IUpdateProjectDTO>();
        const customer: CustomerEntity = await CustomerEntity.findOneOrFail(body.customerId);
        await ProjectEntity.create({
          id: body.id,
          name: body.name,
          customer,
          ...(body.rate !== undefined ? { rate: body.rate } : undefined),
          ...(body.priceBudget !== undefined ? { priceBudget: body.priceBudget } : undefined),
          ...(body.hoursBudget !== undefined ? { hoursBudget: body.hoursBudget } : undefined),
          ...(body.start !== undefined ? { start: body.start } : undefined),
          ...(body.end !== undefined ? { end: body.end } : undefined),
          ...(body.users !== undefined ? {
            projectUsers: body.users.map((projectUser: ICreateProjectUserDTO) => ProjectUserEntity.create({
              rate: projectUser.rate,
              user: UserEntity.create({ id: projectUser.userId }),
            })),
          } : undefined),
          ...(body.tasks !== undefined ? {
            tasks: body.tasks.map((task: ICreateTaskDTO) => TaskEntity.create({
              name: task.name,
              ...(task.rate !== undefined ? { rate: task.rate } : undefined),
              ...(task.priceBudget !== undefined ? { priceBudget: task.priceBudget } : undefined),
              ...(task.hoursBudget !== undefined ? { hoursBudget: task.hoursBudget } : undefined),
              ...(task.users !== undefined ? {
                taskUsers: task.users.map((taskUser: ICreateTaskUserDTO) => TaskUserEntity.create({
                  user: UserEntity.create({ id: taskUser.userId }),
                  rate: taskUser.rate,
                })),
              } : undefined),
            })),
          } : undefined),
        }).save();
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Error creating project", error);
        handler.response().sendStatus(500);
        throw error;
      }
    });
  }

  private parseProjectEntity(project: ProjectEntity): IProjectDTO {
    return ProjectDTO.parse({
      id: project.id,
      name: project.name,
      ...(project.rate !== null ? { rate: project.rate } : undefined),
      ...(project.priceBudget !== null ? { priceBudget: project.priceBudget } : undefined),
      ...(project.hoursBudget !== null ? { hoursBudget: project.hoursBudget } : undefined),
      ...(project.start !== null ? { start: moment(project.start).format("YYYY-MM-DD") } : undefined),
      ...(project.end !== null ? { end: moment(project.end).format("YYYY-MM-DD") } : undefined),
      customer: CustomerDTO.parse({
        id: project.customer.id,
        name: project.customer.name,
      }).serialize(),
      tasks: project.tasks.map((task: TaskEntity) => TaskDTO.parse({
        id: task.id,
        name: task.name,
        ...(task.rate !== null ? { rate: task.rate } : undefined),
        ...(task.priceBudget !== null ? { priceBudget: task.priceBudget } : undefined),
        ...(task.hoursBudget !== null ? { hoursBudget: task.hoursBudget } : undefined),
        times: task.times.map((time: TimeEntity) => TimeDTO.parse({
          id: time.id,
          from: moment(time.from).format("YYYY-MM-DD HH:mm:ss"),
          ...(time.to !== null ? { to: moment(time.to).format("YYYY-MM-DD HH:mm:ss") } : undefined),
          comment: time.comment,
          user: UserDTO.parse({ id: time.user.id, email: time.user.email }).serialize(),
        }).serialize()),
        users: task.taskUsers.map((taskUser: TaskUserEntity) => TaskUserDTO.parse({
          id: taskUser.id,
          user: UserDTO.parse({
            id: taskUser.user.id,
            email: taskUser.user.email,
          }).serialize(),
          ...(taskUser.rate !== null ? { rate: taskUser.rate } : undefined),
        }).serialize()),
      }).serialize()),
      users: project.projectUsers.map((projectUser: ProjectUserEntity) => ProjectUserDTO.parse({
        id: projectUser.user.id,
        email: projectUser.user.email,
        rate: projectUser.rate,
      }).serialize()),
    }).serialize();
  }
}

const projectController: ProjectController = new ProjectController();
export default projectController;
