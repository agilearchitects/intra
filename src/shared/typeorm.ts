// Libs
import { ConnectionOptions } from "typeorm";

// Entites
import { BannedTokenEntity } from "./entities/banned-token.entity";
import { ClaimEntity } from "./entities/claim.entity";
import { CustomerEntity } from "./entities/customer.entity";
import { GroupEntity } from "./entities/group.entity";
import { ProjectEntity } from "./entities/project.entity";
import { ResourceEntity } from "./entities/resource.entity";
import { TagEntity } from "./entities/tag.entity";
import { TaskUserEntity } from "./entities/task-user.entity";
import { TaskEntity } from "./entities/task.entity";
import { TextEntity } from "./entities/text.entity";
import { TimeEntity } from "./entities/time.entity";
import { TokenEntity } from "./entities/token.entity";
import { UserEntity } from "./entities/user.entity";

export class ConnectionConfigs {
  protected static entities = [
    BannedTokenEntity,
    ClaimEntity,
    CustomerEntity,
    GroupEntity,
    ProjectEntity,
    ResourceEntity,
    TagEntity,
    TaskUserEntity,
    TaskEntity,
    TextEntity,
    TimeEntity,
    TokenEntity,
    UserEntity,
  ];

  public static local(): ConnectionOptions {
    return {
      type: "sqlite",
      database: "storage/db.sqlite",
      synchronize: false,
      logging: false,
      entities: ConnectionConfigs.entities,
    };
  }

  public static production(host: string, port: number, username: string, password: string, database: string): ConnectionOptions {
    return {
      type: "mysql",
      host,
      port,
      username,
      password,
      database,
      synchronize: false,
      logging: false,
      entities: ConnectionConfigs.entities,
    }
  }
}