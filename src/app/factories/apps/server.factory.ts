// Libs
import { EnvService } from "@agilearchitects/env";
import { LogModule } from "@agilearchitects/logmodule";
import { logHandler } from "@agilearchitects/typeorm-helper";
import * as fs from "fs";
import * as http from "http";

// Factories
import * as connectionManagerFactory from "../connection-manager.factory";
import { httpHandlerFactory } from "../http-handler.factory";
import { logFactory } from "../log.factory";

interface IServer {
  httpHandler: http.RequestListener;
  apiHost: string;
  spaHost: string;
  port: number;
}

export const serverFactory = async (): Promise<IServer> => {
  // Create env service
  const envService = new EnvService(".env", fs);

  // Create log module
  const log: LogModule = logFactory("lambda", envService);

  // Connect to DB
  const connection = await connectionManagerFactory.connect(
    ["production", "staging", "development"].includes(envService.get("ENV", "local")) === true ?
      connectionManagerFactory.production(envService, logHandler(log), false) :
      connectionManagerFactory.local(logHandler(log), false));

  // Get env values
  const apiHost: string = envService.get("API_HOST", "api.test.test");
  const spaHost: string = envService.get("SPA_HOST", "www.test.test");
  return {
    httpHandler: await httpHandlerFactory(connection, log, envService, apiHost, spaHost),
    port: parseInt(envService.get("PORT", "1234"), 10),
    apiHost,
    spaHost,
  }
};
