import { jsonType } from "@agilearchitects/server";
import { DateService } from "../services/date.service";
import { DTO } from "./dto";
import { IProjectDTO, ProjectDTO } from "./project.dto";

export interface ICustomerDTO {
  id: number;
  name: string;
  projects?: IProjectDTO[];
}

export class CustomerDTO implements ICustomerDTO {
  public static parseFromRequest(object: jsonType, dateService?: DateService): CustomerDTO {
    object = DTO.parseFromRequest(object);
    if (typeof object.id !== "number" ||
      typeof object.name !== "string" ||
      (object.projects !== undefined &&
        !(object.projects instanceof Array))) {
      throw new Error("Unable to parse");
    }
    return new CustomerDTO(
      object.id,
      object.name,
      (object.projects !== undefined ? object.projects.map((project: jsonType) => ProjectDTO.parseFromRequest(project, dateService)) : undefined),
    )
  }
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
