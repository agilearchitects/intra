import { EnvService } from "@agilearchitects/env";
import { listners, logLevel, LogModule } from "@agilearchitects/logmodule";

export const logFactory = (name: string, envService: EnvService) => {
  const env = envService.get("ENV", "local");

  // Determine log level
  const level: logLevel = (() => {
    switch (envService.get("LOG_LEVEL", "4")) {
      case "1":
        return logLevel.ERROR;
      case "2":
        return logLevel.WARNING;
      case "3":
        return logLevel.LOG;
      case "5":
        return logLevel.VERBOSE;
    }
    return logLevel.INFO;
  })();

  return new LogModule([...(env === "local" ? [listners.file(name, level)] : []), listners.console(level)]);
}