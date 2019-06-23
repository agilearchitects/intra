import DTO from "./dto";
import { ICustomerDTO, ICustomerJSON, CustomerDTO } from "./customer.dto";
import { ITimeDTO, ITimeJSON, TimeDTO } from "./time.dto";

export interface IProject<A, B> {
  id: number;
  name: string;
  customer?: A;
  times?: B[];
}

export interface IProjectDTO extends IProject<CustomerDTO, TimeDTO> { }
export interface IProjectJSON extends IProject<ICustomerJSON, ITimeJSON> { }

export class ProjectDTO extends DTO<IProjectDTO> implements IProjectDTO {
  public static parse(object: IProjectJSON): ProjectDTO {
    return new ProjectDTO({
      id: object.id,
      name: object.name,
      ...(object.customer ? { customer: CustomerDTO.parse(object.customer) } : null),
      ...(object.times ? { times: object.times.map((time: ITimeJSON) => TimeDTO.parse(time)) } : null),
    });
  }
  public id!: number;
  public name!: string;
  public customer?: CustomerDTO;
  public times?: TimeDTO[];

  public serialize(): IProjectJSON {
    return {
      id: this.id,
      name: this.name,
      ...(this.customer ? { customer: this.customer.serialize() } : null),
      ...(this.times ? { times: this.times.map((time: TimeDTO) => time.serialize()) } : null),
    };
  }
}
