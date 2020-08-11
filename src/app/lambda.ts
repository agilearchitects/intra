/**
 * This is the main file initiated by AWS Lambda. It can handle either
 * an API response or a migration action event. Lambda requires an index.js
 * file so make sure to create one pointing to this file. content of
 * index.js should look like this:
 * module.exports = require("./app/lambda");
 */

// Libs
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

// Factories
import { MigrateService } from "@agilearchitects/typeorm-helper";
import { lambdaFactory } from "./factories/apps/lambda.factory";
import { MigrationFactory } from "./factories/apps/migration.factory";
import { lambdaEventHandler } from "./factories/lambda-handler.factory";

interface LambdaEvent {
  action: "up" | "down" | "show";
}

export const handler = async (event: LambdaEvent | APIGatewayProxyEvent, context: Context): Promise<void | APIGatewayProxyResult> => {
  /* Check first if action event is specified in the event
  This means it's a migration action */
  if ("action" in event) {
    // Get alias name from lambda function
    const match = context.invokedFunctionArn.match(/^arn:aws:lambda:.+:.+:function:.+:(.+)/);

    // Create lambda from lambda factory
    await MigrationFactory(match !== null ? match[1] : "", async (migrateService: MigrateService) => {
      if (event.action === "up") {
        await migrateService.migrate();
      } else if (event.action === "down") {
        await migrateService.rollback();
      }
    });
  } else {
    // Create lambda from lambda factory
    return await lambdaFactory(event.requestContext.stage, (handler: lambdaEventHandler): Promise<APIGatewayProxyResult> => handler(event));
  }
  return;
}