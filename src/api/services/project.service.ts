// Libs
import moment, { Moment } from "moment";

// DTO's
import { ICreateProjectDTO } from "../../shared/dto/create-project.dto";
import { ICreateTaskUserDTO } from "../../shared/dto/create-task-user.dto";
import { ICreateTaskDTO } from "../../shared/dto/create-task.dto";
import { CustomerDTO } from "../../shared/dto/customer.dto";
import { IProjectDTO, ProjectDTO } from "../../shared/dto/project.dto";
import { TaskUserDTO } from "../../shared/dto/task-user.dto";
import { TaskDTO } from "../../shared/dto/task.dto";
import { TimeDTO } from "../../shared/dto/time.dto";
import { IUpdateProjectDTO } from "../../shared/dto/update-project.dto";
import { UserDTO } from "../../shared/dto/user.dto";

// Entities
import { IUpdateTaskDTO } from "../../shared/dto/update-task.dto";
import { CustomerEntity } from "../../shared/entities/customer.entity";
import { ProjectEntity } from "../../shared/entities/project.entity";
import { TaskUserEntity } from "../../shared/entities/task-user.entity";
import { TaskEntity } from "../../shared/entities/task.entity";
import { TimeEntity } from "../../shared/entities/time.entity";
import { UserEntity } from "../../shared/entities/user.entity";

export class ProjectService {
  public constructor(
    private readonly dateFormat = "YYYY-MM-DD",
    private readonly customerEntity: typeof CustomerEntity,
    private readonly projectEntity: typeof ProjectEntity,
    private readonly taskEntity: typeof TaskEntity,
    private readonly taskUserEntity: typeof TaskUserEntity,
    private readonly timeEntity: typeof TimeEntity,
    private readonly userEntity: typeof UserEntity,
    private readonly customerDTO: typeof CustomerDTO,
    private readonly projectDTO: typeof ProjectDTO,
    private readonly taskDTO: typeof TaskDTO,
    private readonly taskUserDTO: typeof TaskUserDTO,
    private readonly timeDTO: typeof TimeDTO,
    private readonly userDTO: typeof UserDTO,
    private readonly momentModule: typeof moment,
  ) { }

  public async getForUser(userId: number, isAdmin: boolean): Promise<IProjectDTO[]> {
    let projects: ProjectEntity[] = (await ProjectEntity.find({
      relations: [
        "customer",
        "tasks",
        "tasks.times",
        "tasks.times.user",
        "tasks.taskUsers",
        "tasks.taskUsers.user",
      ],
      // Filter out project user is part of
    })).filter((project: ProjectEntity) =>
      project.tasks.findIndex((task: TaskEntity) =>
        task.taskUsers.findIndex((taskUser: TaskUserEntity) => taskUser.user.id === userId) !== -1,
      ) !== -1,
    );
    if (!isAdmin) {
      projects = projects.map((project: ProjectEntity) => {
        // Filter out only tasks user is part of
        project.tasks = project.tasks.filter((task: TaskEntity) => task.taskUsers.findIndex((taskUser: TaskUserEntity) => taskUser.user.id === userId) !== -1);
        return project;
      });
    }
    return projects.map((project: ProjectEntity) => this.parseProjectEntityToDTO(project));
  }

  public async getAll(): Promise<IProjectDTO[]> {
    return (await ProjectEntity.find({
      relations: [
        "customer",
        "tasks",
        "tasks.times",
        "tasks.times.user",
        "tasks.taskUsers",
        "tasks.taskUsers.user",
      ],
    })).map((project: ProjectEntity) => this.parseProjectEntityToDTO(project));
  }

  public async get(projectId: number, userId: number, isAdmin: boolean): Promise<IProjectDTO> {
    return this.parseProjectEntityToDTO((await ProjectEntity.findOneOrFail(projectId, {
      relations: [
        "customer",
        "tasks",
        "tasks.times",
        "tasks.times.user",
        "tasks.taskUsers",
        "tasks.taskUsers.user",
      ],
      ...(isAdmin === false ? { where: `"ProjectEntity__tasks__taskUsers__user"."id" = ${userId}` } : undefined),
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
  public async delete(projectId: number, userId: number, isAdmin: boolean): Promise<void> {
    const project = await ProjectEntity.findOneOrFail(projectId, {
      relations: [
        "customer",
        "tasks",
        "tasks.times",
        "tasks.times.user",
        "tasks.taskUsers",
        "tasks.taskUsers.user",
      ],
      ...(isAdmin === false ? { where: `"ProjectEntity__tasks__taskUsers__user"."id" = ${userId}` } : undefined),
    });

    for (const task of project.tasks) {
      if (task.times.length > 0) {
        // Delete time entites
        await this.timeEntity.delete(task.times.map((time: TimeEntity) => time.id));
      }
      if (task.taskUsers.length > 0) {
        // Delete task users
        await this.taskUserEntity.delete(task.taskUsers.map((taskUser: TaskUserEntity) => taskUser.id));
      }
    }
    if (project.tasks.length > 0) {
      // Delete tasks
      await this.taskEntity.delete(project.tasks.map((task: TaskEntity) => task.id));
    }
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
      ...(project.customer !== undefined ? {
        customer: this.customerDTO.parse({
          id: project.customer.id,
          name: project.customer.name,
        }).serialize(),
      } : undefined),
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
              comment: time.comment !== null ? time.comment : "",
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
    }).serialize();
  }

}
