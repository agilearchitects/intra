// Libs
import { jsonType } from "@agilearchitects/server";

// DTO's
import { IDictionaryDTO } from "./dictionary.dto";

export interface IResetPasswordTokenDTO {
  token: string;
}

export class ResetPasswordTokenDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): ResetPasswordTokenDTO {
    if (
      typeof object.token !== "string"
    ) {
      throw new Error("Unable to parse");
    }

    return ResetPasswordTokenDTO.parse({
      token: object.token,
    });
  }

  public static parse(object: IResetPasswordTokenDTO): ResetPasswordTokenDTO {
    return new this(
      object.token,
    );
  }

  public constructor(
    public readonly token: string,
  ) { }

  public serialize(): IResetPasswordTokenDTO {
    return {
      token: this.token,
    };
  }
}