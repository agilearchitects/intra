// Libs
import { LogModule } from "@agilearchitects/logmodule";
import { handlerMethod, HandlerModule, RouterModule } from "@agilearchitects/server";

// Base controller
import { Controller } from "./controller";

export class RouterController extends Controller {
  public index(router: RouterModule): handlerMethod {
    return async (handler: HandlerModule) => {
      try {
        handler.sendJSON(router.generateAPIDocumentation());
      } catch (error) {
        this.logError(handler, "Index error", error);
        throw error;
      }
    }
  }
}