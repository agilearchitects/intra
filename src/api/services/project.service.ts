// Libs
import moment, { Moment } from "moment";

// DTO's
import { ICreateProjectUserDTO } from "../../shared/dto/create-project-user.dto";
import { ICreateProjectDTO } from "../../shared/dto/create-project.dto";
import { ICreateTaskUserDTO } from "../../shared/dto/create-task-user.dto";
import { ICreateTaskDTO } from "../../shared/dto/create-task.dto";
import { CustomerDTO } from "../../shared/dto/customer.dto";
import { ProjectUserDTO } from "../../shared/dto/project-user.dto";
import { IProjectDTO, ProjectDTO } from "../../shared/dto/project.dto";
import { ITaskUserDTO, TaskUserDTO } from "../../shared/dto/task-user.dto";
import { ITaskDTO, TaskDTO } from "../../shared/dto/task.dto";
import { TimeDTO } from "../../shared/dto/time.dto";
import { IUpdateProjectDTO } from "../../shared/dto/update-project.dto";
import { UserDTO } from "../../shared/dto/user.dto";

// Entities
import { IUpdateTaskDTO } from "../../shared/dto/update-task.dto";
import { CustomerEntity } from "../entities/customer.entity";
import { ProjectUserEntity } from "../entities/project-user.entity";
import { ProjectEntity } from "../entities/project.entity";
import { TaskUserEntity } from "../entities/task-user.entity";
import { TaskEntity } from "../entities/task.entity";
import { TimeEntity } from "../entities/time.entity";
import { UserEntity } from "../entities/user.entity";

export class ProjectService {
  public constructor(
    private readonly dateFormat = "YYYY-MM-DD",
    private readonly customerEntity: typeof CustomerEntity,
    private readonly projectEntity: typeof ProjectEntity,
    private readonly projectUserEntity: typeof ProjectUserEntity,
    private readonly taskEntity: typeof TaskEntity,
    private readonly taskUserEntity: typeof TaskUserEntity,
    private readonly userEntity: typeof UserEntity,
    private readonly customerDTO: typeof CustomerDTO,
    private readonly projectDTO: typeof ProjectDTO,
    private readonly projectUserDTO: typeof ProjectUserDTO,
    private readonly taskDTO: typeof TaskDTO,
    private readonly taskUserDTO: typeof TaskUserDTO,
    private readonly timeDTO: typeof TimeDTO,
    private readonly userDTO: typeof UserDTO,
    private readonly momentModule: typeof moment,
  ) { }

  public async getForUser(userId: number): Promise<IProjectDTO[]> {
    return (await ProjectEntity.find({
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
      where: `"ProjectEntity__projectUsers__user"."id" = ${userId}`,
    })).map((project: ProjectEntity) => this.parseProjectEntityToDTO(project));
  }

  public async get(projectId: number, userId?: number): Promise<IProjectDTO> {
    return this.parseProjectEntityToDTO((await ProjectEntity.findOneOrFail(projectId, {
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
      where: `"ProjectEntity__projectUsers__user"."id" = ${userId}`,
    })));
  }

