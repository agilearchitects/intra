// Libs
import { JWTService } from "@agilearchitects/jwt";
import { MailingunService } from "@agilearchitects/mailingun";
import { TemplateService } from "@agilearchitects/templategenerator";
import { RequestHandler } from "express";
import moment from "moment";

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
import { controller, controllerError } from "./controller";

import { dpService } from "@agilearchitects/tdi";
import { TokenEntity } from "../entities/token.entity";
import { LogModule } from "../modules/log.module";
import { configService } from "../services/config.service";

const LOG = new LogModule("controller.auth");

export class AuthController {
  public constructor(
    private readonly jwtService: JWTService = dpService.container("service.jwt"),
    private readonly mailingunService: MailingunService = dpService.container("service.mailingun"),
    private readonly templateService: TemplateService = dpService.container("service.template"),
  ) { }

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
      })).catch((error: any) => controllerError(LOG, handler.response(), "Error logging in", error));
    });
  }

  public refreshToken(): RequestHandler {
    return controller((handler) => {
      //
    });
  }

  public requestPasswordReset(): RequestHandler {
    return controller((handler) => {
      // Creates token
      const token = this.jwtService.sign({ userId: handler.request.user.id }, { expiresIn: "24 hours" });

      // Add token to DB
      TokenEntity.create({
        token, type: "password_reset",
        expires: moment(this.jwtService.decode(token).exp, "X").toDate(),
      }).save().then(async (token: TokenEntity) => {
        const email = await this.templateService.email(
          "password-reset",
          {
            link: `https://${configService.get("SPA_HOST")}/password_reset?token=${token}`,
          });
        this.mailingunService.send(
          configService.get("NOREPLY_EMAIL"),
          handler.request.user.email,
          email.subject,
          email.message,
        ).then(() => {
          handler.sendStatus(200);
        }).catch(() => handler.sendStatus(500));
      });
    });
  }

  public resetPassword(): RequestHandler {
    return controller((handler) => {
      //
    });
  }

  public create(): RequestHandler {
    return controller((handler) => {
      const data = handler.body<ICreateUserJSON>();
      UserEntity.create(data).save().then(() => {
        handler.response().send("User Created!");
      }).catch((error: any) => controllerError(LOG, handler.response(), "Error creating user", error));
    });
  }
}

const authController: AuthController = new AuthController();
export default authController;
