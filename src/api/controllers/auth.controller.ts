// Libs
import { AuthService, ILoginPayloadDTO, UserService } from "@agilearchitects/authenticaton";
import { HashtiService } from "@agilearchitects/hashti";
import { LogModule } from "@agilearchitects/logmodule";
import { handlerMethod, HandlerModule, parse } from "@agilearchitects/server";


// DTO's
import { CreateUserDTO } from "../../shared/dto/create-user.dto";
import { LoginDTO } from "../../shared/dto/login.dto";

// Entites
import { UserEntity } from "../../shared/entities/user.entity";

// Base controller
import { Controller } from "./controller";

export class AuthController extends Controller {
  public constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService<UserEntity>,
    private readonly hashtiService: HashtiService,
    log: LogModule,
  ) { super(log); }

  // Protect controller with validation middleware. Validating email and password
  @parse(LoginDTO.parseFromRequest, "body")
  // Parse login form
  /**
   * Login controller. Attemps login using the authservice, providing email and password from request body
   */
  public login(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        const loginPayload: ILoginPayloadDTO = await this.authService.login(handler.request.body);
        handler.sendJSON(loginPayload);
      } catch (error) {
        this.logError(handler, "Error logging in", error);
        throw error;
      }
    };
  }

  @parse(CreateUserDTO.parseFromRequest, "body")
  public create(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        const body = { ...handler.request.body };
        body.password = this.hashtiService.create(body.password);
        try {
          await this.userService.resetPassword(body.email, body.password);
        } catch {
          await this.userService.create(body.email, body.password, true, false);
        }
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error creating user", error);
        throw error;
      }
    };
  }
}
