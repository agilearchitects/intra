// Libs
import { jsonType } from "@agilearchitects/server";

// DTO's
import { IDictionaryDTO } from "./dictionary.dto";

export interface IGroupCreateDTO {
  name: string;
  claims?: string[];
}

export class GroupCreateDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): GroupCreateDTO {
    if (
      typeof object.name !== "string" ||
      (object.claims !== undefined && !(object.claims instanceof Array))
    ) { throw new Error("Unable to parse"); }
    return new GroupCreateDTO(
      object.name,
      object.claims !== undefined ? object.claims.map((claim: jsonType) => {
        if (typeof claim !== "string") {
          throw new Error("Unable to parse");
        }
        return claim;
      }) : undefined,
    );
  }

  public static parse(groupCreate: IGroupCreateDTO): GroupCreateDTO {
    return new GroupCreateDTO(
      groupCreate.name,
      groupCreate.claims !== undefined ? [...groupCreate.claims] : undefined,
    );
  }

  public constructor(
    public readonly name: string,
    public readonly claims?: string[],
  ) { }

  public serialize(): IGroupCreateDTO {
    return {
      name: this.name,
      ...(this.claims !== undefined ? { claims: [...this.claims] } : undefined),
    };
  }
}