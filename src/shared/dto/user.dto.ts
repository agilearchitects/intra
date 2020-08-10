// Libs
import { jsonType } from "@agilearchitects/server";

// DTO's
import { IDictionaryDTO } from "./dictionary.dto";

export interface IUserDTO {
  id: number;
  email: string;
}

export class UserDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): UserDTO {
    if (
      typeof object.id !== "number" ||
      typeof object.email !== "string"
    ) {
      throw new Error("Unable to parse");
    }

    return UserDTO.parse({
      id: object.id,
      email: object.email,
    });
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