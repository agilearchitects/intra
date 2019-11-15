// Libs
import { ConnectionOptions, createConnection } from "typeorm";

// Entites
import { BannedTokenEntity } from "./entities/banned-token.entity";
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

export const defaultConnectionConfig: ConnectionOptions = {
  type: "sqlite",
  database: "storage/db.sqlite",
  synchronize: false,
  logging: false,
  entities: [
    BannedTokenEntity,
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
  ],
  migrations: [
    "./migrations/*.js",
  ],
};

export const runMigrations = async () => {
  const connection = await createConnection({ ...defaultConnectionConfig, logging: true });
  await connection.runMigrations({ transaction: false });
  await connection.close();
};
