// Libs
import { EnvService } from "@agilearchitects/env";
import { LogModule } from "@agilearchitects/logmodule";
import { ServerModule } from "@agilearchitects/server";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Connection } from "typeorm";

// Factories
import { handlerFactory } from "./handler.factory";

export type lambdaEventHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

export const lambdaHandlerFactory = async (connection: Connection, log: LogModule, envService: EnvService, apiHost: string): Promise<lambdaEventHandler> => {
  const handlers = await handlerFactory(connection, log, envService, apiHost);
  return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
    await ServerModule.lambda(event, handlers);
}