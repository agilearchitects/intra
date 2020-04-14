import { EnvService } from "@agilearchitects/env";
import * as fs from "fs";

export const create = (useFs: boolean = true): EnvService => {
  const path = ".env";
  // Will only use fs module
  if (useFs === true && fs.existsSync(path)) {
    return new EnvService(path, false, fs);
  }
  // Env service will only use in memory variables
  return new EnvService(false);
}
