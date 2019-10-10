export interface IPasswordResetDTO {
  email: string;
}

export class PasswordResetDTO implements IPasswordResetDTO {
  public static parse(object: IPasswordResetDTO): PasswordResetDTO {
    return new PasswordResetDTO(
      object.email,
    );
  }

  public constructor(
    public readonly email: string,
  ) { }

  public serialize(): IPasswordResetDTO {
    return {
      email: this.email,
    };
  }
}
