// Libs
import { AuthService, ILoginPayloadDTO, UserService } from "@agilearchitects/authenticaton";
import { HashtiService } from "@agilearchitects/hashti";
import { handlerMethod, HandlerModule, parse } from "@agilearchitects/server";
import { validators } from "@agilearchitects/validation";

// DTO's
import { CreateUserDTO } from "../../shared/dto/create-user.dto";
import { LoginDTO } from "../../shared/dto/login.dto";

// Services
import {
  authService as authServiceInstance,
  hashtiService as hashtiServiceInstance,
  userService as userServiceInstance,
} from "../bootstrap";

// Entites
import { UserEntity } from "../../shared/entities/user.entity";

// Base controller
import { Controller } from "./controller";

import { validate } from "../bootstrap";

export class AuthController extends Controller {
  public constructor(
    private readonly authService: AuthService = authServiceInstance,
    private readonly userService: UserService<UserEntity> = userServiceInstance,
    private readonly hashtiService: HashtiService = hashtiServiceInstance,
  ) { super(); }

  // Protect controller with validation middleware. Validating email and password
  @parse(LoginDTO.parseFromRequest, "body")
  @validate({ email: [validators.required, validators.email], password: validators.required })
  // Parse login form
  /**
   * Login controller. Attemps login using the authservice, providing email and password from request body
   */
  public login(): handlerMethod {
    return async (handler: HandlerModule<LoginDTO>) => {
      try {
        const loginPayload: ILoginPayloadDTO = await this.authService.login(handler.parsedBody);
        handler.sendJSON(loginPayload);
      } catch (error) {
        this.logError(handler, "Error logging in", error);
        throw error;
      }
    };
  }

  @parse(CreateUserDTO.parseFromRequest, "body")
  public create(): handlerMethod {
    return async (handler: HandlerModule<CreateUserDTO>) => {
      try {
        const body = { ...handler.parsedBody };
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

const authController: AuthController = new AuthController();
export default authController;
