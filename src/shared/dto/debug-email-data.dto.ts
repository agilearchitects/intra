// Libs
import { jsonType } from "@agilearchitects/server";

// DTO's
import { IDictionaryDTO } from "./dictionary.dto";

export interface IDebugEmailDataDTO {
  to: string | string[];
  from: string;
  subject: string;
  content: string;
}

export class DebugEmailDataDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): DebugEmailDataDTO {
    if (
      (
        typeof object.to !== "string" &&
        !(object.to instanceof Array) &&
        ((object.to instanceof Array) && object.to.every((to: any) => typeof to === "string"))
      ) ||
      typeof object.from !== "string" ||
      typeof object.subject !== "string" ||
      typeof object.content !== "string"
    ) {
      throw new Error("Unable to parse");
    }
    return DebugEmailDataDTO.parse({
      to: object.to as string | string[],
      from: object.from,
      subject: object.subject,
      content: object.content,
    });
  }

  public static parse(object: IDebugEmailDataDTO): DebugEmailDataDTO {
    return new this(
      object.to,
      object.from,
      object.subject,
      object.content,
    );
  }

  public constructor(
    public readonly to: string | string[],
    public readonly from: string,
    public readonly subject: string,
    public readonly content: string,
  ) { }

  public serialize(): IDebugEmailDataDTO {
    return {
      to: this.to,
      from: this.from,
      subject: this.subject,
      content: this.content,
    };
  }
}