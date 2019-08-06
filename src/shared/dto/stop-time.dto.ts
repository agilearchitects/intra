import moment from "moment";
import DTO from "./dto";

export interface IStopTime<A> {
  id: number;
  to: A;
}

export interface IStopTimeDTO extends IStopTime<Date> { }
export interface IStopTimeJSON extends IStopTime<string> { }

export class StopTimeDTO extends DTO<IStopTimeDTO> implements IStopTimeDTO {
  public static parse(object: IStopTimeJSON): StopTimeDTO {
    return new StopTimeDTO({
      id: object.id,
      to: moment(object.to).toDate(),
    });
  }
  public id!: number;
  public to!: Date;

  public serialize(): IStopTimeJSON {
    return {
      id: this.id,
      to: moment(this.to).format("YYYY-MM-DD HH:mm:ss"),
    };
  }
}
