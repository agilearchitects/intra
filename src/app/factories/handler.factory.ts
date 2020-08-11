// Libs
import { BannedTokenService, ClaimService, GroupService, UserService } from "@agilearchitects/authenticaton";
import { EnvService } from "@agilearchitects/env";
import { HashtiService } from "@agilearchitects/hashti";
import { JWTService } from "@agilearchitects/jwt";
import { LogModule } from "@agilearchitects/logmodule";
import { bodyParse, cors, handlerMethod, vhost } from "@agilearchitects/server";
import { logHandler } from "@agilearchitects/typeorm-helper";
import * as typeorm from "typeorm";

// Modules
import { PackageJsonReaderModule } from "../modules/package-json-reader.module";

// Entities
import { MiddlewareController } from "../controllers/middleware.controller";
import { BannedTokenEntity } from "../entities/banned-token.entity";
import { ClaimEntity } from "../entities/claim.entity";
import { CustomerEntity } from "../entities/customer.entity";
import { GroupEntity } from "../entities/group.entity";
import { ProjectEntity } from "../entities/project.entity";
import { TagEntity } from "../entities/tag.entity";
import { TaskUserEntity } from "../entities/task-user.entity";
import { TaskEntity } from "../entities/task.entity";
import { TimeEntity } from "../entities/time.entity";
import { UserEntity } from "../entities/user.entity";

// Factories
import { AuthServiceFactory } from "./auth-service.factory";
import * as connectionManagerFactory from "./connection-manager.factory";
import { customerServiceFactory } from "./customer-service.factory";
import { ejsModuleFactory } from "./ejs-module.factory";
import { googleServiceFactory } from "./google-service.factory";
import { logFactory } from "./log.factory";
import { mailServiceFactory } from "./mail-service.factory";
import { projectServiceFactory } from "./project-service.factory";
import { timeServiceFactory } from "./time-service.factory";

// Controllers
import { AuthController } from "../controllers/auth.controller";
import { CustomerController } from "../controllers/customer.controller";
import { ProjectController } from "../controllers/project.controller";
import { RouterController } from "../controllers/router.controller";
import { TagController } from "../controllers/tag.controller";
import { TextController } from "../controllers/text.controller";
import { TimeController } from "../controllers/time.controller";
import { UserController } from "../controllers/user.controller";
import { VersionController } from "../controllers/version.controller";

// DTO's
import { UserPayloadDTO } from "../../shared/dto/user-payload.dto";

// Router
import { router } from "../router";

/**
 * Method for creating server handlers
 * @param envService Envservice to use
 * @param env Environment of application
 * @param apiHost Hostname of API
 */
export const handlerFactory = async (connection: typeorm.Connection, log: LogModule, envService: EnvService, apiHost: string): Promise<handlerMethod[]> => {
  // Get token from envService
  const token = envService.get("TOKEN", Math.random().toString());

  // Entites
  const customerEntity = connection.getRepository(CustomerEntity);
  const userEntity = connection.getRepository(UserEntity);
  const timeEntity = connection.getRepository(TimeEntity);
  const taskEntity = connection.getRepository(TaskEntity);

  // Create services
  const hashtiService = new HashtiService();
  const claimService = new ClaimService(connection.getRepository(ClaimEntity));
  const groupService = new GroupService(connection.getRepository(GroupEntity), claimService);
  const bannedTokenService = new BannedTokenService(connection.getRepository(BannedTokenEntity));
  const userService = new UserService(userEntity, claimService, groupService, {
    Brackets: typeorm.Brackets,
    IsNull: typeorm.IsNull,
    Not: typeorm.Not,
  });
  const jwtService = new JWTService(token);
  const mailService = mailServiceFactory(envService, ejsModuleFactory(envService));
  const authService = AuthServiceFactory(envService, bannedTokenService, userService, jwtService, hashtiService);
  const googleService = googleServiceFactory(envService);
  const timeService = timeServiceFactory("YYYY-MM-DD HH:mm:ss",
    timeEntity,
    connection.getRepository(TagEntity),
    taskEntity,
    userEntity,
  )
  const customerService = customerServiceFactory(customerEntity);
  const projectService = projectServiceFactory(
    "YYYY-MM-DD",
    customerEntity,
    connection.getRepository(ProjectEntity),
    taskEntity,
    connection.getRepository(TaskUserEntity),
    timeEntity,
    userEntity,
  );

  // Handlers
  return [vhost(
    apiHost,
    cors("*", undefined, ["Content-Type", "Authorization", "recaptcha"]),
    bodyParse(),
    router(
      new MiddlewareController(
        authService,
        googleService,
        token,
        UserPayloadDTO,
        log,
        envService.get("DEBUG", "") === "true" ? true : undefined
      ),
      new VersionController(new PackageJsonReaderModule(), log),
      new AuthController(
        authService,
        userService,
        hashtiService,
        googleService,
        mailService,
        log,
        envService.get("DEBUG", "") === "true" ? true : undefined
      ),
      new RouterController(log),
      new UserController(userService, log),
      new CustomerController(customerService, log),
      new ProjectController(projectService, userService, log),
      new TimeController(timeService, log),
      new TagController(log),
      new TextController(log),
    ),
  )];
}
