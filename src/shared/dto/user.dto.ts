import { jsonType } from "@agilearchitects/server";
import { DTO } from "./dto";

export interface IUserDTO {
  id: number;
  email: string;
}

export class UserDTO implements IUserDTO {
  public static parseFromRequest(object: jsonType): UserDTO {
    object = DTO.parseFromRequest(object);
    if (typeof object.id !== "number" || typeof object.email !== "string") {
      throw new Error("Unable to parse");
    }
    return new UserDTO(object.id, object.email);
  }
  public static parse(object: IUserDTO): UserDTO {
    return new UserDTO(
      object.id,
      object.email,
    );
  }

  public constructor(
    public readonly id: number,
    public readonly email: string,
  ) { }

  public serialize(): IUserDTO {
    return {
      id: this.id,
      email: this.email,
    };
  }
}
