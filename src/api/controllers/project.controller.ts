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
import { CustomerDTO } from "../../shared/dto/customer.dto";
import { TaskDTO } from "../../shared/dto/task.dto";
import { TimeDTO } from "../../shared/dto/time.dto";
import { UserDTO } from "../../shared/dto/user.dto";
import { TaskEntity } from "../entities/task.entity";
import { TimeEntity } from "../entities/time.entity";
import { UserProjectEntity } from "../entities/user-project.entity";
import { UserEntity } from "../entities/user.entity";
import { Controller } from "./controller";

export class ProjectController extends Controller {
  public index(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        handler.response<IProjectDTO[]>().json((await ProjectEntity.find({ relations: ["customer", "tasks", "userProjects", "userProjects.user", "tasks.times", "tasks.times.user"] })).map((project: ProjectEntity) => ProjectDTO.parse({
          id: project.id,
          name: project.name,
          customer: CustomerDTO.parse({
            id: project.customer.id,
            name: project.customer.name,
          }).serialize(),
          tasks: project.tasks.map((task: TaskEntity) => TaskDTO.parse({
            id: task.id,
            name: task.name,
            times: task.times.map((time: TimeEntity) => TimeDTO.parse({
              id: time.id,
              from: moment(time.from).format("YYYY-MM-DD HH:mm:ss"),
              ...(time.to !== null ? { to: moment(time.to).format("YYYY-MM-DD HH:mm:ss") } : undefined),
              comment: time.comment,
              user: UserDTO.parse({ id: time.user.id, email: time.user.email }).serialize(),
            }).serialize()),
          }).serialize()),
          users: project.userProjects.map((userProject: UserProjectEntity) => UserDTO.parse({
            id: userProject.user.id,
            email: userProject.user.email,
          }).serialize()),
        }).serialize()));
        handler.response<{ foo: string }>().json({ foo: "bar" });
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
          userProjects: users.map((user: UserEntity) => UserProjectEntity.create({ user })),
          tasks: body.tasks.map((task: string) => TaskEntity.create({ name: task })),
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
