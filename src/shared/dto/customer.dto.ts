// Libs
import { jsonType } from "@agilearchitects/server";

// Services
import { DateService } from "../services/date.service";

// DTO's
import { IDictionaryDTO } from "./dictionary.dto";
import { DTO } from "./dto";
import { IProjectDTO, ProjectDTO } from "./project.dto";

export interface ICustomerDTO {
  id: number;
  name: string;
  projects?: IProjectDTO[];
}

export class CustomerDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>, dateService?: DateService): CustomerDTO {
    if (
      typeof object.id !== "number" ||
      typeof object.name !== "string" ||
      (object.projects !== undefined && !(object.projects instanceof Array))
    ) {
      throw new Error("Unable to parse");
    }
    return new CustomerDTO(
      object.id,
      object.name,
      (object.projects !== undefined ? DTO.parseArrayToDictionary(object.projects).map((project: IDictionaryDTO<jsonType>) => ProjectDTO.parseFromRequest(project, dateService)) : undefined),
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
