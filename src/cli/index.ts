// Libs
import * as changeCase from "change-case";
import * as ejs from "ejs";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// DTO's
import { IDictionaryDTO } from "../shared/dto/dictionary.dto";

// Modules
import { RandomModule } from "../shared/modules/random.module";

// Typeorm
import { ConnectionConfigs } from "../shared/typeorm";

// Models
import { generator, generatorModel } from "./models/generator";

// Services
import * as envServiceFactory from "../shared/factories/env-service.factory";
import { IMigration } from "../shared/services/migrate.service";
import { MigrateService } from "./services/migrate.service";

// SQLite migrations
import { _20200221_182652 } from "../migrate/migrations/sqlite/20200221_182652";

// MySQL Migrations
import { _20200413_200506 } from "../migrate/migrations/mysql/20200413_200506";

const envService = envServiceFactory.create();

const prompt = async (question: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(question, (answer: string) => resolve(answer));
  });
}

(async () => {
  if (process.argv.length > 2) {
    const ENV_PATH = "./.env";
    const ENV_EXAMPLE_PATH = "./.env.example";
    const MIGRATION_OUTPUT_PATH = "./src/migrate/migrations";

    const environment = envService.get("ENV", "local");
    if (environment === "production" && (await prompt("Are you sure you want to run command in production? (y/n) ")).toLowerCase() !== "y") {
      process.exit();
    }

    // Create migration service
    const migrateService = new MigrateService({
      ...envService.get("ENV", "local") === "local" ?
        {
          ...ConnectionConfigs.local(true),
        } : {
          ...ConnectionConfigs.production(
            envService.get("MYSQL_HOST", ""),
            parseInt(envService.get("MYSQL_PORT", ""), 10),
            envService.get("MYSQL_USERNAME", ""),
            envService.get("MYSQL_PASSWORD", ""),
            envService.get("MYSQL_DATABASE", ""),
            true,
          )
        },
      synchronize: false,
      migrationsRun: false,
      dropSchema: false,
      logging: true,
    });

    const args: string[] = process.argv.slice(2);
    switch (args[0]) {
      case "migrate":
        // Create migration service with connection
        switch (args[1]) {
          case "up":
            await migrateService.migrate();
            break;
          case "down":
            await migrateService.rollback();
            break;
          case "generate":
            await migrateService.generate(MIGRATION_OUTPUT_PATH);
            break;
          case "show":
            // tslint:disable-next-line: no-console
            console.table((await migrateService.show()).map((migration: IMigration) => ({
              name: migration.name,
              executed: migration.executed ? "X" : "",
            })));
            break;
          default:
            throw new Error(`No migration command was provided. Use either "up", "down" or "generate"`);
        }
        break;
      case "generate":
        if (args[1] === undefined && args[2] === undefined) {
          const values: IDictionaryDTO<string> = args.slice(3).reduce((previousValue: IDictionaryDTO<string>, value: string, index: number) => {
            const parsedValue = value.split("=");
            return {
              ...previousValue,
              ...(parsedValue.length === 2) ? {
                [parsedValue[0]]: parsedValue[1],
              } : {
                  [index]: value,
                }
            }
          }, {});
          try {
            const { templatePath, outputPath } = {
              templatePath: (generatorModel[args[1]] as generator).templatePath,
              outputPath: (generatorModel[args[1]] as generator).outputPath,
            }
            ejs.renderFile(templatePath, { changeCase, name: args[2], values }, (error: Error | null, output?: string) => {
              if (error !== null) { throw error; } // tslint:disable-line:no-console
              // Create new file
              const split = templatePath.split("/");
              const match = split[split.length - 1].match(/(.*)\.(.+)\.ejs$/);
              let fileNamePostfix = "";
              let fileExtension = "ts";
              if (match !== null) {
                fileNamePostfix = match[1];
                fileExtension = match[2];
              }
              fs.writeFileSync(`${path.join(outputPath, changeCase.paramCase(args[1]))}.${fileNamePostfix}.${fileExtension}`, output, "utf8");
            });

          } catch {
            throw new Error(`Unable to get generator ${args[2]}`);
          }
        }
        break;
      case "init":
        // Check that env file not already exists and env example file exists
        if (!fs.existsSync(ENV_PATH) && fs.existsSync(ENV_EXAMPLE_PATH)) {
          // Parse env example file values
          const configs: IDictionaryDTO<string> = fs.readFileSync(ENV_EXAMPLE_PATH, "utf8").split("\n").reduce((previousValue: IDictionaryDTO<string>, value: string) => {
            const match = value.match(/^([^=]+)=(.*)$/);
            return {
              ...previousValue,
              ...(match !== null && match[1] !== undefined && match[2] !== undefined ? {
                [match[1]]: match[1]
              } : undefined)
            };
          }, {});

          // Setting key and token values to random values
          if ("KEY" in configs) {
            configs.KEY = RandomModule.string(10);
          }
          if ("TOKEN" in configs) {
            configs.TOKEN = RandomModule.string(40);
          }

          // Write new config file
          fs.writeFileSync(ENV_PATH, Object.keys(configs).map((key: string) => `${key}=${configs[key]}`).join("\n"), "utf8");
        }
        break;
      default:
        throw new Error("No command was found");
    }
  } else {
    throw new Error("No input argument was provided");
  }
})()
