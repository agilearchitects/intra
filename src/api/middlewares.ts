// Libs
import Axios from "axios";
import { NextFunction, Request, RequestHandler, Response } from "express";

import ValidationErrorModule from "./modules/validation-error.module";
import { IValidationInput, validate } from "./modules/validation.module";

// Models
import { UserEntity } from "./entities/user.entity";
import { LogModule } from "./modules/log.module";
import { configService } from "./services/config.service";

// Add User to express request interface
declare global {
    namespace Express {
        interface Request { // tslint:disable-line:interface-name
            user: UserEntity;
        }
    }
}

export const middleware = (middlewares: RequestHandler | RequestHandler[]) =>
    (target: any, propertyKey: string, descriptor: PropertyDescriptor): void => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            if (!(middlewares instanceof Array)) { middlewares = [middlewares]; }
            return [...middlewares, originalMethod.apply(this, ...args)];
        };
    };

export class Middlewares {
    public constructor(
        private log: LogModule = new LogModule("middleware"),
    ) { }
    public auth(checkOnly: boolean = false): RequestHandler {
        return (request: Request, response: Response, next: NextFunction): void => {
            // Check for authorization header
            if (request.headers.authorization) {
                // Extract token from header
                const token = (request.headers.authorization as string).substr(8, request.headers.authorization.length);
                // Decode token
                UserEntity.check(token).then((user: UserEntity) => {
                    request.user = user;
                    next();
                }).catch((error: any) => response.sendStatus(401));
            } else if (checkOnly) {
                // Continue request if only checking if authenticated
                next();
            } else {
                response.sendStatus(400);
            }
        };
    }

    public userByEmail(): RequestHandler {
        return (request: Request, response: Response, next: NextFunction): void => {
            if (request.query.email) {
                UserEntity.findOne({ where: { email: request.query.email } }).then((user?: UserEntity) => {
                    if (user !== undefined) {
                        request.user = user;
                        next();
                    } else {
                        response.sendStatus(401);
                    }
                }).catch(() => response.sendStatus(500));
            }
        };
    }

    public guest(): RequestHandler {
        return (request: Request, response: Response, next: NextFunction): void => {
            if (!request.headers.authorization) {
                next();
            } else {
                response.sendStatus(400);
            }
        };
    }

    public validation(validation: IValidationInput): RequestHandler {
        return (request: Request, response: Response, next: NextFunction): void => {

            const getAsObject = (validation: IValidationInput, requestData: any): any => {
                return Object.assign({}, ...Object.keys(validation).map((key: string) => {
                    const returnValue: { [key: string]: any } = {};
                    const temp = validation[key];
                    const scopedRequestData: any =
                        requestData !== undefined && requestData[key] !== undefined
                            ? requestData[key]
                            : undefined;
                    if (!(temp instanceof Array) && typeof temp !== "function") {
                        returnValue[key] = getAsObject(
                            temp,
                            requestData !== undefined && requestData[key] !== undefined
                                ? requestData[key]
                                : undefined,
                        );
                    } else {
                        returnValue[key] = scopedRequestData;
                    }
                    return returnValue;
                }));
            };
            const requestData = request.method === "GET" ? request.query : request.body;
            const data = getAsObject(validation, requestData);
            validate(data, validation, request, response)
                .then((result: boolean | ValidationErrorModule) => {
                    if (typeof result === "boolean") {
                        if (result) { next(); } else { response.status(400).json({ message: "Validation failed" }); }
                    } else {
                        response.status(400).json({ validationError: result });
                    }
                }).catch((error: any) => response.sendStatus(500));
        };
    }

    public token(): RequestHandler {
        return (request: Request, response: Response, next: NextFunction): void => {
            const token = configService.get("TOKEN", "");
            if (token !== "" && request.query.token && request.query.token === token) {
                next();
            } else {
                this.log.info({
                    title: "Token middleware validation failed",
                    data: {
                        ip: request.ip,
                        headers: request.headers,
                    },
                });
                response.sendStatus(400);
            }
        };
    }

    public reCaptchaToken(): RequestHandler {
        return (request: Request, response: Response, next: NextFunction): void => {
            const token = request.headers.recaptcha;
            Axios.post("https://www.google.com/recaptcha/api/siteverify", {
                secret: configService.get("GOOGLE_RECAPTCHA_SECRET"),
                response: token,
                remoteip: request.ip,
            }).then(() => next()).catch((error: any) => {
                this.log.error(({
                    title: "ReCaptcha middleware failed",
                    data: {
                        ip: request.ip,
                        headers: request.headers,
                    },
                }));
                response.sendStatus(500);
            });
        };
    }
}

export const middlewares = new Middlewares();
