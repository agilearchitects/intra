/**
 * This is the main file initiated by AWS Lambda. It can handle either
 * an API response or a migration action event. Lambda requires an index.js
 * file so make sure to create one pointing to this file. content of
 * index.js should look like this:
 * module.exports = require("./app/lambda");
 */

// Libs
import { APIGatewayProxyEvent, Context } from "aws-lambda";

// Factories
import { lambdaFactory } from "./factories/apps/lambda.factory";

interface LambdaEvent {
  action: "up" | "down" | "show";
}

export const handler = async (event: LambdaEvent | APIGatewayProxyEvent, context: Context) => {
  /* Check first if action event is specified in the event
  This means it's a migration action */
  if ("action" in event) {
    // Get alias name from lambda function
    const match = context.invokedFunctionArn.match(/^arn:aws:lambda:.+:.+:function:.+:(.+)/);

    // Create lambda from lambda factory
    const lambda = await lambdaFactory(match !== null ? match[1] : "");

    if (event.action === "up") {
      await lambda.migrateService.migrate();
    } else if (event.action === "down") {
      await lambda.migrateService.rollback();
    }

    return true;
  } else {
    // Create lambda from lambda factory
    const lambda = await lambdaFactory(event.requestContext.stage);

    /* If not lambda event it's an API Gateway event. Call the
    lambda handler */
    try {
      return await lambda.handler(event);
    } catch (error) {
      lambda.log.error({ message: "Handler failed unexpectedly", data: error })
    }
  }
}