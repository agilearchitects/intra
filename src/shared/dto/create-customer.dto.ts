import DTO from "./dto";

export interface ICreateCustomer<A, B> {
  id: number;
  foo?: A;
  bar?: B[];
}

export interface ICreateCustomerDTO extends ICreateCustomer<ICreateCustomerDTO, ICreateCustomerDTO> { }
export interface ICreateCustomerJSON extends ICreateCustomer<ICreateCustomerJSON, ICreateCustomerJSON> { }

export class CreateCustomerDTO extends DTO<ICreateCustomerDTO> implements ICreateCustomerDTO {
  public static parse(object: ICreateCustomerJSON): CreateCustomerDTO {
    return new CreateCustomerDTO({
      id: object.id,
      ...(object.foo ? { foo: CreateCustomerDTO.parse(object.foo) } : null),
      ...(object.bar ? { projects: object.bar.map((bar: ICreateCustomerJSON) => CreateCustomerDTO.parse(bar)) } : null),
    });
  }
  public id!: number;
  public foo?: CreateCustomerDTO;
  public bar?: CreateCustomerDTO[];

  public serialize(): ICreateCustomerJSON {
    return {
      id: this.id,
      ...(this.foo ? { foo: this.foo.serialize() } : null),
      ...(this.bar ? { bar: this.bar.map((foo: CreateCustomerDTO) => foo.serialize()) } : null),
    };
  }
}
