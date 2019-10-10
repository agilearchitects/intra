import moment = require("moment");
import { IProjectDTO, ProjectDTO } from "./project.dto";
import { IUserDTO, UserDTO } from "./user.dto";

export interface ITimeDTO {
  id: number;
  project?: IProjectDTO;
  from: string;
  to?: string;
  comment: string;
  user?: IUserDTO;
}

export class TimeDTO implements ITimeDTO {
  public static parse(object: ITimeDTO): TimeDTO {
    return new TimeDTO(
      object.id,
      object.project ? ProjectDTO.parse(object.project) : undefined,
      object.from,
      object.to !== undefined ? object.to : undefined,
      object.comment,
      object.user ? UserDTO.parse(object.user) : undefined,
    );
  }

  public constructor(
    public readonly id: number,
    public readonly project: ProjectDTO | undefined,
    public readonly from: string,
    public readonly to: string | undefined,
    public readonly comment: string,
    public readonly user: UserDTO | undefined,
  ) { }

  public serialize(): ITimeDTO {
    return {
      id: this.id,
      ...(this.project ? { project: this.project.serialize() } : undefined),
      from: this.from,
      ...(this.to !== undefined ? { to: this.to } : undefined),
      comment: this.comment,
      ...(this.user !== undefined ? { user: this.user.serialize() } : undefined),
    };
  }
}
