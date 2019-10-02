// Libs
import { AuthConfig, AuthService, BannedTokenService, UserService } from "@agilearchitects/authenticaton";
import { EnvService } from "@agilearchitects/env";
import { HashtiService } from "@agilearchitects/hashti";
import { JWTService } from "@agilearchitects/jwt";
import { MailingunService } from "@agilearchitects/mailingun";
import { TemplateService } from "@agilearchitects/templategenerator";
import { createConnection } from "typeorm";

// Entites
import { BannedTokenEntity } from "./api/entities/banned-token.entity";
import { UserEntity } from "./api/entities/user.entity";

export const envService = new EnvService();
export const jwtService = new JWTService(envService.get("TOKEN", Math.random().toString()));
export const mailingunService = new MailingunService(
  envService.get("MAILGUN_KEY", ""),
  envService.get("MAILGUN_DOMAIN", ""),
  envService.get("MAILGUN_HOST", ""),
);

export const templateService = new TemplateService("../storage/email-templates");
export const hashtiService = new HashtiService();
export const userService = new UserService<UserEntity>(UserEntity);
export const authService = new AuthService(
  BannedTokenEntity,
  UserEntity,
  new AuthConfig(
    undefined,
    undefined,
    undefined,
    undefined,
    envService.get("AUTH_KEY", Math.random().toString()),
    envService.get("REFRESH_KEY", Math.random().toString()),
    envService.get("ACTIVATION_KEY", Math.random().toString()),
    envService.get("RESET_KEY", Math.random().toString()),
    envService.get("MAIL_FROM", "")),
  new BannedTokenService(BannedTokenEntity),
  userService,
  jwtService,
  hashtiService,
);


export const boot = async () => {
  await createConnection();
};
