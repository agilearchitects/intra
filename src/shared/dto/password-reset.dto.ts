// Libs
import { jsonType } from "@agilearchitects/server";

// DTO's
import { IDictionaryDTO } from "./dictionary.dto";

export interface IPasswordResetDTO {
  email: string;
}

export class PasswordResetDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): PasswordResetDTO {
    if (
      typeof object.email !== "string"
    ) {
      throw new Error("Unable to parse");
    }

    return PasswordResetDTO.parse({
      email: object.email,
    });
  }

  public static parse(object: IPasswordResetDTO): PasswordResetDTO {
    return new this(
      object.email,
    );
  }

  public constructor(
    public readonly email: string,
  ) { }

  public serialize(): IPasswordResetDTO {
    return {
      email: this.email,
    };
  }
}