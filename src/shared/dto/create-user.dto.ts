import DTO from "./dto";

export interface ICreateUser {
  email: string;
  password: string;
}
export interface ICreateUserDTO extends ICreateUser { } // tslint:disable-line:no-empty-interface
export interface ICreateUserJSON extends ICreateUser { } // tslint:disable-line:no-empty-interface

export class CreateUserDTO extends DTO<ICreateUserDTO> implements ICreateUserDTO {

  public static parse(object: ICreateUserJSON): CreateUserDTO {
    return new CreateUserDTO({
      email: object.email,
      password: object.password,
    });
  }

  public email!: string;
  public password!: string;

  public serialize(): ICreateUserJSON {
    return {
      email: this.email,
      password: this.password,
    };
  }
}
