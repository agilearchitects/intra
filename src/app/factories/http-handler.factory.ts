// Libs
import { EnvService } from "@agilearchitects/env";
import { method, ServerModule, staticContent, vhost } from "@agilearchitects/server";
import * as http from "http";
import * as stream from "stream";

// DTO's
import { IDictionaryDTO } from "../../shared/dto/dictionary.dto";

// Factories
import { handlerFactory } from "./handler.factory";

export const httpHandlerFactory = async (envService: EnvService, apiHost: string, spaHost: string) => {
  // Register handlers
  const handlers = [
    // Attach API handlers
    ...(await handlerFactory(envService, apiHost)),
    // Attach SPA handlers
    vhost(spaHost, staticContent("./build/spa")),
  ];
  return async (request: http.IncomingMessage, response: http.ServerResponse): Promise<void> => {
    // Register handlers
    const result = await ServerModule.simpleHandle(
      // Parse request complete URL
      `${"encrypted" in request.connection ? "http" : "https"}://${request.headers.host}${request.url}`,
      // Make out http request method
      request.method !== undefined ? (method as any)[request.method] : method.GET,
      // Map headers
      Object.keys(request.headers).reduce((previousValue: IDictionaryDTO<string | string[]>, key: string) => {
        return {
          ...previousValue,
          ...((value?: string | string[]) => (value !== undefined ? { [key]: value } : undefined))(request.headers[key]),
        }
      }, {}),
      // Body is the complete request since it's basically a read stream
      request,
      handlers,
    );

    // Set http status code
    response.statusCode = result.code;
    // Set headers
    for (const key of Object.keys(result.headers)) {
      response.setHeader(key, result.headers[key]);
    }
    // If body is a readable stream. add http stream as pipe
    if (result.body instanceof stream.Readable) {
      result.body.pipe(response);
    } else {
      // Body is an object. Send whole body to response
      response.end(result.body);
    }
  }
}