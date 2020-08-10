// Libs
import { EnvService } from "@agilearchitects/env";
import * as ejs from "ejs";
import * as fs from "fs";

// Modules
import { EjsModule } from "../modules/ejs.module"

export const ejsModuleFactory = (envService: EnvService) => new EjsModule(ejs, fs,
  {
    baseUrl: {
      api: envService.get("BASE_API_URL", "http://api.test.test:1234"),
      spa: envService.get("BASE_SPA_URL", "http://www.test.test:1234")
    }
  });