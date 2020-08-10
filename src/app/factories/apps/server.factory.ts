// Libs
import { EnvService } from "@agilearchitects/env";
import * as fs from "fs";
import * as http from "http";

// Factories
import { httpHandlerFactory } from "../http-handler.factory";

interface IServer {
  httpHandler: http.RequestListener;
  apiHost: string;
  spaHost: string;
  port: number;
}

export const serverFactory = async (): Promise<IServer> => {
  // Create env service
  const envService = new EnvService(".env", fs);

  // Get env values
  const apiHost: string = envService.get("API_HOST", "api.test.test");
  const spaHost: string = envService.get("SPA_HOST", "www.test.test");
  return {
    httpHandler: await httpHandlerFactory(envService, apiHost, spaHost),
    port: parseInt(envService.get("PORT", "1234"), 10),
    apiHost,
    spaHost,
  }
};
