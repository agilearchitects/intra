// Libs
import { AuthService } from "@agilearchitects/authenticaton";
import { LogModule } from "@agilearchitects/logmodule";
import { handlerMethod, HandlerModule } from "@agilearchitects/server";

// Services
import { GoogleService } from "../services/google.service";

// DTO's
import { UserPayloadDTO } from "../../shared/dto/user-payload.dto";

// Base controller
import { Controller } from "./controller";

export class MiddlewareController extends Controller {
  public constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService,
    private readonly simpleToken: string,
    private readonly userPayloadDTO: typeof UserPayloadDTO,
    log: LogModule,
    private readonly debug?: true,
  ) { super(log); }

  /**
   * Authentication middleware. Checks for authorization header
   * and get's user using token. Middleware can be used to only
   * check for authenticated user but not stop the handler queue
   * @param checkOnly Will only check for authentication and not
   * stop handler queue if failed
   * @param userPayloadDTO DTO for storing user data in request
   * container
   */
  public auth(checkOnly: boolean = false): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        // Check for authorization header
        const authorizationHeader: string | string[] | undefined = handler.request.getHeader("authorization");
        if (authorizationHeader !== undefined && typeof authorizationHeader === "string") {
          try {
            // Get token from authorization header
            const token = authorizationHeader.substr(7);
            // Try to get user using token
            const user = await this.authService.auth(token);
            // Set user to request container
            handler.request.setContainerValue("user", this.userPayloadDTO.parse({
              id: user.id,
              email: user.email,
              claims: user.claims,
              groups: user.groups,
            }));
            // Continue to next handler
            handler.next();
          } catch (error) {
            // Error getting user
            if (checkOnly) {
              /* Set to only check for authentication will
              continue to next handler*/
              handler.next();
            } else {
              /* Authentication failed and stops handler,
              sending 401*/
              handler.sendStatus(401);
            }

          }
        } else if (checkOnly) {
          /* Authorization header is missing from request but is
          set to only check. Therefore send to next handler*/
          handler.next();
        } else {
          /* Authorization header is missing. Therefor it faild
          and status 401 is sent*/
          handler.sendStatus(401, "Authorization header is missing from request");
        }
      } catch (error) {
        this.logError(handler, "auth middleware failed");
        throw error;
      }
    };
  }

  /**
   * Simple authentication with token. simpleToken
   * will be compared with token in request query.
   * If the same handler queue will continue
   */
  public token(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        if (handler.request.query.token.toString() === this.simpleToken) {
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

  /**
   * Google reCaptcha middleware. Uses googleService and
   * token from request to verify
   */
  public reCaptchaToken(): handlerMethod {
    return async (handler: HandlerModule) => {
      // Skip if debug
      if (this.debug === true) { handler.next(); return; }

      try {
        const token = handler.request.headers.recaptcha;
        const remoteIp = handler.request.remoteIp;
        if (typeof token !== "string" || remoteIp === undefined) {
          throw new Error();
        }
        this.googleService.verifyRecaptchaToken(token, remoteIp);
        handler.next();
      } catch (error) {
        this.logError(handler, "ReCaptcha middleware failed", {
          ip: handler.request.remoteIp,
          headers: handler.request.headers,
        });
        throw error;
      }
    };
  }

  public recaptchaOrToken(): handlerMethod {
    return async (handler: HandlerModule) => {
      handler.request.query.token.toString()
    }
  }
}