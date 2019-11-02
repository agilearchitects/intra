import { CreateTaskUserDTO, ICreateTaskUserDTO } from "./create-task-user.dto";
import { CreateTaskDTO, ICreateTaskDTO } from "./create-task.dto";

export interface IUpdateTaskDTO extends ICreateTaskDTO {
  id: number;
}

export class UpdateTaskDTO extends CreateTaskDTO {
  public static parse(updateTask: IUpdateTaskDTO):
    UpdateTaskDTO {
    return new this(
      updateTask.id,
      updateTask.name,
      updateTask.rate,
      updateTask.priceBudget,
      updateTask.hoursBudget,
      updateTask.users !== undefined ? updateTask.users.map((user: ICreateTaskUserDTO) => CreateTaskUserDTO.parse(user)) : undefined,
    );
  }

  public constructor(
    public readonly id: number,
    name: string,
    rate?: number,
    priceBudget?: number,
    hoursBudget?: number,
    users?: CreateTaskUserDTO[],
  ) { super(name, rate, priceBudget, hoursBudget, users); }

  public serialize(): IUpdateTaskDTO {
    return {
      id: this.id,
      name: this.name,
      rate: this.rate,
      priceBudget: this.priceBudget,
      hoursBudget: this.hoursBudget,
      ...(this.users !== undefined ? { users: this.users.map((user: CreateTaskUserDTO) => user.serialize()) } : undefined),
    };
  }
}
