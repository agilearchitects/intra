// Libs
import { jsonType } from "@agilearchitects/server";

// DTO's
import { IDictionaryDTO } from "./dictionary.dto";

export interface IGoogleCodeDTO {
  code: string;
}

export class GoogleCodeDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): GoogleCodeDTO {
    if (
      typeof object.code !== "string"
    ) {
      throw new Error("Unable to parse");
    }

    return GoogleCodeDTO.parse({
      code: object.code,
    });
  }

  public static parse(object: IGoogleCodeDTO): GoogleCodeDTO {
    return new this(
      object.code,
    );
  }

  public constructor(
    public readonly code: string,
  ) { }

  public serialize(): IGoogleCodeDTO {
    return {
      code: this.code,
    };
  }
}