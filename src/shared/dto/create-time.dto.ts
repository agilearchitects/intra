import { jsonType } from "@agilearchitects/server";

// DTO's
import { IDictionaryDTO } from "./dictionary.dto";

export interface ICreateTimeDTO {
  taskId: number;
  from: string;
  to?: string;
  comment: string;
  userId: number;
  rate?: number;
  tags?: (string | number)[];
}

export class CreateTimeDTO {
  public static parseFromRequest(object: IDictionaryDTO<jsonType>): CreateTimeDTO {
    if (
      typeof object.taskId !== "number" ||
      typeof object.from !== "string" ||
      (object.to !== undefined && typeof object.to !== "string") ||
      typeof object.comment !== "string" ||
      typeof object.userId !== "number" ||
      (object.rate !== undefined && typeof object.rate !== "number") ||
      (object.tags !== undefined && !(object.tags instanceof Array))
    ) {
      throw new Error("Unable to parse");
    }
    return new CreateTimeDTO(
      object.taskId,
      object.from,
      object.to,
      object.comment,
      object.userId,
      object.rate,
      object.tags !== undefined ? object.tags.map((tag: jsonType) => {
        if (typeof tag !== "string" || typeof tag !== "number") {
          throw new Error("Unable to parse");
        }
        return tag;
      }) : undefined,
    );
  }
  public static parse(object: ICreateTimeDTO): CreateTimeDTO {
    return new CreateTimeDTO(
      object.taskId,
      object.from,
      (object.to !== undefined ? object.to : undefined),
      object.comment,
      object.userId,
      object.rate,
      object.tags,
    );
  }

  public constructor(
    public readonly taskId: number,
    public readonly from: string,
    public readonly to: string | undefined,
    public readonly comment: string,
    public readonly userId: number,
    public readonly rate?: number,
    public readonly tags?: (string | number)[],
  ) { }

  public serialize(): ICreateTimeDTO {
    return {
      taskId: this.taskId,
      from: this.from,
      ...(this.to !== undefined ? { to: this.to } : undefined),
      comment: this.comment,
      userId: this.userId,
      ...(this.rate !== undefined ? { rate: this.rate } : undefined),
      ...(this.tags !== undefined ? { tags: this.tags } : undefined),
    };
  }
}
