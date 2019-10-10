import { IDictionary } from "..";
export abstract class DTO<I> {
  public static parse<D, I>(object: I): D {
    throw new Error("static method parse not implemented");
  }
  public abstract serialize(): I;
}
