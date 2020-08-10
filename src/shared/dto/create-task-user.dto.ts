import { jsonType } from "@agilearchitects/server";
import { IDictionaryDTO } from "./dictionary.dto";
import { DTO } from "./dto";

export interface ICreateTaskUserDTO {
  userId: number;
  rate?: number;
}

export class CreateTaskUserDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): CreateTaskUserDTO {
    if (typeof object.userId !== "number" ||
      (object.rate !== undefined &&
        typeof object.rate !== "number")) {
      throw new Error("Unable to parse");
    }
    return new CreateTaskUserDTO(object.userId, object.rate);
  }
  public static parse(createTaskUser: ICreateTaskUserDTO): CreateTaskUserDTO {
    return new this(
      createTaskUser.userId,
      createTaskUser.rate,
    );
  }

  public constructor(
    public readonly userId: number,
    public readonly rate?: number,
  ) { }

  public serialize(): ICreateTaskUserDTO {
    return {
      userId: this.userId,
      ...(this.rate !== undefined ? { rate: this.rate } : undefined),
    };
  }
}
