// Libs
import { bodyParse, cors, HandlerModule, headers, method, ResponseModule, RouterModule, ServerModule, staticContent, vhost } from "@agilearchitects/server";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as http from "http";
import * as stream from "stream";


// Modules

import { boot, envService, hashtiService, userService } from "./bootstrap";

// Routes
import { IDictionary } from "./modules/dictionary.module";
import { router } from "./routes";

const port: number = parseInt(envService.get("PORT", "1234"), 10);
const apiHost = envService.get("API_HOST", "api.test.test");
const spaHost = envService.get("SPA_HOST", "www.test.test");
const env = envService.get("ENV", "local");

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Boot sql connection
  await boot("production");
  // Handler request
  const server = new ServerModule();
  server.register(vhost(apiHost, cors(), bodyParse(), router));
  return await server.lambda(event);
};

if (env === "local") {
  (async () => {
    await boot("local");
    const server = new ServerModule();
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
          vhost(apiHost, cors(), bodyParse(), router),
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
      userService.get("test@test.test").catch(async () => {
        const password = hashtiService.create("test");
        await userService.create("test@test.test", password, true, false);
      });

      console.log(`Running API on http://${apiHost}:${port}`);  // tslint:disable-line: no-console
      console.log(`Running SPA on http://${spaHost}:${port}`);  // tslint:disable-line: no-console
    });
  })();
}
