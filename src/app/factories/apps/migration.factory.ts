// Libs
import { LogModule } from "@agilearchitects/logmodule";
import { logHandler, MigrateService } from "@agilearchitects/typeorm-helper";
import * as fs from "fs";

// Factories
import { EnvService } from "../../services/env.service";
import * as connectionManagerFactory from "../connection-manager.factory";
import { logFactory } from "../log.factory";
import { migrateServiceFactor } from "../migrate-service.factory"

export const MigrationFactory = async (stage: string, callback: (migrateService: MigrateService) => Promise<void>): Promise<void> => {
  // Creates envService
  const envService = new EnvService(stage, ".env", fs);

  // Create log module
  const log: LogModule = logFactory("migration", envService);

  // Connect to DB
  const connection = await connectionManagerFactory.connect(
    ["production", "staging", "development"].includes(envService.get("ENV", "local")) === true ?
      connectionManagerFactory.production(envService, logHandler(log), true) :
      connectionManagerFactory.local(logHandler(log), true));

  try {
    await callback(migrateServiceFactor(connection));
  } catch (error) {
    log.error({ message: "Migration failed unexpectedly", data: error })
  } finally {
    await connection.close();
  }
}