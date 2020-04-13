// Libs
import { AuthConfig, AuthService, BannedTokenService, UserService } from "@agilearchitects/authenticaton";
import { HashtiService } from "@agilearchitects/hashti";
import { JWTService } from "@agilearchitects/jwt";
import { MailingunService } from "@agilearchitects/mailingun";
import { validate as baseValidate } from "@agilearchitects/server";
import { IValidationInput, ValidationService } from "@agilearchitects/validation";
import moment from "moment";
import { Between, createConnection } from "typeorm";
import * as typeorm from "typeorm";

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

// Factories
import * as envServiceFactory from "../shared/factories/env-service.factory";

export const envService = envServiceFactory.create(true);
export const jwtService = new JWTService(envService.get("TOKEN", Math.random().toString()));
export const mailingunService = new MailingunService(
  envService.get("MAILGUN_KEY", ""),
  envService.get("MAILGUN_DOMAIN", ""),
  envService.get("MAILGUN_HOST", ""),
);
export const hashtiService = new HashtiService();
export const claimService = new ClaimService(ClaimEntity);
export const groupService = new GroupService(GroupEntity, claimService);
export const userService = new UserService<UserEntity>(UserEntity, groupService, claimService, {
  Brackets: typeorm.Brackets,
  IsNull: typeorm.IsNull,
  Not: typeorm.Not,
});
export const authService = new AuthService(
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
export const customerService = new CustomerService(CustomerEntity, CustomerDTO, ProjectDTO, TaskDTO, TimeDTO, TagDTO);
export const projectService = new ProjectService("YYYY-MM-DD", CustomerEntity, ProjectEntity, TaskEntity, TaskUserEntity, TimeEntity, UserEntity, CustomerDTO, ProjectDTO, TaskDTO, TaskUserDTO, TimeDTO, UserDTO, moment);
export const timeService = new TimeService("YYYY-MM-DD HH:mm:ss", TimeEntity, TagEntity, TaskEntity, UserEntity, CustomerDTO, ProjectDTO, TagDTO, TaskDTO, TimeDTO, moment, Between);

const validationService = new ValidationService();
export const validate = (validation: IValidationInput, shouldValidate?: "body" | "params" | "query") => baseValidate(validationService, validation, shouldValidate);

export const boot = async () => {
  await createConnection({ ...ConnectionConfigs.local });
};
