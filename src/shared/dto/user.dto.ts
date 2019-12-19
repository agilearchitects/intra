export interface IUserDTO {
  id: number;
  email: string;
}

export class UserDTO implements IUserDTO {
  public static parse(object: IUserDTO): UserDTO {
    return new UserDTO(
      object.id,
      object.email,
    );
  }

  public constructor(
    public readonly id: number,
    public readonly email: string,
  ) { }

  public serialize(): IUserDTO {
    return {
      id: this.id,
      email: this.email,
    };
  }
}
