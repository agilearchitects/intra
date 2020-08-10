// Libs
import { LogModule } from "@agilearchitects/logmodule";
import { handlerMethod, HandlerModule } from "@agilearchitects/server";

// Modules
import { PackageJsonReaderModule } from "../modules/package-json-reader.module";

// Base controller
import { Controller } from "./controller";

export class VersionController extends Controller {
  public constructor(
    private readonly packageJsonReaderModule: PackageJsonReaderModule,
    log: LogModule,
  ) { super(log); }
  public index(): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        handler.sendJSON({ "version": this.packageJsonReaderModule.get().version });
      } catch (error) {
        this.logError(handler, "Error getting version", error);
        throw error;
      }
    }
  }
}