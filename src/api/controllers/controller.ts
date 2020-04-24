// Libs
import { listners, LogModule } from "@agilearchitects/logmodule";
import { HandlerModule } from "@agilearchitects/server";
import * as changeCase from "change-case";

export class Controller {
  public constructor(
    protected log: LogModule
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
      ...(error !== undefined ? [{ error: JSON.stringify(error) }] : []),
    });
    handler.sendStatus(code);
  }
}
