// Libs
import { HandlerModule as BaseHandlerModule, IDictionary, ResponseModule } from "@agilearchitects/server";

// Modules
import { RequestModule } from "./request.module";

export declare type handlerMethod = (handler: HandlerModule) => void;

export class HandlerModule<BODY = any, PARAMS extends IDictionary<string> = any, QUERY extends IDictionary<string | string[]> = any> extends BaseHandlerModule<BODY, PARAMS, QUERY> {
  public constructor(
    public readonly request: RequestModule,
    response: ResponseModule,
    next: (...handlerMethod: handlerMethod[]) => void,
  ) {
    super(request, response, next);
  }
}