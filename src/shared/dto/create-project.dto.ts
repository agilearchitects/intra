import { CreateProjectUserDTO, ICreateProjectUserDTO } from "./create-project-user.dto";
import { CreateTaskDTO, ICreateTaskDTO } from "./create-task.dto";

export interface ICreateProjectDTO {
  name: string;
  customerId: number;
  users: ICreateProjectUserDTO[];
  tasks: ICreateTaskDTO[];
}

export class CreateProjectDTO implements ICreateProjectDTO {
  public static parse(object: ICreateProjectDTO): CreateProjectDTO {
    return new CreateProjectDTO(
      object.name,
      object.customerId,
      object.users.map((user: ICreateProjectUserDTO) => CreateProjectUserDTO.parse(user)),
      object.tasks.map((task: ICreateTaskDTO) => CreateTaskDTO.parse(task)),
    );
  }

  public constructor(
    public readonly name: string,
    public readonly customerId: number,
    public readonly users: CreateProjectUserDTO[],
    public readonly tasks: CreateTaskDTO[],
  ) { }

  public serialize(): ICreateProjectDTO {
    return {
      name: this.name,
      customerId: this.customerId,
      users: this.users,
      tasks: this.tasks,
    };
  }
}
