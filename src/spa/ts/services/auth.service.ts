// Libs
import { ILoginDTO, ILoginPayloadDTO, IUserPayloadDTO, LoginDTO } from "@agilearchitects/authenticaton";

// DTO's
import { IPasswordResetDTO, PasswordResetDTO } from "../../../shared/dto/password-reset.dto";
import { ResetPasswordTokenResponseDTO } from "../../../shared/dto/reset-password-token-response.dto";
import { IResetPasswordTokenDTO, ResetPasswordTokenDTO } from "../../../shared/dto/reset-password-token.dto";
import { IResetPasswordDTO, ResetPasswordDTO } from "../../../shared/dto/reset-password.dto";
import { UserPayloadDTO } from "../../../shared/dto/user-payload.dto";

// Services
import { runInThisContext } from "vm";
import { IDebugEmailDataDTO } from "../../../shared/dto/debug-email-data.dto";
import { APIService } from "../../../shared/services/api.service";
import { BroadcastService, ISubscription } from "./broadcast.service";
import { ErrorService } from "./error.service";
import { StorageService } from "./storage.service";

export type loginAction = (login: LoginDTO) => Promise<void>;
export type passwordResetAction = (passwordReset: PasswordResetDTO) => Promise<void>;

export class AuthService {
  private _token?: string;
  public get token(): string | undefined { return this._token; }

  private _user?: UserPayloadDTO;
  public get user(): UserPayloadDTO | undefined { return this._user; }

  private _editMode: boolean | undefined = false;
  public get editMode(): boolean { return this._editMode !== undefined ? this._editMode : false; }

  public get isAuth(): boolean { return this.user !== undefined; }
  public get isAdmin(): boolean {
    return this.user !== undefined ? this.user.hasClaim("admin") : false;
  }

  private readonly broadcastService = new BroadcastService();

  public constructor(
    private readonly apiService: APIService,
    private readonly errorService: ErrorService,
    private readonly storageService: StorageService,
  ) {
    // Read from storage and set properties for service
    this.getToken();
    this.getUser();
    this.getEditMode();

    // Sets auth header if token exists
    if (this.token !== undefined) {
      this.setAuthHeader(this.token);
    }
  }

  public async login(email: string, password: string, remember?: boolean): Promise<void> {
    try {
      // Call API auth
      const authResponse = await this.apiService.post<ILoginDTO, ILoginPayloadDTO>("/auth/login", { email, password, ...(remember !== undefined ? { remember } : undefined) });

      // Set values
      this.setToken(authResponse.body.token);
      this.setUser(authResponse.body.user);

      // Set axios header to use token
      this.setAuthHeader(authResponse.body.token);

      // Emit event
      this.broadcastService.emit("login", this.user);
    } catch (error) {
      this.errorService.submit({ message: "Authentication request failed", error });
      throw error;
    }
  }

  public async passwordReset(passwordReset: IPasswordResetDTO, reCaptchaToken: string): Promise<undefined | IDebugEmailDataDTO> {
    try {
      return (await this.apiService.post<IPasswordResetDTO, undefined | IDebugEmailDataDTO>("auth/reset-password", PasswordResetDTO.parse(passwordReset).serialize(), { headers: { recaptcha: reCaptchaToken } })).body;
    } catch (error) {
      throw error;
    }
  }

  public async resetPassword(resetPassword: IResetPasswordDTO): Promise<void> {
    try {
      await this.apiService.post("auth/password-reset", ResetPasswordDTO.parse(resetPassword).serialize());
    } catch (error) {
      throw error;
    }
  }

  public async validateResetToken(resetPasswordToken: IResetPasswordTokenDTO): Promise<ResetPasswordTokenResponseDTO> {
    try {
      return ResetPasswordTokenResponseDTO.parse((await this.apiService.post<IResetPasswordTokenDTO, ResetPasswordTokenResponseDTO>("auth/validate-reset-token", ResetPasswordTokenDTO.parse(resetPasswordToken))).body);
    } catch (error) {
      throw error;
    }
  }

