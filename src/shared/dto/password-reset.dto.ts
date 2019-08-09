import DTO from "./dto";

export interface IPasswordReset {
  email: string;
}

export interface IPasswordResetDTO extends IPasswordReset { }
export interface IPasswordResetJSON extends IPasswordReset { }

export class PasswordResetDTO extends DTO<IPasswordResetDTO> implements IPasswordResetDTO {
  public static parse(object: IPasswordResetJSON): PasswordResetDTO {
    return new PasswordResetDTO({
      email: object.email,
    });
  }
  public email!: string;

  public serialize(): IPasswordResetJSON {
    return {
      email: this.email,
    };
  }
}
