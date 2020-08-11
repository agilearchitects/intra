// Libs
import { MigrateService } from "@agilearchitects/typeorm-helper";
import * as fs from "fs";
import { Connection } from "typeorm";

// Factories
import { connectionManagerModule } from "./connection-manager.factory";

export const migrateServiceFactor = (
  connection: Connection,
) => {
  return new MigrateService(
    connection,
    fs,
  )
}