// Libs
import { AuthService, ILoginDTO, ILoginPayloadDTO, UserService } from "@agilearchitects/authenticaton";
import { HashtiService } from "@agilearchitects/hashti";
import { RequestHandler } from "express";

// DTO's
import { IAuthResponseJSON } from "../../shared/dto/auth-response.dto";
import { ICreateUserJSON } from "../../shared/dto/create-user.dto";

// Services
import {
  authService as authServiceInstance,
  hashtiService as hashtiServiceInstance,
  userService as userServiceInstance,
} from "../../bootstrap";

// Middleware
import { middleware, middlewares } from "../middlewares";
import ValidationModule from "../modules/validation.module";

// Entites
import { UserEntity } from "../entities/user.entity";

// Models
import { controller, ControllerHandler } from "../modules/controller-handler.module";

// Base controller
import { Controller } from "./controller";

export class AuthController extends Controller {
  public constructor(
    private readonly authService: AuthService = authServiceInstance,
    private readonly userService: UserService<UserEntity> = userServiceInstance,
    private readonly hashtiService: HashtiService = hashtiServiceInstance,
  ) { super(); }

  // Protect controller with validation middleware. Validating email and password
  @middleware(middlewares.validation({ email: [ValidationModule.required, ValidationModule.email], password: ValidationModule.required }))
  /**
   * Login controller. Attemps login using the authservice, providing email and password from request body
   */
  public login(): RequestHandler {
    return controller(async (handler) => {
      try {
        const data = handler.body<ILoginDTO>();
        const loginPayload: ILoginPayloadDTO = await this.authService.login(data);
        handler.response<IAuthResponseJSON>().json(loginPayload);
      } catch (error) {
        this.logError(handler.response(), "Error logging in", error);
        throw error;

      }
    });
  }

  public create(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const data = handler.body<ICreateUserJSON>();
        data.password = this.hashtiService.create(data.password);
        await this.userService.create(data.email, data.password, true, false);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler.response(), "Error creating user", error);
        throw error;
      }
    });
  }
}

const authController: AuthController = new AuthController();
export default authController;
