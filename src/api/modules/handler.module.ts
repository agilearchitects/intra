// Libs
import { HandlerModule as BaseHandlerModule, ResponseModule } from "@agilearchitects/server";

// Modules
import { RequestModule } from "./request.module";

export declare type handlerMethod = (handler: HandlerModule) => void;

export class HandlerModule extends BaseHandlerModule {
  public constructor(
    public readonly request: RequestModule,
    response: ResponseModule,
    next: (...handlerMethod: handlerMethod[]) => void,
  ) {
    super(request, response, next);
  }
}