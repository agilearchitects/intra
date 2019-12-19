// Libs
import {
  AuthService,
  UserPayloadDTO,
  UserService,
} from "@agilearchitects/authenticaton";
import { LogModule } from "@agilearchitects/logmodule";
import Axios from "axios";
import { RequestHandler, Response } from "express";

// Services
import {
  authService as authServiceInstance,
  envService as envServiceInstance,
  userService as userServiceInstance,
} from "./bootstrap";

// Entites
import { UserEntity } from "./entities/user.entity";

// Modules
import {
  controller,
  ControllerHandler,
} from "./modules/controller-handler.module";
import ValidationErrorModule from "./modules/validation-error.module";
import { IValidationInput, validate } from "./modules/validation.module";

// Add User to express request interface
declare global {
  namespace Express {
    interface Request {
      // tslint:disable-line:interface-name
      user: UserPayloadDTO;
    }
  }
}

export const middleware = (middlewares: RequestHandler | RequestHandler[]) => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): void => {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    if (!(middlewares instanceof Array)) {
      middlewares = [middlewares];
    }
    return [...middlewares, originalMethod.apply(this, ...args)];
  };
};

export class Middlewares {
  public constructor(private log: LogModule = new LogModule("middleware")) { }
  public auth(
    checkOnly: boolean = false,
    authService: AuthService = authServiceInstance,
  ): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        // Check for authorization header
        if (handler.request.headers.authorization) {
          const token = (handler.request.headers
            .authorization as string).substr(7);
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
        this.logError(handler.response(), "auth middleware failed", error);
        throw error;
      }
    });
  }

  public userByEmail(
    userService: UserService<UserEntity> = userServiceInstance,
  ): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const query = handler.query<{ email: string }>();
        const user = await userService.getUserByEmail(query.email, null, null);
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
        this.logError(handler.response(), "User by email middleware failed");
        throw error;
      }
    });
  }

  public guest(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        if (
          handler.request.headers !== undefined &&
          handler.request.headers.authorization === undefined
        ) {
          handler.next();
        } else {
          handler.sendStatus(400);
        }
      } catch (error) {
        this.logError(handler.response(), "Guest middleware failed", error);
      }
    });
  }

  public validation(validation: IValidationInput): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      const getAsObject = (
        validation: IValidationInput,
        requestData: any,
      ): any => {
        return Object.assign(
          {},
          ...Object.keys(validation).map((key: string) => {
            const returnValue: { [key: string]: any } = {};
            const temp = validation[key];
            const scopedRequestData: any =
              requestData !== undefined && requestData[key] !== undefined
                ? requestData[key]
                : undefined;
            if (!(temp instanceof Array) && typeof temp !== "function") {
              returnValue[key] = getAsObject(
                temp,
                requestData !== undefined && requestData[key] !== undefined
                  ? requestData[key]
                  : undefined,
              );
            } else {
              returnValue[key] = scopedRequestData;
            }
            return returnValue;
          }),
        );
      };
      const requestData =
        handler.request.method === "GET" ? handler.query() : handler.body();
      const data = getAsObject(validation, requestData);
      try {
        const result: boolean | ValidationErrorModule = await validate(
          data,
          validation,
          handler.request,
          handler.response(),
        );
        if (typeof result === "boolean") {
          if (result) {
            handler.next();
          } else {
            handler
              .response()
              .status(400)
              .json({ message: "Validation failed" });
          }
        } else {
          handler
            .response()
            .status(400)
            .json({ validationError: result });
        }
      } catch (error) {
        this.log.error("Validation error", { error: JSON.stringify(error) });
        handler.sendStatus(500);
      }
    });
  }

  public token(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const token = envServiceInstance.get("TOKEN", "");
        const query = handler.query<{ token: string }>();
        if (token !== "" && query.token && query.token === token) {
          handler.next();
        } else {
          handler.sendStatus(401);
        }
      } catch (error) {
        this.logError(
          handler.response(),
          "Token middleware validation failed",
          { ip: handler.request.ip, headers: handler.request.headers },
        );
        throw error;
      }
    });
  }

  public reCaptchaToken(): RequestHandler {
    return controller(async (handler: ControllerHandler) => {
      try {
        const token = handler.request.headers.recaptcha;
        await Axios.post("https://www.google.com/recaptcha/api/siteverify", {
          secret: envServiceInstance.get("GOOGLE_RECAPTCHA_SECRET", ""),
          response: token,
          remoteip: handler.request.ip,
        });
        handler.next();
      } catch (error) {
        this.logError(handler.response(), "ReCaptcha middleware failed", {
          ip: handler.request.ip,
          headers: handler.request.headers,
        });
        throw error;
      }
    });
  }

  private logError(
    response: Response,
    message: string,
    error?: any,
    code: number = 500,
  ): void {
    this.log.error(
      message,
      ...(error !== undefined ? [{ error: JSON.stringify(error) }] : []),
    );
    response.sendStatus(code);
  }
}

export const middlewares = new Middlewares();
