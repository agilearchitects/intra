import { jsonType } from "@agilearchitects/server";

import { DTO } from "./dto";

export interface ICreateUserDTO {
  email: string;
  password: string;
}

export class CreateUserDTO implements ICreateUserDTO {
  public static parseFromRequest(object: jsonType): CreateUserDTO {
    object = DTO.parseFromRequest(object);
    if (typeof object.email !== "string" ||
      typeof object.password !== "string") {
      throw new Error("Unable to parse");
    }
    return new CreateUserDTO(
      object.email,
      object.password,
    );
  }
  public static parse(object: ICreateUserDTO): CreateUserDTO {
    return new CreateUserDTO(
      object.email,
      object.password,
    );
  }

  public constructor(
    public readonly email: string,
    public readonly password: string,
  ) { }

  public serialize(): ICreateUserDTO {
    return {
      email: this.email,
      password: this.password,
    };
  }
}