  public async create(project: ICreateProjectDTO): Promise<IProjectDTO> {
    const customer = await this.customerEntity.findOneOrFail(project.customerId);
    const newProject = await this.projectEntity.create({
      name: project.name,
      customer,
      rate: project.rate !== undefined ? project.rate : null,
      priceBudget: project.priceBudget !== undefined ? project.priceBudget : null,
      hoursBudget: project.hoursBudget !== undefined ? project.hoursBudget : null,
      start: project.start !== undefined ? this.momentModule(project.start, this.dateFormat, true).toDate() : null,
      end: project.end !== undefined ? this.momentModule(project.end, this.dateFormat, true).toDate() : null,
      projectUsers: project.users !== undefined ? await Promise.all(project.users.map(async (projectUser: ICreateProjectUserDTO) => {
        const user = await this.userEntity.findOneOrFail(projectUser.userId);
        return this.projectUserEntity.create({
          rate: projectUser.rate !== undefined ? projectUser.rate : null,
          user,
        });
      })) : [],
      tasks: project.tasks !== undefined ? await Promise.all(project.tasks.map(async (task: ICreateTaskDTO) =>
        this.taskEntity.create({
          name: task.name,
          rate: task.rate !== undefined ? task.rate : null,
          priceBudget: task.priceBudget !== undefined ? task.priceBudget : null,
          hoursBudget: task.hoursBudget !== undefined ? task.hoursBudget : null,
          taskUsers: task.users !== undefined ? await Promise.all(task.users.map(async (taskUser: ICreateTaskUserDTO) => {
            const user = await this.userEntity.findOneOrFail(taskUser.userId);
            return this.taskUserEntity.create({
              rate: taskUser.rate !== undefined ? taskUser.rate : null,
              user,
            });
          })) : [],
        }),
      )) : [],
    }).save();

    return this.parseProjectEntityToDTO(newProject);
  }
  public async update(project: IUpdateProjectDTO): Promise<IProjectDTO> {
    // Get project
    const foundProject = await this.projectEntity.findOneOrFail(project.id);

    // Get customer
    const customer = await this.customerEntity.findOneOrFail(project.customerId);

    // Update project
    foundProject.name = project.name;
    foundProject.customer = customer;
    foundProject.rate = project.rate !== undefined ? project.rate : null;
    foundProject.priceBudget = project.priceBudget !== undefined ? project.priceBudget : null;
    foundProject.hoursBudget = project.hoursBudget !== undefined ? project.hoursBudget : null;
    foundProject.start = project.start !== undefined ? this.momentModule(project.start, this.dateFormat, true).toDate() : null;
    foundProject.end = project.end !== undefined ? this.momentModule(project.end, this.dateFormat, true).toDate() : null;

    // Update users
    foundProject.projectUsers = project.users !== undefined ? await Promise.all(project.users.map(async (projectUser: ICreateProjectUserDTO) => {
      // Lookup user
      const user = await this.userEntity.findOneOrFail(projectUser.userId);
      return this.projectUserEntity.create({
        rate: projectUser.rate !== undefined ? projectUser.rate : null,
        user,
      });
    })) : [];

    foundProject.tasks = project.tasks !== undefined ? await Promise.all(project.tasks.map(async (task: ICreateTaskDTO | IUpdateTaskDTO) => {
      if ("id" in task) {
        // Update task if found
        const foundTask = await this.taskEntity.findOneOrFail(task.id);
        foundTask.name = task.name;
        foundTask.rate = task.rate !== undefined ? task.rate : null;
        foundTask.priceBudget = task.priceBudget !== undefined ? task.priceBudget : null;
        foundTask.hoursBudget = task.hoursBudget !== undefined ? task.hoursBudget : null;
        foundTask.taskUsers = task.users !== undefined ? await Promise.all(task.users.map(async (taskUser: ICreateTaskUserDTO) => {
          const user = await this.userEntity.findOneOrFail(taskUser.userId);
          return this.taskUserEntity.create({
            rate: taskUser.rate !== undefined ? taskUser.rate : null,
            user,
          });
        })) : [];
        return await foundTask.save();
      } else {
        // Create new task
        return await this.taskEntity.create({
          name: task.name,
          rate: task.rate !== undefined ? task.rate : null,
          priceBudget: task.priceBudget !== undefined ? task.priceBudget : null,
          hoursBudget: task.hoursBudget !== undefined ? task.hoursBudget : null,
          taskUsers: task.users !== undefined ? await Promise.all(task.users.map(async (taskUser: ICreateTaskUserDTO) => {
            const user = await this.userEntity.findOneOrFail(taskUser.userId);
            return this.taskUserEntity.create({
              rate: taskUser.rate !== undefined ? taskUser.rate : null,
              user,
            });
          })) : [],
        }).save();
      }
    })) : [];
    await foundProject.save();

    return this.parseProjectEntityToDTO(foundProject);
  }
  public async delete(projectId: number, userId: number): Promise<void> {
    const project = await ProjectEntity.findOneOrFail(projectId, {
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
      where: `"ProjectEntity__projectUsers__user"."id" = ${userId}`,
    });
    await project.remove();
  }

  private parseProjectEntityToDTO(project: ProjectEntity): IProjectDTO {
    return this.projectDTO.parse({
      id: project.id,
      name: project.name,
      ...(project.rate !== null ? { rate: project.rate } : undefined),
      ...(project.priceBudget !== null ? { priceBudget: project.priceBudget } : undefined),
      ...(project.hoursBudget !== null ? { hoursBudget: project.hoursBudget } : undefined),
      ...(project.start !== null ? { start: this.momentModule(project.start).format("YYYY-MM-DD") } : undefined),
      ...(project.end !== null ? { end: this.momentModule(project.end).format("YYYY-MM-DD") } : undefined),
      customer: this.customerDTO.parse({
        id: project.customer.id,
        name: project.customer.name,
      }).serialize(),
      ...(project.tasks !== undefined ? {
        tasks: project.tasks.map((task: TaskEntity) => this.taskDTO.parse({
          id: task.id,
          name: task.name,
          ...(task.rate !== null ? { rate: task.rate } : undefined),
          ...(task.priceBudget !== null ? { priceBudget: task.priceBudget } : undefined),
          ...(task.hoursBudget !== null ? { hoursBudget: task.hoursBudget } : undefined),
          ...(task.times !== undefined ? {
            times: task.times.map((time: TimeEntity) => this.timeDTO.parse({
              id: time.id,
              from: this.momentModule(time.from).format("YYYY-MM-DD HH:mm:ss"),
              ...(time.to !== null ? { to: this.momentModule(time.to).format("YYYY-MM-DD HH:mm:ss") } : undefined),
              comment: time.comment,
              user: this.userDTO.parse({ id: time.user.id, email: time.user.email }).serialize(),
            }).serialize()),
          } : undefined),
          ...(task.taskUsers !== undefined ? {
            users: task.taskUsers.map((taskUser: TaskUserEntity) => this.taskUserDTO.parse({
              id: taskUser.id,
              user: this.userDTO.parse({
                id: taskUser.user.id,
                email: taskUser.user.email,
              }).serialize(),
              ...(taskUser.rate !== null ? { rate: taskUser.rate } : undefined),
            }).serialize()),
          } : undefined),
        }).serialize()),
      } : undefined),
      users: project.projectUsers.map((projectUser: ProjectUserEntity) => this.projectUserDTO.parse({
        id: projectUser.user.id,
        email: projectUser.user.email,
        ...(projectUser.rate !== null ? { rate: projectUser.rate } : undefined),
      }).serialize()),
    }).serialize();
  }

}
