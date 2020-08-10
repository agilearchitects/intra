import { AuthConfig, AuthService, BannedTokenService, UserService } from "@agilearchitects/authenticaton";
import { EnvService } from "@agilearchitects/env";
import { HashtiService } from "@agilearchitects/hashti";
import { JWTService } from "@agilearchitects/jwt";

export const AuthServiceFactory = (
  envService: EnvService,
  bannedTokenService: BannedTokenService,
  userService: UserService,
  jwtService: JWTService,
  hashtiService: HashtiService,
): AuthService => {
  return new AuthService(new AuthConfig(
    undefined,
    undefined,
    undefined,
    undefined,
    envService.get("AUTH_KEY", ""),
    envService.get("REFRESH_KEY", ""),
    envService.get("ACTIVATION_KEY", ""),
    envService.get("RESET_KEY", ""),
    envService.get("MAIL_FROM", ""),
  ),
    bannedTokenService,
    userService,
    jwtService,
    hashtiService,
  )
}