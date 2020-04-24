import { jsonType } from "@agilearchitects/server";
import { DTO } from "./dto";
export interface IStopTimeDTO {
  id: number;
  to: string;
}

export class StopTimeDTO implements IStopTimeDTO {
  public static parseFromRequest(object: jsonType): StopTimeDTO {
    object = DTO.parseFromRequest(object);
    if (typeof object.id !== "number" ||
      typeof object.to !== "string") {
      throw new Error("Unable to parse")
    }
    return new StopTimeDTO(
      object.id,
      object.to,
    )
  }
  public static parse(object: IStopTimeDTO): StopTimeDTO {
    return new StopTimeDTO(
      object.id,
      object.to,
    );
  }

  public constructor(
    public readonly id: number,
    public readonly to: string,
  ) { }

  public serialize(): IStopTimeDTO {
    return {
      id: this.id,
      to: this.to,
    };
  }
}
