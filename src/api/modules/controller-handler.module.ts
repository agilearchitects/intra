import { NextFunction, Request, RequestHandler, Response } from "express";
import { Dictionary } from "express-serve-static-core";

export interface IRequestBody {
  [key: string]: string | number | boolean | null | IRequestBody[] | IRequestBody[];
}

export interface IRequestParams {
  [key: string]: string;
}

export interface IRequestQuery {
  [key: string]: string;
}

export interface IResponseBody {
  [key: string]: string | number | boolean | null | IResponseBody[] | IResponseBody[];
}

export interface IRequest<B extends IRequestBody = any, P extends IRequestParams = any, Q extends IRequestQuery = any> extends Request {
  body: B;
  params: P;
  query: Q;
}

export interface IResponse<T> extends Response {
  json: (body?: T) => Response;
}

export const controller = (callback: (handler: ControllerHandler) => void): RequestHandler => {
  return (request: Request, response: Response, next: NextFunction): void => {
    callback(new ControllerHandler(request, response, next));
  };
};

export class ControllerHandler {
  public get request(): Request { return this._request; }
  public get next(): NextFunction { return this._next; }

  public constructor(
    private _request: Request,
    private _response: Response,
    private _next: NextFunction,
  ) { }

  public body<T>(): T { return this._request !== undefined ? this._request.body : {}; }
  public params<T extends Dictionary<string>>(): T { return (this._request !== undefined ? this._request.params : {}) as T; }
  public query<T>(): T { return this._request !== undefined ? this._request.query : {}; }
  public response<T>(): IResponse<T> {
    return this._response as IResponse<T>;
  }

  public sendStatus(code: number, message?: string) {
    if (message === undefined) {
      this._response.sendStatus(code);
    } else {
      this._response.status(code).send(message);
    }
  }
}
