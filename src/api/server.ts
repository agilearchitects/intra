// Libs
import { ServerModule, APIAppModule, SPAAppModule } from "@agilearchitects/simplyserve";

import { boot, envService, hashtiService, userService } from "./bootstrap";

// Routes
import { router } from "./routes";

(async () => {
  await boot();
  const port: number = parseInt(envService.get("PORT", "1234"), 10);
  const apiHost = envService.get("API_HOST", "api.test.test");
  const spaHost = envService.get("SPA_HOST", "www.test.test");
  const env = envService.get("ENV", "");
  await new ServerModule([new APIAppModule(
    apiHost,
    router,
    "*",
  ),
  ...(env === "local" ? [new SPAAppModule(
    spaHost,
    "build/spa",
    `http://${apiHost}:${port}`,
  )] : []),
  ], port).start();
  if (["local", "dev"].indexOf(env) !== -1) {
    // Create test user if not exists
    userService.get("test@test.test").catch(async () => {
      const password = hashtiService.create("test");
      await userService.create("test@test.test", password, true, false);
    });

    console.log(`Running API on http://${apiHost}:${port}`);  // tslint:disable-line: no-console
    if (env === "local") {
      console.log(`Running SPA on http://${spaHost}:${port}`);  // tslint:disable-line: no-console
    }
  }
})();
