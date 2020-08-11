// Libs
import { EnvService } from "@agilearchitects/env";
import { ConnectionManangerModule } from "@agilearchitects/typeorm-helper";
import { BaseEntity, Connection, ConnectionOptions, getConnectionManager, Logger } from "typeorm";
import { RelationIdLoader } from "typeorm/query-builder/RelationIdLoader";
import { RelationLoader } from "typeorm/query-builder/RelationLoader";

// Entities
import { BannedTokenEntity } from "../entities/banned-token.entity";
import { ClaimEntity } from "../entities/claim.entity";
import { GroupEntity } from "../entities/group.entity";
import { RoleEntity } from "../entities/role.entity";
import { TextEntity } from "../entities/text.entity";
import { UserEntity } from "../entities/user.entity";

// SQLite migrations
import { _20200625_094039 } from "../migrations/sqlite/20200625_094039";
import { _20200808_085953 } from "../migrations/sqlite/20200808_085953";

// MySql migrations
import { CustomerEntity } from "../entities/customer.entity";
import { ProjectEntity } from "../entities/project.entity";
import { TagEntity } from "../entities/tag.entity";
import { TaskUserEntity } from "../entities/task-user.entity";
import { TaskEntity } from "../entities/task.entity";
import { TimeEntity } from "../entities/time.entity";
import { _20200803_235421 } from "../migrations/mysql/20200803_235421";


export const entities: typeof BaseEntity[] = [
  BannedTokenEntity,
  ClaimEntity,
  CustomerEntity,
  GroupEntity,
  ProjectEntity,
  RoleEntity,
  TagEntity,
  TaskUserEntity,
  TaskEntity,
  TextEntity,
  TimeEntity,
  UserEntity,
];

export const local = (logger: Logger, withMigrations: boolean): ConnectionOptions => {
  return {
    type: "sqlite",
    ...(withMigrations ? { name: "migrate" } : undefined), // Will use different connection name if is for migration
    database: "storage/db.sqlite",
    synchronize: false,
    logger,
    entities,
    ...(withMigrations ? {
      migrations: [
        _20200625_094039,
        _20200808_085953
      ],
    } : undefined)
  }
};

export const production = (envService: EnvService, logger: Logger, forMigration: boolean): ConnectionOptions => {
  // Will use different credentials if migration
  const prefixMysqlAuth: string = forMigration === true ? "_MIGRATE" : "";

  // Depending on environment different mysql connection is set
  return {
    type: "mysql",
    ...(forMigration ? { name: "migrate" } : undefined), // Will use different connection name if is for migration
    host: envService.get("MYSQL_HOST", ""),
    port: parseInt(envService.get("MYSQL_PORT", ""), 10),
    username: envService.get(`MYSQL${prefixMysqlAuth}_USERNAME`, ""),
    password: envService.get(`MYSQL${prefixMysqlAuth}_PASSWORD`, ""),
    database: envService.get("MYSQL_DATABASE", ""),
    synchronize: false,
    logger,
    entities,
    ...(forMigration ? {
      migrations: [
        _20200803_235421
      ],
    } : undefined)
  }
}

export const connectionManagerModule = (): ConnectionManangerModule => {
  return new ConnectionManangerModule(
    getConnectionManager,
    RelationLoader,
    RelationIdLoader
  );
}

export const connect = (connectionOptions: ConnectionOptions): Promise<Connection> => {
  const connectionManager = new ConnectionManangerModule(
    getConnectionManager,
    RelationLoader,
    RelationIdLoader
  );

  return connectionManager.connect(connectionOptions);
}