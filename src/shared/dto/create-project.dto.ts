import { bodyType, jsonType } from "@agilearchitects/server";
import { CreateTaskDTO, ICreateTaskDTO } from "./create-task.dto";
import { DTO } from "./dto";

export interface ICreateProjectDTO {
  name: string;
  customerId: number;
  rate?: number;
  priceBudget?: number;
  hoursBudget?: number;
  start?: string;
  end?: string;
  tasks?: ICreateTaskDTO[];
}

export class CreateProjectDTO implements ICreateProjectDTO {
  public static parseFromRequest(object: bodyType): CreateProjectDTO {
    object = DTO.parseFromRequest(object);
    if (typeof object.name !== "string" ||
      typeof object.customerId !== "number" ||
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

    return new CreateProjectDTO(
      object.name,
      object.customerId,
      object.rate,
      object.priceBudget,
      object.hoursBudget,
      object.start,
      object.end,
      object.tasks !== undefined ? object.tasks.map((task: jsonType) => CreateTaskDTO.parseFromRequest(task)) : undefined,
    );
  }
  public static parse(object: ICreateProjectDTO): CreateProjectDTO {
    return new CreateProjectDTO(
      object.name,
      object.customerId,
      object.rate,
      object.priceBudget,
      object.hoursBudget,
      object.start,
      object.end,
      object.tasks !== undefined ? object.tasks.map((task: ICreateTaskDTO) => CreateTaskDTO.parse(task)) : undefined,
    );
  }

  public constructor(
    public readonly name: string,
    public readonly customerId: number,
    public readonly rate?: number | undefined,
    public readonly priceBudget?: number | undefined,
    public readonly hoursBudget?: number | undefined,
    public readonly start?: string,
    public readonly end?: string,
    public readonly tasks?: CreateTaskDTO[],
  ) { }

  public serialize(): ICreateProjectDTO {
    return {
      name: this.name,
      customerId: this.customerId,
      ...(this.rate !== undefined ? { rate: this.rate } : undefined),
      ...(this.priceBudget !== undefined ? { priceBudget: this.priceBudget } : undefined),
      ...(this.hoursBudget !== undefined ? { hoursBudget: this.hoursBudget } : undefined),
      ...(this.start !== undefined ? { start: this.start } : undefined),
      ...(this.end !== undefined ? { end: this.end } : undefined),
      ...(this.tasks !== undefined ? {
        tasks: this.tasks.map((task: CreateTaskDTO) => task.serialize()),
      } : undefined),
    };
  }
}
