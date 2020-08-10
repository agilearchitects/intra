// Libs
import { jsonType } from "@agilearchitects/server";

// DTO's
import { IDictionaryDTO } from "./dictionary.dto";
import { IUserDTO, UserDTO } from "./user.dto";

export interface ITaskUserDTO {
  id: number;
  user: IUserDTO;
  rate?: number;
}

export class TaskUserDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): TaskUserDTO {
    if (
      typeof object.id !== "number" ||
      object.user === null ||
      typeof object.user !== "object" ||
      (object.user instanceof Array) ||
      (typeof object.rate !== "number" && object.rate !== undefined)
    ) {
      throw new Error("Unable to parse");
    }

    return new TaskUserDTO(
      object.id,
      UserDTO.parseFromRequest(object.user),
      object.rate,
    )
  }
  public static parse(taskUser: ITaskUserDTO):
    TaskUserDTO {
    return new this(
      taskUser.id,
      UserDTO.parse(taskUser.user),
      taskUser.rate,
    );
  }

  public constructor(
    public readonly id: number,
    public readonly user: UserDTO,
    public readonly rate?: number,
  ) { }

  public serialize(): ITaskUserDTO {
    return {
      id: this.id,
      user: this.user.serialize(),
      ...(this.rate !== undefined ? { rate: this.rate } : undefined),
    };
  }
}
