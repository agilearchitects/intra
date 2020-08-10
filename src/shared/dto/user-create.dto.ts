// Libs
import { jsonType } from "@agilearchitects/server";

import { IDictionaryDTO } from "./dictionary.dto";
import { DTO } from "./dto";
import { GroupCreateDTO, IGroupCreateDTO } from "./group-create.dto";

export interface IUserCreateDTO {
  email: string;
  password: string;
  claims?: string[];
  groups?: IGroupCreateDTO[];
}

export class UserCreateDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): IUserCreateDTO {
    if (
      typeof object.email !== "string" ||
      typeof object.password !== "string" ||
      (object.claims !== undefined && !(object.claims instanceof Array)) ||
      (object.groups !== undefined && !(object.groups instanceof Array))
    ) {
      throw new Error("Unable to parse");
    }
    return new UserCreateDTO(
      object.email,
      object.password,
      object.claims !== undefined ? object.claims.map((claim: jsonType) => {
        if (typeof claim !== "string") {
          throw new Error("Unable to parse");
        }
        return claim;
      }) : undefined,
      object.groups !== undefined ? DTO.parseArrayToDictionary(object.groups).map((group: IDictionaryDTO<jsonType>) => GroupCreateDTO.parseFromRequest(group)) : undefined,
    );
  }
  public static parse(object: IUserCreateDTO): IUserCreateDTO {
    return new UserCreateDTO(
      object.email,
      object.password,
      object.claims,
      object.groups !== undefined ? object.groups.map((group: IGroupCreateDTO) => GroupCreateDTO.parse(group)) : undefined,

    );
  }

  public constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly claims?: string[],
    public readonly groups?: GroupCreateDTO[],
  ) { }

  public serialize(): IUserCreateDTO {
    return {
      email: this.email,
      password: this.password,
    };
  }
}
