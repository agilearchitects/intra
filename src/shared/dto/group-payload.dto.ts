import { GroupPayloadDTO as BaseGroupPayloadDTO } from "@agilearchitects/authenticaton";
import { jsonType } from "@agilearchitects/server";
import { ClaimPayloadDTO } from "./claim-payload.dto";
import { DTO } from "./dto";

export class GroupPayloadDTO extends BaseGroupPayloadDTO {
  public static parseFromRequest(object: jsonType): GroupPayloadDTO {
    object = DTO.parseFromRequest(object);
    if (typeof object.id !== "number" ||
      typeof object.name !== "string" ||
      (object.claims !== undefined &&
        !(object.claims instanceof Array))) {
      throw new Error("Unable to parse");
    }

    return new GroupPayloadDTO(
      object.id,
      object.name,
      object.claims !== undefined ? (object.claims as jsonType[]).map((claim: jsonType) => ClaimPayloadDTO.parseRequestBody(claim)) : undefined
    );
  }
}