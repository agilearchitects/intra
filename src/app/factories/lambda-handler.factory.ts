// Libs
import { EnvService } from "@agilearchitects/env";
import { ServerModule } from "@agilearchitects/server";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// Factories
import { handlerFactory } from "./handler.factory";

export type lambdaEventHandler = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

export const lambdaHandlerFactory = async (envService: EnvService, apiHost: string): Promise<lambdaEventHandler> => {
  const handlers = await handlerFactory(envService, apiHost);
  return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>
    await ServerModule.lambda(event, handlers);
}