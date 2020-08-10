import { jsonType } from "@agilearchitects/server";
import { IDictionaryDTO } from "./dictionary.dto";

export class DTO {
  public static parseArrayToDictionary(array: jsonType[]): IDictionaryDTO<jsonType>[] {
    return array.map((object: jsonType) => {
      if (object === null || (object instanceof Array) || typeof object !== "object") {
        throw new Error();
      } else {
        return object;
      }
    });
  }
}