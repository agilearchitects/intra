export interface ICreateUserDTO {
  email: string;
  password: string;
}

export class CreateUserDTO implements ICreateUserDTO {

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
