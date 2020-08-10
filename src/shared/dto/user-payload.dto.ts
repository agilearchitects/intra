// Libs
import { UserPayloadDTO as BaseUserPayloadDTO } from "@agilearchitects/authenticaton";
import { jsonType } from "@agilearchitects/server";

// DTO's
import { ClaimPayloadDTO } from "./claim-payload.dto";
import { IDictionaryDTO } from "./dictionary.dto";
import { DTO } from "./dto";
import { GroupPayloadDTO } from "./group-payload.dto";

export class UserPayloadDTO extends BaseUserPayloadDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): UserPayloadDTO {
    if (
      typeof object.id !== "number" ||
      typeof object.email !== "string" ||
      (object.claims !== undefined && !(object.claims instanceof Array)) ||
      (object.groups !== undefined && !(object.groups instanceof Array))
    ) {
      throw new Error("Unable to parse");
    }
    return new UserPayloadDTO(
      object.id,
      object.email,
      object.claims !== undefined ? DTO.parseArrayToDictionary(object.claims).map((claim: IDictionaryDTO<jsonType>) => ClaimPayloadDTO.parseFromRequest(claim)) : undefined,
      object.groups !== undefined ? DTO.parseArrayToDictionary(object.groups).map((group: IDictionaryDTO<jsonType>) => GroupPayloadDTO.parseFromRequest(group)) : undefined,
    );
  }
}