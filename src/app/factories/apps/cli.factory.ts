// Libs
import { CliModule } from "@agilearchitects/cli";
import { EnvService } from "@agilearchitects/env";
import { LogModule } from "@agilearchitects/logmodule";
import { logHandler, MigrateService } from "@agilearchitects/typeorm-helper";
import * as fs from "fs";
import * as readline from "readline";

// Services
import { CliTemplateService } from "../../services/cli-template.service";

// Factories
import { Connection } from "typeorm";
import { RandomModule } from "../../modules/random.module";
import { cliTemplateServiceFactory } from "../cli-template-service.factory";
import * as connectionManagerFactory from "../connection-manager.factory";
import { logFactory } from "../log.factory";
import { migrateServiceFactor } from "../migrate-service.factory";

interface IFsModule {
  readFileSync: (path: string, encoding: BufferEncoding) => string;
  writeFileSync: (path: string, data: string, encoding: string) => void;
  existsSync: (path: string) => boolean;
}

export const cliFactory = async (envPath: string = ".env"): Promise<{
  cli: CliModule,
  envService: EnvService,
  migrateService: MigrateService,
  templateService: CliTemplateService,
  randomModule: typeof RandomModule,
  fsModule: IFsModule,
  log: LogModule,
  connection: Connection,
}> => {
  const envService = new EnvService(envPath, fs);

  // Create log module
  const log: LogModule = logFactory("cli", envService);

  const connection = await connectionManagerFactory.connect(
    ["production", "staging", "development"].includes(envService.get("ENV", "local")) === true ?
      connectionManagerFactory.production(envService, logHandler(log), true) :
      connectionManagerFactory.local(logHandler(log), true));


  return {
    cli: new CliModule(readline, process, console),
    envService,
    // Create migrate service with connection and attached log
    migrateService: migrateServiceFactor(connection),
    templateService: cliTemplateServiceFactory(),
    randomModule: RandomModule,
    fsModule: fs,
    log,
    connection,
  }
}