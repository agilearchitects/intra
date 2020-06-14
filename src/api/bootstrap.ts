// Libs
import { AuthConfig, AuthService, BannedTokenService, UserService } from "@agilearchitects/authenticaton";
import { EnvService } from "@agilearchitects/env";
import { HashtiService } from "@agilearchitects/hashti";
import { JWTService } from "@agilearchitects/jwt";
import { ILog, listners, logLevel, LogModule } from "@agilearchitects/logmodule";
import { MailingunService } from "@agilearchitects/mailingun";
import { validate as baseValidate } from "@agilearchitects/server";
import { IValidationInput, ValidationService } from "@agilearchitects/validation";
import moment from "moment";
import { Between, Connection } from "typeorm";
import * as typeorm from "typeorm";

import { ConnectionManangerModule } from "../shared/modules/connection-manager.module";
import { ConnectionConfigs } from "../shared/typeorm";

// DTO's
import { CustomerDTO } from "../shared/dto/customer.dto";
import { ProjectDTO } from "../shared/dto/project.dto";
import { TagDTO } from "../shared/dto/tag.dto";
import { TaskUserDTO } from "../shared/dto/task-user.dto";
import { TaskDTO } from "../shared/dto/task.dto";
import { TimeDTO } from "../shared/dto/time.dto";
import { UserDTO } from "../shared/dto/user.dto";

// Entites
import { BannedTokenEntity } from "../shared/entities/banned-token.entity";
import { ClaimEntity } from "../shared/entities/claim.entity";
import { CustomerEntity } from "../shared/entities/customer.entity";
import { GroupEntity } from "../shared/entities/group.entity";
import { ProjectEntity } from "../shared/entities/project.entity";
import { TagEntity } from "../shared/entities/tag.entity";
import { TaskUserEntity } from "../shared/entities/task-user.entity";
import { TaskEntity } from "../shared/entities/task.entity";
import { TimeEntity } from "../shared/entities/time.entity";
import { UserEntity } from "../shared/entities/user.entity";

// Services
import { ClaimService } from "@agilearchitects/authenticaton/lib/services/claim.service";
import { GroupService } from "@agilearchitects/authenticaton/lib/services/group.service";
import { CustomerService } from "./services/customer.service";
import { ProjectService } from "./services/project.service";
import { TimeService } from "./services/time.service";

export const boot = async (envService: EnvService): Promise<{
  connection: Connection,
  mailingunService: MailingunService,
  userService: UserService,
  hashtiService: HashtiService,
  authService: AuthService,
  customerService: CustomerService,
  projectService: ProjectService,
  timeService: TimeService,
  log: LogModule,
}> => {
  const connection = await ConnectionManangerModule.connect({
    ...(envService.get("ENV", "local") === "local" ?
      ConnectionConfigs.local() :
      ConnectionConfigs.production(
        envService.get("MYSQL_HOST", ""),
        parseInt(envService.get("MYSQL_PORT", ""), 10),
        envService.get("MYSQL_USERNAME", ""),
        envService.get("MYSQL_PASSWORD", ""),
        envService.get("MYSQL_DATABASE", ""),
      )
    ),
  });

  const jwtService = new JWTService(envService.get("TOKEN", Math.random().toString()));
  const hashtiService = new HashtiService();
  const claimService = new ClaimService(connection.getRepository(ClaimEntity));
  const groupService = new GroupService(connection.getRepository(GroupEntity), claimService);
  const userService = new UserService(connection.getRepository(UserEntity), claimService, groupService, {
    Brackets: typeorm.Brackets,
    IsNull: typeorm.IsNull,
    Not: typeorm.Not,
  });
  const validationService = new ValidationService();
  const validate = (validation: IValidationInput, shouldValidate?: "body" | "params" | "query") => baseValidate(validationService, validation, shouldValidate);
  return {
    connection,
    mailingunService: new MailingunService(
      envService.get("MAILGUN_KEY", ""),
      envService.get("MAILGUN_DOMAIN", ""),
      envService.get("MAILGUN_HOST", ""),
    ),
    userService,
    hashtiService,
    authService: new AuthService(
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
      new BannedTokenService(connection.getRepository(BannedTokenEntity)),
      userService,
      jwtService,
      hashtiService,
    ),
    customerService: new CustomerService(CustomerEntity, CustomerDTO, ProjectDTO, TaskDTO, TimeDTO, TagDTO),
    projectService: new ProjectService("YYYY-MM-DD", CustomerEntity, ProjectEntity, TaskEntity, TaskUserEntity, TimeEntity, UserEntity, CustomerDTO, ProjectDTO, TaskDTO, TaskUserDTO, TimeDTO, UserDTO, moment),
    timeService: new TimeService("YYYY-MM-DD HH:mm:ss", TimeEntity, TagEntity, TaskEntity, UserEntity, CustomerDTO, ProjectDTO, TagDTO, TaskDTO, TimeDTO, moment, Between),
    log: new LogModule(((env: string) =>
      [
        ...(env === "production" ? [{
          level: ((level: number): logLevel => level in logLevel ? level : logLevel.INFO)(parseInt(envService.get("LOG_LEVEL", "5"), 10)),
          handler: (log: ILog): void => {
            const logData: { code?: number, data?: any } = {};
            if (log.code !== undefined) { logData.code = log.code; }
            if (log.data !== undefined) { logData.data = log.data; }

            switch (log.level) {
              case logLevel.ERROR:
                console.error(log.message, logData); // tslint:disable-line: no-console
                break;
              case logLevel.WARNING:
                console.warn(log.message, logData); // tslint:disable-line: no-console
                break;
              case logLevel.LOG:
                console.log(log.message, logData); // tslint:disable-line: no-console
                break;
              case logLevel.INFO:
                console.info(log.message, logData); // tslint:disable-line: no-console
                break;
              case logLevel.VERBOSE:
                console.debug(log.message, logData); // tslint:disable-line: no-console
                break;
            }
          }
        }] : [
            listners.console(), listners.file("log")
          ]),
      ]
    )(envService.get("ENV", "local"))),
  }
};
