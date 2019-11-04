// Libs
import { AuthConfig, AuthService, BannedTokenService, UserService } from "@agilearchitects/authenticaton";
import { EnvService } from "@agilearchitects/env";
import { HashtiService } from "@agilearchitects/hashti";
import { JWTService } from "@agilearchitects/jwt";
import { MailingunService } from "@agilearchitects/mailingun";
import { TemplateService } from "@agilearchitects/templategenerator";
import moment from "moment";
import { Between, createConnection } from "typeorm";

// TypeORM
import { defaultConnectionConfig } from "./typeorm";

// DTO's
import { CustomerDTO } from "../shared/dto/customer.dto";
import { ProjectDTO } from "../shared/dto/project.dto";
import { TagDTO } from "../shared/dto/tag.dto";
import { TaskUserDTO } from "../shared/dto/task-user.dto";
import { TaskDTO } from "../shared/dto/task.dto";
import { TimeDTO } from "../shared/dto/time.dto";
import { UserDTO } from "../shared/dto/user.dto";

// Entites
import { BannedTokenEntity } from "./entities/banned-token.entity";
import { CustomerEntity } from "./entities/customer.entity";
import { ProjectEntity } from "./entities/project.entity";
import { TaskUserEntity } from "./entities/task-user.entity";
import { TaskEntity } from "./entities/task.entity";
import { UserEntity } from "./entities/user.entity";

// Services
import { TagEntity } from "./entities/tag.entity";
import { TimeEntity } from "./entities/time.entity";
import { CustomerService } from "./services/customer.service";
import { ProjectService } from "./services/project.service";
import { TimeService } from "./services/time.service";

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
export const customerService = new CustomerService(CustomerEntity, CustomerDTO, ProjectDTO, TaskDTO);
export const projectService = new ProjectService("YYYY-MM-DD", CustomerEntity, ProjectEntity, TaskEntity, TaskUserEntity, TimeEntity, UserEntity, CustomerDTO, ProjectDTO, TaskDTO, TaskUserDTO, TimeDTO, UserDTO, moment);
export const timeService = new TimeService("YYYY-MM-DD HH:mm:ss", TimeEntity, TagEntity, TaskEntity, UserEntity, CustomerDTO, ProjectDTO, TagDTO, TaskDTO, TimeDTO, moment, Between);

export const boot = async () => {
  await createConnection({ ...defaultConnectionConfig });
};
