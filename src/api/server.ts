// Libs
import { Server, ISPAApp, IAPIApp } from "simplyserveme";
import { createConnection } from "typeorm";

import { configService } from "./services/config.service";
import { router } from "./routes";

createConnection().then((_) => {
  const server = new Server([{
    domain: configService.get("API_HOST", "api.test.test"),
    routes: router,
    corsConfig: {
      origin: new RegExp(
        `^https?:\\/\\/${configService.get("SPA_HOST", "api.test.test")
          .replace(/\./g, "\\.")}(:\\d+$|$)`)
    },
  } as IAPIApp, {
    domain: configService.get("SPA_HOST", "www.test.test"),
    staticPath: "build/spa",
    apiBaseUrl: configService.get("API_HOST", "api..test.test"),

  } as ISPAApp], parseInt(configService.get("PORT", "1234"), 10));
  server.start();
}).catch((error) => console.log(error));
