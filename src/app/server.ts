import * as http from "http";

// Factories
import { serverFactory } from "./factories/apps/server.factory";


// Create http server and attach handler
(async () => {
  // Create server
  const server = await serverFactory();

  // Create http server
  http.createServer(server.httpHandler).listen(server.port, () => {
    console.log(`Running API on http://${server.apiHost}:${server.port}`);  // tslint:disable-line: no-console
    console.log(`Running SPA on http://${server.spaHost}:${server.port}`);  // tslint:disable-line: no-console
  });
})();
