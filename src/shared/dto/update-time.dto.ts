import moment from "moment";
import DTO from "./dto";


export interface IUpdateTime<A, B> {
  id: number;
  projectId: number;
  from: A;
  to?: B;
  comment: string;
  userId: number;
}

export interface IUpdateTimeDTO extends IUpdateTime<Date, Date> { }
export interface IUpdateTimeJSON extends IUpdateTime<string, string> { }

export class UpdateTimeDTO extends DTO<IUpdateTimeDTO> implements IUpdateTimeDTO {
  public static parse(object: IUpdateTimeJSON): UpdateTimeDTO {
    return new UpdateTimeDTO({
      id: object.id,
      projectId: object.projectId,
      from: moment(object.from).toDate(),
      ...(object.to !== undefined ? { to: moment(object.to).toDate() } : undefined),
      comment: object.comment,
      userId: object.userId,
    });
  }

  public id!: number;
  public projectId!: number;
  public from!: Date;
  public to?: Date;
  public comment!: string;
  public userId!: number;

  public serialize(): IUpdateTimeJSON {
    return {
      id: this.id,
      projectId: this.projectId,
      from: moment(this.from).format("YYYY-MM-DD HH:mm:ss"),
      ...(this.to !== undefined ? { to: moment(this.to).format("YYYY-MM-DD HH:mm:ss") } : undefined),
      comment: this.comment,
      userId: this.userId,
    };
  }
}
