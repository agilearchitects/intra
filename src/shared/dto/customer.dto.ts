import { IProjectDTO, ProjectDTO } from "./project.dto";
import { DateService } from "../services/date.service";

export interface ICustomerDTO {
  id: number;
  name: string;
  projects?: IProjectDTO[];
}

export class CustomerDTO implements ICustomerDTO {
  public static parse(object: ICustomerDTO, dateService?: DateService): CustomerDTO {
    return new CustomerDTO(
      object.id,
      object.name,
      (object.projects !== undefined ? object.projects.map((project: IProjectDTO) => ProjectDTO.parse(project, dateService)) : undefined),
    );
  }

  public get hours(): number {
    if (this.projects !== undefined) {
      return this.projects.reduce((previousValue: number, project: ProjectDTO) => {
        return previousValue + project.hours;
      }, 0)
    }

    return 0;
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
      ...(this.projects ? { projects: this.projects.map((project: ProjectDTO) => project.serialize()) } : undefined),
    };
  }
}
