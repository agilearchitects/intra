// Libs
import { EnvService } from "@agilearchitects/env"
import { MailingunService, MailService as BaseMailService } from "@agilearchitects/mailingun"
import * as changeCase from "change-case";
import * as fs from "fs";

// Services
import { MailService } from "../services/mail.service"

// Modules
import { EjsModule } from "../modules/ejs.module"

export const mailServiceFactory = (envService: EnvService, ejsModule: EjsModule): MailService => {
  return new MailService(new BaseMailService(new MailingunService(
    envService.get("MAILGUN_KEY", ""),
    envService.get("MAILGUN_DOMAIN", ""),
    envService.get("MAILGUN_HOST", ""),
  )),
    ejsModule, "storage/email-templates", "base-template.html.ejs", envService.get("MAIL_FROM", ""), fs, changeCase
  );
}