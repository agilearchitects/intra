// Libs
import {
  AuthService,
  UserPayloadDTO,
  UserService,
} from "@agilearchitects/authenticaton";
import { LogModule } from "@agilearchitects/logmodule";

// Services
import {
  authService as authServiceInstance,
  envService as envServiceInstance,
  userService as userServiceInstance,
} from "./bootstrap";

// Entites
import { UserEntity } from "../shared/entities/user.entity";

// Modules
import { handlerMethod, HandlerModule } from "./modules/handler.module";

export class Middlewares {
  public constructor(
    private readonly log: LogModule
  ) { }
  public auth(
    checkOnly: boolean = false,
    authService: AuthService = authServiceInstance,
  ): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        // Check for authorization header
        const authorizationHeader: string | string[] | undefined = handler.request.getHeader("authorization");
        if (authorizationHeader !== undefined && typeof authorizationHeader === "string") {
          const token = authorizationHeader.substr(7);
          const user = await authService.auth(token);
          handler.request.user = UserPayloadDTO.parse({
            id: user.id,
            email: user.email,
            claims: user.claims,
            groups: user.groups,
          });
          handler.next();
        } else if (checkOnly) {
          handler.next();
        } else {
          handler.sendStatus(401);
        }
      } catch (error) {
        this.logError(handler, "auth middleware failed", error);
        throw error;
      }
    };
  }

  public userByEmail(
    userService: UserService<UserEntity> = userServiceInstance,
  ): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        const user = await userService.get(handler.request.query.email.toString());
        if (user !== undefined) {
          handler.request.user = UserPayloadDTO.parse({
            id: user.id,
            email: user.email,
            claims: user.claims,
            groups: user.groups,
          });
          handler.next();
        } else {
          handler.sendStatus(401);
        }
      } catch (error) {
        this.logError(handler, "User by email middleware failed");
        throw error;
      }
    };
  }

  public guest(): handlerMethod {
    return (handler: HandlerModule) => {
      try {
        if (handler.request.getHeader("authorization") === undefined) {
          handler.next();
        } else {
          handler.sendStatus(400);
        }
      } catch (error) {
        this.logError(handler, "Guest middleware failed", error);
      }
    };
  }

  public token(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        const token = envServiceInstance.get("TOKEN", Math.random().toString());
        if (handler.request.query.token.toString() === token) {
          handler.next();
        } else {
          handler.sendStatus(401);
        }
      } catch (error) {
        this.logError(
          handler,
          "Token middleware validation failed",
          { headers: handler.request.headers },
        );
        throw error;
      }
    };
  }

  public reCaptchaToken(): handlerMethod {
    return async (handler: HandlerModule) => {
      handler.next();
      /*try {
        const token = handler.request.headers.recaptcha;
        await Axios.post("https://www.google.com/recaptcha/api/siteverify", {
          secret: envServiceInstance.get("GOOGLE_RECAPTCHA_SECRET", ""),
          response: token,
          remoteip: handler.request.remoteIp,
        });
        handler.next();
      } catch (error) {
        this.logError(handler, "ReCaptcha middleware failed", {
          ip: handler.request.remoteIp,
          headers: handler.request.headers,
        });
        throw error;
      }*/
    };
  }

  private logError(
    handler: HandlerModule,
    message: string,
    error?: any,
    code: number = 500,
  ): void {
    this.log.error({
      message,
      ...(error !== undefined ? { error: JSON.stringify(error) } : undefined),
      code,
    },
    );
    handler.sendStatus(code);
  }
}
