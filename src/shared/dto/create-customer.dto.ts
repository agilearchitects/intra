import DTO from "./dto";

export interface ICreateCustomer {
  name: string
}

export interface ICreateCustomerDTO extends ICreateCustomer { }
export interface ICreateCustomerJSON extends ICreateCustomer { }

export class CreateCustomerDTO extends DTO<ICreateCustomerDTO> implements ICreateCustomerDTO {
  public static parse(object: ICreateCustomerJSON): CreateCustomerDTO {
    return new CreateCustomerDTO({
      name: object.name,
    });
  }
  public name!: string;

  public serialize(): ICreateCustomerJSON {
    return {
      name: this.name,
    };
  }
}
