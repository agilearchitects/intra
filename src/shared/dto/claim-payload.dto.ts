import { ClaimPayloadDTO as BaseClaimPayloadDTO } from "@agilearchitects/authenticaton";
import { jsonType } from "@agilearchitects/server";
import { DTO } from "./dto";
import { GroupPayloadDTO } from "./group-payload.dto";
import { UserPayloadDTO } from "./user-payload.dto";

export class ClaimPayloadDTO extends BaseClaimPayloadDTO {
  public static parseRequestBody(object: jsonType): ClaimPayloadDTO {
    object = DTO.parseFromRequest(object);
    if (typeof object.id !== "number" ||
      typeof object.name !== "string" ||
      (object.users !== undefined && !(object.users instanceof Array)) ||
      (object.groups !== undefined && !(object.groups instanceof Array))) {
      throw new Error("Unable to parse");
    }
    return new ClaimPayloadDTO(
      object.id,
      object.name,
      object.users !== undefined ? (object.users as jsonType[]).map((user: jsonType) => UserPayloadDTO.parseFromRequest(user)) : undefined,
      object.groups !== undefined ? (object.groups as jsonType[]).map((group: jsonType) => GroupPayloadDTO.parseFromRequest(group)) : undefined,
    )
  }
}