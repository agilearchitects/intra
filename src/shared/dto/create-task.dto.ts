import { CreateTaskUserDTO, ICreateTaskUserDTO } from "./create-task-user.dto";

export interface ICreateTaskDTO {
  name: string;
  rate?: number;
  priceBudget?: number;
  hoursBudget?: number;
  users?: ICreateTaskUserDTO[];
}

export class CreateTaskDTO {
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
