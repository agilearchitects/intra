import { CustomerDTO, ICustomerDTO } from "./customer.dto";
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
  public static parse(object: IProjectDTO): ProjectDTO {
    return new ProjectDTO(
      object.id,
      object.name,
      object.rate,
      object.priceBudget,
      object.hoursBudget,
      object.start,
      object.end,
      (object.customer ? CustomerDTO.parse(object.customer) : undefined),
      (object.tasks ? object.tasks.map((task: ITaskDTO) => TaskDTO.parse(task)) : undefined),
    );
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
