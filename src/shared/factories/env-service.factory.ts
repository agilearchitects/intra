import { EnvService } from "@agilearchitects/env";
import * as fs from "fs";

export const create = (): EnvService => {
  const path = ".env";
  // Will only use fs module
  if (fs.existsSync(path)) {
    return new EnvService(".env", fs);
  }
  return new EnvService(".env", false);
}
