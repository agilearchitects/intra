import { IProjectDTO, ProjectDTO } from "./project.dto";

export interface ICustomerDTO {
  id: number;
  name: string;
  projects?: IProjectDTO[];
}

export class CustomerDTO implements ICustomerDTO {
  public static parse(object: ICustomerDTO): CustomerDTO {
    return new CustomerDTO(
      object.id,
      object.name,
      (object.projects !== undefined ? object.projects.map((project: IProjectDTO) => ProjectDTO.parse(project)) : undefined),
    );
  }

  public constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly projects?: ProjectDTO[],
  ) { }

  public serialize(): ICustomerDTO {
    return {
      id: this.id,
      name: this.name,
      ...(this.projects ? { projects: this.projects.map((project: ProjectDTO) => project.serialize()) } : null),
    };
  }
}
