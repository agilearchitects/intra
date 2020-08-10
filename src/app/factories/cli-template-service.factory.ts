// Libs
import * as changeCase from "change-case";
import * as ejs from "ejs";
import * as fs from "fs";

// Modules
import { EjsModule } from "../modules/ejs.module";
import { RandomModule } from "../modules/random.module";

// Services
import { CliTemplateService } from "../services/cli-template.service";

export const cliTemplateServiceFactory = (): CliTemplateService => {
  return new CliTemplateService("./src/templates", fs, new EjsModule(ejs, fs), changeCase, RandomModule);
}