// Libs
import { MigrateService } from "@agilearchitects/typeorm-helper";
import * as fs from "fs";
import { ConnectionOptions } from "typeorm";

// Factories
import { connectionManagerModule } from "./connection-manager.factory";

export const migrateServiceFactor = (
  connectionOptions: ConnectionOptions,
) => {
  return new MigrateService(
    connectionManagerModule(),
    connectionOptions,
    fs,
  )
}