  public logout(): void {
    // Unset token and user
    this.setToken();
    this.setUser();

    // Remove auth header from API service
    this.removeAuthHeader();

    // Emit event
    this.broadcastService.emit("logout");
  }

  public async getGoogleLoginUrl(): Promise<string> {
    return (await this.apiService.get<{ url: string }>("/auth/google-url")).body.url;
  }

  public async loginWithGoogleCode(code: string): Promise<void> {
    const authResponse = await this.apiService.post<{ code: string }, ILoginPayloadDTO>("auth/google-code", { code });

    // Set token and user
    this.setToken(authResponse.body.token);
    this.setUser(authResponse.body.user);

    // Set service properties

    // Set axios header to use token
    this.setAuthHeader(authResponse.body.token);

    this.broadcastService.emit("login", this.user);
  }

  public onLogin(callback: (user?: UserPayloadDTO) => void): ISubscription {
    return this.broadcastService.subscribe<UserPayloadDTO>("login", callback);
  }

  public onLogout(callback: () => void): ISubscription {
    return this.broadcastService.subscribe("logout", callback);
  }

  private setToken(token?: string): void {
    if (token === undefined) {
      this.storageService.delete("token");
    } else {
      this.storageService.set("token", token);
    }
    this._token = token;
  }
  private getToken(): string | undefined {
    const token: string | undefined = this.storageService.get<string>("token");
    this._token = token;
    return token;
  }

  private setUser(user?: IUserPayloadDTO | UserPayloadDTO): void {
    if (user === undefined) {
      this._user = user;
      this.storageService.delete("user");
    } else if ("serialize" in user) {
      this._user = user;
      this.storageService.set("user", user.serialize());
    } else {
      this._user = UserPayloadDTO.parse(user);
      this.storageService.set("user", user);
    }
  }

  private getUser(): UserPayloadDTO | undefined {
    const user: IUserPayloadDTO | undefined = this.storageService.get<IUserPayloadDTO>("user");
    if (user !== undefined) {
      const parsedUser: UserPayloadDTO = UserPayloadDTO.parse(user);
      this._user = parsedUser;
      return parsedUser;
    } else {
      this._user = undefined;
    }
  }

  private setEditMode(editMode?: boolean): void {
    if (editMode === undefined) {
      this.storageService.delete("editMode");
    } else {
      this.storageService.set("editMode", editMode);
    }
    this._editMode = editMode;
  }

  private getEditMode(): boolean | undefined {
    const editMode: boolean | undefined = this.storageService.get<boolean>("editMode");
    this._editMode = editMode;
    return editMode;
  }

  private getFromStorage(): { token?: string, user?: UserPayloadDTO, editMode?: boolean } {
    const token: string | undefined = this.storageService.get<string>("token", undefined);
    const user: IUserPayloadDTO | undefined = this.storageService.get<IUserPayloadDTO>("user", undefined);
    const editMode: boolean | undefined = this.storageService.get<boolean>("editMode", undefined);
    return {
      ...(token !== undefined ? { token } : undefined),
      ...(user !== undefined ? { user: UserPayloadDTO.parse(user) } : undefined),
      ...(editMode !== undefined ? { editMode } : undefined),
    }
  }

  private setProperties({ token, user, editMode }: { token?: string, user?: UserPayloadDTO, editMode?: boolean } = {}): void {
    // Set properties
    this._token = token !== undefined ? token : undefined;
    this._user = user !== undefined ? UserPayloadDTO.parse(user) : undefined;
    this._editMode = editMode !== undefined ? editMode : undefined;
  }

  private setAuthHeader(token: string): void {
    this.apiService.setDefaultHeaders({ Authorization: `Bearer ${token}` });
  }
  private removeAuthHeader(): void {
    this.apiService.removeDefaultHeaders("Authorization");
  }
}
