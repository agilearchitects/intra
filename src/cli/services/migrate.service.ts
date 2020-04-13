// Libs
import moment from "moment";
import { Connection } from "typeorm";
import { CommandUtils } from "typeorm/commands/CommandUtils";
import { MysqlDriver } from "typeorm/driver/mysql/MysqlDriver";

// Services
import { MigrateService as SharedMigrateService } from "../../shared/services/migrate.service";

export class MigrateService extends SharedMigrateService {
  public async generate(basePath: string) {
    await this.connect(async (connection: Connection): Promise<void> => {
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
        await CommandUtils.createFile(`${basePath}/${connection.driver.options.type}/${timestamp}.ts`, `import { MigrationInterface, QueryRunner } from "typeorm";\n\n// tslint:disable-next-line: class-name\nexport class _${timestamp} implements MigrationInterface {\n\n    public async up(queryRunner: QueryRunner): Promise<any> {\n${upSqls.join("\n")}\n    }\n\n    public async down(queryRunner: QueryRunner): Promise<any> {\n${downSqls.reverse().join("\n")}\n    }\n\n}\n`);
      }
    });
  }
}