// Libs
import { jsonType } from "@agilearchitects/server";

// DTO's
import { IDictionaryDTO } from "./dictionary.dto";

export interface IResetPasswordDTO {
  token: string;
  password: string;
}

export class ResetPasswordDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): ResetPasswordDTO {
    if (
      typeof object.token !== "string" ||
      typeof object.password !== "string"
    ) {
      throw new Error("Unable to parse");
    }

    return ResetPasswordDTO.parse({
      token: object.token,
      password: object.password,
    });
  }

  public static parse(object: IResetPasswordDTO): ResetPasswordDTO {
    return new this(
      object.token,
      object.password,
    );
  }

  public constructor(
    public readonly token: string,
    public readonly password: string,
  ) { }

  public serialize(): IResetPasswordDTO {
    return {
      token: this.token,
      password: this.password,
    };
  }
}