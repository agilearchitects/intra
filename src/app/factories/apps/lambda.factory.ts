// Libs
import { LogModule } from "@agilearchitects/logmodule";
import { logHandler, MigrateService } from "@agilearchitects/typeorm-helper";
import * as fs from "fs";

// Factories
import { EnvService } from "../../services/env.service";
import * as connectionManagerFactory from "../connection-manager.factory";
import { lambdaEventHandler, lambdaHandlerFactory } from "../lambda-handler.factory";
import { logFactory } from "../log.factory";
import { migrateServiceFactor } from "../migrate-service.factory"

export const lambdaFactory = async (stage: string): Promise<{
  migrateService: MigrateService,
  handler: lambdaEventHandler,
  log: LogModule,
}> => {
  // Creates envService
  const envService = new EnvService(stage, ".env", fs);

  // Create log module
  const log: LogModule = logFactory("lambda", envService);

  return {
    migrateService: migrateServiceFactor(
      ["production", "staging", "development"].includes(envService.get("ENV", "local")) === true ?
        connectionManagerFactory.production(
          envService,
          logHandler(log),
          true
        ) : connectionManagerFactory.local(logHandler(log), true)),
    handler: await lambdaHandlerFactory(
      envService,
      envService.get("API_HOST", "api.test.test"),
    ),
    log,
  }
}