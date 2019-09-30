// Libs
import { EnvService } from "@agilearchitects/env";
import { HashtiService } from "@agilearchitects/hashti";
import { JWTService } from "@agilearchitects/jwt";
import { MailingunService } from "@agilearchitects/mailingun";
import { IAPIApp, ISPAApp, ServerModule } from "@agilearchitects/simplyserve";
import { dpService } from "@agilearchitects/tdi";
import { TemplateService } from "@agilearchitects/templategenerator";
import { createConnection } from "typeorm";

// Setting container
const envService = dpService.container("service.env", new EnvService());
dpService.container("service.jwt", new JWTService(envService.get("TOKEN", Math.random().toString())));
dpService.container("service.mailingun", new MailingunService(
  envService.get("MAILGUN_KEY", ""),
  envService.get("MAILGUN_DOMAIN", ""),
  envService.get("MAILGUN_HOST", "")),
);
dpService.container("service.template", new TemplateService("../storage/email-templates"));
dpService.container("service.hashti", new HashtiService());

// Routes
import { router } from "./api/routes";

(async () => {
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
