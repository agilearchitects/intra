// Libs
import * as changeCase from "change-case";
import { ConnectionOptions, createConnection } from "typeorm";
import { CommandUtils } from "typeorm/commands/CommandUtils";
import { MysqlDriver } from "typeorm/driver/mysql/MysqlDriver";

// Entites
import moment = require("moment");
import yargs = require("yargs");
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


export const defaultConnectionConfig: ConnectionOptions = {
  type: "sqlite",
  database: "storage/db.sqlite",
  synchronize: false,
  logging: false,
  entities: [
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
  ],
};

export const runMigrations = async () => {
  const connection = await createConnection({
    ...defaultConnectionConfig,
    migrations: [
      "storage/migrations/*.ts",
    ],
    logging: true,
  });
  await connection.runMigrations({ transaction: false });
  await connection.close();
};

export const undoMigration = async () => {
  const connection = await createConnection({
    ...defaultConnectionConfig,
    migrations: [
      "storage/migrations/*.ts",
    ],
    logging: true,
  });
  await connection.undoLastMigration({ transaction: false });
  await connection.close();
};
export const showMigrations = async () => {
  const connection = await createConnection({
    ...defaultConnectionConfig,
    migrations: [
      "storage/migrations/*.ts",
    ],
    logging: "all",
  });
  await connection.showMigrations();
  await connection.close();
};

export const generateMigrations = async () => {
  const connection = await createConnection({ ...defaultConnectionConfig, logging: true });
  const sqlInMemory = await connection.driver.createSchemaBuilder().log();
  const upSqls: string[] = [];
  const downSqls: string[] = [];
  // mysql is exceptional here because it uses ` character in to escape names in queries, that's why for mysql
  // we are using simple quoted string instead of template string syntax
  if (connection.driver instanceof MysqlDriver) {
    sqlInMemory.upQueries.forEach((query) => {
      upSqls.push("        await queryRunner.query(\"" + query.query.replace(new RegExp(`"`, "g"), `\\"`) + "\");");
    });
    sqlInMemory.downQueries.forEach((query) => {
      downSqls.push("        await queryRunner.query(\"" + query.query.replace(new RegExp(`"`, "g"), `\\"`) + "\");");
    });
  } else {
    sqlInMemory.upQueries.forEach((query) => {
      upSqls.push("        await queryRunner.query(`" + query.query.replace(new RegExp("`", "g"), "\\`") + "`);");
    });
    sqlInMemory.downQueries.forEach((query) => {
      downSqls.push("        await queryRunner.query(`" + query.query.replace(new RegExp("`", "g"), "\\`") + "`);");
    });
  }

  if (upSqls.length) {
    const timestamp = moment().format("YYYYMMDD_HHmmss");
    await CommandUtils.createFile(`${process.cwd()}/storage/migrations/${timestamp}.ts`, `import { MigrationInterface, QueryRunner } from "typeorm";\n\n// tslint:disable-next-line: class-name\nexport class _${timestamp} implements MigrationInterface {\n\n    public async up(queryRunner: QueryRunner): Promise<any> {\n${upSqls.join("\n")}\n    }\n\n    public async down(queryRunner: QueryRunner): Promise<any> {\n${downSqls.reverse().join("\n")}\n    }\n\n}\n`);
  }

  await connection.close();
};
