// Libs
import { bodyParse, cors, HandlerModule, method, RouterModule, ServerModule, staticContent, vhost } from "@agilearchitects/server";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as http from "http";
import * as stream from "stream";

// Factories
import * as envServiceFactory from "../shared/factories/env-service.factory";

// Modules

import { boot } from "./bootstrap";

// Routes
import { IDictionary } from "./modules/dictionary.module";
import { routes } from "./routes";

const envService = envServiceFactory.create();

// Constants
const port = parseInt(envService.get("PORT", "1234"), 10);
const apiHost = envService.get("API_HOST", "api.test.test");
const spaHost = envService.get("SPA_HOST", "www.test.test");
const env = envService.get("ENV", "local");

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Boot sql connection
  const bootContent = await boot(envService);
  return await ServerModule.lambda(
    event,
    [vhost(apiHost, cors(), bodyParse(), routes(
      bootContent.authService,
      bootContent.userService,
      bootContent.hashtiService,
      bootContent.customerService,
      bootContent.projectService,
      bootContent.timeService,
      envService,
      bootContent.log
    ))]
  );
};

if (env === "local" || env === "production_debug") {
  (async () => {
    const bootContent = await boot(envService);

    const staticRouter = new RouterModule();
    staticRouter.any("api_base_url", [method.HEAD], {}, (handler: HandlerModule) => {
      handler.response.send("", {
        "api_base_url": `http://${apiHost}:${port}`,
      });
    });
    http.createServer(async (request: http.IncomingMessage, response: http.ServerResponse) => {
      const result = await ServerModule.simpleHandle(
        // Parse request complete URL
        `${"encrypted" in request.connection ? "http" : "https"}://${request.headers.host}${request.url}`,
        // Make out http request method
        request.method !== undefined ? (method as any)[request.method] : method.GET,
        // Map headers
        Object.keys(request.headers).reduce((previousValue: IDictionary<string | string[]>, key: string) => {
          return {
            ...previousValue,
            ...((value?: string | string[]) => (value !== undefined ? { [key]: value } : undefined))(request.headers[key]),
          }
        }, {}),
        // Body is the complete request since it's basically a read stream
        request,
        [
          // Attach
          vhost(apiHost, cors(), bodyParse(), routes(
            bootContent.authService,
            bootContent.userService,
            bootContent.hashtiService,
            bootContent.customerService,
            bootContent.projectService,
            bootContent.timeService,
            envService,
            bootContent.log
          )),
          vhost(spaHost, staticRouter, staticContent("./build/spa")),
        ],
      );
      // Set http status code
      response.statusCode = result.code;
      // Set headers
      for (const key of Object.keys(result.headers)) {
        response.setHeader(key, result.headers[key]);
      }
      // If body is a readable stream. add http stream as pipe
      if (result.body instanceof stream.Readable) {
        result.body.pipe(response);
      } else {
        // Body is an object. Send whole body to response
        response.end(result.body);
      }

    }).listen(port, () => {
      // Create test user if not exists
      bootContent.userService.get("test@test.test").catch(async () => {
        const password = bootContent.hashtiService.create("test");
        await bootContent.userService.create("test@test.test", password, true, false);
      });

      console.log(`Running API on http://${apiHost}:${port}`);  // tslint:disable-line: no-console
      console.log(`Running SPA on http://${spaHost}:${port}`);  // tslint:disable-line: no-console
    });
  })();
}
