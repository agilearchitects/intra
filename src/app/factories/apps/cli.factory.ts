// Libs
import { CliModule } from "@agilearchitects/cli";
import { EnvService } from "@agilearchitects/env";
import { LogModule } from "@agilearchitects/logmodule";
import { logHandler, MigrateService } from "@agilearchitects/typeorm-helper";
import * as fs from "fs";
import * as readline from "readline";

// Factories
import { RandomModule } from "../../modules/random.module";
import { CliTemplateService } from "../../services/cli-template.service";
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
}> => {
  const envService = new EnvService(envPath, fs);
  const env = envService.get("ENV", "local");

  // Create log module
  const log: LogModule = logFactory("cli", envService);

  return {
    cli: new CliModule(readline, process, console),
    envService,
    // Create migrate service with connection and attached log
    migrateService: migrateServiceFactor(["production", "staging", "development"].includes(env) === true ?
      connectionManagerFactory.production(envService, logHandler(log), true) :
      connectionManagerFactory.local(logHandler(log), true)),
    templateService: cliTemplateServiceFactory(),
    randomModule: RandomModule,
    fsModule: fs,
  }
}