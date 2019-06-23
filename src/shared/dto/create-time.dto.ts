import moment from "moment";
import DTO from "./dto";

export interface ICreateTime<A, B> {
  projectId: number;
  from: A;
  to?: B;
  comment: string;
  userId: number;
}

export interface ICreateTimeDTO extends ICreateTime<Date, Date> { }
export interface ICreateTimeJSON extends ICreateTime<string, string> { }

export class CreateTimeDTO extends DTO<ICreateTimeDTO> implements ICreateTimeDTO {
  public static parse(object: ICreateTimeJSON): CreateTimeDTO {
    return new CreateTimeDTO({
      projectId: object.projectId,
      from: moment(object.from).toDate(),
      ...(object.to !== undefined ? { to: moment(object.to).toDate() } : undefined),
      comment: object.comment,
      userId: object.userId,
    });
  }

  public projectId!: number;
  public from!: Date;
  public to?: Date;
  public comment!: string;
  public userId!: number;

  public serialize(): ICreateTimeJSON {
    return {
      projectId: this.projectId,
      from: moment(this.from).format("YYYY-MM-DD HH:mm:ss"),
      ...(this.to !== undefined ? { to: moment(this.to).format("YYYY-MM-DD HH:mm:ss") } : undefined),
      comment: this.comment,
      userId: this.userId,
    };
  }
}
