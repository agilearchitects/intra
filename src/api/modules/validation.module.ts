import { Request, Response } from "express";
import moment from "moment";
import { helperService } from "../services/helpers.service";
import ValidationErrorModule from "./validation-error.module";

export type validation<T extends string | number | boolean> = (
  value: T,
  request: Request, response: Response,
) => boolean | Promise<boolean>;

export default class ValidationModule {
  public static date = (format: string | null = null): validation<string> => (value: string): boolean => {
    return moment(value, format !== null ? format : undefined).isValid();
  }

  public static email = (value: string): boolean => {
    return (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value); // tslint:disable-line:max-line-length
  }

  public static max = (max: number): validation<string | number> => (value: string | number): boolean => {
    if (typeof value === "number" || Number(value)) { return Number(value) <= max; }
    return value.length <= max;
  }

  public static min = (min: number): validation<string | number> => (value: string | number): boolean => {
    if (typeof value === "number" || Number(value)) { return Number(value) >= min; }
    return value.length >= min;
  }

  public static required = (value: string | number | boolean | undefined): boolean => {
    if ((typeof value === "string" && value.length < 0) || value === undefined) {
      return false;
    }

    return true;
  }

  public static number = (value: string | number): boolean => {
    return typeof value === "number" || helperService.isDecimal(value);
  }
}

export interface IValidationValue { [key: string]: IValidationValue | string | number | boolean; }
export interface IValidationInput { [key: string]: IValidationInput | validation<any> | Array<validation<any>>; }

export const validate = (
  value: IValidationValue | string | number | boolean,
  validation: IValidationInput | validation<any> | Array<validation<any>>,
  request: Request, response: Response,
): Promise<boolean | ValidationErrorModule> => {
  const isSimple = (value: IValidationValue | string | number | boolean) => {
    return ["string", "number", "boolean"].indexOf(typeof value) !== -1 ? true : false;
  };

  return new Promise((resolve, reject) => {
    if (!isSimple(value) && !(validation instanceof Array) && typeof validation !== "function") {
      // (value as IValidationValue).
      Promise.all<boolean | ValidationErrorModule>(
        Object.keys(value).map(
          (valueName: string) => validation[valueName] !== undefined ?
            new Promise(
              (resolve, reject) => validate(
                (value as IValidationValue)[valueName],
                validation[valueName],
                request,
                response,
              ).then((result: boolean | ValidationErrorModule) => {
                if (typeof result !== "boolean") {
                  result.propertyName = valueName;
                  resolve(result);
                } else if (!result) {
                  resolve(new ValidationErrorModule({ propertyName: valueName }));
                } else {
                  resolve(result);
                }
              }).catch((error: any) => reject(error))) : new Promise((resolve) => resolve()),
        )).then((results: Array<boolean | ValidationErrorModule>) => {
          const validationError = results.find(
            (result: boolean | ValidationErrorModule) => typeof result !== "boolean",
          );
          resolve(validationError !== undefined ? validationError : true);
        }).catch((error: any) => reject(error));
    } else if (isSimple(value) && validation instanceof Array) {
      Promise.all<boolean | ValidationErrorModule>(
        validation.map(
          (validation: validation<any>) => new Promise(
            (resolve, reject) => validate(
              value,
              validation,
              request,
              response,
            ).then(
              (result: boolean | ValidationErrorModule) => {
                if (typeof result !== "boolean") {
                  result.validationName = validation.name;
                  result.value = value as string | number | boolean;
                  resolve(result);
                } else if (!result) {
                  resolve(new ValidationErrorModule(
                    { validationName: validation.name, value: value as string | number | boolean },
                  ));
                } else {
                  resolve(result);
                }
              }).catch((error: any) => reject(error))),
        )).then((results: Array<boolean | ValidationErrorModule>) => {
          const validationError = results.find(
            (result: boolean | ValidationErrorModule) => typeof result !== "boolean",
          );
          resolve(validationError !== undefined ? validationError : true);
        }).catch((error: any) => reject(error));
    } else if (isSimple(value) && typeof validation === "function") {
      const validationResult = validation(value as string | number | boolean, request, response);

      const callback = (result: boolean | ValidationErrorModule) => resolve(result);

      if (validationResult instanceof Promise) {
        validationResult.then((result: boolean | ValidationErrorModule) => {
          callback(result);
        }).catch((error: any) => reject(error));
      } else {
        callback(validationResult);
      }
    } else {
      reject(new Error("Validation failed"));
    }

  });

};
