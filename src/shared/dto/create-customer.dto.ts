import { jsonType } from "@agilearchitects/server";
import { IDictionaryDTO } from "./dictionary.dto";
import { DTO } from "./dto";

export interface ICreateCustomerDTO {
  name: string;
}

export class CreateCustomerDTO implements ICreateCustomerDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): CreateCustomerDTO {
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
