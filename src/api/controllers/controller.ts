// Libs
import * as changeCase from "change-case";
import { Response } from "express";

// Modules
import { LogModule } from "../modules/log.module";

export class Controller {
  public log: LogModule;
  public constructor(
    logModule: typeof LogModule = LogModule,
    changeCaseModule: typeof changeCase = changeCase,
  ) {
    this.log = new logModule(changeCaseModule.paramCase(this.constructor.name));
  }

  public logError(response: Response, message: string, error?: any, code: number = 500): void {
    this.log.error(message, ...(error !== undefined ? [{ error: JSON.stringify(error) }] : []));
    response.sendStatus(code);
  }
}
