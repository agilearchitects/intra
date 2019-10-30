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
import { ICreateProjectUserDTO } from "../../shared/dto/create-project-user.dto";
import { ICreateTaskUserDTO } from "../../shared/dto/create-task-user.dto";
import { ICreateTaskDTO } from "../../shared/dto/create-task.dto";
import { CustomerDTO } from "../../shared/dto/customer.dto";
import { ProjectUserDTO } from "../../shared/dto/project-user.dto";
import { TaskUserDTO } from "../../shared/dto/task-user.dto";
import { TaskDTO } from "../../shared/dto/task.dto";
import { TimeDTO } from "../../shared/dto/time.dto";
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
        })).map((project: ProjectEntity) => ProjectDTO.parse({
          id: project.id,
          name: project.name,
          rate: project.rate,
          priceBudget: project.priceBudget,
          hoursBudget: project.hoursBudget,
          customer: CustomerDTO.parse({
            id: project.customer.id,
            name: project.customer.name,
          }).serialize(),
          tasks: project.tasks.map((task: TaskEntity) => TaskDTO.parse({
            id: task.id,
            name: task.name,
            rate: task.rate,
            priceBudget: task.priceBudget,
            hoursBudget: task.hoursBudget,
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
              rate: taskUser.rate,
            }).serialize()),
          }).serialize()),
          users: project.projectUsers.map((projectUser: ProjectUserEntity) => ProjectUserDTO.parse({
            id: projectUser.user.id,
            email: projectUser.user.email,
            rate: projectUser.rate,
          }).serialize()),
        }).serialize()));
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
        const users: UserEntity[] = await UserEntity.findByIds(body.users);
        await ProjectEntity.create({
          name: body.name,
          customer,
          projectUsers: body.users.map((projectUser: ICreateProjectUserDTO) => ProjectUserEntity.create({
            rate: projectUser.rate,
            user: UserEntity.create({ id: projectUser.userId }),
          })),
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
        }).save();
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Error creating project", error);
        handler.response().sendStatus(500);
        throw error;
      }
    });
  }
}

const projectController: ProjectController = new ProjectController();
export default projectController;
