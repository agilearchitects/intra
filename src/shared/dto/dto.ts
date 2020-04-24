import { jsonType } from "@agilearchitects/server";

export abstract class DTO<I> {
  public static parseFromRequest(object: jsonType): { [key: string]: jsonType } {
    if (object === null ||
      typeof object !== "object" ||
      (object instanceof Array)) {
      throw new Error("Object type could not be verified")
    }

    return object;
  }
  public static parse<D, I>(object: I): D {
    throw new Error("static method parse not implemented");
  }
  public abstract serialize(): I;
}
