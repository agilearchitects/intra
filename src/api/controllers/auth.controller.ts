// Libs
import { RequestHandler } from "express";
import { ServiceModule } from "simplyserveme";

// DTO's
import { IAuthResponseJSON } from "../../shared/dto/auth-response.dto";
import { ICreateUserJSON } from "../../shared/dto/create-user.dto";
import { ILoginJSON } from "../../shared/dto/login.dto";
import { UserDTO } from "../../shared/dto/user.dto";

// Middleware
import { middleware, middlewares } from "../middlewares";
import ValidationModule from "../modules/validation.module";

// Models
import { IAttemptResult, UserEntity } from "../entities/user.entity";
import { controller } from "./controller";

export class AuthController extends ServiceModule {
  // Protect controller with validation middleware. Validating email and password
  @middleware(middlewares.validation({ email: [ValidationModule.required, ValidationModule.email], password: ValidationModule.required }))
  /**
   * Login controller. Attemps login using the authservice, providing email and password from request body
   */
  public login(): RequestHandler {
    return controller((handler) => {
      const data = handler.body<ILoginJSON>();
      UserEntity.attempt(data.email, data.password).then((result: IAttemptResult) => handler.response<IAuthResponseJSON>().json({
        token: result.token,
        user: UserDTO.parse({ id: result.user.id, email: result.user.email }).serialize(),
      })).catch((error: any) => handler.error(500));
    });
  }

  public create(): RequestHandler {
    return controller((handler) => {
      const data = handler.body<ICreateUserJSON>();
      UserEntity.create(data).save().then(() => {
        handler.response().send("User Created!");
      }).catch((error: any) => handler.error(500));
    });
  }
}

const authController: AuthController = AuthController.getInstance<AuthController>();
export default authController;