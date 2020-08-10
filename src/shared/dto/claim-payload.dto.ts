// Libs
import { ClaimPayloadDTO as BaseClaimPayloadDTO } from "@agilearchitects/authenticaton";
import { jsonType } from "@agilearchitects/server";

// DTO's
import { IDictionaryDTO } from "./dictionary.dto";
import { DTO } from "./dto";
import { GroupPayloadDTO } from "./group-payload.dto";
import { UserPayloadDTO } from "./user-payload.dto";

export class ClaimPayloadDTO extends BaseClaimPayloadDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): ClaimPayloadDTO {
    if (
      typeof object.id !== "number" ||
      typeof object.name !== "string" ||
      (object.users !== undefined && !(object.users instanceof Array)) ||
      (object.groups !== undefined && !(object.groups instanceof Array))
    ) {
      throw new Error("Unable to parse");
    }

    return new ClaimPayloadDTO(
      object.id,
      object.name,
      object.users !== undefined ? DTO.parseArrayToDictionary(object.users).map((user: IDictionaryDTO<jsonType>) => UserPayloadDTO.parseFromRequest(user)) : undefined,
      object.groups !== undefined ? DTO.parseArrayToDictionary(object.groups).map((group: IDictionaryDTO<jsonType>) => GroupPayloadDTO.parseFromRequest(group)) : undefined,
    )
  }
}