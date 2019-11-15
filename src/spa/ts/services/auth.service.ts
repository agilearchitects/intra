// Libs
import { ILoginDTO, ILoginPayloadDTO, LoginDTO } from "@agilearchitects/authenticaton";

// DTO's
import { PasswordResetDTO } from "../../../shared/dto/password-reset.dto";
import { IUserDTO } from "../../../shared/dto/user.dto";

// Services
import { APIService } from "../../../shared/services/api.service";
import { ErrorService } from "./error.service";
import { StorageService } from "./storage.service";

export type loginAction = (login: LoginDTO) => Promise<void>;
export type passwordResetAction = (passwordReset: PasswordResetDTO) => Promise<void>;

export class AuthService {
  private _token?: string;
  public get token(): string | undefined { return this._token; }

  private _user?: IUserDTO;
  public get user(): IUserDTO | undefined { return this._user; }

  private _editMode: boolean = false;
  public get editMode(): boolean { return this._editMode; }

  public get isAuth(): boolean { return !!this.user; }
  public get isAdmin(): boolean {
    if (this.user === undefined) {
      return false;
    }

    return [
      "test@test.test",
      "hannes@dwik.se",
      "hannes@agilearchitects.se",
      "carin@dwik.se",
      "carin.dahlberg@pontarius.com",
    ].indexOf(this.user.email) !== -1;
  }

  public constructor(
    private readonly apiService: APIService,
    private readonly errorService: ErrorService,
    private readonly storageService: StorageService,
  ) {
    this._token = this.storageService.get<string>("token");
    this.storageService.on<string>("token", (token: string) => {
      this._token = token;
    });

    this._user = this.storageService.get("user");
    this.storageService.on<IUserDTO>("user", (user: IUserDTO) => {
      this._user = user;
    });

    this._editMode = this.storageService.get("editMode");
    this.storageService.on<boolean>("editMode", (editMode: boolean) => {
      this._editMode = editMode;
    });
  }

  public async login(email: string, password: string, remember?: boolean): Promise<void> {
    try {
      const authResponse = await this.apiService.post<ILoginDTO, ILoginPayloadDTO>("/auth/login", { email, password, ...(remember !== undefined ? { remember } : undefined) });

      // Set token and user
      this.storageService.set("token", authResponse.body.token);
      this.storageService.set("user", authResponse.body.user);

      // Set axios header to use token
      this.apiService.setDefaultHeaders({ Authorization: `Bearer ${authResponse.body.token}` });
      return;
    } catch (error) {
      this.errorService.submit({ message: "Authentication request failed", error });
      throw error;
    }
  }

  public async passwordReset() {
    try {
      //
    } catch (error) {
      throw error;
    }
  }

  public logout(): void {
    this.storageService.set("token", undefined);
    this.storageService.set("user", undefined);
    this.apiService.removeDefaultHeaders("Authorization");
  }

  public setEditMode(value: boolean) {
    this.storageService.set("editMode", value);
  }
}
