import DTO from "./dto";

export interface ICreateCustomer<A, B> {
  name: string
}

export interface ICreateCustomerDTO extends ICreateCustomer<ICreateCustomerDTO, ICreateCustomerDTO> { }
export interface ICreateCustomerJSON extends ICreateCustomer<ICreateCustomerJSON, ICreateCustomerJSON> { }

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
