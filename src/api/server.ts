// Libs
import { bodyParse, cors, HandlerModule, IDictionary, method, RouterModule, ServerModule, SimpleResponseModule, staticContent, vhost } from "@agilearchitects/server";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// Modules
import { LambdaRequestModule } from "./modules/lambda-request.module";
import { RequestModule } from "./modules/request.module";

import { boot, envService, hashtiService, userService } from "./bootstrap";

// Routes
import { router } from "./routes";

const port: number = parseInt(envService.get("PORT", "1234"), 10);
const apiHost = envService.get("API_HOST", "api.test.test");
const spaHost = envService.get("SPA_HOST", "www.test.test");
const env = envService.get("ENV", "local");

export const handler = (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return new Promise(async (resolve, reject) => {
    await boot();
    const server = new ServerModule({ useServer: false });
    server.use(cors(), bodyParse(), router);
    const request: LambdaRequestModule = new LambdaRequestModule(
      event.body !== null ? event.body : "",
      event.path,
      event.httpMethod,
      event.multiValueQueryStringParameters !== null ? event.multiValueQueryStringParameters : {},
      event.multiValueHeaders,
      parseInt(event.headers["X-Forwarded-Port"], 10),
    );
    server.trigger(request, new SimpleResponseModule(request, (response: SimpleResponseModule) => {
      const headers = response.getHeaders();
      resolve({
        statusCode: response.statusCode,
        multiValueHeaders: Object.keys(response.getHeaders()).reduce((previousValue: IDictionary<(number | string)[]>, key: string) => {
          const header = headers[key];
          if (header === undefined) {
            return { ...previousValue };
          }
          return {
            ...previousValue,
            [key]: !(header instanceof Array) ? [header] : header
          };
        }, {}),
        body: response.data,
      });
    }));
  });
};

if (env === "local") {
  (async () => {
    await boot();
    // Creating local server
    const server = new ServerModule({ useServer: { requestModule: RequestModule } });
    server.use(vhost(apiHost, cors(), bodyParse(), router));

    const staticRouter = new RouterModule();
    staticRouter.any("api_base_url", [method.HEAD], "", (handler: HandlerModule) => {
      handler.send("", 200, {
        "api_base_url": `http://${apiHost}:${port}`,
      });
    });

    server.use(vhost(spaHost, staticRouter, staticContent("./build/spa")));
    await server.listen(port, () => {
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
