// Libs
import { ServerModule } from "@agilearchitects/simplyserve";

import { boot, envService } from "./bootstrap";

// Routes
import { UserEntity } from "./api/entities/user.entity";
import { router } from "./api/routes";

(async () => {
  await boot();
  const port: number = parseInt(envService.get("PORT", "1234"), 10);
  const apiHost = envService.get("API_HOST", "api.test.test");
  const spaHost = envService.get("SPA_HOST", "www.test.test");
  const env = envService.get("ENV", "");
  await new ServerModule([
    {
      domain: apiHost,
      routes: router,
      corsConfig: "*",
    },
    ...(env === "local" ? [{
      domain: spaHost,
      staticPath: "build/spa",
      apiBaseUrl: apiHost,
    }] : []),
  ], port).start();
  if (["local", "dev"].indexOf(env) !== -1) {
    console.log(`Running API on http://${apiHost}:${port}`);  // tslint:disable-line: no-console
    if (env === "local") {
      console.log(`Running SPA on http://${spaHost}:${port}`);  // tslint:disable-line: no-console
    }
  }
})();
