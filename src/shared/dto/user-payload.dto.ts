import { UserPayloadDTO as BaseUserPayloadDTO } from "@agilearchitects/authenticaton";
import { bodyType, jsonType } from "@agilearchitects/server";

import { ClaimPayloadDTO } from "./claim-payload.dto";
import { DTO } from "./dto";

export class UserPayloadDTO extends BaseUserPayloadDTO {
  public static parseFromRequest(object: bodyType): UserPayloadDTO {
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
      object.claims !== undefined ? (object.claims as jsonType[]).map((claim: jsonType) => ClaimPayloadDTO.parseRequestBody(claim)) : undefined,
    );
  }
}