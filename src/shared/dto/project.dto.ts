import { CustomerDTO, ICustomerDTO } from "./customer.dto";
import { IProjectUserDTO, ProjectUserDTO } from "./project-user.dto";
import { ITaskDTO, TaskDTO } from "./task.dto";

export interface IProjectDTO {
  id: number;
  name: string;
  rate: number;
  priceBudget: number;
  hoursBudget: number;
  customer?: ICustomerDTO;
  tasks?: ITaskDTO[];
  users?: IProjectUserDTO[];
}

export class ProjectDTO implements IProjectDTO {
  public static parse(object: IProjectDTO): ProjectDTO {
    return new ProjectDTO(
      object.id,
      object.name,
      object.rate,
      object.priceBudget,
      object.hoursBudget,
      (object.customer ? CustomerDTO.parse(object.customer) : undefined),
      (object.tasks ? object.tasks.map((task: ITaskDTO) => TaskDTO.parse(task)) : undefined),
      (object.users ? object.users.map((user: IProjectUserDTO) => ProjectUserDTO.parse(user)) : undefined),
    );
  }

  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly rate: number,
    public readonly priceBudget: number,
    public readonly hoursBudget: number,
    public readonly customer?: CustomerDTO,
    public readonly tasks?: TaskDTO[],
    public readonly users?: ProjectUserDTO[],
  ) { }

  public serialize(): IProjectDTO {
    return {
      id: this.id,
      name: this.name,
      rate: this.rate,
      priceBudget: this.priceBudget,
      hoursBudget: this.hoursBudget,
      ...(this.customer ? { customer: this.customer.serialize() } : null),
      ...(this.tasks ? { tasks: this.tasks.map((task: TaskDTO) => task.serialize()) } : null),
      ...(this.users ? { users: this.users.map((user: ProjectUserDTO) => user.serialize()) } : null),
    };
  }
}
