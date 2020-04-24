import { jsonType } from "@agilearchitects/server"
import { DateService } from "../services/date.service"
import { CustomerDTO, ICustomerDTO } from "./customer.dto";
import { DTO } from "./dto";
import { TagDTO } from "./tag.dto";
import { ITaskDTO, TaskDTO } from "./task.dto";

export interface IProjectDTO {
  id: number;
  name: string;
  rate?: number;
  priceBudget?: number;
  hoursBudget?: number;
  start?: string;
  end?: string;
  customer?: ICustomerDTO;
  tasks?: ITaskDTO[];
}

export class ProjectDTO implements IProjectDTO {
  public static parseFromRequest(object: jsonType, dateService?: DateService): ProjectDTO {
    object = DTO.parseFromRequest(object);
    if (typeof object.id !== "number" ||
      typeof object.name !== "string" ||
      (object.rate !== undefined &&
        typeof object.rate !== "number") ||
      (object.priceBudget !== undefined &&
        typeof object.priceBudget !== "number") ||
      (object.hoursBudget !== undefined &&
        typeof object.hoursBudget !== "number") ||
      (object.start !== undefined &&
        typeof object.start !== "string") ||
      (object.end !== undefined &&
        typeof object.end !== "string") ||
      (object.tasks !== undefined &&
        !(object.tasks instanceof Array))) {
      throw new Error("Unable to parse");
    }
    return new ProjectDTO(
      object.id,
      object.name,
      object.rate,
      object.priceBudget,
      object.hoursBudget,
      object.start,
      object.end,
      (object.customer ? CustomerDTO.parseFromRequest(object.customer, dateService) : undefined),
      (object.tasks !== undefined ? object.tasks.map((task: jsonType) => TaskDTO.parseFromRequest(task)) : undefined)
    )
  }
  public static parse(object: IProjectDTO, dateService?: DateService): ProjectDTO {
    return new ProjectDTO(
      object.id,
      object.name,
      object.rate,
      object.priceBudget,
      object.hoursBudget,
      object.start,
      object.end,
      (object.customer ? CustomerDTO.parse(object.customer, dateService) : undefined),
      (object.tasks ? object.tasks.map((task: ITaskDTO) => TaskDTO.parse(task, dateService)) : undefined),
    );
  }

  public get hours(): number {
    if (this.tasks !== undefined) {
      return this.tasks.reduce((previousValue: number, task: TaskDTO) => {
        return previousValue + task.hours;
      }, 0)
    }

    return 0;
  }


  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly rate?: number,
    public readonly priceBudget?: number,
    public readonly hoursBudget?: number,
    public readonly start?: string,
    public readonly end?: string,
    public readonly customer?: CustomerDTO,
    public readonly tasks?: TaskDTO[],
  ) { }

  public serialize(): IProjectDTO {
    return {
      id: this.id,
      name: this.name,
      ...(this.rate !== undefined ? { rate: this.rate } : undefined),
      ...(this.priceBudget !== undefined ? { priceBudget: this.priceBudget } : undefined),
      ...(this.hoursBudget !== undefined ? { hoursBudget: this.hoursBudget } : undefined),
      ...(this.start !== undefined ? { start: this.start } : undefined),
      ...(this.end !== undefined ? { end: this.end } : undefined),
      ...(this.customer ? { customer: this.customer.serialize() } : null),
      ...(this.tasks ? { tasks: this.tasks.map((task: TaskDTO) => task.serialize()) } : null),
    };
  }
}
