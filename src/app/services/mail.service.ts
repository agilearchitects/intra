// Libs
import { MailService as BaseEmailService } from "@agilearchitects/mailingun";

// Modules
import { EjsModule } from "../modules/ejs.module";

// DTO's
import { DebugEmailDataDTO } from "../../shared/dto/debug-email-data.dto";
import { IDictionaryDTO } from "../../shared/dto/dictionary.dto";

interface IChangeCaseModule {
  paramCase(input: string): string;
}

interface IFsModule {
  readFileSync: (path: string, encoding: BufferEncoding) => string;
}

export interface IMessage {
  fromName?: string;
  fromEmail: string;
  date?: string;
  body: string;
  signature?: string;
}

export interface IEmailData {
  subject: string;
  message: string;
}

export class MailService {

  public constructor(
    private readonly mailService: BaseEmailService,
    private readonly ejsModule: EjsModule,
    private readonly templateBasePath: string,
    private readonly templateBaseFile: string,
    public readonly defaultMailFrom: string,
    private readonly fsModule: IFsModule,
    private readonly changeCaseModule: IChangeCaseModule,
  ) { }

  public async send(
    emailName: string,
    message: IMessage | IMessage[],
    to: string | string[],
    vars?: IDictionaryDTO<any>,
  ): Promise<void>;
  public async send(
    emailName: string,
    message: IMessage | IMessage[],
    to: string | string[],
    vars: IDictionaryDTO<any> | undefined,
    debug: true,
  ): Promise<DebugEmailDataDTO>;
  public async send(
    emailName: string,
    message: IMessage | IMessage[],
    to: string | string[],
    vars: IDictionaryDTO<any> = {},
    debug: boolean = false,
  ): Promise<void | DebugEmailDataDTO> {
    // Set messages to array
    if (!(message instanceof Array)) { message = [message]; }

    // Get email template data
    const emailTemplate = this.get(emailName);

    const emailData: DebugEmailDataDTO = DebugEmailDataDTO.parse({
      from: message[0].fromEmail,
      to,
      subject: emailTemplate.subject,
      // Render message
      content: this.renderThread(emailTemplate.message, message, vars),
    })

    // Return email data if only debug mode
    if (debug === true) { return emailData; }

    // Send email using first from email in messages
    await this.mailService.send(
      emailData.from,
      emailData.to,
      emailData.subject,
      emailData.content,
    );
  }

  private get(name: string): IEmailData {
    const sourceContent: string = this.fsModule.readFileSync(`${this.templateBasePath}/${this.changeCaseModule.paramCase(name)}.html.ejs`, "utf8");

    const subjectMatch: RegExpMatchArray | null = sourceContent
      .split("/n")[0]
      .match(/subject="(.+)" -->/);

    if (subjectMatch === null) { throw new Error(`Unable to get subject attribute from "${name}". Make sure first row of file contains "subject="SUBJECT""`); }

    return {
      subject: subjectMatch[1],
      message: sourceContent.split("\n").slice(1).join("\n"),
    };
  }

  private renderThread(email: string, messages: IMessage[], vars: IDictionaryDTO<any> = {}): string {
    vars = {
      ...(messages[0].fromName !== undefined ? { fromName: messages[0].fromName } : undefined),
      ...(messages[0].fromEmail !== undefined ? { fromEmail: messages[0].fromEmail } : undefined),
      ...(messages[0].date !== undefined ? { date: messages[0].date } : undefined),
      ...(messages[0].signature !== undefined ? { signature: messages[0].signature } : undefined),
      ...vars,
    }
    return this.ejsModule.fileToString(`${this.templateBasePath}/${this.templateBaseFile}`, {
      body: this.ejsModule.stringToString(email, vars),
      ...vars,
      ...(messages[1] !== undefined ? { nextMessage: this.renderThread(email, messages.splice(1), vars) } : undefined),
    });
  }
}