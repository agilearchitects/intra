import { UserPayloadDTO as BaseUserPayloadDTO } from "@agilearchitects/authenticaton";
import { jsonType } from "@agilearchitects/server";

// DTO's
import { ClaimPayloadDTO } from "./claim-payload.dto";
import { DTO } from "./dto";
import { GroupPayloadDTO } from "./group-payload.dto";

export class UserPayloadDTO extends BaseUserPayloadDTO {
  public static parseFromRequest(object: jsonType): UserPayloadDTO {
    object = DTO.parseFromRequest(object);
    if (
      typeof object.id !== "number" ||
      typeof object.email !== "string" ||
      (object.claims !== undefined &&
        !(object.claims instanceof Array)) ||
      (object.groups !== undefined &&
        !(object.groups instanceof Array))
    ) {
      throw new Error("Unable to parse");
    }
    return new UserPayloadDTO(
      object.id,
      object.email,
      object.claims !== undefined ? (object.claims as jsonType[]).map((claim: jsonType) => ClaimPayloadDTO.parseFromRequest(claim)) : undefined,
      object.groups !== undefined ? (object.groups as jsonType[]).map((group: jsonType) => GroupPayloadDTO.parseFromRequest(group)) : undefined,
    );
  }
}