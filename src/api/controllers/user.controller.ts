// Libs
import { UserPayloadDTO } from "@agilearchitects/authenticaton";
import { handlerMethod, HandlerModule } from "@agilearchitects/server";

// Entities
import { UserEntity } from "../../shared/entities/user.entity";

// Base controller
import { Controller } from "./controller";

export class UserController extends Controller {
  public index(): handlerMethod {
    return async (handler: HandlerModule) => {
      const users = await UserEntity.find({ where: UserEntity.activeWhere() });
      handler.sendJSON(
        users.map((user: UserEntity) =>
          UserPayloadDTO.parse({
            id: user.id,
            email: user.email,
          }).serialize(),
        ),
      );
    };
  }
}

const userController: UserController = new UserController();
export default userController;
