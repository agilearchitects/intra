import { IProjectDTO, ProjectDTO } from "./project.dto";
import { ITaskUserDTO, TaskUserDTO } from "./task-user.dto";
import { ITimeDTO, TimeDTO } from "./time.dto";

export interface ITaskDTO {
  id: number;
  name: string;
  project?: IProjectDTO;
  rate?: number;
  priceBudget?: number;
  hoursBudget?: number;
  times?: ITimeDTO[];
  users?: ITaskUserDTO[];
}

export class TaskDTO {
  public static parse(task: ITaskDTO): TaskDTO {
    return new this(
      task.id,
      task.name,
      (task.project !== undefined ? ProjectDTO.parse(task.project) : undefined),
      task.rate,
      task.priceBudget,
      task.hoursBudget,
      (task.times ? task.times.map((time: ITimeDTO) => TimeDTO.parse(time)) : undefined),
      (task.users ? task.users.map((user: ITaskUserDTO) => TaskUserDTO.parse(user)) : undefined),
    );
  }

  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly project?: ProjectDTO,
    public readonly rate?: number,
    public readonly priceBudget?: number,
    public readonly hoursBudget?: number,
    public readonly times?: TimeDTO[],
    public readonly users?: TaskUserDTO[],
  ) { }

  public serialize(): ITaskDTO {
    return {
      id: this.id,
      name: this.name,
      ...(this.project !== undefined ? { project: this.project.serialize() } : undefined),
      ...(this.rate !== undefined ? { rate: this.rate } : undefined),
      ...(this.priceBudget !== undefined ? { priceBudget: this.priceBudget } : undefined),
      ...(this.hoursBudget !== undefined ? { hoursBudget: this.hoursBudget } : undefined),
      ...(this.times !== undefined ? { times: this.times.map((time: TimeDTO) => time.serialize()) } : undefined),
      ...(this.users !== undefined ? { users: this.users.map((user: TaskUserDTO) => user.serialize()) } : undefined),
    };
  }
}
