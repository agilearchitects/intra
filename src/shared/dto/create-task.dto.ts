import { jsonType } from "@agilearchitects/server";
import { CreateTaskUserDTO, ICreateTaskUserDTO } from "./create-task-user.dto";
import { DTO } from "./dto";

export interface ICreateTaskDTO {
  name: string;
  rate?: number;
  priceBudget?: number;
  hoursBudget?: number;
  users?: ICreateTaskUserDTO[];
}

export class CreateTaskDTO {
  public static parseFromRequest(object: jsonType): CreateTaskDTO {
    object = DTO.parseFromRequest(object);
    if (typeof object.name !== "string" ||
      (object.rate !== undefined &&
        typeof object.rate !== "number") ||
      (object.priceBudget !== undefined &&
        typeof object.priceBudget !== "number") ||
      (object.hoursBudget !== undefined &&
        typeof object.hoursBudget !== "number") ||
      (object.users !== undefined &&
        !(object.users instanceof Array))) {
      throw new Error("Unable to parse");
    }
    return new CreateTaskDTO(
      object.name,
      object.rate,
      object.priceBudget,
      object.hoursBudget,
      object.users !== undefined ? object.users.map((user: jsonType) => CreateTaskUserDTO.parseFromRequest(user)) : undefined,
    )
  }
  public static parse(createTask: ICreateTaskDTO):
    CreateTaskDTO {
    return new this(
      createTask.name,
      createTask.rate,
      createTask.priceBudget,
      createTask.hoursBudget,
      createTask.users !== undefined ? createTask.users.map((user: ICreateTaskUserDTO) => CreateTaskUserDTO.parse(user)) : undefined,
    );
  }

  public constructor(
    public readonly name: string,
    public readonly rate?: number,
    public readonly priceBudget?: number,
    public readonly hoursBudget?: number,
    public readonly users?: CreateTaskUserDTO[],
  ) { }

  public serialize(): ICreateTaskDTO {
    return {
      name: this.name,
      rate: this.rate,
      priceBudget: this.priceBudget,
      hoursBudget: this.hoursBudget,
      ...(this.users !== undefined ? { users: this.users.map((user: CreateTaskUserDTO) => user.serialize()) } : undefined),
    };
  }
}
