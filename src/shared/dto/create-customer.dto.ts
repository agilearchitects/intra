import { bodyType } from "@agilearchitects/server";
import { DTO } from "./dto";

export interface ICreateCustomerDTO {
  name: string;
}

export class CreateCustomerDTO implements ICreateCustomerDTO {
  public static parseFromRequest(object: bodyType): CreateCustomerDTO {
    object = DTO.parseFromRequest(object);
    if (typeof object.name !== "string") {
      throw new Error("Unable to parse");
    }
    return new CreateCustomerDTO(
      object.name
    );
  }
  public static parse(object: ICreateCustomerDTO): CreateCustomerDTO {
    return new CreateCustomerDTO(
      object.name,
    );
  }
  public constructor(
    public readonly name: string,
  ) { }

  public serialize(): ICreateCustomerDTO {
    return {
      name: this.name,
    };
  }
}
