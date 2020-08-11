// Libs
import { LogModule } from "@agilearchitects/logmodule";
import { logHandler } from "@agilearchitects/typeorm-helper";
import * as fs from "fs";

// Services
import { EnvService } from "../../services/env.service";

// Factories
import * as connectionManagerFactory from "../connection-manager.factory";
import { lambdaEventHandler, lambdaHandlerFactory } from "../lambda-handler.factory";
import { logFactory } from "../log.factory";

export const lambdaFactory = async (stage: string, callback: (handler: lambdaEventHandler) => Promise<void>): Promise<void> => {
  // Creates envService
  const envService = new EnvService(stage, ".env", fs);

  // Create log module
  const log: LogModule = logFactory("lambda", envService);

  // Connect to DB
  const connection = await connectionManagerFactory.connect(
    ["production", "staging", "development"].includes(envService.get("ENV", "local")) === true ?
      connectionManagerFactory.production(envService, logHandler(log), false) :
      connectionManagerFactory.local(logHandler(log), false));

  try {
    await callback(await lambdaHandlerFactory(
      connection,
      log,
      envService,
      envService.get("API_HOST", "api.test.test"),
    ));
  } catch (error) {
    log.error({ message: "Handler failed unexpectedly", data: error })
  } finally {
    connection.close();
  }
}