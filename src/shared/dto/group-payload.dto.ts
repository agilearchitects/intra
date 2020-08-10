// Libs
import { GroupPayloadDTO as BaseGroupPayloadDTO } from "@agilearchitects/authenticaton";
import { jsonType } from "@agilearchitects/server";

// DTO's
import { ClaimPayloadDTO } from "./claim-payload.dto";
import { IDictionaryDTO } from "./dictionary.dto";
import { DTO } from "./dto";

export class GroupPayloadDTO extends BaseGroupPayloadDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): GroupPayloadDTO {
    if (
      typeof object.id !== "number" ||
      typeof object.name !== "string" ||
      (
        object.claims !== undefined &&
        !(object.claims instanceof Array)
      )
    ) {
      throw new Error("Unable to parse");
    }

    return new GroupPayloadDTO(
      object.id,
      object.name,
      object.claims !== undefined ? DTO.parseArrayToDictionary(object.claims).map((claim: IDictionaryDTO<jsonType>) => ClaimPayloadDTO.parseFromRequest(claim)) : undefined
    );
  }
}