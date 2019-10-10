export interface ICreateProjectDTO {
  name: string;
  customerId: number;
}

export class CreateProjectDTO implements ICreateProjectDTO {
  public static parse(object: ICreateProjectDTO): CreateProjectDTO {
    return new CreateProjectDTO(
      object.name,
      object.customerId,
    );
  }

  public constructor(
    public readonly name: string,
    public readonly customerId: number,
  ) { }

  public serialize(): ICreateProjectDTO {
    return {
      name: this.name,
      customerId: this.customerId,
    };
  }
}
