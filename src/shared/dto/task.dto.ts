// Libs
import { jsonType } from "@agilearchitects/server";

// Services
import { DateService } from "../services/date.service";

// DTO's
import { IDictionaryDTO } from "./dictionary.dto";
import { DTO } from "./dto";
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
  public static parseFromRequest(object: IDictionaryDTO<jsonType>, dateService?: DateService): TaskDTO {
    if (
      typeof object.id !== "number" ||
      typeof object.name !== "string" ||
      (object.project !== undefined && (
        object.project === null ||
        (object.project instanceof Array) ||
        typeof object.project !== "object"
      )) ||
      (typeof object.rate !== "number" && object.rate !== undefined) ||
      (typeof object.priceBudget !== "number" && object.priceBudget !== undefined) ||
      (typeof object.hoursBudget !== "number" && object.hoursBudget !== undefined) ||
      (object.times !== undefined && !(object.times instanceof Array)) ||
      (object.users !== undefined && !(object.users instanceof Array))
    ) {
      throw new Error("Unable to parse");
    }

    return new TaskDTO(
      object.id,
      object.name,
      (object.project !== undefined ? ProjectDTO.parseFromRequest(object.project, dateService) : undefined),
      object.rate,
      object.priceBudget,
      object.hoursBudget,
      (object.times !== undefined ? DTO.parseArrayToDictionary(object.times).map((time: IDictionaryDTO<jsonType>) => TimeDTO.parseFromRequest(time)) : undefined),
      (object.users !== undefined ? DTO.parseArrayToDictionary(object.users).map((user: IDictionaryDTO<jsonType>) => TaskUserDTO.parseFromRequest(user)) : undefined),
    )
  }
  public static parse(task: ITaskDTO, dateService?: DateService): TaskDTO {
    return new this(
      task.id,
      task.name,
      (task.project !== undefined ? ProjectDTO.parse(task.project, dateService) : undefined),
      task.rate,
      task.priceBudget,
      task.hoursBudget,
      (task.times ? task.times.map((time: ITimeDTO) => TimeDTO.parse(time, dateService)) : undefined),
      (task.users ? task.users.map((user: ITaskUserDTO) => TaskUserDTO.parse(user)) : undefined),
    );
  }

  public get hours(): number {
    if (this.times !== undefined) {
      return this.times.reduce((previousValue: number, time: TimeDTO) => {
        return previousValue + (time.hours !== undefined ? time.hours : 0);
      }, 0)
    }

    return 0;
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
