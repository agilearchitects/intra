import { TransformableInfo } from "logform";
import * as winston from "winston";
import { configService } from "../services/config.service";
import { helperService } from "../services/helpers.service";

export interface ILogMessage { title: string; message?: string; type?: logType; data?: any; }
export interface ILogArgument { title: string; message?: string; data?: any; }
export enum logType {
  INFO = "info",
  WARNING = "warn",
  ERROR = "error",
}

export class LogModule {
  private logger: winston.Logger;
  public constructor(name?: string);
  public constructor(
    name?: string,
    outputToConsole: boolean = true,
  ) {
    const format = [
      winston.format.timestamp(),
      winston.format.printf((info: TransformableInfo) =>
        `${helperService.dateFormat(new Date(info.timestamp))} - `
        + `${info.level}: ${info.message}${info.printData && info.data !== undefined ? ` - `
          + `DATA: ${JSON.stringify(info.data)}` : ""}`),
    ];
    this.logger = winston.createLogger({
      transports: [
        ...(outputToConsole ? [new winston.transports.Console({
          format: winston.format.combine(...[
            winston.format.colorize(),
            ...format,
          ]),
        })] : []),
        new winston.transports.File({
          dirname: configService.get("LOG_DUMP_PATH", "./log"),
          ...(name !== undefined ? { filename: `${name}.log` } : undefined),
          format: winston.format.combine(...[
            (() => {
              return { transform: (info: TransformableInfo) => { info.printData = true; return info; } };
            })(),
            ...format,
          ]),
        }),
      ],
    });
  }

  public info(log: ILogArgument | string): void {
    this.add({ ...this.parseLogArgument(log), ...{ type: logType.INFO } });
  }

  public warning(log: ILogArgument | string): void {
    this.add({ ...this.parseLogArgument(log), ...{ type: logType.WARNING } });
  }

  public error(log: ILogArgument | string): void {
    this.add({ ...this.parseLogArgument(log), ...{ type: logType.ERROR } });
  }

  /**
   * Public method to add log message. Will output to console if set to do so
   * @param log Log message
   */
  public add(log: ILogMessage | string): void {
    if (typeof log === "string") {
      log = { title: log };
    }
    if (log.type === undefined) { log.type = logType.INFO; }
    this.logger.log({
      level: log.type,
      message: this.printLogMessage(log),
      ...(log.data !== undefined ? { data: log.data } : undefined),
    });
  }

  public end(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.logger.on("close", () => {
        resolve();
      });
      this.logger.end();
    });
  }

  private parseLogArgument(info: ILogArgument | string): ILogArgument {
    if (typeof info === "string") {
      info = { title: info };
    }

    return info;
  }

  private printLogMessage(logMessage: ILogMessage): string {
    return `${logMessage.title}${logMessage.message !== undefined ? `: "${logMessage.message}"` : ``}`;
  }
}
