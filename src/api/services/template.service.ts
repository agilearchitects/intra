import * as changeCase from "change-case";
import * as ejs from "ejs";
import * as fs from "fs";
import * as path from "path";
import { ServiceModule } from "simplyserveme";

const BASE_PATH = path.resolve(__dirname, "../../../storage/email-templates");

export class TemplateService extends ServiceModule {
  public email(name: string, vars: { [key: string]: string }): { subject: string, message: string } {
    return {
      subject: ejs.render(fs.readFileSync(path.resolve(BASE_PATH,
        `${changeCase.paramCase(name)}-subject.txt.ejs`), "utf8"),
        vars),
      message: ejs.render(fs.readFileSync(path.resolve(BASE_PATH,
        `${changeCase.paramCase(name)}.html.ejs`), "utf8"),
        vars),
    };
  }
}

export const templateService: TemplateService = TemplateService.getInstance<TemplateService>();
