import { LoginDTO as BaseLoginDTO } from "@agilearchitects/authenticaton";
import { jsonType } from "@agilearchitects/server";

import { DTO } from "./dto";


export class LoginDTO extends BaseLoginDTO {
  public static parseFromRequest(object: jsonType) {
    object = DTO.parseFromRequest(object);
    if (
      typeof object.email !== "string" ||
      typeof object.password !== "string" ||
      (object.remember !== undefined &&
        typeof object.remember !== "boolean")
    ) {
      throw new Error("Unable to parse");
    }
    return new LoginDTO(
      object.email,
      object.password,
      object.remember,
    );
  }
}