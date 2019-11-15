import { IUserModel, UserService as BaseUserService } from "@agilearchitects/authenticaton";
import { BaseEntity } from "typeorm";

export interface IUser {
  id: string;
  email: string;
}

export class UserService<T extends IUserModel & BaseEntity> extends BaseUserService<T> {

}
