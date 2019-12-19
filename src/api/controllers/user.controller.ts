// Libs
import {
  IUserPayloadDTO,
  UserPayloadDTO
} from "@agilearchitects/authenticaton";
import { RequestHandler } from "express";

// Entities
import { UserEntity } from "../entities/user.entity";

// Modules
import {
  controller,
  ControllerHandler
} from "../modules/controller-handler.module";

// Base controller
import { Controller } from "./controller";

export class UserController extends Controller {
  public index(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      const users = await UserEntity.find({ where: UserEntity.activeWhere() });
      handler.response<IUserPayloadDTO[]>().json(
        users.map((user: UserEntity) =>
          UserPayloadDTO.parse({
            id: user.id,
            email: user.email
          }).serialize()
        )
      );
    });
  }
}

const userController: UserController = new UserController();
export default userController;
