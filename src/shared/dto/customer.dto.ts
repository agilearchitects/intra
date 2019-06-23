import DTO from "./dto";
import { ProjectDTO, IProjectJSON } from "./project.dto";

export interface ICustomer<A> {
  id: number;
  name: string;
  projects?: A[];
}

export interface ICustomerDTO extends ICustomer<ProjectDTO> { }
export interface ICustomerJSON extends ICustomer<IProjectJSON> { }

export class CustomerDTO extends DTO<ICustomerDTO> implements ICustomerDTO {
  public static parse(object: ICustomerJSON): CustomerDTO {
    return new CustomerDTO({
      id: object.id,
      name: object.name,
      ...(object.projects ? { projects: object.projects.map((project: IProjectJSON) => ProjectDTO.parse(project)) } : null),
    });
  }
  public id!: number;
  public name!: string;
  public projects?: ProjectDTO[];

  public serialize(): ICustomerJSON {
    return {
      id: this.id,
      name: this.name,
      ...(this.projects ? { projects: this.projects.map((project: ProjectDTO) => project.serialize()) } : null),
    };
  }
}
