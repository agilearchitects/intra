// Libs
import { jsonType } from "@agilearchitects/server";

// DTO's
import { IDictionaryDTO } from "./dictionary.dto";

export interface IResetPasswordTokenResponseDTO {
  valid: boolean;
}

export class ResetPasswordTokenResponseDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): ResetPasswordTokenResponseDTO {
    if (
      typeof object.valid !== "boolean"
    ) {
      throw new Error("Unable to parse");
    }

    return ResetPasswordTokenResponseDTO.parse({
      valid: object.valid,
    });
  }

  public static parse(object: IResetPasswordTokenResponseDTO): ResetPasswordTokenResponseDTO {
    return new this(
      object.valid,
    );
  }

  public constructor(
    public readonly valid: boolean,
  ) { }

  public serialize(): IResetPasswordTokenResponseDTO {
    return {
      valid: this.valid,
    };
  }
}