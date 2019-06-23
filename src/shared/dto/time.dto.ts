import DTO from "./dto";
import { UserDTO, IUserJSON } from "./user.dto";
import moment = require("moment");
import { ProjectDTO, IProjectJSON } from "./project.dto";

export interface ITime<A, B, C, D> {
  id: number;
  project?: D;
  from: A;
  to?: B;
  comment: string;
  user?: C;
}

export interface ITimeDTO extends ITime<Date, Date, UserDTO, ProjectDTO> { }
export interface ITimeJSON extends ITime<string, string, IUserJSON, IProjectJSON> { }

export class TimeDTO extends DTO<ITimeDTO> implements ITimeDTO {
  public static parse(object: ITimeJSON): TimeDTO {
    return new TimeDTO({
      id: object.id,
      ...(object.project ? { project: ProjectDTO.parse(object.project) } : null),
      from: moment(object.from).toDate(),
      ...(object.to !== undefined ? { to: moment(object.to).toDate() } : undefined),
      comment: object.comment,
      ...(object.user ? { user: UserDTO.parse(object.user) } : null),
    });
  }
  public id!: number;
  public customer!: string;
  public project?: ProjectDTO;
  public from!: Date;
  public to?: Date;
  public comment!: string;
  public user!: UserDTO;

  public serialize(): ITimeJSON {
    return {
      id: this.id,
      ...(this.project ? { project: this.project.serialize() } : null),
      from: moment(this.from).format("YYYY-MM-DD HH:mm:ss"),
      ...(this.to !== undefined ? { to: moment(this.to).format("YYYY-MM-DD HH:mm:ss") } : undefined),
      comment: this.comment,
      user: this.user.serialize(),
    };
  }
}
