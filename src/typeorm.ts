// Libs
import { ConnectionOptions, createConnection } from "typeorm";

// Entites
import { BannedTokenEntity } from "./api/entities/banned-token.entity";
import { CustomerEntity } from "./api/entities/customer.entity";
import { GroupEntity } from "./api/entities/group.entity";
import { ProjectEntity } from "./api/entities/project.entity";
import { ResourceEntity } from "./api/entities/resource.entity";
import { TextEntity } from "./api/entities/text.entity";
import { TimeEntity } from "./api/entities/time.entity";
import { TokenEntity } from "./api/entities/token.entity";
import { UserEntity } from "./api/entities/user.entity";

export const defaultConnectionConfig: ConnectionOptions = {
  type: "sqlite",
  database: "storage/db.sqlite",
  synchronize: true,
  logging: false,
  entities: [
    BannedTokenEntity,
    CustomerEntity,
    GroupEntity,
    ProjectEntity,
    ResourceEntity,
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
