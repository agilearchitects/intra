import mailgunJS from "mailgun-js";
import { ServiceModule } from "simplyserveme";
import { configService } from "./config.service";

export class MailgunService extends ServiceModule {
  public constructor(
    private mailgun = mailgunJS({
      apiKey: configService.get("MAILGUN_KEY"),
      domain: configService.get("MAILGUN_DOMAIN"),
      host: "api.eu.mailgun.net",
    }),
  ) {
    super();
  }

  public send(from: string, to: string | string[], subject: string, html: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.mailgun.messages().send({ from, to, subject, html }, (error: any, body: mailgunJS.messages.SendResponse) => {
        if (error) { reject(error); return; }
        resolve();
      });
    });
  }
}

export const mailgunService: MailgunService = MailgunService.getInstance<MailgunService>();
