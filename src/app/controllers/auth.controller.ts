// Libs
import { AuthService, LoginPayloadDTO, tokenType, UserService } from "@agilearchitects/authenticaton";
import { HashtiService } from "@agilearchitects/hashti";
import { LogModule } from "@agilearchitects/logmodule";
import { handlerMethod, HandlerModule, parse } from "@agilearchitects/server";

// Entities
import { UserEntity } from "../entities/user.entity";

// Services
import { GoogleService } from "../services/google.service";
import { MailService } from "../services/mail.service";

// DTO's
import { GoogleCodeDTO } from "../../shared/dto/google-code.dto";
import { GroupCreateDTO } from "../../shared/dto/group-create.dto";
import { LoginDTO } from "../../shared/dto/login.dto";
import { PasswordResetDTO } from "../../shared/dto/password-reset.dto";
import { ResetPasswordTokenResponseDTO } from "../../shared/dto/reset-password-token-response.dto";
import { ResetPasswordTokenDTO } from "../../shared/dto/reset-password-token.dto";
import { ResetPasswordDTO } from "../../shared/dto/reset-password.dto";
import { UserCreateDTO } from "../../shared/dto/user-create.dto";

// Base controller
import { Controller } from "./controller";

export class AuthController extends Controller {
  public constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService<UserEntity>,
    private readonly hashtiService: HashtiService,
    private readonly googleService: GoogleService,
    private readonly mailService: MailService,
    log: LogModule,
    private readonly debug?: true,
  ) { super(log); }

  /**
   * Login handler
   */
  @parse(LoginDTO.parseFromRequest, "json")
  public login(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        const body: LoginDTO = handler.request.body;
        const loginPayload: LoginPayloadDTO = await this.authService.login(body.serialize());
        handler.sendJSON(loginPayload.serialize());
      } catch (error) {
        this.logError(handler, "Error logging in", error);
        throw error;
      }
    };
  }

  /**
   * Handler for creating new user
   */
  @parse(UserCreateDTO.parseFromRequest, "json")
  public create(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        const user = handler.request.body as UserCreateDTO;
        // Create user with claims
        await this.userService.create(
          user.email, // User email
          this.hashtiService.create(user.password), // User password
          true, // User is activated
          false, // User is not banned
          user.claims, // Attach claims
          // Groups with claims
          user.groups !== undefined ? user.groups.map((group: GroupCreateDTO) => ({
            name: group.name,
            claims: group.claims !== undefined ? group.claims : []
          })) : []);

        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error creating user", error);
        throw error;
      }
    };
  }

  /**
   * Return Google oauth2 url. Used for initiating
   * Oauth2 flow
   */
  public getGoogleUrl(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        handler.sendJSON({ url: this.googleService.getAuthUrl() });
      } catch (error) {
        this.logError(handler, "Error getting Google Oauth URL", error);
        throw error;
      }
    }
  }

  /**
   * Sign in with Google using code. Token is generated using
   * the Google Oauth2 flow.
   */
  @parse(GoogleCodeDTO.parseFromRequest, "json")
  public loginWithGoogleCode(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        const body: GoogleCodeDTO = handler.request.body;
        // Get token using google code provided in request
        const token = await this.googleService.getToken(body.code);
        // Get google user info using token
        const userPayload = await this.googleService.getUserInfo(typeof token.access_token === "string" ? token.access_token : "");
        // Will throw error if users email is not verified (by google)
        if (userPayload.verified_email === false) { throw new Error(); }
        let user: UserEntity | undefined;
        try {
          // Get user
          user = await this.userService.get(userPayload.email);
          if (user.isBanned) {
            throw new Error("User is banned");
          }
        } catch {
          // User was not found. Will not throw error
        }
        // Try to create user
        if (user === undefined) {
          user = await this.userService.create(userPayload.email, "", true, false);
        }

        // Login user without password and send payload
        handler.sendJSON((await this.authService.loginWithoutPassword({ email: user.email })).serialize());
      } catch (error) {
        this.logError(handler, "Error signing in with Google", error);
        throw error;
      }
    }
  }

  /**
   * Handler for sending reset email when user wants to
   * reset their password
   */
  @parse(PasswordResetDTO.parseFromRequest, "json")
  public requestPasswordReset(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        const body: PasswordResetDTO = handler.request.body;
        // Send reset-password email with link containing reset token
        const token: string = await this.authService.requestResetPassword(body.email);

        if (this.debug === true) {
          // Get mail response and send
          handler.sendJSON((await this.mailService.send("reset-password", {
            fromEmail: this.mailService.defaultMailFrom,
            body: "",
          }, body.email, { token }, true)).serialize());
        } else {
          // Send mail
          await this.mailService.send("reset-password", {
            fromEmail: this.mailService.defaultMailFrom,
            body: "",
          }, body.email, { token });
          handler.sendStatus(200);
        }

      } catch (error) {
        this.logError(handler, "Error reseting password", error);
        throw error;
      }
    }
  }

  /**
   * Handler for validating password reset token. Use for
   * validating token in link sent to user when they try
   * to reset password
   */
  @parse(ResetPasswordTokenDTO.parseFromRequest, "json")
  public validateResetToken(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        const body: ResetPasswordTokenDTO = handler.request.body;
        handler.sendJSON(ResetPasswordTokenResponseDTO.parse({
          valid: await this.authService.verifyToken(body.token, tokenType.RESET),
        }).serialize());
      } catch (error) {
        this.logError(handler, "Error validating reset password token", error);
        throw error;
      }
    };
  }

  /**
   * Handler for reseting password. Password is reset
   * by providing token (sent to user's email when
   * requesting password reset) and a new password
   */
  @parse(ResetPasswordDTO.parseFromRequest, "json")
  public resetPassword(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        const body: ResetPasswordDTO = handler.request.body;
        // Resets password for user using token
        await this.authService.resetPassword(body.token, body.password);
        handler.sendStatus(200);
      } catch (error) {
        this.logError(handler, "Error reseting password", error);
        throw error;
      }
    };
  }
}
