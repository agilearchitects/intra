// Libs
import { ILoginDTO as IBaseLoginDTO, LoginDTO as BaseLoginDTO } from "@agilearchitects/authenticaton";
import { jsonType } from "@agilearchitects/server";

// DTO's
import { IDictionaryDTO } from "./dictionary.dto";

// My cool interface
export interface ILoginDTO extends IBaseLoginDTO {
  // This is an email
  email: string;
  // This is a password
  password: string;
  // Should password be remembered or not
  remember?: boolean;
}

export class LoginDTO extends BaseLoginDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): LoginDTO {
    if (
      typeof object.email !== "string" ||
      typeof object.password !== "string" ||
      (object.remember !== undefined && typeof object.remember !== "boolean")
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