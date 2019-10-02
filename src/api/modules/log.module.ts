import { LogModule as BaseLogModule } from "@agilearchitects/logmodule";

export class LogModule extends BaseLogModule {
  public constructor(
    name: string,
    outputToConsole: boolean = true,
  ) {
    super(name, "./logs", undefined, outputToConsole);
  }
}
