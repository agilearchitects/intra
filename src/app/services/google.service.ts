import { AxiosInstance } from "axios";
import { google } from "googleapis";
import * as url from "url";

interface ICredentials {
  refresh_token?: string | null;
  expiry_date?: number | null;
  access_token?: string | null;
  token_type?: string | null;
  id_token?: string | null;
}

interface IUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  picture: string;
  hd: string;
}

export class GoogleService {
  private client: any;

  public constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly clientRedirect: string,
    private readonly recaptchaSecret: string,
    private readonly axios: AxiosInstance,
  ) {
    this.client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.clientRedirect
    );
  }

  public getAuthUrl() {
    return url.format(`https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&response_type=code&client_id=${this.clientId}&redirect_uri=${this.clientRedirect}`)
  }

  public async getToken(code: string): Promise<ICredentials> {
    return (await this.axios.post<ICredentials>("https://accounts.google.com/o/oauth2/token",
      {
        grant_type: "authorization_code",
        code,
        redirect_uri: this.clientRedirect,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      })).data;
  }

  public async getUserInfo(token: string): Promise<IUserInfo> {
    return (await this.axios.get<IUserInfo>("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })).data;
  }

  public async verifyRecaptchaToken(token: string, remoteIp: string) {
    this.axios.post("https://www.google.com/recaptcha/api/siteverify", {
      secret: this.recaptchaSecret,
      response: token,
      remoteip: remoteIp,
    });
  }
}