// Libs
import { LogModule } from "@agilearchitects/logmodule";
import { HandlerModule } from "@agilearchitects/server";
import * as stream from "stream";

export class Controller {
  public constructor(
    protected readonly log: LogModule
  ) { }

  public logError(
    handler: HandlerModule,
    message: string,
    error?: any,
    code: number = 500,
  ): void {
    this.log.error({
      message,
      code,
      data: {
        ...(error !== undefined ? [{ error: JSON.stringify(error) }] : []),
        request: {
          url: handler.request.url,
          headers: handler.request.headers,
          body: handler.request.body instanceof stream.Readable ? undefined : handler.request.body,
        }
      }
    });
    handler.sendStatus(code);
  }
}
