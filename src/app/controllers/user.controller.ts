// Libs
import { UserEntity, UserService } from "@agilearchitects/authenticaton";
import { LogModule } from "@agilearchitects/logmodule";
import { handlerMethod, HandlerModule } from "@agilearchitects/server";

// Base controller
import { UserDTO } from "../../shared/dto/user.dto";
import { Controller } from "./controller";

export class UserController extends Controller {
  public constructor(
    private readonly userService: UserService<UserEntity>,
    log: LogModule,
  ) { super(log); }
  public index(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        handler.sendJSON((await this.userService.all()).map((user: UserEntity) => this.parse(user)));
      } catch (error) {
        this.logError(handler, "Index error", error);
        throw error;
      }
    }
  }

  private parse(user: UserEntity): UserDTO {
    return UserDTO.parse({
      id: user.id,
      email: user.email,
    })
  }
}