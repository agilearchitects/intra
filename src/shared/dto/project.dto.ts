import { CustomerDTO, ICustomerDTO } from "./customer.dto";
import { ITaskDTO, TaskDTO } from "./task.dto";
import { IUserDTO, UserDTO } from "./user.dto";

export interface IProjectDTO {
  id: number;
  name: string;
  customer?: ICustomerDTO;
  tasks?: ITaskDTO[];
  users?: IUserDTO[];
}

export class ProjectDTO implements IProjectDTO {
  public static parse(object: IProjectDTO): ProjectDTO {
    return new ProjectDTO(
      object.id,
      object.name,
      (object.customer ? CustomerDTO.parse(object.customer) : undefined),
      (object.tasks ? object.tasks.map((task: ITaskDTO) => TaskDTO.parse(task)) : undefined),
      (object.users ? object.users.map((user: IUserDTO) => UserDTO.parse(user)) : undefined),
    );
  }

  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly customer?: CustomerDTO,
    public readonly tasks?: TaskDTO[],
    public readonly users?: UserDTO[],
  ) { }

  public serialize(): IProjectDTO {
    return {
      id: this.id,
      name: this.name,
      ...(this.customer ? { customer: this.customer.serialize() } : null),
      ...(this.tasks ? { tasks: this.tasks.map((task: TaskDTO) => task.serialize()) } : null),
      ...(this.users ? { users: this.users.map((user: UserDTO) => user.serialize()) } : null),
    };
  }
}
