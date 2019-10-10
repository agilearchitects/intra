export interface ICreateCustomerDTO {
  name: string;
}

export class CreateCustomerDTO implements ICreateCustomerDTO {
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
