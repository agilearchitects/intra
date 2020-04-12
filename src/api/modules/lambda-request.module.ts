import { IDictionary, RequestModule } from "@agilearchitects/server";
import { Socket } from "net";

export class LambdaRequestModule extends RequestModule {
  public constructor(
    public readonly body: string,
    public readonly url: string,
    public readonly method: string,
    public readonly query: IDictionary<string | string[]>,
    public readonly headers: IDictionary<string | string[]>,
    public readonly port: number,
  ) {
    super(new Socket());
  }
}